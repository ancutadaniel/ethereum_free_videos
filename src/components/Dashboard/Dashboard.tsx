// Dashboard.tsx
import React from "react";

interface DashboardProps {
  selectedItem: string;
  className?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ selectedItem, className }) => {
  return (
    <div className={`flex-1 p-4 flex-grow bg-green-100 ${className}`}>
      <h1 className="text-lg font-bold">Dashboard</h1>
      <p>Selected Item: {selectedItem}</p>
      {/* Additional dashboard content */}
    </div>
  );
};

export default Dashboard;
