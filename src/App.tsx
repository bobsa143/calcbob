import { useState } from 'react';
import { Zap, Calculator, History, BookOpen } from 'lucide-react';
import WireCalculator from './components/WireCalculator';
import TurnsCalculator from './components/TurnsCalculator';
import ProjectsHistory from './components/ProjectsHistory';
import TechnicalTables from './components/TechnicalTables';
import SafetyWarning from './components/SafetyWarning';

type Tab = 'wire' | 'turns' | 'history' | 'tables';

function App() {
  const [activeTab, setActiveTab] = useState<Tab>('wire');

  const tabs = [
    { id: 'wire' as Tab, label: 'Section Fil', icon: Calculator },
    { id: 'turns' as Tab, label: 'Nombre Spires', icon: Zap },
    { id: 'history' as Tab, label: 'Projets', icon: History },
    { id: 'tables' as Tab, label: 'Tables Techniques', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-gradient-to-r from-slate-800 to-slate-900 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500 p-3 rounded-lg">
              <Zap className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Calcul Rebobinage Moteur</h1>
              <p className="text-slate-300 text-sm">Dimensionnement professionnel pour moteurs électriques</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <SafetyWarning />

        <div className="mt-6 bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex border-b overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-b-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="p-6">
            {activeTab === 'wire' && <WireCalculator />}
            {activeTab === 'turns' && <TurnsCalculator />}
            {activeTab === 'history' && <ProjectsHistory />}
            {activeTab === 'tables' && <TechnicalTables />}
          </div>
        </div>

        <footer className="mt-8 text-center text-sm text-gray-600 pb-6">
          <p>Application professionnelle de calcul de rebobinage - Version 1.0</p>
          <p className="mt-1">Toujours vérifier les calculs et effectuer des tests avant mise en service</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
