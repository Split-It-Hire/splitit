// Root admin layout — no auth check here.
// Auth is enforced in app/admin/(protected)/layout.tsx
// so the login page at /admin/login is NOT protected.
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
