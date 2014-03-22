package breeze.bokeh

import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry
import scala.xml._

trait Plot { self: Plot =>
  protected val registry: UUIDWeakReferenceRegistry[Plot]
  registry.register(self)

  def dependencies: NodeSeq = (<script src="http://cdn.pydata.org/bokeh-0.4.min.js" type="text/javascript"></script>: NodeSeq) :+
                              <link href="http://cdn.pydata.org/bokeh-0.4.min.css" rel="stylsheet" type="text/css"></link>

  def javascript(containerId: String): String
  def renderJavascript(containerId: String): NodeSeq = <script type="text/javascript">{Unparsed(javascript(containerId).toString)}</script>
  def title: Option[String]
  def urlPath = "/plot/" + registry.register(self)
}

object Plot {
  implicit class RenderableNumericArray[T](val data: T)(implicit serializer: JsonNumericArraySerializer[T]) {
    def renderJson = serializer.renderJson(data)
    def render = serializer.render(data)
    def max = serializer.max(data)
    def min = serializer.min(data)
  }
}
