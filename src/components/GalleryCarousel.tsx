"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const images = [
  "/images/1.jpeg",
  "/images/2.jpeg",
  "/images/3.jpeg",
  "/images/5.jpeg",
  "/images/6.jpeg",
  "/images/7.jpeg",
];

export default function GalleryCarousel() {
  const [current, setCurrent] = useState(0);
  const dragStart = useRef(0);
  const dragging = useRef(false);

  // Responsive: 1 on mobile, 2 on sm, 3 on md+
  const getVisible = () => {
    if (typeof window === "undefined") return 3;
    if (window.innerWidth < 640) return 1;
    if (window.innerWidth < 768) return 2;
    return 3;
  };
  const VISIBLE = getVisible();
  const max = images.length - VISIBLE;

  const next = () => setCurrent((c) => Math.min(c + 1, max));
  const prev = () => setCurrent((c) => Math.max(c - 1, 0));


  return (
    <div className="overflow-hidden">
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * (100 / VISIBLE)}%)` }}
        onMouseDown={(e) => { dragging.current = true; dragStart.current = e.clientX; }}
        onMouseUp={(e) => {
          if (!dragging.current) return;
          dragging.current = false;
          const delta = dragStart.current - e.clientX;
          if (delta > 40) next();
          if (delta < -40) prev();
        }}
        onTouchStart={(e) => { dragStart.current = e.touches[0].clientX; }}
        onTouchEnd={(e) => {
          const delta = dragStart.current - e.changedTouches[0].clientX;
          if (delta > 40) next();
          if (delta < -40) prev();
        }}
      >
        {images.map((src, i) => (
          <div
            key={src}
            className="flex-shrink-0 px-1.5"
            style={{ width: `${100 / VISIBLE}%` }}
          >
            <div className="relative h-56 md:h-72 rounded-lg overflow-hidden group">
              <Image
                src={src}
                alt={`Galería MIT ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500 select-none"
                draggable={false}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-6">
        <button
          onClick={prev}
          disabled={current === 0}
          className="border border-gray-200 text-gray-400 hover:border-mit-teal hover:text-mit-teal p-2 rounded-full transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed"
          aria-label="Anterior"
        >
          <ChevronLeft size={18} strokeWidth={1.5} />
        </button>

        <div className="flex gap-1.5 items-center">
          {Array.from({ length: max + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? "w-5 h-1.5 bg-mit-teal"
                  : "w-1.5 h-1.5 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Posición ${i + 1}`}
            />
          ))}
        </div>

        <button
          onClick={next}
          disabled={current >= max}
          className="border border-gray-200 text-gray-400 hover:border-mit-teal hover:text-mit-teal p-2 rounded-full transition-all duration-300 disabled:opacity-25 disabled:cursor-not-allowed"
          aria-label="Siguiente"
        >
          <ChevronRight size={18} strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
