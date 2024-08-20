import React from 'react';
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

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#4A5568', fontSize: isMobile ? 10 : 12 }} 
          tickFormatter={formatXAxis}
          height={60}
          interval={isMobile ? 'preserveStartEnd' : 0}
          angle={isMobile ? 0 : -45}
          textAnchor={isMobile ? 'middle' : 'end'}
        />
        <YAxis tick={{ fill: '#4A5568' }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#FFF', border: '1px solid #E2E8F0' }}
          labelFormatter={(value) => `Date: ${value}`}
        />
        <Bar dataKey="boxes" fill="#4C51BF" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BarChartComponent;