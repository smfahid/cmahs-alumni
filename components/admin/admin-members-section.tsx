"use client";

import Image from "next/image";
import { useState, useMemo, useEffect } from "react";
import {
  UserIcon,
  PhoneIcon,
  MailIcon,
  GraduationCapIcon,
  MapPinIcon,
  FilterIcon,
  SearchIcon,
  ChevronDownIcon,
  Shield,
  ShieldCheck,
} from "lucide-react";
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
  role: string;
  is_approved: boolean;
  created_at: string;
}

const MemberCard: React.FC<{ member: User }> = ({ member }) => {
  const fullName = `${member.first_name || ""} ${
    member.last_name || ""
  }`.trim();

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 border">
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="flex-shrink-0">
          {member.profile_image_url ? (
            <div className="relative w-[100px] h-[100px] rounded-full overflow-hidden">
              <Image
                src={member.profile_image_url}
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
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
            <h3 className="text-xl font-semibold text-gray-800">{fullName}</h3>
            {member.blood_group && (
              <span className="text-xs font-medium bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {member.blood_group}
              </span>
            )}
            <div className="flex items-center gap-1">
              {member.role === "ADMIN" ? (
                <Shield className="h-4 w-4 text-purple-600" title="Admin" />
              ) : member.is_approved ? (
                <ShieldCheck
                  className="h-4 w-4 text-green-600"
                  title="Approved"
                />
              ) : (
                <Shield className="h-4 w-4 text-yellow-600" title="Pending" />
              )}
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-600">
            {member.batch && (
              <div className="flex items-center justify-center sm:justify-start">
                <GraduationCapIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{member.batch}</span>
              </div>
            )}
            {member.phone && (
              <div className="flex items-center justify-center sm:justify-start">
                <PhoneIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{member.phone}</span>
              </div>
            )}
            {member.email && (
              <div className="flex items-center justify-center sm:justify-start">
                <MailIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm break-all">{member.email}</span>
              </div>
            )}
            {member.location && (
              <div className="flex items-center justify-center sm:justify-start">
                <MapPinIcon className="h-4 w-4 mr-2 text-gray-500" />
                <span>{member.location}</span>
              </div>
            )}
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs">
              <span
                className={`px-2 py-1 rounded-full ${
                  member.role === "ADMIN"
                    ? "bg-purple-100 text-purple-700"
                    : member.is_approved
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}
              >
                {member.role === "ADMIN"
                  ? "Admin"
                  : member.is_approved
                  ? "Approved"
                  : "Pending"}
              </span>
              <span className="text-gray-500">
                Joined: {new Date(member.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AdminMembersSection: React.FC = () => {
  const [members, setMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("All Batches");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [allBatches, setAllBatches] = useState<string[]>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from("users")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Error fetching members:", error);
          return;
        }

        setMembers(data || []);

        // Extract unique batches
        const batches = new Set<string>();
        data?.forEach((member) => {
          if (member.batch) {
            batches.add(member.batch);
          }
        });
        setAllBatches(["All Batches", ...Array.from(batches).sort()]);
      } catch (error) {
        console.error("Error fetching members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const filterMembers = (members: User[]) => {
    return members.filter((member) => {
      const fullName = `${member.first_name || ""} ${
        member.last_name || ""
      }`.toLowerCase();
      const nameMatch = fullName.includes(searchTerm.toLowerCase());
      const batchMatch =
        selectedBatch === "All Batches" || member.batch === selectedBatch;
      const statusMatch =
        selectedStatus === "All Status" ||
        (selectedStatus === "Admin" && member.role === "ADMIN") ||
        (selectedStatus === "Approved" &&
          member.role !== "ADMIN" &&
          member.is_approved) ||
        (selectedStatus === "Pending" &&
          member.role !== "ADMIN" &&
          !member.is_approved);

      return nameMatch && batchMatch && statusMatch;
    });
  };

  const filteredMembers = useMemo(
    () => filterMembers(members),
    [members, searchTerm, selectedBatch, selectedStatus]
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedBatch("All Batches");
    setSelectedStatus("All Status");
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">Loading members...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">All Members</h2>
        <span className="text-sm text-gray-500">
          {filteredMembers.length} of {members.length} members
        </span>
      </div>

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
            <div className="flex-shrink-0 md:w-1/4">
              <label
                htmlFor="status-filter"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Status
              </label>
              <select
                id="status-filter"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              >
                <option value="All Status">All Status</option>
                <option value="Admin">Admin</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
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

      {/* Members Grid */}
      {filteredMembers.length === 0 ? (
        <div className="text-center py-10 text-gray-600">
          <p className="text-xl">
            {searchTerm ||
            selectedBatch !== "All Batches" ||
            selectedStatus !== "All Status"
              ? "No members match your current search criteria."
              : "No members found."}
          </p>
          <p className="mt-2">
            {searchTerm ||
            selectedBatch !== "All Batches" ||
            selectedStatus !== "All Status"
              ? "Try adjusting your search term or filters."
              : "Members will appear here once they register."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map((member) => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
};
