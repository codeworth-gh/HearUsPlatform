package controllers

import java.util.concurrent.TimeUnit

import dataaccess.SettingsDAO
import javax.inject._
import models.SettingKey
import play.api._
import play.api.cache.Cached
import play.api.i18n.{I18nSupport, Langs, MessagesApi}
import play.api.libs.json.{JsObject, Json}
import play.api.mvc._
import views.PaginationInfo

import scala.concurrent.ExecutionContext
import scala.concurrent.duration.Duration

/**
  * This controller creates an `Action` to handle HTTP requests to the
  * application's home page.
  */

class HomeCtrl @Inject()( cc: ControllerComponents, cached:Cached,
                          settings: SettingsDAO,
                          conf:Configuration
                        ) extends AbstractController(cc) with I18nSupport {
  implicit val cnf:Configuration = conf
  implicit val ec:ExecutionContext = cc.executionContext
  private val logger = Logger( classOf[HomeCtrl] )
  
  def index() = cached(_=>SettingKey.HOME_PAGE_TEXT.toString, Duration(30, TimeUnit.SECONDS)) {
    Action.async { implicit request: Request[AnyContent] =>
      logger.info("Creating front page")
      for {
        stg <- settings.get( SettingKey.HOME_PAGE_TEXT )
      } yield {
        Ok(views.html.publicIndex(stg.map(_.value)))
      }
  }}
  
  /**
    * Routes for the front-end.
    * @return
    */
  def frontEndRoutes = Action { implicit request =>
      Ok(
        routing.JavaScriptReverseRouter("feRoutes")(
          routes.javascript.UserCtrl.showSignupPage,
          routes.javascript.CampaignMgrCtrl.createCampaign,
          routes.javascript.UserCtrl.showSignupPageForNewCampaign,
          routes.javascript.CampaignPublicCtrl.doReportAsOffensive,
          routes.javascript.CampaignPublicCtrl.apiReportInteraction
        )).as("text/javascript")
  }
  
  
  /**
    * Routes for the back-end.
    * @return
    */
  def backEndRoutes =
    Action { implicit request =>
      Ok(
        routing.JavaScriptReverseRouter("beRoutes")(
          routes.javascript.Assets.versioned,
          routes.javascript.CampaignAdminCtrl.apiPutFrontPageData,
          routes.javascript.UserCtrl.apiAddUser,
          routes.javascript.UserCtrl.apiReInviteUser,
          routes.javascript.UserCtrl.apiDeleteInvitation,
          routes.javascript.UserCtrl.updateRole,
          routes.javascript.FilesCtrl.apiAddFile,
          routes.javascript.FilesCtrl.apiFilesForKm,
          routes.javascript.FilesCtrl.apiGetImage,
          routes.javascript.KnessetMemberCtrl.showEditKM,
          routes.javascript.KnessetMemberCtrl.doEditKM,
          routes.javascript.KnessetMemberCtrl.deleteKM,
          routes.javascript.KnessetMemberCtrl.getContactOptionForKm,
          routes.javascript.KnessetMemberCtrl.updateContactOption,
          routes.javascript.KnessetMemberCtrl.updateParty,
          routes.javascript.KnessetMemberCtrl.deleteParty,
          routes.javascript.KnessetMemberCtrl.showKms,
          routes.javascript.KnessetMemberCtrl.showGroups,
          routes.javascript.KnessetMemberCtrl.showEditGroup,
          routes.javascript.KnessetMemberCtrl.showNewGroup,
          routes.javascript.KnessetMemberCtrl.doEditGroup,
          routes.javascript.KnessetMemberCtrl.deleteGroup,
          routes.javascript.ParseCtrl.apiKms,
          routes.javascript.ParseCtrl.apiUpdateCommittees,
          routes.javascript.CampaignPublicCtrl.index,
          routes.javascript.CampaignAdminCtrl.getCampaigners,
          routes.javascript.CampaignStatusCtrl.updateStatus,
          routes.javascript.CampaignStatusCtrl.changeRequestStatus,
          routes.javascript.CampaignStatusCtrl.takePublishedCampaignDown,
          routes.javascript.CampaignAdminCtrl.deleteCampaign,
          routes.javascript.CampaignAdminCtrl.showCampaigns,
          routes.javascript.CampaignMgrCtrl.createCampaign,
          routes.javascript.CampaignMgrCtrl.saveCampaign,
          routes.javascript.CampaignMgrCtrl.getLabelText,
          routes.javascript.CampaignMgrCtrl.updateLabels,
          routes.javascript.CampaignMgrCtrl.getMessages,
          routes.javascript.CampaignMgrCtrl.updateMessages,
          routes.javascript.CampaignMgrCtrl.getSocialMedia,
          routes.javascript.CampaignMgrCtrl.updateSocialMedia,
          routes.javascript.CampaignMgrCtrl.updateDetails,
          routes.javascript.CampaignMgrCtrl.updatePosition,
          routes.javascript.CampaignMgrCtrl.editCampaign,
          routes.javascript.CampaignMgrCtrl.deleteAction,
          routes.javascript.CampaignMgrCtrl.allActions,
          routes.javascript.CampaignMgrCtrl.doUpdateCampaignDesign,
          routes.javascript.CampaignMgrCtrl.deleteCampaignImage,
          routes.javascript.CampaignMgrCtrl.doAddToTeam,
          routes.javascript.CampaignMgrCtrl.doMakeAdminInTeam,
          routes.javascript.CampaignMgrCtrl.doRemoveAdminInTeam,
          routes.javascript.CampaignMgrCtrl.doRemoveFromTeam,
          routes.javascript.CampaignMgrCtrl.addGroupToCamp,
          routes.javascript.CampaignMgrCtrl.removeGroupFromCamp,
          routes.javascript.CampaignMgrCtrl.apiCheckAndUpdateSlug,
          routes.javascript.CampaignMgrCtrl.apiUpdateFrontPage,
          routes.javascript.CampaignMgrCtrl.index
      )).as("text/javascript")
  }
  
  def notImplYet = TODO
  
}
