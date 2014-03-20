package breeze.bokeh

import breeze.linalg._
import spray.json._
import spire.implicits._

//typeclass representing a way of turning objects into json arrays
trait JsonNumericArraySerializer[T] {
  def renderJson(obj: T): JsValue
  def render(obj: T) = renderJson(obj).compactPrint
}

class JsonNumericArraySerializerFromJsonFormat[T](format: RootJsonFormat[T]) extends JsonNumericArraySerializer[T] {
  def renderJson(obj: T) = format.write(obj)
}

object JsonNumericArraySerializers {
  private trait DummyReader {
    def read(json: JsValue) = ???
  }

  implicit val DoubleDenseVectorWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[DenseVector[Double]] with DummyReader {
    def write(obj: DenseVector[Double]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
  })

  implicit val FloatDenseVectorWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[DenseVector[Float]] with DummyReader {
    def write(obj: DenseVector[Float]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
  })

  implicit val LongDenseVectorWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[DenseVector[Long]] with DummyReader {
    def write(obj: DenseVector[Long]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
  })

  implicit val IntDenseVectorWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[DenseVector[Int]] with DummyReader {
    def write(obj: DenseVector[Int]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
  })

  implicit val DoubleArrayWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[Array[Double]] with DummyReader {
    def write(obj: Array[Double]) = { JsArray(obj.map(JsNumber.apply): _*) }
  })

  implicit val FloatArrayWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[Array[Float]] with DummyReader {
    def write(obj: Array[Float]) = { JsArray(obj.map(x => JsNumber(x)): _*) } //I don't know why I can't simply map JsNumber.apply
  })

  implicit val LongArrayWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[Array[Long]] with DummyReader {
    def write(obj: Array[Long]) = { JsArray(obj.map(JsNumber.apply): _*) }
  })

  implicit val IntArrayWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[Array[Int]] with DummyReader {
    def write(obj: Array[Int]) = { JsArray(obj.map(JsNumber.apply): _*) }
  })
}
