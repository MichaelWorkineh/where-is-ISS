import { Mesh, SphereGeometry, MeshStandardMaterial } from "three";;
import { useGLTF, Preload } from "@react-three/drei";
import HtmlInfo from "./HtmlInfo";

useGLTF.preload('/ISS/source/sat-compressed.glb');

export default function ISSModel({position = [0, 0, 6], scale = 0.001, quick = true, data = [0, 0, 0, 0]}){
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