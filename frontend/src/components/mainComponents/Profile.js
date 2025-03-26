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
import ReactTooltip from 'react-tooltip';
import 'react-calendar-heatmap/dist/styles.css';
import axios from 'axios';
import UserContext from '../../UserContext';
import '../../styles/Profile.css';
import '../../styles/Carousel.css';

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
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const [timeView, setTimeView] = useState('daily');

  const [currentYear] = useState(new Date().getFullYear());
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const years = Array.from({ length: 4 }, (_, i) => currentYear - i).reverse();

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

  const aggregateDataByTimeView = () => {
    const groupedData = {};

    quizResults.forEach(result => {
      const date = new Date(result.createdAt);
      let key;

      switch (timeView) {
        case 'weekly':
          key = `Week ${Math.ceil(date.getDate() / 7)}, ${date.getFullYear()}`;
          break;
        case 'monthly':
          key = `${date.toLocaleString('hu-HU', { month: 'long' })} ${date.getFullYear()}`;
          break;
        case '6months':
          key = `Félév ${Math.floor(date.getMonth() / 6 + 1)}, ${date.getFullYear()}`;
          break;
        case 'yearly':
          key = date.getFullYear().toString();
          break;
        case 'all':
          key = 'Összes';
          break;
        default:
          key = date.toLocaleDateString('hu-HU');
      }

      if (!groupedData[key]) {
        groupedData[key] = {
          totalCorrect: 0,
          totalQuestions: 0
        };
      }

      groupedData[key].totalCorrect += result.correctAnswers;
      groupedData[key].totalQuestions += result.totalQuestions;
    });

    return Object.keys(groupedData).map(key => ({
      label: key,
      percentage: (groupedData[key].totalCorrect / groupedData[key].totalQuestions * 100).toFixed(1)
    }));
  };

  const goPrev = () => {
    setCurrentChartIndex(prev => Math.max(prev - 1, 0));
  };

  const goNext = () => {
    setCurrentChartIndex(prev => Math.min(prev + 1, 2));
  };

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
    labels: aggregateDataByTimeView().map(item => item.label),
    datasets: [
      {
        label: 'Helyes válaszok aránya (%)',
        data: aggregateDataByTimeView().map(item => item.percentage),
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
        data: quizResults.map(result => ((result.correctAnswers / result.totalQuestions) * 100).toFixed(1)),
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
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };
  
  const modifiedChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      x: {
        reverse: true,
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        ...chartOptions.scales.y,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    }
  };

  const heatmapValues = quizResults
    .filter(result => new Date(result.createdAt).getFullYear() === selectedYear)
    .map(result => ({
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
              <h3 style={{ marginBottom: '5px' }}>Legutóbbi eredmények</h3>              <ul className="results-list">
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
        </div>

        <div className="statistics-section">
          {quizResults.length > 0 ? (
            <>
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
                        <Line data={lineChartData} options={chartOptions} />
                      </div>
                      <div className="chart-wrapper">
                        <Doughnut data={doughnutData} options={chartOptions} />
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

                <div className="activity-calendar">
                  <h3>Tevékenység naptár</h3>

                  <div className="calendar-fullwidth">
                    <CalendarHeatmap
                      startDate={new Date(`${selectedYear}-01-01`)}
                      endDate={new Date(`${selectedYear}-12-31`)}
                      values={heatmapValues}
                      classForValue={(value) => {
                        if (!value || !value.count) return 'color-empty';
                        const count = Math.floor(value.count * 100);
                        return count > 20 ? 'color-scale-4' :
                          count > 15 ? 'color-scale-3' :
                            count > 10 ? 'color-scale-2' :
                              count > 5 ? 'color-scale-1' : 'color-scale-0';
                      }}
                      tooltipDataAttrs={value => ({
                        'data-tip': value.date ?
                          `${value.date.toISOString().slice(0, 10)}: ${Math.round(value.count * 100)}%` : ''
                      })}
                      showWeekdayLabels={true}
                      weekdayLabels={['', 'H', '', 'Sze', '', 'P', '']}
                      monthLabels={['Jan', 'Feb', 'Már', 'Ápr', 'Máj', 'Jún', 'Júl', 'Aug', 'Szep', 'Okt', 'Nov', 'Dec']}
                      horizontal={true}
                      gutterSize={2}
                    />
                    <ReactTooltip />
                  </div>

                  <div className="year-selector">
                    {years.map(year => (
                      <button
                        key={year}
                        onClick={() => setSelectedYear(year)}
                        className={selectedYear === year ? 'active' : ''}
                      >
                        {year}
                      </button>
                    ))}
                  </div>
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
