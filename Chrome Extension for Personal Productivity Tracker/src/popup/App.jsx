import { useState, useEffect } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './App.css'

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [data, setData] = useState({});
  const [goals, setGoals] = useState({});
  const [loading, setLoading] = useState(true);
  const [exceededGoals, setExceededGoals] = useState([]);

  // Goal Input State
  const [newGoalDomain, setNewGoalDomain] = useState('');
  const [newGoalLimit, setNewGoalLimit] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const today = new Date().toISOString().split('T')[0];
    const key = `daily_${today}`;

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      const result = await chrome.storage.local.get([key, 'goals']);
      setData(result[key] || {});
      setGoals(result.goals || {});

      // Calculate exceeded goals for banner
      const currentData = result[key] || {};
      const currentGoals = result.goals || {};
      const exceeded = [];

      Object.entries(currentData).forEach(([domain, time]) => {
        const normalized = domain.replace(/^www\./, '');
        if (currentGoals[normalized]) {
          const minutes = time / 1000 / 60;
          if (minutes > currentGoals[normalized]) {
            exceeded.push(normalized);
          }
        }
      });
      setExceededGoals(exceeded);

    } else {
      // Mock data
      setData({
        'google.com': 120000,
        'github.com': 350000,
        'youtube.com': 45000,
        'stackoverflow.com': 90000,
        'netflix.com': 1800000,
      });
      setGoals({
        'youtube.com': 30
      });
    }
    setLoading(false);
  };

  const handleSaveGoal = async () => {
    if (!newGoalDomain || !newGoalLimit) return;
    const limit = parseInt(newGoalLimit);
    if (isNaN(limit)) return;

    // cleanup domain
    let domain = newGoalDomain.replace(/^https?:\/\//, '').replace(/\/.*$/, '').replace(/^www\./, '');

    const updatedGoals = { ...goals, [domain]: limit };
    setGoals(updatedGoals);

    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ goals: updatedGoals });
    }

    setNewGoalDomain('');
    setNewGoalLimit('');
  };

  const removeGoal = async (domain) => {
    const updatedGoals = { ...goals };
    delete updatedGoals[domain];
    setGoals(updatedGoals);
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
      await chrome.storage.local.set({ goals: updatedGoals });
    }
  }

  const formatTime = (ms) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  };

  const sortedSites = Object.entries(data).sort(([, a], [, b]) => b - a);

  // Check goal status
  const getProgress = (domain, timeMs) => {
    const limitMinutes = goals[domain];
    if (!limitMinutes) return null;
    const spentMinutes = timeMs / 1000 / 60;
    const percent = Math.min(100, (spentMinutes / limitMinutes) * 100);
    return { percent, limitMinutes, exceeded: spentMinutes > limitMinutes };
  };

  // Chart Data Preparation
  const getChartData = () => {
    const topSites = sortedSites.slice(0, 5);
    const others = sortedSites.slice(5).reduce((acc, [, time]) => acc + time, 0);

    const labels = topSites.map(([domain]) => domain);
    const dataPoints = topSites.map(([, time]) => Math.round(time / 1000 / 60)); // Minutes

    if (others > 0) {
      labels.push('Others');
      dataPoints.push(Math.round(others / 1000 / 60));
    }

    return {
      labels,
      datasets: [
        {
          data: dataPoints,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  };

  return (
    <div className="container">
      <h1>Productivity Tracker</h1>

      {exceededGoals.length > 0 && (
        <div className="warning-banner">
          ⚠️ Limit exceeded: {exceededGoals.join(', ')}
        </div>
      )}

      <div className="tabs">
        <button
          className={activeTab === 'dashboard' ? 'active' : ''}
          onClick={() => setActiveTab('dashboard')}
        >Dashboard</button>
        <button
          className={activeTab === 'goals' ? 'active' : ''}
          onClick={() => setActiveTab('goals')}
        >Goals</button>
        <button
          className={activeTab === 'trends' ? 'active' : ''}
          onClick={() => setActiveTab('trends')}
        >Trends</button>
      </div>

      {activeTab === 'dashboard' && (
        <div className="card">
          <h2>Today's Activity</h2>
          {loading ? (
            <p>Loading...</p>
          ) : sortedSites.length > 0 ? (
            <ul>
              {(() => {
                // Aggregate data by normalized domain to avoid duplicates
                const aggregated = {};
                sortedSites.forEach(([domain, time]) => {
                  if (domain !== 'newtab' && domain !== 'extensions' && !domain.startsWith('chrome://')) {
                    const normalized = domain.replace(/^www\./, '');
                    aggregated[normalized] = (aggregated[normalized] || 0) + time;
                  }
                });

                // Sort again
                const sortedAggregated = Object.entries(aggregated).sort(([, a], [, b]) => b - a);

                return sortedAggregated.map(([domain, time]) => {
                  const progress = getProgress(domain, time);
                  return (
                    <li key={domain} className={progress?.exceeded ? 'exceeded' : ''}>
                      <div className="site-info">
                        <span className="domain">{domain}</span>
                        {progress && (
                          <div className="progress-bar-container">
                            <div className="progress-bar" style={{ width: `${progress.percent}%`, backgroundColor: progress.exceeded ? '#ff4d4d' : '#4dff4d' }}></div>
                          </div>
                        )}
                      </div>
                      <span className="time">{formatTime(time)}</span>
                    </li>
                  );
                });
              })()}
            </ul>
          ) : (
            <p>No activity recorded today.</p>
          )}
          <button onClick={fetchData} className="refresh-btn">Refresh</button>
        </div>
      )}

      {activeTab === 'goals' && (
        <div className="card">
          <h2>Set Daily Limits</h2>
          <div className="goal-input">
            <input
              type="text"
              placeholder="Domain (e.g. youtube.com)"
              value={newGoalDomain}
              onChange={(e) => setNewGoalDomain(e.target.value)}
            />
            <input
              type="number"
              placeholder="Limit (minutes)"
              value={newGoalLimit}
              onChange={(e) => setNewGoalLimit(e.target.value)}
            />
            <button onClick={handleSaveGoal}>Add Goal</button>
          </div>

          <ul className="goal-list">
            {Object.entries(goals).map(([domain, limit]) => (
              <li key={domain}>
                <span>{domain}</span>
                <span>{limit} mins</span>
                <button className="delete-btn" onClick={() => removeGoal(domain)}>×</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {activeTab === 'trends' && (
        <div className="card">
          <h2>Activity Breakdown (Minutes)</h2>
          {sortedSites.length > 0 ? (
            <div className="chart-container">
              <Doughnut data={getChartData()} options={{ plugins: { legend: { position: 'bottom', labels: { color: 'white' } } } }} />
            </div>
          ) : (
            <p>No sufficient data for charts.</p>
          )}
        </div>
      )}
    </div>
  )
}

export default App
