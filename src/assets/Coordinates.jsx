import React from "react";

import { useState, useEffect, Suspense } from "react";
import axios from "axios";
import { Canvas, useLoader } from "@react-three/fiber";
import { PointLight, Mesh, AmbientLight, SphereGeometry, MeshStandardMaterial, TextureLoader } from "three";
import { OrbitControls, Stars, Line, Html } from "@react-three/drei";
import Img from "./earthTexture.webp"
import LatLonGrid from "./LatLonGrid";
import { useGLTF, Preload } from "@react-three/drei";
import { useTexture } from "@react-three/drei";


//import Model from "./ISS/source/mesh.glb"
const earthRadius = 6371;// in kilometers
const simEarthRadius = 5;// in units for the simulation, you can adjust this as needed
useGLTF.preload('/ISS/source/sat-compressed.glb');
useTexture.preload(Img)

function HtmlInfo({data = [0, 0, 0, 0]}){
    return(
        <Html occlude distanceFactor={10} position={[-1, 0.5, 0]}>
            <div className="bg-gray-700 text-white whitespace-nowrap p-1 rounded-md select-none">
                <p className="w-full"><span className="font-bold">Location</span> ({data[0].toFixed(2)}, {data[1].toFixed(2)})</p>
                <p className="w-full"><span className="font-bold">Altitude</span> {data[2].toFixed(1)} Km</p>
                <p className="w-full"><span className="font-bold">Velocity</span> {data[3].toFixed(1)}</p>
            </div>
        </Html>
    )
}

function ISSModel({position = [0, 0, 6], scale = 0.001, quick = true, data = [0, 0, 0, 0]}){
    if (quick){
        return(
            <mesh position={position}> 
                <sphereGeometry args={[0.2, 16, 16]}/>
                <meshStandardMaterial color={"red"} />
                <HtmlInfo data={data}/>
            </mesh>
        )
    } 
    const {scene} =useGLTF('/ISS/source/satglb.glb');
    return (
        <group position={position}>
            <primitive object={scene} scale={[0.2, 0.2, 0.2]} dispose={null} />
            <HtmlInfo data={data}/>
        </group>
    )
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
                <Html center position={[0 , -7, 0]}>
                    <div className="text-white whitespace-nowrap text-center select-none">
                        Look around! <br/>The ISS might be outside the camera FOV
                    </div>
                </Html>
            </mesh>
        </>
    )
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
                <Suspense fallback={null}>
                <color attach="background" args={["black"]}/>
                <OrbitControls 
                    enableZoom = {false}
                />
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
    
                <ISSModel key={liteMode ? "lite" : "full"} position={[x * scale, y * scale, z * scale]} quick={liteMode} data={[latitude, longitude, altitude, velocity]}/>   
                
                <Preload all/>
                </Suspense>
            </Canvas>
        </>
    )
}
//gltf-pipeline -i public/ISS/source/satglb.glb -o public/ISS/source/sat-compressed.glb -d