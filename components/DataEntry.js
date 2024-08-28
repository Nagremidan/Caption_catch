import React, { useState, useRef, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DataEntry = ({ 
  buses, 
  selectedBus, 
  setSelectedBus, 
  isDataEntryComplete, 
  error, 
  commandPrompt, 
  handleAmountSubmit, 
  disabledBuses 
}) => {
  const [enteredAmount, setEnteredAmount] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isFormVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isFormVisible]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAmountSubmit(enteredAmount);
      setEnteredAmount('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-gradient-to-b from-[#504b45] to-[#3c3b37] h-8 rounded-t-md flex items-center px-2">
        <div className="flex space-x-1.5">
          <button className="w-3 h-3 rounded-full bg-[#ee411a]"></button>
          <button className="w-3 h-3 rounded-full bg-gradient-to-b from-[#7d7871] to-[#595953]"></button>
          <button className="w-3 h-3 rounded-full bg-gradient-to-b from-[#7d7871] to-[#595953]"></button>
        </div>
        <p className="text-[#d5d0ce] ml-2 text-sm">gokotagiri@admin ~</p>
      </div>
      <div className="bg-[rgba(56,4,40,0.9)] text-white p-4 rounded-b-md font-mono text-sm">
        <div className="flex items-center mb-2">
          <span className="text-[#7eda28]">gokotagiri@admin</span>
          <span className="text-[#4878c0]">~</span>
          <span className="text-[#dddddd]">$</span>
          <span className="ml-1">{commandPrompt}</span>
        </div>
        
        {isFormVisible && !isDataEntryComplete && (
          <Select onValueChange={setSelectedBus} value={selectedBus} className="mb-2">
            <SelectTrigger className="w-full bg-transparent border-[#4878c0] text-white">
              <SelectValue placeholder="Select a bus" />
            </SelectTrigger>
            <SelectContent>
              {buses.map((bus) => (
                <SelectItem key={bus.id} value={bus.name} disabled={disabledBuses.includes(bus.name)}>
                  {bus.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
        
        {error && <div className="text-red-500 mb-2">{error}</div>}
        
        <div className="flex items-center">
          <span className="text-[#7eda28]">gokotagiri@admin:</span>
          <span className="text-[#4878c0]">~</span>
          <span className="text-[#dddddd]">$</span>
          <input
            ref={inputRef}
            type="text"
            value={enteredAmount}
            onChange={(e) => setEnteredAmount(e.target.value)}
            onKeyPress={handleKeyPress}
            className="ml-1 bg-transparent border-none outline-none text-white w-full"
            placeholder="Enter amount"
          />
        </div>
        <div className="h-4 w-2 bg-white ml-1 animate-pulse"></div>
      </div>
    </div>
  );
};

export default DataEntry;