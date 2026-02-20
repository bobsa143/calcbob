import { useState } from 'react';
import { Calculator, Save, RotateCcw } from 'lucide-react';
import { supabase, WireSpecification } from '../lib/supabase';

interface WireInputs {
  power: number;
  voltage: number;
  phases: 1 | 3;
  poles: number;
  efficiency: number;
  powerFactor: number;
  currentDensity: number;
  serviceType: string;
}

interface WireResults {
  nominalCurrent: number;
  theoreticalSection: number;
  recommendedWires: WireSpecification[];
}

export default function WireCalculator() {
  const [inputs, setInputs] = useState<WireInputs>({
    power: 5.5,
    voltage: 400,
    phases: 3,
    poles: 4,
    efficiency: 85,
    powerFactor: 0.85,
    currentDensity: 4,
    serviceType: 'S1',
  });

  const [results, setResults] = useState<WireResults | null>(null);
  const [projectName, setProjectName] = useState('');
  const [saving, setSaving] = useState(false);

  const calculateWireSection = () => {
    const { power, voltage, phases, efficiency, powerFactor, currentDensity } = inputs;

    let nominalCurrent: number;

    if (phases === 3) {
      nominalCurrent = (power * 1000) / (Math.sqrt(3) * voltage * (efficiency / 100) * powerFactor);
    } else {
      nominalCurrent = (power * 1000) / (voltage * (efficiency / 100) * powerFactor);
    }

    const theoreticalSection = nominalCurrent / currentDensity;

    fetchRecommendedWires(theoreticalSection);

    setResults({
      nominalCurrent,
      theoreticalSection,
      recommendedWires: [],
    });
  };

  const fetchRecommendedWires = async (minSection: number) => {
    const { data } = await supabase
      .from('wire_specifications')
      .select('*')
      .gte('section_mm2', minSection * 0.9)
      .order('section_mm2', { ascending: true })
      .limit(5);

    if (data && results) {
      setResults({ ...results, recommendedWires: data });
    }
  };

  const saveProject = async () => {
    if (!projectName || !results) return;

    setSaving(true);
    try {
      await supabase.from('projects').insert({
        name: projectName,
        calculation_type: 'wire',
        input_parameters: inputs,
        results: results,
        notes: '',
      });
      alert('Projet sauvegardé avec succès !');
      setProjectName('');
    } catch (error) {
      alert('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setInputs({
      power: 5.5,
      voltage: 400,
      phases: 3,
      poles: 4,
      efficiency: 85,
      powerFactor: 0.85,
      currentDensity: 4,
      serviceType: 'S1',
    });
    setResults(null);
    setProjectName('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          Calcul de Section de Fil
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Puissance moteur (kW)
            </label>
            <input
              type="number"
              step="0.1"
              value={inputs.power}
              onChange={(e) => setInputs({ ...inputs, power: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tension nominale (V)
            </label>
            <input
              type="number"
              value={inputs.voltage}
              onChange={(e) => setInputs({ ...inputs, voltage: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de phases
            </label>
            <select
              value={inputs.phases}
              onChange={(e) => setInputs({ ...inputs, phases: parseInt(e.target.value) as 1 | 3 })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>Monophasé (1)</option>
              <option value={3}>Triphasé (3)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de pôles
            </label>
            <select
              value={inputs.poles}
              onChange={(e) => setInputs({ ...inputs, poles: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={2}>2 pôles (3000 tr/min)</option>
              <option value={4}>4 pôles (1500 tr/min)</option>
              <option value={6}>6 pôles (1000 tr/min)</option>
              <option value={8}>8 pôles (750 tr/min)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rendement (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={inputs.efficiency}
              onChange={(e) => setInputs({ ...inputs, efficiency: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Facteur de puissance (cos φ)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              value={inputs.powerFactor}
              onChange={(e) => setInputs({ ...inputs, powerFactor: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Densité de courant (A/mm²)
            </label>
            <input
              type="number"
              step="0.1"
              value={inputs.currentDensity}
              onChange={(e) => setInputs({ ...inputs, currentDensity: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Recommandé: 3-5 A/mm²</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de service
            </label>
            <select
              value={inputs.serviceType}
              onChange={(e) => setInputs({ ...inputs, serviceType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="S1">S1 - Continu</option>
              <option value="S2">S2 - Temporaire</option>
              <option value="S3">S3 - Intermittent</option>
            </select>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={calculateWireSection}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Calculator className="w-5 h-5" />
            Calculer
          </button>
          <button
            onClick={resetForm}
            className="bg-gray-200 text-gray-700 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Réinitialiser
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Résultats</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Courant nominal</p>
              <p className="text-3xl font-bold text-blue-600">{results.nominalCurrent.toFixed(2)} A</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Section théorique</p>
              <p className="text-3xl font-bold text-blue-600">{results.theoreticalSection.toFixed(2)} mm²</p>
            </div>
          </div>

          {results.recommendedWires.length > 0 && (
            <div className="mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Fils normalisés recommandés</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">Diamètre (mm)</th>
                      <th className="px-4 py-2 text-left">Section (mm²)</th>
                      <th className="px-4 py-2 text-left">Résistance (Ω/m)</th>
                      <th className="px-4 py-2 text-left">Poids (g/m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.recommendedWires.map((wire) => (
                      <tr key={wire.id} className="border-t hover:bg-gray-50">
                        <td className="px-4 py-2">{wire.diameter_mm}</td>
                        <td className="px-4 py-2 font-semibold">{wire.section_mm2}</td>
                        <td className="px-4 py-2">{wire.resistance_per_m}</td>
                        <td className="px-4 py-2">{wire.weight_per_m}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du projet (pour sauvegarde)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ex: Moteur pompe 5.5kW"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                onClick={saveProject}
                disabled={!projectName || saving}
                className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center gap-2 disabled:bg-gray-400"
              >
                <Save className="w-5 h-5" />
                {saving ? 'Sauvegarde...' : 'Sauvegarder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
