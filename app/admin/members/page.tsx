import { AdminMembersSection } from "@/components/admin/admin-members-section";

export default function AdminMembersPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Members</h1>
      </div>

      <AdminMembersSection />
    </div>
  );
}
