// components/EditIcon.js
export default function EditIcon({ className = "" }) {
  return (
    <div
      className={`w-8 h-8 flex items-center justify-center bg-purple-100 rounded-md hover:bg-purple-200 transition ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#a855f7"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-purple-700"
      >
        <path d="M12 20h9" /> {/* underline */}
        <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    </div>
  );
}
