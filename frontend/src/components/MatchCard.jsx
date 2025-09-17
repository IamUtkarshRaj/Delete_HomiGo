import React, { useState } from 'react';

const MatchCard = ({ match, onRequest, onReject, onCancelRequest }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleRequest = () => {
    if (match.requestSent) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      onRequest(match.id, match.name);
      setIsAnimating(false);
    }, 300);
  };

  const handleReject = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onReject(match.id, match.name);
    }, 300);
  };

  const handleCancelRequest = () => {
    setIsAnimating(true);
    setTimeout(() => {
      onCancelRequest(match.id, match.name);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className={`match-card ${isAnimating ? 'animating' : ''}`}>
      {/* Compatibility Badge */}
      <div className="compatibility-badge">
        {match.compatibility}%
      </div>
      
      {/* Profile Image */}
      <div className="profile-image-contain">
        <img 
          src={match.profileImage} 
          alt={`${match.name}'s profile`}
          className="profile-image"
          onError={(e) => {
            e.target.src = '' + match.name[0];
          }}
        />
        {match.verified && (
          <div className="verify-badge">✓</div>
        )}
      </div>
      
      {/* Profile Info */}
      <div className="profile-info">
        <h3 className="profile-name">
          {match.name}, {match.age}
        </h3>
        <p className="profile-location">{match.location}</p>
        <p className="profile-course">{match.course}</p>
        
        {/* Interests */}
        <div className="interests">
          {match.interests.slice(0, 2).map((interest, index) => (
            <span key={index} className="interest-tag">
              {interest}
            </span>
          ))}
          {match.interests.length > 2 && (
            <span className="interest-more">
              +{match.interests.length - 2} more
            </span>
          )}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="match-actions">
        {match.requestSent ? (
          
          <>
            <button className="request-sent-btn">
              <span>✅ Request Sent</span>
            </button>
            <button 
              className="cancel-request-btn-styled"
              onClick={handleCancelRequest}
              title="Cancel request"
            >
              <span>🔄 Cancel Request</span>
            </button>
          </>
        ) : (
         
            
          <>
            <button 
              className="reject-btn"
              onClick={handleReject}
              title="Not interested"
            >
              ✕
            </button>
            <button 
              className="request-btn"
              onClick={handleRequest}
              title="Send roommate request"
            >
              ✓
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MatchCard;
