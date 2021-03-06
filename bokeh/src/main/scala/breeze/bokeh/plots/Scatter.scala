package breeze.bokeh.plots

import breeze.bokeh._
import breeze.bokeh.templates.plots._
import breeze.linalg._
import scala.xml._

case class Scatter(x: RenderableNumericArray, y: RenderableNumericArray, r: Option[RenderableNumericArray] = None, xlabel: String, ylabel: String, title: Option[String], xrange: Option[(Double,Double)] = None, yrange: Option[(Double,Double)] = None)(implicit val plotServer: PlotServer[_]) extends Plot {
  private def radius = r.map(_.render).getOrElse( """
    (function(){
      var r = [];
      for (var i=0;i<x.length;i++) {
        r.push(1);
      }
      return r;
    })()
  """)

  private def xr = xrange.getOrElse( (x.min, x.max) )
  private def yr = yrange.getOrElse( (y.min, y.max) )

  def javascript(containerId: String) = txt.scatter(containerId, x.render, y.render, radius, xlabel, ylabel, title, xr, yr).toString
}
