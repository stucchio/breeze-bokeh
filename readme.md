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

## Garbage Collection and memory leaks

The `VectorRegister` is built on top of [injera's](https://github.com/stucchio/injera) [weak registry](https://github.com/stucchio/injera/blob/master/src/main/scala/injera/misc/WeakRegistry.scala) - this ensures that garbage collection is not inhibited. I.e., in the example above, as soon as `xcoords` and/or `ycoords` fall out of scope, they will be garbage collected and the URL will no longer work.

# Longer term vision

Those of us wanting to live in scalaland can hijack Continuum Analytics great work on [Bokeh](https://github.com/ContinuumIO/bokeh/) to get a good plotting library.

This will enable us to run a server and embed plots in the browser. We won't need to worry about constantly keeping parity with the Python world - all we'll need to do is import their javascript libs. This is also useful for web-based reporting - half the motivation for building this project is to embed web-based plots in the [BayesianWitch](http://www.bayesianwitch.com) webapp.

To build a Mathematica-like environment, we can also exploit Bridgewater's [Scala Notebook](https://github.com/Bridgewater/scala-notebook). By building Breeze-Bokeh widgets for Scala Notebook, we can have plot embedded directly in repl.
