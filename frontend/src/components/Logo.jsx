import React from 'react';

const Logo = ({ color = '#5E1DAD', size = 40 }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 40 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <rect 
          x="2" 
          y="2" 
          width="36" 
          height="36" 
          rx="4" 
          stroke={color} 
          strokeWidth="4" 
          fill="none"
        />
      </svg>
      <span style={{ 
        color: color, 
        fontWeight: 'bold', 
        fontSize: size * 0.6, 
        marginLeft: '10px' 
      }}>
        LOGO
      </span>
    </div>
  );
};

export default Logo; 