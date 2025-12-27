"use client";
import { useState } from "react";

import Link from "next/link";
import { searchUser } from "@/app/actions";
import InputField from "@/components/Input";

export default function SearchPage() {
  // Is state mein search se aaya hua data store hoga
  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    age: "",
  });

  const handleSearch = async (val: string) => {
    if (val.trim() === "") {
      setData({ name: "", email: "", address: "", age: "" });
      return;
    }

    // Server action call karein
    const result = await searchUser(val);

    if (result) {
      setData(result); // Input fields automatic update ho jayengi
    } else {
      // Agar match nahi milta to results clear rakhein
      setData({ name: "", email: "", address: "", age: "" });
    }
  };

  return (
    <div className="max-w-md mx-auto p-10 border mt-10 shadow-lg rounded-lg bg-white text-black">
      {/* Reusable Search Bar */}
      <InputField
        label="Search by Name"
        placeholder="Type name here (e.g. Ali)"
        onChange={handleSearch}
      />

      <div className="my-8 border-t border-gray-200 pt-6">
        {/* Reusable Fields in Read Only Mode */}
        <InputField label="Name" value={data.name} readOnly />
        <InputField label="Email" value={data.email} readOnly />
        <InputField label="Address" value={data.address} readOnly />
        <InputField label="Age" value={data.age} readOnly />
      </div>
    </div>
  );
}
