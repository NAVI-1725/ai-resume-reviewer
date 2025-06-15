// src/components/ResumeInput.tsx
type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function ResumeInput({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Paste Your Resume
      </label>
      <textarea
        className="w-full h-40 p-4 border border-gray-300 rounded-md resize-none bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Paste your resume here..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
