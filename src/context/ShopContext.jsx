import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]); // تأكد من أنها مصفوفة بشكل افتراضي
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const userId = localStorage.getItem("userId");

  // جلب المنتجات
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  // جلب بيانات السلة
  const fetchCartItems = async (userId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/cart/get/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // تحقق من أن البيانات المسترجعة هي مصفوفة
      if (Array.isArray(response.data) && response.data.length > 0) {
        setCartItems(response.data);
      } else {
        setCartItems([]); // تعيين سلة فارغة إذا كانت البيانات غير صحيحة أو فارغة
        console.log("No items in cart", response.data);
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      setCartItems([]); // تعيين سلة فارغة في حال حدوث خطأ
    }
  };

  // إضافة منتج إلى السلة
  const addToCart = async (productId, quantity) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/cart/add",
        {
          product_id: productId,
          quantity,
          user_id: userId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        fetchCartItems(userId); // تحديث السلة بعد إضافة المنتج
      } else {
        console.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
    }
  };
  const removeItemFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  // حساب عدد العناصر في السلة
  // const getTotalCartItems = () => {
  //   if (Array.isArray(cartItems)) {
  //     return cartItems.reduce((total, item) => total + item.quantity, 0);
  //   }
  //   return 0; // إرجاع 0 إذا كانت cartItems غير مصفوفة
  // };

  const contextValue = {
    products,
    setToken,
    userRole,
    addToCart,
    userId,
    // fetchCartItems,
    cartItems,
    // getTotalCartItems,
    removeItemFromCart,
  };

  return (
    <ShopContext.Provider value={contextValue}>{children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
