"use client";
import { useEffect, useState } from "react";

import { getAllUsers } from "@/app/actions";

export default function ViewAllPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getAllUsers();
      setUsers(data);
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">All Users</h1>
      </div>

      {loading ? (
        <p>Loading Users from Redis...</p>
      ) : users.length === 0 ? (
        <p className="text-gray-500">No users found in Redis.</p>
      ) : (
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Age</th>
                <th className="p-3 border-b">Address</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="p-3 border-b">{user.name}</td>
                  <td className="p-3 border-b">{user.email}</td>
                  <td className="p-3 border-b">{user.age}</td>
                  <td className="p-3 border-b">{user.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
