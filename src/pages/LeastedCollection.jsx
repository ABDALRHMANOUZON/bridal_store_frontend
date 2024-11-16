import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // استيراد دالة الترجمة

const LeastedCollection = () => {
  const { t } = useTranslation(); // استخدام الترجمة
  const [products, setProducts] = useState([]); // لتخزين المنتجات
  const [loading, setLoading] = useState(true); // لتخزين حالة التحميل
  const [error, setError] = useState(null); // لتخزين الأخطاء
  const [hoveredImage, setHoveredImage] = useState({}); // لتخزين الصور المعروضة لكل منتج

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/products/last-products/4"
        );
        setProducts(response.data); // تخزين المنتجات
      } catch (error) {
        setError(error); // تخزين الخطأ في حالة حدوثه
      } finally {
        setLoading(false); // إيقاف التحميل
      }
    };
    fetchLatestProducts(); // استدعاء الوظيفة
  }, []);

  if (loading) return <p className="text-center text-white">{t("LOADING")}</p>;
  if (error)
    return (
      <p className="text-center text-red-500">
        {t("ERROR_FETCHING", { message: error.message })}
      </p>
    );

  // التعامل مع التمرير فوق الصورة وتغيير الصورة المعروضة
  const handleMouseEnter = (id, hoverImage) => {
    setHoveredImage((prevState) => ({
      ...prevState,
      [id]: hoverImage, // عند التمرير فوق الصورة، تغيير الصورة للهوفر
    }));
  };

  const handleMouseLeave = (id, mainImage) => {
    setHoveredImage((prevState) => ({
      ...prevState,
      [id]: mainImage, // العودة للصورة الرئيسية عند مغادرة الماوس
    }));
  };

  return (
    <div
      className="latest-collection"
      style={{ backgroundColor: "#2a2a2a", color: "white" }}
    >
      <h2 className="text-3xl font-bold mb-8 text-center">
        {t("LATEST_COLLECTION")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
        {products.map((product) => {
          const images = Array.isArray(product.images)
            ? product.images.slice(0, 2) // أخذ أول صورتين فقط
            : [];
          const mainImage = images[0] || ""; // الصورة الأساسية
          const hoverImage = images[1] || mainImage; // الصورة الثانية

          // نحدد الصورة الحالية عند التمرير
          const currentImage = hoveredImage[product.id] || mainImage;

          return (
            <div
              key={product.id}
              className="flex flex-col items-center p-4 bg-gray-800 rounded-lg shadow-md"
            >
              <Link to={`/ProductDisplay/${product.id}`}>
                <div
                  className="relative w-full h-64 mb-3 rounded-md"
                  onMouseEnter={() => handleMouseEnter(product.id, hoverImage)}
                  onMouseLeave={() => handleMouseLeave(product.id, mainImage)}
                >
                  {/* عرض الصورة الحالية */}
                  <img
                    src={currentImage}
                    alt={product.name}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              </Link>
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <p
                className="text-md font-bold"
                style={{ color: "#B76E79" }} // تطبيق اللون الجديد هنا
              >
                {t("PRODUCT_PRICE", { price: product.price })}
              </p>
              <p className="text-sm text-gray-400">{product.category_name}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LeastedCollection;
