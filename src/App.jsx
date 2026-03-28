import './App.css'
import HeroBackground from './assets/HeroBackgorund'
import Coordinates from './assets/Coordinates'
import Map from './assets/Map'
{/*<iframe className="w-screen h-screen" allow="autoplay" src="https://www.youtube.com/embed/sWasdbDVNvc?si=4toWMppTctxpFEgB&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>*/}
function App() {
  return (
    <>
      {/*
      <div className='relative flex items-center justify-center h-screen overflow-hidden'>
        <HeroBackground videoID='zPH5KtjJFaQ'/>
        <div className='relative flex items-center justify-center z-10 w-full h-full bg-black/60'>
          <h1 className='text-7xl text-center text-white font-bold'>Where is the ISS?</h1>
        </div>
      </div>
      */}
      <div className="relative flex items-center justify-center h-screen overflow-hidden">

        <HeroBackground videoID="zPH5KtjJFaQ" />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/60 z-10" />

        {/* Content */}
        <div className="relative z-20 text-center text-white px-4">

          <h1 className="text-5xl md:text-6xl font-bold opacity-0 fade-in-up"
            style={{ animationDelay: "2s" }}
          >
            Where is the ISS?
          </h1>

          <p
            className="mt-4 text-lg opacity-0 fade-in-up"
            style={{ animationDelay: "2.5s" }}
          >
            You are orbiting Earth at 28,000 km/h
          </p>

          <p
            className="mt-2 text-sm opacity-0 fade-in-up"
            style={{ animationDelay: "3s" }}
          >
            Altitude: ~420 km
          </p>

        </div>
      </div>
      <div className='relative'>
        <Coordinates/>
      </div>
    </>
  )
}

export default App
