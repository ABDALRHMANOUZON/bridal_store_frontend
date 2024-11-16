import React, { useState, useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./ProductDisplay.css";
import { ShopContext } from "../context/ShopContext";
import axios from "axios";

const ProductDisplay = () => {
  const { t } = useTranslation(); // استخدام الترجمة
  const { id } = useParams(); // جلب الـ product id من الـ URL
  const { addToCart } = useContext(ShopContext);
  const [product, setProduct] = useState({});
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isFavorite, setIsFavorite] = useState(false);
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );

        setProduct(response.data);

        const categoryId = response.data.category_id;
        if (categoryId) {
          fetchRelatedProducts(categoryId);
        }

        checkIfFavorite(response.data.id);
      } catch (error) {
        setError("Error fetching product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const fetchRelatedProducts = async (categoryId) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/products/category/${categoryId}`
      );
      setRelatedProducts(response.data);
    } catch (error) {
      console.error("Error fetching related products", error);
    }
  };

  const checkIfFavorite = async (productId) => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/wishlist/check/${userId}/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setIsFavorite(response.data.is_favourite);
      } catch (error) {
        console.error("Error checking wishlist status", error);
      }
    }
  };

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((clientX - left) / width) * 100;
    const y = ((clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => setIsZoomed(false);

  const handleAddToCart = async () => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("Please log in to add the product to the cart");
      return;
    }

    try {
      await addToCart(product.id, quantity, userId);
      alert("Product added to cart successfully");
    } catch (error) {
      alert("An error occurred while adding the product to the cart");
    }
  };

  const handleToggleWishlist = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please log in to add to wishlist");
      return;
    }

    try {
      const requestBody = {
        user_id: userId,
        product_id: product.id,
      };

      let response;
      if (isFavorite) {
        response = await axios.delete(
          "http://127.0.0.1:8000/api/wishlist/remove",
          {
            data: requestBody,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://127.0.0.1:8000/api/wishlist/add",
          requestBody,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        setIsFavorite(!isFavorite);
        alert(isFavorite ? t("REMOVE_FROM_WISHLIST") : t("ADD_TO_WISHLIST"));
      }
    } catch (error) {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

  const handleThumbnailClick = (image) => {
    setMainImage(image);
  };

  if (loading) {
    return <div className="loading">{t("LOADING")}</div>;
  }

  if (error) {
    return <div className="error">{t("ERROR_FETCHING")}</div>;
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const mainImageSrc = mainImage || images[0];

  return (
    <div className="productdisplay">
      <div className="productdisplay-left">
        <div
          className="zoom-container"
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div>
            <h1>{t("CATEGORY", { category: product.category_name })}</h1>
          </div>
          {mainImageSrc && (
            <img
              src={mainImageSrc}
              alt={product.name}
              className={`large-image ${isZoomed ? "zoomed" : ""}`}
              style={{
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          )}
          {isZoomed && (
            <div
              className="zoom-indicator"
              style={{
                left: `${zoomPosition.x}%`,
                top: `${zoomPosition.y}%`,
              }}
            />
          )}
        </div>
        <div className="thumbnail-container">
          {images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`thumbnail-${index}`}
              className="thumbnail"
              onClick={() => handleThumbnailClick(image)}
            />
          ))}
        </div>
      </div>
      <div className="productdisplay-right">
        <h1 className="product-title">
          <span className="label">Name:</span> {product.name}
        </h1>
        <div className="product-price">
          <span className="label">Price:</span> {product.price}$
        </div>
        <div className="product-category">
          <span className="label">Category Name:</span> {product.category_name}
        </div>
        <div>
          <span className="label">Description:</span> {product.description}
        </div>
        <div className="product-description">
          <h2>{t("QUANTITY")}</h2>
          <div className="quantity-container">
            <button className="quantity-button" onClick={decreaseQuantity}>
              -
            </button>
            <input
              type="number"
              value={quantity}
              min="1"
              onChange={(e) =>
                setQuantity(Math.max(1, parseInt(e.target.value)))
              }
              className="quantity-input"
            />
            <button className="quantity-button" onClick={increaseQuantity}>
              +
            </button>
          </div>
          <button className="add-to-cart-button" onClick={handleAddToCart}>
            {t("ADD_TO_CART")}
          </button>
          <button
            className={`favourite-button ${isFavorite ? "added" : ""}`}
            onClick={handleToggleWishlist}
          >
            <i className={`fa${isFavorite ? "s" : "r"} fa-heart`}></i>
          </button>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <div className="related-products">
          <h2>{t("RELATED_PRODUCTS")}</h2>
          <div className="related-products-carousel">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="related-product-item">
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="related-product-image"
                />
                <h3>{relatedProduct.name}</h3>
                <p>{t("PRODUCT_PRICE", { price: relatedProduct.price })}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDisplay;
