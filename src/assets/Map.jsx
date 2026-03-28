import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { useState, useEffect } from 'react';
import { useMap, Polyline, Circle } from 'react-leaflet';

function RecterMap({location}) {
    const map = useMap()
    useEffect(()=>{
      map.setView(location)
    }, [location, map])
    return null
  }

const MapComponent = ({location, zoom = 10, height = '500px', width = '100%'}) => {
  const [groundTrack, setGroundTrack] = useState([])
  useEffect(()=>{
    if (!location[0] || !location[1]) return

    setGroundTrack(prev => {
      const updated = [...prev, [location[0], location[1]]]
      if (updated.length > 200) updated.shift()
      return updated
    })
  },[location[0], location[1]])
  return (
    <MapContainer center={location} zoom={zoom} scrollWheelZoom={false} style={{ height: height, width: width }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
        <Marker
          key={location.id}
          position={[location[0], location[1]]}
        >
        </Marker>

        {(location)&&(<RecterMap location={location} />)}
      <Polyline positions={groundTrack} pathOptions={{color: "yellow"}}/> 
          
    </MapContainer>
  );
};

export default MapComponent;
