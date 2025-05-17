import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { it } from 'date-fns/locale';
import { Task } from '../../types';
import { useProjectStore, DEVELOPERS } from '../../store/projectStore';
import { TaskForm } from './TaskForm';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
}

export const TaskCard = ({ task, isDragging = false }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: 1,
  } : undefined;

  const getPriorityColor = () => {
    switch (task.priority) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };

  const getDeadlineStatus = () => {
    if (!task.deadline) return null;
    
    const deadlineDate = new Date(task.deadline);
    
    if (isPast(deadlineDate) && !isToday(deadlineDate)) {
      return {
        label: 'Scaduto',
        className: 'text-red-600 dark:text-red-400',
        icon: <AlertCircle className="h-3.5 w-3.5 mr-1" />
      };
    } else if (isToday(deadlineDate)) {
      return {
        label: 'Oggi',
        className: 'text-orange-600 dark:text-orange-400',
        icon: <Clock className="h-3.5 w-3.5 mr-1" />
      };
    } else if (isTomorrow(deadlineDate)) {
      return {
        label: 'Domani',
        className: 'text-yellow-600 dark:text-yellow-400',
        icon: <Calendar className="h-3.5 w-3.5 mr-1" />
      };
    }
    
    return {
      label: format(deadlineDate, 'd MMM', { locale: it }),
      className: 'text-slate-600 dark:text-slate-400',
      icon: <Calendar className="h-3.5 w-3.5 mr-1" />
    };
  };

  const deadlineStatus = getDeadlineStatus();

  return (
    <>
      <div 
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        style={style}
        className={cn(
          'bg-white dark:bg-slate-800 p-3 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm group cursor-grab hover:shadow-md transition-shadow',
          isDragging && 'shadow-md opacity-90',
          !isDragging && 'hover:shadow-md'
        )}
        onClick={() => setIsEditing(true)}
      >
        <div className="flex items-start justify-between">
          <h4 className="text-sm font-medium line-clamp-2">{task.title}</h4>
          <div className={`px-2 py-1 text-xs rounded-full ${getPriorityColor()} ml-2 whitespace-nowrap`}>
            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
          </div>
        </div>
        
        {task.description && (
          <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
            {task.description}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          {task.assignee && (
            <div className="flex items-center">
              {DEVELOPERS[task.assignee]?.avatar ? (
                <img 
                  src={DEVELOPERS[task.assignee].avatar} 
                  alt={DEVELOPERS[task.assignee].name}
                  className="h-6 w-6 rounded-full"
                />
              ) : (
                <div className="h-6 w-6 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                  {DEVELOPERS[task.assignee].name.charAt(0)}
                </div>
              )}
              <span className="ml-1.5 text-xs text-slate-600 dark:text-slate-400">
                {DEVELOPERS[task.assignee].name}
              </span>
            </div>
          )}

          {deadlineStatus && (
            <div className={`flex items-center text-xs ${deadlineStatus.className}`}>
              {deadlineStatus.icon}
              <span>{deadlineStatus.label}</span>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <TaskForm 
              task={task}
              projectId={task.projectId}
              columnId={task.columnId}
              onClose={() => setIsEditing(false)} 
            />
          </div>
        </div>
      )}
    </>
  );
};