import React, { useContext, useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
import '../../styles/Profile.css';
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
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import UserContext from '../../UserContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Profile() {
  const { user } = useContext(UserContext);
  const [quizResults, setQuizResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuizResults = async () => {
      try {
        const response = await fetch('/api/eredmenyek', {
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setQuizResults(data);
      } catch (err) {
        console.error("Error fetching quiz results:", err);
        setError("Hiba történt az eredmények betöltésekor.");
      }
    };

    if (user) {
      fetchQuizResults();
    }
  }, [user]);

  if (!user) {
    return <p>Kérjük, jelentkezz be a profilod megtekintéséhez.</p>;
  }

  const calculateAverageByLevel = () => {
    const levels = {};
    quizResults.forEach(result => {
      if (!levels[result.level]) {
        levels[result.level] = { total: 0, count: 0 };
      }
      levels[result.level].total += result.ratio;
      levels[result.level].count += 1;
    });

    return Object.keys(levels).map(level => ({
      level,
      average: (levels[level].total / levels[level].count) * 100,
    }));
  };

  const chartData = {
    labels: quizResults.map(result => new Date(result.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Helyes válaszok aránya (%)',
        data: quizResults.map(result => (result.ratio * 100).toFixed(2)),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const lineChartData = {
    labels: quizResults.map(result => new Date(result.createdAt).toLocaleDateString()),
    datasets: [
      {
        label: 'Helyes válaszok aránya (%)',
        data: quizResults.map(result => (result.ratio * 100).toFixed(2)),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const doughnutData = {
    labels: ['Helyes válaszok', 'Helytelen válaszok'],
    datasets: [
      {
        data: [
          quizResults.reduce((sum, result) => sum + result.correctAnswers, 0),
          quizResults.reduce((sum, result) => sum + (result.totalQuestions - result.correctAnswers), 0),
        ],
        backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 99, 132, 0.6)'],
      },
    ],
  };

  const barData = {
    labels: calculateAverageByLevel().map(item => item.level),
    datasets: [
      {
        label: 'Átlagos helyes válaszok aránya (%)',
        data: calculateAverageByLevel().map(item => item.average.toFixed(2)),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: {
        display: true,
        text: 'Quiz eredmények időbeli alakulása',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: value => `${value}%`,
        },
      },
    },
  };

  const shiftDate = (date, numDays) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  };

  const heatmapValues = quizResults.map(result => ({
    date: new Date(result.createdAt),
    count: result.ratio,
  }));

  return (
    <div className="profile">
      <h2>Profil</h2>
      <p>Név: {user.name}</p>
      <p>Email: {user.email}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {quizResults.length > 0 ? (
        <div>
          <div className="chart-container">
            <Bar data={chartData} options={chartOptions} />
            <Line data={lineChartData} options={chartOptions} />
            <Doughnut data={doughnutData} options={chartOptions} />
            <Bar data={barData} options={chartOptions} />
          </div>
          <div className="calendar-container">
            <CalendarHeatmap
              startDate={shiftDate(new Date(), -30)}
              endDate={new Date()}
              values={heatmapValues}
              classForValue={(value) => {
                if (!value) {
                  return 'color-empty';
                }
                return `color-scale-${Math.floor(value.count * 10)}`;
              }}
              showWeekdayLabels={true}
            />
          </div>
        </div>
      ) : (
        <p>Még nincsenek eredményeid. Próbálj ki egy kvízt!</p>
      )}
    </div>
  );
}

export default Profile;
