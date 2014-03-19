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

  private case class staticRender(filename: String, mediaType: MediaType = `application/javascript`) {
    private lazy val data = scala.io.Source.fromURL(getClass.getResource("/" + filename)).mkString
    def route: (RequestContext => Unit) = {
      path(filename) {
        get {
          respondWithMediaType(mediaType) {
            complete { data }
          }
        }
      }
    }
  }

  def bokehRoutes: (RequestContext => Unit) = {
    pathPrefix("static") {
      pathPrefix("css") { get { getFromResourceDirectory("static/css") } } ~
      pathPrefix("js") { get { getFromResourceDirectory("static/js") } }
    }
  }
}
