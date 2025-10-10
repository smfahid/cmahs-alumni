"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react";
import { motion } from "framer-motion";

interface CoreValueItem {
  icon?: React.ReactNode;
  text: string;
}

interface AboutContentSectionProps {
  pageTitle: string;
  introTitle?: string;
  introParagraphs: string[];
  imageUrl?: string;
  imageAlt?: string;
  mission?: {
    title: string;
    text: string;
  };
  vision?: {
    title: string;
    text: string;
  };
  coreValues?: {
    title: string;
    values: CoreValueItem[];
  };
}

export function AboutContentSection({
  pageTitle,
  introTitle,
  introParagraphs,
  imageUrl,
  imageAlt = "About Us Image",
  mission,
  vision,
  coreValues,
}: Readonly<AboutContentSectionProps>) {
  return (
    <section className="py-20 sm:py-24 md:py-32 bg-gradient-to-b from-white via-primary-50/10 to-white relative overflow-hidden">
      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 md:mb-20"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-4">
            {pageTitle}
          </h1>
        </motion.div>

        {/* Intro Content with Image */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center mb-20 md:mb-24"
        >
          <div className={imageUrl ? "order-2 md:order-1" : "col-span-2"}>
            {introTitle && (
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6">
                {introTitle}
              </h2>
            )}
            <div className="space-y-4">
              {introParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className="text-muted-foreground leading-relaxed text-base md:text-lg"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="order-1 md:order-2 relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-card"
            >
              <Image
                src={imageUrl}
                alt={imageAlt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-500"
              />
            </motion.div>
          )}
        </motion.div>

        {/* Mission & Vision */}
        {(mission || vision) && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-20 md:mb-24"
          >
            {mission && (
              <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-card border border-border/50 hover:shadow-card-hover transition-all duration-300">
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4">
                  {mission.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-[15px] md:text-base">
                  {mission.text}
                </p>
              </div>
            )}
            {vision && (
              <div className="bg-white p-8 lg:p-10 rounded-2xl shadow-card border border-border/50 hover:shadow-card-hover transition-all duration-300">
                <h3 className="text-2xl md:text-3xl font-semibold tracking-tight text-foreground mb-4">
                  {vision.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed text-[15px] md:text-base">
                  {vision.text}
                </p>
              </div>
            )}
          </motion.div>
        )}

        {/* Core Values */}
        {coreValues && coreValues.values.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-white p-8 lg:p-12 rounded-2xl shadow-card border border-border/50"
          >
            <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-10 text-center">
              {coreValues.title}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                  className="flex items-start space-x-4 p-5 bg-primary-50/30 hover:bg-primary-50/50 rounded-xl transition-colors duration-200"
                >
                  <div className="flex-shrink-0 text-primary pt-0.5">
                    {value.icon || <CheckCircle className="h-6 w-6" />}
                  </div>
                  <p className="text-foreground/90 leading-relaxed text-[15px]">
                    {value.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
