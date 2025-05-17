export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          description?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          description?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      columns: {
        Row: {
          id: string
          project_id: string
          name: string
          order: number
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          name: string
          order: number
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          name?: string
          order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "columns_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          project_id: string
          column_id: string
          title: string
          description: string | null
          assignee: string | null
          priority: 'low' | 'medium' | 'high' | 'urgent'
          deadline: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          column_id: string
          title: string
          description?: string | null
          assignee?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          column_id?: string
          title?: string
          description?: string | null
          assignee?: string | null
          priority?: 'low' | 'medium' | 'high' | 'urgent'
          deadline?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_project_id_fkey"
            columns: ["project_id"]
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_column_id_fkey"
            columns: ["column_id"]
            referencedRelation: "columns"
            referencedColumns: ["id"]
          }
        ]
      }
    }
  }
}