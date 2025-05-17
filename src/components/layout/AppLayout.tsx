import React, { useState } from 'react';
import { Menu, X, LayoutGrid, CheckSquare, Settings, ChevronDown, Plus } from 'lucide-react';
import { cn } from '../../utils/cn';
import { useProjectStore } from '../../store/projectStore';
import { ProjectSwitcher } from '../project/ProjectSwitcher';
import { Button } from '../ui/Button';

interface AppLayoutProps {
  children: React.ReactNode;
}

export const AppLayout = ({ children }: AppLayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeProject } = useProjectStore();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex flex-col">
      {/* App Header */}
      <header className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 h-14 flex items-center px-4 sticky top-0 z-30">
        <button 
          onClick={toggleSidebar}
          className="mr-2 md:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <div className="flex items-center space-x-2 flex-shrink-0">
          <LayoutGrid className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold">DevSync</span>
        </div>

        <div className="ml-6 flex-1 hidden md:flex">
          <ProjectSwitcher />
        </div>

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="primary" size="sm" leftIcon={<Plus className="h-3 w-3" />}>
            Nuovo Task
          </Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <aside className={cn(
          "bg-white dark:bg-slate-800 w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-700 flex flex-col",
          "fixed inset-y-0 pt-14 z-20 transition-transform duration-300 md:translate-x-0 md:static md:z-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="p-4 flex justify-between items-center md:hidden">
            <h2 className="font-semibold">Menu</h2>
            <button onClick={toggleSidebar} aria-label="Close sidebar">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="px-3 py-2 md:hidden">
            <ProjectSwitcher />
          </div>
          
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            <div className="px-2 mb-2">
              <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                Navigazione
              </h3>
            </div>
            <a 
              href="#" 
              className="flex items-center px-3 py-2 text-sm rounded-md bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-slate-100 font-medium"
            >
              <CheckSquare className="h-4 w-4 mr-3 text-slate-500 dark:text-slate-400" />
              Board
            </a>
            <a 
              href="#" 
              className="flex items-center px-3 py-2 text-sm rounded-md text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <Settings className="h-4 w-4 mr-3 text-slate-500 dark:text-slate-400" />
              Impostazioni
            </a>
          </nav>

          {activeProject && (
            <div className="p-4 border-t border-slate-200 dark:border-slate-700">
              <div className="flex justify-between items-center">
                <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 font-semibold">
                  Progetto Attuale
                </h3>
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </div>
              <div className="mt-2">
                <div className="text-sm font-medium">{activeProject.name}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {activeProject.description || 'Nessuna descrizione'}
                </div>
              </div>
            </div>
          )}
        </aside>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          {isSidebarOpen && (
            <div 
              className="fixed inset-0 bg-black/20 z-10 md:hidden"
              onClick={toggleSidebar}
              aria-hidden="true"
            />
          )}
          <main className="p-4 md:p-6 max-w-7xl mx-auto">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};