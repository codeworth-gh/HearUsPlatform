package dataaccess

import dataaccess.SortBy.Value
import javax.inject.Inject

import models.{User, UserRole}
import org.mindrot.jbcrypt.BCrypt
import play.api.{Configuration, Logger}
import play.api.db.slick.{DatabaseConfigProvider, HasDatabaseConfigProvider}
import slick.jdbc.JdbcProfile

import scala.concurrent.Future
import scala.concurrent.ExecutionContext.Implicits.global

class UsersDAO @Inject() (protected val dbConfigProvider:DatabaseConfigProvider, conf:Configuration) extends HasDatabaseConfigProvider[JdbcProfile] {

  import profile.api._
  private val Users = TableQuery[UserTable]

  def addUser( u:User ):Future[User] = {
    db.run( Users.returning(Users.map(_.id))
      .into((user,newId)=>user.copy(id=newId)) += u.copy(id=0) )
  }

  def updateUser( u:User ):Future[User] = {
    if ( u.id==0 ) {
      addUser(u)
    } else {
      db.run( Users.filter(_.id===u.id).update(u) ).map( _ => u )
    }
  }

  def usernameExists( u:String):Future[Boolean] = {
    db.run{
      Users.map( _.username ).filter( _.toLowerCase === u.toLowerCase() ).exists.result
    }
  }

  def emailExists ( e:String): Future[Boolean] = {
    db.run{
      Users.map(_.email ).filter( _.toLowerCase  === e.toLowerCase ).exists.result
    }
  }

  def allUsers(searchStr:Option[String]):Future[Seq[User]] = {
    db.run (
      prepareTable(searchStr).result
    )
  }

  def getUserByEmail(email:String):Future[Option[User]] = {
    db.run{
      Users.filter (_.email === email).result
    } map { res => res.headOption }
  }

  def update( u:User ):Future[User] = {
    db.run {
      Users.filter( _.username===u.username).update(u)
    } map { _ => u }
  }

  def updatePassword( u:User, newPass:String ):Future[User] = {
    update(u.copy(encryptedPassword = BCrypt.hashpw(newPass, BCrypt.gensalt())))
  }

  def updateRole(u:User, newRoles:Set[UserRole.Value] ):Future[User] = {
    update(u.copy(roles = newRoles))
  }

  def updateRole(id:Long, newRoles:Set[UserRole.Value] ):Future[Int] = {
    import Mappers.roleSeqMappers
    db.run( Users.filter( _.id === id ).map( _.userRoles ).update( newRoles ) )
  }

  def get(username:String):Future[Option[User]] = db.run( Users.filter( _.username === username).result ).map( _.headOption )

  def get(userId:Long):Future[Option[User]] = db.run( Users.filter( _.id === userId).result ).map( _.headOption )

  def authenticate(username:String, password:String):Future[Option[User]] = {
    get(username).map( maybeUser => maybeUser.find(u=>BCrypt.checkpw(password, u.encryptedPassword)) )
  }

  def hashPassword( plaintext:String ) = BCrypt.hashpw(plaintext, BCrypt.gensalt())

  // verifyPass
  def verifyPassword( u:User, plaintext:String ):Boolean = BCrypt.checkpw(plaintext, u.encryptedPassword)

  def prepareTable(searchStr: Option[String]) = {
    searchStr match {
      case None => Users
      case Some(str) => Users.filter( row =>
        Seq( row.name.like(str), row.username.like(str), row.email.like(str)
        ).reduceLeftOption(_||_).getOrElse(true:Rep[Boolean]) )
    }
  }
}
