"use client";

import Image from "next/image";
import { useState, useMemo } from "react";
import {
  UserIcon,
  SearchIcon,
  PhoneIcon,
  MailIcon,
  GraduationCapIcon,
  MapPinIcon,
  ChevronLeft,
  ChevronRight,
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
  const [batchSearch, setBatchSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const fullName = `${member.first_name || ""} ${
        member.last_name || ""
      }`.toLowerCase();

      // Combined search for name, email, and phone
      const combinedMatch =
        fullName.includes(searchTerm.toLowerCase()) ||
        (member.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (member.phone || "").toLowerCase().includes(searchTerm.toLowerCase());

      const batchMatch = (member.batch || "")
        .toLowerCase()
        .includes(batchSearch.toLowerCase());
      const locationMatch = (member.location || "")
        .toLowerCase()
        .includes(locationSearch.toLowerCase());

      return combinedMatch && batchMatch && locationMatch;
    });
  }, [members, searchTerm, batchSearch, locationSearch]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredMembers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedMembers = filteredMembers.slice(startIndex, endIndex);

  // Reset to first page when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm, batchSearch, locationSearch]);

  const handleResetFilters = () => {
    setSearchTerm("");
    setBatchSearch("");
    setLocationSearch("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  return (
    <div className="space-y-6">
      {/* Filter Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-4">
          {/* Search Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Combined Search for Name, Email, and Phone */}
            <div>
              <label
                htmlFor="search-combined"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search by Name, Email, or Phone
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
                  id="search-combined"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, email, or phone..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            {/* Batch Search */}
            <div>
              <label
                htmlFor="search-batch"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search by Batch
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <GraduationCapIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  id="search-batch"
                  value={batchSearch}
                  onChange={(e) => setBatchSearch(e.target.value)}
                  placeholder="Search by batch..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>

            {/* Location Search */}
            <div>
              <label
                htmlFor="search-location"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Search by Location
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPinIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  type="text"
                  id="search-location"
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  placeholder="Search by location..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Page Size Selector */}
            <div className="flex items-center space-x-2">
              <label
                htmlFor="page-size"
                className="text-sm font-medium text-gray-700"
              >
                Show:
              </label>
              <select
                id="page-size"
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <span className="text-sm text-gray-500">per page</span>
            </div>

            {/* Reset Button */}
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      </div>

      {/* Member Table Section */}
      {members.length === 0 &&
      !searchTerm &&
      !batchSearch &&
      !locationSearch ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-xl">No members are currently listed.</p>
        </div>
      ) : filteredMembers.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-xl">No members match your current filters.</p>
          <p className="mt-1">Try adjusting your search criteria.</p>
        </div>
      ) : (
        <>
          {/* Results Info */}
          <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                <span className="font-medium">
                  {Math.min(endIndex, filteredMembers.length)}
                </span>{" "}
                of <span className="font-medium">{filteredMembers.length}</span>{" "}
                results
              </p>
              {filteredMembers.length > 0 && (
                <p className="text-sm text-gray-500">
                  Page {currentPage} of {totalPages}
                </p>
              )}
            </div>
          </div>

          {/* Table */}
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
                  {paginatedMembers.map((member) => {
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                {/* Page Info */}
                <div className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </div>

                {/* Pagination Buttons */}
                <div className="flex items-center space-x-2">
                  {/* Previous Button */}
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex space-x-1">
                    {(() => {
                      const pages = [];
                      const maxVisiblePages = 5;
                      let startPage = Math.max(
                        1,
                        currentPage - Math.floor(maxVisiblePages / 2)
                      );
                      let endPage = Math.min(
                        totalPages,
                        startPage + maxVisiblePages - 1
                      );

                      // Adjust start page if we're near the end
                      if (endPage - startPage + 1 < maxVisiblePages) {
                        startPage = Math.max(1, endPage - maxVisiblePages + 1);
                      }

                      // First page and ellipsis
                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => handlePageChange(1)}
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            1
                          </button>
                        );
                        if (startPage > 2) {
                          pages.push(
                            <span
                              key="ellipsis1"
                              className="px-3 py-2 text-sm text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                      }

                      // Page numbers
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              i === currentPage
                                ? "text-white bg-primary border border-primary"
                                : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }

                      // Last page and ellipsis
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span
                              key="ellipsis2"
                              className="px-3 py-2 text-sm text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => handlePageChange(totalPages)}
                            className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
