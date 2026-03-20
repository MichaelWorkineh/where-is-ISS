import { Html } from "@react-three/drei";
export default function HtmlInfo({data = [0, 0, 0, 0]}){
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