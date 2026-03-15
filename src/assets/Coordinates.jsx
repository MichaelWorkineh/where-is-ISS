import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import { Canvas, useLoader } from "@react-three/fiber";
import { PointLight, Mesh, AmbientLight, SphereGeometry, MeshStandardMaterial, TextureLoader } from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import Img from "./earthTexture.jpg"
import LatLonGrid from "./LatLonGrid";
import { useGLTF } from "@react-three/drei";
//import Model from "./ISS/source/mesh.glb"
const earthRadius = 6371;// in kilometers
const simEarthRadius = 5;// in units for the simulation, you can adjust this as needed
/*
function ISSModel({position = [0, 0, 6], scale = 0.001}){
    const {scene} =useGLTF(Model);
    return <primitive object={scene} position={position} scale={[scale, scale, scale]} />;
}
*/
function CartesianCoordinates( latitude, longitude, altitude ) {
    const radius = earthRadius + altitude; // distance from the center of the Earth to the ISS
    
    const latRad = (latitude) * (Math.PI / 180); // polar angle
    const lonRad = (longitude) * (Math.PI / 180); // azimuthal angle

    const x = radius * Math.cos(latRad) * Math.sin(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.cos(lonRad);

    return [x, y, z];
}

function latLonToXYZ(lat, lon, radius) {
  const latRad = lat * Math.PI / 180
  const lonRad = lon * Math.PI / 180

  const x = radius * Math.cos(latRad) * Math.sin(lonRad)
  const y = radius * Math.sin(latRad)
  const z = radius * Math.cos(latRad) * Math.cos(lonRad)

  return [x, y, z]
}

export default function Coordinates() {
    const scale = simEarthRadius / earthRadius; // scale factor to convert real coordinates to simulation coordinates
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [altitude, setAltitude] = useState(0);

    const texture = useLoader(TextureLoader, Img)
    const fetchCoordinates = async () => {
            try {
                const response = await axios.get('/api/v1/satellites/25544');
                setLatitude(response.data.latitude);
                setLongitude(response.data.longitude);
                setAltitude(response.data.altitude);
            } catch (error) {
                console.error('Error fetching ISS coordinates:', error);
            }
        };
    
    useEffect(()=>{
        fetchCoordinates();

        const intervailID = setInterval(()=>{
            fetchCoordinates();
        }, 1500);
        return () => clearInterval(intervailID);
    }, []);


    const [x, y, z] = CartesianCoordinates(latitude, longitude, altitude);
    return (
        <>
            <div>
                <h3>Polar Coordinates where the center of the earth is the origin</h3>
                <p>Latitude: {latitude}°</p>
                <p>Longitude: {longitude}°</p>
                <p>Altitude: {altitude + 6371} km</p>
            </div>
            <div>
                <h3>Cartesian Coordinates where the center of the earth is the origin</h3>
                <p>X: {CartesianCoordinates(latitude, longitude, altitude)[0].toFixed(2)} km</p>
                <p>Y: {CartesianCoordinates(latitude, longitude, altitude)[1].toFixed(2)} km</p>
                <p>Z: {CartesianCoordinates(latitude, longitude, altitude)[2].toFixed(2)} km</p>
                <p>normalized cordnates {x*scale}, {y*scale}, {z*scale}</p>
            </div>
            <Canvas camera={{position: [x*scale, y*scale + 2, z*scale + 2]}} style={{ height: '100vh', width: '100%'}}>
                <color attach="background" args={["black"]}/>
                <OrbitControls />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Stars
                    radius={100}
                    depth={50}
                    count={5000}
                    factor={4}
                    saturation={0}
                    fade
                    speed={1}
                />
                <mesh rotation={[0, -Math.PI / 2, 0]}> 
                    <sphereGeometry args={[5, 64, 64]}/>
                    <meshStandardMaterial map={texture} />
                </mesh>
                <LatLonGrid radius={5.01}/>
                
                <mesh position={[x * scale, y * scale, z * scale]}>
                    <sphereGeometry args={[0.1, 16, 16]} />
                    <meshStandardMaterial color="red" />
                </mesh>
                
                {/*
                <ISSModel position={[x * scale, y * scale, z * scale]}/>            
                */}
            </Canvas>
        </>
    )
}