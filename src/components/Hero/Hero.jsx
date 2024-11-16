import React from "react";
import "./Hero.css";
import k from "../Assests/photo_2024-10-30_04-57-08.jpg";
import kk from "../Assests/photo_2024-10-30_04-57-24.jpg";
import kkk from "../Assests/photo_2024-10-30_04-57-31.jpg";
import kkkk from "../Assests/photo_2024-10-30_04-57-38.jpg";
import kkkkk from "../Assests/photo_2024-10-30_04-57-46.jpg";

const Hero = () => {
  return (
    <div className="hero">
      <img src={k} alt="Large Image 1" className="large-image" />
      <img src={kk} alt="Large Image 2" className="large-image" />
      <img src={kkk} alt="Small Image 1" className="large-image" />
      <img src={kkkk} alt="Small Image 2" className="small-image" />
      <img src={kkkkk} alt="Small Image 3" className="small-image" />
    </div>
  );
};

export default Hero;
