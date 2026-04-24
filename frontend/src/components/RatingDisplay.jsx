import React, { useState, useEffect } from 'react';
import volunteerService from '../services/volunteerService';
import '../styles/RatingDisplay.css';

function RatingDisplay({ targetType, targetId, showAverage = true }) {
  const [ratings, setRatings] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRatings();
  }, [targetType, targetId]);

  const fetchRatings = async () => {
    try {
      setLoading(true);
      const data = await volunteerService.getTargetRatings(targetType, targetId);
      setRatings(data.ratings || []);
      setAverageRating(data.average_rating || 0);
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    return (
      <div className={`rating-stars ${interactive ? 'interactive' : 'display'}`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="rating-display loading">
        <span>Loading ratings...</span>
      </div>
    );
  }

  return (
    <div className="rating-display">
      {showAverage && (
        <div className="average-rating">
          <div className="rating-header">
            <h4>Average Rating</h4>
            <span className="rating-count">({ratings.length} {ratings.length === 1 ? 'rating' : 'ratings'})</span>
          </div>
          <div className="rating-summary">
            {renderStars(Math.round(averageRating))}
            <span className="average-score">{averageRating.toFixed(1)}/5</span>
          </div>
        </div>
      )}

      {ratings.length > 0 && (
        <div className="ratings-list">
          <h4>Individual Ratings</h4>
          {ratings.map((rating, index) => (
            <div key={rating.id || index} className="rating-item">
              <div className="rating-info">
                <div className="rating-meta">
                  <span className="rating-date">
                    {new Date(rating.created_at).toLocaleDateString()}
                  </span>
                  <div className="rating-stars">
                    {renderStars(rating.rating)}
                  </div>
                </div>
                {rating.comment && (
                  <p className="rating-comment">"{rating.comment}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {ratings.length === 0 && (
        <div className="no-ratings">
          <p>No ratings yet.</p>
        </div>
      )}
    </div>
  );
}

export default RatingDisplay;
