package breeze.bokeh

import com.bayesianwitch.injera.misc.UUIDWeakReferenceRegistry
import scala.reflect.runtime.universe._
import breeze.linalg._
import java.util.UUID
import spray.json._
import scalaz._
import Scalaz._

object VectorRegister {
  sealed trait WrappedVector {
    def v: DenseVector[_]
    def length: Int = v.length
  }
  case class DenseVectorDouble(v: DenseVector[Double]) extends WrappedVector
  case class DenseVectorFloat(v: DenseVector[Float]) extends WrappedVector
  case class DenseVectorLong(v: DenseVector[Long]) extends WrappedVector
  case class DenseVectorInt(v: DenseVector[Int]) extends WrappedVector
}

class VectorRegister {
  import VectorRegister._
  private val doubleRegistry = new UUIDWeakReferenceRegistry[DenseVector[Double]]
  private val floatRegistry = new UUIDWeakReferenceRegistry[DenseVector[Float]]
  private val longRegistry = new UUIDWeakReferenceRegistry[DenseVector[Long]]
  private val intRegistry = new UUIDWeakReferenceRegistry[DenseVector[Int]]

  def get(uuid: UUID): Option[WrappedVector] = (doubleRegistry.get(uuid).map(DenseVectorDouble.apply): Option[WrappedVector]) <+> floatRegistry.get(uuid).map(DenseVectorFloat.apply) <+>
     longRegistry.get(uuid).map(DenseVectorLong.apply) <+> intRegistry.get(uuid).map(DenseVectorInt.apply)

  private val doubleTag = (new Array[Double](1)).getClass.getComponentType.asInstanceOf[Class[_]]
  private val floatTag = (new Array[Float](1)).getClass.getComponentType.asInstanceOf[Class[_]]
  private val longTag = (new Array[Long](1)).getClass.getComponentType.asInstanceOf[Class[_]]
  private val intTag = (new Array[Int](1)).getClass.getComponentType.asInstanceOf[Class[_]]

  def register[V : Manifest](v: DenseVector[_]) = {
    v.data.getClass.getComponentType.asInstanceOf[Class[V]] match {
      case m if m == doubleTag => doubleRegistry.register(v.asInstanceOf[DenseVector[Double]])
      case m if m == floatTag => floatRegistry.register(v.asInstanceOf[DenseVector[Float]])
      case m if m == longTag => longRegistry.register(v.asInstanceOf[DenseVector[Long]])
      case m if m == intTag => intRegistry.register(v.asInstanceOf[DenseVector[Int]])
      case _ => ??? //Only defined for raw numeric types
    }
  }

}
