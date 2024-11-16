import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/signup";
import Favourite from "./components/Favourite/Favourite";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import ShopCategory from "./pages/ShopCategory";
import Product from "./pages/Product";
import Shop from "./pages/Shop";
import Dashboard from "./pages/Dashboard";
import LatestCollection from "./pages/LeastedCollection";
import ProductDisplay from "./ProductDisplay/ProductDisplay";
import CartItem from "./pages/CartItem";
import About from "./About/About";
import WhatsAppButton from "./components/WhatsAppButton/WhatsAppButton";
import "./i18n";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Shop />} />
        <Route path="/shop/*" element={<Shop />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/product/:productId" element={<Product />} />
        <Route path="/latest-collection" element={<LatestCollection />} />
        <Route path="/productdisplay/:id" element={<ProductDisplay />} />
        <Route path="/cart-item" element={<CartItem />} />
        <Route path="/favourite" element={<Favourite />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/bridal-crown"
          element={<ShopCategory categoryId="22" />}
        />
        <Route
          path="/mini-2-5-3-5-cm"
          element={<ShopCategory categoryId="4" />}
        />
        <Route
          path="/orta-3-5-5-cm"
          element={<ShopCategory categoryId="5" />}
        />
        <Route
          path="/yuksek-5-9-cm"
          element={<ShopCategory categoryId="6" />}
        />
        <Route path="/hair-band" element={<ShopCategory categoryId="1" />} />
        <Route
          path="/colorful-crowns-collection"
          element={<ShopCategory categoryId="3" />}
        />
        <Route
          path="/party-collection"
          element={<ShopCategory categoryId="8" />}
        />
        <Route path="/hair-clips" element={<ShopCategory categoryId="9" />} />
        <Route
          path="/engagement-and-promise-accessories"
          element={<ShopCategory categoryId="10" />}
        />
        <Route
          path="/jewelry-sets"
          element={<ShopCategory categoryId="11" />}
        />
        <Route
          path="/zircon-earrings"
          element={<ShopCategory categoryId="12" />}
        />
      </Routes>
      <Footer />
      <WhatsAppButton />
    </BrowserRouter>
  );
}

export default App;
