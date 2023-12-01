import '../assets/styles/RouteRating.css';
import { Header } from '../elements/Header';
import React, { useEffect, useState } from 'react';
import { Review } from '../elements/Review';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import ProgressBar from "@ramonak/react-progress-bar";
import ReactStars from "react-rating-stars-component";


export const RouteRating = () => {
    const revSumData = {
        FiveStarRatings: 1,
        FourStarRatings: 1,
        OneStarRatings: 0,
        RouteId: "1012-10",
        ThreeStarRatings: 2,
        TwoStarRatings: 0
    };

    const revData = [
        {
            Comments: "This route is great!",
            StarRating: 5,
            UserName: "user1"
        },
        {
            Comments: "This route is great!",
            StarRating: 4,
            UserName: "user2"
        },
        {
            Comments: "This route is great!",
            StarRating: 3,
            UserName: "user3"
        },
        {
            Comments: "This route is great!",
            StarRating: 3,
            UserName: "user4"
        },
        {
            Comments: "This route is great!",
            StarRating: 1,
            UserName: "user5"
        }
    ]
    const [selectedRoute, setSelectedRoute] = useState({});
    const [reviewSummaryData, setReviewSummaryData] = useState({});
    const [netReviews, setNetReviews] = useState();
    const [reviewsData, setReviewsData] = useState([]);
    const [selectedRating, setSelectedRating] = useState(0);
    const [currUserName, setCurrUserName] = useState();

    const filterRoutes = async (inputValue) => {
        return await axios.get("http://127.0.0.1:2000/get_routes", {
            params: { search_query: inputValue }
        }).then((res) => {
            return res.data.map((route) => {
                return { value: route, label: route };
            });
        });
    }

    const handleRouteInputChange = (inputValue) => new Promise(resolve => resolve(filterRoutes(inputValue)));

    const getReviewSummary = async (route) => {
        return await axios.get("http://127.0.0.1:2000/get_review_summary", {
            params: { route_name: route }
        }).then((res) => {
            setReviewSummaryData(res.data);
            if(Object.keys(res.data).length > 0) {
                setNetReviews(Object.values(res.data).filter((a) => Number.isInteger(a)).reduce((a, b) => a + b, 0));
            }
        });
    };

    const getReviews = async (route) => {
        return await axios.get("http://127.0.0.1:2000/get_reviews", {
            params: { route_name: route }
        }).then((res) => {
            let dataToBeSet = res.data;
            const targetIndex = dataToBeSet.findIndex(obj => obj.UserName === currUserName);

            if (targetIndex !== -1) {
                const targetObject = dataToBeSet.splice(targetIndex, 1)[0];
                dataToBeSet.unshift(targetObject);
            }

            setReviewsData(dataToBeSet);
        });
    };

    const onReviewSubmit = async (e) => {
        e.preventDefault();
        return await axios.post("http://127.0.0.1:2000/" + (reviewsData.some((a) => a.UserName === currUserName) ? "update_review" : "add_review"),
        {
            data: {
                route_id: reviewSummaryData.RouteId,
                star_rating: selectedRating,
                comments: e.target.comments.value
            }
        },
        {
            withCredentials: true, //include credentials
        }
        ).then(async (res) => {
            await getReviewSummary(selectedRoute['value'][0]);
            await getReviews(selectedRoute['value'][0]);
            alert(res.data);

        });
    };

    const deleteReviewHandler = async (e) => {
        return await axios.post("http://127.0.0.1:2000/delete_review", {
                data: { route_id: reviewSummaryData.RouteId }
            },
            {
                withCredentials: true, //include credentials
            }).then(async (res) => {
                await getReviewSummary(selectedRoute['value'][0]);
                await getReviews(selectedRoute['value'][0]);
                alert(res.data)
            });
    };

    useEffect(() => {
        if (selectedRoute !== undefined && "value" in selectedRoute) {
            void getReviewSummary(selectedRoute['value'][0]);
            void getReviews(selectedRoute['value'][0]);
        }
    }, [selectedRoute]);
    
    useEffect(() => {
        const getUserDetails = async () => {

            return await axios({
                url: "http://127.0.0.1:2000/get_curr_user",
                method: "GET",
                withCredentials: "include"
            }).then((res) => {
                if(Array.isArray(res.data)) {
                    setCurrUserName(res.data[1]);
                }
            });
        };

        document.getElementsByClassName('App')[0].className = "App App-auth";
        void getUserDetails();
    }, []);

    return (
        <div className="route-rating-container">
            <Header 
                linkUnderline="routeRating" 
            />
            <div className="content">
                <div className="user-input-container">
                    <div>
                        Choose Route:
                    </div> 
                    <AsyncSelect
                        cacheOptions
                        value={selectedRoute}
                        onChange={(newInputValue) => setSelectedRoute(newInputValue)}
                        className="select-route" 
                        loadOptions={handleRouteInputChange}
                    />
                </div>
                <div className="selected-route-details">
                    {
                        "value" in selectedRoute && "RouteId" in reviewSummaryData ? 
                        <>
                            <h3><span style={{fontWeight: 'bold'}}>Route Name:</span> { selectedRoute['value'] }</h3>
                            <h3><span style={{fontWeight: 'bold'}}>Route ID:</span> { reviewSummaryData.RouteId }</h3>
                        </>
                        : ""
                    }
                </div>
                {
                    netReviews > 0 ?
                    <>
                        <div className="review-summary-container">
                            <h2>Review Summary</h2>
                            <div className="ratings">
                                <div>5</div> <ProgressBar bgColor='rgba(243, 190, 66)' 
                                    completed={reviewSummaryData.FiveStarRatings.toString()} 
                                    maxCompleted={netReviews}
                                    isLabelVisible={false}
                                />
                                <div>4</div> <ProgressBar bgColor='rgba(243, 190, 66)' 
                                    completed={reviewSummaryData.FourStarRatings.toString()} 
                                    maxCompleted={netReviews}
                                    isLabelVisible={false}
                                />
                                <div>3</div> <ProgressBar bgColor='rgba(243, 190, 66)' 
                                    completed={reviewSummaryData.ThreeStarRatings.toString()} 
                                    maxCompleted={netReviews}
                                    isLabelVisible={false}
                                />
                                <div>2</div> <ProgressBar bgColor='rgba(243, 190, 66)' 
                                    completed={reviewSummaryData.TwoStarRatings.toString()} 
                                    maxCompleted={netReviews}
                                    isLabelVisible={false}
                                />
                                <div>1</div> <ProgressBar bgColor='rgba(243, 190, 66)' 
                                    completed={reviewSummaryData.OneStarRatings.toString()} 
                                    maxCompleted={netReviews}
                                    isLabelVisible={false}
                                />
                                
                            </div>
                            <div className="total-reviews">
                                <h5>Total Reviews: {netReviews}</h5>
                            </div>
                        </div>
                        <hr />
                        <div className="user-reviews-container">
                            <h2>User Reviews</h2>
                            <form 
                                method="POST" 
                                onSubmit={onReviewSubmit}
                            >
                                <ReactStars
                                    count={5}
                                    size={24}
                                    isHalf={false}
                                    activeColor="#ffd700"
                                    onChange={(newRating) => setSelectedRating(newRating)}
                                    edit
                                />
                                <textarea 
                                    required 
                                    name="comments" 
                                    className="review-input" 
                                    placeholder="Write a review..." 
                                />
                                <input name="route_id" value={reviewSummaryData.RouteId} style={{display: 'none'}}  readOnly/>
                                <input name="star_rating" value={selectedRating} style={{display: 'none'}} readOnly />
                                <button
                                    disabled={selectedRating === 0}
                                    type="submit" 
                                >Submit</button>
                                <div className="note">
                                    NOTE: If you have already submitted a review for this route, your previous review will be updated.
                                </div>
                            </form>
                            {
                                reviewsData.map((review, index) => {
                                    return <Review showDelete={review.UserName === currUserName} deleteReviewHandler={deleteReviewHandler} key={index} reviewData={review} />
                                })
                            }
                        </div>
                    </>
                    : 
                    <div className="user-reviews-container">
                            <h2>User Reviews</h2>
                            <form 
                                method="POST" 
                                onSubmit={onReviewSubmit}
                            >
                                <ReactStars
                                    count={5}
                                    size={24}
                                    isHalf={false}
                                    activeColor="#ffd700"
                                    onChange={(newRating) => setSelectedRating(newRating)}
                                    edit
                                />
                                <textarea 
                                    required 
                                    name="comments" 
                                    className="review-input" 
                                    placeholder="Write a review..." 
                                />
                                <input name="route_id" value={reviewSummaryData.RouteId} style={{display: 'none'}}  readOnly/>
                                <input name="star_rating" value={selectedRating} style={{display: 'none'}} readOnly />
                                <button
                                    disabled={selectedRating === 0}
                                    type="submit" 
                                >Submit</button>
                                
                            </form>
                        </div>
                }
            </div>
        </div>
    );

};