import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const BarChartComponent = ({ data, isMobile }) => {
  const formatXAxis = (tickItem) => {
    const date = new Date(tickItem);
    if (isMobile) {
      const day = date.getDate().toString().padStart(2, '0');
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${day}-${month}`;
    }
    return tickItem;
  };

  const totalBoxes = useMemo(() => {
    return data.reduce((sum, item) => sum + (item.boxes || 0), 0);
  }, [data]);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={350}>
        <BarChart 
          data={data} 
          margin={isMobile ? { top: 20, right: 0, left: 0, bottom: 60 } : { top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#4A5568', fontSize: isMobile ? 10 : 14 }} 
            tickFormatter={formatXAxis}
            height={60}
            interval={isMobile ? 'preserveStartEnd' : 0}
            angle={isMobile ? -45 : -45}
            textAnchor="end"
          />
          <YAxis tick={{ fill: '#4A5568', fontSize: 14 }} />
          <Tooltip 
            contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0', fontSize: '14px' }}
            labelFormatter={(value) => `Date: ${value}`}
          />
          <Bar dataKey="boxes" fill="#4C51BF" />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-right mt-4 pr-4 flex justify-end items-center">
        <span className="bg-green-100 text-green-800 px-4 py-2 rounded-lg shadow text-lg font-semibold">
          Total Boxes: {totalBoxes.toLocaleString()}
        </span>
      </div>
    </div>
  );
};

export default BarChartComponent;