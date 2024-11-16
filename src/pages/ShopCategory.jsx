import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import axios from "axios";
import "./CSS/ShopCategory.css";
import Item from "../components/Item/Item";

const ShopCategory = ({ categoryId, banner }) => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      setLoading(true);
      try {
        // جلب بيانات الفئة
        const categoryResponse = await axios.get(
          `http://127.0.0.1:8000/api/categories/${categoryId}`
        );
        setCategory(categoryResponse.data);

        // جلب المنتجات بناءً على الفئة
        const productsResponse = await axios.get(
          `http://127.0.0.1:8000/api/products/category/${categoryId}`
        );
        setProducts(productsResponse.data);
      } catch (error) {
        console.error("There was an error fetching the data!", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryAndProducts();
    }
  }, [categoryId]);

  const handleDelete = async (productId) => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product.id !== productId)
      );
    } catch (error) {
      console.error("There was an error deleting the product!", error);
    }
  };

  return (
    <div className="shop-category">
      {/* <img className="Shopcategory-banner" src={banner} alt="Category Banner" /> */}
      {category && (
        <div className="Shopcategory-header">
          <h2>{category.name}</h2>
          <p>{category.description}</p>
        </div>
      )}
      <div className="Shopcategory-indexsort"></div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="ShopCategory-product">
          {products.map((item) => {
            // تحديد أول صورتين من المصفوفة images
            const images = Array.isArray(item.images)
              ? item.images.slice(0, 2)
              : [];

            return (
              <Item
                key={item.id}
                id={item.id}
                name={item.name || "No Name"}
                images={images} // إرسال الصور كـ مصفوفة
                description={item.description || "No Description"}
                price={item.price ? `${item.price}` : "0 USD"}
                supplier={item.supplier ? item.supplier.name : "No Supplier"}
                onDelete={() => handleDelete(item.id)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopCategory;
