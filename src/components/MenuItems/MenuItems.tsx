import React from "react";
import Accordion from "../UI/Accordion";

interface MenuItemsProps {
  onSelect: (item: string) => void;
  selectedAccordion: number | null;
  setSelectedAccordion: (value: number | null) => void;
  toggleMenu?: () => void;
}

const MenuItems: React.FC<MenuItemsProps> = ({
  onSelect,
  selectedAccordion,
  setSelectedAccordion,
  toggleMenu,
}) => {
  const handleAccordion = (index: number) => {
    setSelectedAccordion(selectedAccordion === index ? null : index);
  };

  const onSelectHandler = (item: string) => {
    onSelect(item);
    if (toggleMenu) toggleMenu();
  };

  return (
    <ul className="overflow-auto ">
      <Accordion
        title="Dashboard"
        isOpen={selectedAccordion === 1}
        onClick={() => handleAccordion(1)}
      >
        <ul className="space-y-2">
          <li onClick={() => onSelectHandler("Analytics")}>Analytics</li>
          <li onClick={() => onSelectHandler("Reporting")}>Reporting</li>
          <li onClick={() => onSelectHandler("Projects")}>Projects</li>
        </ul>
      </Accordion>
      <Accordion
        title="E-Commerce"
        isOpen={selectedAccordion === 2}
        onClick={() => handleAccordion(2)}
      >
        <ul className="space-y-2">
          <li onClick={() => onSelectHandler("Orders")}>Orders</li>
          <li onClick={() => onSelectHandler("Products")}>Products</li>
        </ul>
      </Accordion>
    </ul>
  );
};

export default MenuItems;
