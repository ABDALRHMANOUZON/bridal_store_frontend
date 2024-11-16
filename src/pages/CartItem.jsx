import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { ShopContext } from "../context/ShopContext";
import { useTranslation } from "react-i18next"; // استيراد دالة الترجمة
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // استيراد أيقونة "X"
import "./CSS/CartItem.css"; // استيراد ملف CSS لتنسيق الواجهة

const CartItems = () => {
  const { userId } = useContext(ShopContext); // تأكد من أن userId موجود في سياق المتجر
  const [cartData, setCartData] = useState(null);
  const [message, setMessage] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState("");
  const [checkoutMessage, setCheckoutMessage] = useState(""); // رسالة تأكيد الشراء

  const { t } = useTranslation(); // استخدام الترجمة

  // جلب البيانات من الـ API
  useEffect(() => {
    const fetchCartData = async () => {
      if (!userId) {
        setMessage(t("USER_ID_MISSING"));
        return;
      }

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/cart/get/${userId}`
        );

        if (response.data && response.data.cart_items.length > 0) {
          setCartData(response.data); // حفظ البيانات في حالة cartData
        } else {
          setMessage(t("NO_ITEMS_IN_CART"));
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
        setMessage(t("FAILED_FETCH_CART"));
      }
    };

    fetchCartData();
  }, [userId, t]);

  // حساب المجموع الكلي
  const calculateTotalAmount = () => {
    return (
      cartData?.cart_items.reduce((acc, item) => {
        return acc + parseFloat(item.price) * item.quantity;
      }, 0) || 0
    );
  };

  const totalAmount = calculateTotalAmount();

  // دالة لتطبيق كود الخصم
  const handlePromoCodeChange = (e) => {
    setPromoCode(e.target.value); // حفظ كود الخصم في الـ state
  };

  const applyPromoCode = async () => {
    if (!promoCode) {
      setPromoMessage(t("ENTER_PROMO_CODE"));
      return;
    }

    try {
      // إرسال الطلب إلى API مع "order_id" و "code"
      const response = await axios.post(
        `http://127.0.0.1:8000/api/promo-codes/apply/`,
        { order_id: cartData.order_id, code: promoCode }
      );

      // إذا تم تطبيق الخصم بنجاح
      if (response.data.new_total_amount) {
        // تحديث المجموع الكلي بعد تطبيق الخصم
        setCartData((prevData) => ({
          ...prevData,
          total_amount: response.data.new_total_amount, // المجموع الكلي الجديد
        }));

        setPromoMessage(
          `${t("PROMO_CODE_APPLIED")} ${
            response.data.discount_percentage
          }% - ${t("NEW_TOTAL")} ${response.data.new_total_amount.toFixed(2)}`
        );
      } else {
        setPromoMessage(t("INVALID_PROMO_CODE"));
      }
    } catch (error) {
      console.error("Error applying promo code", error);
      setPromoMessage(t("FAILED_APPLY_PROMO"));
    }
  };

  // دالة لمعالجة عملية Checkout
  const handleCheckout = async () => {
    if (!cartData || !cartData.cart_items.length) {
      setCheckoutMessage(t("CART_EMPTY"));
      return;
    }

    // استخدم المجموع الكلي بعد تطبيق الخصم
    const totalAmount = parseFloat(cartData.total_amount); // تأكد من أن المجموع هو رقم صحيح

    if (isNaN(totalAmount) || totalAmount <= 0) {
      setCheckoutMessage(t("INVALID_TOTAL_AMOUNT"));
      return;
    }

    console.log(
      "Processing checkout for User ID:",
      userId,
      "with total amount:",
      totalAmount
    );

    try {
      // إرسال المجموع الكلي فقط مع الـ userId
      const response = await axios.post(
        `http://127.0.0.1:8000/api/orders/checkout/${userId}`,
        { total_amount: totalAmount } // إرسال المجموع الكلي فقط
      );

      if (response.status === 200) {
        setCheckoutMessage(t("ORDER_PLACED_SUCCESSFULLY"));
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      setCheckoutMessage(t("FAILED_PLACE_ORDER"));
      if (error.response) {
        console.log(error.response.data);
      }
    }
  };

  // دالة لحذف منتج من السلة
  const removeFromCart = async (itemId) => {
    if (!userId) {
      setMessage(t("USER_ID_MISSING"));
      return;
    }

    if (!itemId) {
      setMessage(t("PRODUCT_ID_MISSING"));
      return;
    }

    try {
      // تحديث الواجهة لإزالة المنتج فورًا
      setCartData((prevData) => ({
        ...prevData,
        cart_items: prevData.cart_items.filter(
          (item) => item.item_id !== itemId
        ),
      }));

      console.log("Removing product with ID:", itemId); // تأكد من أن الـ itemId صحيح

      // استخدام طريقة DELETE بدلاً من POST
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/cart/remove`,
        {
          data: {
            user_id: userId,
            item_id: itemId,
          },
        }
      );

      if (response.data.message === "Item removed from cart") {
        setMessage(t("PRODUCT_REMOVED_SUCCESSFULLY"));
      } else {
        setMessage(t("FAILED_REMOVE_PRODUCT"));
        // في حال فشل الحذف من السيرفر، أعد المنتج إلى السلة
        setCartData((prevData) => ({
          ...prevData,
          cart_items: [...prevData.cart_items],
        }));
      }
    } catch (error) {
      console.error("Error removing product from cart:", error);
      setMessage(t("FAILED_REMOVE_PRODUCT"));
      // في حال حدوث خطأ، أعد المنتج إلى السلة
      setCartData((prevData) => ({
        ...prevData,
        cart_items: [...prevData.cart_items],
      }));
    }
  };

  return (
    <div className="cart-container">
      <h1 className="cart-title">{t("CART_ITEMS")}</h1>
      {message && <p className="error-message">{message}</p>}
      {cartData ? (
        <div className="cart-details">
          <h2>
            {t("ORDER_ID")}: {cartData.order_id}
          </h2>
          {isNaN(totalAmount) ? (
            <p>{t("INVALID_TOTAL_AMOUNT")}</p>
          ) : (
            <p className="total-amount">
              {t("TOTAL_AMOUNT")}: ${totalAmount.toFixed(2)}
            </p>
          )}

          {/* عرض العناصر في السلة */}
          {cartData.cart_items.map((item, index) => (
            <div key={index} className="cart-item">
              <div className="item-header">
                <h3>{item.name}</h3>
                <p className="item-price">
                  {t("PRICE")}: ${item.price}
                </p>
              </div>
              <p>{item.description}</p>
              <p>
                {t("CATEGORY")}: {item.category_name}
              </p>
              <p>
                {t("QUANTITY")}: {item.quantity}
              </p>

              {/* عرض الصور */}
              <div className="product-images">
                {item.images && item.images.length > 0 ? (
                  item.images
                    .slice(0, 5)
                    .map((image, imageIndex) => (
                      <img
                        key={imageIndex}
                        src={image}
                        alt={`Product Image ${imageIndex + 1}`}
                        className="product-image"
                      />
                    ))
                ) : (
                  <p>{t("NO_IMAGES_AVAILABLE")}</p>
                )}
              </div>

              {/* عرض أيقونة الحذف */}
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.item_id)} // التأكد من استخدام الـ item.id الصحيح
              >
                <FontAwesomeIcon icon={faTimes} className="remove-icon" />
              </button>
            </div>
          ))}

          {/* إدخال كود الخصم */}
          <div className="promo-code">
            <input
              type="text"
              value={promoCode}
              onChange={handlePromoCodeChange}
              placeholder={t("ENTER_PROMO_CODE")}
            />
            <button className="apply-btn" onClick={applyPromoCode}>
              {t("APPLY_PROMO_CODE")}
            </button>
            {promoMessage && <p className="promo-message">{promoMessage}</p>}
          </div>

          {/* زر Checkout */}
          <div className="checkout">
            <button className="checkout-btn" onClick={handleCheckout}>
              {t("CHECKOUT")}
            </button>
            {checkoutMessage && (
              <p className="checkout-message">{checkoutMessage}</p>
            )}
          </div>
        </div>
      ) : (
        <p>{t("LOADING_CART")}</p>
      )}
    </div>
  );
};

export default CartItems;
