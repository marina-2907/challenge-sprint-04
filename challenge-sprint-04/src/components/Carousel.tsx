import { useState } from 'react'
type Slide = { src: string; alt: string }
export function Carousel({ slides }: { slides: Slide[] }){
  const [index, setIndex] = useState(0)
  const total = slides.length
  const go = (n: number) => setIndex((index + n + total) % total)
  return (
    <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl shadow">
      {slides.map((s, i) => (
        <img key={i} src={s.src} alt={s.alt}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${i===index? 'opacity-100' : 'opacity-0'}`} />
      ))}
      <button aria-label="Anterior" onClick={()=>go(-1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 hover:bg-white">‹</button>
      <button aria-label="Próximo" onClick={()=>go(1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 px-3 py-2 hover:bg-white">›</button>
    </div>
  )
}
