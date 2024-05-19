import { FC } from "react";
import Form from "../FormVideo/FormVideo";

interface DashboardProps {
  selectedItem: string;
  className?: string;
}

const Dashboard: FC<DashboardProps> = ({ selectedItem, className }) => {
  

  return (
    <div className={`flex flex-col bg-green-100 ${className}`}>
      <div className="p-4 flex-none">
        <h1 className="text-lg font-bold">Dashboard</h1>
        <p>Selected Item: {selectedItem}</p>
      </div>
      <div className="flex flex-col md:flex-row flex-grow h-full mx-4 mb-4">
        <div className="md:w-7/12 w-full order-2 md:order-1 h-full md:mr-4">
          <div className="bg-white p-4 rounded shadow-md h-full">
            Video Player
          </div>
        </div>
        <div className="md:w-5/12 w-full order-1 md:order-2 h-full">
          <div className="bg-white p-4 rounded shadow-md h-full">
            <Form />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
