"use client";

import React from "react";
import { motion } from "framer-motion";

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
      className={`relative px-4 py-2 text-sm font-medium rounded-full transition-colors duration-300 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900
        ${isActive ? "text-white" : "text-gray-400 hover:text-white"}
      `}
    >
      <span className="relative z-10">{text}</span>
      {isActive && (
        <motion.div
          layoutId="active-pill"
          className="absolute inset-0 bg-indigo-600 rounded-full"
          style={{ borderRadius: 9999 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}
    </motion.button>
  );
};

export default NavItem;
