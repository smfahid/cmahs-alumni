"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import {
  UserIcon,
  SearchIcon,
  FilterIcon, // Not used directly in this layout, but kept for consistency
  PhoneIcon,
  MailIcon,
  GraduationCapIcon,
  MapPinIcon,
} from "lucide-react";

// Define the User type
interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string | null;
  phone: string | null;
  profile_image_url: string | null;
  batch: string | null;
  location: string | null;
}

interface MemberListTableProps {
  members: User[];
}

export const MemberListTable: React.FC<MemberListTableProps> = ({
  members,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [allBatches, setAllBatches] = useState<string[]>([]);

  useEffect(() => {
    const batches = new Set<string>();
    members.forEach((member) => {
      if (member.batch) {
        batches.add(member.batch);
      }
    });
    setAllBatches(["All Batches", ...Array.from(batches).sort()]);
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const fullName = `${member.first_name || ""} ${
        member.last_name || ""
      }`.toLowerCase();
      const nameMatch = fullName.includes(searchTerm.toLowerCase());
      const batchMatch =
        selectedBatch === "All Batches" || member.batch === selectedBatch;
      return nameMatch && batchMatch;
    });
  }, [members, searchTerm, selectedBatch]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedBatch("All Batches");
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4 md:space-y-0 md:flex md:items-end md:space-x-4">
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
      </div>

      {/* Member Table Section */}
      {members.length === 0 &&
      !searchTerm &&
      selectedBatch === "All Batches" ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-xl">No members are currently listed.</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-xl">No members match your current filters.</p>
          <p className="mt-1">Try adjusting your search or batch filter.</p>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {/* Profile Image col - no title needed */}
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Batch
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell"
                  >
                    Phone
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell"
                  >
                    Location
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredMembers.map((member) => {
                  const fullName = `${member.first_name || ""} ${
                    member.last_name || ""
                  }`.trim();
                  const displayLocation = member.location
                    ? member.location.split(",")[0]
                    : "N/A";
                  return (
                    <tr key={member.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex-shrink-0 h-10 w-10">
                          {member.profile_image_url ? (
                            <Image
                              className="h-10 w-10 rounded-full object-cover"
                              src={member.profile_image_url}
                              alt={fullName}
                              width={40}
                              height={40}
                            />
                          ) : (
                            <div className="h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                              <UserIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {fullName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-700 flex items-center">
                          <GraduationCapIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                          {member.batch || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden sm:table-cell">
                        {member.email ? (
                          <div className="text-sm text-gray-700 flex items-center">
                            <MailIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                            <a
                              href={`mailto:${member.email}`}
                              className="hover:text-primary"
                            >
                              {member.email}
                            </a>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                        {member.phone ? (
                          <div className="text-sm text-gray-700 flex items-center">
                            <PhoneIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                            <a
                              href={`tel:${member.phone}`}
                              className="hover:text-primary"
                            >
                              {member.phone}
                            </a>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                        {member.location ? (
                          <div className="text-sm text-gray-700 flex items-center">
                            <MapPinIcon className="h-4 w-4 mr-1.5 text-gray-400" />
                            {displayLocation}
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500">N/A</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
