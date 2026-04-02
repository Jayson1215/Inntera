import { Link, useRouteError } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';

export function ErrorPage() {
  const error = useRouteError() as any;
  console.error(error);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans text-[#1e293b]">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border-2 border-slate-100 p-12 text-center transform transition-all hover:scale-[1.01]">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-pulse">
          <AlertTriangle className="w-12 h-12 text-red-500" />
        </div>
        
        <h1 className="text-4xl font-black mb-4 tracking-tighter text-slate-900 italic uppercase">
          Oops! Something went wrong
        </h1>
        
        <p className="text-slate-500 font-medium mb-8 leading-relaxed">
          {error?.statusText || error?.message || "We encountered an unexpected error. Don't worry, even the best travelers get lost sometimes."}
        </p>

        <div className="flex flex-col gap-3">
          <Button 
            onClick={() => window.location.reload()}
            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            TRY AGAIN
          </Button>
          
          <Link to="/">
            <Button 
              variant="outline"
              className="w-full h-14 border-2 border-slate-100 hover:bg-slate-50 text-slate-600 font-black rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              BACK TO HOME
            </Button>
          </Link>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
            Error ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}
          </p>
        </div>
      </div>
    </div>
  );
}
