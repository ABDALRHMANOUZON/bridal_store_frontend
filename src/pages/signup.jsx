import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // استيراد دالة الترجمة
import "./CSS/signup.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    age: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user", // أو "admin"
  });

  const [message, setMessage] = useState(""); // لعرض رسائل الخطأ أو النجاح
  const navigate = useNavigate(); // تهيئة useNavigate
  const { t } = useTranslation(); // استخدام الترجمة

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData); // تسجيل البيانات قبل إرسالها

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/register",
        formData
      );
      console.log(response.data); // تسجيل بيانات الاستجابة

      // عرض رسالة النجاح والتحويل إلى صفحة الدخول بعد فترة قصيرة
      setMessage(t("SIGNUP_SUCCESS"));
      setTimeout(() => navigate("/login"), 2000); // تأخير التحويل لإظهار الرسالة
    } catch (error) {
      console.error("Error registering user", error.response?.data); // تسجيل تفاصيل الخطأ

      // التعامل مع رسائل الخطأ من الخادم
      const errorData = error.response?.data?.errors;
      let errorMessage = t("SIGNUP_ERROR");

      if (errorData) {
        errorMessage = Object.entries(errorData)
          .map(([field, messages]) => `${field}: ${messages.join(", ")}`)
          .join("; ");
      }

      setMessage(errorMessage); // عرض رسالة الخطأ التفصيلية
    }
  };

  return (
    <div className="signup">
      <div className="signup-container">
        <h1>{t("SIGNUP")}</h1>
        <form className="signup-fields" onSubmit={handleSubmit}>
          <input
            type="text"
            name="first_name"
            placeholder={t("FIRST_NAME")}
            value={formData.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder={t("LAST_NAME")}
            value={formData.last_name}
            onChange={handleChange}
          />
          <input
            type="number"
            name="age"
            placeholder={t("AGE")}
            value={formData.age}
            onChange={handleChange}
          />
          <input
            type="email"
            name="email"
            placeholder={t("EMAIL")}
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder={t("PASSWORD")}
            value={formData.password}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password_confirmation"
            placeholder={t("PASSWORD_CONFIRMATION")}
            value={formData.password_confirmation}
            onChange={handleChange}
          />
          <button type="submit">{t("SIGNUP_BUTTON")}</button>
        </form>
        {message && <div className="signup-message">{message}</div>}{" "}
        {/* عرض رسالة الخطأ أو النجاح */}
        <div className="signup-login">
          {t("SIGNUP_EXIST")} <a href="/login">{t("SIGNUP_EXIST")}</a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
