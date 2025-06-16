import React from 'react';
import './features.css';
import erp from '../../../images/erp.png';
import cart from '../../../images/cart.png';
import community from '../../../images/community.png';
import genie from '../../../images/genie.png';
import slinked from '../../../images/slinked.png';

function Features() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Adds smooth scrolling animation
    });
  };

  const features = [
    {
      id: 1,
      title: "School ERP",
      description: "Manage student records, track attendance, handle academics, exams, and streamline school operations from a centralized digital dashboard effortlessly.",
      image: erp,
      bgColor: "#FFE5D9" // Peach
    },
    {
      id: 2,
      title: "Slinked",
      description: "Empower students to create profiles, connect with peers, showcase skills, achievements, and prepare for future career opportunities through networking.",
      image: slinked,
      bgColor: "#fff", // Mint
    },
    {
      id: 3,
      title: "E-commerce Platform",
      description: "A dedicated marketplace for students and schools to purchase books, uniforms, accessories, and study materials with convenient online shopping.",
      image: cart,
      bgColor: "#F0E6EF" // Lavender
    },
    {
      id: 4,
      title: "AI Homework Assistant",
      description: "AI-powered digital pad that helps students complete homework, understand concepts visually, and receive intelligent guidance while practicing or revising.",
      image: genie,
      bgColor: "#fff" // Lavender
    },
    {
      id: 5,
      title: "Community",
      description: "Foster communication between schools, teachers, students, and parents with interactive discussions, updates, resources, and collaborative educational experiences",
      image: community,
      bgColor: "#F0E6EF" // Lavender
    }
  ];

  return (
    <div className="features-container">
    <div classname='f-title-container'>
      <h1 className='f-title'>Redefining Education with Smart, Connected Tools</h1>
      <p className='f-description'>Explore the features that make our platform a game-changer in the education sector.</p>
    </div>
      {features.map((feature, index) => (
        <div 
          key={feature.id} 
          className={`feature-row ${index % 2 === 0 ? 'image-left' : 'image-right'}`}
        >
          <div 
            className="feature-image-wrapper" 
            style={{ backgroundColor: feature.bgColor }}
          >
            <div className="feature-image-container">
              <img src={feature.image} alt={feature.title} className="feature-image" />
            </div>
          </div>
          <div className="feature-content">
            <h3 className="feature-title">{feature.title}</h3>
            <p className="feature-description">{feature.description}</p>
          </div>
        </div>
      ))}
      <div className='f-video-container'>Demo Video</div>
      <div className='f-get-started-container'>
        <div>
        <h1 className='f-gs-title'>Ready to transform your school?</h1>
        <h1 className='f-gs-description'>Experience the future of education with one smart platform.</h1>
        </div>
        <button className='f-gs-button' onClick={scrollToTop}>Get Started</button>
      </div>
    </div>
  );
}

export default Features;