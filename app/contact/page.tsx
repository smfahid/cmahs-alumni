import { MainLayout } from "@/components/main-layout";
import { ContactCards } from "@/components/contact/contact-cards";

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

export default async function ContactPage() {
  const staticEcMembers: CommitteeMember[] = [
    {
      id: "1",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user1",
        first_name: "Md Rezaul Mawla",
        last_name: "Nablu",
        email: "mdrm123@gmail.com",
        phone: "01913824274",
        profile_image_url: "/assets/nablu-2.png",
        blood_group: "A+",
        batch: "2007",
        location: "Paris, France",
      },
    },
    {
      id: "2",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user2",
        first_name: "Md.Amran Hossain",
        last_name: "Rony",
        email: "ahrony62@gmail.com",
        phone: "01913160380",
        profile_image_url: "/assets/roni-2.png",
        blood_group: "A+",
        batch: "2000",
        location: "Dhaka",
      },
    },
    {
      id: "3",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user3",
        first_name: "H.M.",
        last_name: "Sorwerddee",
        email: "adv.hs.sorwerddee@gmail.com",
        phone: "01765330808",
        profile_image_url: "/assets/babu-2.png",
        blood_group: "O-",
        batch: "2003",
        location: "Chattogram",
      },
    },
    {
      id: "4",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user4",
        first_name: "Md. Ashaduzzaman",
        last_name: "Rana",
        email: "ashadrana1989@gmail.com",
        phone: "01717741771",
        profile_image_url: "/profile-image/rana.jpeg",
        blood_group: "O+",
        batch: "2004",
        location: "Dhaka (Supreme Court)",
      },
    },
    {
      id: "5",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user5",
        first_name: "Md Delowar",
        last_name: "Hossen",
        email: "mddelowarhossen3210@gmail.com",
        phone: "01944195661",
        profile_image_url: "/profile-image/mithun.jpeg",
        blood_group: "B-",
        batch: "2019",
        location: "Dhaka (Mirpur)",
      },
    },
    {
      id: "6",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user6",
        first_name: "Tusar islam",
        last_name: "Jihad",
        email: "mdtusarislamjihad@gmail.com",
        phone: "01616514173",
        profile_image_url: "/profile-image/jihad.jpeg",
        blood_group: "B+",
        batch: "2022",
        location: "Khosal Market",
      },
    },
    {
      id: "7",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user7",
        first_name: "Nazrul Islam",
        last_name: "Mohon",
        email: "nazrul93islam92@gmail.com",
        phone: "01306564996",
        profile_image_url: "/profile-image/mohon.jpeg",
        blood_group: "A+",
        batch: "2009",
        location: "Noakhali",
      },
    },
    {
      id: "8",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user8",
        first_name: "Mosfikur Rahman",
        last_name: "Imon",
        email: "imon107130@gmail.com",
        phone: "01925344552",
        profile_image_url: "/profile-image/imon.jpeg",
        blood_group: "A+",
        batch: "2024",
        location: "Ramdoyal bazar",
      },
    },
    {
      id: "9",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user9",
        first_name: "Samiul Islam",
        last_name: "Orin",
        email: "orin41351@gmail.com",
        phone: "01741175067",
        profile_image_url: "/profile-image/orin.jpeg",
        blood_group: "A+",
        batch: "2017",
        location: "Chattogram",
      },
    },
    {
      id: "10",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user10",
        first_name: "Md Habib",
        last_name: "Ullah reza",
        email: "im.reza.hr1994@gmail.com",
        phone: "01688836063",
        profile_image_url: "/profile-image/reza.jpeg",
        blood_group: "B+",
        batch: "2010",
        location: "Lakshmipur",
      },
    },
    {
      id: "11",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user11",
        first_name: "Kamrul Hasan",
        last_name: "Fahad",
        email: "hasankhfahad@gamil.com",
        phone: "01853760719",
        profile_image_url: "/profile-image/fahad.jpeg",
        blood_group: "A+",
        batch: "2024",
        location: "Dhaka",
      },
    },
    {
      id: "12",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user12",
        first_name: "Md Sazzad",
        last_name: "Hossain",
        email: "Sazzadhossainshopon2017@gmail.com",
        phone: "01406704272",
        profile_image_url: "/profile-image/sazzad.jpeg",
        blood_group: "B+",
        batch: "2008",
        location: "Luxmipur",
      },
    },
    {
      id: "13",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user13",
        first_name: "MD. ALI HAYDOR",
        last_name: "FAISAL",
        email: null, // Email not provided
        phone: "01710474857",
        profile_image_url: "/profile-image/faisal.jpeg",
        blood_group: "O+",
        batch: "2005",
        location: "Mirpur-1, DHAKA",
      },
    },
    {
      id: "14",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user14",
        first_name: "Ifrat Fahriar",
        last_name: "Moon",
        email: "ifratmoon28@gmail.com",
        phone: "01612984225",
        profile_image_url: "/profile-image/moon.jpeg",
        blood_group: "A+",
        batch: "2023",
        location: "Dhaka",
      },
    },
    {
      id: "15",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user15",
        first_name: "MD. Dildar Hossen",
        last_name: "Fahad",
        email: "fahadapon42@gmail.com",
        phone: "01317641047",
        profile_image_url: "/profile-image/dildar.jpeg",
        blood_group: "AB+",
        batch: "2019",
        location: "Dhaka",
      },
    },
    {
      id: "16",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user16",
        first_name: "Aftab Mubarak",
        last_name: "Hossen",
        email: "a.mobarakhossen@gmail.com",
        phone: "01752715016",
        profile_image_url: "/profile-image/aftab.jpeg",
        blood_group: "B+",
        batch: "2013",
        location: "Dhaka",
      },
    },
    {
      id: "17",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user17",
        first_name: "Shafayet",
        last_name: "Hossain",
        email: "shafayetratul010@gmail.com",
        phone: "01885241736",
        profile_image_url: "/profile-image/shafayet.jpeg",
        blood_group: "O+",
        batch: "2020",
        location: "Rangamati",
      },
    },
    {
      id: "18",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user18",
        first_name: "Md.Farvez",
        last_name: "Hossen",
        email: "farvez193641@gmail.com",
        phone: "01884851218",
        profile_image_url: "/profile-image/farvez.jpeg",
        blood_group: "O+",
        batch: "2020",
        location: "Chittagang",
      },
    },
    {
      id: "19",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user19",
        first_name: "Asraful Alam",
        last_name: "Shuvo",
        email: "shuvobpel914@gmail.com",
        phone: "01631735676",
        profile_image_url: "/profile-image/shuvo.jpeg",
        blood_group: "A-",
        batch: "2018",
        location: "Mohammadpur ,Dhaka",
      },
    },
    {
      id: "20",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user20",
        first_name: "Thasin Ferdaous",
        last_name: "Ovi",
        email: "thasanovi10@gmail.com",
        phone: "01318807661",
        profile_image_url: "/profile-image/ovi.jpeg",
        blood_group: "A+",
        batch: "2022",
        location: "Laksmipur",
      },
    },
    {
      id: "21",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user21",
        first_name: "Safiul Islam",
        last_name: "Tanjil",
        email: "safiultanjil18@gmail.com",
        phone: "01874992531",
        profile_image_url: "/profile-image/tanjil.jpeg",
        blood_group: "A+",
        batch: "2022",
        location: "Laksmipur",
      },
    },
    {
      id: "22",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user22",
        first_name: "Ashikur",
        last_name: "Rahman",
        email: "mdashik01765078644@gmail.com",
        phone: "01910013933",
        profile_image_url: "/profile-image/ashiqur.jpeg",
        blood_group: "B+",
        batch: "2022",
        location: "Teknaf",
      },
    },
    {
      id: "23",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user23",
        first_name: "Shahriar Mahmud",
        last_name: "Ifti",
        email: "mahmudifti854@gmail.com",
        phone: "01616516327",
        profile_image_url: "/profile-image/ifti.jpeg",
        blood_group: "B+",
        batch: "2024",
        location: "DHAKA",
      },
    },
    {
      id: "24",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user24",
        first_name: "Md. Eakub",
        last_name: "Hossen",
        email: "yeaqubhossen@gmail.com",
        phone: "01755395595",
        profile_image_url: "/profile-image/eakub.jpeg",
        blood_group: "B+",
        batch: "2009",
        location: "Dhaka",
      },
    },
    {
      id: "25",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user25",
        first_name: "RAHAD",
        last_name: "HOSSEN",
        email: "rahad.hossen.rahed@gmail.com",
        phone: "01988365586",
        profile_image_url: "/profile-image/rahad.jpeg",
        blood_group: "A+",
        batch: "2016",
        location: "Dhaka",
      },
    },
    {
      id: "26",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user26",
        first_name: "MD ABDUS SAMAD",
        last_name: "RIDOY",
        email: "abdussamadridoy@gmail.com",
        phone: "01936211037",
        profile_image_url: "/profile-image/ridoy.jpeg",
        blood_group: "A+",
        batch: "2017",
        location: "Dhaka",
      },
    },
    {
      id: "27",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user27",
        first_name: "ARAFAT",
        last_name: "HOSSAIN",
        email: "mdarafatrony27@gmail.com",
        phone: "01798563893",
        profile_image_url: "/profile-image/arafat.jpeg",
        blood_group: "A+",
        batch: "2016",
        location: "Dhaka",
      },
    },
    {
      id: "28",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user28",
        first_name: "Md Nazmul Huda",
        last_name: "Chowdhury",
        email: "rickson.unitytourismltd@gmail.com",
        phone: "01710799509",
        profile_image_url: "/profile-image/nazmul.jpeg",
        blood_group: "O+",
        batch: "2007",
        location: "Dhaka",
      },
    },
    {
      id: "29",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user29",
        first_name: "MD.ASHIQUR",
        last_name: "RAHAMAN",
        email: "ashike555@gmail.com",
        phone: "01627539959",
        profile_image_url: "/profile-image/ashiqur-2.jpeg",
        blood_group: "O+",
        batch: "2007",
        location: "Lakshmipur",
      },
    },
    {
      id: "30",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user30",
        first_name: "Mohammad",
        last_name: "Famim",
        email: "mdfamim@gmail.com",
        phone: "01915824972",
        profile_image_url: "/profile-image/famim.jpeg",
        blood_group: "A+",
        batch: "2018",
        location: "Sylhet",
      },
    },
    {
      id: "31",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user31",
        first_name: "Samiul Azad",
        last_name: "Dihan",
        email: "samiulazaddihan@gmail.com",
        phone: "01941869689",
        profile_image_url: "/profile-image/samiul.jpeg",
        blood_group: "A+",
        batch: "2021",
        location: "Dhaka",
      },
    },
    {
      id: "32",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user32",
        first_name: "Md. Monzur",
        last_name: "Hossen",
        email: "monzur06@gmail.com", // Taking the first email
        phone: "01685491363",
        profile_image_url: "/profile-image/monzur.jpeg",
        blood_group: "O-",
        batch: "2006",
        location: "Dhaka",
      },
    },
    {
      id: "33",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user33",
        first_name: "Shafait Khan",
        last_name: "Soikot",
        email: "khan@anoxbd.com",
        phone: "01718727658",
        profile_image_url: "/profile-image/soikot.jpeg",
        blood_group: "O+",
        batch: "2011",
        location: "Dhaka",
      },
    },
    {
      id: "34",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user34",
        first_name: "Minhazul Islam",
        last_name: "Tonmoy",
        email: "minhaztonmoy341@gmail.com",
        phone: "01304735159",
        profile_image_url: "/profile-image/minhazul.jpeg",
        blood_group: "A+",
        batch: "2015",
        location: "Dhaka",
      },
    },
    {
      id: "35",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user35",
        first_name: "Md. Asraful Alam",
        last_name: "Tamin",
        email: "ai.tamim5121@gmail.com",
        phone: "01314363374",
        profile_image_url: "/profile-image/tamin.jpeg",
        blood_group: "B+",
        batch: "2013",
        location: "Chattogram",
      },
    },
    {
      id: "36",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user36",
        first_name: "Zisan",
        last_name: "Chowdhury",
        email: "zisananizisanani@gmail.com",
        phone: "01629164001",
        profile_image_url: "/profile-image/zisan.jpeg",
        blood_group: "O+",
        batch: "2016",
        location: "Dhaka",
      },
    },
    {
      id: "37",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user37",
        first_name: "MD. ARAFAT",
        last_name: "HOSSEN",
        email: "mdarafat5287@gmail.com",
        phone: "01984402639",
        profile_image_url: "/profile-image/arafat-2.jpeg",
        blood_group: "B+",
        batch: "2012",
        location: "Rangamati",
      },
    },
    {
      id: "38",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user38",
        first_name: "Md.Rezaul Mawla",
        last_name: "Emon",
        email: "mdrmemon752@gmail.com",
        phone: "01626429103",
        profile_image_url: "/profile-image/emon.jpeg",
        blood_group: "B+",
        batch: "2015",
        location: "Ramdayal Bazar, Ramgati, Lakshmipur",
      },
    },
    {
      id: "39",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user39",
        first_name: "Md. Razib",
        last_name: "Uddin",
        email: "razibuddin1@gmail.com",
        phone: "01735889048",
        profile_image_url: "/profile-image/rajib.jpeg",
        blood_group: "O+",
        batch: "2007",
        location: "Dhaka",
      },
    },
    {
      id: "40",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user40",
        first_name: "Kamrul islam",
        last_name: "Akbar",
        email: "ahakbarhossen338@gmail.com",
        phone: "01827930014",
        profile_image_url: "/profile-image/kamrul.jpeg",
        blood_group: "O+",
        batch: "2011",
        location: "Noakhali",
      },
    },
    {
      id: "41",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user41",
        first_name: "Md.Ayub",
        last_name: "Ali",
        email: "mdayubali2974@gmail.com",
        phone: "01633526574",
        profile_image_url: "/profile-image/ayub.jpeg",
        blood_group: "B+",
        batch: "2013",
        location: "Chattogram",
      },
    },
    {
      id: "42",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user42",
        first_name: "Md Zakir",
        last_name: "Hossen",
        email: "zakirhossen15@gmail.com",
        phone: "01713630210",
        profile_image_url: "/profile-image/zakir.jpeg",
        blood_group: "A+",
        batch: "2010",
        location: "Lakshmipur",
      },
    },
    {
      id: "43",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user43",
        first_name: "Md.Mamunur",
        last_name: "Rashid",
        email: "mamun199749@gmail.com",
        phone: "01860789609",
        profile_image_url: "/profile-image/rashid.jpeg",
        blood_group: "B+",
        batch: "2014",
        location: "Chattogram",
      },
    },
    {
      id: "44",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user44",
        first_name: "Md.Sohel",
        last_name: "Rana",
        email: "sohelrana1687@gmail.com",
        phone: "01831554818",
        profile_image_url: "/profile-image/sohel.jpeg",
        blood_group: "A+",
        batch: "2012",
        location: "Senbag Noakhali",
      },
    },
    {
      id: "45",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user45",
        first_name: "Nihab",
        last_name: "Rahaman",
        email: "nihabrana007@gmail.com",
        phone: "01752216142",
        profile_image_url: "/profile-image/nihab.jpeg",
        blood_group: "O+",
        batch: "2014",
        location: "Dhaka",
      },
    },
    {
      id: "46",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user46",
        first_name: "Md Shibbir",
        last_name: "Ahamed",
        email: "shomirkhan1254@gmail.com",
        phone: "01739792014",
        profile_image_url: "/profile-image/shibbir.jpeg",
        blood_group: "B+",
        batch: "2008",
        location: "Lakshmipur",
      },
    },
    {
      id: "47",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user47",
        first_name: "Sahara Islam ",
        last_name: "Shawon",
        email: "1971revolution@gmail.com",
        phone: "01764440404",
        profile_image_url: "/profile-image/shawon.png",
        blood_group: "A+",
        batch: "2022",
        location: "Dhaka",
      },
    },
    {
      id: "48",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user48",
        first_name: "A B M Faijul Islam",
        last_name: "Babu",
        email: "1971revolution@gmail.com",
        phone: "01764440404",
        profile_image_url: "/profile-image/faijul.png",
        blood_group: "B+",
        batch: "2000",
        location: "Dhaka",
      },
    },
    {
      id: "49",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user49",
        first_name: "Nasif Ahmed",
        last_name: "Prattoy",
        email: "nasifahmed753@gmail.com",
        phone: "01967748917",
        profile_image_url: "/profile-image/nasif.png",
        blood_group: "O+",
        batch: "2019",
        location: "Dhaka",
      },
    },
    {
      id: "50",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user50",
        first_name: "MD.Hasan",
        last_name: "Tareq",
        email: "hasantareq1626@gmail.com",
        phone: "01715273069",
        profile_image_url: "/profile-image/tarek.png",
        blood_group: "A+",
        batch: "2012",
        location: "Ramdoyal bazar",
      },
    },
    {
      id: "51",
      position: "Member",
      committee_type: "EC Council",
      users: {
        id: "user51",
        first_name: "Md.Pabel",
        last_name: "Hossen",
        email: "pabelhossen868320@gmail.com",
        phone: "01786528779",
        profile_image_url: "/profile-image/pabel.png",
        blood_group: "O+",
        batch: "2014",
        location: "Gazipur",
      },
    },
  ];
  const staticBoardMembers: CommitteeMember[] = [];
  const boardMembers = staticBoardMembers;
  const ecMembers = staticEcMembers;
  return (
    <MainLayout>
      <div className="bg-gradient-to-b from-white via-primary-50/20 to-white min-h-screen">
        {/* Header Section */}
        <div className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground mb-4">
                Get in Touch
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
                Connect with our team and community leaders
              </p>
            </div>
          </div>
        </div>

        <div className="pb-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16">
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight text-center mb-12">
                Our Organizers
              </h2>
              <ContactCards boardMembers={boardMembers} ecMembers={ecMembers} />
            </div>

            <div>
              <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight mb-8">
                Contact Information
              </h2>
              <div className="bg-white rounded-2xl shadow-card p-8 sm:p-10 mb-8 border border-border/50">
                <div className="space-y-6">
                  <div className="flex items-start group">
                    <div className="flex-shrink-0 bg-primary/10 rounded-xl p-4 mr-4 group-hover:bg-primary/20 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
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
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Address
                      </h3>
                      <p className="text-muted-foreground text-[15px] leading-relaxed">
                        Char Mehar Azizia High School Alumni Association,
                        <br />
                        Ramdoyal Bazar, Ramgati, Laxmipur - 3730.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="flex-shrink-0 bg-primary/10 rounded-xl p-4 mr-4 group-hover:bg-primary/20 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
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
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Phone
                      </h3>
                      <a
                        href="tel:+8801764440404"
                        className="text-primary text-[15px] hover:text-primary-600 transition-colors"
                      >
                        +880 1764-440404
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start group">
                    <div className="flex-shrink-0 bg-primary/10 rounded-xl p-4 mr-4 group-hover:bg-primary/20 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-primary"
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
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        Email
                      </h3>
                      <a
                        href="mailto:alumni.cmahs@gmail.com"
                        className="text-primary text-[15px] hover:text-primary-600 transition-colors"
                      >
                        alumni.cmahs@gmail.com
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-card overflow-hidden border border-border/50">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3682.1961205074754!2d90.95194717546266!3d22.646475279439144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3754b5158cb08e2d%3A0x9ec9602841b5758a!2sChar%20Mehar%20Azizia%20High%20School!5e0!3m2!1sen!2sbd!4v1748237470538!5m2!1sen!2sbd"
                  width="100%"
                  height="400"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="CMAHS Location"
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
