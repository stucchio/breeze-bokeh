package breeze.bokeh.plots

import breeze.bokeh._
import breeze.bokeh.templates.plots._
import breeze.linalg._
import spray.json._
import scala.xml._
import DefaultJsonProtocol._

case class Line(x: RenderableNumericArray, y: RenderableNumericArray, xlabel: String, ylabel: String, title: Option[String] = None, lineWidth: Int = 1, lineDash: Option[Seq[Int]] = None, lineColor: String = "#000000", xrange: Option[(Double,Double)] = None, yrange: Option[(Double,Double)] = None)(implicit val plotServer: PlotServer[_]) extends Plot {
  private def xr = xrange.getOrElse( (x.min, x.max) )
  private def yr = yrange.getOrElse( (y.min, y.max) )

  private def ld = lineDash.map( _.toList.toJson.compactPrint ).getOrElse("[]")

  def javascript(containerId: String) = txt.line(containerId, x.render, y.render, xlabel, ylabel, lineWidth, ld, lineColor, xr, yr).toString
}
