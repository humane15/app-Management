import { useState } from 'react';
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { TrendingUp, BarChart3, Activity } from 'lucide-react';

// Sample data for the chart
const generateChartData = () => {
  const months = ['Jul', 'Ags', 'Sep', 'Okt', 'Nov', 'Des'];
  return months.map((month) => ({
    month,
    tagihan: 45000000 + (Math.random() - 0.5) * 5000000,
    terkumpul: 38000000 + (Math.random() - 0.5) * 4000000,
    tunggakan: 6000000 + (Math.random() - 0.5) * 2000000,
    rasio: 80 + (Math.random() - 0.5) * 10
  }));
};

const chartData = generateChartData();

type ChartType = 'line' | 'area' | 'bar';

export default function FinancialChart() {
  const [chartType, setChartType] = useState<ChartType>('area');

  const formatCurrency = (value: number) => {
    return `Rp ${(value / 1000000).toFixed(0)}M`;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(1)}%`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 dark:bg-dark-surface/95 backdrop-blur-sm border border-slate-200 dark:border-dark-border rounded-xl p-4 shadow-lg">
          <p className="font-semibold text-slate-900 dark:text-slate-100 mb-2">{`${label} 2024`}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name === 'Rasio Pelunasan' 
                ? `${entry.name}: ${formatPercentage(entry.value)}`
                : `${entry.name}: ${formatCurrency(entry.value)}`
              }
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 10, right: 30, left: 0, bottom: 0 }
    };

    switch (chartType) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="tagihan" 
              stroke="#0284c7" 
              strokeWidth={3}
              name="Total Tagihan"
              dot={{ fill: '#0284c7', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#0284c7', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="terkumpul" 
              stroke="#059669" 
              strokeWidth={3}
              name="Terkumpul"
              dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
            />
            <Line 
              type="monotone" 
              dataKey="tunggakan" 
              stroke="#d97706" 
              strokeWidth={3}
              name="Tunggakan"
              dot={{ fill: '#d97706', strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6, stroke: '#d97706', strokeWidth: 2 }}
            />
          </LineChart>
        );

      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="tagihan" 
              stackId="1"
              stroke="#0284c7" 
              fill="url(#colorTagihan)"
              name="Total Tagihan"
            />
            <Area 
              type="monotone" 
              dataKey="terkumpul" 
              stackId="2"
              stroke="#059669" 
              fill="url(#colorTerkumpul)"
              name="Terkumpul"
            />
            <defs>
              <linearGradient id="colorTagihan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0284c7" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#0284c7" stopOpacity={0.1}/>
              </linearGradient>
              <linearGradient id="colorTerkumpul" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#059669" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        );

      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" className="dark:stroke-slate-700" />
            <XAxis 
              dataKey="month" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: '#64748b' }}
              tickFormatter={formatCurrency}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar 
              dataKey="tagihan" 
              fill="#0284c7" 
              name="Total Tagihan"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="terkumpul" 
              fill="#059669" 
              name="Terkumpul"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="tunggakan" 
              fill="#d97706" 
              name="Tunggakan"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        );

      default:
        return <div>Chart type not supported</div>;
    }
  };

  return (
    <div className="bg-white/90 dark:bg-dark-surface/90 backdrop-blur-sm rounded-2xl border border-slate-200 dark:border-dark-border p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="font-heading text-lg font-semibold text-slate-900 dark:text-slate-100">
            Analisis Keuangan SPP
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Trend tagihan vs penerimaan 6 bulan terakhir
          </p>
        </div>

        {/* Chart Type Selector */}
        <div className="flex items-center space-x-1 bg-slate-100 dark:bg-dark-border rounded-lg p-1">
          <button
            onClick={() => setChartType('area')}
            className={`p-2 rounded-md transition-all duration-180 ${
              chartType === 'area'
                ? 'bg-white dark:bg-dark-surface shadow-sm text-brand-600'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            title="Area Chart"
          >
            <Activity className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`p-2 rounded-md transition-all duration-180 ${
              chartType === 'line'
                ? 'bg-white dark:bg-dark-surface shadow-sm text-brand-600'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            title="Line Chart"
          >
            <TrendingUp className="w-4 h-4" />
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={`p-2 rounded-md transition-all duration-180 ${
              chartType === 'bar'
                ? 'bg-white dark:bg-dark-surface shadow-sm text-brand-600'
                : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
            title="Bar Chart"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {renderChart()}
        </ResponsiveContainer>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-dark-border">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-brand-600 rounded-full"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Tagihan</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(chartData.reduce((sum, item) => sum + item.tagihan, 0) / chartData.length)}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Terkumpul</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {formatCurrency(chartData.reduce((sum, item) => sum + item.terkumpul, 0) / chartData.length)}
          </p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-1">
            <div className="w-3 h-3 bg-amber-600 rounded-full"></div>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Avg Rasio</span>
          </div>
          <p className="text-lg font-bold text-slate-900 dark:text-slate-100">
            {formatPercentage(chartData.reduce((sum, item) => sum + item.rasio, 0) / chartData.length)}
          </p>
        </div>
      </div>
    </div>
  );
}
