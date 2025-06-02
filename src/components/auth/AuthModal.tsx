import React, { useState } from 'react';
import { X } from 'lucide-react';
import SignInForm from './SignInForm';
import SignUpForm from './SignUpForm';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'signIn' | 'signUp';
}

const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = 'signIn'
}) => {
  const [view, setView] = useState<'signIn' | 'signUp'>(initialView);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-card rounded-lg w-full max-w-md p-6 shadow-xl">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-text-secondary hover:text-text-primary"
        >
          <X className="h-5 w-5" />
        </button>

        {view === 'signIn' ? (
          <SignInForm onSwitchView={() => setView('signUp')} />
        ) : (
          <SignUpForm onSwitchView={() => setView('signIn')} />
        )}
      </div>
    </div>
  );
};

export default AuthModal;