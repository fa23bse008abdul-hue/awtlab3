import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  RotateCcw, 
  ArrowRight, 
  CheckCircle2, 
  CreditCard, 
  RefreshCw,
  Clock,
  Layers,
  Send,
  ZapOff
} from 'lucide-react';

export const IdempotencyLab: React.FC = () => {
  const [activeKey, setActiveKey] = useState<string>(`ord-uuid-${Math.floor(Math.random() * 90000 + 10000)}`);
  const [customerName, setCustomerName] = useState<string>('Hamza Tariq');
  const [paymentMethod, setPaymentMethod] = useState<'JazzCash' | 'Easypaisa' | 'COD'>('JazzCash');
  const [loading, setLoading] = useState<boolean>(false);
  const [lastResponse, setLastResponse] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [ordersList, setOrdersList] = useState<any[]>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'warning' | 'info' } | null>(null);

  const fetchOrdersAndLogs = async () => {
    try {
      const res = await fetch('/api/v1/orders');
      const data = await res.json();
      if (data.success) {
        setOrdersList(data.data.orders || []);
        setAuditLogs(data.data.idempotencyAuditLogs || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrdersAndLogs();
  }, []);

  const handleCreateOrder = async (useIdempotency: boolean, customKey?: string) => {
    setLoading(true);
    setMessage(null);
    const keyToUse = customKey || activeKey;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (useIdempotency) {
      headers['Idempotency-Key'] = keyToUse;
    }

    const payload = {
      customer: {
        name: customerName,
        phone: "+923001234567",
        city: "Lahore",
        shippingAddress: "House 14, Block 5, Gulshan-e-Iqbal"
      },
      items: [
        {
          productId: "prod-103",
          title: "Khaalis Super Kernel Basmati Rice (5 KG Pack)",
          unitPrice: 2450,
          quantity: 2
        }
      ],
      paymentMethod
    };

    try {
      const res = await fetch('/api/v1/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      const isReplay = res.headers.get('Idempotent-Replay') === 'true' || data.isIdempotentReplay;

      setLastResponse({
        status: res.status,
        headers: Object.fromEntries(res.headers.entries()),
        data,
        isReplay
      });

      if (isReplay) {
        setMessage({
          type: 'success',
          text: `🛡️ Duplicate Payment Intercepted! Mobile retry with key '${keyToUse}' was detected. Order ${data.data?.orderId} was safely replayed without double-debiting customer wallet!`
        });
      } else if (useIdempotency) {
        setMessage({
          type: 'info',
          text: `✅ Initial Order Created (201 Created)! Key '${keyToUse}' stored in server idempotency cache with TTL.`
        });
      } else {
        setMessage({
          type: 'warning',
          text: `⚠️ UNPROTECTED ORDER: Created new duplicate order without Idempotency-Key! Customer was charged again.`
        });
      }

      await fetchOrdersAndLogs();
    } catch (err: any) {
      setMessage({ type: 'warning', text: err.message || 'Request failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await fetch('/api/v1/orders/reset', { method: 'POST' });
      setActiveKey(`ord-uuid-${Math.floor(Math.random() * 90000 + 10000)}`);
      setLastResponse(null);
      setMessage(null);
      await fetchOrdersAndLogs();
    } catch (err) {
      console.error(err);
    }
  };

  const generateNewKey = () => {
    setActiveKey(`ord-uuid-${Math.floor(Math.random() * 90000 + 10000)}`);
    setMessage({
      type: 'info',
      text: 'Generated fresh new Idempotency-Key. Ready for next order test.'
    });
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Critical E-Commerce Case Study
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                Duplicate Payment & Order Deductions (Idempotency Engine)
              </h2>
            </div>
            <p className="text-xs text-slate-600 mt-1 max-w-3xl">
              On flaky 3G/4G connections in Pakistan, mobile clients drop connection right after initiating checkout. 
              Without an <code>Idempotency-Key</code>, automatic network retries create <strong>duplicate orders</strong> and charge the user multiple times.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-medium transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Orders & Cache</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Lab Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Order Configuration & Retry Simulator */}
        <div className="lg:col-span-6 space-y-4">
          <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              Simulate Mobile Checkout & Flaky Network Retries
            </h3>

            {/* Cart Preview */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex justify-between font-semibold text-slate-800">
                <span>2x Khaalis Super Kernel Basmati Rice (5 KG)</span>
                <span>Rs. 4,900</span>
              </div>
              <div className="flex justify-between text-slate-500 text-[11px]">
                <span>GST Tax (5%) + Free Delivery</span>
                <span>Rs. 245</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 border-t border-slate-200 pt-1">
                <span>Total Deducted from Wallet:</span>
                <span className="text-indigo-600 font-mono">Rs. 5,145</span>
              </div>
            </div>

            {/* Customer & Payment Form */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">Customer Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-600 font-medium mb-1">Payment Channel</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 rounded border border-slate-300 bg-white"
                >
                  <option value="JazzCash">JazzCash Mobile Account</option>
                  <option value="Easypaisa">Easypaisa Mobile Wallet</option>
                  <option value="COD">Cash on Delivery (COD)</option>
                </select>
              </div>
            </div>

            {/* Idempotency Key Configuration */}
            <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Active Idempotency-Key
                </label>
                <button
                  onClick={generateNewKey}
                  className="text-[11px] font-semibold text-emerald-700 hover:underline"
                >
                  Generate New Key
                </button>
              </div>
              <input
                type="text"
                value={activeKey}
                onChange={(e) => setActiveKey(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded border border-emerald-300 font-mono text-xs bg-white text-slate-900"
              />
              <p className="text-[11px] text-emerald-800">
                Standard UUID generated on client when user initiates checkout.
              </p>
            </div>

            {/* Testing Actions */}
            <div className="space-y-3 pt-2">
              <div className="text-xs font-bold text-slate-700">Choose Testing Scenario:</div>

              {/* Scenario 1: Safe Protected Flow */}
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900">
                    Scenario A: Enterprise Safe Mode (With Idempotency-Key)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Recommended
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleCreateOrder(true)}
                    disabled={loading}
                    className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>1. Initial Checkout</span>
                  </button>

                  <button
                    onClick={() => handleCreateOrder(true)}
                    disabled={loading}
                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>2. Flaky 3G Retry</span>
                  </button>
                </div>
                <p className="text-[11px] text-slate-500">
                  Step 1 creates order. Step 2 simulates mobile retry with same key—backend intercepts and avoids double-charge!
                </p>
              </div>

              {/* Scenario 2: Legacy Unprotected Failure Flow */}
              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-900">
                    Scenario B: Legacy Non-Idempotent Flow (No Key)
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
                    Anti-Pattern
                  </span>
                </div>
                <button
                  onClick={() => handleCreateOrder(false)}
                  disabled={loading}
                  className="w-full px-3 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs disabled:opacity-50 cursor-pointer"
                >
                  <ZapOff className="w-3.5 h-3.5" />
                  <span>Send Unprotected Order (Will Duplicate)</span>
                </button>
                <p className="text-[11px] text-rose-700">
                  Clicking multiple times creates distinct orders and repeatedly charges the customer's wallet!
                </p>
              </div>
            </div>

            {/* Notification message */}
            {message && (
              <div className={`p-3 rounded-lg text-xs font-medium border ${
                message.type === 'success' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
                message.type === 'warning' ? 'bg-rose-50 text-rose-900 border-rose-300' :
                'bg-blue-50 text-blue-900 border-blue-300'
              }`}>
                {message.text}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Idempotency Audit Log & Orders Created */}
        <div className="lg:col-span-6 space-y-4">
          {/* Server Response Card */}
          <div className="bg-slate-900 text-slate-100 rounded-xl p-4 border border-slate-800 shadow-md">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
              <span className="font-mono text-slate-400">POST /api/v1/orders</span>
              {lastResponse ? (
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                    lastResponse.isReplay ? 'bg-indigo-900 text-indigo-300 border border-indigo-700' : 'bg-emerald-900 text-emerald-300 border border-emerald-700'
                  }`}>
                    {lastResponse.status} {lastResponse.isReplay ? 'IDEMPOTENT REPLAY' : 'CREATED'}
                  </span>
                </div>
              ) : (
                <span className="text-slate-500 font-mono text-[11px]">Awaiting order trigger</span>
              )}
            </div>

            <div className="h-44 overflow-auto font-mono text-xs text-slate-300 pt-3">
              <pre className="whitespace-pre-wrap">
                {lastResponse
                  ? JSON.stringify(lastResponse.data, null, 2)
                  : '// Press "1. Initial Checkout" then "2. Flaky 3G Retry" to see idempotency in action.'}
              </pre>
            </div>
          </div>

          {/* Idempotency Audit Logs Table */}
          <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                Live Idempotency Interceptor Log
              </h4>
              <span className="text-[11px] font-mono text-slate-500">
                {auditLogs.length} events logged
              </span>
            </div>

            <div className="space-y-2 max-h-56 overflow-auto text-xs">
              {auditLogs.length > 0 ? (
                auditLogs.map((log, idx) => (
                  <div 
                    key={idx}
                    className={`p-2.5 rounded-lg border flex items-center justify-between font-mono text-[11px] ${
                      log.action === 'IDEMPOTENT_REPLAY_INTERCEPTED'
                        ? 'bg-indigo-50/70 border-indigo-200 text-indigo-900'
                        : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded font-bold text-[10px] ${
                          log.action === 'IDEMPOTENT_REPLAY_INTERCEPTED'
                            ? 'bg-indigo-200 text-indigo-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {log.action === 'IDEMPOTENT_REPLAY_INTERCEPTED' ? 'DUPLICATE INTERCEPTED' : 'FIRST EXECUTION'}
                        </span>
                        <span className="font-semibold">{log.orderId || 'Order'}</span>
                      </div>
                      <span className="text-slate-500 text-[10px] block mt-0.5">
                        Key: {log.key} • {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="font-bold text-slate-800">
                      Rs. {log.totalAmount?.toLocaleString()}
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-slate-400 text-xs">
                  No orders processed yet. Click "1. Initial Checkout" above.
                </div>
              )}
            </div>

            {/* Total Orders Created Count */}
            <div className="pt-2 border-t border-slate-100 flex justify-between text-xs font-medium text-slate-600">
              <span>Total Distinct Orders in Database:</span>
              <span className="font-mono font-bold text-slate-900">{ordersList.length}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
