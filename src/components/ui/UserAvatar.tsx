interface UserAvatarProps {
  name: string | null | undefined;
  // imageUrl?: string | null; for future
}

// Get initals from name
const getInitials = (name: string | null | undefined): string => {
  if (!name) return "?";
  const words = name.split(" ").filter(Boolean);
  if (words.length === 0) return "?";

  const firstInitial = words[0][0];
  const lastInitial = words.length > 1 ? words[words.length - 1][0] : "";

  return `${firstInitial}${lastInitial}`.toUpperCase();
};

// Hash Function to generate bg color from name
const generateColor = (name: string | null | undefined): string => {
  if (!name) return "bg-gray-500"; // Default

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash = hash & hash;
  }

  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-indigo-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  const index = Math.abs(hash % colors.length);
  return colors[index];
};

export default function UserAvatar({ name }: UserAvatarProps) {
  // Logic here
  const initials = getInitials(name);
  const bgColor = generateColor(name);

  return (
    <div
      className={`w-full h-full rounded-full flex items-center justify-center text-white font-bold text-4xl ${bgColor}`}
    >
      <span>{initials}</span>
    </div>
  );
}
