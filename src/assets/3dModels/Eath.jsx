import { Mesh, SphereGeometry, MeshStandardMaterial, TextureLoader } from "three";
import { Html } from "@react-three/drei";
import Img from "./earthTexture.webp"
import { Preload } from "@react-three/drei";
import { useTexture } from "@react-three/drei"

const earthRadius = 6371;// in kilometers
const simEarthRadius = 5;// in units for the simulation, you can adjust this as needed
useTexture.preload(Img)

export default function Earth(){
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