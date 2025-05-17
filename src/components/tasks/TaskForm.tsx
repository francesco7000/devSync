import React from 'react';
import { useForm } from 'react-hook-form';
import { format } from 'date-fns';
import { X, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { useProjectStore, DEVELOPERS } from '../../store/projectStore';
import { Task, Priority } from '../../types';

interface TaskFormProps {
  task?: Task;
  projectId: string;
  columnId: string;
  onClose: () => void;
}

interface TaskFormData {
  title: string;
  description: string;
  assignee: string;
  priority: Priority;
  deadline: string;
}

export const TaskForm = ({ task, projectId, columnId, onClose }: TaskFormProps) => {
  const { createTask, updateTask, deleteTask } = useProjectStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TaskFormData>({
    defaultValues: task
      ? {
          title: task.title,
          description: task.description || '',
          assignee: task.assignee || '',
          priority: task.priority,
          deadline: task.deadline 
            ? format(new Date(task.deadline), 'yyyy-MM-dd')
            : '',
        }
      : {
          title: '',
          description: '',
          assignee: '',
          priority: 'medium',
          deadline: '',
        },
  });

  const onSubmit = async (data: TaskFormData) => {
    try {
      if (task) {
        updateTask(task.id, {
          ...data,
          deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        });
      } else {
        createTask({
          projectId,
          columnId,
          title: data.title,
          description: data.description || null,
          assignee: data.assignee || null,
          priority: data.priority,
          deadline: data.deadline ? new Date(data.deadline).toISOString() : null,
        });
      }
      onClose();
    } catch (error) {
      console.error('Failed to save task:', error);
    }
  };

  const handleDelete = () => {
    if (task && window.confirm('Sei sicuro di voler eliminare questo task?')) {
      deleteTask(task.id);
      onClose();
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
        <label htmlFor="title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Titolo
        </label>
        <input
          id="title"
          {...register('title', { required: 'Il titolo è obbligatorio' })}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Descrizione
        </label>
        <textarea
          id="description"
          {...register('description')}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white min-h-[80px]"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="assignee" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Assegna a
          </label>
          <select
            id="assignee"
            {...register('assignee')}
            className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          >
            <option value="">Non assegnato</option>
            {Object.entries(DEVELOPERS).map(([id, { name }]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            Priorità
          </label>
          <select
            id="priority"
            {...register('priority')}
            className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
          >
            <option value="low">Bassa</option>
            <option value="medium">Media</option>
            <option value="high">Alta</option>
            <option value="urgent">Urgente</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="deadline" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
          Scadenza
        </label>
        <input
          type="date"
          id="deadline"
          {...register('deadline')}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
        />
      </div>

      <div className="flex justify-between pt-4">
        {task ? (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={handleDelete}
          >
            Elimina
          </Button>
        ) : (
          <div></div>
        )}

        <div className="flex space-x-3">
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
            {task ? 'Aggiorna' : 'Crea'} Task
          </Button>
        </div>
      </div>
    </form>
  );
};