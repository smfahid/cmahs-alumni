"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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
    const interval = setInterval(goToNext, 2000);
    return () => clearInterval(interval);
  }, [goToNext]);

  return (
    <div className="relative h-screen min-h-[600px] md:min-h-[700px] max-h-[900px] overflow-hidden bg-black">
      <AnimatePresence initial={false}>
        {heroImages.map(
          (image, index) =>
            index === currentIndex && (
              <motion.div
                key={image.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeInOut",
                }}
                className="absolute inset-0"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={image.image_url || "/placeholder.svg"}
                    alt={image.title || "Hero image"}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    quality={90}
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60"></div>

                  <div className="absolute inset-0 flex items-center justify-center text-white px-4 sm:px-6">
                    <div className="w-full h-full grid grid-rows-4 gap-0">
                      {/* Quarter 1 - Empty */}
                      <div className="flex items-center justify-center">
                        {/* Empty space */}
                      </div>

                      {/* Quarter 2 - Title Part 1 */}
                      <div className="flex items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="text-center"
                        >
                          <motion.h1
                            className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-semibold leading-[1.1] tracking-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.8,
                              delay: 0.3,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          ></motion.h1>
                        </motion.div>
                      </div>

                      {/* Quarter 3 - Title Part 2 & Description */}
                      <div className="flex flex-col items-center justify-center">
                        <motion.div
                          initial={{ opacity: 0, y: 40 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.2,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="text-center"
                        >
                          <motion.h1
                            className="text-lg sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4 leading-[1.1] tracking-tight"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.8,
                              delay: 0.3,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          >
                            {image.title || "Char Mehar Azizia High School"}
                            <br />
                            Alumni Association
                          </motion.h1>
                          <motion.p
                            className="text-sm sm:text-lg md:text-xl lg:text-2xl text-white/90 font-light leading-relaxed"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              duration: 0.8,
                              delay: 0.4,
                              ease: [0.16, 1, 0.3, 1],
                            }}
                          >
                            {image.description || "Generation to Generation"}
                          </motion.p>
                        </motion.div>
                      </div>

                      {/* Quarter 4 - Buttons */}
                      <div className="flex items-center justify-center">
                        <motion.div
                          className="flex flex-row gap-4"
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.8,
                            delay: 0.5,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                        >
                          <Link href="/membership">
                            <Button
                              size="lg"
                              className="bg-white text-primary hover:bg-white/90 rounded-xl px-6 h-10 md:h-12 text-sm md:text-base font-medium shadow-xl active:scale-95 transition-all duration-200"
                            >
                              Join Now
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </Link>
                          <Link href="/about">
                            <Button
                              size="lg"
                              variant="outline"
                              className="bg-transparent hover:bg-white/10 text-white border-2 border-white/50 hover:border-white rounded-xl px-6 h-10 md:h-12 text-sm md:text-base font-medium backdrop-blur-sm active:scale-95 transition-all duration-200"
                            >
                              Learn More
                            </Button>
                          </Link>
                        </motion.div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
        )}
      </AnimatePresence>

      {heroImages.length > 1 && (
        <>
          <motion.button
            onClick={goToPrevious}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute left-4 md:left-8 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all duration-200 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Previous slide"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>
          <motion.button
            onClick={goToNext}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="absolute right-4 md:right-8 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 md:p-4 rounded-full transition-all duration-200 backdrop-blur-md border border-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
            aria-label="Next slide"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </motion.button>

          <div className="absolute bottom-8 md:bottom-12 left-0 right-0 flex justify-center gap-2 md:gap-3">
            {heroImages.map((_, index) => (
              <motion.button
                key={index}
                onClick={() => setCurrentIndex(index)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                className="relative focus:outline-none group"
                aria-label={`Go to slide ${index + 1}`}
              >
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-white w-8 md:w-10 h-2"
                      : "bg-white/40 hover:bg-white/60 w-2 h-2"
                  }`}
                />
              </motion.button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
