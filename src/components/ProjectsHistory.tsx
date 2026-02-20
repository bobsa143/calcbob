import { useState, useEffect } from 'react';
import { History, Trash2, FileText } from 'lucide-react';
import { supabase, Project } from '../lib/supabase';

export default function ProjectsHistory() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    const { data } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const deleteProject = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) return;

    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
    if (selectedProject?.id === id) {
      setSelectedProject(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
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
          <History className="w-6 h-6 text-blue-600" />
          Historique des Projets
        </h2>

        {projects.length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            Aucun projet sauvegardé. Effectuez un calcul et sauvegardez-le pour le retrouver ici.
          </p>
        ) : (
          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setSelectedProject(project)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{project.name}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        {project.calculation_type === 'wire' ? 'Section de fil' : 'Nombre de spires'}
                      </span>
                      <span>{formatDate(project.created_at)}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteProject(project.id);
                    }}
                    className="text-red-600 hover:text-red-800 p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Détails du Projet</h3>

          <div className="mb-4">
            <p className="text-sm text-gray-600">Nom</p>
            <p className="font-semibold text-gray-800">{selectedProject.name}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">Type de calcul</p>
            <p className="font-semibold text-gray-800">
              {selectedProject.calculation_type === 'wire' ? 'Section de fil' : 'Nombre de spires'}
            </p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Paramètres d'entrée</p>
            <div className="bg-gray-50 rounded-lg p-4">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(selectedProject.input_parameters, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Résultats</p>
            <div className="bg-blue-50 rounded-lg p-4">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(selectedProject.results, null, 2)}
              </pre>
            </div>
          </div>

          {selectedProject.notes && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">Notes</p>
              <p className="text-gray-800">{selectedProject.notes}</p>
            </div>
          )}

          <div className="text-sm text-gray-500">
            Créé le {formatDate(selectedProject.created_at)}
          </div>
        </div>
      )}
    </div>
  );
}
