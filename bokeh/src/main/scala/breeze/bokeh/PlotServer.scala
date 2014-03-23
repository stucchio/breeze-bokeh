package breeze.bokeh

import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry
import scala.xml._

trait PlotServer[K] { self: PlotServer[K] =>
  def checkServer(plot: Plot) = plot.plotServer == self
  protected def registerImpl(plot: Plot): K
  def register(plot: Plot): K = if (checkServer(plot)) { registerImpl(plot) } else { throw new IllegalArgumentException("Plot " + plot + " is already registered with server " + plot.plotServer + ", cannot register it with " + self) }
}
