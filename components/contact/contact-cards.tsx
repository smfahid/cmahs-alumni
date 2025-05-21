"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  GraduationCapIcon, // Using AcademicCapIcon for Batch
  MapPinIcon,
  FilterIcon,
  SearchIcon,
  ChevronDownIcon,
} from "lucide-react"; // Or use solid icons if preferred

// Define the types based on your Supabase schema
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

interface ContactCardsProps {
  boardMembers: CommitteeMember[];
  ecMembers: CommitteeMember[];
}

const MemberCard: React.FC<{ member: User }> = ({ member }) => {
  const fullName = `${member.first_name || ""} ${
    member.last_name || ""
  }`.trim();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex-shrink-0">
          {member.profile_image_url ? (
            <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden">
              <Image
                src={"/assets/rakib.jpeg"}
                alt={fullName}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ) : (
            <div className="w-[100px] h-[100px] bg-gray-200 rounded-full flex items-center justify-center">
              <UserIcon className="h-[50px] w-[50px] text-gray-400" />
            </div>
          )}
        </div>
        <div className="flex-grow text-center sm:text-left">
          <h3 className="text-xl font-semibold text-gray-800">{fullName}</h3>
          <div className="mt-1 mb-3 flex flex-wrap justify-center sm:justify-start gap-2">
            {member.blood_group && (
              <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {member.blood_group}
              </span>
            )}
            {member.location && ( // Assuming this is a general location like city/district
              <span className="text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                {member.location.split(",")[0]}{" "}
                {/* Show first part of location if comma separated */}
              </span>
            )}
          </div>
          <div className="space-y-2 text-sm text-gray-600">
            {member.phone && (
              <div className="flex items-center justify-center sm:justify-start">
                <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{member.phone}</span>
              </div>
            )}
            {member.email && (
              <div className="flex items-center justify-center sm:justify-start">
                <MailIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{member.email}</span>
              </div>
            )}
            {member.batch && (
              <div className="flex items-center justify-center sm:justify-start">
                <GraduationCapIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>Batch: {member.batch}</span>
              </div>
            )}
            {/* You might want a more specific location field if the one above is too broad */}
            {/* For example, if 'location' is 'City, Country', you might display it fully here */}
            {member.location && (
              <div className="flex items-center justify-center sm:justify-start">
                <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{member.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export const ContactCards: React.FC<ContactCardsProps> = ({
  boardMembers,
  ecMembers,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [allBatches, setAllBatches] = useState<string[]>([]);

  useEffect(() => {
    const batches = new Set<string>();
    [...boardMembers, ...ecMembers].forEach((member) => {
      if (member.users.batch) {
        batches.add(member.users.batch);
      }
    });
    setAllBatches(["All Batches", ...Array.from(batches).sort()]);
  }, [boardMembers, ecMembers]);

  const filterMembers = (members: CommitteeMember[]) => {
    return members.filter((member) => {
      const user = member.users;
      const fullName = `${user.first_name || ""} ${
        user.last_name || ""
      }`.toLowerCase();
      const nameMatch = fullName.includes(searchTerm.toLowerCase());
      const batchMatch =
        selectedBatch === "All Batches" || user.batch === selectedBatch;
      return nameMatch && batchMatch;
    });
  };

  const filteredBoardMembers = useMemo(
    () => filterMembers(boardMembers),
    [boardMembers, searchTerm, selectedBatch]
  );
  const filteredEcMembers = useMemo(
    () => filterMembers(ecMembers),
    [ecMembers, searchTerm, selectedBatch]
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedBatch("All Batches");
  };

  const renderMemberGrid = (members: CommitteeMember[], title: string) => {
    if (
      members.length === 0 &&
      (searchTerm || selectedBatch !== "All Batches")
    ) {
      return (
        <div className="text-center py-8 text-gray-500">
          No members match your current filters in {title}.
        </div>
      );
    }
    if (members.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          No members to display in {title}.
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {members.map((member) => (
          <MemberCard key={member.id} member={member.users} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-12">
      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <details className="group">
          <summary className="flex items-center justify-between cursor-pointer list-none">
            <div className="flex items-center">
              <FilterIcon className="h-5 w-5 mr-2 text-primary" />
              <span className="font-semibold text-gray-700">
                Search & Filter Members
              </span>
            </div>
            <ChevronDownIcon className="h-5 w-5 text-gray-500 group-open:rotate-180 transition-transform" />
          </summary>
          <div className="mt-6 space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
            <div className="flex-grow">
              <label
                htmlFor="search-name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search by name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  id="search-name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
            <div className="flex-shrink-0 md:w-1/4">
              <label
                htmlFor="batch-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Batch
              </label>
              <select
                id="batch-filter"
                value={selectedBatch}
                onChange={(e) => setSelectedBatch(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                {allBatches.map((batch) => (
                  <option key={batch} value={batch}>
                    {batch}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-shrink-0">
              <button
                onClick={handleResetFilters}
                className="w-full md:w-auto mt-4 md:mt-0 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </details>
      </div>

      {/* Board of Trustees Section */}
      {boardMembers.length > 0 && (
        <section>
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
            Board of Trustees
          </h3>
          {renderMemberGrid(filteredBoardMembers, "Board of Trustees")}
        </section>
      )}

      {/* EC Council Section */}
      {ecMembers.length > 0 && (
        <section>{renderMemberGrid(filteredEcMembers, "EC Council")}</section>
      )}

      {filteredBoardMembers.length === 0 &&
        filteredEcMembers.length === 0 &&
        (searchTerm || selectedBatch !== "All Batches") && (
          <div className="text-center py-10 text-gray-600">
            <p className="text-xl">
              No members match your current search criteria.
            </p>
            <p className="mt-2">
              Try adjusting your search term or batch filter.
            </p>
          </div>
        )}
      {boardMembers.length === 0 && ecMembers.length === 0 && (
        <div className="text-center py-10 text-gray-600">
          <p className="text-xl">No committee members are currently listed.</p>
          <p className="mt-2">Please check back later.</p>
        </div>
      )}
    </div>
  );
};
