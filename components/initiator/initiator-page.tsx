"use client";

import Image from "next/image";
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
      current_location: "Khagrachari CHT",
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
    <div className="container-custom py-12 md:py-20">
      <section className="mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-primary mb-8 text-center">
          For your kind info
        </h1>
        {initiators.map((initiatorItem) => (
          <div
            key={initiatorItem.name}
            className="bg-white shadow-xl rounded-lg overflow-hidden md:flex md:items-center p-6 md:p-8 mb-8 last:mb-0 transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1"
          >
            <div className="md:w-1/3 flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              <Image
                src={initiatorItem.imageUrl}
                alt={initiatorItem.name}
                width={300}
                height={300}
                className="rounded-lg object-cover w-full h-auto md:w-[300px] md:h-[300px] mx-auto shadow-md"
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-semibold text-gray-800 mb-2">
                {initiatorItem.name}
              </h2>
              {initiatorDisplayFields.map((field) => (
                <p
                  key={field.key}
                  className="text-gray-600 leading-relaxed mb-2 flex items-center"
                >
                  {field.icon}

                  {initiatorItem[field.key]}
                </p>
              ))}
            </div>
          </div>
        ))}
      </section>

      <section>
        <h2 className="text-3xl md:text-4xl font-bold text-gray-700 mb-8 text-center">
          Website Developed By
        </h2>
        <div className="bg-gray-50 shadow-xl rounded-lg overflow-hidden md:flex md:items-center p-6 md:p-8 transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-1">
          <div className="md:w-1/3 flex-shrink-0 mb-6 md:mb-0 md:mr-8">
            <Image
              src={developer.imageUrl}
              alt={developer.name}
              width={300}
              height={300}
              className="rounded-lg object-cover w-full h-auto md:w-[300px] md:h-[300px] mx-auto shadow-md"
            />
          </div>
          <div className="md:w-2/3">
            <h3 className="text-3xl font-semibold text-gray-800 mb-2">
              {developer.name}
            </h3>
            <p className="text-md text-primary-600 mb-4">{developer.title}</p>
            <p className="text-gray-600 leading-relaxed mb-4">
              {developer.bio}
            </p>
            {/* <p className="text-gray-600 leading-relaxed mb-2 flex items-center">
              <PhoneIcon className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">Mobile:</span> {developer.mobile}
            </p> */}
            <p className="text-gray-600 leading-relaxed mb-2 flex items-center">
              <MailIcon className="w-5 h-5 mr-2 text-primary" />
              {developer.email}
            </p>
            {/* <p className="text-gray-600 leading-relaxed mb-2 flex items-center">
              <UserIcon className="w-5 h-5 mr-2 text-primary" />
              <span className="font-semibold">Blood Group:</span>{" "}
              {developer.bloodGroup}
            </p> */}
            <p className="text-gray-600 leading-relaxed mb-2 flex items-center">
              <MapPinIcon className="w-5 h-5 mr-2 text-primary" />

              {developer.current_location}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
