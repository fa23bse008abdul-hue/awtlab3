import React, { useState } from 'react';
import { HttpMethod, ApiResponseState } from '../types/client';
import { ResponseViewer } from './ResponseViewer';
import { 
  Play, 
  Filter, 
  FileText, 
  Sparkles, 
  AlertCircle, 
  Send, 
  Database,
  ArrowRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface RestExplorerProps {
  onExecuteRequest: (method: HttpMethod, url: string, body?: any, headers?: Record<string, string>) => Promise<ApiResponseState>;
}

export const RestExplorer: React.FC<RestExplorerProps> = ({ onExecuteRequest }) => {
  const [method, setMethod] = useState<HttpMethod>('GET');
  const [endpointPath, setEndpointPath] = useState<string>('/api/v1/products');
  
  // Query parameters state
  const [category, setCategory] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(5);
  const [sort, setSort] = useState<string>('default');
  const [search, setSearch] = useState<string>('');
  const [fields, setFields] = useState<string>('');
  
  // Specific Product ID for /:id
  const [productId, setProductId] = useState<string>('prod-101');
  const [useResourcePath, setUseResourcePath] = useState<boolean>(false);

  // Request body
  const [requestBodyJson, setRequestBodyJson] = useState<string>(
    JSON.stringify(
      {
        title: "Bazaar Fresh Organic Sidr Honey (500g)",
        price: 1850,
        category: "Groceries",
        subCategory: "Breakfast & Spreads",
        stock: 50,
        brand: "Bazaar Organics"
      },
      null,
      2
    )
  );

  const [responseState, setResponseState] = useState<ApiResponseState>({
    status: null,
    statusText: '',
    headers: {},
    data: undefined,
    loading: false,
    timeMs: null,
    sizeBytes: null,
    endpointUrl: '/api/v1/products?limit=5',
    method: 'GET'
  });

  // Build computed URL
  const buildFullUrl = (): string => {
    let base = '/api/v1/products';
    if (useResourcePath && productId.trim()) {
      base = `/api/v1/products/${encodeURIComponent(productId.trim())}`;
    }

    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (!useResourcePath) {
      if (page > 1) params.append('page', page.toString());
      if (limit) params.append('limit', limit.toString());
      if (sort && sort !== 'default') params.append('sort', sort);
      if (search) params.append('search', search);
    }
    if (fields) params.append('fields', fields);

    const queryString = params.toString();
    return queryString ? `${base}?${queryString}` : base;
  };

  const handleSend = async (overrideUrl?: string, overrideMethod?: HttpMethod, overrideBody?: any) => {
    const targetMethod = overrideMethod || method;
    const targetUrl = overrideUrl || buildFullUrl();

    let parsedBody: any = undefined;
    if (['POST', 'PUT'].includes(targetMethod)) {
      try {
        parsedBody = overrideBody !== undefined ? overrideBody : JSON.parse(requestBodyJson);
      } catch {
        alert('Invalid JSON in request body');
        return;
      }
    }

    setResponseState(prev => ({
      ...prev,
      loading: true,
      endpointUrl: targetUrl,
      method: targetMethod
    }));

    const result = await onExecuteRequest(targetMethod, targetUrl, parsedBody);
    setResponseState(result);
  };

  // Preset triggers for quick evaluator checks
  const runPreset = (
    presetMethod: HttpMethod,
    presetPath: string,
    presetBody?: any,
    setupFn?: () => void
  ) => {
    if (setupFn) setupFn();
    setMethod(presetMethod);
    if (presetBody) {
      setRequestBodyJson(JSON.stringify(presetBody, null, 2));
    }
    handleSend(presetPath, presetMethod, presetBody);
  };

  return (
    <div className="space-y-6">
      {/* Module Architecture Highlights Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                Module 1 & 2 Execution
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                RESTful Architecture, Noun Modeling & Error Envelope
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-2xl">
              Strictly noun-based endpoints (<code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">/api/v1/products</code>) replace legacy RPC verb URIs (<code className="bg-rose-50 line-through text-rose-600 px-1 py-0.5 rounded">/getProductsList</code>). Standardized JSON error schema guarantees mobile stability without raw 500 crashes.
            </p>
          </div>

          {/* Quick Scenario Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setUseResourcePath(false);
                setFields('');
                setLimit(5);
                setCategory('');
                handleSend('/api/v1/products?limit=5', 'GET');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
            >
              Catalog (limit=5)
            </button>
            <button
              onClick={() => {
                setUseResourcePath(false);
                setFields('title,price');
                handleSend('/api/v1/products?limit=5&fields=title,price', 'GET');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
              Sparse ?fields=title,price
            </button>
            <button
              onClick={() => {
                const badPayload = { title: "A", price: -100, category: "" };
                setMethod('POST');
                setUseResourcePath(false);
                setRequestBodyJson(JSON.stringify(badPayload, null, 2));
                handleSend('/api/v1/products', 'POST', badPayload);
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-colors flex items-center gap-1"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
              Trigger 400 Bad Request
            </button>
            <button
              onClick={() => {
                setUseResourcePath(true);
                setProductId('prod-non-existent-999');
                handleSend('/api/v1/products/prod-non-existent-999', 'GET');
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition-colors"
            >
              Trigger 404 Not Found
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Request Builder (Left) & Response Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Request Configuration */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              HTTP Request Builder
            </h3>

            {/* HTTP Method and URL Bar */}
            <div className="flex gap-2">
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value as HttpMethod)}
                className="px-3 py-2 rounded-lg border border-slate-300 font-mono font-bold text-xs bg-slate-50 text-slate-900 focus:ring-2 focus:ring-indigo-500 outline-hidden"
              >
                <option value="GET">GET</option>
                <option value="POST">POST (201 Created)</option>
                <option value="PUT">PUT (Idempotent)</option>
                <option value="DELETE">DELETE</option>
              </select>

              <div className="flex-1 relative">
                <input
                  type="text"
                  readOnly
                  value={buildFullUrl()}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 font-mono text-xs bg-slate-50 text-slate-700 select-all"
                />
              </div>

              <button
                onClick={() => handleSend()}
                disabled={responseState.loading}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send</span>
              </button>
            </div>

            {/* Target Resource Mode Toggle */}
            <div className="flex items-center gap-4 pt-1 border-t border-slate-100">
              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="resourceMode"
                  checked={!useResourcePath}
                  onChange={() => setUseResourcePath(false)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Collection (<code className="text-indigo-600">/api/v1/products</code>)</span>
              </label>

              <label className="flex items-center gap-2 text-xs font-medium text-slate-700 cursor-pointer">
                <input
                  type="radio"
                  name="resourceMode"
                  checked={useResourcePath}
                  onChange={() => setUseResourcePath(true)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>Single Item (<code className="text-indigo-600">/api/v1/products/:id</code>)</span>
              </label>
            </div>

            {/* Single Product ID selector when in single item mode */}
            {useResourcePath && (
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center gap-3">
                <span className="text-xs font-medium text-slate-600">Product ID:</span>
                <input
                  type="text"
                  value={productId}
                  onChange={(e) => setProductId(e.target.value)}
                  placeholder="e.g. prod-101"
                  className="flex-1 px-2.5 py-1.5 rounded border border-slate-300 text-xs font-mono bg-white"
                />
                <button
                  onClick={() => setProductId('prod-101')}
                  className="px-2 py-1 text-[11px] bg-slate-200 hover:bg-slate-300 rounded font-mono"
                >
                  Samsung
                </button>
                <button
                  onClick={() => setProductId('prod-103')}
                  className="px-2 py-1 text-[11px] bg-slate-200 hover:bg-slate-300 rounded font-mono"
                >
                  Rice
                </button>
              </div>
            )}

            {/* Query Parameters Accordion */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5 text-slate-500" />
                Query Parameters & Filtering
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Category filter */}
                <div>
                  <label className="block text-slate-600 font-medium mb-1">category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  >
                    <option value="">All Categories</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Groceries">Groceries</option>
                    <option value="Fashion">Fashion</option>
                    <option value="Home & Kitchen">Home & Kitchen</option>
                  </select>
                </div>

                {/* Sort */}
                <div>
                  <label className="block text-slate-600 font-medium mb-1">sort</label>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  >
                    <option value="default">Default</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="rating_desc">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                </div>

                {/* Pagination: Limit & Page */}
                <div>
                  <label className="block text-slate-600 font-medium mb-1">limit (pagination)</label>
                  <select
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  >
                    <option value="2">2 items / page</option>
                    <option value="5">5 items / page</option>
                    <option value="10">10 items / page</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">page</label>
                  <input
                    type="number"
                    min="1"
                    value={page}
                    onChange={(e) => setPage(Math.max(1, Number(e.target.value)))}
                    className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                  />
                </div>
              </div>

              {/* Search Keyword */}
              <div>
                <label className="block text-slate-600 text-xs font-medium mb-1">search (keyword)</label>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="e.g. Samsung, dalda, silk, headphones"
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 text-xs bg-white"
                />
              </div>

              {/* Sparse Fieldset selector (?fields=...) */}
              <div className="p-3 bg-indigo-50/50 rounded-lg border border-indigo-100 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-indigo-900 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    Field Selection (?fields=...)
                  </label>
                  <span className="text-[10px] text-indigo-700 bg-indigo-100 px-1.5 py-0.5 rounded font-medium">
                    Solves Over-Fetching
                  </span>
                </div>
                <input
                  type="text"
                  value={fields}
                  onChange={(e) => setFields(e.target.value)}
                  placeholder="e.g. title,price,thumbnailUrl"
                  className="w-full px-2.5 py-1.5 rounded border border-indigo-200 text-xs font-mono bg-white"
                />
                <div className="flex gap-1.5 flex-wrap text-[11px]">
                  <span className="text-slate-500 self-center">Presets:</span>
                  <button
                    type="button"
                    onClick={() => setFields('')}
                    className="px-2 py-0.5 rounded bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    All 50+ Fields
                  </button>
                  <button
                    type="button"
                    onClick={() => setFields('title,price')}
                    className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-medium hover:bg-indigo-200"
                  >
                    Banner: title,price
                  </button>
                  <button
                    type="button"
                    onClick={() => setFields('title,price,thumbnailUrl,rating')}
                    className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-medium hover:bg-indigo-200"
                  >
                    Card: title,price,img,rating
                  </button>
                </div>
              </div>
            </div>

            {/* Request Body (for POST / PUT) */}
            {['POST', 'PUT'].includes(method) && (
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    Request Payload JSON ({method === 'PUT' ? 'Full Idempotent State' : 'New Resource'})
                  </label>
                  <div className="flex gap-1 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setRequestBodyJson(JSON.stringify({
                        title: "Bazaar Fresh Organic Sidr Honey (500g)",
                        price: 1850,
                        category: "Groceries",
                        stock: 50
                      }, null, 2))}
                      className="text-indigo-600 hover:underline"
                    >
                      Valid Payload
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setRequestBodyJson(JSON.stringify({
                        title: "X",
                        price: -500,
                        category: ""
                      }, null, 2))}
                      className="text-amber-600 hover:underline"
                    >
                      Invalid (400 Test)
                    </button>
                  </div>
                </div>

                <textarea
                  rows={6}
                  value={requestBodyJson}
                  onChange={(e) => setRequestBodyJson(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 font-mono text-xs bg-slate-50 text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-hidden"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Live Response Viewer */}
        <div className="lg:col-span-6">
          <ResponseViewer response={responseState} />
        </div>
      </div>
    </div>
  );
};
