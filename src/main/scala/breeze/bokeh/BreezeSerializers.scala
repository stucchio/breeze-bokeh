package breeze.bokeh

import breeze.linalg._
import spray.json._
import spire.implicits._

//typeclass representing a way of turning objects into json arrays
trait JsonNumericArraySerializer[T] {
  def renderJson(obj: T): JsValue
  def render(obj: T) = renderJson(obj).compactPrint
  def max(obj: T): Double
  def min(obj: T): Double
}

abstract class JsonNumericArraySerializerFromJsonFormat[T](format: RootJsonFormat[T]) extends JsonNumericArraySerializer[T] {
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
  }) {
    def max(obj: DenseVector[Double]) = breeze.linalg.max(obj)
    def min(obj: DenseVector[Double]) = breeze.linalg.min(obj)
  }

  implicit val FloatDenseVectorWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[DenseVector[Float]] with DummyReader {
    def write(obj: DenseVector[Float]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
  }) {
    def max(obj: DenseVector[Float]) = breeze.linalg.max(obj)
    def min(obj: DenseVector[Float]) = breeze.linalg.min(obj)
  }

  implicit val LongDenseVectorWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[DenseVector[Long]] with DummyReader {
    def write(obj: DenseVector[Long]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
  }) {
    def max(obj: DenseVector[Long]) = breeze.linalg.max(obj)
    def min(obj: DenseVector[Long]) = breeze.linalg.min(obj)
  }

  implicit val IntDenseVectorWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[DenseVector[Int]] with DummyReader {
    def write(obj: DenseVector[Int]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
  }) {
    def max(obj: DenseVector[Int]) = breeze.linalg.max(obj)
    def min(obj: DenseVector[Int]) = breeze.linalg.min(obj)
  }

  implicit val DoubleArrayWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[Array[Double]] with DummyReader {
    def write(obj: Array[Double]) = { JsArray(obj.map(JsNumber.apply): _*) }
  }) {
    def max(obj: Array[Double]) = obj.max
    def min(obj: Array[Double]) = obj.max
  }

  implicit val FloatArrayWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[Array[Float]] with DummyReader {
    def write(obj: Array[Float]) = { JsArray(obj.map(x => JsNumber(x)): _*) } //I don't know why I can't simply map JsNumber.apply
  }) {
    def max(obj: Array[Float]) = obj.max
    def min(obj: Array[Float]) = obj.max
  }

  implicit val LongArrayWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[Array[Long]] with DummyReader {
    def write(obj: Array[Long]) = { JsArray(obj.map(JsNumber.apply): _*) }
  }) {
    def max(obj: Array[Long]) = obj.max
    def min(obj: Array[Long]) = obj.max
  }

  implicit val IntArrayWriter = new JsonNumericArraySerializerFromJsonFormat(new RootJsonFormat[Array[Int]] with DummyReader {
    def write(obj: Array[Int]) = { JsArray(obj.map(JsNumber.apply): _*) }
  }) {
    def max(obj: Array[Int]) = obj.max
    def min(obj: Array[Int]) = obj.max
  }
}
