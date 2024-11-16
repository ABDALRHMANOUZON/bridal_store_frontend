import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next"; // استيراد دالة الترجمة
import "./CSS/Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const { t } = useTranslation(); // استخدام الترجمة

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const role = localStorage.getItem("userRole");
    if (token && role) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/login", {
        email,
        password,
      });
      const token = response.data.access_token;
      if (token) {
        localStorage.setItem("authToken", token);
        const userResponse = await axios.get(
          "http://127.0.0.1:8000/api/auth/me",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const { id, role } = userResponse.data;
        localStorage.setItem("userId", id);
        localStorage.setItem("userRole", role);
        setIsLoggedIn(true);
        setMessage(t("LOGIN_SUCCESS"));
        if (role === "admin") {
          navigate("/dashboard");
        } else if (role === "user") {
          navigate("/Shop");
        }
      } else {
        setMessage(t("TOKEN_MISSING"));
      }
    } catch (error) {
      console.error("Error logging in", error.response?.data);
      setMessage(error.response?.data?.message || t("LOGIN_ERROR"));
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        setMessage(t("NO_AUTH_TOKEN"));
        return;
      }

      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // مسح التخزين المحلي عند تسجيل الخروج
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("userRole");
      setIsLoggedIn(false); // تعيين حالة تسجيل الدخول إلى false

      setMessage(t("LOGOUT_SUCCESS"));
      navigate("/Shop");
    } catch (error) {
      console.error("Error logging out", error);
      if (error.response) {
        setMessage(error.response.data?.message || t("LOGOUT_ERROR"));
      } else {
        setMessage(t("LOGOUT_ERROR"));
      }
    }
  };

  return (
    <div className="login-container">
      <h1>{isLoggedIn ? t("LOGOUT") : t("LOGIN")}</h1>
      {!isLoggedIn && (
        <form onSubmit={handleLogin} className="loginsignup-fields">
          <div className="form-group">
            <label>{t("EMAIL")}</label>
            <input
              type="email"
              placeholder={t("EMAIL")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <label>{t("PASSWORD")}</label>
            <input
              type="password"
              placeholder={t("PASSWORD")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">{t("LOGIN_BUTTON")}</button>
          </div>
        </form>
      )}
      {message && <div className="loginsignup-message">{message}</div>}
      {isLoggedIn && <button onClick={handleLogout}>{t("LOGOUT")}</button>}
      {!isLoggedIn && (
        <div className="signup-link">
          {t("SIGNUP_PROMPT")} <Link to="/signup">{t("SIGNUP_PROMPT")}</Link>
        </div>
      )}
    </div>
  );
};

export default Login;
