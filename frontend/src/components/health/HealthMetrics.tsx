import React, { useState } from 'react';
import { ChevronLeft, Plus, TrendingUp, TrendingDown, Activity } from 'lucide-react';
import Container from '../layout/Container';

interface MetricSeries {
  name: string;
  unit: string;
  latest: string;
  status: string;
  trend: string;
  change: string;
  data: Array<{ date: string; value: string; time: string }>;
  chart: number[];
}

interface HealthMetricsProps {
  onBack: () => void;
  onAddMetric?: () => void;
  metricsData?: { bp: MetricSeries; weight: MetricSeries; sugar: MetricSeries };
}

export const HealthMetrics = ({ onBack, onAddMetric, metricsData }: HealthMetricsProps) => {
  const [activeMetric, setActiveMetric] = useState<'bp' | 'weight' | 'sugar'>('bp');

  const metrics: { bp: MetricSeries; weight: MetricSeries; sugar: MetricSeries } = metricsData ?? {
    bp: {
      name: 'Blood Pressure',
      unit: 'mmHg',
      latest: '128/82',
      status: 'good',
      trend: 'down',
      change: '-3%',
      data: [
        { date: 'May 12', value: '132/85', time: '8:00 AM' },
        { date: 'May 14', value: '130/83', time: '7:45 AM' },
        { date: 'May 16', value: '128/82', time: '8:15 AM' },
        { date: 'May 18', value: '128/82', time: '7:30 AM' }
      ],
      chart: [132, 130, 128, 128]
    },
    weight: {
      name: 'Weight',
      unit: 'kg',
      latest: '72',
      status: 'good',
      trend: 'down',
      change: '-2kg',
      data: [
        { date: 'May 1', value: '74', time: 'Morning' },
        { date: 'May 8', value: '73', time: 'Morning' },
        { date: 'May 15', value: '72', time: 'Morning' }
      ],
      chart: [74, 73, 72]
    },
    sugar: {
      name: 'Blood Sugar',
      unit: 'mg/dL',
      latest: '108',
      status: 'good',
      trend: 'stable',
      change: '+0%',
      data: [
        { date: 'May 10', value: '112', time: 'Fasting' },
        { date: 'May 13', value: '106', time: 'Fasting' },
        { date: 'May 16', value: '108', time: 'Fasting' }
      ],
      chart: [112, 106, 108]
    }
  };

  const currentMetric = metrics[activeMetric];
  const maxValue = Math.max(...currentMetric.chart);
  const minValue = Math.min(...currentMetric.chart);

  return (
    <div className="w-full h-screen flex flex-col" style={{ backgroundColor: '#FBFAF7' }}>
      {/* Top Bar */}
      <div
        className="flex items-center justify-between px-4 sm:px-6 py-5 border-b"
        style={{ backgroundColor: '#FBFAF7', borderColor: '#E7E4DD' }}
      >
        <button onClick={onBack} className="p-2" style={{ color: '#1E2A5E' }}>
          <ChevronLeft size={24} />
        </button>
        <h1 style={{
          fontFamily: 'Sora, sans-serif',
          fontSize: '1.25rem',
          fontWeight: 700,
          color: '#1E2A5E'
        }}>
          Health Metrics
        </h1>
        <button
          onClick={onAddMetric}
          className="p-2"
          style={{
            color: '#3D6BE5',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          <Plus size={24} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-6">
        <Container maxWidth="content">
          {/* Metric Tabs */}
          <div className="py-4">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveMetric('bp')}
              className="flex-1 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: activeMetric === 'bp' ? '#3D6BE5' : '#FFFFFF',
                color: activeMetric === 'bp' ? '#FFFFFF' : '#5E6680',
                border: `1.5px solid ${activeMetric === 'bp' ? '#3D6BE5' : '#E7E4DD'}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Blood Pressure
            </button>
            <button
              onClick={() => setActiveMetric('weight')}
              className="flex-1 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: activeMetric === 'weight' ? '#3D6BE5' : '#FFFFFF',
                color: activeMetric === 'weight' ? '#FFFFFF' : '#5E6680',
                border: `1.5px solid ${activeMetric === 'weight' ? '#3D6BE5' : '#E7E4DD'}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Weight
            </button>
            <button
              onClick={() => setActiveMetric('sugar')}
              className="flex-1 py-3 rounded-xl transition-all"
              style={{
                backgroundColor: activeMetric === 'sugar' ? '#3D6BE5' : '#FFFFFF',
                color: activeMetric === 'sugar' ? '#FFFFFF' : '#5E6680',
                border: `1.5px solid ${activeMetric === 'sugar' ? '#3D6BE5' : '#E7E4DD'}`,
                fontFamily: 'Inter, sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer'
              }}
            >
              Blood Sugar
            </button>
          </div>
        </div>

          {/* Current Value Card */}
          <div className="mb-6">
          <div
            className="p-6 rounded-3xl"
            style={{
              background: 'linear-gradient(135deg, #1E2A5E 0%, #3D6BE5 100%)'
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <p style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.8125rem',
                  color: '#A8BCF0',
                  marginBottom: '0.5rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  LATEST {currentMetric.name.toUpperCase()}
                </p>
                <div className="flex items-baseline gap-2 mb-2">
                  <h2 style={{
                    fontFamily: 'Sora, sans-serif',
                    fontSize: '3rem',
                    fontWeight: 700,
                    color: '#F4D27A',
                    lineHeight: 1
                  }}>
                    {currentMetric.latest}
                  </h2>
                  <span style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '1.125rem',
                    color: '#A8BCF0'
                  }}>
                    {currentMetric.unit}
                  </span>
                </div>
              </div>

              {/* Trend Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: currentMetric.trend === 'down' ? 'rgba(110, 154, 110, 0.2)' : 'rgba(168, 188, 240, 0.2)'
                }}
              >
                {currentMetric.trend === 'down' ? (
                  <TrendingDown size={24} style={{ color: '#6E9A6E' }} />
                ) : currentMetric.trend === 'up' ? (
                  <TrendingUp size={24} style={{ color: '#C9892E' }} />
                ) : (
                  <Activity size={24} style={{ color: '#A8BCF0' }} />
                )}
              </div>
            </div>

            {/* Change */}
            <div className="flex items-center gap-2">
              <div
                className="px-3 py-1 rounded-full"
                style={{
                  backgroundColor: currentMetric.trend === 'down' ? 'rgba(110, 154, 110, 0.2)' : 'rgba(168, 188, 240, 0.2)'
                }}
              >
                <span style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: currentMetric.trend === 'down' ? '#6E9A6E' : '#A8BCF0'
                }}>
                  {currentMetric.change} from last month
                </span>
              </div>
            </div>
          </div>
        </div>

          {/* Chart */}
          <div className="mb-6">
          <h3 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#1E2A5E',
            marginBottom: '1rem'
          }}>
            Trend
          </h3>

          <div
            className="p-5 rounded-2xl"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E7E4DD',
              boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
            }}
          >
            <div className="flex items-end justify-between gap-3 h-40">
              {currentMetric.chart.map((value, idx) => {
                const height = ((value - minValue) / (maxValue - minValue)) * 100;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <div className="w-full flex flex-col justify-end" style={{ height: '100%' }}>
                      <div
                        className="w-full rounded-t-lg transition-all"
                        style={{
                          height: `${height}%`,
                          minHeight: '20%',
                          backgroundColor: '#3D6BE5'
                        }}
                      />
                    </div>
                    <span style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.6875rem',
                      color: '#5E6680',
                      textAlign: 'center'
                    }}>
                      {currentMetric.data[idx]?.date.split(' ')[1] || idx + 1}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

          {/* History */}
          <div>
          <h3 style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#1E2A5E',
            marginBottom: '1rem'
          }}>
            Recent Readings
          </h3>

          <div className="space-y-3">
            {currentMetric.data.map((reading, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E7E4DD',
                  boxShadow: '0 2px 8px rgba(30, 42, 94, 0.04)'
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p style={{
                      fontFamily: 'Sora, sans-serif',
                      fontSize: '1.125rem',
                      fontWeight: 700,
                      color: '#1E2A5E',
                      marginBottom: '0.25rem'
                    }}>
                      {reading.value} {currentMetric.unit}
                    </p>
                    <p style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '0.8125rem',
                      color: '#5E6680'
                    }}>
                      {reading.time}
                    </p>
                  </div>
                  <p style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '0.875rem',
                    color: '#5E6680'
                  }}>
                    {reading.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        </Container>
      </div>
    </div>
  );
};
