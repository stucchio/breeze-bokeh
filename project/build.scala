import sbt._
import Defaults._
import Keys._
import twirl.sbt.TwirlPlugin._

object ApplicationBuild extends Build {

  val logbackVersion = "1.0.13"
  val sprayVersion = "1.3.1"
  val akkaVersion = "2.3.0"

  val serverDependencies = Seq(
    "com.typesafe.akka" %% "akka-actor" % akkaVersion,
    "com.typesafe.akka" %% "akka-kernel" % akkaVersion,
    "com.typesafe.akka" %% "akka-testkit" % akkaVersion % "test",
    "io.spray" % "spray-routing" % sprayVersion,
    "io.spray" % "spray-caching" % sprayVersion,
    "io.spray" % "spray-can" % sprayVersion,
    "ch.qos.logback" % "logback-classic" % logbackVersion,
    "ch.qos.logback" % "logback-core" % logbackVersion,
    "org.slf4j" % "slf4j-api" % "1.6.4",
    "com.typesafe.akka" %% "akka-slf4j" % akkaVersion
    )

  val bokehDependencies = Seq(
    "org.scalanlp" % "breeze_2.10" % "0.7",
    "org.scalanlp" % "breeze-natives_2.10" % "0.7",
    "com.bayesianwitch" %% "injera" % "0.01.6",
    "io.spray" %% "spray-json" % "1.2.5",
    "org.scalacheck" %% "scalacheck" % "1.10.0" % "test"
  )

  lazy val commonSettings = Defaults.defaultSettings ++ Seq(
    organization := "com.bayesianwitch",
    credentials += Credentials(Path.userHome / ".ivy2" / ".credentials"),
    scalaVersion := "2.10.0",
    version := "0.01.3",
    resolvers ++= myResolvers,
    name := "breeze-bokeh",
    //fork := true,
    libraryDependencies ++= bokehDependencies,
    publishTo := Some(Resolver.file("file",  new File( "/tmp/breeze-bokeh-publish" )) )
  ) ++ Twirl.settings

  val myResolvers = Seq(
    "Sonatatype Snapshots" at "http://oss.sonatype.org/content/repositories/snapshots",
    "Sonatatype Releases" at "http://oss.sonatype.org/content/repositories/releases",
    "Typesafe Releases" at "http://repo.typesafe.com/typesafe/releases",
    "Typesafe Snapshots" at "http://repo.typesafe.com/typesafe/snapshots",
    "Coda Hale" at "http://repo.codahale.com",
    "Typesafe" at "http://repo.typesafe.com/typesafe/releases",
    "Akka" at "http://repo.akka.io/releases/",
    "spray repo" at "http://repo.spray.io",
    "chrisstucchio" at "http://maven.chrisstucchio.com/"
  )

  lazy val breezeBokeh = Project("bokeh", file("bokeh"), settings = commonSettings)

  val bokehServerSettings = commonSettings ++ Seq(
    name := "breeze-bokeh-server",
    libraryDependencies ++= serverDependencies,
    mainClass := Some("breeze.bokeh.server.Server")
  )
  lazy val breezeBokehServer = Project("server", file("server"), settings = bokehServerSettings).dependsOn(breezeBokeh)
}
