import React, { useState, useEffect } from 'react';
import schoolimg from '../images/schooldemo.png';
import { MdLightbulb, MdSkipPrevious, MdSkipNext,MdLocalLibrary, MdOutlineAndroid, MdOutlineCastForEducation, MdOutlineFollowTheSigns, MdOutlineInterests, MdOutlinePhonelink, MdWorkspacePremium, MdRocketLaunch, MdOutlineIncompleteCircle,MdPlayArrow, MdOutlinePause  } from "react-icons/md";
import './welcome.css';
const windowWidth = window.innerWidth;
const taglines = [
  { icon: <MdOutlineCastForEducation />, text: "Empower your teachers with *digital tools* for a seamless teaching experience." },
  { icon: <MdOutlineInterests />, text: "Transform your school's education system with our comprehensive *digital platform.*" },
  { icon: <MdOutlineAndroid />, text: "Enhance student engagement with our *AI-powered learning assistant.*" },
  { icon: <MdOutlineIncompleteCircle />, text: "Get real-time *insights* into your *students' performance* with our statistical dashboard." },
  { icon: <MdOutlinePhonelink />, text: "Streamline your school administration with our *digital solutions.*" },
  { icon: <MdRocketLaunch />, text: "Make learning *beyond the syllabus* a reality for your students." },
  { icon: <MdWorkspacePremium />, text: "Upgrade your *school to Tier 1* with our innovative education platform." },
  { icon: <MdLightbulb />, text: "Bring the *future* of education to your school *today.*" },
  { icon: <MdOutlineFollowTheSigns />, text: "Equip your students with the *tools to excel* in the digital age." },
  { icon: <MdLocalLibrary />, text: "Revolutionize your school's learning environment with our *student-friendly platform.*" },
];

function Welcome() {
    const [currentTagline, setCurrentTagline] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
  
    useEffect(() => {
      let interval = null;
      if (isPlaying) {
        interval = setInterval(() => {
          setCurrentTagline((currentTagline + 1) % taglines.length);
        }, 4000);
      } else if (!isPlaying && interval) {
        clearInterval(interval);
      }
      return () => clearInterval(interval);
    }, [currentTagline, isPlaying]);

  const prevTagline = () => {
    setCurrentTagline((currentTagline - 1 + taglines.length) % taglines.length);
  };

  const nextTagline = () => {
    setCurrentTagline((currentTagline + 1) % taglines.length);
  };

  return (
<div style={{ display: 'flex', flexDirection: windowWidth < 450 ? 'column' : 'row' }}>
      <div style={{ width:  windowWidth < 450 ? '100':'50%' }}>
        <img src={schoolimg} alt="School" style={{ width: '100%', height: 'auto' }} />
      </div>
      <div style={{ width:  windowWidth < 450 ? '100':'50%' , display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ height: '40vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px',marginRight:'10%',marginLeft:'10%' }}>
            {taglines[currentTagline].icon}
            <p className="freeman-regular" style={{ marginLeft: '10px' }}>
              {taglines[currentTagline].text.split('*').map((part, i) => 
                i % 2 === 0 ? part : <span style={{ color: '#F965A0' }}>{part}</span>
              )}
            </p>    
    </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '300px' }}>
      <button style={{ borderRadius: '10px', background: 'transparent', border: '1px solid #04264229' }} onClick={prevTagline}><MdSkipPrevious /></button>
      {isPlaying ? 
        <button style={{ borderRadius: '10px', background: 'transparent', border: '1px solid #04264229' }} onClick={() => setIsPlaying(false)}><MdOutlinePause /></button> : 
        <button style={{ borderRadius: '10px', background: 'transparent', border: '1px solid #04264229' }} onClick={() => setIsPlaying(true)}><MdPlayArrow /></button>
      }
      <button style={{ borderRadius: '10px', background: 'transparent', border: '1px solid #04264229' }} onClick={nextTagline}><MdSkipNext /></button>
      <button style={{ height: '30px', width:'120px',borderRadius:'30px',backgroundColor: '#408EC6', color: 'white', border: 'none', cursor: 'pointer' }}>Book A Demo</button>
    </div>
      </div>
    </div>
  );
}

export default Welcome;