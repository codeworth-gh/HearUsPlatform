package controllers

import java.nio.file.{Files, Paths}

import javax.inject.Inject
import play.api.{Configuration, Logger}
import play.api.mvc.{ControllerComponents, InjectedController}

import scala.concurrent.ExecutionContext
import scala.util.Random

class ExternalFilesCtrl @Inject()( cc:ControllerComponents, conf:Configuration ) extends InjectedController {
  
  implicit val ec:ExecutionContext = cc.executionContext
  private val basePath = Paths.get(conf.get[String]("psps.externalFilesCtrl.localPath"))
  private val logger = Logger( classOf[ExternalFilesCtrl] )
  
  // validate on startup that we're fine.
  logger.info("ExternalFilesCtrl serving files from %s".format(basePath.toAbsolutePath.toString))
  if ( ! Files.exists(basePath) ) {
    logger.error("Local path '%s' does not exist".format(basePath.toAbsolutePath.toString))
  }
  
  def getFile( filePath:String ) = Action{ req =>
    val resPath = basePath.resolve(filePath)
    if ( resPath.startsWith(basePath) ) {
      if ( Files.exists(resPath)) Ok.sendPath(resPath)
      else NotFound("File '%s' not found.".format(filePath))
    } else {
      BadRequest( ExternalFilesCtrl.respond() )
    }
  }
}

object ExternalFilesCtrl {
  private val responses = Seq(
    "No", "I'm sorry Dave, I'm afraid I can't do that", "Sneaky", "Computer says 'no'"
  )
  
  def respond():String = responses(Random.nextInt(responses.size))
}