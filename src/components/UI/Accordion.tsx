import React from "react";
import { ReactComponent as UpArrow } from "../../assets/UpArrow.svg";
import { ReactComponent as DownArrow } from "../../assets/DownArrow.svg";
import Button from "./Button";

interface AccordionProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isOpen,
  className = "",
  onClick,
}) => {
  return (
    <>
      <Button
        onClick={onClick}
        className={`flex justify-between items-center w-full px-4 py-2 text-left text-sm text-white bg-gray-200 rounded hover:bg-gray-300 ${className}`}
      >
        {title}
        {isOpen ? <UpArrow /> : <DownArrow />}
      </Button>
      {isOpen && <div className="ml-4 mb-2">{children}</div>}
    </>
  );
};

export default Accordion;
