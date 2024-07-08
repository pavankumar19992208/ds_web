import React from 'react';
import './Ss_Genie.css'; // Ensure you have a CSS file with the same name in your project
import genieimg1 from '../../../images/Mobile_Genie.png';
import genieimg2 from '../../../images/img-2.png';
import genieimg3 from '../../../images/img-3.png';
import ImageSlider from '../../common/imageslider/ImageSlider';

function SsGenie() {
  const images = [genieimg1, genieimg2, genieimg3];
  return (
    <div className="container">
              <div className="side-by-side">
        <div className="item">
          <ImageSlider images={images} />
        </div>
      </div>
      <div className="side-by-side">
        <div className="item services-list">
          <ul>
            <li><strong>Introducing Genie:</strong> Your personal AI chatbot designed to resolve student issues related to their studies. Whether it's a question from the syllabus or beyond, Genie is here to assist.</li>
            <li><strong>Academic Support:</strong> Genie answers queries directly from the syllabus, providing structured responses with pictures and textbook references for subject-related questions.</li>
            <li><strong>Beyond Academics:</strong> Not just limited to the syllabus, Genie also addresses out-of-syllabus queries, offering curated responses for a comprehensive learning experience.</li>
            <li><strong>Platform Assistance:</strong> Need help navigating our mobile app? Genie provides instant support for all platform-related queries, ensuring a seamless user experience.</li>
            <li><strong>Navigation Links:</strong> Looking for specific topics? Genie gives you direct navigation links to the subjects you're curious about, making learning more accessible.</li>
            <li><strong>Exam-Ready Responses:</strong> With Genie, students receive structured responses that they can directly use in exams and worksheets, enhancing their learning and preparation.</li>
            <li><strong>Multimedia Content:</strong> Genie delivers content in various formats, including images, videos, and text, catering to different learning preferences and making education engaging and fun.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SsGenie;