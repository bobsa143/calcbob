import { AlertTriangle } from 'lucide-react';

export default function SafetyWarning() {
  return (
    <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400 rounded-lg p-6 shadow-lg">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <AlertTriangle className="w-10 h-10 text-yellow-600" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="w-6 h-6 text-yellow-600" />
            AVERTISSEMENT PROFESSIONNEL
          </h3>

          <div className="bg-white rounded-lg p-4 mb-4">
            <p className="text-sm font-semibold text-gray-800 mb-3">
              Ces calculs sont fournis à titre INDICATIF uniquement.
            </p>
            <p className="text-sm text-gray-700 mb-3">
              Un rebobinage de moteur électrique DOIT impérativement être :
            </p>

            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Validé par des mesures sur place (relevé des spires existantes, diamètre de fil)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Testé à vide avant mise en charge</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Contrôlé en température (échauffement)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Vérifié pour l'isolation électrique (mégohmmètre)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Conforme aux normes en vigueur (NF, CEI)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-600 font-bold mt-0.5">✓</span>
                <span>Réalisé par un professionnel qualifié</span>
              </li>
            </ul>
          </div>

          <div className="bg-red-50 border-l-4 border-red-600 rounded p-4">
            <p className="text-sm font-bold text-red-900 mb-2">
              RISQUES MAJEURS
            </p>
            <p className="text-sm text-red-800">
              La mise en service d'un moteur mal rebobiné présente des risques graves :
              incendie, électrocution, dommages matériels et corporels.
            </p>
            <p className="text-sm text-red-800 font-semibold mt-2">
              L'utilisateur est seul responsable de la mise en œuvre.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
