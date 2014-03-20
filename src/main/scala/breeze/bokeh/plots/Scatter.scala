package breeze.bokeh.plots

import breeze.bokeh._
import breeze.bokeh.templates.plots._
import Plot._
import breeze.linalg._
import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry

case class Scatter[T](x: RenderableNumericArray[T], y: RenderableNumericArray[T], r: Option[RenderableNumericArray[T]] = None, xlabel: String, ylabel: String, title: Option[String])(implicit val registry: UUIDWeakReferenceRegistry[Plot]) extends Plot {
  private def radius = r.map(_.render).getOrElse( """
    (function(){
      var r = [];
      for (var i=0;i<x.length;i++) {
        r.push(1);
      }
      return r;
    })()
  """)

  def renderJavascript(containerId: String) = dependencies + "\n" + html.scatter(containerId, x.render, y.render, radius, xlabel, ylabel, title).toString
  def underlyingData = Seq(x,y)
}
