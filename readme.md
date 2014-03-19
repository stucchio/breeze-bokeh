# Breeze-Bokeh

Graphs for breeze. Totally experimental at this point.

# How to use

    $ sbt
    > run
    [info] Running breeze.bokeh.Server
    bef1d598-f19b-4234-9fa2-99e9ba286659
    http://localhost:8080/scatter/bef1d598-f19b-4234-9fa2-99e9ba286659/bef1d598-f19b-4234-9fa2-99e9ba286659

Copy that url into your browser. Yay for a [BokehJS](https://github.com/ContinuumIO/bokeh/tree/master/bokehjs) powered Scatterplot.

# Core Concepts

At the core of Breeze-Bokeh is the `VectorRegister`. This is a data structure which assigns vectors sitting in memory a unique UUID:

    val registry = new VectorRegister
    val x = DenseVector.range(0,32)
    val registered = registry.register(x)

Once a vector is registered, Breeze-Bokeh can embed it in javascript for plotting. At the moment only a basic scatterplot is supported. A Breeze-Bokeh server is started via the command:

    breeze.bokeh.Server.start("localhost", 80, registry)

To create a plot:

    val xUUID = registry.register(xcoords)
    val yUUID = registry.register(ycoords)
    println("http://localhost:8080/scatter/" + xUUID + "/" + yUUID)

Then copy&past the printed URL into a browser.

## Garbage Collection and memory leaks

The `VectorRegister` is built on top of [injera's](https://github.com/stucchio/injera) [weak registry](https://github.com/stucchio/injera/blob/master/src/main/scala/injera/misc/WeakRegistry.scala) - this ensures that garbage collection is not inhibited. I.e., in the example above, as soon as `xcoords` and/or `ycoords` fall out of scope, they will be garbage collected and the URL will no longer work.

# Longer term vision

Those of us wanting to live in scalaland can hijack Continuum Analytics great work on [Bokeh](https://github.com/ContinuumIO/bokeh/) to get a good plotting library.

This will enable us to run a server and embed plots in the browser. We won't need to worry about constantly keeping parity with the Python world - all we'll need to do is import their javascript libs. This is also useful for web-based reporting - half the motivation for building this project is to embed web-based plots in the [BayesianWitch](http://www.bayesianwitch.com) webapp.

To build a Mathematica-like environment, we can also exploit Bridgewater's [Scala Notebook](https://github.com/Bridgewater/scala-notebook). By building Breeze-Bokeh widgets for Scala Notebook, we can have plot embedded directly in repl.
