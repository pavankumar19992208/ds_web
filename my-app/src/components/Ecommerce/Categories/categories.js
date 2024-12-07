import React from 'react';
import { useNavigate } from 'react-router-dom';
import './categories.css'; // Make sure to create this CSS file
import Books from './Images/books.jpg';
import Accessories from './Images/accessories.jpg';
import Stationery from './Images/stationery.jpg';
import Furniture from './Images/furniture.jpg';
import Sports_Fitness from './Images/sports_fitness.webp';
import Exam_Preparation from './Images/exam_preparation.jpg';

const Categories = () => {
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/products-list?category=${category}`);
  };

  return (
    <div className='category-content'>
      <h2>Shop by Category</h2>
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
        <div className="grid-item" onClick={() => handleCategoryClick('Sports & Fitness')}>
          <img src={Sports_Fitness} alt="Sports & Fitness" />
          <span>Sports & Fitness</span>
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