import React from 'react';
import Layout from '../Layout/Layout';
import { AlertCircle } from 'lucide-react';

const ErrorState = ({ role = 'admin', message = 'Something went wrong' }) => (
  <Layout role={role}>
    <div className="flex items-center justify-center h-96">
      <div className="flex flex-col items-center gap-3 text-center max-w-sm">
        <AlertCircle className="w-10 h-10 text-danger dark:text-danger-dark" />
        <p className="font-semibold text-text-primary dark:text-text-primary-dark">
          Something went wrong
        </p>
        <p className="text-sm text-text-muted dark:text-text-muted-dark">{message}</p>
      </div>
    </div>
  </Layout>
);

export default ErrorState;
