"use client";
import { useState } from "react";
import { saveUser } from "@/app/actions";
import InputField from "./components/Input";

export default function Home() {
  const initialForm = { name: "", email: "", address: "", age: "" };
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await saveUser(formData);

    if (res.success) {
      setFormData(initialForm);
    } else {
      alert("Error processing request.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto p-10 mt-10 shadow-xl bg-white rounded-xl border border-gray-100">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        User Registration
      </h2>
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
          type="email"
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
          type="number"
        />

        <button
          disabled={loading}
          className="w-full bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Processing..." : "Save User"}
        </button>
      </form>
    </div>
  );
}
