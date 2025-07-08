import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import AllProducts from "./pages/AllProducts";
import "./App.css";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import AddProduct from "./components/AddProduct";

function App() {
  return (
    <BrowserRouter>
<Sidebar></Sidebar>
<Header></Header>
      <Routes>
        
        <Route path="/" element={<Login />} />
        <Route path="/all-products" element={<AllProducts />} />
        <Route path="/add-product" element={<AddProduct/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
