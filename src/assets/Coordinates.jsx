import React from "react";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { Canvas, useLoader } from "@react-three/fiber";
import { PointLight, Mesh, AmbientLight, SphereGeometry, MeshStandardMaterial, TextureLoader } from "three";
import { OrbitControls, Stars, Line, Html } from "@react-three/drei";
import Earth from "./3dModels/Eath";
import LatLonGrid from "./LatLonGrid";
import { useGLTF, Preload } from "@react-three/drei";
import { useTexture } from "@react-three/drei";
import HtmlInfo from "./3dModels/HtmlInfo";
import ISSModel from "./3dModels/ISSModel";

//import Model from "./ISS/source/mesh.glb"
const earthRadius = 6371;// in kilometers
const simEarthRadius = 5;// in units for the simulation, you can adjust this as needed

function CartesianCoordinates( latitude, longitude, altitude ) {
    const radius = earthRadius + altitude; // distance from the center of the Earth to the ISS
    
    const latRad = (latitude) * (Math.PI / 180); // polar angle
    const lonRad = (longitude) * (Math.PI / 180); // azimuthal angle

    const x = radius * Math.cos(latRad) * Math.sin(lonRad);
    const y = radius * Math.sin(latRad);
    const z = radius * Math.cos(latRad) * Math.cos(lonRad);

    return [x, y, z];
}

export default function Coordinates() {
    const scale = simEarthRadius / earthRadius; // scale factor to convert real coordinates to simulation coordinates
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [velocity, setVelocity] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [path, setPath] = useState(null);
    const [liteMode, setLiteMode] = useState(true);

    const fetchCoordinates = async () => {
            try {
                const response = await axios.get('/api/iss');
                setLatitude(response.data.latitude);
                setLongitude(response.data.longitude);
                setAltitude(response.data.altitude);
                setVelocity(response.data.velocity);
                setLoaded(true)
            } catch (error) {
                console.error('Error fetching ISS coordinates:', error);
            }
        };

    useEffect(()=>{
        fetchCoordinates();

        const intervailID = setInterval(()=>{
            fetchCoordinates();
        }, 3000);
        return () => clearInterval(intervailID);
    }, []);


    const [x, y, z] = CartesianCoordinates(latitude, longitude, altitude + earthRadius-2000);

    const [orbitPath, setOrbitPath] = useState([]);
    
    useEffect(()=>{
        if (!loaded) return;
        const newPoint = [x*scale, y*scale, z*scale];
        setOrbitPath(prev=>{
            const updated = [...prev, newPoint];
            if (updated.length > 2000) {
                setPath(updated)
                updated.shift();
            }
            return updated;
        })
    
    },[x, y, z])
    
    return (
        <>
            <button 
                className="p-2 rounded-md z-20 absolute top-180 left-5 bg-gray-700 hover:bg-gray-500 text-white border-2"
                style={{ borderColor: liteMode ? "#00ff00" : "#ff0000" }}
                onClick={() => setLiteMode(prev => !prev)}
            >
                lite mode <span style={{ color: liteMode ? "#00ff00" : "#ff0000" }} className="text-bold">{liteMode ? "ON" : "OFF"}</span>
            </button>
            <Canvas camera={{position: [x*scale, y*scale + 2, z*scale + 5]}} style={{ height: '100vh', width: '100%'}} className="z-0 relative">
                <Stars
                    radius={80}
                    depth={40}
                    count={2000}
                    factor={3}
                    fade
                    speed={0.5}
                />
                <Suspense fallback={null}>
                <color attach="background" args={["black"]}/>
                <OrbitControls 
                    enableZoom = {false}
                />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                
                <Earth/>
                <LatLonGrid radius={5.01}/>
                
                {orbitPath.length > 1 &&(
                        <Line points={orbitPath} color="yellow" lineWidth={2} dashed={false} />
                )}
                {console.log(path)}
    
                <ISSModel key={liteMode ? "lite" : "full"} position={[x * scale, y * scale, z * scale]} quick={liteMode} data={[latitude, longitude, altitude, velocity]}/>   
                <Preload all/>
                </Suspense>
            </Canvas>
        </>
    )
}
