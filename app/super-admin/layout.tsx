export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <header className="bg-[#1e40af] p-4 text-white">Super Admin Portal - NetTech</header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white p-4 shadow-md">
          <nav>
            <ul>
              <li className="mb-2"><a href="/super-admin" className="text-blue-600 hover:underline">Dashboard</a></li>
              <li className="mb-2"><a href="/super-admin/users" className="text-blue-600 hover:underline">Manage Users</a></li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
