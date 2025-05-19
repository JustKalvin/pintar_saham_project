import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Modul from "./pages/Modul";
import Berita from "./pages/Berita";
import Produk from "./pages/Produk";
import StockChart from "./pages/StockChart";
import Forum from "./pages/Forum";
import Modules1 from "./pages/Modules/Modules1";
import Modules2 from "./pages/Modules/Modules2";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Test from "./pages/Test";
import { createContext, useState } from "react";

export const PageContext = createContext()

function App() {
  const [currPage, setCurrPage] = useState("")
  const handleCurrPage = (pageNow) => {
    setCurrPage(currPage => (pageNow))
  }
  return (
    <>
      <PageContext.Provider value = {{currPage, handleCurrPage}}>
        <Router> {/* Tambahkan Router di sini */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/Modul" element={<Modul />} />
            <Route path="/Berita" element={<Berita />} />
            <Route path="/Produk" element={<Produk />} />
            <Route path="/StockChart" element = {<StockChart />}/>
            <Route path="/Forum" element = {<Forum />}/>
            <Route path="/Modules1" element = {<Modules1 />}/>
            <Route path="/Modules2" element = {<Modules2 />}/>
            <Route path="/LoginPage" element = {<LoginPage />}/>
            <Route path="/RegisterPage" element = {<RegisterPage />}/>
            <Route path="/Test" element = {<Test />}/>
          </Routes>
        </Router>
      </PageContext.Provider>
    </>
  );
}

export default App;
