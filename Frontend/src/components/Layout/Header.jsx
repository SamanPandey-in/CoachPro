import React from 'react';
import { Bell } from 'lucide-react';

const Header = ({ user }) => {
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

  return (
    <header className="bg-surface dark:bg-surface-dark border-b border-border dark:border-border-dark px-6 py-3.5 sticky top-0 z-40">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text-primary dark:text-text-primary-dark">
            {user?.name}
          </p>
          <p className="text-xs text-text-muted dark:text-text-muted-dark capitalize">
            {user?.role}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-lg text-text-muted dark:text-text-muted-dark hover:bg-border dark:hover:bg-border-dark transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-brand rounded-full" />
          </button>

          <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
            {initial}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
