// components/ModulCard.jsx
import React from 'react';
import styled from 'styled-components';

const ModulCard = ({ modul, isCompleted, onClick }) => {
  return (
    <StyledWrapper onClick={() => onClick(modul.id)}>
      <div className="parent">
        <div className="card">
          <div className="content-box">
            <span className="card-title">{modul.title}</span>
            <p className="card-content">{modul.description}</p>
            <span className="see-more">Klik untuk buka</span>
          </div>
          <div className="date-box">
            <span>{isCompleted ? "✅" : "❌"}</span>
          </div>
        </div>
      </div>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  cursor: pointer;
  .parent {
    width: 300ox;
    padding: 20px;
    perspective: 1000px;
  }

  .card {
    padding-top: 50px;
    border: 3px solid rgb(255, 255, 255);
    transform-style: preserve-3d;
    background:
      linear-gradient(135deg, #0000 18.75%, #1B1B1B 0 31.25%, #0000 0),
      repeating-linear-gradient(45deg, #1B1B1B -6.25% 6.25%, #395F2E 0 18.75%);
    background-size: 60px 60px;
    background-color: #f0f0f0;
    width: 100%;
    min-height: 280px;
    box-shadow: rgba(142, 142, 142, 0.3) 0px 30px 30px -10px;
    transition: all 0.5s ease-in-out;
    position: relative;
  }

  .card:hover {
    background-position: -100px 100px, -100px 100px;
    transform: rotate3d(0.5, 1, 0, 30deg);
  }

  .content-box {
    transition: all 0.5s ease-in-out;
    padding: 60px 25px 25px 25px;
    transform-style: preserve-3d;
  }

  .card-title {
    display: inline-block;
    color: white;
    font-size: 20px;
    font-weight: 900;
    transform: translate3d(0px, 0px, 50px);
  }

  .card-content {
    margin-top: 10px;
    font-size: 12px;
    font-weight: 700;
    color: #f2f2f2;
    transform: translate3d(0px, 0px, 30px);
  }

  .see-more {
    cursor: pointer;
    margin-top: 1rem;
    display: inline-block;
    font-weight: 900;
    font-size: 9px;
    text-transform: uppercase;
    color: rgb(7, 185, 255);
    background: white;
    padding: 0.5rem 0.7rem;
    transform: translate3d(0px, 0px, 20px);
  }

  .date-box {
    position: absolute;
    top: 30px;
    right: 30px;
    height: 60px;
    width: 60px;
    background: white;
    border: 1px solid rgb(7, 185, 255);
    padding: 10px;
    transform: translate3d(0px, 0px, 80px);
    box-shadow: rgba(100, 100, 111, 0.2) 0px 17px 10px -10px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export default ModulCard;
