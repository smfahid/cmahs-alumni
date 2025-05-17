"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";

interface HeroImage {
  id: string;
  image_url: string;
  title?: string;
  description?: string;
}

export function HeroSection({ images }: { images: HeroImage[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const defaultImages = [
    {
      id: "default-1",
      image_url: "/placeholder.svg?height=600&width=1600",
      title: "Welcome to CMAHS Alumni",
      description: "Connecting generations of alumni for a stronger community",
    },
    {
      id: "default-2",
      image_url: "/placeholder.svg?height=600&width=1600",
      title: "Join Our Community",
      description: "Be part of our growing alumni network",
    },
  ];

  const heroImages = images.length > 0 ? images : defaultImages;

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? heroImages.length - 1 : prevIndex - 1
    );
  }, [heroImages.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  }, [heroImages.length]);

  useEffect(() => {
    const interval = setInterval(goToNext, 6000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div className="relative h-screen max-h-[800px] overflow-hidden">
      {heroImages.map((image, index) => (
        <div
          key={image.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentIndex ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="relative w-full h-full">
            <Image
              src={image.image_url || "/placeholder.svg"}
              alt={image.title || "Hero image"}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"></div>

            <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-4">
              <div className="container-custom max-w-5xl">
                <motion.div
                  key={`title-${currentIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                    {image.title || "CMAHS Alumni Association"}
                  </h1>
                  <p className="text-xl md:text-2xl text-center max-w-3xl mx-auto mb-8 text-gray-200">
                    {image.description ||
                      "Connecting generations of alumni for a stronger community"}
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      ))}

      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/80"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
}
