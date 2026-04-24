import React, { useState } from 'react';
import volunteerService from '../services/volunteerService';
import '../styles/RatingComponent.css';

function RatingComponent({ targetType, targetId, existingRating = null, onRatingSubmitted }) {
  const [rating, setRating] = useState(existingRating?.rating || 0);
  const [comment, setComment] = useState(existingRating?.comment || '');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }

    setSubmitting(true);
    
    try {
      const ratingData = {
        target_type: targetType,
        target_id: targetId,
        rating: rating,
        comment: comment
      };
      
      await volunteerService.createRating(ratingData);
      setShowForm(false);
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
      alert('Failed to submit rating. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = () => {
    return (
      <div className="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={`star ${star <= rating ? 'filled' : 'empty'}`}
            onClick={() => setRating(star)}
            disabled={submitting}
          >
            ★
          </button>
        ))}
      </div>
    );
  };

  if (!showForm) {
    return (
      <div className="rating-component">
        {existingRating ? (
          <div className="existing-rating">
            <div className="rating-display">
              <div className="stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${star <= existingRating.rating ? 'filled' : 'empty'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="rating-value">{existingRating.rating}/5</span>
            </div>
            {existingRating.comment && (
              <p className="rating-comment">"{existingRating.comment}"</p>
            )}
            <button 
              className="update-rating-btn"
              onClick={() => setShowForm(true)}
            >
              Update Rating
            </button>
          </div>
        ) : (
          <button 
            className="rate-btn"
            onClick={() => setShowForm(true)}
          >
            Rate {targetType === 'organization' ? 'Organization' : 'Volunteer'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="rating-form">
      <h3>
        Rate {targetType === 'organization' ? 'Organization' : 'Volunteer'}
      </h3>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Your Rating</label>
          {renderStars()}
        </div>

        <div className="form-group">
          <label htmlFor="rating-comment">Comment (optional)</label>
          <textarea
            id="rating-comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience..."
            rows={3}
          />
        </div>

        <div className="form-actions">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => setShowForm(false)}
            disabled={submitting}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="submit-btn"
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : 'Submit Rating'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default RatingComponent;
