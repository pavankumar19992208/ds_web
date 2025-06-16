// components/stationeryDecorations.jsx
import React from 'react';
import './stationeryDecorations.css';
import pencil from '../../../images/pencil.png';
import eraser from '../../../images/eraser.png';
import sharpener from '../../../images/sharpener.png';


const StationeryDecorations = () => {
    return (
      <div className="lp-hs-stationery-container">
        <img src={pencil} className="lp-hs-pencil" alt="" />
        <img src={eraser} className="lp-hs-eraser" alt="" />
        <img src={sharpener} className="lp-hs-sharpener" alt="" />
      </div>
    );
  };
export default StationeryDecorations;