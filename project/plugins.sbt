
resolvers ++= Seq("Typesafe repository" at "http://repo.typesafe.com/typesafe/releases/")

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.9.2")

resolvers += Resolver.url("artifactory", url("http://scalasbt.artifactoryonline.com/scalasbt/sbt-plugin-releases"))(Resolver.ivyStylePatterns)

logLevel := Level.Warn

resolvers += "Scala Tools Releases" at "https://repository.jboss.org/nexus/content/repositories/scala-tools-releases"

resolvers += "spray repo" at "http://repo.spray.io"

addSbtPlugin("io.spray" % "sbt-twirl" % "0.7.0")
