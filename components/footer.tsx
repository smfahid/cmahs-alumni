import Link from "next/link";
import { Facebook, Instagram, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              About CMAHS Alumni
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary"></span>
            </h3>
            <p className="text-gray-300 mb-6 leading-relaxed">
              The Char Mehar Azizia High School Alumni is guided by its
              Constitution in its organizational structure as well as its
              management system. We connect generations of alumni for a stronger
              community.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white bg-gray-800 hover:bg-primary p-3 rounded-full transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-gray-300 hover:text-white bg-gray-800 hover:bg-primary p-3 rounded-full transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:info@cmahs.org"
                className="text-gray-300 hover:text-white bg-gray-800 hover:bg-primary p-3 rounded-full transition-colors duration-300"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Quick Links
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary"></span>
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "About Us", href: "/about" },
                { name: "Events", href: "/events" },
                { name: "Apply For Membership", href: "/membership" },
                { name: "Gallery", href: "/gallery" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-2 h-2 bg-primary rounded-full mr-2 transform scale-0 group-hover:scale-100 transition-transform duration-300"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold mb-6 relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-1/2 h-1 bg-primary"></span>
            </h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-primary/20 p-2 rounded-lg mr-3">
                  <MapPin className="h-5 w-5 text-primary-300" />
                </div>
                <span className="text-gray-300">
                  Char Mehar Azizia High School Alumni Association, Ramdoyal
                  Bazar, Ramgati, Laxmipur - 3730.
                </span>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/20 p-2 rounded-lg mr-3">
                  <Phone className="h-5 w-5 text-primary-300" />
                </div>
                <span className="text-gray-300">+880 1764-440404</span>
              </div>
              <div className="flex items-center">
                <div className="bg-primary/20 p-2 rounded-lg mr-3">
                  <Mail className="h-5 w-5 text-primary-300" />
                </div>
                <span className="text-gray-300">alumni.cmahs@gmail.com</span>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400">
            © {new Date().getFullYear()} Char Mehar Azizia High School Alumni.
            All Rights Reserved
          </p>
          <p className="text-gray-400 mt-2 md:mt-0">
            Developed with ❤️ by{" "}
            <a
              href="https://facebook.com/esan.fahid"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white"
            >
              S.M. Fahid
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
