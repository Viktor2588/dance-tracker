import { useState, useCallback } from 'react';
import './App.css';
import { getData } from './data';
import TabBar from './components/TabBar';
import Bibliothek from './components/Bibliothek';
import ProjectDetail from './components/ProjectDetail';
import Profil from './components/Profil';
import Training from './components/Training';
import AddVideoModal from './components/AddVideoModal';

export default function App() {
  const [tab, setTab] = useState('bibliothek');
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
        {tab === 'bibliothek' && !activeProject && (
          <Bibliothek data={data} onOpenProject={handleOpenProject} />
        )}
        {tab === 'bibliothek' && activeProject && (
          <ProjectDetail
            project={activeProject}
            onBack={handleBack}
            onDataChange={handleDataChange}
          />
        )}
        {tab === 'training' && (
          <Training data={data} onDataChange={handleDataChange} onOpenProject={handleOpenProject} activeProject={activeProject} onBack={handleBack} />
        )}
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
