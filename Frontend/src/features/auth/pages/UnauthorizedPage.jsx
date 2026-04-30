import { Link } from 'react-router-dom';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl border border-surface-200 shadow-sm p-8 text-center">
        <h1 className="text-2xl font-semibold text-surface-900">Unauthorized</h1>
        <p className="text-sm text-surface-500 mt-2">You do not have permission to access this page.</p>
        <Link to="/" className="inline-flex mt-6 btn-primary">
          Go home
        </Link>
      </div>
    </div>
  );
}