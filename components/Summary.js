'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TruckIcon, LeafIcon, DollarSignIcon, BarChartIcon, PercentIcon, PrinterIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

const SummaryItem = ({ title, value, icon: Icon, color, subValue, isPercentage }) => (
  <div className="flex items-center p-4 bg-white rounded-lg shadow-md">
    <div className={`p-3 rounded-full ${color} mr-4`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div>
      <p className="mb-2 text-sm font-medium text-gray-600">{title}</p>
      <p className="text-lg font-semibold text-gray-700">
        {isPercentage ? `${value.toFixed(2)}%` : `₹${value.toFixed(2)}`}
      </p>
      {subValue && (
        <p className="text-sm text-gray-500">
          {isPercentage ? `₹${subValue.toFixed(2)}` : `${subValue.toFixed(2)}%`}
        </p>
      )}
    </div>
  </div>
);

const Summary = ({ overallSummary }) => {
  const baseSales = overallSummary.totalSales - overallSummary.tmyHandling - overallSummary.farmPickup;
  const profitAmount = overallSummary.totalSales - overallSummary.expense;
  const profitPercentage = (profitAmount / overallSummary.totalSales) * 100;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>CBE Cargo Summary Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20mm;
              color: #333;
            }
            h1 {
              text-align: center;
              color: #1a365d;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 12px;
              text-align: left;
            }
            th {
              background-color: #f2f2f2;
              font-weight: bold;
              color: #1a365d;
            }
            .total-row {
              font-weight: bold;
              background-color: #e6f3ff;
            }
            .profit-row {
              font-weight: bold;
              background-color: #e6ffe6;
            }
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              @page {
                size: A4 portrait;
                margin: 20mm;
              }
            }
          </style>
        </head>
        <body>
          <h1>CBE Cargo Summary Report</h1>
          <table>
            <tr>
              <th>Category</th>
              <th>Amount (₹)</th>
            </tr>
            <tr>
              <td>Base Sales</td>
              <td>${baseSales.toFixed(2)}</td>
            </tr>
            <tr>
              <td>TMY Handling</td>
              <td>${overallSummary.tmyHandling.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Farm Pickup</td>
              <td>${overallSummary.farmPickup.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td>Total Sales</td>
              <td>${overallSummary.totalSales.toFixed(2)}</td>
            </tr>
            <tr>
              <td>Expense</td>
              <td>${overallSummary.expense.toFixed(2)}</td>
            </tr>
            <tr class="profit-row">
              <td>Profit</td>
              <td>${profitAmount.toFixed(2)} (${profitPercentage.toFixed(2)}%)</td>
            </tr>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <Card className="w-full">
      <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-blue-500 to-purple-600 flex justify-between items-center">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-white">CBE Cargo Summary Report</CardTitle>
        <Button onClick={handlePrint} variant="secondary" size="sm" className="flex items-center">
          <PrinterIcon className="w-4 h-4 mr-2" />
          Print
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <SummaryItem 
            title="Base Sales" 
            value={baseSales} 
            icon={BarChartIcon} 
            color="bg-blue-500" 
          />
          <SummaryItem 
            title="TMY Handling" 
            value={overallSummary.tmyHandling} 
            icon={TruckIcon} 
            color="bg-green-500" 
          />
          <SummaryItem 
            title="Farm Pickup" 
            value={overallSummary.farmPickup} 
            icon={LeafIcon} 
            color="bg-yellow-500" 
          />
          <SummaryItem 
            title="Total Sales" 
            value={overallSummary.totalSales} 
            icon={DollarSignIcon} 
            color="bg-purple-500" 
          />
          <SummaryItem 
            title="Expense" 
            value={overallSummary.expense} 
            icon={ArrowDownIcon} 
            color="bg-red-500" 
          />
          <SummaryItem 
            title="Profit" 
            value={profitAmount} 
            subValue={profitPercentage}
            icon={PercentIcon} 
            color="bg-green-600" 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default Summary;