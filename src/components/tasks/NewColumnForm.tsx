import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useProjectStore } from '../../store/projectStore';

interface NewColumnFormProps {
  projectId: string;
  onClose: () => void;
}

interface ColumnFormData {
  name: string;
}

export const NewColumnForm = ({ projectId, onClose }: NewColumnFormProps) => {
  const { createColumn } = useProjectStore();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ColumnFormData>({
    defaultValues: {
      name: '',
    }
  });

  const onSubmit = async (data: ColumnFormData) => {
    try {
      createColumn(projectId, data.name);
      onClose();
    } catch (error) {
      console.error('Failed to create column:', error);
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
          Nome Colonna
        </label>
        <input
          id="name"
          {...register('name', { required: 'Il nome è obbligatorio' })}
          className="w-full rounded-md border border-slate-300 dark:border-slate-600 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700 dark:text-white"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
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
          Crea Colonna
        </Button>
      </div>
    </form>
  );
};