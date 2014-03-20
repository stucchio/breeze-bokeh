package breeze.bokeh

import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry

trait Plot { self: Plot =>
  protected val registry: UUIDWeakReferenceRegistry[Plot]
  registry.register(self)

  def dependencies: String = """
      <link href="/static/css/bokeh.css" rel="stylesheet">
      <script data-main="/static/js/main" src='/static/js/vendor/requirejs/require.js'></script>
      <script src="/static/js/config.js"></script>
   """
  def renderJavascript(containerId: String): String
  def underlyingData: Seq[Plot.RenderableNumericArray[_]]
  def title: Option[String]
}

object Plot {
  implicit class RenderableNumericArray[T](val data: T)(implicit serializer: JsonNumericArraySerializer[T]) {
    def renderJson = serializer.renderJson(data)
    def render = serializer.render(data)
  }
}
