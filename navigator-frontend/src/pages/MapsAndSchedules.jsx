import { Header } from '../elements/Header';
import React, { useEffect, useState } from 'react';
import AsyncSelect from 'react-select/async';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import { useNavigate } from 'react-router-dom';
import {MapContainer , TileLayer, Marker, Popup} from 'react-leaflet';
import '../assets/styles/MapsAndSchedules.css';
import { CustomTable } from '../elements/CustomTable';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


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
          rows: [],
    };
    let coordinates = {
        columns : [
            {
                label:'Latitude',
                renderCell: (item) => item.latitude
            },
            {
                label : 'Longitude',
                renderCell: (item) => item.longitude
            },
            {
                label : 'StopName',
                renderCell: (item) => item.name
            }


        ],
        rows : [],
        center : []
    };

    const [routesDisplayData, setRoutesDisplayData] = useState(data);
    const [routePrice, setRoutePrice] = useState();
    const [selectedRoute, setSelectedRoute] = useState({});
    const [selectedStop, setSelectedStop] = useState({});
    const [mapDisplayData, setMapData] = useState({
        columns: [
          { label: 'Latitude', renderCell: (item) => item.latitude },
          { label: 'Longitude', renderCell: (item) => item.longitude },
          { label: 'StopName', renderCell: (item) => item.name}
        ],
        rows: [],
        center : []
      });
    


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
                    coordinates.rows.push({
                        latitude: route[4],
                        longitude: route[5],
                        name : route[2]
                    });
                });
                const avgLatitude = coordinates.rows.reduce((sum, point) => sum + point.latitude, 0) / coordinates.rows.length;
                const avgLongitude = coordinates.rows.reduce((sum, point) => sum + point.longitude, 0) / coordinates.rows.length;
                setMapData({
                    columns : coordinates.columns,
                    rows : coordinates.rows,
                    center : [avgLongitude, avgLatitude]
                })
                setRoutesDisplayData(data);
                console.log(res);
            });

            
        }
    }, [selectedRoute, selectedStop]);

    useEffect(() => {
        const getRoutePrice = async (route) => {
            return await axios.get("http:///127.0.0.1:2000/get_route_price", { 
                params: { route_name: route }
            }).then((res) => {
                return res.data;
            });
        };
        if (selectedRoute !== undefined && "value" in selectedRoute)
            void getRoutePrice(selectedRoute['value'][0]).then((res) => {
                setRoutePrice(res['Price']);
            });
    }, [selectedRoute]);



    useEffect(() => {
        document.getElementsByClassName('App')[0].className = "App App-auth"
    }, []);

    console.log('Coordinates.rows:', mapDisplayData.center);

    return (
        <div className="maps-and-schedules-container">
            <Header 
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
                        <div className="route-price">
                            {
                                routePrice !== undefined ? `Route Price: ${routePrice} BRL` : ""
                            }
                        </div>
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
                    {mapDisplayData.rows.length > 0 ? (
                        <MapContainer center={[mapDisplayData.center]} zoom={13}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {mapDisplayData.rows.map((item, index) => (
                                <Marker key={index} position={[item.longitude, item.latitude]}>
                                    <Popup> {item.name} </Popup>
                                </Marker>
                            ))}
                        </MapContainer>
                        ) : (
                        <MapContainer center={[-23.533773, -46.625290]} zoom={13}>
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                          
                            {/* {<Marker position={[48.8566, 2.3522]}>
                                <Popup>
                                    A pretty CSS3 popup. <br /> Easily customizable.
                                </Popup>
                            </Marker> } */}
                            <Marker position={[-23.533773, -46.625290]}>
                            <Popup>
                                <div>
                                    Sao Paulo which is the center <br />
                                </div>
                             </Popup>
                            </Marker>
                          </MapContainer>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

};






