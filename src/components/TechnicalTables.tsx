import { useState, useEffect } from 'react';
import { BookOpen, Zap } from 'lucide-react';
import { supabase, WireSpecification, WindingFactor } from '../lib/supabase';

export default function TechnicalTables() {
  const [wires, setWires] = useState<WireSpecification[]>([]);
  const [windingFactors, setWindingFactors] = useState<WindingFactor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const [wiresResponse, factorsResponse] = await Promise.all([
      supabase.from('wire_specifications').select('*').order('diameter_mm'),
      supabase.from('winding_factors').select('*').order('winding_type'),
    ]);

    if (wiresResponse.data) setWires(wiresResponse.data);
    if (factorsResponse.data) setWindingFactors(factorsResponse.data);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <BookOpen className="w-6 h-6 text-blue-600" />
          Tables Techniques
        </h2>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-yellow-600" />
            Fils de Cuivre Émaillés Normalisés
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Diamètre (mm)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Section (mm²)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Résistance (Ω/m)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Poids (g/m)</th>
                </tr>
              </thead>
              <tbody>
                {wires.map((wire, index) => (
                  <tr
                    key={wire.id}
                    className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800">{wire.diameter_mm}</td>
                    <td className="px-4 py-3 text-gray-700">{wire.section_mm2}</td>
                    <td className="px-4 py-3 text-gray-700">{wire.resistance_per_m}</td>
                    <td className="px-4 py-3 text-gray-700">{wire.weight_per_m}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Coefficients de Bobinage (kw)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Type de bobinage</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Coefficient (kw)</th>
                  <th className="px-4 py-3 text-left font-semibold text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody>
                {windingFactors.map((factor, index) => (
                  <tr
                    key={factor.id}
                    className={`border-t ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}
                  >
                    <td className="px-4 py-3 font-semibold text-gray-800">{factor.winding_type}</td>
                    <td className="px-4 py-3 text-blue-600 font-semibold">{factor.coefficient}</td>
                    <td className="px-4 py-3 text-gray-600">{factor.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Valeurs Typiques</h3>

          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Densité de courant recommandée</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Refroidissement naturel (S1): 3-4 A/mm²</li>
                <li>• Ventilation forcée: 4-5 A/mm²</li>
                <li>• Service intermittent (S2-S3): 5-6 A/mm²</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Induction magnétique typique</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Moteurs asynchrones: 0.8-1.2 T</li>
                <li>• Moteurs synchrones: 1.0-1.4 T</li>
                <li>• Électrofreins: 0.6-0.9 T</li>
                <li>• Électro-aimants: 1.2-1.6 T</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Rendement typique selon puissance</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Moteurs &lt; 1 kW: 70-80%</li>
                <li>• Moteurs 1-10 kW: 80-88%</li>
                <li>• Moteurs &gt; 10 kW: 88-93%</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-700 mb-2">Facteur de puissance typique</h4>
              <ul className="text-sm text-gray-600 space-y-1 ml-4">
                <li>• Moteurs 2 pôles: 0.80-0.85</li>
                <li>• Moteurs 4 pôles: 0.85-0.90</li>
                <li>• Moteurs 6-8 pôles: 0.75-0.85</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
