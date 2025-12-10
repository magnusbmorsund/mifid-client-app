import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_URL = 'http://localhost:5001/api';

const COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
];

const PortfolioChart = ({ selectedInstruments }) => {
  const [historicalData, setHistoricalData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('aggregated'); // 'aggregated' or 'individual'
  const [timeRange, setTimeRange] = useState('1y');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (selectedInstruments.length > 0) {
      fetchHistoricalData();
    }
  }, [selectedInstruments, timeRange]);

  const fetchHistoricalData = async () => {
    setLoading(true);
    setError(null);
    try {
      const symbols = selectedInstruments.map(inst => inst.symbol);
      const response = await axios.post(`${API_URL}/instruments/historical`, {
        symbols,
        range: timeRange
      });

      const { historicalData: data } = response.data;
      
      // Check if any data was returned
      const validData = data.filter(item => item.data && item.data.length > 0);
      if (validData.length === 0) {
        setError('No historical data available for selected instruments');
        setHistoricalData([]);
        setLoading(false);
        return;
      }

      // Process data for chart
      const processedData = processChartData(validData);
      setHistoricalData(processedData);
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError('Failed to load historical data');
    }
    setLoading(false);
  };

  const processChartData = (data) => {
    // Get all unique dates
    const allDates = new Set();
    data.forEach(instrument => {
      instrument.data.forEach(point => allDates.add(point.date));
    });

    const sortedDates = Array.from(allDates).sort();

    // Create chart data structure
    return sortedDates.map(date => {
      const dataPoint = { date };

      // Add individual instrument values
      data.forEach(instrument => {
        const point = instrument.data.find(p => p.date === date);
        if (point) {
          dataPoint[instrument.symbol] = parseFloat(point.value);
        }
      });

      // Calculate aggregated portfolio value (weighted by allocation)
      let aggregatedValue = 0;
      let totalAllocation = 0;

      selectedInstruments.forEach(inst => {
        const allocation = inst.allocation || 0;
        if (allocation > 0 && dataPoint[inst.symbol] !== undefined) {
          aggregatedValue += (dataPoint[inst.symbol] * allocation);
          totalAllocation += allocation;
        }
      });

      if (totalAllocation > 0) {
        dataPoint.portfolio = (aggregatedValue / totalAllocation).toFixed(2);
      }

      return dataPoint;
    });
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="chart-tooltip">
          <p className="tooltip-label">{new Date(label).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              <strong>{entry.name}:</strong> {parseFloat(entry.value).toFixed(2)}%
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (selectedInstruments.length === 0) {
    return null;
  }

  return (
    <div className="portfolio-chart">
      <div className="chart-header">
        <h3>Historical Returns</h3>
        <div className="chart-controls">
          <div className="view-toggle">
            <button
              className={`toggle-btn ${viewMode === 'aggregated' ? 'active' : ''}`}
              onClick={() => setViewMode('aggregated')}
            >
              Aggregated
            </button>
            <button
              className={`toggle-btn ${viewMode === 'individual' ? 'active' : ''}`}
              onClick={() => setViewMode('individual')}
            >
              Individual
            </button>
          </div>
          <div className="time-range-selector">
            <button
              className={`range-btn ${timeRange === '1mo' ? 'active' : ''}`}
              onClick={() => setTimeRange('1mo')}
            >
              1M
            </button>
            <button
              className={`range-btn ${timeRange === '3mo' ? 'active' : ''}`}
              onClick={() => setTimeRange('3mo')}
            >
              3M
            </button>
            <button
              className={`range-btn ${timeRange === '6mo' ? 'active' : ''}`}
              onClick={() => setTimeRange('6mo')}
            >
              6M
            </button>
            <button
              className={`range-btn ${timeRange === '1y' ? 'active' : ''}`}
              onClick={() => setTimeRange('1y')}
            >
              1Y
            </button>
            <button
              className={`range-btn ${timeRange === '5y' ? 'active' : ''}`}
              onClick={() => setTimeRange('5y')}
            >
              5Y
            </button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="chart-loading">
          <div className="loading-spinner"></div>
          <p>Loading historical data...</p>
        </div>
      )}

      {error && (
        <div className="chart-error">
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && historicalData.length > 0 && (
        <div className="chart-container">
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={historicalData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
                label={{ value: 'Return (%)', angle: -90, position: 'insideLeft' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="line"
              />
              
              {viewMode === 'aggregated' ? (
                <Line
                  type="monotone"
                  dataKey="portfolio"
                  name="Portfolio"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 6 }}
                />
              ) : (
                selectedInstruments.map((inst, index) => (
                  <Line
                    key={inst.symbol}
                    type="monotone"
                    dataKey={inst.symbol}
                    name={inst.symbol}
                    stroke={COLORS[index % COLORS.length]}
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4 }}
                  />
                ))
              )}
            </LineChart>
          </ResponsiveContainer>

          <div className="chart-legend-info">
            <p className="legend-note">
              {viewMode === 'aggregated' 
                ? 'Showing weighted portfolio return based on allocations'
                : 'Showing individual instrument returns (normalized to 100)'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioChart;
