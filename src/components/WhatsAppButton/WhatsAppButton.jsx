// src/components/WhatsAppButton.js
import React from "react";
import { FaWhatsapp } from "react-icons/fa"; // استيراد أيقونة WhatsApp من react-icons
import "./WhatsAppButton.css"; // استيراد ملف CSS لتنسيق الزر

const WhatsAppButton = () => {
  // رقم الهاتف الذي تريد التواصل معه عبر WhatsApp (استبدله برقمك الخاص)
  const phoneNumber = "+905314878676"; // استبدل هذا برقمك على WhatsApp

  // الرابط المباشر إلى WhatsApp باستخدام الرقم
  const whatsappLink = `https://wa.me/${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-button"
    >
      <FaWhatsapp size={30} /> {/* الأيقونة الخاصة بـ WhatsApp */}
    </a>
  );
};

export default WhatsAppButton;
