// App.tsx
import React, { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState("None");

  const handleSelect = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <main className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-grow">
        <Sidebar onSelect={handleSelect} />
        <Dashboard
          selectedItem={selectedItem}
          className="flex-grow bg-gray-100"
        />
      </div>
    </main>
  );
};

export default App;
