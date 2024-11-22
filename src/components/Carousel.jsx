import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight } from "react-feather"

export default function Carousel({
  slides,
  autoSlide = false,
  autoSlideInterval = 3000,
}) {
  const [curr, setCurr] = useState(0)

  const prev = () =>
    setCurr((curr) => (curr === 0 ? slides.length - 1 : curr - 1))
  const next = () =>
    setCurr((curr) => (curr === slides.length - 1 ? 0 : curr + 1))

  useEffect(() => {
    if (!autoSlide || slides.length <= 1) return
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
  }, [curr, autoSlide, autoSlideInterval, slides.length])

  return (
    <div className="overflow-hidden max-h-[300px] relative">
      <div
        className="flex transition-transform ease-out duration-500"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {slides.map((postImg, index) => (
          <img
            key={index}
            src={postImg}
            className="max-h-[300px] min-w-full aspect-square object-cover"
            alt={`Slide ${index + 1}`}
          />
        ))}
      </div>
      {slides.length > 1 && (
        <div className="absolute inset-0 flex items-center justify-between p-4">
          {/* Previous button only shows if not on the first image */}
          <button
            onClick={prev}
            className={`p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white ${curr === 0 ? "invisible" : ""}`}
          >
            <ChevronLeft size={20} />
          </button>
          {/* Next button only shows if not on the last image */}
          <button
            onClick={next}
            className={`p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white ${curr === slides.length - 1 ? "invisible" : ""}`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
      {slides.length > 1 && (
        <div className="absolute bottom-0 left-1/2 bg-white px-3 py-1 border-1 border-t-purple-600 border-l-pborder-t-purple-600 border-r-pborder-t-purple-600 rounded-t-lg transform -translate-x-1/2 flex gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurr(index)}
              className={`w-2 h-2 rounded-full ${curr === index ? "bg-black" : "bg-gray-400"}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
