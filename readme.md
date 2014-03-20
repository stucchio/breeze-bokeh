# Breeze-Bokeh

Graphs for breeze. Totally experimental at this point.

# How to use

    $ sbt
    > run
    [info] Running breeze.bokeh.Server
    http://localhost:8080/plot/bef1d598-f19b-4234-9fa2-99e9ba286659

Copy that url into your browser. Yay for a [BokehJS](https://github.com/ContinuumIO/bokeh/tree/master/bokehjs) powered Scatterplot.

# Core Concepts

At the core of Breeze-Bokeh is the registry, which is of type `com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry`. This is a data structure which assigns UUID's to objects sitting in memory. A server is then built which references this:

    implicit val registry = new UUIDWeakReferenceRegistry[Plot]
    val server = Server.start("localhost", 8080, registry)

Then you can create plots. Currently only a scatterplot is supported:

    val x = DenseVector.range(0,32)
    val plot = plots.Scatter(x,x,None,"xlabel", "ylabel",Some("my plot"))
    println("URL is: http://localhost:8080" + plot.urlPath)

Copy&past the printed URL into a browser.

Currently the only plot type is `plot.Scatterplot`. The author does recognize the [irony](http://www.chrisstucchio.com/blog/2012/dont_use_scatterplots.html).

## Garbage Collection and memory leaks

Creating a `Plot` object (e.g. `Scatter(...)`) does not hinder garbage collection. The [weak registry](https://github.com/stucchio/injera/blob/master/src/main/scala/injera/misc/WeakRegistry.scala) from [injera](https://github.com/stucchio/injera) uses weak references to ensure that objects can be garbage collected when they fall out of scope. Whether or not this actually occurs is up to the JVM.

The plotting URL will continue to work until the garbage collection actually occurs, so don't build anything security critical on top of this.

# Longer term vision

Those of us wanting to live in scalaland can hijack Continuum Analytics great work on [Bokeh](https://github.com/ContinuumIO/bokeh/) to get a good plotting library.

This will enable us to run a server and embed plots in the browser. We won't need to worry about constantly keeping parity with the Python world - all we'll need to do is import their javascript libs. This is also useful for web-based reporting - half the motivation for building this project is to embed web-based plots in the [BayesianWitch](http://www.bayesianwitch.com) webapp.

To build a Mathematica-like environment, we can also exploit Bridgewater's [Scala Notebook](https://github.com/Bridgewater/scala-notebook). By building Breeze-Bokeh widgets for Scala Notebook, we can have plot embedded directly in repl.
