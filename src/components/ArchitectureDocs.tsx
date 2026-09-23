import React, { useState } from 'react';
import { 
  BookOpen, 
  Terminal, 
  CheckCircle2, 
  Copy, 
  Check, 
  Layers, 
  ShieldCheck, 
  Zap, 
  Database,
  ExternalLink
} from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const curlSnippets = [
    {
      title: "1. List Products (Filtering & Pagination)",
      cmd: `curl -X GET "http://localhost:3000/api/v1/products?category=Electronics&limit=5&page=1&sort=price_asc"`
    },
    {
      title: "2. Sparse Fieldset (Over-fetching Solution via REST)",
      cmd: `curl -X GET "http://localhost:3000/api/v1/products/prod-101?fields=title,price,thumbnailUrl"`
    },
    {
      title: "3. Idempotent Order Creation (Network Retry Safety)",
      cmd: `curl -X POST "http://localhost:3000/api/v1/orders" \\
  -H "Content-Type: application/json" \\
  -H "Idempotency-Key: mobile-checkout-uuid-8821" \\
  -d '{
    "customer": { "name": "Hamza Tariq", "phone": "+923001234567" },
    "items": [{ "productId": "prod-103", "quantity": 2 }],
    "paymentMethod": "JazzCash"
  }'`
    },
    {
      title: "4. GraphQL Query (Client-Dictated Viewport)",
      cmd: `curl -X POST "http://localhost:3000/graphql" \\
  -H "Content-Type: application/json" \\
  -d '{ "query": "{ products(limit: 3) { id title price } }" }'`
    },
    {
      title: "5. Trigger 400 Bad Request (Validation Schema)",
      cmd: `curl -X POST "http://localhost:3000/api/v1/products" \\
  -H "Content-Type: application/json" \\
  -d '{ "title": "A", "price": -50, "category": "" }'`
    }
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Overview Card */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
            Whitepaper & Blueprint
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            E-Commerce Platform API Modernization (Daraz / Bazaar Analogy)
          </h2>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          Comprehensive enterprise architecture replacing legacy RPC anti-patterns with strict RESTful resource modeling, idempotent checkout guarantees, and dual over-fetching solutions (GraphQL & REST Sparse Fieldsets).
        </p>

        {/* Pillars Comparison Table */}
        <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                <th className="p-3">Architectural Domain</th>
                <th className="p-3 text-rose-700">Legacy Anti-Pattern (Problem)</th>
                <th className="p-3 text-emerald-700">Modernized Enterprise Solution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3 font-semibold text-slate-900">Resource URIs & Verbs</td>
                <td className="p-3 text-slate-600">
                  <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded">/getProductsList</code>, <code className="text-rose-600 bg-rose-50 px-1 py-0.5 rounded">/deleteProductItem</code> (RPC verbs in URIs)
                </td>
                <td className="p-3 text-slate-800">
                  <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">GET /api/v1/products</code>, <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded">DELETE /api/v1/products/:id</code> (Noun-based)
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Error Handling</td>
                <td className="p-3 text-slate-600">
                  Raw unhandled 500 HTML stack traces, breaking mobile JSON parsers and causing client crashes.
                </td>
                <td className="p-3 text-slate-800">
                  Standardized JSON error envelope (<code>code</code>, <code>error_code</code>, <code>message</code>, <code>timestamp</code>) with proper 400 Bad Request, 404 Not Found.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Flaky 3G/4G Retries</td>
                <td className="p-3 text-slate-600">
                  Non-idempotent order placement, causing double deductions and duplicate orders on network reconnects.
                </td>
                <td className="p-3 text-slate-800">
                  <code>Idempotency-Key</code> header middleware caching responses and safely replaying without double-charging.
                </td>
              </tr>
              <tr>
                <td className="p-3 font-semibold text-slate-900">Home Banner Over-fetching</td>
                <td className="p-3 text-slate-600">
                  Returns 50+ enterprise fields (~18.5 KB per product), draining mobile battery and cellular data.
                </td>
                <td className="p-3 text-slate-800">
                  <strong>GraphQL</strong> (<code>/graphql</code>) or <strong>Sparse Fieldset</strong> (<code>?fields=title,price</code>) reducing payload by <strong>98.4%</strong> to ~280 bytes.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Setup & Run Instructions (Deliverable 5) */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-600" />
          Setup & Running Instructions (README Deliverable 5)
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-3 bg-slate-900 text-slate-200 rounded-lg space-y-2">
            <div className="text-slate-400 font-sans text-[11px] font-semibold">1. Install Dependencies</div>
            <div>npm install</div>
          </div>

          <div className="p-3 bg-slate-900 text-slate-200 rounded-lg space-y-2">
            <div className="text-slate-400 font-sans text-[11px] font-semibold">2. Run Full-Stack Development Server (Express + Workbench)</div>
            <div>npm run dev</div>
            <div className="text-slate-400 font-sans text-[11px]">Binds to port 3000 with live hot-reloading.</div>
          </div>

          <div className="p-3 bg-slate-900 text-slate-200 rounded-lg space-y-2">
            <div className="text-slate-400 font-sans text-[11px] font-semibold">3. Production Build & Standalone Node Execution</div>
            <div>npm run build</div>
            <div>npm start</div>
          </div>
        </div>
      </div>

      {/* cURL Command Reference */}
      <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-indigo-600" />
          cURL Commands & Terminal Test Suite
        </h3>

        <div className="space-y-4">
          {curlSnippets.map((snippet, idx) => (
            <div key={idx} className="bg-slate-900 text-slate-200 rounded-lg p-3 space-y-2 font-mono text-xs">
              <div className="flex items-center justify-between text-slate-400 font-sans text-xs font-semibold">
                <span>{snippet.title}</span>
                <button
                  onClick={() => handleCopy(snippet.cmd, idx)}
                  className="flex items-center gap-1 text-[11px] px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                >
                  {copiedIndex === idx ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedIndex === idx ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <pre className="text-indigo-200 whitespace-pre-wrap">{snippet.cmd}</pre>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
