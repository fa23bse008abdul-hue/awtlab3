import React, { useState } from 'react';
import { ActiveTab, HttpMethod, ApiResponseState } from './types/client';
import { Header } from './components/Header';
import { RestExplorer } from './components/RestExplorer';
import { OverfetchingLab } from './components/OverfetchingLab';
import { IdempotencyLab } from './components/IdempotencyLab';
import { GraphqlPlayground } from './components/GraphqlPlayground';
import { ErrorMatrix } from './components/ErrorMatrix';
import { ArchitectureDocs } from './components/ArchitectureDocs';
import { ShieldCheck, Server, Layers, Terminal, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('rest');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Centralized HTTP client for sending requests to local Express backend
  const executeRequest = async (
    method: HttpMethod,
    url: string,
    body?: any,
    customHeaders?: Record<string, string>
  ): Promise<ApiResponseState> => {
    const startTime = performance.now();
    try {
      const headers: Record<string, string> = {
        ...(customHeaders || {})
      };

      if (body !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)) {
        headers['Content-Type'] = 'application/json';
      }

      const fetchOptions: RequestInit = {
        method,
        headers,
        body: body !== undefined && ['POST', 'PUT', 'PATCH'].includes(method)
          ? JSON.stringify(body)
          : undefined
      };

      const response = await fetch(url, fetchOptions);
      const timeMs = Math.round(performance.now() - startTime);

      // Extract response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((val, key) => {
        responseHeaders[key] = val;
      });

      // Parse JSON or text
      let responseData: any = null;
      let sizeBytes = 0;

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        responseData = await response.json();
        const jsonStr = JSON.stringify(responseData);
        sizeBytes = new Blob([jsonStr]).size;
      } else {
        const text = await response.text();
        responseData = text;
        sizeBytes = new Blob([text]).size;
      }

      return {
        status: response.status,
        statusText: response.statusText || (response.ok ? 'OK' : 'Error'),
        headers: responseHeaders,
        data: responseData,
        loading: false,
        timeMs,
        sizeBytes,
        endpointUrl: url,
        method
      };
    } catch (err: any) {
      const timeMs = Math.round(performance.now() - startTime);
      return {
        status: 500,
        statusText: 'Network / Client Error',
        headers: {},
        data: { error: err.message || 'Failed to reach server' },
        loading: false,
        timeMs,
        sizeBytes: 0,
        endpointUrl: url,
        method
      };
    }
  };

  const handleResetData = async () => {
    try {
      await fetch('/api/v1/products/catalog/reset', { method: 'POST' });
      await fetch('/api/v1/orders/reset', { method: 'POST' });
      setToastMessage('✅ Catalog and Idempotency store restored to pristine initial state.');
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      setToastMessage('Failed to reset state.');
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Global Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onResetData={handleResetData}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-medium flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'rest' && (
          <RestExplorer onExecuteRequest={executeRequest} />
        )}

        {activeTab === 'overfetching' && (
          <OverfetchingLab />
        )}

        {activeTab === 'idempotency' && (
          <IdempotencyLab />
        )}

        {activeTab === 'graphql' && (
          <GraphqlPlayground />
        )}

        {activeTab === 'errors' && (
          <ErrorMatrix />
        )}

        {activeTab === 'docs' && (
          <ArchitectureDocs />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">E-Commerce Modernization Architecture</span>
            <span>•</span>
            <span>High-Scale Daraz & Bazaar Analogy</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500 font-mono text-[11px]">
            <span>REST Noun URIs</span>
            <span>•</span>
            <span>Idempotency-Key Protection</span>
            <span>•</span>
            <span>GraphQL Field Selection</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
