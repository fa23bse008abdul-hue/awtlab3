import React, { useState } from 'react';
import { 
  Terminal, 
  Play, 
  Sparkles, 
  Database, 
  Clock, 
  Copy, 
  Check, 
  HelpCircle,
  FileCode,
  Layers
} from 'lucide-react';

export const GraphqlPlayground: React.FC = () => {
  const PRESET_QUERIES = [
    {
      name: "1. Mobile Flash Sale Banner (Over-fetching Solution)",
      description: "Fetches ONLY title, price, and thumbnail. Zero wasted bytes.",
      query: `query GetBannerProducts {
  products(limit: 3) {
    id
    title
    price
    thumbnailUrl
  }
}`
    },
    {
      name: "2. Single Product Specs (Client Dictates Fields)",
      description: "Selective nesting: requests processor and battery specs.",
      query: `query GetProductDetails {
  product(id: "prod-101") {
    id
    title
    brand
    price
    specifications {
      processor
      ramGb
      batteryCapacityMah
      color
    }
  }
}`
    },
    {
      name: "3. Logistics & Inventory Hub Stocks",
      description: "Warehouse distribution view for Bazaar operations.",
      query: `query GetInventoryLocations {
  products(category: "Groceries", limit: 2) {
    title
    stock
    inventoryDetails {
      warehouseSku
      fulfillmentHubs {
        karachiCentral
        lahoreMegaHub
        islamabadExpress
      }
    }
  }
}`
    },
    {
      name: "4. Mutation: Create Product",
      description: "Creates a new product item through GraphQL schema mutation.",
      query: `mutation AddCatalogItem {
  createProduct(
    title: "Bazaar Fresh Pure Farm Eggs (Pack of 30)",
    price: 980,
    category: "Groceries",
    stock: 200
  ) {
    id
    title
    price
    stock
    category
  }
}`
    }
  ];

  const [queryText, setQueryText] = useState<string>(PRESET_QUERIES[0].query);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [metrics, setMetrics] = useState<{ timeMs: number; sizeBytes: number; savingsPercent: number } | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleExecute = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText })
      });
      const data = await res.json();
      const timeMs = Math.round(performance.now() - start);
      const jsonString = JSON.stringify(data);
      const sizeBytes = new Blob([jsonString]).size;

      // Full rest payload baseline estimate is ~18,500 bytes per product
      const fullEstimate = 18500;
      const savingsPercent = Math.max(0, Number((((fullEstimate - sizeBytes) / fullEstimate) * 100).toFixed(1)));

      setResult(data);
      setMetrics({ timeMs, sizeBytes, savingsPercent });
    } catch (err: any) {
      setResult({ errors: [{ message: err.message || 'Execution error' }] });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(JSON.stringify(result, null, 2));
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
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-pink-50 text-pink-700 border border-pink-200">
                Client-Driven Data Fetching
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Interactive GraphQL Console (/graphql)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              Execute live GraphQL queries against our enterprise schema. 
              The mobile application explicitly queries the viewport fields, completely eradicating over-fetching and cellular latency.
            </p>
          </div>

          <button
            onClick={handleExecute}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${loading ? 'animate-spin' : ''}`} />
            <span>Execute Query</span>
          </button>
        </div>
      </div>

      {/* Query Presets Toolbar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="font-semibold text-slate-600 shrink-0 flex items-center gap-1">
          <FileCode className="w-3.5 h-3.5 text-slate-400" />
          Presets:
        </span>
        {PRESET_QUERIES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setQueryText(preset.query);
              setResult(null);
            }}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 whitespace-nowrap transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Main Two-Pane Editor & Result */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch min-h-[500px]">
        {/* Left: Query Editor */}
        <div className="lg:col-span-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-md flex flex-col overflow-hidden">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-pink-400 font-semibold flex items-center gap-1.5">
              <Terminal className="w-4 h-4" />
              GraphQL Query Source
            </span>
            <span className="text-[11px] text-slate-500 font-mono">POST /graphql</span>
          </div>

          <div className="flex-1 p-3">
            <textarea
              rows={18}
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="w-full h-full bg-transparent font-mono text-xs text-pink-200 p-2 focus:outline-hidden resize-none leading-relaxed"
              spellCheck={false}
            />
          </div>

          <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Supports Query and Mutation</span>
            <button
              onClick={handleExecute}
              className="px-3 py-1.5 rounded bg-pink-600 hover:bg-pink-700 text-white font-medium text-xs flex items-center gap-1 cursor-pointer"
            >
              <Play className="w-3 h-3 fill-current" />
              Run Query
            </button>
          </div>
        </div>

        {/* Right: GraphQL Result Viewer */}
        <div className="lg:col-span-6 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-md flex flex-col overflow-hidden">
          <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
            <span className="font-mono text-slate-300 font-semibold">
              GraphQL Execution Output
            </span>

            {/* Metrics */}
            {metrics && (
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {metrics.timeMs}ms
                </span>
                <span className="flex items-center gap-1 text-emerald-400 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  {metrics.sizeBytes} B (~{metrics.savingsPercent}% saved)
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span className="text-[11px]">{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            )}
          </div>

          <div className="flex-1 p-4 overflow-auto font-mono text-xs text-slate-200 leading-relaxed">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-64 text-slate-400 gap-3">
                <div className="w-8 h-8 border-2 border-pink-400 border-t-transparent rounded-full animate-spin" />
                <p>Executing GraphQL resolver tree...</p>
              </div>
            ) : result ? (
              <pre className="whitespace-pre-wrap">{JSON.stringify(result, null, 2)}</pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-2">
                <Terminal className="w-8 h-8 text-slate-600" />
                <p>Click "Execute Query" to inspect the JSON response</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
