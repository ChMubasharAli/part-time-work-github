interface Props {
  label: string;
  name?: string;
  value?: string;
  readOnly?: boolean;
  onChange?: (val: string) => void;
  placeholder?: string;
}

export default function InputField({
  label,
  name,
  value,
  readOnly,
  onChange,
  placeholder,
}: Props) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-bold mb-1">{label}</label>
      <input
        name={name}
        value={value}
        readOnly={readOnly}
        onChange={(e) => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full p-2 border rounded ${
          readOnly ? "bg-gray-100" : "bg-white"
        }`}
      />
    </div>
  );
}
