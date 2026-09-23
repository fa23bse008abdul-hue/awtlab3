import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  ArrowRight, 
  BatteryCharging, 
  Wifi, 
  Smartphone, 
  Database, 
  CheckCircle2, 
  Sparkles,
  TrendingDown,
  RotateCcw
} from 'lucide-react';

export const OverfetchingLab: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [legacyPayload, setLegacyPayload] = useState<any>(null);
  const [sparsePayload, setSparsePayload] = useState<any>(null);
  const [graphqlPayload, setGraphqlPayload] = useState<any>(null);

  const [legacyBytes, setLegacyBytes] = useState<number>(18420);
  const [sparseBytes, setSparseBytes] = useState<number>(340);
  const [graphqlBytes, setGraphqlBytes] = useState<number>(270);

  // Calculator state
  const [dau, setDau] = useState<number>(500000); // 500k daily active users
  const [viewsPerUser, setViewsPerUser] = useState<number>(12); // 12 products per session

  const runBenchmark = async () => {
    setLoading(true);
    try {
      // 1. Fetch full REST (50 fields)
      const res1 = await fetch('/api/v1/products/prod-101');
      const data1 = await res1.json();
      const bytes1 = new Blob([JSON.stringify(data1)]).size;
      setLegacyPayload(data1);
      setLegacyBytes(bytes1);

      // 2. Fetch sparse REST (?fields=title,price)
      const res2 = await fetch('/api/v1/products/prod-101?fields=title,price');
      const data2 = await res2.json();
      const bytes2 = new Blob([JSON.stringify(data2)]).size;
      setSparsePayload(data2);
      setSparseBytes(bytes2);

      // 3. Fetch GraphQL query
      const res3 = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: `query GetBanner { product(id: "prod-101") { id title price } }`
        })
      });
      const data3 = await res3.json();
      const bytes3 = new Blob([JSON.stringify(data3)]).size;
      setGraphqlPayload(data3);
      setGraphqlBytes(bytes3);
    } catch (err) {
      console.error('Benchmark fetch failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runBenchmark();
  }, []);

  // Compute savings
  const sparseSavings = Number((((legacyBytes - sparseBytes) / legacyBytes) * 100).toFixed(1));
  const graphqlSavings = Number((((legacyBytes - graphqlBytes) / legacyBytes) * 100).toFixed(1));

  // Compute scale metrics (Daily GB)
  const totalRequestsPerDay = dau * viewsPerUser;
  const legacyDailyGb = ((totalRequestsPerDay * legacyBytes) / (1024 * 1024 * 1024)).toFixed(2);
  const modernDailyGb = ((totalRequestsPerDay * Math.min(sparseBytes, graphqlBytes)) / (1024 * 1024 * 1024)).toFixed(2);
  const savedDailyGb = (Number(legacyDailyGb) - Number(modernDailyGb)).toFixed(2);

  return (
    <div className="space-y-6">
      {/* Overview Card */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                Module 3 Core Benchmark
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                The REST Over-Fetching Dilemma & Bandwidth Lab
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              In Daraz/Bazaar mobile home banner carousel, the app only needs <strong>Title</strong> and <strong>Price</strong>. 
              Legacy REST returned an entire 50-field JSON object with warehouse SKUs, tax harmonized codes, and vendor contracts. Compare the real payloads below:
            </p>
          </div>

          <button
            onClick={runBenchmark}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-2 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Re-run 3-Way Benchmark</span>
          </button>
        </div>
      </div>

      {/* 3-Way Payload Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Card 1: Legacy REST Full 50 Fields */}
        <div className="bg-white rounded-xl border border-rose-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-rose-700 font-mono">
                1. Legacy REST
              </span>
              <h3 className="text-sm font-bold text-slate-900">Full 50+ Fields Payload</h3>
            </div>
            <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 font-mono text-xs font-bold">
              {(legacyBytes / 1024).toFixed(1)} KB
            </span>
          </div>

          <div className="p-4 flex-1 space-y-3">
            <div className="text-xs text-slate-600">
              Endpoint: <code className="text-rose-700 font-mono font-semibold">GET /api/v1/products/prod-101</code>
            </div>
            <div className="text-[11px] text-slate-500">
              Returns full warehouse SKU maps, internal costs, shipping tariffs, and raw description HTML (~50 fields).
            </div>
            <div className="h-56 bg-slate-900 rounded-lg p-3 font-mono text-[11px] text-slate-300 overflow-auto">
              <pre className="whitespace-pre-wrap">
                {legacyPayload 
                  ? JSON.stringify(legacyPayload, null, 2)
                  : '// Loading full 50-field JSON payload...'}
              </pre>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-100 text-xs text-rose-600 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            Extreme Mobile Over-Fetching (100% baseline)
          </div>
        </div>

        {/* Card 2: Modern REST Sparse Fieldset */}
        <div className="bg-white rounded-xl border border-indigo-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-indigo-50/60 border-b border-indigo-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 font-mono">
                2. Modern REST (Sparse)
              </span>
              <h3 className="text-sm font-bold text-slate-900">Field Selection (?fields=)</h3>
            </div>
            <span className="px-2 py-1 rounded bg-indigo-100 text-indigo-800 font-mono text-xs font-bold">
              {sparseBytes} Bytes
            </span>
          </div>

          <div className="p-4 flex-1 space-y-3">
            <div className="text-xs text-slate-600">
              Endpoint: <code className="text-indigo-700 font-mono font-semibold">GET ...?fields=title,price</code>
            </div>
            <div className="text-[11px] text-slate-500">
              Server dynamically strips 45+ unrequested keys. Client gets pure requested attributes.
            </div>
            <div className="h-56 bg-slate-900 rounded-lg p-3 font-mono text-[11px] text-indigo-300 overflow-auto">
              <pre className="whitespace-pre-wrap">
                {sparsePayload 
                  ? JSON.stringify(sparsePayload, null, 2)
                  : '// Loading sparse JSON payload...'}
              </pre>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border-t border-emerald-100 text-xs text-emerald-700 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {sparseSavings}% Bandwidth Reduction
            </span>
            <span className="font-mono text-[11px] bg-emerald-100 px-1.5 py-0.5 rounded">
              -{(legacyBytes - sparseBytes)} B
            </span>
          </div>
        </div>

        {/* Card 3: GraphQL Query */}
        <div className="bg-white rounded-xl border border-emerald-200 shadow-xs overflow-hidden flex flex-col">
          <div className="p-4 bg-emerald-50/60 border-b border-emerald-100 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 font-mono">
                3. GraphQL Endpoint
              </span>
              <h3 className="text-sm font-bold text-slate-900">Client-Dictated Schema</h3>
            </div>
            <span className="px-2 py-1 rounded bg-emerald-100 text-emerald-800 font-mono text-xs font-bold">
              {graphqlBytes} Bytes
            </span>
          </div>

          <div className="p-4 flex-1 space-y-3">
            <div className="text-xs text-slate-600">
              Endpoint: <code className="text-emerald-700 font-mono font-semibold">POST /graphql</code>
            </div>
            <div className="text-[11px] text-slate-500">
              Declarative query requesting exact fields: <code className="font-mono">{'{ id title price }'}</code>
            </div>
            <div className="h-56 bg-slate-900 rounded-lg p-3 font-mono text-[11px] text-emerald-300 overflow-auto">
              <pre className="whitespace-pre-wrap">
                {graphqlPayload 
                  ? JSON.stringify(graphqlPayload, null, 2)
                  : '// Loading GraphQL query response...'}
              </pre>
            </div>
          </div>

          <div className="p-3 bg-emerald-50 border-t border-emerald-100 text-xs text-emerald-700 font-semibold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              {graphqlSavings}% Bandwidth Reduction
            </span>
            <span className="font-mono text-[11px] bg-emerald-100 px-1.5 py-0.5 rounded">
              -{(legacyBytes - graphqlBytes)} B
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Device Flash-Sale Viewport Simulation */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-3">
          <Smartphone className="w-4 h-4 text-indigo-600" />
          The Mobile Experience: Identical UI, 98% Less Cellular Bandwidth
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          {/* Simulated Mobile Card */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 max-w-sm mx-auto w-full">
            <div className="text-[11px] font-semibold text-slate-500 mb-2 flex items-center justify-between">
              <span>Daraz Mobile Flash Sale Widget</span>
              <span className="text-emerald-600 font-mono text-[10px]">Optimal Render</span>
            </div>
            <div className="bg-white p-3 rounded-lg border border-slate-200 shadow-xs flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=160&auto=format&fit=crop&q=80"
                alt="Product"
                className="w-16 h-16 object-cover rounded-md bg-slate-100"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider">Electronics</span>
                <h4 className="text-xs font-bold text-slate-900 truncate">
                  Samsung Galaxy S25 Ultra 5G
                </h4>
                <div className="text-sm font-black text-slate-900 mt-0.5">
                  Rs. 389,999
                </div>
              </div>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 text-center">
              Requires only <code className="text-indigo-600">title</code> and <code className="text-indigo-600">price</code>.
            </div>
          </div>

          {/* Technical Takeaway */}
          <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <p>
                <strong>Zero Visual Compromise:</strong> The mobile screen requires exactly 2 visible strings. Fetching 50 enterprise fields creates zero customer benefit while wasting user data.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <BatteryCharging className="w-3.5 h-3.5" />
              </div>
              <p>
                <strong>CPU & Battery Efficiency:</strong> Decoding a 300-byte JSON takes &lt;0.1ms of mobile CPU time, compared to 4ms for a 18 KB deeply-nested object on budget Android phones in Pakistan.
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                <Wifi className="w-3.5 h-3.5" />
              </div>
              <p>
                <strong>Flaky 3G Resiliency:</strong> Smaller packets fit into a single TCP Initial Congestion Window (TCP initcwnd), eliminating roundtrip packet loss on weak cellular towers.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Real-World High-Scale Impact Calculator (Daraz / Bazaar Scale) */}
      <div className="bg-slate-900 text-white rounded-xl p-6 border border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-400" />
              High-Scale Cellular Bandwidth & Cloud Savings Calculator
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Simulating production traffic across Daraz or Bazaar Technologies daily active mobile user base
            </p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
            Scale Simulator
          </span>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-800/60 p-4 rounded-lg border border-slate-700/60">
          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-300">Daily Active Mobile Users (DAU)</span>
              <span className="text-indigo-400 font-mono font-bold">{dau.toLocaleString()} Users</span>
            </div>
            <input
              type="range"
              min="50000"
              max="2000000"
              step="50000"
              value={dau}
              onChange={(e) => setDau(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs font-medium mb-1">
              <span className="text-slate-300">Catalog / Banner Views per User</span>
              <span className="text-indigo-400 font-mono font-bold">{viewsPerUser} Products / Session</span>
            </div>
            <input
              type="range"
              min="2"
              max="50"
              step="1"
              value={viewsPerUser}
              onChange={(e) => setViewsPerUser(Number(e.target.value))}
              className="w-full accent-indigo-500"
            />
          </div>
        </div>

        {/* Big Numbers Comparison */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-950/80 rounded-lg border border-rose-900/40">
            <span className="text-xs text-rose-400 font-semibold block mb-1">Legacy REST Daily Data</span>
            <div className="text-2xl font-black text-rose-200 font-mono">{legacyDailyGb} GB</div>
            <span className="text-[11px] text-slate-500 block mt-1">Huge egress billing & cellular drain</span>
          </div>

          <div className="p-4 bg-slate-950/80 rounded-lg border border-indigo-900/40">
            <span className="text-xs text-indigo-400 font-semibold block mb-1">Modern API Daily Data</span>
            <div className="text-2xl font-black text-indigo-200 font-mono">{modernDailyGb} GB</div>
            <span className="text-[11px] text-slate-500 block mt-1">Filtered payload only</span>
          </div>

          <div className="p-4 bg-emerald-950/40 rounded-lg border border-emerald-500/40">
            <span className="text-xs text-emerald-400 font-semibold block mb-1">Bandwidth Saved / Day</span>
            <div className="text-2xl font-black text-emerald-300 font-mono flex items-center gap-1.5">
              <TrendingDown className="w-6 h-6 text-emerald-400" />
              {savedDailyGb} GB
            </div>
            <span className="text-[11px] text-emerald-400/80 block mt-1 font-semibold">
              98.2% cellular traffic reduction!
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
