package breeze.bokeh

import akka.actor.{ActorSystem, Props, Actor, ActorLogging}
import akka.io.IO
import spray.can.Http
import spray.routing._
import spray.http._
import akka.event.Logging
import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry

object Server {
  private implicit val system = ActorSystem("breeze-bokeh-system")
  private lazy val log = Logging(system, "breeze-bokeh-system")

  private var started: Boolean = false
  def start(hostname: String, port: Int, registry: UUIDWeakReferenceRegistry[Plot]) = if (!started) {
    val server = system.actorOf(Props(new HttpServer(registry)), "bokeh-server")
    IO(Http) ! Http.Bind(server, hostname, port)
    started = true
  }


  def main(args: Array[String]) = {  // THIS IS FOR TESTING ONLY DO NOT USE
    import JsonNumericArraySerializers._
    implicit val registry = new UUIDWeakReferenceRegistry[Plot]
    import breeze.linalg._
    val x = DenseVector.range(0,32)
    val plot = plots.Scatter(x,x,None,"xlabel", "ylabel",Some("my plot"))

    start("localhost", 8080, registry)
    println("http://localhost:8080" + plot.urlPath)
  }

  private implicit val rs = implicitly[spray.routing.RoutingSettings]
  private implicit val eh = implicitly[spray.routing.ExceptionHandler]

  private class HttpServer(protected val plotRegistry: UUIDWeakReferenceRegistry[Plot]) extends Actor with HttpService with ActorLogging with BreezeDataServer with BreezeBokehProvider  {
    def actorRefFactory = context
    def receive = runRoute(routes)
    val routes = dataRoutes ~ bokehRoutes
  }
}
