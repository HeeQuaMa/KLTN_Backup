export default function StoreManagerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <header className="bg-[#fb923c] p-4 text-white font-semibold">Store Manager Portal</header>
      <div className="flex flex-1">
        <aside className="w-64 bg-white p-4 shadow-sm border-r">
          <nav>
            <ul>
              <li className="mb-2"><a href="/store-manager" className="text-orange-600 hover:underline">Overview</a></li>
              <li className="mb-2"><a href="/store-manager/inventory" className="text-orange-600 hover:underline">Inventory</a></li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
