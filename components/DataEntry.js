'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAmountSubmit(enteredAmount);
      setEnteredAmount('');
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-3 sm:p-6 flex flex-row items-center justify-between">
        <CardTitle className="text-xl sm:text-2xl">Data Entry</CardTitle>
        <Button
          onClick={() => setIsFormVisible(!isFormVisible)}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          {isFormVisible ? 'Hide Form' : 'Show Form'}
        </Button>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        {isFormVisible && (
          <>
            {!isDataEntryComplete && (
              <div className="mb-4">
                <Select onValueChange={setSelectedBus} value={selectedBus}>
                  <SelectTrigger className="w-full">
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
              </div>
            )}

            {error && <div className="text-red-500 mb-4 text-sm sm:text-base">{error}</div>}

            <div className="bg-gray-900 text-green-400 p-2 sm:p-4 rounded-lg font-mono whitespace-pre-wrap overflow-x-auto text-xs sm:text-sm md:text-base">
              <p className="mb-2 break-words">$ {commandPrompt}</p>
              <Input
                type="number"
                value={enteredAmount}
                onChange={(e) => setEnteredAmount(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mt-2 w-full bg-gray-800 text-green-400 border-green-400 text-sm sm:text-base"
              />
              <Button 
                onClick={() => {
                  handleAmountSubmit(enteredAmount);
                  setEnteredAmount('');
                }}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white w-full text-sm sm:text-base"
              >
                Submit
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DataEntry;