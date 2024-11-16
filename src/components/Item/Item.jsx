import React, { useState } from "react";
import { useTranslation } from "react-i18next"; // استيراد الدالة لاستخدام الترجمة
import "./Item.css";
import { Link } from "react-router-dom";
import defaultImage from "../Assests/coffee.jpg"; // صورة افتراضية إذا لم تتوفر الصور

const Item = ({ id, name, images, description, price }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation(); // دالة الترجمة

  // تحقق مما إذا كانت الصور موجودة
  const hasImages = Array.isArray(images) && images.length > 0;

  // حدد الصورة الرئيسية والصورة عند التمرير (hover)
  const primaryImage = hasImages && images[0] ? images[0] : defaultImage; // الصورة الأولى كصورة رئيسية
  const hoverImage = hasImages && images[1] ? images[1] : primaryImage; // الصورة الثانية كصورة hover أو نفس الصورة الأولى

  // تتبع الحالة عندما يمرر الماوس فوق الصورة
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <div className="item">
      <h3>{name || t("NO_NAME")}</h3> {/* الترجمة لاسم المنتج */}
      <Link to={`/productDisplay/${id}`}>
        <img
          src={isHovered ? hoverImage : primaryImage} // عرض الصورة الثانية إذا تم تمرير الماوس
          alt={name}
          className="zoomable-image"
          onMouseEnter={handleMouseEnter} // عند تمرير الماوس
          onMouseLeave={handleMouseLeave} // عند مغادرة الماوس
        />
      </Link>
      <p>{description || t("NO_DESCRIPTION")}</p> {/* الترجمة للوصف */}
      <p className="item-price">
        {price ? `${price} ${t("USD")}` : t("PRICE_NOT_AVAILABLE")}{" "}
        {/* الترجمة للسعر */}
      </p>
    </div>
  );
};

export default Item;
