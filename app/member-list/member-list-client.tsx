"use client";

import { MainLayout } from "@/components/main-layout";
import { MemberListTable } from "@/components/members/member-list-table";
import { AuthGuard } from "@/components/auth/auth-guard";

// Define the User type (consistent with contact-cards.tsx)
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

interface MemberListClientProps {
  members: User[];
}

export default function MemberListClient({ members }: MemberListClientProps) {
  return (
    <AuthGuard>
      <MainLayout>
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-center">
                Registered Members
              </h2>
            </div>
            <MemberListTable members={members} />
          </div>
        </div>
      </MainLayout>
    </AuthGuard>
  );
}
