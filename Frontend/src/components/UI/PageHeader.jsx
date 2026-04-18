import React from 'react';

const PageHeader = ({ title, subtitle, action }) => (
  <div className="flex items-start justify-between mb-6">
    <div>
      <h1 className="text-2xl font-bold text-text-primary dark:text-text-primary-dark">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-text-muted dark:text-text-muted-dark mt-0.5">
          {subtitle}
        </p>
      )}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export default PageHeader;
