import { useState, useCallback } from 'react';
import './App.css';
import { getData } from './data';
import TabBar from './components/TabBar';
import Projekte from './components/Projekte';
import ProjectDetail from './components/ProjectDetail';
import Sammlung from './components/Sammlung';
import Statistik from './components/Statistik';
import Profil from './components/Profil';
import Training from './components/Training';
import Vergleich from './components/Vergleich';
import AddVideoModal from './components/AddVideoModal';

export default function App() {
  const [tab, setTab] = useState('start');
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [data, setData] = useState(() => getData());
  const [showAddModal, setShowAddModal] = useState(false);

  const handleOpenProject = useCallback((id) => {
    setActiveProjectId(id);
  }, []);

  const handleBack = useCallback(() => {
    setActiveProjectId(null);
  }, []);

  const handleDataChange = useCallback((next) => {
    setData(next);
  }, []);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setActiveProjectId(null);
  };

  const activeProject = activeProjectId
    ? data.projects.find((p) => p.id === activeProjectId)
    : null;

  return (
    <div className="app">
      {/* Main scrollable content */}
      <main className="app-main">
        {tab === 'start' && !activeProject && (
          <Projekte data={data} onOpenProject={handleOpenProject} />
        )}
        {tab === 'start' && activeProject && (
          <ProjectDetail
            project={activeProject}
            onBack={handleBack}
            onDataChange={handleDataChange}
          />
        )}
        {tab === 'sammlung' && <Sammlung data={data} />}
        {tab === 'training' && <Training data={data} onDataChange={handleDataChange} />}
        {tab === 'vergleich' && <Vergleich data={data} onDataChange={handleDataChange} />}
        {tab === 'statistik' && <Statistik data={data} />}
        {tab === 'profil' && <Profil data={data} />}
      </main>

      {/* Bottom Tab Bar */}
      <TabBar
        activeTab={tab}
        onTabChange={handleTabChange}
        onCameraClick={() => setShowAddModal(true)}
      />

      {/* Add Video Modal */}
      {showAddModal && (
        <AddVideoModal
          data={data}
          onClose={() => setShowAddModal(false)}
          onDataChange={handleDataChange}
        />
      )}
    </div>
  );
}
