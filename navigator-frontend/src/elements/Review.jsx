import '../assets/styles/Review.css';
import React from 'react';
import ReactStars from "react-rating-stars-component";

export const Review = ({ reviewData, showDelete, deleteReviewHandler }) => {
    const rating = parseInt(reviewData.StarRating);
    return (
        <div className="review">
            {
                showDelete ? <button onClick={deleteReviewHandler}>Delete Review</button> : ""
            }
            <div>
                <ReactStars
                    key={`rating_${rating}}`}
                    count={5}
                    size={24}
                    isHalf={false}
                    activeColor="#ffd700"
                    edit={false}
                    value={rating}
                />
            </div>
            <div className="username">
                {reviewData.UserName}
            </div>
            <div>
                {reviewData.Comments}
            </div>
        </div>
    );
};