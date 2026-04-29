export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-green-50">
      <header className="bg-green-600 p-4 text-white font-semibold flex justify-between">
        <span>Staff Portal</span>
        <span className="text-sm font-normal">In-Store</span>
      </header>
      <div className="flex flex-1">
        <aside className="w-56 bg-white p-4 shadow-sm border-r border-green-200">
          <nav>
            <ul>
              <li className="mb-2"><a href="/staff" className="text-green-700 hover:underline">POS / Checkout</a></li>
              <li className="mb-2"><a href="/staff/orders" className="text-green-700 hover:underline">Store Orders</a></li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
