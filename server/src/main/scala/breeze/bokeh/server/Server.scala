package breeze.bokeh.server

import breeze.bokeh._
import akka.actor.{ActorSystem, Props, Actor, ActorLogging}
import akka.io.IO
import spray.can.Http
import spray.routing._
import spray.http._
import akka.event.Logging
import java.util.UUID
import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry

class Server(hostname: String, port: Int)(implicit val system: ActorSystem) extends PlotServer[UUID] {
  private def registry = new UUIDWeakReferenceRegistry[Plot]
  protected def registerImpl(plot: Plot): UUID = registry.register(plot)
  def plotURL(plot: Plot): String = "http://" + hostname + (if (port == 80) { "" } else { ":" + port }) + "/plot/" + register(plot)

  private implicit val rs = implicitly[spray.routing.RoutingSettings]
  private implicit val eh = implicitly[spray.routing.ExceptionHandler]

  private class HttpServer extends Actor with HttpService with ActorLogging with BreezeDataServer {
    protected val plotRegistry = registry
    def actorRefFactory = context
    def receive = runRoute(routes)
    val routes = dataRoutes
  }

  private val server = system.actorOf(Props[HttpServer], "bokeh-server")
  IO(Http) ! Http.Bind(server, hostname, port)
}

object Server {
  private implicit val system = ActorSystem("breeze-bokeh-system")
  private lazy val log = Logging(system, "breeze-bokeh-system")

  private var server: Option[Server] = None
  def start(hostname: String, port: Int) = this.synchronized {
    if (!server.isDefined) {
      val server = Some(new Server(hostname, port))
    }
    server.get
  }


  def main(args: Array[String]) = {  // THIS IS FOR TESTING ONLY DO NOT USE
    import breeze.linalg._
    implicit val server = start("localhost", 8080)

    val x = DenseVector.range(0,32)
    val plot = plots.Line(x,x :* x,"xlabel", "ylabel",Some("my plot"))
    println(server.plotURL(plot))
  }
}
