import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../../lib/supabase';

export const AuthForm = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md bg-surface p-8 rounded-lg shadow-sm border border-border">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">DevSync</h1>
          <p className="text-gray-600">Accedi per continuare</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0ea5e9',
                  brandAccent: '#0284c7',
                },
              },
            },
          }}
          providers={[]}
          localization={{
            variables: {
              sign_in: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Accedi',
                loading_button_label: 'Accesso in corso...',
              },
              sign_up: {
                email_label: 'Email',
                password_label: 'Password',
                button_label: 'Registrati',
                loading_button_label: 'Registrazione in corso...',
              },
            },
          }}
        />
      </div>
    </div>
  );
};