// app/not-found.tsx
export default function NotFound() {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-lg font-bold mb-2">Page not found</h2>
          <a href="/" className="text-sm text-indigo-600 hover:underline">
            Go home
          </a>
        </div>
      </div>
    );
  }