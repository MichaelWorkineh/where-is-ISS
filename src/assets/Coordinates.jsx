import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import { Canvas, useLoader } from "@react-three/fiber";
import { PointLight, Mesh, AmbientLight, SphereGeometry, MeshStandardMaterial, TextureLoader } from "three";
import { OrbitControls, Stars, Line } from "@react-three/drei";
import Img from "./earthTexture.jpg"
import LatLonGrid from "./LatLonGrid";
import { useGLTF } from "@react-three/drei";
//import Model from "./ISS/source/mesh.glb"
const earthRadius = 6371;// in kilometers
const simEarthRadius = 5;// in units for the simulation, you can adjust this as needed

function ISSModel({position = [0, 0, 6], scale = 0.001}){
    const {scene} =useGLTF('/ISS/source/satglb.glb');
    return <primitive object={scene} position={position} scale={[0.2, 0.2, 0.2]} />;
}

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
    const [loaded, setLoaded] = useState(false)
    const [path, setPath] = useState(null)
    const texture = useLoader(TextureLoader, Img)
    const fetchCoordinates = async () => {
            try {
                const response = await axios.get('/api/v1/satellites/25544');
                setLatitude(response.data.latitude);
                setLongitude(response.data.longitude);
                setAltitude(response.data.altitude);
                setLoaded(true)
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


    const [x, y, z] = CartesianCoordinates(latitude, longitude, altitude + earthRadius-2000);

    const [orbitPath, setOrbitPath] = useState([]);
    
    useEffect(()=>{
        if (!loaded) return;
        const newPoint = [x*scale, y*scale, z*scale];
        setOrbitPath(prev=>{
            const updated = [...prev, newPoint];
            if (updated.length > 1000000) {
                setPath(updated)
                updated.shift();
            }
            return updated;
        })
    
    },[x, y, z])


    
    return (
        <>
            
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
                
                {orbitPath.length > 1 &&(
                        
                        <Line points={orbitPath} color="yellow" lineWidth={2} dashed={false} />
                    
                )}
                {console.log(path)}
                
                <ISSModel position={[x * scale, y * scale, z * scale]}/>            
                
            </Canvas>
        </>
    )
}