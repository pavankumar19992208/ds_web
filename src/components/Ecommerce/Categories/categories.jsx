import React from 'react';
import { useNavigate } from 'react-router-dom';
import './categories.css'; // Make sure to create this CSS file
import Books from './Images/books.png';
import Accessories from './Images/accessories.png';
import Stationery from './Images/stationery.png';
import Furniture from './Images/furniture.png';
import Sports from './Images/sports_fitness.png';
import Exam_Preparation from './Images/exam_preparation.png';

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products?category=${category}`);
  };

  return (
    <div className='category-content'>
      <h2 className='category-heading'>Shop by Category</h2>
      <div className="grid-container">
        <div className="grid-item" onClick={() => handleCategoryClick('Books')}>
          <img src={Books} alt="Books" />
          <span>Books</span>
        </div>
        <div className="grid-item" onClick={() => handleCategoryClick('Accessories')}>
          <img src={Accessories} alt="Accessories" />
          <span>Accessories</span>
        </div>
        <div className="grid-item" onClick={() => handleCategoryClick('Stationery')}>
          <img src={Stationery} alt="Stationery" />
          <span>Stationery</span>
        </div>
        <div className="grid-item" onClick={() => handleCategoryClick('Furniture')}>
          <img src={Furniture} alt="Furniture" />
          <span>Furniture</span>
        </div>
        <div className="grid-item" onClick={() => handleCategoryClick('Sports')}>
          <img src={Sports} alt="Sports" />
          <span>Sports</span>
        </div>
        <div className="grid-item" onClick={() => handleCategoryClick('Exam Preparation')}>
          <img src={Exam_Preparation} alt="Exam Preparation" />
          <span>Exam Preparation</span>
        </div>
      </div>
    </div>
  );
};

export default Categories;