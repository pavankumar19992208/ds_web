import React, { useState, useEffect } from 'react';
import './heroSection.css';
import heroImage from '../../../images/heroImage.png';
import Header from '../header/header.jsx'; 
import StationeryDecorations from '../stationeryDecorations/stationeryDecorations.jsx'; // Import the stationery decorations component

function HeroSection() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  
  const quotes = [
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela"
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King"
    },
    {
      text: "Digital education is not just about technology, it's about expanding minds and connecting possibilities.",
      author: "Anonymous"
    },
    {
      text: "Online learning opens doors to knowledge that knows no geographical boundaries.",
      author: "Anonymous"
    },
    {
      text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
      author: "Brian Herbert"
    }
  ];

  // Auto-rotate quotes every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => 
        prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);
    
    return () => clearInterval(interval);
  }, [quotes.length]);

  const nextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => 
      prevIndex === quotes.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevQuote = () => {
    setCurrentQuoteIndex((prevIndex) => 
      prevIndex === 0 ? quotes.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="lp-hero-section-container">
      <div className="lp-hs-header-container"> {/* Add this wrapper */}
        <Header />
      </div> 
      <div className="lp-hs-grid-overlay"></div>
      <StationeryDecorations />
      <div className="lp-hs-hero-content">
        {/* Left Column - Quotes Carousel */}
        <div className="lp-hs-left-column">
          <div className="lp-hs-quote-carousel">
            {quotes.map((quote, index) => (
              <div 
                key={index}
                className={`lp-hs-quote ${index === currentQuoteIndex ? 'active' : ''}`}
              >
                <h2>"{quote.text}"</h2>
                <p>- {quote.author}</p>
              </div>
            ))}
            <div className="lp-hs-carousel-controls">
              <button className="lp-hs-arrow-btn left-arrow" onClick={prevQuote}>&lt;</button>
              <button className="lp-hs-arrow-btn right-arrow" onClick={nextQuote}>&gt;</button>
            </div>
          </div>
          <button className="lp-hs-join-community-btn">Join the Community</button>
        </div>
        
        {/* Right Column - Image */}
        <div className="lp-hs-right-column">
          <div className="lp-hs-hero-image">
            <img src={heroImage} alt="Digital Education" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroSection;