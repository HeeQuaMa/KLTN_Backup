export default function CentralWarehouseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="bg-[#0f172a] p-4 text-white font-semibold flex justify-between">
        <span>Central Warehouse</span>
        <span className="text-sm font-normal">Global Supply</span>
      </header>
      <div className="flex flex-1">
        <aside className="w-64 bg-slate-800 text-slate-300 p-4">
          <nav>
            <ul>
              <li className="mb-2"><a href="/central-warehouse" className="hover:text-white">Dashboard</a></li>
              <li className="mb-2"><a href="/central-warehouse/shipments" className="hover:text-white">Shipments</a></li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
