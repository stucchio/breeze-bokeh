package breeze.bokeh

import akka.actor._
import akka.event.{Logging, LoggingAdapter}
import spray.routing._
import spray.httpx.SprayJsonSupport
import spray.http._
import spray.json._
import MediaTypes._
import breeze.linalg._
import java.util.UUID
import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry


trait BreezeBokehProvider extends HttpService with SprayJsonSupport  {

  private lazy val bokehJs = scala.io.Source.fromURL(getClass.getResource("/bokeh.js")).mkString

  def bokehRoutes: (RequestContext => Unit) = {
    path("bokeh.js") {
      get {
        respondWithMediaType(`application/javascript`) {
          complete { bokehJs }
        }
      }
    }
  }
}
