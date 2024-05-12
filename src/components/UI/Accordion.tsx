import React from 'react';
import { ReactComponent as UpArrow } from '../../assets/UpArrow.svg';
import { ReactComponent as DownArrow } from '../../assets/DownArrow.svg';
import Button from './Button';


interface AccordionProps {
  title: string;
  isOpen: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({
  title,
  children,
  isOpen,
  onClick,
}) => {
  return (
    <div className='m-2 mt-1 mb-4'>
      <Button
        onClick={onClick}
        className="flex justify-between items-center w-full px-4 py-2 text-left text-sm text-white bg-gray-200 rounded hover:bg-gray-300 "
      >
        {title}
        {isOpen ? <UpArrow /> : <DownArrow />}
      </Button>
      {isOpen && <div className="ml-4">{children}</div>}
    </div>
  );
};

export default Accordion;
