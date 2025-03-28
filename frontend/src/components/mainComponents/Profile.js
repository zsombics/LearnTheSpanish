import React, { useContext, useState, useEffect } from 'react';
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
  Legend,
  ChartDataLabels
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

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [quizResults, setQuizResults] = useState([]);
  const [avatar, setAvatar] = useState(avatarOptions[0]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRanksModalOpen, setIsRanksModalOpen] = useState(false);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [leaderboardType, setLeaderboardType] = useState('accuracy');
  const [currentChartIndex, setCurrentChartIndex] = useState(0);
  const [timeView, setTimeView] = useState('daily');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [notification, setNotification] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordError, setPasswordError] = useState('');
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordMessage, setForgotPasswordMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('/api/auth/profile', { withCredentials: true });
        if (response.data.user) {
          setUser(response.data.user);
          setLoading(false);
        }
      } catch (err) {
        console.error('Hiba a felhasználói adatok betöltésekor:', err);
        setError('Hiba történt a profil betöltése során');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('/api/auth/leaderboard');
        setLeaderboardData(response.data);
      } catch (err) {
        console.error('Hiba a ranglista lekérdezésénél:', err);
      }
    };

    if (user) {
      fetchLeaderboard();
    }
  }, [user]);

  if (loading) {
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
        groupedData[key] = { totalCorrect: 0, totalQuestions: 0 };
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

  const totalQuizzes = quizResults.length;
  const totalQuestions = quizResults.reduce((sum, result) => sum + result.totalQuestions, 0);
  const totalCorrect = quizResults.reduce((sum, result) => sum + result.correctAnswers, 0);
  const overallPercentage = totalQuestions > 0
    ? ((totalCorrect / totalQuestions) * 100).toFixed(1)
    : 0;

  const calculateCumulativeData = () => {
    let cumulativeCorrect = 0;
    let cumulativeTotal = 0;
    const sortedResults = [...quizResults].sort((a, b) =>
      new Date(a.createdAt) - new Date(b.createdAt)
    );

    return sortedResults.map(result => {
      cumulativeCorrect += result.correctAnswers;
      cumulativeTotal += result.totalQuestions;
      return {
        date: new Date(result.createdAt),
        percentage: ((cumulativeCorrect / cumulativeTotal) * 100).toFixed(1)
      };
    });
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

  const cumulativeLineChartData = {
    labels: calculateCumulativeData().map(item =>
      item.date.toLocaleDateString('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
    ),
    datasets: [
      {
        label: 'Összesített pontosság (%)',
        data: calculateCumulativeData().map(item => item.percentage),
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
        hoverOffset: 4,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            const total = tooltipItem.dataset.data.reduce((acc, val) => acc + val, 0);
            const currentValue = tooltipItem.raw;
            const percentage = ((currentValue / total) * 100).toFixed(1);
            return `${tooltipItem.label}: ${percentage}%`;
          },
        },
      },
      datalabels: {
        color: '#fff',
        font: {
          weight: 'bold',
        },
        formatter: function (value, context) {
          const total = context.dataset.data.reduce((acc, val) => acc + val, 0);
          const percentage = ((value / total) * 100).toFixed(1);
          return `${percentage}%`;
        },
      },
      doughnutCenterText: {
        content: function (tooltipItem) {
          return `Elvégzett tesztek: ${quizResults.length}`;
        },
        font: {
          size: 13,
          weight: 'bold',
        },
      },
    },
    elements: {
      arc: {
        borderWidth: 0,
      },
    },
  };

  const CenterTextPlugin = {
    id: 'doughnutCenterText',
    afterDraw: (chart) => {
      const { ctx, chartArea: { top, right, left, bottom, width, height } } = chart;
      ctx.save();
      const x = (left + right) / 2;
      const y = (top + bottom) / 2;
      const fontSize = doughnutOptions.plugins.doughnutCenterText.font.size;
      const fontStyle = doughnutOptions.plugins.doughnutCenterText.font.weight;
      ctx.font = `${fontStyle} ${fontSize}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const text = doughnutOptions.plugins.doughnutCenterText.content(chart);
      ctx.fillText(text, x, y);
      ctx.restore();
    },
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
          callback: function (value) {
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
          callback: function (value) {
            return value + '%';
          }
        }
      }
    }
  };

  const lineChartOptions = {
    ...chartOptions,
    scales: {
      ...chartOptions.scales,
      x: {
        reverse: false,
        ticks: {
          autoSkip: true,
          maxRotation: 45,
          minRotation: 45
        }
      },
      y: {
        ...chartOptions.scales.y,
        ticks: {
          callback: function (value) {
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Az új jelszavak nem egyeznek!');
      return;
    }

    try {
      const response = await axios.post(
        '/api/auth/change-password',
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        setNotification('Jelszó sikeresen módosítva!');
        setIsPasswordModalOpen(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      setPasswordError(error.response?.data?.message || 'Hiba történt a jelszó módosítása során.');
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/auth/request-password-reset', {
        email: forgotPasswordEmail
      });

      if (response.data.success) {
        setForgotPasswordMessage('Email elküldve! Kérjük ellenőrizd a postaládád.');
        setTimeout(() => {
          setForgotPasswordMessage('');
        }, 5000);
      }
    } catch (error) {
      setForgotPasswordMessage('Hiba történt az email küldése során.');
    }
  };

  const getPerformanceLevelSymbol = (level) => {
    const symbols = {
      'Bronz': '🥉',
      'Ezüst': '🥈',
      'Arany': '🥇',
      'Platina': '🔷',
      'Gyémánt': '💎'
    };
    return symbols[level] || '🥉';
  };

  const getUserRank = (type) => {
    if (!user || !leaderboardData.length) return null;
    
    const sortedData = [...leaderboardData].sort((a, b) => {
      if (type === 'accuracy') {
        return b.totalAccuracy - a.totalAccuracy;
      } else {
        return b.totalQuizzes - a.totalQuizzes;
      }
    });

    const userIndex = sortedData.findIndex(u => u._id === user._id);
    return userIndex + 1;
  };

  const ranksData = {
    performanceLevels: [
      { level: 'Bronz', symbol: '🥉', range: '0% - 20%' },
      { level: 'Ezüst', symbol: '🥈', range: '21% - 40%' },
      { level: 'Arany', symbol: '🥇', range: '41% - 60%' },
      { level: 'Platina', symbol: '🔷', range: '61% - 80%' },
      { level: 'Gyémánt', symbol: '💎', range: '81% - 100%' }
    ],
    accountLevels: [
      { level: 1, name: 'Kezdő', range: '0 - 50' },
      { level: 2, name: 'Gyakorló', range: '51 - 100' },
      { level: 3, name: 'Középfokú', range: '101 - 500' },
      { level: 4, name: 'Haladó', range: '501 - 1000' },
      { level: 5, name: 'Mester', range: '1001 - 5000' },
      { level: 6, name: 'Legenda', range: '5000+' }
    ]
  };

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
            <div className="user-levels">
              <div 
                className="level-badge performance" 
                data-level={user.performanceLevel}
                onClick={() => setIsRanksModalOpen(true)}
              >
                <span className="level-symbol">{getPerformanceLevelSymbol(user.performanceLevel)}</span>
              </div>
              <div 
                className="level-badge account" 
                onClick={() => setIsRanksModalOpen(true)}
              >
                <span className="level-name">{user.accountLevelName}</span>
              </div>
            </div>
          </div>

          <div className="all-time-stats">
            <h3>Összesített statisztika</h3>
            <div className="stat-item">
              <span className="stat-label">Teljes pontosság:</span>
              <span className="stat-value" style={{fontSize: "1em"}}>{overallPercentage}%</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Kitöltött kvízek:</span>
              <span className="stat-value" style={{fontSize: "1em"}}>{totalQuizzes}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Megválaszolt kérdések:</span>
              <span className="stat-value" style={{fontSize: "1em"}}>{totalCorrect}/{totalQuestions}</span>
            </div>
          </div>

          {quizResults.length > 0 && (
            <div className="quiz-results-summary">
              <h3 style={{ marginBottom: '5px' }}>Legutóbbi eredmények</h3>
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
          <button
            className="change-password-button"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Jelszóváltoztatás
          </button>

          {notification && (
            <div className="notification">
              {notification}
            </div>
          )}
        </div>

        <div className="profile-main">
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
                    {Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i).reverse().map(year => (
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

              <div className="stats-boxes">
                <div className="stat-box" onClick={() => setIsLeaderboardModalOpen(true)}>
                  <div className="stat-box-content">
                    <h3>Teljes pontosság</h3>
                    <div className="stat-value">{user.totalAccuracy.toFixed(1)}%</div>
                    <div className="stat-rank">
                      {getUserRank('accuracy')}. hely a ranglistán
                    </div>
                  </div>
                </div>
                <div className="stat-box" onClick={() => setIsLeaderboardModalOpen(true)}>
                  <div className="stat-box-content">
                    <h3>Kitöltött kvízek</h3>
                    <div className="stat-value">{user.totalQuizzes}</div>
                    <div className="stat-rank">
                      {getUserRank('quizzes')}. hely a ranglistán
                    </div>
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

      {isPasswordModalOpen && (
        <div className="avatar-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsPasswordModalOpen(false)}>×</button>
            <div className="modal-header">
              <h3>Jelszó módosítása</h3>
            </div>
            <form onSubmit={handlePasswordChange} className="password-form">
              <div className="form-group">
                <label htmlFor="currentPassword">Jelenlegi jelszó:</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">Új jelszó:</label>
                <input
                  type="password"
                  id="newPassword"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Új jelszó megerősítése:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  required
                />
              </div>
              {passwordError && <div className="error-message">{passwordError}</div>}
              <div className="button-container">
                <button type="submit" className="submit-button">Módosítás</button>
              </div>
              <span className="forgot-password-text">
                Elfelejtetted a jelszavad? <span className="forgot-password-link" onClick={() => {
                  setIsPasswordModalOpen(false);
                  setIsForgotPasswordModalOpen(true);
                }}>Kattints ide</span>
              </span>
            </form>
          </div>
        </div>
      )}

      {isForgotPasswordModalOpen && (
        <div className="avatar-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsForgotPasswordModalOpen(false)}>×</button>
            <div className="modal-header">
              <h3>Elfelejtett jelszó</h3>
            </div>
            <p>Add meg az email címed, és küldünk egy linket a jelszó visszaállításához.</p>
            <form onSubmit={handleForgotPassword} className="password-form">
              <div className="form-group">
                <label htmlFor="forgotPasswordEmail">Email cím:</label>
                <input
                  type="email"
                  id="forgotPasswordEmail"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  required
                />
              </div>
              {forgotPasswordMessage && (
                <p className={`message ${forgotPasswordMessage.includes('Hiba') ? 'error' : 'success'}`}>
                  {forgotPasswordMessage}
                </p>
              )}
              <div className="button-container">
                <button type="submit" className="submit-button">Küldés</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isRanksModalOpen && (
        <div className="ranks-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsRanksModalOpen(false)}>×</button>
            <div className="modal-header">
              <h3>Rangok és feltételek</h3>
            </div>
            <div className="ranks-tables">
              <div className="ranks-section">
                <h4>Teljesítmény Szintek</h4>
                <table className="ranks-table">
                  <thead>
                    <tr>
                      <th>Szint</th>
                      <th>Szimbólum</th>
                      <th>Százalék</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranksData.performanceLevels.map((level) => (
                      <tr key={level.level}>
                        <td>{level.level}</td>
                        <td>{level.symbol}</td>
                        <td>{level.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="ranks-section">
                <h4>Account Szintek</h4>
                <table className="ranks-table">
                  <thead>
                    <tr>
                      <th>Szint</th>
                      <th>Megnevezés</th>
                      <th>Kérdőívek</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ranksData.accountLevels.map((level) => (
                      <tr key={level.level}>
                        <td>{level.level}</td>
                        <td>{level.name}</td>
                        <td>{level.range}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLeaderboardModalOpen && (
        <div className="leaderboard-modal">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setIsLeaderboardModalOpen(false)}>×</button>
            <div className="modal-header">
              <h3>Ranglista</h3>
              <div className="leaderboard-type-selector">
                <button 
                  className={`type-button ${leaderboardType === 'accuracy' ? 'active' : ''}`}
                  onClick={() => setLeaderboardType('accuracy')}
                >
                  Pontosság
                </button>
                <button 
                  className={`type-button ${leaderboardType === 'quizzes' ? 'active' : ''}`}
                  onClick={() => setLeaderboardType('quizzes')}
                >
                  Kitöltött tesztek
                </button>
              </div>
            </div>
            <div className="leaderboard-list">
              {[...leaderboardData]
                .sort((a, b) => {
                  if (leaderboardType === 'accuracy') {
                    return b.totalAccuracy - a.totalAccuracy;
                  } else {
                    return b.totalQuizzes - a.totalQuizzes;
                  }
                })
                .map((userData, index) => (
                  <div 
                    key={userData._id} 
                    className={`leaderboard-item ${userData._id === user._id ? 'current-user' : ''}`}
                  >
                    <span className="rank-number">{index + 1}.</span>
                    <div className="user-info-container">
                      <img 
                        src={userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`} 
                        alt={`${userData.name} avatárja`} 
                        className="leaderboard-avatar"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.name}`;
                        }}
                      />
                      <span className="user-name">{userData.name}</span>
                    </div>
                    <span className="user-level">{getPerformanceLevelSymbol(userData.performanceLevel)}</span>
                    <span className="user-accuracy">
                      {leaderboardType === 'accuracy' 
                        ? `${userData.totalAccuracy.toFixed(1)}%`
                        : `${userData.totalQuizzes} db`
                      }
                    </span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;