import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next"; // استيراد الترجمة
import "./Footer.css";
import logoo from "../Assests/logoo.png";
import instgram from "../Assests/instgram.jpg";
import pinterest from "../Assests/pinterest.png";
import whatsapp from "../Assests/whatsapp.jpg";

const Footer = () => {
  const { t } = useTranslation(); // استخدام الترجمة

  return (
    <div className="footer">
      <div className="footer-logo">
        <img src={logoo} alt="Shopper Logo" />
        <p>SHOPPER</p>
      </div>
      <ul className="footer-links">
        <li>{t("COMPANY")}</li>
        <li>
          <Link
            to="/about"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            {t("ABOUT")}
          </Link>
        </li>
        <li>{t("CONTACT")}</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icon-container">
          <a
            href="https://www.instagram.com/royal.crown.acc?igsh=cHQ4a29yb3A3aG96"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instgram} alt={t("INSTAGRAM")} />
          </a>
        </div>
        <div className="footer-icon-container">
          <img src={pinterest} alt={t("PINTEREST")} />
        </div>
        <div className="footer-icon-container">
          <a
            href="https://wa.me/+905314878676"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={whatsapp} alt={t("WHATSAPP")} />
          </a>
        </div>
      </div>
      <div className="footer-cppyright">
        <hr />
        <p>{t("COPYRIGHT")}</p>
      </div>
    </div>
  );
};

export default Footer;
