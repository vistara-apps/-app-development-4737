import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const AnalyticsChart = ({ data, type = 'bar' }) => {
  if (type === 'dual') {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            yAxisId="left"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <YAxis 
            yAxisId="right" 
            orientation="right"
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            yAxisId="left"
            type="monotone" 
            dataKey="engagement" 
            stroke="hsl(170 70% 50%)" 
            strokeWidth={2}
            dot={{ fill: 'hsl(170 70% 50%)', strokeWidth: 2, r: 4 }}
            name="Engagement (%)"
          />
          <Line 
            yAxisId="right"
            type="monotone" 
            dataKey="reach" 
            stroke="hsl(210 40% 35%)" 
            strokeWidth={2}
            dot={{ fill: 'hsl(210 40% 35%)', strokeWidth: 2, r: 4 }}
            name="Reach (M)"
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          stroke="#6b7280"
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
        <Bar 
          dataKey="campaigns" 
          fill="hsl(170 70% 50%)" 
          radius={[4, 4, 0, 0]}
          name="Campaigns"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default AnalyticsChart;