package breeze.bokeh.plots

import breeze.bokeh._
import breeze.bokeh.templates.plots._
import Plot._
import breeze.linalg._
import spray.json._
import scala.xml._
import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry
import DefaultJsonProtocol._

case class Line[T](x: RenderableNumericArray[T], y: RenderableNumericArray[T], xlabel: String, ylabel: String, title: Option[String], lineWidth: Int = 1, lineDash: Option[Seq[Int]] = None, lineColor: String = "#000000", xrange: Option[(Double,Double)] = None, yrange: Option[(Double,Double)] = None)(implicit val registry: UUIDWeakReferenceRegistry[Plot]) extends Plot {
  private def xr = xrange.getOrElse( (x.min, x.max) )
  private def yr = yrange.getOrElse( (y.min, y.max) )

  private def ld = lineDash.map( _.toList.toJson.compactPrint ).getOrElse("[]")

  def renderJavascript(containerId: String) = Seq(<script type="application/javascript">{Unparsed(txt.line(containerId, x.render, y.render, xlabel, ylabel, lineWidth, ld, lineColor, xr, yr).toString)}</script>)
}
