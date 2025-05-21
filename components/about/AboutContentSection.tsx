"use client";

import Image from "next/image";
import { CheckCircle } from "lucide-react"; // Example icon for core values

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
    <section className="py-16 md:py-20 bg-gray-50 relative overflow-hidden">
      {/* Optional background decorations similar to other sections */}
      <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-primary-50/30 rounded-br-full opacity-50 transform -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-primary-50/30 rounded-tl-full opacity-50 transform translate-x-1/2 translate-y-1/2"></div>

      <div className="container-custom relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">
            {pageTitle}
          </h1>
          <div className="w-24 h-1.5 bg-primary-300 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center mb-12 md:mb-16">
          <div className={imageUrl ? "order-2 md:order-1" : "col-span-2"}>
            {introTitle && (
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
                {introTitle}
              </h2>
            )}
            {introParagraphs.map((paragraph, index) => (
              <p
                key={index}
                className="text-gray-700 leading-relaxed mb-4 text-base md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
          {imageUrl && (
            <div className="order-1 md:order-2 relative w-full h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
              <Image
                src={"/assets/img-17.jpeg"}
                alt={imageAlt}
                layout="fill"
                objectFit="cover"
                className="transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          )}
        </div>

        {(mission || vision) && (
          <div className="grid md:grid-cols-2 gap-8 mb-12 md:mb-16">
            {mission && (
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg card-hover">
                <h3 className="text-2xl font-semibold text-primary mb-3">
                  {mission.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{mission.text}</p>
              </div>
            )}
            {vision && (
              <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg card-hover">
                <h3 className="text-2xl font-semibold text-primary mb-3">
                  {vision.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{vision.text}</p>
              </div>
            )}
          </div>
        )}

        {coreValues && coreValues.values.length > 0 && (
          <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
            <h3 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
              {coreValues.title}
            </h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.values.map((value, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-4 bg-primary-50/50 rounded-md"
                >
                  <div className="flex-shrink-0 text-primary pt-1">
                    {value.icon || <CheckCircle className="h-5 w-5" />}
                  </div>
                  <p className="text-gray-700">{value.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
