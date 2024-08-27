'use client'

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from 'lucide-react';

const BusReports = ({ allReports }) => {
  const [isVisible, setIsVisible] = useState(false);

  const formatAsciiTable = (data, totalAmount) => {
    if (data.length === 0) return '';

    const headers = ['From', 'To', 'Boxes', 'Price/Box', 'Total'];
    const widths = headers.map(header => Math.max(
      header.length,
      ...data.map(item => {
        const value = item[header.toLowerCase()];
        return value !== undefined ? value.toString().length : 0;
      }),
      totalAmount.toFixed(2).length
    ));

    const formatRow = (items) => '| ' + items.map((item, i) => (item || '').toString().padEnd(widths[i])).join(' | ') + ' |';
    const separator = '+' + widths.map(w => '-'.repeat(w + 2)).join('+') + '+';

    let table = '\n' + separator + '\n' + formatRow(headers) + '\n' + separator + '\n';
    table += data.map(row => 
      formatRow([row.from, row.to, row.numberOfBoxes, `₹${row.pricePerBox?.toFixed(2) || '0.00'}`, `₹${row.totalAmount?.toFixed(2) || '0.00'}`])
    ).join('\n') + '\n' + separator + '\n';
    table += formatRow(['', '', '', 'Total:', `₹${totalAmount.toFixed(2)}`]) + '\n' + separator;

    return table;
  };

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl sm:text-2xl font-bold">Individual Bus Reports</h2>
        <Button
          onClick={() => setIsVisible(!isVisible)}
          variant="outline"
          className="flex items-center"
        >
          {isVisible ? (
            <>Hide Reports <ChevronUp className="ml-2 h-4 w-4" /></>
          ) : (
            <>Show Reports <ChevronDown className="ml-2 h-4 w-4" /></>
          )}
        </Button>
      </div>
      
      {isVisible && (
        <div className="space-y-4">
          {Object.entries(allReports).map(([busName, busReport]) => (
            <Card key={busName} className="w-full">
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">{busName}</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="overflow-x-auto">
                  <pre className="whitespace-pre-wrap text-xs sm:text-sm">
                    {formatAsciiTable(busReport.report, busReport.totalAmount)}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusReports;