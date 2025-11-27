// App.js
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import TechnologyList from './pages/TechnologyList';
import TechnologyDetail from './pages/TechnologyDetail';
import AddTechnology from './pages/AddTechnology';
import BulkEditTechnologies from './pages/BulkEditTechnologies'; // <-- НОВЫЙ ИМПОРТ
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import TechnologyCard from './components/TechnologyCard';
import ProgressHeader from './components/ProgressHeader';
import QuickActions from './components/QuickActions';
import './components/SearchBox.css';
import useTechnologies from './useTechnologies';
import { useState, useCallback } from 'react';

function App() {
  const { technologies, updateStatus, updateNotes, markAllCompleted, resetAllStatuses, progress } = useTechnologies();

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleResetAll = () => {
    resetAllStatuses();
  };

  const handleRandomSelect = () => {
    const notStarted = technologies.filter(tech => tech.status === 'not-started');
    if (notStarted.length > 0) {
      const randomTech = notStarted[Math.floor(Math.random() * notStarted.length)];
      updateStatus(randomTech.id, 'in-progress');
      return;
    }

    const inProgress = technologies.filter(tech => tech.status === 'in-progress');
    if (inProgress.length > 0) {
      const randomTech = inProgress[Math.floor(Math.random() * inProgress.length)];
      updateStatus(randomTech.id, 'completed');
      return;
    }
  };

  const handleStatusChange = useCallback((techId) => {
    const tech = technologies.find(t => t.id === techId);
    if (!tech) return;

    let newStatus;
    if (tech.status === 'not-started') {
      newStatus = 'in-progress';
    } else if (tech.status === 'in-progress') {
      newStatus = 'completed';
    } else {
      newStatus = 'not-started';
    }
    updateStatus(techId, newStatus);
  }, [technologies, updateStatus]);

  const total = technologies.length;
  const completed = technologies.filter(tech => tech.status === 'completed').length;

  const filteredTechnologies = technologies.filter(tech => {
    const matchesFilter = activeFilter === 'all' || tech.status === activeFilter;
    const matchesSearch =
      tech.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tech.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <Router>
      <div className="app">
        <Navigation />
        <Routes>
          <Route path="/" element={
            <>
              <header className="app-header">
                <h1>Дорожная карта изучения React</h1>
                <p>Отслеживайте прогресс в изучении технологий</p>
              </header>
              <main className="app-main">
                <ProgressHeader total={total} completed={completed} progress={progress} />
                <QuickActions
                  onMarkAllCompleted={markAllCompleted}
                  onResetAll={handleResetAll}
                  onRandomSelect={handleRandomSelect}
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  technologies={technologies}
                />
                <div className="search-box">
                  <input
                    type="text"
                    placeholder="Поиск технологий..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <span>Найдено: {filteredTechnologies.length}</span>
                </div>
                <div className="technologies-list">
                  {filteredTechnologies.map((tech) => (
                    <TechnologyCard
                      key={tech.id}
                      techId={tech.id}
                      title={tech.title}
                      description={tech.description}
                      status={tech.status}
                      notes={tech.notes}
                      onStatusChange={() => handleStatusChange(tech.id)}
                      onNotesChange={updateNotes}
                    />
                  ))}
                </div>
              </main>
            </>
          } />
          <Route path="/technologies" element={<TechnologyList />} />
          <Route path="/add-technology" element={<AddTechnology />} />
          <Route path="/technology/:techId" element={<TechnologyDetail />} />
          <Route path="/bulk-edit" element={<BulkEditTechnologies />} /> {/* <-- НОВЫЙ МАРШРУТ */}
          <Route path="/statistics" element={<Statistics />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;