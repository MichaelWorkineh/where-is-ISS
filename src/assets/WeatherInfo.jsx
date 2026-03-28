import { useState, useEffect } from "react"
import axios from "axios"

const Weather_code = {
    0: "clear sky",
    1: "mainly clear sky",
    2: "partly cloudy",
    3: "overcast",
    45: "foggy",
    48: "depositing rime fog",
    51: "light drizzle",
    53: "moderate drizzle",
    55: "dense intensity drizzle",
    56: "light, freezing drizzle",
    57: "dense intensity, freezing drizzle",
    61: "slight rain",
    63: "moderate rain",
    65: "dense rain",
    66: "light freezing rain",
    67: "heavy intensity freezing rain",
    71: "slight snow fall",
    73: "moderate snow fall",
    75: "heavy intensity snow fall",
    77: "snow grains",
    80: "slight rain showers",
    81: "moderate rain showers",
    82: "violent rain showers",
    85: "slight show showers",
    86: "heavy show showers",
    95: "thuderstorm",
    96: "thuderstorm with slight hail",
    99: "thunderstorm with heavy hail"
}

function convertTime(isoTime){
    const date = new Date(isoTime)
    return date.toLocaleDateString('en-US',{hour: 'numeric', minute: 'numeric', hour12: true})
}

function Weatherwidget({date, min, max, sunRise, sunSet, W_C}){
    return(
        <div className="bg-gray-800 p-6 rounded-md">
            <p className="text-center text-2xl mb-3">{date}</p>
            <div className="text-sm">
                <p className="mb-2">⬇️ {min}°C</p>
                <p className="mb-2">⬆️{max}°C</p>
                <p className="mb-2">🌄{convertTime(sunRise)}</p>
                <p className="mb-2">🌆{convertTime(sunSet)}</p>
                <p className="mb-2">{W_C}</p>
            </div>
        </div>
    )
}

export default function WeatherInfo({lat, lon}){
    const [weatherData, setWeatherData] = useState(null)
    useEffect(()=>{
      const fetchData = async () => {
        try{
            const response = await axios.get(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m,weather_code&daily=temperature_2m_max,temperature_2m_min,sunrise,sunset,weather_code`)
            setWeatherData(response.data)
        } catch(e){
            console.error('error fetching weather', e)
        }
      }
      fetchData()  
    }, [lat, lon])
    return(
        <>
            {
            weatherData &&    
            (<div className="bg-black text-white flex flex-col items-center justify-center">
                <div className=" bg-gray-700/80 p-2 rounded-md w-full">
                    <h2 className="font-bold text-3xl mb-2"> Current Weather</h2>
                    <div className="inline-flex gap-4">
                        <p>{convertTime(weatherData.current.time)}</p>
                        <p>Temp: {weatherData.current.temperature_2m}°C</p>
                        <p>Wind: {weatherData.current.wind_speed_10m}km/h</p>
                        <p>it's {Weather_code[weatherData.current.weather_code]}</p>
                    </div>
                </div>
                <div className="flex flex-col xl:flex-row gap-7 item-center justify-center m-2 p-1 w-full">
                    
                    {
                       weatherData.daily.time.map((item, id) => (
                            <Weatherwidget date={
                                weatherData.daily.time[id]} 
                                min={weatherData.daily.temperature_2m_min[id]} 
                                max={weatherData.daily.temperature_2m_max[id]} 
                                sunRise={weatherData.daily.sunrise[id]}
                                sunSet={weatherData.daily.sunset[id]}
                                W_C={Weather_code[weatherData.daily.weather_code[id]]}
                            />   
                       )) 
                    }
                </div>
            </div>)
            }
        </>
    )
}