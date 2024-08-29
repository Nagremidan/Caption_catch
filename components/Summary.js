'use client'
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TruckIcon, LeafIcon, DollarSignIcon, BarChartIcon, PercentIcon, PrinterIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";

const SummaryItem = ({ title, value, icon: Icon, color, subValue, isPercentage }) => (
  <div className="card w-full bg-[#023252] rounded-lg overflow-hidden shadow-lg flex flex-col sm:flex-row">
    <div className="tools flex items-center p-2 bg-[#01273f] sm:hidden">
      <div className="circle px-1">
        <span className="box w-2 h-2 rounded-full bg-[#ff605c] inline-block"></span>
      </div>
      <div className="circle px-1">
        <span className="box w-2 h-2 rounded-full bg-[#ffbd44] inline-block"></span>
      </div>
      <div className="circle px-1">
        <span className="box w-2 h-2 rounded-full bg-[#00ca4e] inline-block"></span>
      </div>
    </div>
    <div className="card__content p-4 text-white flex-grow flex flex-row sm:flex-col justify-between sm:justify-start items-center sm:items-start">
      <div className="flex flex-col sm:mb-3">
        <div className={`p-2 rounded-full ${color} mb-3 hidden sm:inline-block`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <p className="text-lg sm:text-sm font-bold sm:font-medium mb-1 text-blue-300 sm:text-white">{title}</p>
        <p className="text-3xl sm:text-xl font-extrabold sm:font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500 sm:text-white">
          {isPercentage ? `${value.toFixed(2)}%` : `₹${value.toFixed(2)}`}
        </p>
        {subValue && (
          <p className="text-sm text-blue-200 sm:text-white sm:opacity-75 mt-1">
            {isPercentage ? `₹${subValue.toFixed(2)}` : `${subValue.toFixed(2)}%`}
          </p>
        )}
      </div>
      <div className={`p-3 rounded-full ${color} ml-4 sm:hidden`}>
        <Icon className="w-8 h-8 text-white" />
      </div>
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
    <Card className="w-full bg-[#023252] text-white">
      <CardHeader className="p-4 sm:p-6 bg-gradient-to-r from-[#034694] to-[#01273f] flex flex-col sm:flex-row justify-between items-center border-b border-[#045694]">
        <CardTitle className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-0 text-center sm:text-left">
          CBE Cargo Summary Report
        </CardTitle>
        <Button 
          onClick={handlePrint} 
          variant="outline" 
          size="sm" 
          className="flex items-center bg-transparent border-white text-white hover:bg-white/100 transition-colors duration-200"
        >
          <PrinterIcon className="w-4 h-4 mr-2" />
          Print Report
        </Button>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 bg-[#023252]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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