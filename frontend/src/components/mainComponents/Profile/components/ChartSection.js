import React from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const ChartSection = ({ 
  chartData, 
  cumulativeLineChartData, 
  doughnutData, 
  currentChartIndex, 
  goPrev, 
  goNext, 
  timeView, 
  setTimeView,
  chartOptions,
  modifiedChartOptions,
  lineChartOptions,
  doughnutOptions,
  CenterTextPlugin
}) => {
  return (
    <div className="chart-container">
      <h3>Teljesítmény statisztikák</h3>
      <div className="charts-carousel">
        <button
          className="carousel-arrow left"
          onClick={goPrev}
          disabled={currentChartIndex === 0}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M15 18L9 12L15 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="charts-container">
          <div className="charts-slider" style={{ transform: `translateX(-${currentChartIndex * 100}%)` }}>
            <div className="chart-wrapper">
              <Bar data={chartData} options={modifiedChartOptions} />
              <select
                className="view-selector"
                value={timeView}
                onChange={(e) => setTimeView(e.target.value)}
              >
                <option value="daily">Napi nézet</option>
                <option value="weekly">Heti nézet</option>
                <option value="monthly">Havi nézet</option>
                <option value="6months">Féléves nézet</option>
                <option value="yearly">Éves nézet</option>
                <option value="all">Teljes időszak</option>
              </select>
            </div>
            <div className="chart-wrapper">
              <Line data={cumulativeLineChartData} options={lineChartOptions} />
            </div>
            <div className="chart-wrapper">
              <Doughnut data={doughnutData} options={doughnutOptions} plugins={[CenterTextPlugin]} />
            </div>
          </div>
        </div>

        <button
          className="carousel-arrow right"
          onClick={goNext}
          disabled={currentChartIndex === 2}
        >
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M9 18L15 12L9 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="carousel-indicators">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`carousel-indicator ${currentChartIndex === index ? 'active' : ''}`}
              onClick={() => setCurrentChartIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChartSection; 