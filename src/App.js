import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Product from './components/Product';
import Cart from './components/Cart';
import Register from './components/Register';
import Login from './components/Login';
import AddProduct from "./components/AddProduct";
import User from "./components/User";
import AdminPage from "./components/AdminPage"; // Import AdminPage
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { ProductProvider } from './contexts/ProductContext';
import Footer from "./components/Footer";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Navigate } from "react-router-dom";

const App = () => {
  return (
    <div>


      <Router>
        <ToastContainer
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        <AuthProvider>
          <CartProvider>
            <ProductProvider>
              <div className="app-container">
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<ProductList />} />
                    <Route path="/product/:id" element={<Product />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/addproduct" element={<AddProduct />} />
                    <Route path="/user" element={<User />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="*" element={<Navigate to="/" />} />

                  </Routes>
                </main>
                <Footer />

              </div>
            </ProductProvider>
          </CartProvider>
        </AuthProvider>
      </Router>
    </div>
  );
};

export default App;
