import { Header } from '../elements/Header';
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import {MapContainer , TileLayer, Marker, Popup} from 'react-leaflet';
import '../assets/styles/MapsAndSchedules.css';
import { CustomTable } from '../elements/CustomTable';


export const MapsAndSchedules = () => {
    let data = {
        columns: [
            {
              label: 'Route Long Name',
              renderCell: (item) => item.routeLongName
            },
            {
              label: 'Stop ID',
              renderCell: (item) => item.stopId
            },
            {
                label: 'Stop Name',
                renderCell: (item) => item.stopName
            },
            {
              label: 'Time until Departure',
              renderCell: (item) => item.timeUntilDeparture
            }
          ],
          rows: []
    };

    const [routesDisplayData, setRoutesDisplayData] = useState(data);
    const [selectedRoute, setSelectedRoute] = useState({});
    const [selectedStop, setSelectedStop] = useState({});

    const filterRoutes = async (inputValue) => {
        return await axios.get("http://127.0.0.1:2000/get_routes", {
                params: { search_query: inputValue }
            }).then((res) => {
                return res.data.map((route) => {
                    return { value: route, label: route };
                });
            });
    }

    const filterStops = async (inputValue) => {
        return await axios.get("http://127.0.0.1:2000/get_stops", {
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
        return await axios.post("http://127.0.0.1:2000/logout").then((res) => {
            alert(res.data);
        });
    };

    useEffect(() => {
        const getNearestDepartureTime = async (route, stop="") => {
            return await axios.get("http:///127.0.0.1:2000/get_closest_departure_time", { 
                params: { route_name: route, stop_name: stop }
            }).then((res) => {
                return res.data;
            });
        };
        
        if (selectedRoute !== undefined && "value" in selectedRoute) {
            data.rows = [];
            let stop = "";
            if (selectedStop !== undefined && "value" in selectedStop)
                stop = selectedStop['value'][0];
            void getNearestDepartureTime(selectedRoute['value'][0], stop).then((res) => {
                res.forEach((route) => { 
                    data.rows.push({
                        routeLongName: route[0],
                        stopId: route[1],
                        stopName: route[2],
                        timeUntilDeparture: route[3]
                    });
                });
                setRoutesDisplayData(data);
                console.log(res);
            });
        }
    }, [selectedRoute, selectedStop]);

    useEffect(() => {
        document.getElementsByClassName('App')[0].className = "App App-auth"
    }, []);

    return (
        <div className="maps-and-schedules-container">
            <Header 
                logoutHandler={logoutHandler} 
                linkUnderline="mapsAndSchedules"
            />
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
                                routesDisplayData.rows.length > 0 ? `Retrieved at: ${new Date().toLocaleTimeString()}` : ""
                            } 
                        </div>
                        
                        { 
                            routesDisplayData.rows.length > 0 ? 
                            <CustomTable 
                                columns={data.columns} 
                                rows={routesDisplayData.rows}
                            />
                            : "No data to display"
                        }
                    </div>
                </div>
                <div className="right">
                    <div className="leaflet-container">
                        <MapContainer center={[-23.533773, -46.625290]} zoom={13}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {/* <Marker position={[48.8566, 2.3522]}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker> */}
                        </MapContainer>
                    </div>
                </div>
            </div>
        </div>
    );

};