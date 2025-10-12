"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  UserIcon,
  GraduationCapIcon,
  Droplets,
} from "lucide-react";

export function InitiatorPage() {
  // Placeholder data - replace with actual data
  const initiators = [
    {
      name: "SHAHIDUL ISLAM RAKIB",
      batch: "2004",
      mobile: "+8801764440404",
      email: "1971revolution@gmail.com",
      bloodGroup: "B+",
      current_location: "Dhaka",
      imageUrl: "/assets/rakib.png",
    },
    {
      name: "MD RIFAT ALAM MOHIM",
      batch: "2016",
      mobile: "+8801305925654",
      email: "rifatalammohim@gmail.com",
      bloodGroup: "O+",
      current_location: "At Sea / Global Waters",
      imageUrl: "/assets/rifat-2.png",
    },
  ];

  const developer = {
    name: "S.M.FAHID",
    title:
      "Software Engineer at Delineate Inc, 1010 Massachusetts Ave, Cambridge, MA 02138, US",
    bio: "S.M.Fahid is a passionate software engineer with a knack for creating intuitive and engaging user experiences. He led the development of this website, ensuring it meets the needs of the alumni association and its members.",
    imageUrl: "/assets/fahid.png",
    bloodGroup: "A-",
    current_location: "Chittagong",
    mobile: "01840739992",
    email: "esanfahid@gmail.com",
  };

  const initiatorDisplayFields: Array<{
    key: "batch" | "mobile" | "email" | "bloodGroup" | "current_location";
    label: string;
    icon?: React.ReactNode;
  }> = [
    {
      key: "batch",
      label: "Batch",
      icon: <GraduationCapIcon className="w-5 h-5 mr-2 text-primary" />,
    },
    {
      key: "mobile",
      label: "Mobile",
      icon: <PhoneIcon className="w-5 h-5 mr-2 text-primary" />,
    },
    {
      key: "email",
      label: "Email",
      icon: <MailIcon className="w-5 h-5 mr-2 text-primary" />,
    },
    {
      key: "bloodGroup",
      label: "Blood Group",
      icon: <Droplets className="w-5 h-5 mr-2 text-primary" />,
    },
    {
      key: "current_location",
      label: "Current Location",
      icon: <MapPinIcon className="w-5 h-5 mr-2 text-primary" />,
    },
  ];

  return (
    <div className="bg-gradient-to-b from-white via-primary-50/10 to-white min-h-screen">
      <div className="container-custom py-20 sm:py-24 md:py-32">
        {/* Initiators Section */}
        <section className="mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-4">
              Meet Our Initiators
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              The visionaries who made this platform possible
            </p>
          </motion.div>

          <div className="space-y-8">
            {initiators.map((initiatorItem, index) => (
              <motion.div
                key={initiatorItem.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="bg-white shadow-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-card-hover transition-all duration-300"
              >
                <div className="flex flex-col md:flex-row md:items-center p-8 lg:p-10 gap-8">
                  <div className="md:w-1/3 flex-shrink-0">
                    <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                      <Image
                        src={initiatorItem.imageUrl}
                        alt={initiatorItem.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-2/3">
                    <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-6">
                      {initiatorItem.name}
                    </h2>
                    <div className="space-y-3">
                      {initiatorDisplayFields.map((field) => (
                        <div
                          key={field.key}
                          className="flex items-center text-muted-foreground text-[15px] md:text-base group"
                        >
                          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                            {field.icon}
                          </div>
                          <span className="leading-relaxed">
                            {initiatorItem[field.key]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Developer Section */}
        <section>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              Built With Passion
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              Meet the developer behind this platform
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-white shadow-card rounded-2xl overflow-hidden border border-border/50 hover:shadow-card-hover transition-all duration-300"
          >
            <div className="flex flex-col md:flex-row md:items-center p-8 lg:p-10 gap-8">
              <div className="md:w-1/3 flex-shrink-0">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-md">
                  <Image
                    src={developer.imageUrl}
                    alt={developer.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="md:w-2/3">
                <h3 className="text-3xl md:text-4xl font-semibold tracking-tight text-foreground mb-2">
                  {developer.name}
                </h3>
                <p className="text-[15px] md:text-base text-primary mb-4 font-medium">
                  {developer.title}
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6 text-[15px] md:text-base">
                  {developer.bio}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center text-muted-foreground text-[15px] md:text-base group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                      <MailIcon className="w-5 h-5 text-primary" />
                    </div>
                    <a
                      href={`mailto:${developer.email}`}
                      className="hover:text-primary transition-colors"
                    >
                      {developer.email}
                    </a>
                  </div>
                  <div className="flex items-center text-muted-foreground text-[15px] md:text-base group">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center mr-3 group-hover:bg-primary/20 transition-colors">
                      <MapPinIcon className="w-5 h-5 text-primary" />
                    </div>
                    <span>{developer.current_location}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
