package breeze.bokeh

import akka.actor._
import akka.event.{Logging, LoggingAdapter}
import spray.routing.{HttpService, RequestContext, ExceptionHandler}
import spray.httpx.SprayJsonSupport
import spray.http._
import spray.json._
import breeze.linalg._
import java.util.UUID
import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry


trait BreezeDataServer extends HttpService with SprayJsonSupport  {
  import BreezeSerializers._
  import VectorRegister.WrappedVectorWriter
  def doubleRegistry: VectorRegister

  private class NotFoundException(msg: String) extends Exception(msg)

  def dataRoutes: (RequestContext => Unit) = {
    path("array" / Segment) { arrayUUIDStr =>
      get {
        val uuid = UUID.fromString(arrayUUIDStr)
        val data = doubleRegistry.get(uuid)
        data.map( d =>
          jsonpWithParameter("jsonp") {
            complete { d }
          }
        ).getOrElse( complete { HttpResponse(StatusCodes.InternalServerError) } )
      }
    }
  }
}
