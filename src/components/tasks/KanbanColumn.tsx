import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task, Column as ColumnType } from '../../types';
import { TaskCard } from './TaskCard';
import { MoreVertical, Plus, Trash2, Edit2 } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { Button } from '../ui/Button';
import { TaskForm } from './TaskForm';

interface KanbanColumnProps {
  column: ColumnType;
  tasks: Task[];
}

export const KanbanColumn = ({ column, tasks }: KanbanColumnProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(column.name);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  
  const { updateColumn, deleteColumn } = useProjectStore();
  
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });
  
  const handleEditClick = () => {
    setIsEditing(true);
    setIsMenuOpen(false);
  };
  
  const handleSaveEdit = () => {
    if (newName.trim()) {
      updateColumn(column.id, newName);
      setIsEditing(false);
    }
  };
  
  const handleDeleteClick = () => {
    deleteColumn(column.id);
    setIsMenuOpen(false);
  };

  const getColumnHeaderColor = () => {
    // Define column header colors based on column name
    switch (column.name.toLowerCase()) {
      case 'da fare':
      case 'to do':
        return 'bg-blue-100 dark:bg-blue-900/20 border-blue-300 dark:border-blue-800';
      case 'in corso':
      case 'in progress':
        return 'bg-yellow-100 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800';
      case 'completato':
      case 'done':
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-800';
      case 'problema':
      case 'issue':
      case 'blocked':
        return 'bg-red-100 dark:bg-red-900/20 border-red-300 dark:border-red-800';
      case 'in revisione':
      case 'review':
        return 'bg-purple-100 dark:bg-purple-900/20 border-purple-300 dark:border-purple-800';
      default:
        return 'bg-slate-100 dark:bg-slate-700/50 border-slate-300 dark:border-slate-600';
    }
  };

  return (
    <div 
      className={`flex-shrink-0 w-[280px] h-full rounded-md border ${
        isOver ? 'border-blue-400 dark:border-blue-500 bg-blue-50 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
      } flex flex-col overflow-hidden shadow-sm transition-colors duration-200`}
    >
      {/* Column Header */}
      <div className={`p-3 ${getColumnHeaderColor()} border-b flex items-center justify-between`}>
        {isEditing ? (
          <div className="flex items-center w-full">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 py-1 px-2 border rounded text-sm"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
              onBlur={handleSaveEdit}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-1 h-7 w-7"
              onClick={handleSaveEdit}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            <h3 className="font-medium text-sm">{column.name}</h3>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              {isMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-40 rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg z-10">
                  <button
                    onClick={handleEditClick}
                    className="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-slate-100 dark:hover:bg-slate-700"
                  >
                    <Edit2 className="h-4 w-4 mr-2" />
                    Rinomina
                  </button>
                  <button
                    onClick={handleDeleteClick}
                    className="flex items-center w-full px-3 py-2 text-sm text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Elimina
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Column Content */}
      <div 
        ref={setNodeRef}
        className="flex-1 overflow-y-auto p-2 space-y-2 min-h-[200px]"
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      {/* Column Footer */}
      <div className="p-2 border-t border-slate-200 dark:border-slate-700">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsTaskFormOpen(true)}
        >
          Aggiungi Task
        </Button>
      </div>

      {isTaskFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <TaskForm 
              projectId={column.projectId}
              columnId={column.id}
              onClose={() => setIsTaskFormOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};