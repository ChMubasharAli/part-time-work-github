// components/Input.tsx
interface InputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

export default function InputField({
  label,
  value,
  onChange,
  type = "text",
}: InputProps) {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 font-medium mb-1">{label}</label>
      <input
        type={type}
        className="w-full border border-gray-300 p-2 rounded text-black focus:ring-2 focus:ring-green-500 outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={`Enter ${label.toLowerCase()}`}
        required
      />
    </div>
  );
}
