"use client";

import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    src: "/images/slider.jpg",
    alt: "Grupo MIT - Medicina de Avanzada",
    label: "Medicina Interdisciplinaria y Trasplantes",
    title: ["Medicina de", "Avanzada"],
    sub: "Centro líder del Litoral y segundo en trasplante renal en Argentina.",
  },
  {
    src: "/images/slider2.png",
    alt: "Grupo MIT - Staff Médico",
    label: "Nuestro equipo",
    title: ["Staff", "Médico"],
    sub: "Profesionales de excelencia comprometidos con tu salud.",
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % slides.length);
  }, []);

  const prev = () => setCurrent((c) => (c - 1 + slides.length) % slides.length);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full h-[420px] md:h-[560px] overflow-hidden bg-gray-900">
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            i === current ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover scale-105"
            priority={i === 0}
          />
          {/* Gradient: darker on left, fades right */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-2xl">
        <p className="text-mit-teal text-[10px] md:text-xs font-medium tracking-[0.25em] uppercase mb-3 opacity-90">
          Medicina Interdisciplinaria y Trasplantes
        </p>
        <h1 className="text-white text-3xl md:text-5xl font-light tracking-wider leading-tight mb-3 md:mb-4">
          Medicina de<br />
          <span className="font-semibold">Avanzada</span>
        </h1>
        <div className="w-10 md:w-14 h-px bg-mit-teal mb-3 md:mb-5" />
        <p className="text-white/75 text-xs md:text-sm font-light leading-relaxed max-w-xs md:max-w-sm">
          Centro líder del Litoral y segundo en trasplante renal en Argentina.
        </p>
      </div>

      {/* Arrows */}
      <button
        onClick={prev}
        className="absolute left-5 top-1/2 -translate-y-1/2 border border-white/30 text-white/80 hover:text-white hover:border-white p-2.5 rounded-full backdrop-blur-sm transition-all duration-300"
        aria-label="Anterior"
      >
        <ChevronLeft size={20} strokeWidth={1.5} />
      </button>
      <button
        onClick={next}
        className="absolute right-5 top-1/2 -translate-y-1/2 border border-white/30 text-white/80 hover:text-white hover:border-white p-2.5 rounded-full backdrop-blur-sm transition-all duration-300"
        aria-label="Siguiente"
      >
        <ChevronRight size={20} strokeWidth={1.5} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-6 left-10 md:left-20 flex gap-2 items-center">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? "w-6 h-1.5 bg-mit-teal"
                : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
            }`}
            aria-label={`Ir a slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
