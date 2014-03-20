package breeze.bokeh

import akka.actor._
import akka.event.{Logging, LoggingAdapter}
import spray.routing.{HttpService, RequestContext, ExceptionHandler}
import spray.httpx.SprayJsonSupport
import spray.http._
import MediaTypes._
import spray.json._
import breeze.linalg._
import java.util.UUID
import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry


trait BreezeDataServer extends HttpService with SprayJsonSupport with ActorLogging { self: Actor =>
  protected def plotRegistry: UUIDWeakReferenceRegistry[Plot]


  private class NotFoundException(msg: String) extends Exception(msg)

  def dataRoutes: (RequestContext => Unit) = {
    path("plot" / Segment) { plotIdAsString: String =>
      val uuid = UUID.fromString(plotIdAsString)
      get {
        val optionalPlot = plotRegistry.get(uuid)
        optionalPlot.map( plot => {
          val containerId = UUID.randomUUID.toString
          respondWithMediaType(`text/html`) {
            complete {
              templates.html.plot(containerId, plot.renderJavascript(containerId), plot.title).toString
            }
          }
        }).getOrElse( complete { HttpResponse(StatusCodes.NotFound) } )
      }
    }
  }
}
