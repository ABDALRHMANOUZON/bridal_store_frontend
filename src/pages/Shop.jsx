import React from "react";
import { Routes, Route } from "react-router-dom";
// import ShopCategory from "./ShopCategory";
import Login from "./Login";
import Signup from "./signup";
import LeastedCollection from "./LeastedCollection";
import Hero from "../components/Hero/Hero";
import ShopCategory from "./ShopCategory";
import Favourite from "../components/Favourite/Favourite";

const Shop = () => {
  return (
    <>
      <Hero />
      <LeastedCollection />
      <ShopCategory />
      <Routes>
        <Route path="Login" element={<Login />} />
        <Route path="Singup" element={<Signup />} />
        <Route path="Favourite" element={<Favourite />} />
      </Routes>
    </>
  );
};

export default Shop;
