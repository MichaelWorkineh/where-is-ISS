import react from 'react'
export default function HeroBackground({videoID = 'sWasdbDVNvc'}) {
    const videoSrc = `https://www.youtube.com/embed/${videoID}?showinfo=0&rel=0&autoplay=1&controls=0&loop=1&playlist=${videoID}&mute=1`
    return (
            <iframe
                src={videoSrc}
                allow='autoplay; encrypted-media; gyroscope;'
                allowFullScreen
                title='ISS live stream'
                className='absolute z-0 w-auto min-w-full min-h-full max-w-none'
            />
        
    )
}