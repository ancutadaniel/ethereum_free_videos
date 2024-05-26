import React, { useState } from "react";
import Header from "./components/Header/Header";
import Sidebar from "./components/Sidebar/Sidebar";
import Dashboard from "./components/Dashboard/Dashboard";
import Footer from "./components/Footer/Footer";

const App: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState("None");
  
  const handleSelect = (item: string) => {
    setSelectedItem(item);
  };

  return (
    <main className="flex flex-col h-screen overflow-hidden">
      <Header onSelect={handleSelect} />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar onSelect={handleSelect} />
        <div className="flex flex-col flex-grow overflow-hidden">
          <Dashboard selectedItem={selectedItem} className="flex-grow bg-gray-100 overflow-auto" />
          <Footer />
        </div>
      </div>
    </main>
  );
};

export default App;
