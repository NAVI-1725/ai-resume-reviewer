// src/components/RoleSelect.tsx
import { useEffect, useMemo, useRef, useState } from 'react';

const roles = [
  'AI Engineer', 'Frontend Developer', 'Backend Developer', 'Data Scientist', 'ML Intern',
  'Product Manager', 'Cloud Architect', 'DevOps Engineer', 'Security Analyst', 'Full Stack Developer',
  'UI/UX Designer', 'Business Analyst', 'QA Engineer', 'Technical Writer', 'System Administrator',
  'Database Engineer', 'Mobile Developer', 'Game Developer', 'Embedded Systems Engineer',
  'React Developer', 'Java Developer', 'Python Developer', 'Prompt Engineer', 'Support Engineer'
];

type Props = {
  value: string;
  onChange: (val: string) => void;
};

export default function RoleSelect({ value, onChange }: Props) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    return roles.filter((role) =>
      role.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="space-y-2 relative" ref={ref}>
      <label className="block text-sm font-medium text-gray-700">
        Select Target Role (Optional)
      </label>
      <input
        type="text"
        value={search || value}
        onFocus={() => setShowDropdown(true)}
        onChange={(e) => {
          setSearch(e.target.value);
          onChange(''); // clear role until chosen
        }}
        placeholder="Search or enter custom role..."
        className="w-full p-3 bg-white text-gray-900 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {showDropdown && search && (
        <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-white shadow-md border border-gray-200 rounded-md">
          {filtered.length > 0 ? (
            filtered.map((role) => (
              <div
                key={role}
                onClick={() => {
                  onChange(role);
                  setSearch(role);
                  setShowDropdown(false);
                }}
                className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-gray-800"
              >
                {role}
              </div>
            ))
          ) : (
            <div className="px-4 py-2 text-gray-500 italic">No match found. Custom role will be used.</div>
          )}
        </div>
      )}
    </div>
  );
}
