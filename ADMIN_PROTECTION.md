# Admin Route Protection

This document explains how admin route protection is implemented in the CMAHS Alumni application.

## 🔒 Multi-Layer Protection

The admin routes are protected by multiple layers of security:

### 1. **Middleware Protection** (`middleware.ts`)

- **Server-side protection** that runs before any page loads
- Checks authentication status and admin role for all `/admin/*` routes
- Redirects to `/login` if not authenticated
- Redirects to `/` if authenticated but not admin
- Uses Supabase session and database role check

### 2. **Layout Protection** (`app/admin/layout.tsx`)

- **Server-side component** that wraps all admin pages
- Double-checks admin status before rendering admin layout
- Redirects to `/login` if user is not admin
- Provides consistent admin UI structure

### 3. **Client-Side Protection** (`components/admin/admin-protection.tsx`)

- **Optional client-side wrapper** for additional protection
- Can be used to wrap any component that needs admin access
- Shows loading state while checking permissions
- Provides custom fallback UI for unauthorized access

### 4. **API Protection** (`app/api/auth/admin-check/route.ts`)

- **API endpoint** to verify admin status
- Returns 403 if user is not admin
- Can be used by other services or components

## 🛡️ How It Works

### Authentication Flow:

```
User visits /admin → Middleware checks → Layout checks → Page renders
     ↓                    ↓                ↓
  Not logged in?    Not admin?      Show admin content
     ↓                    ↓
  Redirect to      Redirect to
  /login          / (home page)
```

### Role Check Process:

1. Get current session from Supabase
2. Query `users` table for user's role
3. Check if role equals "ADMIN" (case-insensitive)
4. Allow/deny access based on result

## 🎯 Usage Examples

### Protecting a New Admin Page:

```tsx
// The page will automatically be protected by middleware and layout
// No additional code needed in the page component
export default function NewAdminPage() {
  return <div>This is automatically protected!</div>;
}
```

### Using Client-Side Protection:

```tsx
import { AdminProtection } from "@/components/admin/admin-protection";

export default function SomeComponent() {
  return (
    <AdminProtection>
      <div>This content is only visible to admins</div>
    </AdminProtection>
  );
}
```

### Checking Admin Status in Components:

```tsx
import { useAuth } from "@/lib/auth-context";

export default function MyComponent() {
  const { isAdmin, user } = useAuth();

  if (!isAdmin) {
    return <div>Access denied</div>;
  }

  return <div>Admin content here</div>;
}
```

## 🔧 Configuration

### Admin Role Requirements:

- User must be authenticated (have valid session)
- User's role in `users` table must be "ADMIN" (case-insensitive)
- Role check is performed on every request

### Protected Routes:

- `/admin` - Main admin dashboard
- `/admin/*` - All admin sub-routes
- Any route starting with `/admin` is automatically protected

## 🚨 Security Notes

1. **Server-Side First**: Middleware and layout provide server-side protection
2. **Database Role Check**: Admin status is verified against database on each request
3. **Session Validation**: Valid Supabase session is required
4. **Automatic Redirects**: Unauthorized users are automatically redirected
5. **No Client-Side Bypass**: Client-side protection is supplementary only

## 🐛 Troubleshooting

### Common Issues:

1. **"Access Denied" for Admin Users**:

   - Check if user's role in database is exactly "ADMIN"
   - Verify user has valid session
   - Check browser console for errors

2. **Infinite Redirects**:

   - Ensure middleware is not redirecting API routes
   - Check if `/login` route is accessible

3. **Admin Panel Not Showing**:
   - Verify `isAdmin` is true in auth context
   - Check if user role is properly set in database

### Debug Steps:

1. Check browser network tab for API calls
2. Verify session in browser dev tools
3. Check server logs for middleware errors
4. Confirm database role value
