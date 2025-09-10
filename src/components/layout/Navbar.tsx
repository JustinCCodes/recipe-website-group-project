"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { NAV_ITEMS } from "@/constants/navigation";
import { useDragConstraints } from "@/hooks/useDragConstraints";
import NavItem from "./navbar/NavItem";

const Navbar: React.FC = () => {
  const [active, setActive] = useState<string>(NAV_ITEMS[0]);

  const constraintsRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Hook
  const dragConstraints = useDragConstraints(constraintsRef, navRef);

  return (
    // Container
    <div
      className="relative w-full bg-gray-800/50 backdrop-blur-sm rounded-full p-2 overflow-hidden"
      ref={constraintsRef}
    >
      {/* Draggable Items */}
      <motion.div
        ref={navRef}
        className="flex items-center space-x-2"
        drag="x"
        dragConstraints={dragConstraints}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 50 }}
        style={{ cursor: "grab" }}
        whileTap={{ cursor: "grabbing" }}
      >
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item}
            text={item}
            isActive={active === item}
            onClick={() => setActive(item)}
          />
        ))}
      </motion.div>
    </div>
  );
};

export default Navbar;
