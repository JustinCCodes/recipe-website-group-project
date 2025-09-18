import React from "react";

interface UserAvatarProps {
  name: string | null; // users display name or null
  profileImageUrl?: string | null; // optional profile image url
  size?: "sm" | "lg"; // optional size
}

const UserAvatar: React.FC<UserAvatarProps> = ({ name, profileImageUrl, size = "lg" }) => {
  // Styles based on size
  let containerClasses = "";
  let textClasses = "";

  switch (size) {
    case "sm":
      containerClasses = "w-7 h-7"; // small circle for navbar
      textClasses = "text-sm font-bold"; // smaller font for inital
      break;
    case "lg":
    default:
      containerClasses = "w-24 h-24"; // large circle for profile page
      textClasses = "text-5xl font-bold"; // bigger font for inital
      break;
  }
  // Takes first letter capitilize or empty string
  const initial = name ? name.charAt(0).toUpperCase() : "";

  return profileImageUrl ? (
    <img
      src={profileImageUrl}
      alt={name || "User"}
      className={`rounded-full object-cover ${containerClasses}`}
    />
  ) : (
    <div
      className={`flex items-center justify-center rounded-full bg-primary text-primary-content ${containerClasses}`}
    >
      {/* Render initial inside circle */}
      <span className={textClasses}>{initial}</span>
    </div>
  );
};

export default UserAvatar;
