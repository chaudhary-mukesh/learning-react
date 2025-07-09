import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AddProduct from "./components/AddProduct";
import ProductDetail from "./pages/ProductDetail";
import EditProduct from "./pages/EditProduct";

// A wrapper component so we can use hooks like useLocation
function AppContent() {
  const location = useLocation();

  const isLoginPage = location.pathname === "/";

  return (
    <>
      {!isLoginPage && <Sidebar />}
      {!isLoginPage && <Header />}

      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/product-detail/:productId" element={<ProductDetail />} />
        <Route path="/edit-product/:productId" element={<EditProduct />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
