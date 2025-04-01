import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Profile.css';
import '../../styles/Carousel.css';

// Import components
import AvatarSection from './Profile/components/AvatarSection';
import UserInfo from './Profile/components/UserInfo';
import AllTimeStats from './Profile/components/AllTimeStats';
import QuizResultsSummary from './Profile/components/QuizResultsSummary';
import ChartSection from './Profile/components/ChartSection';
import ActivityCalendar from './Profile/components/ActivityCalendar';
import StatsBoxes from './Profile/components/StatsBoxes';

// Import modals
import AvatarModal from './Profile/components/modals/AvatarModal';
import PasswordModal from './Profile/components/modals/PasswordModal';
import ForgotPasswordModal from './Profile/components/modals/ForgotPasswordModal';
import RanksModal from './Profile/components/modals/RanksModal';
import LeaderboardModal from './Profile/components/modals/LeaderboardModal';

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
          <AvatarSection avatar={avatar} openModal={openModal} />
          <UserInfo 
            user={user} 
            getPerformanceLevelSymbol={getPerformanceLevelSymbol} 
            setIsRanksModalOpen={setIsRanksModalOpen} 
          />
          <AllTimeStats 
            overallPercentage={overallPercentage}
            totalQuizzes={totalQuizzes}
            totalCorrect={totalCorrect}
            totalQuestions={totalQuestions}
          />
          <QuizResultsSummary quizResults={quizResults} />
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
              <ChartSection 
                chartData={chartData}
                cumulativeLineChartData={cumulativeLineChartData}
                doughnutData={doughnutData}
                currentChartIndex={currentChartIndex}
                goPrev={goPrev}
                goNext={goNext}
                timeView={timeView}
                setTimeView={setTimeView}
                chartOptions={chartOptions}
                modifiedChartOptions={modifiedChartOptions}
                lineChartOptions={lineChartOptions}
                doughnutOptions={doughnutOptions}
                CenterTextPlugin={CenterTextPlugin}
              />

              <ActivityCalendar 
                selectedYear={selectedYear}
                setSelectedYear={setSelectedYear}
                heatmapValues={heatmapValues}
              />

              <StatsBoxes 
                user={user}
                getUserRank={getUserRank}
                setIsLeaderboardModalOpen={setIsLeaderboardModalOpen}
              />
            </>
          ) : (
            <div className="no-results">
              <h3>Még nincsenek eredményeid</h3>
              <p>Végezz el egy kvízt az első eredményeid megtekintéséhez!</p>
            </div>
          )}
        </div>
      </div>

      <AvatarModal 
        isOpen={isModalOpen}
        closeModal={closeModal}
        avatarOptions={avatarOptions}
        avatar={avatar}
        selectAvatar={selectAvatar}
      />

      <PasswordModal 
        isOpen={isPasswordModalOpen}
        closeModal={() => setIsPasswordModalOpen(false)}
        passwordData={passwordData}
        setPasswordData={setPasswordData}
        handlePasswordChange={handlePasswordChange}
        passwordError={passwordError}
        setIsForgotPasswordModalOpen={setIsForgotPasswordModalOpen}
      />

      <ForgotPasswordModal 
        isOpen={isForgotPasswordModalOpen}
        closeModal={() => setIsForgotPasswordModalOpen(false)}
        forgotPasswordEmail={forgotPasswordEmail}
        setForgotPasswordEmail={setForgotPasswordEmail}
        handleForgotPassword={handleForgotPassword}
        forgotPasswordMessage={forgotPasswordMessage}
      />

      <RanksModal 
        isOpen={isRanksModalOpen}
        closeModal={() => setIsRanksModalOpen(false)}
        ranksData={ranksData}
      />

      <LeaderboardModal 
        isOpen={isLeaderboardModalOpen}
        closeModal={() => setIsLeaderboardModalOpen(false)}
        leaderboardData={leaderboardData}
        leaderboardType={leaderboardType}
        setLeaderboardType={setLeaderboardType}
        user={user}
        getPerformanceLevelSymbol={getPerformanceLevelSymbol}
      />
    </div>
  );
};

export default Profile; 