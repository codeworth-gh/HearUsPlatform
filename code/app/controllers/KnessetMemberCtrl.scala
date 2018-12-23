package controllers

import java.nio.file.attribute.PosixFilePermission._
import java.nio.file.{CopyOption, Files, Paths, StandardCopyOption}
import java.sql.Timestamp
import java.util.Calendar

import be.objectify.deadbolt.scala.{DeadboltActions, allOfGroup}
import javax.inject.Inject
import models._
import dataaccess._
import play.api.{Configuration, Logger}
import play.api.data.{Form, _}
import play.api.data.Forms._
import play.api.i18n._
import play.api.libs.json.{JsError, Json}
import play.api.mvc.{ControllerComponents, InjectedController}
import dataaccess.JSONFormats._
import play.api.libs.ws.WSClient

import scala.collection.JavaConversions._
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.Future

case class GroupData(id:Long, name:String, knessetKey:Long, kmsIds:String)

class KnessetMemberCtrl @Inject()(deadbolt:DeadboltActions, cc:ControllerComponents, kms:KnessetMemberDAO,
                                  images: ImagesDAO, groups: KmGroupDAO, langs:Langs, messagesApi:MessagesApi,
                                  conf:Configuration, ws:WSClient) extends InjectedController {

  implicit private val ec = cc.executionContext
  implicit val messagesProvider: MessagesProvider = {
    MessagesImpl(langs.availables.head, messagesApi)
  }

  val knessetMemberForm = Form(
    mapping(
      "id" -> number.transform[Long](_.asInstanceOf[Long], _.asInstanceOf[Int]),
      "name" -> nonEmptyText,
      "gender" -> text,
      "isActive" -> boolean,
      "webPage" -> text,
      "partyId" -> number.transform[Long](_.asInstanceOf[Long], _.asInstanceOf[Int]),
      "knessetKey" -> number.transform[Long](_.asInstanceOf[Long], _.asInstanceOf[Int])
    )(KnessetMember.apply)(KnessetMember.unapply)
  )

  val groupForm = Form(
    mapping(
      "id" -> number.transform[Long](_.asInstanceOf[Long], _.asInstanceOf[Int]),
      "name" -> nonEmptyText,
      "knessetKey" -> number.transform[Long](_.asInstanceOf[Long], _.asInstanceOf[Int]),
      "kmsIds" -> text
    )(GroupData.apply)(GroupData.unapply)
  )

  def showParties = deadbolt.SubjectPresent()() { implicit req =>
    for {
      parties <- kms.getAllParties
    } yield {
      Ok(views.html.knesset.parties(parties.sortBy(_.name)))
    }
  }

  def showKms(search: Option[String], asc: Option[String], sortByOpt: Option[String]) = deadbolt.SubjectPresent()() { implicit req =>
    val effectiveSearch = search.map(_.trim).flatMap(v => if (v.isEmpty) None else Some(v))
    val sortBy: SortBy.Value = sortByOpt.flatMap(v => SortBy.values.find(_.toString == v)).getOrElse(SortBy.KnessetMember)
    val sqlSearch = search.map(s => "%" + s.trim + "%")
    val isAsc = asc.getOrElse("1") == "1"
    for {
      knessetMembers <- kms.getKms(sqlSearch, isAsc, sortBy)
      parties <- kms.getAllParties
    } yield {
      val partyMap = parties.map(p => p.id -> p).toMap
      Ok(views.html.knesset.knessetMembers(knessetMembers, effectiveSearch, isAsc, sortBy))
    }
  }

  def showNewKM() = deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))() { implicit req =>
    for {
      parties <- kms.getAllParties
    } yield {
      Ok(views.html.knesset.knessetMemberEditor(knessetMemberForm, conf.get[String]("hearUs.files.mkImages.url"), None,
        parties.map(p => (p.id, p.name)).toMap, Platform.values.toSeq))
    }
  }

  def showEditKM(id: Long) = deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))(){ implicit req =>
    for {
      km <- kms.getKM(id)
      parties <- kms.getAllParties
      imageOpt <- images.getImageForKm(id)
    } yield {
      km.map(m => Ok(views.html.knesset.knessetMemberEditor(knessetMemberForm.fill(m),
        conf.get[String]("hearUs.files.mkImages.url"), imageOpt,
        parties.map(p => (p.id, p.name)).toMap, Platform.values.toSeq)))
        .getOrElse(NotFound("Knesset member with id " + id + "does not exist"))
    }
  }

  def doEditKM() = deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))(){ implicit req =>
    knessetMemberForm.bindFromRequest().fold(
      formWithErrors => {
        for {
          knessetMembers <- kms.getAllKms
          parties <- kms.getAllParties
          imageOpt <- images.getImageForKm(formWithErrors.data("id").toLong)
        } yield {
          Logger.info(formWithErrors.errors.mkString("\n"))
          val partyMap = parties.map(p => p.id -> p).toMap
          BadRequest(views.html.knesset.knessetMemberEditor(formWithErrors,
            conf.get[String]("hearUs.files.mkImages.url"), imageOpt,
            parties.map(p => (p.id, p.name)).toMap, Platform.values.toSeq))
        }
      },
      knessetMember => {
        val message = Informational(InformationalLevel.Success, Messages("knessetMember.update"))
        kms.addKM(knessetMember).map(newKm => Redirect(routes.KnessetMemberCtrl.showEditKM(newKm.id)).flashing(FlashKeys.MESSAGE -> message.encoded))
      }
    )
  }

  def deleteKM(id: Long) = deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))(){ implicit req =>
    for {
      deleted <- kms.deleteKM(id)
      knessetMembers <- kms.getKms(None, true, SortBy.KnessetMember)
      parties <- kms.getAllParties
    } yield {
      val partyMap = parties.map(p => p.id -> p).toMap
      Ok(views.html.knesset.knessetMembers(knessetMembers, None, true, SortBy.KnessetMember)).flashing(FlashKeys.MESSAGE -> messagesProvider.messages("knessetMember.deleted"))
    }
  }

  def getContactOptionForKm(id: Long) = deadbolt.SubjectPresent()() { implicit req =>
    kms.getContactOptions(id).map(cos => Ok(Json.toJson(cos)))
  }

  def updateContactOption(id: Long) = deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))(cc.parsers.tolerantJson){ implicit req =>
    req.body.validate[Seq[ContactOption]].fold(
      errors => Future(BadRequest(Json.obj("status" -> "error", "data" -> JsError.toJson(errors)))),
      cos => {
        kms.addContactOption(cos).map(ans => Ok(Json.toJson(ans)))
      }
    )
  }

  def updateParty() = deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))(cc.parsers.tolerantJson){ implicit req =>
    req.body.validate[Party].fold(
      errors => {
        for {
          parties <- kms.getAllParties
        } yield {
          Logger.info(errors.mkString("\n"))
          BadRequest(views.html.knesset.parties(parties))
        }
      },
      party => {
        kms.addParty(party).map(newP => Ok(Json.toJson(newP)))
      }
    )
  }

  def deleteParty(id: Long) = deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))(){ implicit req =>
    for {
      deleted <- kms.deleteParty(id)
      parties <- kms.getAllParties
    } yield {
      Ok(views.html.knesset.parties(parties))
    }
  }

  def doAddImage(kmId: Long, subjectType:String) = deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))(cc.parsers.multipartFormData){ implicit req =>
    val file = req.body.file("imageFile")
    val imageCredit = req.body.dataParts.getOrElse("imageCredit", Seq[String]()).headOption.getOrElse("")

    if (file.isEmpty || file.get.filename.isEmpty) {
      // no file, but we might be able to update the image credit.
      images.getImageForKm(kmId).flatMap({
        case Some(imageRec) => {
          val updated = imageRec.copy(credit = imageCredit)
          images.storeImage(updated).map(_ => {
            val message = Informational(InformationalLevel.Success, Messages("knessetMemberEditor.imageCreditUpdated"))
            Redirect(routes.KnessetMemberCtrl.showEditKM(kmId)).flashing(FlashKeys.MESSAGE -> message.encoded)
          })
        }
        case None => {
          val message = Informational(InformationalLevel.Danger, Messages("knessetMemberEditor.imageFileMissing"))
          Future(Redirect(routes.KnessetMemberCtrl.showEditKM(kmId)).flashing(FlashKeys.MESSAGE -> message.encoded))
        }
      })

    } else {
      // We have a file. Update all.
      val filePart = file.get
      val folderPath = Paths.get(conf.get[String]("hearUs.files.mkImages.folder"))
      if (!Files.exists(folderPath)) {
        Files.createDirectories(folderPath)
        Files.setPosixFilePermissions(folderPath, Set(OWNER_READ, OWNER_WRITE, OWNER_EXECUTE, GROUP_READ, GROUP_EXECUTE, OTHERS_READ))
      }
      val i = filePart.filename.lastIndexOf('.')
      val suffix = if (i >= 0) filePart.filename.substring(i + 1) else ""
      val filePathTemp = folderPath.resolve(kmId.toString + ".-temp-." + suffix)
      val filePath = folderPath.resolve(kmId.toString + "." + suffix)
      filePart.ref.moveTo(filePathTemp, replace = true)
      Files.copy(filePathTemp, filePath, StandardCopyOption.REPLACE_EXISTING)
      Files.delete(filePathTemp)
      Files.setPosixFilePermissions(filePath, Set(OWNER_READ, OWNER_WRITE, OWNER_EXECUTE, GROUP_READ, GROUP_EXECUTE, OTHERS_READ))

      val imageRec = KMImage(-1L, Some(kmId), None, suffix,
        filePart.contentType.getOrElse(""),
        new Timestamp(Calendar.getInstance().getTime.getTime),
        imageCredit)
      images.storeImage(imageRec).map(_ => {
        val message = Informational(InformationalLevel.Success, Messages("knessetMemberEditor.imageFileUploaded"))
        Redirect(routes.KnessetMemberCtrl.showEditKM(kmId)).flashing(FlashKeys.MESSAGE -> message.encoded)
      })
    }
  }

  def getImage(imageName: String) = Action.async { implicit req =>
    val kmId = imageName.split("\\.")(0)

    images.getImageForKm(kmId.toInt).map({
      case Some(img) => {
        val path = Paths.get(conf.get[String]("hearUs.files.mkImages.folder")).resolve(imageName)
        Ok(Files.readAllBytes(path)).as(img.mimeType)
      }
      case None => NotFound("Can't find image.")
    })
  }

  def showGroups = deadbolt.SubjectPresent()() { implicit req =>
    for {
      groupList <- groups.allGroupsDN
    } yield {
      Ok(views.html.knesset.groups(groupList))
    }
  }

  def showNewGroup = deadbolt.SubjectPresent()() { implicit req =>
    for {
      knessetMembers <- kms.getAllKms
    } yield {
      Ok(views.html.knesset.groupEditor(groupForm, knessetMembers))
    }
  }

  def showEditGroup(id: Long) =  deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))(){ implicit req =>
    for {
      groupOpt <- groups.getGroupDN(id)
      groupKms <- groups.getKmForGroup(id)
      knessetMembers <- kms.getAllKms
    } yield {
      groupOpt match {
        case Some(g) => Ok(views.html.knesset.groupEditor(groupForm.fill(GroupData(g.id, g.name, g.knessetKey, groupKms.mkString(","))),
          knessetMembers.sortBy(_.name)))
        case None => NotFound("Group with id " + id + "does not exist")
      }
    }
  }

  def doEditGroup = deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))(){ implicit req =>
    groupForm.bindFromRequest().fold(
      formWithErrors => {
        for {
          knessetMembers <- kms.getAllKms
        } yield {
          Logger.info(formWithErrors.errors.mkString("\n"))
          BadRequest(views.html.knesset.groupEditor(formWithErrors, knessetMembers))
        }
      },
      data => {
        val insGroup = if (data.kmsIds == "") KmGroups(data.id, data.name, data.knessetKey, Set[Long]()) else {
          KmGroups(data.id, data.name, data.knessetKey, data.kmsIds.split(",", -1).map(id => id.toLong).toSet)
        }
        groups.addGroup(insGroup).map { group =>
          val message = Informational(InformationalLevel.Success, Messages("groupEditor.savedSuccessfully", group.name))
          Redirect(routes.KnessetMemberCtrl.showGroups()).flashing(FlashKeys.MESSAGE -> message.encoded)
        }
      }
    )
  }

  def deleteGroup(id: Long) = deadbolt.Restrict(allOfGroup(UserRole.Admin.toString))(){ implicit req =>
    for {
      deleted <- groups.deleteGroup(id)
      groups <- groups.allGroupsDN
    } yield {
      Ok(views.html.knesset.groups(groups))
    }
  }
}