import { AboutContentSection } from "@/components/about/AboutContentSection";
import { MainLayout } from "@/components/main-layout";
import { Users, Target, Eye, Heart } from "lucide-react"; // Example icons

export default function AboutPage() {
  const aboutData = {
    pageTitle: "About CMAHS Alumni Association",
    introTitle: "Our Journey and Commitment",
    introParagraphs: [
      "The Char Mehar Azizia High School (CMAHS) Alumni Association is dedicated to fostering a lifelong community among its graduates. We strive to connect alumni from all generations, supporting both their personal and professional growth while contributing to the advancement of our beloved alma mater.",
      "Our association organizes a variety of events, programs, and initiatives designed to strengthen bonds, provide networking opportunities, and celebrate the achievements of our members. We believe in the power of collective effort to make a positive impact on our community and the school.",
      "Founded on the principles of camaraderie, service, and excellence, the CMAHS Alumni Association aims to be a beacon for current students and a source of pride for all who have walked the halls of Char Mehar Azizia High School.",
    ],
    imageUrl: "/assets/about-us.jpeg",
    imageAlt: "CMAHS Alumni gathering",
    mission: {
      title: "Our Mission",
      text: "To create a purposeful and forward-looking organization for the alumni of Char Mehar Azizia High School for their social, cultural, and professional pursuits; for fostering greater cohesion and fellowship among themselves; and for rendering all possible support to the transformation of the beloved alma mater.",
    },
    vision: {
      title: "Our Vision",
      text: "To be a dynamic and inclusive alumni network that actively supports its members, celebrates their successes, and contributes significantly to the legacy and future of Char Mehar Azizia High School.",
    },
    coreValues: {
      title: "Our Core Values",
      values: [
        {
          icon: <Users className="h-5 w-5" />,
          text: "Community: Fostering a strong, supportive network.",
        },
        {
          icon: <Heart className="h-5 w-5" />,
          text: "Integrity: Upholding the highest ethical standards.",
        },
        {
          icon: <Target className="h-5 w-5" />,
          text: "Excellence: Striving for distinction in all endeavors.",
        },
        {
          icon: <Eye className="h-5 w-5" />,
          text: "Lifelong Learning: Encouraging continuous personal and professional development.",
        },
        { text: "Service: Giving back to our alma mater and society." }, // Example without a custom icon
      ],
    },
  };

  return (
    <MainLayout>
      <AboutContentSection
        pageTitle={aboutData.pageTitle}
        introTitle={aboutData.introTitle}
        introParagraphs={aboutData.introParagraphs}
        imageUrl={aboutData.imageUrl}
        imageAlt={aboutData.imageAlt}
        mission={aboutData.mission}
        vision={aboutData.vision}
        coreValues={aboutData.coreValues}
      />
      {/* You can add more sections to the about page here if needed */}
    </MainLayout>
  );
}
