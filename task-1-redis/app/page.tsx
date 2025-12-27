import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-gray-200">
      <h1 className="text-3xl font-bold">Redis Management</h1>
      <div className="space-x-4">
        <Link href="/create" className="cursor-pointer">
          <button className="bg-green-500 text-white px-6 py-2 rounded cursor-pointer">
            Create User
          </button>
        </Link>
        <Link href="/search" className="cursor-pointer">
          <button className="bg-blue-500 text-white px-6 py-2 rounded cursor-pointer">
            Search User
          </button>
        </Link>
      </div>
    </div>
  );
}
