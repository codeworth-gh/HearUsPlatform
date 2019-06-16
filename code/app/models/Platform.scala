package models

object Platform extends Enumeration {
  type Platform = Value
  val Phone, Email, Mail, Fax, Facebook, Twitter = Value
  
  def tryConvert(name:String):Option[Platform.Value] = {
    try {
      Some(Platform.withName(name))
    } catch {
      case e: Exception => None
    }
  }
}
