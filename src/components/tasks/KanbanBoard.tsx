import React, { useState } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverEvent, 
  DragOverlay,
  DragStartEvent, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors 
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useProjectStore } from '../../store/projectStore';
import { KanbanColumn } from './KanbanColumn';
import { TaskCard } from './TaskCard';
import { Button } from '../ui/Button';
import { Task } from '../../types';
import { Plus } from 'lucide-react';
import { NewColumnForm } from './NewColumnForm';

export const KanbanBoard = () => {
  const { activeProject, columns, tasks, moveTask } = useProjectStore();
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isNewColumnFormOpen, setIsNewColumnFormOpen] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const projectColumns = columns
    .filter(column => column.projectId === activeProject?.id)
    .sort((a, b) => a.order - b.order);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const taskId = active.id.toString();
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;
    
    const activeId = active.id;
    const overId = over.id;
    
    // Return if task is dragged over itself
    if (activeId === overId) return;
    
    // Check if the task is being dragged over a column
    if (overId.toString().includes('column-')) {
      const taskId = activeId.toString();
      const destinationColumnId = overId.toString();
      
      const task = tasks.find(t => t.id === taskId);
      if (task && task.columnId !== destinationColumnId) {
        moveTask(taskId, destinationColumnId);
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }
    
    const activeId = active.id.toString();
    const overId = over.id.toString();
    
    if (activeId !== overId) {
      if (overId.includes('column-')) {
        moveTask(activeId, overId);
      }
    }
    
    setActiveTask(null);
  };

  if (!activeProject) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-slate-500 dark:text-slate-400 mb-4">Nessun progetto selezionato</p>
        <Button variant="primary" size="sm" leftIcon={<Plus className="h-4 w-4" />}>
          Crea Nuovo Progetto
        </Button>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{activeProject.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {activeProject.description || 'Nessuna descrizione'}
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => setIsNewColumnFormOpen(true)}
        >
          Aggiungi Colonna
        </Button>
      </div>

      <div className="overflow-x-auto pb-4">
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex space-x-4">
            {projectColumns.map((column) => (
              <KanbanColumn 
                key={column.id} 
                column={column} 
                tasks={tasks.filter(task => task.columnId === column.id)}
              />
            ))}
          </div>

          <DragOverlay>
            {activeTask && (
              <div className="w-[280px]">
                <TaskCard task={activeTask} isDragging />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {isNewColumnFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-md p-6">
            <NewColumnForm 
              projectId={activeProject.id}
              onClose={() => setIsNewColumnFormOpen(false)} 
            />
          </div>
        </div>
      )}
    </div>
  );
};