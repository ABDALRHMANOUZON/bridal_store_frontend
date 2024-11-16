import React, { useState } from "react";
import "./Navbar.css";
import logoo from "../Assests/logoo.png";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const [menu, setMenu] = useState("shop");
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle state
  const navigate = useNavigate();

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
  };

  const handleLogoClick = () => {
    navigate("/shop");
  };

  return (
    <div className="Navbar bg-gray-900 shadow-lg text-white relative">
      {/* Mobile Sidebar */}
      <div className="lg:hidden flex items-center justify-between p-4">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="text-new-color"
        >
          <i className="fas fa-bars h-8 w-8"></i>
        </button>
        <img
          src={logoo}
          alt="Logo"
          className="h-16 w-16 cursor-pointer"
          onClick={handleLogoClick}
        />
        <div className="flex space-x-4">
          <button
            onClick={() => handleLanguageChange("en")}
            className="text-white hover:text-new-color"
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange("ar")}
            className="text-white hover:text-new-color"
          >
            العربية
          </button>
        </div>
        <div className="absolute top-4 right-4 flex items-center space-x-6">
          {/* Desktop Cart, Favourite, and Login */}
          <Link to="/favourite">
            <i className="fas fa-heart h-8 w-8 text-new-color cursor-pointer"></i>
          </Link>
          <Link to="/cart-item">
            <i className="fas fa-shopping-cart h-8 w-8 text-new-color cursor-pointer"></i>
          </Link>
          <Link to="/login">
            <i className="fas fa-user h-8 w-8 text-new-color cursor-pointer"></i>
          </Link>
        </div>
      </div>

      {/* Mobile Sidebar when open */}
      {isSidebarOpen && (
        <div className="fixed inset-y-0 left-0 bg-gray-900 w-64 p-4 z-50 lg:hidden">
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="text-new-color mb-4"
          >
            <i className="fas fa-times h-8 w-8"></i>
          </button>
          <ul className="space-y-4">
            <li
              className="relative"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <Link
                to="/bridal-crown"
                className="text-white hover:text-new-color transition duration-200"
              >
                {t("BRIDAL CROWN")}
              </Link>
              {showDropdown && (
                <ul className="bg-gray-800 text-white p-2 shadow-lg rounded mt-2">
                  <li>
                    <Link
                      to="/mini-2-5-3-5-cm"
                      className="block px-4 py-2 hover:text-new-color"
                    >
                      {t("MINI 2.5-3.5 CM")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/orta-3-5-5-cm"
                      className="block px-4 py-2 hover:text-new-color"
                    >
                      {t("ORTA 3.5-5 CM")}
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/yuksek-5-9-cm"
                      className="block px-4 py-2 hover:text-new-color"
                    >
                      {t("YÜKSEK 5-9 CM")}
                    </Link>
                  </li>
                </ul>
              )}
            </li>
            {/* Other links */}
            {[
              "hair-band",
              "colorful-crowns-collection",
              "party-collection",
              "hair-clips",
              "engagement-and-promise-accessories",
              "jewelry-sets",
              "zircon-earrings",
            ].map((item) => (
              <li key={item}>
                <Link
                  to={`/${item}`}
                  className="text-white hover:text-new-color transition duration-200"
                >
                  {t(item.replace(/-/g, " ").toUpperCase())}
                </Link>
              </li>
            ))}
            {/* Mobile cart, favourite, and login */}
            <li className="mt-4">
              <Link to="/favourite" className="text-white hover:text-new-color">
                <i className="fas fa-heart h-8 w-8 text-new-color"></i>
                {t("Favourite")}
              </Link>
            </li>
            <li>
              <Link to="/cart-item" className="text-white hover:text-new-color">
                <i className="fas fa-shopping-cart h-8 w-8 text-new-color"></i>
                {t("Cart")}
              </Link>
            </li>
            <li>
              <Link to="/login" className="text-white hover:text-new-color">
                <i className="fas fa-user h-8 w-8 text-new-color"></i>
                {t("Login")}
              </Link>
            </li>
          </ul>
        </div>
      )}

      {/* Desktop Navigation */}
      <div className="hidden lg:flex flex-col items-center mt-4">
        <div
          onClick={handleLogoClick}
          className="flex items-center justify-center mb-4"
        >
          <img src={logoo} alt="Logo" className="h-16 w-16 cursor-pointer" />
        </div>
        <ul className="flex space-x-6 justify-center items-center">
          <li
            onMouseEnter={() => setShowDropdown(true)}
            onMouseLeave={() => setShowDropdown(false)}
            className="relative"
          >
            <Link
              to="/bridal-crown"
              className="text-white hover:text-new-color transition duration-200"
            >
              {t("BRIDAL CROWN")}
            </Link>
            {showDropdown && (
              <ul className="absolute mt-2 bg-gray-800 text-white p-2 shadow-lg rounded">
                <li>
                  <Link
                    to="/mini-2-5-3-5-cm"
                    className="block px-4 py-2 hover:text-new-color"
                  >
                    {t("MINI 2.5-3.5 CM")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/orta-3-5-5-cm"
                    className="block px-4 py-2 hover:text-new-color"
                  >
                    {t("ORTA 3.5-5 CM")}
                  </Link>
                </li>
                <li>
                  <Link
                    to="/yuksek-5-9-cm"
                    className="block px-4 py-2 hover:text-new-color"
                  >
                    {t("YÜKSEK 5-9 CM")}
                  </Link>
                </li>
              </ul>
            )}
          </li>
          {["hair-band", "colorful-crowns-collection", "party-collection"].map(
            (item) => (
              <li key={item}>
                <Link
                  to={`/${item}`}
                  className="text-white hover:text-new-color transition duration-200"
                >
                  {t(item.replace(/-/g, " ").toUpperCase())}
                </Link>
              </li>
            )
          )}
        </ul>
        <ul className="flex space-x-6 justify-center items-center mt-4">
          {[
            "hair-clips",
            "engagement-and-promise-accessories",
            "jewelry-sets",
            "zircon-earrings",
          ].map((item) => (
            <li key={item}>
              <Link
                to={`/${item}`}
                className="text-white hover:text-new-color transition duration-200"
              >
                {t(item.replace(/-/g, " ").toUpperCase())}
              </Link>
            </li>
          ))}
        </ul>
        <div className="absolute top-4 right-4 flex items-center space-x-6">
          {/* Desktop Cart, Favourite, and Login */}
          <Link to="/favourite">
            <i className="fas fa-heart h-8 w-8 text-new-color cursor-pointer"></i>
          </Link>
          <Link to="/cart-item">
            <i className="fas fa-shopping-cart h-8 w-8 text-new-color cursor-pointer"></i>
          </Link>
          <Link to="/login">
            <i className="fas fa-user h-8 w-8 text-new-color cursor-pointer"></i>
          </Link>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => handleLanguageChange("en")}
            className="text-white hover:text-new-color"
          >
            English
          </button>
          <button
            onClick={() => handleLanguageChange("ar")}
            className="text-white hover:text-new-color"
          >
            العربية
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
