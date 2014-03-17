package breeze.bokeh

import breeze.linalg._
import spray.json._
import spire.implicits._

private[bokeh] object BreezeSerializers { //This is private because all the implementations are incomplete. We don't want this leaking out.

  implicit object DoubleNumericArrayWriter extends RootJsonFormat[DenseVector[Double]] {
    def write(obj: DenseVector[Double]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
    def read(json: JsValue) = ???
  }

  implicit object FloatNumericArrayWriter extends RootJsonFormat[DenseVector[Float]] {
    def write(obj: DenseVector[Float]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
    def read(json: JsValue) = ???
  }

  implicit object LongNumericArrayWriter extends RootJsonFormat[DenseVector[Long]] {
    def write(obj: DenseVector[Long]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
    def read(json: JsValue) = ???
  }

  implicit object IntNumericArrayWriter extends RootJsonFormat[DenseVector[Int]] {
    def write(obj: DenseVector[Int]) = {
      //fugly but due to type erasure I don't know a better way
      val resultArray = new Array[JsNumber](obj.length)
      cfor(0)(i => i < obj.length,i=>i+1)(i => { resultArray(i) = JsNumber(obj.unsafeValueAt(i)) })
      JsArray(resultArray: _*)
    }
    def read(json: JsValue) = ???
  }

}
