import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutSection({ about }: { about: any }) {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-primary-50 rounded-bl-full opacity-70"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-primary-50 rounded-tr-full opacity-70"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 relative inline-block">
            {about?.title || "About Char Mehar Azizia High School Alumni"}
            <span className="absolute -bottom-2 left-1/4 right-1/4 h-1 bg-primary rounded-full"></span>
          </h2>

          <p className="text-lg text-gray-700 leading-relaxed mb-10">
            {about?.content ||
              "To create a purposeful and forward-looking organization for the alumni of Char Mehar Azizia High School for their social, cultural, and professional pursuits; for fostering greater cohesion and fellowship among themselves; for rendering all possible support to the transformation of the beloved alma mater into an institution of higher learning in technical and engineering education of international repute."}
          </p>

          <Link href="/about">
            <Button className="group">
              Learn More About Us
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
