import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import HeroBackground from './assets/HeroBackgorund'
import Coordinates from './assets/Coordinates'
{/*<iframe className="w-screen h-screen" allow="autoplay" src="https://www.youtube.com/embed/sWasdbDVNvc?si=4toWMppTctxpFEgB&amp;controls=0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>*/}
function App() {
  const [count, setCount] = useState(0)

  return (
    <>
    <div className='relative flex items-center justify-center h-screen mb-12 overflow-hidden'>
      <HeroBackground videoID='zPH5KtjJFaQ'/>
      <div className='relative flex items-center justify-center z-10 w-full h-full bg-black/60'>
        <h1 className='text-5xl text-center text-white font-bold'>Where is the ISS?</h1>
      </div>
    </div>
    <h2>Location</h2>
    <Coordinates/>
    </>
  )
}

export default App
