import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useContext } from "react";
import { ShopContext } from "../context/ShopContext"; // إذا كنت تستخدم سياق المتجر
import Item from "../components/Item/Item"; // إذا كنت تعرض المنتج باستخدام هذا المكون

const Product = () => {
  const { productId } = useParams(); // استخراج الـ productId من الـ URL
  const { userId } = useContext(ShopContext); // افترض أنك تستخدم سياق المتجر للحصول على الـ userId
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/products/${productId}`
        );
        if (!response.ok) {
          throw new Error("استجابة الشبكة لم تكن صحيحة");
        }
        const data = await response.json();
        setProduct(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]); // التأكد من تحديث المنتج إذا تغير الـ productId

  const addToCart = async () => {
    if (!userId) {
      setError("يجب تسجيل الدخول لإضافة المنتجات إلى السلة.");
      return;
    }

    try {
      const response = await axios.post(`http://127.0.0.1:8000/api/cart/add`, {
        user_id: userId,
        product_id: productId, // تأكد من إرسال الـ productId هنا
        quantity: 1, // تحديد الكمية (على سبيل المثال، الكمية هي 1)
      });

      if (response.status === 200) {
        alert("تم إضافة المنتج إلى السلة!");
      } else {
        setError("فشل في إضافة المنتج إلى السلة.");
      }
    } catch (error) {
      setError("حدث خطأ أثناء إضافة المنتج إلى السلة.");
    }
  };

  if (loading) {
    return <div>جاري التحميل...</div>;
  }

  if (error) {
    return <div>خطأ: {error}</div>;
  }

  if (!product) {
    return <div>المنتج غير موجود</div>;
  }

  return (
    <div>
      <Item
        id={product.id}
        name={product.name}
        image={product.image}
        description={product.description}
        price={product.price}
        category={product.category}
        supplier={product.supplier}
      />
      <button onClick={addToCart}>إضافة إلى السلة</button>
    </div>
  );
};

export default Product;
