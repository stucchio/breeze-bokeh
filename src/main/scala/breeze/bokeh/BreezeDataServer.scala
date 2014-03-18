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


trait BreezeDataServer extends HttpService with SprayJsonSupport with ActorLogging { self: Actor =>
  import BreezeSerializers._
  import VectorRegister.WrappedVectorWriter
  protected def registry: VectorRegister


  private class NotFoundException(msg: String) extends Exception(msg)

  def dataRoutes: (RequestContext => Unit) = {
    path("array" / Segment) { arrayUUIDStr =>
      val uuid = UUID.fromString(arrayUUIDStr)
      get {
        val data = registry.get(uuid)
        data.map( d => {
          jsonpWithParameter("jsonp") {
            complete { log.error("complete"); d }
          }
        }
        ).getOrElse( complete { HttpResponse(StatusCodes.NotFound) } )
      }
    }
  }
}
