"use client";

import { useState, useEffect } from "react";
import { getUserByJSONIndex, seedUsersWithJSON } from "./actions";

export default function Page() {
  const [index, setIndex] = useState(0);
  const [user, setUser] = useState({ name: "", email: "" });

  useEffect(() => {
    async function init() {
      await seedUsersWithJSON();
      const data = await getUserByJSONIndex(0);
      if (data) setUser(data);
    }
    init();
  }, []);

  async function navigate(newIndex: number) {
    const data = await getUserByJSONIndex(newIndex);
    if (data) {
      setUser(data);
      setIndex(newIndex);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center flex-col">
      <input type="text" value={user.name} readOnly />

      <input type="text" value={user.email} readOnly />

      <div className="flex gap-2 mt-4">
        <button onClick={() => navigate(index - 1)}>Previous</button>
        <button onClick={() => navigate(index + 1)}>Next</button>
      </div>
    </div>
  );
}
