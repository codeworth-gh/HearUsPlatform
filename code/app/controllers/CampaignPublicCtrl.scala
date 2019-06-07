package controllers

import dataaccess.{CampaignDAO, ImagesDAO, KnessetMemberDAO}
import javax.inject.Inject
import play.api.Configuration
import play.api.i18n.{I18nSupport, Langs, MessagesApi, MessagesImpl, MessagesProvider}
import play.api.libs.ws.WSClient
import play.api.mvc.{AbstractController, ControllerComponents, InjectedController}

class CampaignPublicCtrl @Inject()(cc:ControllerComponents, kms:KnessetMemberDAO, campaigns:CampaignDAO,
                                   langs:Langs, messagesApi:MessagesApi, images: ImagesDAO,
                                   conf:Configuration, ws:WSClient) extends AbstractController(cc) with I18nSupport {
  
  implicit private val ec = controllerComponents.executionContext
  
  
  def index( campaignSlug:String ) = Action.async{ implicit req =>
    for {
      camp <- campaigns.getBySlug(campaignSlug)
    } yield {
      camp match {
        case None => NotFound( views.html.errorPage(404, messagesApi.preferred(req)("errors.campaignNotFound")))
        case Some( c ) => Ok( views.html.campaignPublic.campaignFrontPage(c) )
      }
    }
  }
  
  
}
