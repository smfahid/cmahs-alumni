import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

export default async function AdminDebugPage() {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // Get current session
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    console.log("Debug - Session:", session);
    console.log("Debug - Session Error:", sessionError);

    if (sessionError || !session?.user) {
      return (
        <div className="p-8">
          <h1 className="text-2xl font-bold mb-4">Admin Debug - No Session</h1>
          <p>Session Error: {sessionError?.message || "No session found"}</p>
        </div>
      );
    }

    // Get user role
    const { data: userData, error: roleError } = await supabase
      .from("users")
      .select("role")
      .eq("id", session.user.id)
      .single();

    console.log("Debug - User Data:", userData);
    console.log("Debug - Role Error:", roleError);

    const isAdmin = userData?.role?.toString().toUpperCase() === "ADMIN";

    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Debug Page</h1>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold">Session Info:</h2>
            <p>User ID: {session.user.id}</p>
            <p>Email: {session.user.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Role Info:</h2>
            <p>Role: {userData?.role || "No role found"}</p>
            <p>Is Admin: {isAdmin ? "Yes" : "No"}</p>
            <p>Role Error: {roleError?.message || "None"}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold">Status:</h2>
            <p className={isAdmin ? "text-green-600" : "text-red-600"}>
              {isAdmin ? "✅ Admin Access Granted" : "❌ Admin Access Denied"}
            </p>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Debug page error:", error);
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Admin Debug - Error</h1>
        <p>Error: {error.message}</p>
      </div>
    );
  }
}
