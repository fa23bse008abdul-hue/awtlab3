import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  Play, 
  Code, 
  Terminal, 
  Copy,
  Check
} from 'lucide-react';

export const ErrorMatrix: React.FC = () => {
  const [activeTest, setActiveTest] = useState<string>('400');
  const [response, setResponse] = useState<any>(null);
  const [status, setStatus] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const runTest = async (testType: string) => {
    setActiveTest(testType);
    setLoading(true);
    setResponse(null);

    try {
      if (testType === '400') {
        // Trigger 400 validation error
        const res = await fetch('/api/v1/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: "X",
            price: -50,
            category: ""
          })
        });
        const data = await res.json();
        setStatus(res.status);
        setResponse(data);
      } else if (testType === '404') {
        // Trigger 404
        const res = await fetch('/api/v1/products/prod-missing-999');
        const data = await res.json();
        setStatus(res.status);
        setResponse(data);
      } else if (testType === '201') {
        // Trigger 201 Created
        const res = await fetch('/api/v1/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: `Bazaar Verified Basmati Rice ${Date.now().toString().slice(-4)}`,
            price: 2400,
            category: "Groceries",
            stock: 80
          })
        });
        const data = await res.json();
        setStatus(res.status);
        setResponse(data);
      } else if (testType === 'legacy_crash') {
        // Trigger simulated 500 crash caught by standardized middleware
        const res = await fetch('/api/v1/legacy/simulateCrash');
        const data = await res.json();
        setStatus(res.status);
        setResponse(data);
      }
    } catch (err: any) {
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!response) return;
    navigator.clipboard.writeText(JSON.stringify(response, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
                Module 2 Core Pillar
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Standardized Error Handling & HTTP Status Code Matrix
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Clean demarcation between Client Errors (4xx) and Server Errors (5xx). 
              Every error strictly adheres to the enterprise JSON envelope containing <code>code</code>, <code>error_code</code>, <code>message</code>, and <code>timestamp</code>, stopping raw 500 crash cascades in mobile apps.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Scenario Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 400 Bad Request */}
        <button
          onClick={() => runTest('400')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTest === '400'
              ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/40 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-amber-100 text-amber-800">
              400 Bad Request
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-600" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Validation Failure</h4>
          <p className="text-[11px] text-slate-500 mt-1">
            Missing title or price &lt;= 0. Returns granular array of field issues.
          </p>
        </button>

        {/* 404 Not Found */}
        <button
          onClick={() => runTest('404')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTest === '404'
              ? 'bg-rose-50/80 border-rose-300 ring-2 ring-rose-400/40 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-rose-100 text-rose-800">
              404 Not Found
            </span>
            <XCircle className="w-4 h-4 text-rose-600" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Missing Resource</h4>
          <p className="text-[11px] text-slate-500 mt-1">
            Product ID not found. Returns machine-readable PRODUCT_NOT_FOUND code.
          </p>
        </button>

        {/* 201 Created */}
        <button
          onClick={() => runTest('201')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTest === '201'
              ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/40 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
              201 Created
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Resource Creation</h4>
          <p className="text-[11px] text-slate-500 mt-1">
            Product materialized on server. Returns Location header and entity.
          </p>
        </button>

        {/* Legacy 500 Intercepted */}
        <button
          onClick={() => runTest('legacy_crash')}
          className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
            activeTest === 'legacy_crash'
              ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-400/40 shadow-xs'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-800">
              500 Error Safe Catch
            </span>
            <ShieldAlert className="w-4 h-4 text-purple-600" />
          </div>
          <h4 className="text-xs font-bold text-slate-900">Crash Protection</h4>
          <p className="text-[11px] text-slate-500 mt-1">
            Intercepts legacy raw exceptions into clean JSON, preventing mobile crashes.
          </p>
        </button>
      </div>

      {/* Live Error Response Viewer */}
      <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-md overflow-hidden">
        <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span className="font-mono text-slate-300">
              Active Test: {activeTest === '400' ? 'POST /api/v1/products (Invalid)' :
                           activeTest === '404' ? 'GET /api/v1/products/prod-missing-999' :
                           activeTest === '201' ? 'POST /api/v1/products (Valid)' :
                           'GET /api/v1/legacy/simulateCrash'}
            </span>
            {status !== null && (
              <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                status === 201 ? 'bg-emerald-900 text-emerald-300' :
                status === 400 ? 'bg-amber-900 text-amber-300' :
                status === 404 ? 'bg-rose-900 text-rose-300' :
                'bg-purple-900 text-purple-300'
              }`}>
                HTTP {status}
              </span>
            )}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy Response'}</span>
          </button>
        </div>

        <div className="p-4 font-mono text-xs overflow-auto max-h-80 leading-relaxed text-slate-200">
          {loading ? (
            <div className="flex items-center gap-2 text-slate-400 py-8 justify-center">
              <div className="w-6 h-6 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
              <span>Invoking endpoint and evaluating error envelope...</span>
            </div>
          ) : response ? (
            <pre className="whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
          ) : (
            <div className="text-slate-500 py-8 text-center">
              Click one of the status code buttons above to test the standardized error schema.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
