import React from "react";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { Canvas, useLoader } from "@react-three/fiber";
import { PointLight, Mesh, AmbientLight, SphereGeometry, MeshStandardMaterial, TextureLoader } from "three";
import { OrbitControls, Stars, Line } from "@react-three/drei";
import Img from "./earthTexture.webp"
import LatLonGrid from "./LatLonGrid";
import { useGLTF, Preload } from "@react-three/drei";
import { useTexture } from "@react-three/drei";

//import Model from "./ISS/source/mesh.glb"
const earthRadius = 6371;// in kilometers
const simEarthRadius = 5;// in units for the simulation, you can adjust this as needed
useGLTF.preload('/ISS/source/sat-compressed.glb');
useTexture.preload(Img)

function ISSModel({position = [0, 0, 6], scale = 0.001, quick = true}){
    if (quick == true){
        return(
            <mesh position={position}> 
                <sphereGeometry args={[0.2, 32, 32]}/>
                <meshStandardMaterial color={"red"} />
            </mesh>
        )
    } 
    const {scene} =useGLTF('/ISS/source/satglb.glb');
    return (<primitive object={scene} position={position} scale={[0.2, 0.2, 0.2]} dispose={null} />)
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

function Earth(){
    const texture = useTexture(Img)
    return(
        <>
            <mesh rotation={[0, -Math.PI / 2, 0]}> 
                <sphereGeometry args={[5, 32, 32]}/>
                <meshStandardMaterial map={texture} />
            </mesh>
        </>
    )
}

export default function Coordinates() {
    const scale = simEarthRadius / earthRadius; // scale factor to convert real coordinates to simulation coordinates
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [altitude, setAltitude] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [path, setPath] = useState(null);
    const [liteMode, setLiteMode] = useState(true);

    const fetchCoordinates = async () => {
            try {
                const response = await axios.get('/api/iss');
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
                onClick={
                    (prev)=>{
                        setLiteMode(!prev)
                    }
                }    
            >
                lite mode {liteMode}
            </button>
            <Canvas camera={{position: [x*scale, y*scale + 2, z*scale + 2]}} style={{ height: '100vh', width: '100%'}}>
                <Suspense fallback={null}>
                <color attach="background" args={["black"]}/>
                <OrbitControls />
                <ambientLight />
                <pointLight position={[10, 10, 10]} />
                <Stars
                    radius={80}
                    depth={40}
                    count={2000}
                    factor={3}
                    fade
                    speed={0.5}
                />
                <Earth/>
                <LatLonGrid radius={5.01}/>
                
                {orbitPath.length > 1 &&(
                        
                        <Line points={orbitPath} color="yellow" lineWidth={2} dashed={false} />
                    
                )}
                {console.log(path)}
    
                <ISSModel position={[x * scale, y * scale, z * scale]} quick={liteMode}/>   
                
                <Preload all/>
                </Suspense>
            </Canvas>
        </>
    )
}
//gltf-pipeline -i public/ISS/source/satglb.glb -o public/ISS/source/sat-compressed.glb -d