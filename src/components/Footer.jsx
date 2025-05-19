import React from "react";
import locationIcon from "../assets/Location.png";
import whatsappIcon from "../assets/Whatsapp.png";
import emailIcon from "../assets/Email.png";
import instagramIcon from "../assets/Instagram.png";
import twitterIcon from "../assets/X.png";
import youtubeIcon from "../assets/YouTube.png";
import githubIcon from "../assets/GitHub.png";

const Footer = () => {
  return (
    <footer className="bg-transparent text-light py-4">
      <div className="container d-flex flex-column flex-md-row justify-content-between align-items-start">
        {/* Kolom 1: Kontak */}
        <div className="d-flex flex-column">
          <h5>Kontak Kami</h5>
          <div className="d-flex flex-row align-items-center gap-2 my-3">
            <img src={locationIcon} alt="Location" width="24" height="24" />
            <p className="mb-0">Jl.Kosambi Timur JL 44</p>
          </div>
          <div className="d-flex flex-row align-items-center gap-2 my-3">
            <img src={whatsappIcon} alt="WhatsApp" width="24" height="24" />
            <p className="mb-0">0899987574855</p>
          </div>
          <div className="d-flex flex-row align-items-center gap-2 my-3">
            <img src={emailIcon} alt="Email" width="24" height="24" />
            <p className="mb-0">pintarsaham@gmail.com</p>
          </div>
        </div>

        {/* Kolom 2: Sosial Media */}
        <div className="d-flex flex-column">
          <h5>Our Social Media</h5>
          <div className="d-flex flex-row gap-3 mt-3">
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" width="32" height="32" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={twitterIcon} alt="Twitter/X" width="32" height="32" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={youtubeIcon} alt="YouTube" width="32" height="32" />
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <img src={githubIcon} alt="GitHub" width="32" height="32" />
            </a>
          </div>
        </div>

        {/* Kolom 3: Tentang PintarSaham */}
        <div className="d-flex flex-column" style={{ maxWidth: "300px" }}>
          <h5>Tentang PintarSaham</h5>
          <p className="text-justify">
            PintarSaham adalah platform edukasi saham interaktif yang dirancang
            untuk membantu pengguna memahami investasi dengan mudah. <br /><br />Kami
            menyediakan materi edukatif, simulasi trading, dan analisis pasar
            untuk membantu pengguna membangun strategi investasi yang cerdas.
          </p>
        </div>
      </div>
      
      <div className="text-center mt-4 border-top pt-3">
        <p className="mb-0">&copy; {new Date().getFullYear()} PintarSaham. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
