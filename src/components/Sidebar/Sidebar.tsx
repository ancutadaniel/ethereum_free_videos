import React, { useState } from "react";
import Accordion from "../UI/Accordion";
import ThemeToggleButton from "../UI/ThemeToggleButton";

interface SidebarProps {
  onSelect: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onSelect }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedAccordion, setSelectedAccordion] = useState<number | null>(
    null
  );

  const toggleSidebar = () => setIsOpen(!isOpen);
  const handleAccordion = (index: number) => {
    setSelectedAccordion(selectedAccordion === index ? null : index);
  };

  return (
    <div
      className={`transition-width duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-22"
      } flex flex-col h-full bg-background-default dark:bg-background-dark p-4 shadow-md justify-between`} // Changed h-screen to h-full
    >
      <div>
        <button
          onClick={toggleSidebar}
          className="mb-2 w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isOpen ? "Close" : "Open"}
        </button>
        {isOpen && (
          <ul className="overflow-auto">
            <Accordion
              title="Dashboard"
              isOpen={selectedAccordion === 1}
              onClick={() => handleAccordion(1)}
            >
              <ul className="space-y-2">
                <li onClick={() => onSelect("Analytics")}>Analytics</li>
                <li onClick={() => onSelect("Reporting")}>Reporting</li>
                <li onClick={() => onSelect("Projects")}>Projects</li>
              </ul>
            </Accordion>
            <Accordion
              title="E-Commerce"
              isOpen={selectedAccordion === 2}
              onClick={() => handleAccordion(2)}
            >
              <ul className="space-y-2">
                <li onClick={() => onSelect("Orders")}>Orders</li>
                <li onClick={() => onSelect("Products")}>Products</li>
              </ul>
            </Accordion>
            <li onClick={() => onSelect("Inbox")}>Inbox</li>
            <li onClick={() => onSelect("Profile")}>Profile</li>
            <li onClick={() => onSelect("Settings")}>Settings</li>
            <li onClick={() => onSelect("Log Out")}>Log Out</li>
          </ul>
        )}
      </div>
      <div className="pt-4 flex justify-center">
        {" "}
        {/* Added padding-top and ensured it is flex */}
        <ThemeToggleButton />
      </div>
    </div>
  );
};

export default Sidebar;
