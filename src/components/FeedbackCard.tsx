// src/components/FeedbackCard.tsx
type Props = {
  title: string;
  items: string[] | string;
};

export default function FeedbackCard({ title, items }: Props) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md space-y-2">
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      {Array.isArray(items) ? (
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          {items.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700">{items}</p>
      )}
    </div>
  );
}
