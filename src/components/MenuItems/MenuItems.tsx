import React from "react";
import Accordion from "../UI/Accordion";

interface MenuItemsProps {
  onSelect: (item: string) => void;
  selectedAccordion: number | null;
  setSelectedAccordion: (value: number | null) => void;
}

const MenuItems: React.FC<MenuItemsProps> = ({
  onSelect,
  selectedAccordion,
  setSelectedAccordion,
}) => {
  const handleAccordion = (index: number) => {
    setSelectedAccordion(selectedAccordion === index ? null : index);
  };

  return (
    <ul className="overflow-auto ">
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
    </ul>
  );
};

export default MenuItems;
