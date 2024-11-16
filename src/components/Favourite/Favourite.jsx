import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Favourite.css";

const Favourite = () => {
  const [favouriteProducts, setFavouriteProducts] = useState([]); // تخزين المنتجات المفضلة
  const [loading, setLoading] = useState(true); // حالة التحميل
  const [error, setError] = useState(null); // حالة الخطأ

  useEffect(() => {
    const fetchFavouriteProducts = async () => {
      const userId = localStorage.getItem("userId"); // جلب user_id من الـ localStorage

      if (!userId) {
        setError("Please log in to view your favourite products.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/wishlist/${userId}`, // جلب البيانات من API باستخدام user_id
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`, // إرسال الـ authToken في الـ header
            },
          }
        );

        if (response.status === 200) {
          setFavouriteProducts(response.data); // تخزين المنتجات المفضلة في الـ state
        } else {
          setError("Failed to fetch favourite products.");
        }
      } catch (error) {
        console.error("Error fetching favourite products", error);
        setError("An error occurred while fetching your favourite products.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavouriteProducts(); // استدعاء دالة جلب المنتجات عند تحميل الصفحة
  }, []); // التأكد من جلب البيانات عند أول تحميل للمكون فقط

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="favourite-page">
      <h1>Your Favourite Products</h1>
      {favouriteProducts.length > 0 ? (
        <div className="favourite-products-list">
          {favouriteProducts.map((product) => (
            <div key={product.id} className="favourite-product">
              {/* عرض الصورة الأولى من مجموعة الصور */}
              <img
                src={product.images && product.images[0]}
                alt={product.name}
                className="favourite-product-image"
              />
              <h3 className="favourite-product-name">{product.name}</h3>
              <p className="favourite-product-description">
                {product.description}
              </p>{" "}
              {/* عرض الوصف */}
              <p className="favourite-product-price">${product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>No favourite products yet.</div>
      )}
    </div>
  );
};

export default Favourite;
