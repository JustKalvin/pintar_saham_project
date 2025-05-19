import React from 'react';
import styled from 'styled-components';
// import stonk3 from "../assets/stonk3.jpg"

const ProdukCard = ({ title, description, buttonText, imageDir, color, url }) => {
  return (
    <StyledWrapper color={color}>
      <div className="card">
        <div className="bg" />
        <div className="blob" />
        <div className="content">
          <img src={imageDir} alt="produk" className="pt-1" style={{ width: "100%", height : "100%", borderRadius: "10px" }} />
        </div>
        <div className="content">
          <p><strong>{title}</strong></p>
          <p>{description}</p>
          <a href={url} target="_blank" rel="noopener noreferrer">
          <button style={{ backgroundColor: "#333", color: "#fff", border: "none", borderRadius: "6px", padding: "8px 16px", cursor: "pointer" }}>
            {buttonText}
          </button>
          </a>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .card {
    position: relative;
    width: 300px;
    height: 450px;
    border-radius: 14px;
    z-index: 1111;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 10px;
  }

  .bg {
    position: absolute;
    top: 5px;
    left: 5px;
    right: 5px;
    bottom: 5px;
    z-index: 2;
    background: rgba(255, 255, 255, .95);
    backdrop-filter: blur(24px);
    border-radius: 10px;
    overflow: hidden;
    outline: 2px solid white;
  }

  .blob {
    position: absolute;
    z-index: 1;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 450px;
    border-radius: 50%;
    background-color: ${(props) => props.color || '#ff0000'};
    opacity: 9;
    filter: blur(12px);
    animation: blob-bounce 5s infinite ease;
  }

  .content {
    position: relative;
    z-index: 3;
    text-align: center;
    color: #333;
    padding: 5px;
  }

  @keyframes blob-bounce {
    0% { transform: translate(-100%, -100%) translate3d(0, 0, 0); }
    25% { transform: translate(-100%, -100%) translate3d(100%, 0, 0); }
    50% { transform: translate(-100%, -100%) translate3d(100%, 100%, 0); }
    75% { transform: translate(-100%, -100%) translate3d(0, 100%, 0); }
    100% { transform: translate(-100%, -100%) translate3d(0, 0, 0); }
  }
`;

export default ProdukCard;