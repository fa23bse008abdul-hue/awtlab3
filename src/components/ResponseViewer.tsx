import React, { useState } from 'react';
import { ApiResponseState } from '../types/client';
import { Check, Copy, Clock, Database, Code, ShieldCheck, AlertCircle } from 'lucide-react';

interface ResponseViewerProps {
  response: ApiResponseState;
}

export const ResponseViewer: React.FC<ResponseViewerProps> = ({ response }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'body' | 'headers' | 'architecture'>('body');

  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStatusBadge = (status: number | null) => {
    if (status === null) return null;
    let color = 'bg-slate-100 text-slate-700 border-slate-300';
    if (status >= 200 && status < 300) color = 'bg-emerald-50 text-emerald-700 border-emerald-300';
    else if (status >= 300 && status < 400) color = 'bg-blue-50 text-blue-700 border-blue-300';
    else if (status === 400) color = 'bg-amber-50 text-amber-700 border-amber-300';
    else if (status === 404) color = 'bg-rose-50 text-rose-700 border-rose-300';
    else if (status >= 400 && status < 500) color = 'bg-orange-50 text-orange-700 border-orange-300';
    else if (status >= 500) color = 'bg-purple-50 text-purple-700 border-purple-300';

    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-mono font-bold border ${color} flex items-center gap-1.5`}>
        {status >= 200 && status < 300 ? (
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
        )}
        {status} {response.statusText}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-md overflow-hidden flex flex-col h-full min-h-[480px]">
      {/* Top Bar */}
      <div className="bg-slate-950/80 px-4 py-3 border-b border-slate-800 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-xs">
            <span className={`px-2 py-0.5 rounded font-bold ${
              response.method === 'GET' ? 'bg-blue-900/60 text-blue-300' :
              response.method === 'POST' ? 'bg-emerald-900/60 text-emerald-300' :
              response.method === 'PUT' ? 'bg-amber-900/60 text-amber-300' :
              'bg-rose-900/60 text-rose-300'
            }`}>
              {response.method}
            </span>
            <span className="text-slate-400 truncate max-w-[260px] sm:max-w-md" title={response.endpointUrl}>
              {response.endpointUrl || '/api/v1/products'}
            </span>
          </div>
          {getStatusBadge(response.status)}
        </div>

        {/* Telemetry info */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          {response.timeMs !== null && (
            <span className="flex items-center gap-1" title="Server Roundtrip latency">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {response.timeMs}ms
            </span>
          )}
          {response.sizeBytes !== null && (
            <span className="flex items-center gap-1" title="Payload size">
              <Database className="w-3.5 h-3.5 text-slate-500" />
              {response.sizeBytes > 1024 
                ? `${(response.sizeBytes / 1024).toFixed(2)} KB` 
                : `${response.sizeBytes} B`}
            </span>
          )}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
            title="Copy JSON response"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Sub Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 text-xs">
        <button
          onClick={() => setActiveTab('body')}
          className={`py-2 px-3 border-b-2 font-medium transition-colors ${
            activeTab === 'body'
              ? 'border-indigo-400 text-indigo-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Response Body (JSON)
        </button>
        <button
          onClick={() => setActiveTab('headers')}
          className={`py-2 px-3 border-b-2 font-medium transition-colors ${
            activeTab === 'headers'
              ? 'border-indigo-400 text-indigo-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Headers ({Object.keys(response.headers || {}).length})
        </button>
        <button
          onClick={() => setActiveTab('architecture')}
          className={`py-2 px-3 border-b-2 font-medium transition-colors ${
            activeTab === 'architecture'
              ? 'border-indigo-400 text-indigo-300'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Architecture Note
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto font-mono text-xs leading-relaxed">
        {response.loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
            <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
            <p>Executing request against Express backend...</p>
          </div>
        ) : activeTab === 'body' ? (
          <pre className="text-slate-200 whitespace-pre-wrap word-break">
            {response.data !== undefined
              ? JSON.stringify(response.data, null, 2)
              : '// Click "Send Request" to test endpoint'}
          </pre>
        ) : activeTab === 'headers' ? (
          <div className="space-y-2">
            {Object.entries(response.headers || {}).length > 0 ? (
              Object.entries(response.headers).map(([k, v]) => (
                <div key={k} className="flex gap-2 border-b border-slate-800/80 pb-1.5">
                  <span className="text-indigo-400 font-semibold min-w-[180px]">{k}:</span>
                  <span className="text-slate-300 break-all">{v}</span>
                </div>
              ))
            ) : (
              <p className="text-slate-500">No headers captured yet.</p>
            )}
          </div>
        ) : (
          <div className="text-slate-300 space-y-3 font-sans text-xs">
            <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-700/60">
              <h4 className="font-semibold text-slate-100 flex items-center gap-1.5 mb-1">
                <Code className="w-4 h-4 text-indigo-400" />
                Status Code Interpretation
              </h4>
              <p className="text-slate-300">
                {response.status === 200 && '200 OK: Standard successful GET or idempotent PUT update with valid payload.'}
                {response.status === 201 && '201 Created: New resource materialized on server with a returned Location header.'}
                {response.status === 400 && '400 Bad Request: Client-side payload validation failed. Standardized error structure ensures mobile apps do not crash.'}
                {response.status === 404 && '404 Not Found: Specific resource ID was not found in catalog, returned with standard error_code.'}
                {response.status === null && 'Awaiting request execution.'}
              </p>
            </div>
            {response.data?.meta?.payloadOptimization && (
              <div className="p-3 bg-indigo-950/40 rounded-lg border border-indigo-800/40">
                <h4 className="font-semibold text-indigo-200 mb-1">⚡ Sparse Fieldset Optimization</h4>
                <p>
                  Requested {response.data.meta.payloadOptimization.fieldsCount} fields.
                  Saved {response.data.meta.payloadOptimization.savingsPercentage}% bandwidth vs raw 50-field payload!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
