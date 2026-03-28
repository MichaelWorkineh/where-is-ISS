import axios from "axios"
import { useState, useEffect } from "react"
export default function Location ({ lat, lon }){
    const [place, setPlace] = useState(null)
    useEffect(()=>{
        if(!lat || !lon) return
        const fetchPlace = async () => {
            try{
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
                )
                const data = await res.json()
                setPlace(

                    data.address?.country ||
                    data.address?.state ||
                    "Over Ocean"
                )
            } catch (e) {
                console.log(e)
            }
        }
        fetchPlace()
    }, [lat, lon])
    return(
        <>
            {
            (place)&&(
            <h3>
                currently on top of {place}
            </h3>
            )}
        </>
    )
}