import '../assets/styles/MapsAndSchedules.css';
import { Header } from '../elements/Header';
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';

export const MapsAndSchedules = ({ pageSwitch }) => {
    const [selectedRoute, setSelectedRoute] = useState([]);
    const [selectedStop, setSelectedStop] = useState([]);
    const [routesDisplayData, setRoutesDisplayData] = useState([]);

    const filterRoutes = async (inputValue) => {
        return await axios.get("http://127.0.0.1:5000/get_routes", {
                params: { search_query: inputValue }
            }).then((res) => {
                return res.data.map((route) => {
                    return { value: route, label: route };
                });
            });
    }

    const filterStops = async (inputValue) => {
        return await axios.get("http://127.0.0.1:5000/get_stops", {
                params: { search_query: inputValue }
            }).then((res) => {
                return res.data.map((route) => {
                    return { value: route, label: route };
                });
            });
    }

    const handleRouteInputChange = (inputValue) => new Promise(resolve => resolve(filterRoutes(inputValue)));

    const handleStopInputChange = (inputValue) => new Promise(resolve => resolve(filterStops(inputValue)));

    const logoutHandler = async () => {
        return await axios.post("http://127.0.0.1:5000/logout").then((res) => {
            pageSwitch("login");
            alert(res.data);
        });
    };

    useEffect(() => {
        const getNearestDepartureTime = async (route, stop="") => {
            return await axios.get("http:///127.0.0.1:5000/get_closest_departure_time", { 
                params: { route_name: route, stop_name: stop }
            }).then((res) => {
                return res.data;
            });
        };
        
        if (selectedRoute !== undefined && "value" in selectedRoute) {
            if (selectedStop !== undefined && "value" in selectedStop) 
                void getNearestDepartureTime(selectedRoute['value'][0], selectedStop['value'][0]).then((res) => {
                    setRoutesDisplayData(res);
                    console.log(res);
                });
            else
                void getNearestDepartureTime(selectedRoute['value'][0]).then((res) => {
                    setRoutesDisplayData(res);
                    console.log(res);
                });
        }
    }, [selectedRoute, selectedStop]);

    return (
        <div className="container">
            <Header logoutHandler={logoutHandler} />
            <div className="content">
                <div className="left">
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
                        <div>
                            Choose Stop:
                        </div>
                        <AsyncSelect
                            cacheOptions
                            value={selectedStop}
                            onChange={(newInputValue) => setSelectedStop(newInputValue)}
                            className="select-stop" 
                            loadOptions={handleStopInputChange}
                        />
                    </div>
                    <div className="routes-display">
                        <div className="retrieved-at">
                            { 
                                routesDisplayData.length > 0 ? `Retrieved at: ${new Date().toLocaleTimeString()}` : ""
                            } 
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Route Long Name</th>
                                    <th>Stop ID</th>
                                    <th>Stop Name</th>
                                    <th>Time until Departure</th>
                                </tr>
                            </thead>
                            <tbody>
                               {
                                    routesDisplayData !== undefined 
                                    && routesDisplayData.map((route) => {
                                        return (
                                            <tr>
                                                <td>{route[0]}</td>
                                                <td>{route[1]}</td>
                                                <td>{route[2]}</td>
                                                <td>{route[3]}</td>
                                            </tr>
                                        );
                                    })
                               }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="right">
                    
                </div>
            </div>
        </div>
    );

};