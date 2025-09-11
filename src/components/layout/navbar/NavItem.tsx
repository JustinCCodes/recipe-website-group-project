"use client";

import React from "react";
import { motion } from "framer-motion";

// Types
interface NavItemProps {
  text: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ text, isActive, onClick }) => {
  return (
    <motion.button
      onTap={onClick}
      whileTap={{ scale: 0.95 }}
      className={`
        relative px-4 py-2 text-sm font-medium whitespace-nowrap
        transition-colors duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400
        after:content-[''] after:absolute after:left-0 after:-bottom-1
        after:h-[2px] after:bg-white after:transition-all after:duration-300
        hover:after:w-full
        ${
          isActive
            ? "text-white after:w-1/2 after:left-1/2 after:-translate-x-1/2"
            : "text-gray-400 hover:text-white after:w-0"
        }
      `}
    >
      {text}
    </motion.button>
  );
};

export default NavItem;
