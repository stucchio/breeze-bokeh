package breeze.bokeh

import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry
import breeze.linalg._
import java.util.UUID
import spray.json._

object VectorRegister {
  sealed trait WrappedVector
  case class DenseVectorDouble(v: DenseVector[Double]) extends WrappedVector
  case class DenseVectorFloat(v: DenseVector[Float]) extends WrappedVector
  case class DenseVectorLong(v: DenseVector[Long]) extends WrappedVector
  case class DenseVectorInt(v: DenseVector[Int]) extends WrappedVector

  private implicit class OptionPlus[V](val x: Option[V]) extends AnyVal {
    //Scalaz already has one of these, but better to avoid the import
    def <+>[U >: V](other: Option[U]): Option[U] = if (x.isDefined) { x } else { other }
  }

  private[bokeh] implicit object WrappedVectorWriter extends RootJsonFormat[WrappedVector] {
    //private because of incomplete implementation. Useful for this module, but should not be used externally.
    import BreezeSerializers._
    def write(obj: WrappedVector) = obj match {
      case DenseVectorDouble(v) => DoubleNumericArrayWriter.write(v)
      case DenseVectorFloat(v) => FloatNumericArrayWriter.write(v)
      case DenseVectorLong(v) => LongNumericArrayWriter.write(v)
      case DenseVectorInt(v) => IntNumericArrayWriter.write(v)
    }
    def read(json: JsValue) = ???
  }
}

class VectorRegister {
  import VectorRegister._
  private val doubleRegistry = new UUIDWeakReferenceRegistry[DenseVector[Double]]
  private val floatRegistry = new UUIDWeakReferenceRegistry[DenseVector[Float]]
  private val longRegistry = new UUIDWeakReferenceRegistry[DenseVector[Long]]
  private val intRegistry = new UUIDWeakReferenceRegistry[DenseVector[Int]]

  def get(uuid: UUID): Option[WrappedVector] = doubleRegistry.get(uuid).map(DenseVectorDouble.apply) <+> floatRegistry.get(uuid).map(DenseVectorFloat.apply) <+>
     longRegistry.get(uuid).map(DenseVectorLong.apply) <+> intRegistry.get(uuid).map(DenseVectorInt.apply)

  def register[V : Manifest](v: DenseVector[_]) = v.data.getClass.getComponentType.asInstanceOf[Class[V]] match {
    case m if m == manifest[Double] => doubleRegistry.register(v.asInstanceOf[DenseVector[Double]])
    case m if m == manifest[Float] => floatRegistry.register(v.asInstanceOf[DenseVector[Float]])
    case m if m == manifest[Long] => longRegistry.register(v.asInstanceOf[DenseVector[Long]])
    case m if m == manifest[Int] => intRegistry.register(v.asInstanceOf[DenseVector[Int]])
    case _ => ??? //Only defined for raw numeric types
  }

}
