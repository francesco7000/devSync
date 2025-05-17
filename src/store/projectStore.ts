import { create } from 'zustand';
import { v4 as uuid } from 'uuid';
import { Project, Column, Task } from '../types';

// Mock developers (would come from auth in real app)
export const DEVELOPERS: { [key: string]: { name: string, avatar?: string } } = {
  'dev1': { 
    name: 'Sviluppatore 1',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150'
  },
  'dev2': { 
    name: 'Sviluppatore 2',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150'
  }
};

// Mock data for initial state
const mockProjects: Project[] = [
  {
    id: 'project-1',
    name: 'Redesign Sito Web',
    description: 'Aggiornare il sito web dell\'azienda con un nuovo design e funzionalità',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const mockColumns: Column[] = [
  { id: 'column-1', projectId: 'project-1', name: 'Da Fare', order: 0 },
  { id: 'column-2', projectId: 'project-1', name: 'In Corso', order: 1 },
  { id: 'column-3', projectId: 'project-1', name: 'In Revisione', order: 2 },
  { id: 'column-4', projectId: 'project-1', name: 'Completato', order: 3 },
  { id: 'column-5', projectId: 'project-1', name: 'Problema', order: 4 },
];

const mockTasks: Task[] = [
  {
    id: 'task-1',
    projectId: 'project-1',
    columnId: 'column-1',
    title: 'Progettare mockup homepage',
    description: 'Creare mockup per la nuova homepage con Figma',
    assignee: 'dev1',
    priority: 'high',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-2',
    projectId: 'project-1',
    columnId: 'column-2',
    title: 'Sviluppare componenti React',
    description: 'Implementare i componenti React per la navigazione',
    assignee: 'dev2',
    priority: 'medium',
    deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    projectId: 'project-1',
    columnId: 'column-3',
    title: 'Ottimizzare performance',
    description: 'Migliorare i tempi di caricamento e l\'esperienza utente',
    assignee: 'dev1',
    priority: 'low',
    deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    projectId: 'project-1',
    columnId: 'column-4',
    title: 'Setup ambiente di sviluppo',
    description: 'Configurare gli strumenti e le dipendenze del progetto',
    assignee: 'dev2',
    priority: 'high',
    deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-5',
    projectId: 'project-1',
    columnId: 'column-5',
    title: 'Bug nelle animazioni',
    description: 'Risolvere problema con le animazioni CSS su Safari',
    assignee: 'dev1',
    priority: 'urgent',
    deadline: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

interface ProjectState {
  projects: Project[];
  columns: Column[];
  tasks: Task[];
  activeProject: Project | null;
  loading: boolean;
  error: string | null;
  
  // Project actions
  setActiveProject: (projectId: string) => void;
  createProject: (project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProject: (projectId: string, update: Partial<Omit<Project, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteProject: (projectId: string) => void;
  
  // Column actions
  createColumn: (projectId: string, name: string) => void;
  updateColumn: (columnId: string, name: string) => void;
  deleteColumn: (columnId: string) => void;
  reorderColumns: (projectId: string, columnIds: string[]) => void;
  
  // Task actions
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateTask: (taskId: string, update: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (taskId: string, destinationColumnId: string) => void;
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: mockProjects,
  columns: mockColumns,
  tasks: mockTasks,
  activeProject: mockProjects[0],
  loading: false,
  error: null,

  // Project actions
  setActiveProject: (projectId) => {
    const project = get().projects.find(p => p.id === projectId) || null;
    set({ activeProject: project });
  },

  createProject: (project) => {
    const newProject: Project = {
      ...project,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create default columns for the new project
    const defaultColumns: Column[] = [
      { id: uuid(), projectId: newProject.id, name: 'Da Fare', order: 0 },
      { id: uuid(), projectId: newProject.id, name: 'In Corso', order: 1 },
      { id: uuid(), projectId: newProject.id, name: 'Completato', order: 2 },
    ];

    set((state) => ({
      projects: [...state.projects, newProject],
      columns: [...state.columns, ...defaultColumns],
      activeProject: newProject,
    }));
  },

  updateProject: (projectId, update) => {
    set((state) => ({
      projects: state.projects.map((project) =>
        project.id === projectId
          ? { ...project, ...update, updatedAt: new Date().toISOString() }
          : project
      ),
      activeProject:
        state.activeProject?.id === projectId
          ? { ...state.activeProject, ...update, updatedAt: new Date().toISOString() }
          : state.activeProject,
    }));
  },

  deleteProject: (projectId) => {
    set((state) => ({
      projects: state.projects.filter((project) => project.id !== projectId),
      columns: state.columns.filter((column) => column.projectId !== projectId),
      tasks: state.tasks.filter((task) => task.projectId !== projectId),
      activeProject: state.activeProject?.id === projectId ? null : state.activeProject,
    }));
  },

  // Column actions
  createColumn: (projectId, name) => {
    const projectColumns = get().columns.filter(c => c.projectId === projectId);
    const newOrder = projectColumns.length > 0 ? 
      Math.max(...projectColumns.map(c => c.order)) + 1 : 0;

    const newColumn: Column = {
      id: uuid(),
      projectId,
      name,
      order: newOrder,
    };

    set((state) => ({
      columns: [...state.columns, newColumn],
    }));
  },

  updateColumn: (columnId, name) => {
    set((state) => ({
      columns: state.columns.map((column) =>
        column.id === columnId ? { ...column, name } : column
      ),
    }));
  },

  deleteColumn: (columnId) => {
    // First, check if there are any tasks in this column
    const hasTasks = get().tasks.some((task) => task.columnId === columnId);
    
    // Don't allow deletion if there are tasks
    if (hasTasks) {
      set({ error: 'Cannot delete a column that contains tasks. Move or delete the tasks first.' });
      return;
    }

    set((state) => ({
      columns: state.columns.filter((column) => column.id !== columnId),
      error: null,
    }));
  },

  reorderColumns: (projectId, columnIds) => {
    set((state) => ({
      columns: state.columns.map((column) => {
        if (column.projectId !== projectId) return column;
        const newOrder = columnIds.indexOf(column.id);
        return newOrder !== -1 ? { ...column, order: newOrder } : column;
      }),
    }));
  },

  // Task actions
  createTask: (task) => {
    const newTask: Task = {
      ...task,
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    set((state) => ({
      tasks: [...state.tasks, newTask],
    }));
  },

  updateTask: (taskId, update) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, ...update, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },

  deleteTask: (taskId) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
    }));
  },

  moveTask: (taskId, destinationColumnId) => {
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId
          ? { ...task, columnId: destinationColumnId, updatedAt: new Date().toISOString() }
          : task
      ),
    }));
  },
}));