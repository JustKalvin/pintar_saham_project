import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import LogoPintarSaham from "../assets/LogoPintarSaham.png"
import {PageContext} from "../App.jsx"

const Navbar = (props) => {
  const [user, setUser] = useState(null);
  const {currPage, handleCurrPage} = useContext(PageContext)
  // Ambil data user setelah login

  useEffect(() => {
    const getUser = async () => {
      try {
        const userData = await account.get();
        setUser(userData);
      } catch (error) {
        setUser(null);
      }
    };

    getUser();
  }, []);

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-transparent fixed-top"
      style={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
    >
      <div className="container">
      <Link className="navbar-brand" to="/">
        <img 
          src={LogoPintarSaham} 
          alt="Logo Pintar Saham" 
          style={{ height: "40px", width: "auto" }} 
        />
      </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto mx-5">
            <li className="nav-item mx-4"><Link className={`nav-link text-white ${currPage === "Home" ? "text-decoration-underline" : ""} `} to="/">Home</Link></li>
            <li className="nav-item mx-4"><Link className={`nav-link text-white ${currPage === "Modul" ? "text-decoration-underline" : ""} `} to="/Modul">Modul</Link></li>
            <li className="nav-item mx-4"><Link className={`nav-link text-white ${currPage === "Berita" ? "text-decoration-underline" : ""} `} to="/Berita">Berita</Link></li>
            <li className="nav-item mx-4"><Link className={`nav-link text-white ${currPage === "StockChart" ? "text-decoration-underline" : ""} `} to="/StockChart">StockChart</Link></li>
            <li className="nav-item mx-4"><Link className={`nav-link text-white ${currPage === "Forum" ? "text-decoration-underline" : ""} `} to="/Forum">Forum</Link></li>
            <li className="nav-item mx-4"><Link className={`nav-link text-white ${currPage === "Produk" ? "text-decoration-underline" : ""} `} to="/Produk">Produk</Link></li>
            
            {/* Dropdown untuk Login dan Register */}
            <li className="nav-item dropdown mx-4">
              <button className={`nav-link dropdown-toggle text-white bg-transparent ${currPage === "Login" || currPage === "Register" ? "text-decoration-underline" : ""}`} id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                {props.registeredPage === "true" ? "Register" : "Login"}
              </button>
              <ul className="dropdown-menu bg-transparent" aria-labelledby="navbarDropdown">
                <li>
                  <Link 
                    className="dropdown-item text-white" 
                    to="/LoginPage" 
                    style={{ backgroundColor: "#343a40" }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#343a40"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item text-white" 
                    to="/RegisterPage"
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#343a40"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}
                  >
                    Register
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
