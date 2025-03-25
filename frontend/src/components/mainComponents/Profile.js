import React, { useContext, useState, useEffect } from 'react';
import { Bar, Line, Doughnut } from 'react-chartjs-2';
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
import axios from 'axios';
import UserContext from '../../UserContext';
import '../../styles/Profile.css';

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

const avatarOptions = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bella',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Cooper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Daisy',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Oliver',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Luna',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Rocky',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Bear',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Stella'
];

function Profile() {
  const { user, setUser, isLoading } = useContext(UserContext);
  const [quizResults, setQuizResults] = useState([]);
  const [error, setError] = useState(null);
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (user?.avatar) {
      setAvatar(user.avatar);
    }
  }, [user]);

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

  if (isLoading) {
    return <div className="loading">Betöltés...</div>;
  }

  if (!user) {
    return <div className="not-logged-in">Kérjük, jelentkezz be a profilod megtekintéséhez.</div>;
  }

  const selectAvatar = async (selectedAvatar) => {
    try {
      const response = await axios.put(
        '/api/user/avatar',
        { avatar: selectedAvatar },
        { withCredentials: true }
      );

      if (response.data?.user) {
        setUser(response.data.user);
        setAvatar(selectedAvatar);
      }
    } catch (err) {
      console.error("Error updating avatar:", err);
      setError("Hiba történt az avatar frissítésekor.");
    } finally {
      setIsModalOpen(false);
    }
  };

  const chartData = {
    labels: quizResults.map(result =>
      new Date(result.createdAt).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Helyes válaszok száma',
        data: quizResults.map(result => result.correctAnswers),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const lineChartData = {
    labels: quizResults.map(result =>
      new Date(result.createdAt).toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Helyes válaszok aránya (%)',
        data: quizResults.map(result => (result.correctAnswers / result.totalQuestions * 100).toFixed(1)),
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        tension: 0.1
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
        hoverOffset: 4
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14
          }
        }
      },
      title: {
        display: true,
        text: 'Quiz eredmények időbeli alakulása',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  function shiftDate(date, numDays) {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + numDays);
    return newDate;
  }

  const heatmapValues = quizResults.map(result => ({
    date: new Date(result.createdAt),
    count: result.correctAnswers / result.totalQuestions,
  }));

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="profile-container">
      <div className="profile-header">
        {error && <div className="error-message">{error}</div>}
      </div>

      <div className="profile-content">
        <div className="profile-sidebar">
          <div className="avatar-section">
            <img
              src={avatar}
              alt="Felhasználó avatárja"
              className="avatar-image"
              onClick={openModal}
            />
            <button
              className="avatar-change-button"
              onClick={openModal}
            >
              Avatar változtatása
            </button>
          </div>

          <div className="user-info">
            <h2 className="user-name">{user.name}</h2>
            <p className="user-email">{user.email}</p>
          </div>

          {quizResults.length > 0 && (
            <div className="quiz-results-summary">
              <h3>Legutóbbi eredmények</h3>
              <ul className="results-list">
                {quizResults.slice(0, 5).map((result) => (
                  <li key={result._id} className="result-item">
                    <span className="result-date">
                      {new Date(result.createdAt).toLocaleDateString('hu-HU')}
                    </span>
                    <span className="result-score">
                      {result.correctAnswers}/{result.totalQuestions}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="activity-calendar">
            <h3>Tevékenység naptár</h3>
            <CalendarHeatmap
              startDate={shiftDate(new Date(), -90)}
              endDate={new Date()}
              values={heatmapValues}
              classForValue={(value) => {
                if (!value) return 'color-empty';
                const intensity = Math.min(4, Math.floor(value.count * 5));
                return `color-scale-${intensity}`;
              }}
              tooltipDataAttrs={(value) => ({
                'data-tip': value.date
                  ? `${value.date.toISOString().slice(0, 10)}: ${Math.round(value.count * 100)}%`
                  : 'Nincs adat'
              })}
            />
          </div>
        </div>

        <div className="statistics-section">
          {quizResults.length > 0 ? (
            <>
              <div className="chart-container">
                <h3>Teljesítmény statisztikák</h3>
                <div className="chart-wrapper">
                  <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="chart-wrapper">
                  <Line data={lineChartData} options={chartOptions} />
                </div>
                <div className="chart-wrapper">
                  <Doughnut data={doughnutData} options={chartOptions} />
                </div>
              </div>
            </>
          ) : (
            <div className="no-results">
              <h3>Még nincsenek eredményeid</h3>
              <p>Végezz el egy kvízt az első eredményeid megtekintéséhez!</p>
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <div className="avatar-modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Válassz új avatárt</h3>
            </div>
            <div className="avatar-grid">
              {avatarOptions.map((option, index) => (
                <div
                  key={index}
                  className={`avatar-option ${avatar === option ? 'selected' : ''}`}
                  onClick={() => selectAvatar(option)}
                >
                  <img
                    src={option}
                    alt={`Avatar ${index + 1}`}
                    className="avatar-thumbnail"
                  />
                </div>
              ))}
            </div>
            <button className="close-button" onClick={closeModal}>Kilépés</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;