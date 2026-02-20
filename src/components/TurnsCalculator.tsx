import { useState, useEffect } from 'react';
import { Calculator, Save, RotateCcw } from 'lucide-react';
import { supabase, WindingFactor } from '../lib/supabase';

interface TurnsInputs {
  voltage: number;
  frequency: number;
  polePairs: number;
  coreSection: number;
  magneticInduction: number;
  windingType: string;
  slotsPerPolePerPhase: number;
}

interface TurnsResults {
  magneticFlux: number;
  windingCoefficient: number;
  turnsPerPhase: number;
  turnsPerSlot: number;
  windingPitch: number;
}

export default function TurnsCalculator() {
  const [windingFactors, setWindingFactors] = useState<WindingFactor[]>([]);
  const [inputs, setInputs] = useState<TurnsInputs>({
    voltage: 230,
    frequency: 50,
    polePairs: 2,
    coreSection: 50,
    magneticInduction: 1.2,
    windingType: 'Distribué 2/3',
    slotsPerPolePerPhase: 3,
  });

  const [results, setResults] = useState<TurnsResults | null>(null);
  const [projectName, setProjectName] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWindingFactors();
  }, []);

  const fetchWindingFactors = async () => {
    const { data } = await supabase
      .from('winding_factors')
      .select('*')
      .order('winding_type');

    if (data) {
      setWindingFactors(data);
    }
  };

  const calculateTurns = () => {
    const { voltage, frequency, coreSection, magneticInduction, windingType, slotsPerPolePerPhase, polePairs } = inputs;

    const coreSectionM2 = coreSection / 10000;
    const magneticFlux = magneticInduction * coreSectionM2;

    const selectedFactor = windingFactors.find(f => f.winding_type === windingType);
    const windingCoefficient = selectedFactor ? selectedFactor.coefficient : 0.92;

    const turnsPerPhase = voltage / (4.44 * frequency * magneticFlux * windingCoefficient);

    const totalSlots = polePairs * 2 * 3 * slotsPerPolePerPhase;
    const slotsPerPhase = totalSlots / 3;
    const turnsPerSlot = turnsPerPhase / slotsPerPhase;

    const totalPoles = polePairs * 2;
    const windingPitch = totalSlots / totalPoles;

    setResults({
      magneticFlux,
      windingCoefficient,
      turnsPerPhase: Math.round(turnsPerPhase),
      turnsPerSlot: Math.round(turnsPerSlot),
      windingPitch: Math.round(windingPitch),
    });
  };

  const saveProject = async () => {
    if (!projectName || !results) return;

    setSaving(true);
    try {
      await supabase.from('projects').insert({
        name: projectName,
        calculation_type: 'turns',
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
      voltage: 230,
      frequency: 50,
      polePairs: 2,
      coreSection: 50,
      magneticInduction: 1.2,
      windingType: 'Distribué 2/3',
      slotsPerPolePerPhase: 3,
    });
    setResults(null);
    setProjectName('');
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Calculator className="w-6 h-6 text-blue-600" />
          Calcul du Nombre de Spires
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tension par phase (V)
            </label>
            <input
              type="number"
              value={inputs.voltage}
              onChange={(e) => setInputs({ ...inputs, voltage: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Pour 400V triphasé: 230V par phase</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fréquence (Hz)
            </label>
            <input
              type="number"
              value={inputs.frequency}
              onChange={(e) => setInputs({ ...inputs, frequency: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre de paires de pôles
            </label>
            <select
              value={inputs.polePairs}
              onChange={(e) => setInputs({ ...inputs, polePairs: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={1}>1 paire (2 pôles - 3000 tr/min)</option>
              <option value={2}>2 paires (4 pôles - 1500 tr/min)</option>
              <option value={3}>3 paires (6 pôles - 1000 tr/min)</option>
              <option value={4}>4 paires (8 pôles - 750 tr/min)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Section du noyau magnétique (cm²)
            </label>
            <input
              type="number"
              step="0.1"
              value={inputs.coreSection}
              onChange={(e) => setInputs({ ...inputs, coreSection: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Induction magnétique (Tesla)
            </label>
            <input
              type="number"
              step="0.1"
              value={inputs.magneticInduction}
              onChange={(e) => setInputs({ ...inputs, magneticInduction: parseFloat(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Typique: 0.8-1.4 T</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type de bobinage
            </label>
            <select
              value={inputs.windingType}
              onChange={(e) => setInputs({ ...inputs, windingType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {windingFactors.map((factor) => (
                <option key={factor.id} value={factor.winding_type}>
                  {factor.winding_type} (kw = {factor.coefficient})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Encoches par pôle et par phase
            </label>
            <input
              type="number"
              min="1"
              value={inputs.slotsPerPolePerPhase}
              onChange={(e) => setInputs({ ...inputs, slotsPerPolePerPhase: parseInt(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Généralement: 2 à 4</p>
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            onClick={calculateTurns}
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Flux magnétique</p>
              <p className="text-2xl font-bold text-blue-600">{(results.magneticFlux * 1000).toFixed(2)} mWb</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Coefficient de bobinage</p>
              <p className="text-2xl font-bold text-blue-600">{results.windingCoefficient.toFixed(3)}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Spires par phase</p>
              <p className="text-2xl font-bold text-green-600">{results.turnsPerPhase}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Spires par encoche</p>
              <p className="text-2xl font-bold text-green-600">{results.turnsPerSlot}</p>
            </div>

            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Pas de bobinage</p>
              <p className="text-2xl font-bold text-green-600">{results.windingPitch}</p>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-2">Formule de Boucherot utilisée</h4>
            <p className="text-sm text-yellow-700">
              N = U / (4.44 × f × Φ × kw)
            </p>
            <p className="text-xs text-yellow-600 mt-2">
              Où N = nombre de spires, U = tension, f = fréquence, Φ = flux magnétique, kw = coefficient de bobinage
            </p>
          </div>

          <div className="border-t pt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom du projet (pour sauvegarde)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Ex: Rotor moteur 4 pôles"
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
