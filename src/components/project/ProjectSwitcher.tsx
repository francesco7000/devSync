import React, { useState } from 'react';
import { ChevronDown, Plus, FolderPlus } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { Button } from '../ui/Button';
import { ProjectForm } from './ProjectForm';

export const ProjectSwitcher = () => {
  const { projects, activeProject, setActiveProject } = useProjectStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleForm = () => setIsFormOpen(!isFormOpen);

  const handleSelectProject = (projectId: string) => {
    setActiveProject(projectId);
    setIsDropdownOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center h-9 px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="mr-1">{activeProject?.name || 'Seleziona Progetto'}</span>
        <ChevronDown className="h-4 w-4" />
      </button>

      {isDropdownOpen && (
        <div className="absolute left-0 top-full mt-1 w-64 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-50">
          <div className="p-2">
            {projects.length > 0 ? (
              <div className="max-h-60 overflow-y-auto">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleSelectProject(project.id)}
                    className={`w-full text-left px-3 py-2 text-sm rounded-md flex items-center ${
                      activeProject?.id === project.id
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-slate-500 dark:text-slate-400">
                Nessun progetto disponibile
              </div>
            )}
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              leftIcon={<FolderPlus className="h-4 w-4" />}
              onClick={toggleForm}
            >
              Nuovo Progetto
            </Button>
          </div>
        </div>
      )}

      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <h2 className="text-xl font-semibold mb-4">Nuovo Progetto</h2>
            <ProjectForm onClose={toggleForm} />
          </div>
        </div>
      )}
    </div>
  );
};