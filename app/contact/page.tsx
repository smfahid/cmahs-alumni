import { MainLayout } from "@/components/main-layout";
import { ContactCards } from "@/components/contact/contact-cards";
import { getSupabase } from "@/lib/supabase";

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  profile_image_url: string | null;
  blood_group: string | null;
  batch: string | null;
  location: string | null;
}

interface CommitteeMember {
  id: string;
  position: string;
  committee_type: string;
  users: User;
}

async function getCommitteeMembers() {
  const supabase = getSupabase();

  const { data: members } = await supabase
    .from("committee_members")
    .select(
      `
      id,
      position,
      committee_type,
      users (
        id,
        first_name,
        last_name,
        email,
        phone,
        profile_image_url,
        blood_group,
        batch,
        location
      )
    `
    )
    .order("position", { ascending: true });

  // Group by committee type
  const boardMembers =
    members?.filter((m) => m.committee_type === "board_of_trustees") || [];
  const ecMembers =
    members?.filter((m) => m.committee_type === "ec_council") || [];

  // No board members shown in this specific image part

  return {
    boardMembers,
    ecMembers,
  };
}

export default async function ContactPage() {
  const staticEcMembers: CommitteeMember[] = [
    {
      id: "1",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user1",
        first_name: "Rakib",
        last_name: "",
        email: "rakib@gmail.com",
        phone: "01764440404",
        profile_image_url:
          "https://via.placeholder.com/100/CCCCCC/808080?Text=Rakib", // Placeholder image
        blood_group: "A+",
        batch: "2001",
        location: "Guimara, Khagrachodi",
      },
    },
    {
      id: "2",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user2",
        first_name: "Rana",
        last_name: "",
        email: "rana@gmail.com",
        phone: "01717741771",
        profile_image_url:
          "https://via.placeholder.com/100/DDDDDD/707070?Text=Rana", // Placeholder image
        blood_group: "A+",
        batch: "2001",
        location: "Jatrabari, Dhaka",
      },
    },
    {
      id: "3",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user3",
        first_name: "Oronno",
        last_name: "Anam",
        email: "oronno@example.com",
        phone: "+880 1712 345678",
        profile_image_url: null, // Will show placeholder icon
        blood_group: "AB+",
        batch: "2010",
        location: "Dhaka, Bangladesh",
      },
    },
    {
      id: "4",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user4",
        first_name: "Maksudur",
        last_name: "Rahman",
        email: "maksudur@example.com",
        phone: "+880 1812 345678",
        profile_image_url: null,
        blood_group: "B+",
        batch: "2012",
        location: "Brahmanbaria, Bangladesh", // Assuming full location
      },
    },
    {
      id: "5",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user5",
        first_name: "Md Iqbal",
        last_name: "Hossain",
        email: "iqbal@example.com",
        phone: "+880 1912 345678",
        profile_image_url: null,
        blood_group: "AB+",
        batch: "2008",
        location: "Dhaka, Bangladesh", // Assuming full location
      },
    },
    {
      id: "6",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user6",
        first_name: "Obaydul Ahmed",
        last_name: "Faraz",
        email: "obaydul@example.com",
        phone: "+880 1612 345678",
        profile_image_url: null,
        blood_group: "O+",
        batch: "2015",
        location: "Munshiganj, Bangladesh", // Assuming full location
      },
    },
  ];
  const staticBoardMembers: CommitteeMember[] = [];
  const boardMembers = staticBoardMembers;
  const ecMembers = staticEcMembers;
  return (
    <MainLayout>
      <div className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div>
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-center mb-8">
                Contact Our Organizers
              </h2>
              <ContactCards boardMembers={boardMembers} ecMembers={ecMembers} />
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Contact Information
              </h2>
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary rounded-full p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Address</h3>
                      <p className="text-gray-600">
                        Char Mehar Azizia High School, Ramdayal Bazar, Char
                        Azizia
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary rounded-full p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Phone</h3>
                      <p className="text-gray-600">+880 1234-567890</p>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-primary rounded-full p-2 mr-3">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium">Email</h3>
                      <p className="text-gray-600">info@cmahs.org</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.5983460988897!2d90.4226553!3d23.7985508!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDQ3JzU0LjgiTiA5MMKwMjUnMjEuNiJF!5e0!3m2!1sen!2sbd!4v1620120000000!5m2!1sen!2sbd"
                  width="100%"
                  height="300"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CMAHS Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
