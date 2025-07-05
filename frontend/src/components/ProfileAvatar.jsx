import React from 'react';

const profileImages = [
  '/profile1.jpg',
  '/profile2.jpg',
  '/profile3.jpg',
  '/profile4.jpg',
  '/profile5.jpg'
];

const ProfileAvatar = ({ name, image, size = 'md' }) => {
  
  const getProfileImage = (name) => {
   
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const imageIndex = charCodeSum % profileImages.length;
    return profileImages[imageIndex];
  };

  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const sizeClass = {
    sm: 'avatar-sm',
    md: 'avatar-md',
    lg: 'avatar-lg'
  }[size] || 'avatar-md';

  return (
    <div className={`profile-avatar ${sizeClass}`}>
      {image ? (
        <img src={image} alt={name || 'Profile'} />
      ) : name ? (
        <div className="avatar-image">
          <img src={getProfileImage(name)} alt={name} />
        </div>
      ) : (
        <div className="avatar-initials">
          {getInitials(name)}
        </div>
      )}
    </div>
  );
};

export default ProfileAvatar; 