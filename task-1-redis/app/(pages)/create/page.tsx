"use client";
import { useState } from "react";

import Link from "next/link";
import { saveUser } from "@/app/actions";
import InputField from "@/components/Input";

export default function CreatePage() {
  const initialForm = { name: "", email: "", address: "", age: "" };
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await saveUser(formData);

    if (res.success) {
      setFormData(initialForm);
    }
  };

  return (
    <div className="max-w-md mx-auto p-10  mt-10 shadow-lg bg-white rounded-lg">
      <h2 className="text-xl font-bold mb-6">Enter User Details</h2>

      <form onSubmit={handleSave}>
        <InputField
          label="Name"
          value={formData.name}
          onChange={(v) => handleChange("name", v)}
        />
        <InputField
          label="Email"
          value={formData.email}
          onChange={(v) => handleChange("email", v)}
        />
        <InputField
          label="Address"
          value={formData.address}
          onChange={(v) => handleChange("address", v)}
        />
        <InputField
          label="Age"
          value={formData.age}
          onChange={(v) => handleChange("age", v)}
        />

        <button className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">
          Save to Redis
        </button>
      </form>
    </div>
  );
}
