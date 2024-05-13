import React, { useState } from "react";

import ThemeToggleButton from "../UI/ThemeToggleButton";
import MenuItems from "../MenuItems/MenuItems";
import Button from "../UI/Button";

interface SidebarProps {
  onSelect: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedAccordion, setSelectedAccordion] = useState<number | null>(
    null
  );

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div
      className={`transition-width duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-22"
      } hidden md:flex flex-col h-full bg-background-default dark:bg-background-dark p-4 shadow-md justify-between`}
    >
      <div>
        <Button
          onClick={toggleSidebar}
          className="w-full text-center text-white bg-gray-200 rounded hover:bg-gray-300 mb-4"
        >
          {isOpen ? "Close" : "Open"}
        </Button>
        {isOpen && (
          <MenuItems
            onSelect={onSelect}
            selectedAccordion={selectedAccordion}
            setSelectedAccordion={setSelectedAccordion}
          />
        )}
      </div>
      <div className="pt-4 flex justify-center">
        <ThemeToggleButton />
      </div>
    </div>
  );
};

export default Sidebar;
