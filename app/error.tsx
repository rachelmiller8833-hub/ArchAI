// app/error.tsx
'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <h2 className="text-lg font-bold mb-2">Something went wrong</h2>
        <p className="text-sm text-slate-500 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm"
        >
          Try again
        </button>
      </div>
    </div>
  );
}