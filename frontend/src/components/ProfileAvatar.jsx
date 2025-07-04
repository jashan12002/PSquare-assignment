import React from 'react';

// Sample profile images
const profileImages = [
  '/profile1.jpg',
  '/profile2.jpg',
  '/profile3.jpg',
  '/profile4.jpg',
  '/profile5.jpg'
];

const ProfileAvatar = ({ name, image, size = 'md' }) => {
  // Generate consistent profile image based on name
  const getProfileImage = (name) => {
    // Use the sum of character codes to select a consistent image for a name
    const charCodeSum = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const imageIndex = charCodeSum % profileImages.length;
    return profileImages[imageIndex];
  };

  // Generate initials for avatar
  const getInitials = (name) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Determine size class
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