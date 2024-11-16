import React from "react";
import "./About.css";
import { useTranslation } from "react-i18next";
const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about">
      <h1>{t("ABOUT US")}</h1>
      <p>{t("WELCOME TO OUR APPLICATION")}</p>
      <p>
        {t("WE ARE DEDICATED TO PROVIDING YOU WITH THE BEST SERVICE POSSIBLE")}
      </p>
      <p>
        {t(
          "OUR TEAM IS PASSIONATE ABOUT DELIVERING HIGH-QUALITY PRODUCTS AND ENSURING A GREAT USER EXPERIENCE"
        )}
      </p>
      <p>{t("FOR ANY INQUIRIES OR SUPPORT")}</p>
      <p>{t("PLEASE FEEL FREE TO CONTACT US THROUGH OUR CONTACT PAGE")}</p>
    </div>
  );
};

export default About;
