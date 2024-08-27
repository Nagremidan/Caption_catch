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
      <CardHeader className="p-4 flex flex-row items-center justify-between">
        <CardTitle className="text-xl">Data Entry</CardTitle>
        <Button
          onClick={() => setIsFormVisible(!isFormVisible)}
          variant="outline"
          size="sm"
          className="text-sm"
        >
          {isFormVisible ? 'Hide Form' : 'Show Form'}
        </Button>
      </CardHeader>
      <CardContent className="p-4">
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

            {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

            <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono">
              <p className="mb-3 text-sm break-words">$ {commandPrompt}</p>
              <Input
                type="number"
                value={enteredAmount}
                onChange={(e) => setEnteredAmount(e.target.value)}
                onKeyPress={handleKeyPress}
                className="mb-3 w-full bg-gray-800 text-green-400 border-green-400 text-base"
                placeholder="Enter amount"
              />
              <Button 
                onClick={() => {
                  handleAmountSubmit(enteredAmount);
                  setEnteredAmount('');
                }}
                className="w-full bg-green-600 hover:bg-green-700 text-white text-base"
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