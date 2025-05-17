import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { useProjectStore } from '../../store/projectStore';
import { X } from 'lucide-react';

interface ProjectFormProps {
  onClose: () => void;
  projectId?: string;
}

interface ProjectFormData {
  name: string;
  description: string;
}

export const ProjectForm = ({ onClose, projectId }: ProjectFormProps) => {
  const { projects, createProject, updateProject } = useProjectStore();
  
  const existingProject = projectId 
    ? projects.find(p => p.id === projectId) 
    : null;
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectFormData>({
    defaultValues: {
      name: existingProject?.name || '',
      description: existingProject?.description || '',
    }
  });

  const onSubmit = async (data: ProjectFormData) => {
    try {
      if (existingProject) {
        updateProject(existingProject.id, data);
      } else {
        createProject(data);
      }
      onClose();
    } catch (error) {
      console.error('Failed to save project:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300"
      >
        <X className="h-5 w-5" />
      </button>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Nome Progetto
        </label>
        <input
          id="name"
          {...register('name', { required: 'Il nome è obbligatorio' })}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Descrizione
        </label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white min-h-[100px]"
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
        >
          Annulla
        </Button>
        <Button
          type="submit"
          isLoading={isSubmitting}
        >
          {existingProject ? 'Aggiorna' : 'Crea'} Progetto
        </Button>
      </div>
    </form>
  );
};