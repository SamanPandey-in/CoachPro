import React from 'react';
import Layout from '../Layout/Layout';

const LoadingState = ({ role }) => (
  <Layout role={role}>
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-brand dark:border-brand-light border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-text-muted dark:text-text-muted-dark">Loading…</p>
      </div>
    </div>
  </Layout>
);

export default LoadingState;
