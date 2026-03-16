import react from 'react'
export default function HeroBackground({videoID = 'sWasdbDVNvc'}) {
    const videoSrc = `https://www.youtube.com/embed/${videoID}?showinfo=0&rel=0&modestbranding=1&autoplay=1&controls=0&loop=1&playlist=${videoID}&mute=1`
    return (
        <div className="absolute inset-0 overflow-hidden">
            <iframe
                src={videoSrc}
                allow='autoplay; encrypted-media; gyroscope;'
                allowFullScreen
                title='ISS live stream'
                className='
                    absolute
                    top-1/2 left-1/2
                    w-[177.78vh]
                    h-[56.25vw]
                    min-w-full
                    min-h-full
                    -translate-x-1/2
                    -translate-y-1/2
                    pointer-events-none
                '
            />
        </div>
    )
}