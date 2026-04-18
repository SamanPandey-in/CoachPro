import React from 'react';
import Card from './Card';

const StatCard = ({ icon: Icon, label, value, change, trend = 'up' }) => {
  const isPositive = trend === 'up';

  return (
    <Card>
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-text-muted dark:text-text-muted-dark mb-1 truncate">
            {label}
          </p>
          <p className="text-2xl font-bold text-text-primary dark:text-text-primary-dark mb-2">
            {value}
          </p>
          {change && (
            <p
              className={`text-xs font-medium ${
                isPositive
                  ? 'text-success dark:text-success-dark'
                  : 'text-danger dark:text-danger-dark'
              }`}
            >
              {change}
            </p>
          )}
        </div>
        <div className="bg-brand-muted dark:bg-brand-muted-dark p-2.5 rounded-xl flex-shrink-0 ml-4">
          <Icon className="w-5 h-5 text-brand dark:text-brand-light" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
