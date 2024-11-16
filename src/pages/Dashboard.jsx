import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CSS/Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [categories, setCategories] = useState([]);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category_id: "",
    images: [],
  });
  const [products, setProducts] = useState([]); // لتخزين المنتجات
  const [message, setMessage] = useState("");
  const [showCategories, setShowCategories] = useState(false);
  const [showProducts, setShowProducts] = useState(false); // لعرض المنتجات
  const [promoCodes, setPromoCodes] = useState([]);
  const [newPromoCode, setNewPromoCode] = useState({
    code: "",
    discount_percentage: "",
    expiry_date: "",
  });
  useEffect(() => {
    // جلب الدور من localStorage أو من أي مصدر آخر
    const role = localStorage.getItem("userRole");
    setUserRole(role);

    // إذا كان الدور ليس "admin"، توجيه المستخدم إلى صفحة أخرى
    if (role !== "admin") {
      navigate("/Shop"); // التوجيه إلى صفحة المتجر أو أي صفحة أخرى
    }
  }, [navigate]);
  // دالة لجلب الفئات من الـ API
  const fetchCategories = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/categories");
      setCategories(response.data);
    } catch (error) {
      console.error("Error fetching categories", error);
      setMessage("Error fetching categories. Please try again.");
    }
  };

  // دالة لجلب جميع المنتجات من الـ API
  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products", error);
      setMessage("Error fetching products. Please try again.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // دالة لإضافة الفئة الجديدة
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/categories", {
        name: categoryName,
      });
      setMessage("Category added successfully!");
      setCategoryName("");
      fetchCategories();
    } catch (error) {
      console.error("Error adding category", error);
      setMessage("Error adding category. Please try again.");
    }
  };

  // دالة لحذف منتج بناءً على الـ ID
  const handleDeleteProduct = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/products/${id}`);
      setMessage("Product deleted successfully!");
      fetchProducts(); // لتحديث قائمة المنتجات بعد الحذف
    } catch (error) {
      console.error("Error deleting product", error);
      setMessage("Error deleting product. Please try again.");
    }
  };

  const handleCategoryChange = (e) => {
    setCategoryName(e.target.value);
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData({
      ...productData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + productData.images.length <= 5) {
      setProductData({
        ...productData,
        images: [...productData.images, ...files],
      });
    } else {
      setMessage("You can upload a maximum of 5 images.");
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = productData.images.filter((_, i) => i !== index);
    setProductData({
      ...productData,
      images: updatedImages,
    });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    Object.keys(productData).forEach((key) => {
      if (key === "images") {
        productData.images.forEach((image) => {
          formData.append("images[]", image);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/products",
        formData
      );
      setMessage("Product added successfully!");
      setProductData({
        name: "",
        description: "",
        price: "",
        stock: "",
        category_id: "",
        images: [],
      });
    } catch (error) {
      console.error("Error adding product", error);
      setMessage("Error adding product. Please try again.");
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/categories/${id}`);
      setMessage("Category deleted successfully!");
      fetchCategories();
    } catch (error) {
      console.error("Error deleting category", error);
      setMessage("Error deleting category. Please try again.");
    }
  };

  const handleShowCategories = () => {
    setShowCategories((prevState) => !prevState); // التبديل بين true و false
    if (!showCategories) fetchCategories(); // جلب الفئات فقط عند عرضها
  };

  const handleShowProducts = () => {
    setShowProducts((prevState) => !prevState); // التبديل بين true و false
    if (!showProducts) fetchProducts(); // جلب المنتجات فقط عند عرضها
  };

  const handlePromoCodeChange = (e) => {
    const { name, value } = e.target;
    setNewPromoCode({
      ...newPromoCode,
      [name]: value,
    });
  };

  const handleSubmitPromoCode = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/api/promo-codes/add", {
        code: newPromoCode.code,
        discount_percentage: newPromoCode.discount_percentage,
        expiry_date: newPromoCode.expiry_date,
      });
      setMessage("Promo code added successfully!");
      setNewPromoCode({
        code: "",
        discount_percentage: "",
        expiry_date: "",
      });
    } catch (error) {
      console.error("Error adding promo code", error);
      setMessage("Error adding promo code. Please try again.");
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <h1>{"DASHBOARD"}</h1>
        {/* محتوى الداشبورد الخاص بالمستخدمين الذين لديهم دور admin */}
        {userRole === "admin" && (
          <div>
            <p>{"WELCOME_TO_ADMIN_DASHBOARD"}</p>
            {/* محتوى الـ Dashboard الذي يخص الـ admin */}
          </div>
        )}
      </div>
      <h1>Add Category</h1>
      <form onSubmit={handleCategorySubmit}>
        <input
          type="text"
          value={categoryName || ""}
          onChange={handleCategoryChange}
          placeholder="Enter category name"
          required
        />
        <button type="submit">Add Category</button>
      </form>
      {message && <div>{message}</div>}

      <button onClick={handleShowCategories} style={{ marginTop: "20px" }}>
        Show All Categories
      </button>
      <button onClick={handleShowProducts} style={{ marginTop: "20px" }}>
        Show All Products
      </button>

      {showCategories && categories.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Categories List</h2>
          <ul>
            {categories.map((category) => (
              <li key={category.id}>
                ID: {category.id} - Name: {category.name}
                <button
                  onClick={() => handleDeleteCategory(category.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showProducts && products.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <h2>Products List</h2>
          <ul>
            {products.map((product) => (
              <li key={product.id}>
                ID: {product.id} - Name: {product.name} - Price: {product.price}
                <button
                  onClick={() => handleDeleteProduct(product.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <h1>Add Product</h1>
      <form onSubmit={handleSubmitProduct}>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={productData.name}
          onChange={handleProductChange}
          required
        />
        <textarea
          name="description"
          placeholder="Product Description"
          value={productData.description}
          onChange={handleProductChange}
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Product Price"
          value={productData.price}
          onChange={handleProductChange}
          required
        />
        <input
          type="number"
          name="stock"
          placeholder="Product Stock"
          value={productData.stock}
          onChange={handleProductChange}
          required
        />
        <select
          name="category_id"
          value={productData.category_id}
          onChange={handleProductChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* مكون رفع الصور */}
        <input
          type="file"
          name="images"
          onChange={handleImageChange}
          accept="image/*"
          multiple
        />
        <div>
          {productData.images.map((image, index) => (
            <div key={index} style={{ marginTop: "10px" }}>
              <span>{image.name}</span>
              <button type="button" onClick={() => handleRemoveImage(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>

        <button type="submit">Add Product</button>
      </form>

      <h1>Add Promo Code</h1>
      <form onSubmit={handleSubmitPromoCode}>
        <input
          type="text"
          name="code"
          placeholder="Promo Code"
          value={newPromoCode.code}
          onChange={handlePromoCodeChange}
          required
        />
        <input
          type="number"
          name="discount_percentage"
          placeholder="Discount Percentage"
          value={newPromoCode.discount_percentage}
          onChange={handlePromoCodeChange}
          required
        />
        <input
          type="date"
          name="expiry_date"
          placeholder="Expiry Date"
          value={newPromoCode.expiry_date}
          onChange={handlePromoCodeChange}
          required
        />
        <button type="submit">Add Promo Code</button>
      </form>

      {message && <div>{message}</div>}
    </div>
  );
};

export default Dashboard;
