import sbt._
import Defaults._
import Keys._
import twirl.sbt.TwirlPlugin._

object ApplicationBuild extends Build {

  val logbackVersion = "1.0.13"
  val sprayVersion = "1.3.1"//"1.2-20130822"
  val akkaVersion = "2.3.0"

  val dependencies = Seq(
    "org.scalanlp" % "breeze_2.10" % "0.7-SNAPSHOT",
    "org.scalanlp" % "breeze-natives_2.10" % "0.7-SNAPSHOT",
    "com.typesafe.akka" %% "akka-actor" % akkaVersion,
    "com.typesafe.akka" %% "akka-kernel" % akkaVersion,
    "com.typesafe.akka" %% "akka-testkit" % akkaVersion % "test",
    "io.spray" % "spray-routing" % sprayVersion,
    "io.spray" % "spray-caching" % sprayVersion,
    "io.spray" % "spray-can" % sprayVersion,
    "io.spray" %% "spray-json" % "1.2.5",
    "ch.qos.logback" % "logback-classic" % logbackVersion,
    "ch.qos.logback" % "logback-core" % logbackVersion,
    "org.slf4j" % "slf4j-api" % "1.6.4",
    "com.bayesianwitch" %% "injera" % "0.01.6",
    "com.typesafe.akka" %% "akka-slf4j" % akkaVersion,
    "org.scalacheck" %% "scalacheck" % "1.10.0" % "test"
    )

  lazy val commonSettings = Defaults.defaultSettings ++ Seq(
    organization := "com.bayesianwitch",
    credentials += Credentials(Path.userHome / ".ivy2" / ".credentials"),
    scalaVersion := "2.10.0",
    version := "0.01.1",
    resolvers ++= myResolvers,
    name := "breeze-bokeh",
    mainClass := Some("breeze.bokeh.Server"),
    //fork := true,
    libraryDependencies ++= dependencies,
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

  lazy val breezeBokeh = Project("breeze-bokeh", file("."), settings = commonSettings)
}
