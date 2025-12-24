import { useState, useEffect } from 'react';
import type { Market, OrderBook, Trade, Candle } from '../types/api';
import { ArrowLeft, TrendingUp, Activity, Clock, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface MarketDetailsProps {
    marketId: string;
    onBack: () => void;
}

export function MarketDetails({ marketId, onBack }: MarketDetailsProps) {
    const [market, setMarket] = useState<Market | null>(null);
    const [orderBook, setOrderBook] = useState<OrderBook | null>(null);
    const [trades, setTrades] = useState<Trade[]>([]);
    const [candles, setCandles] = useState<Candle[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Market Stats
                const marketsRes = await fetch('/api/v1/info/markets');
                const marketsData = await marketsRes.json();
                const foundMarket = marketsData.data.find((m: Market) => m.name === marketId);
                setMarket(foundMarket || null);

                // 2. Fetch Orderbook
                const obRes = await fetch(`/api/v1/info/markets/${marketId}/orderbook`);
                const obData = await obRes.json();
                if (obData.status === 'OK') setOrderBook(obData.data);

                // 3. Fetch Trades
                const tradesRes = await fetch(`/api/v1/info/markets/${marketId}/trades`);
                const tradesData = await tradesRes.json();
                if (tradesData.status === 'OK') setTrades(tradesData.data);

                // 4. Fetch Candles (15m default?) - API docs didn't specify interval param in public GET, assumes query param or default.
                // Trying a standard guess or just checking what /trades endpoint gives if candles fails. 
                // Actually the doc says GET /api/v1/info/candles/{market}/trades for trades price.
                // Let's try to get last 24h of data (approx). params: ?resolution=15&from=...&to=...
                const to = Math.floor(Date.now() / 1000);
                const from = to - (24 * 60 * 60);
                const candlesRes = await fetch(`/api/v1/info/candles/${marketId}/trades?resolution=15&from=${from}&to=${to}`);
                const candlesData = await candlesRes.json();
                if (candlesData.status === 'OK') setCandles(candlesData.data.reverse()); // desc order

            } catch (error) {
                console.error("Error fetching market details", error);
            } finally {
                setLoading(false);
            }
        };

        if (marketId) fetchAllData();

        const interval = setInterval(() => {
            // specific polling for real-time feel
        }, 5000);

        return () => clearInterval(interval);
    }, [marketId]);

    const formatCurrency = (val: string) => '$' + parseFloat(val).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
    const formatTime = (ts: number) => new Date(ts).toLocaleTimeString();

    if (loading || !market) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-extended-green border-t-transparent rounded-full animate-spin" />
                    <p className="font-bold text-extended-green">Loading {marketId} Data...</p>
                </div>
            </div>
        );
    }

    const chartData = candles.map(c => ({
        time: c.T,
        date: new Date(c.T).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        price: parseFloat(c.c)
    })).reverse(); // Chart wants asc generally

    return (
        <div className="min-h-screen bg-[#050505] font-sans text-white relative overflow-x-hidden pb-24">

            <div className="container mx-auto px-4 pt-24 max-w-7xl animate-fade-in-up">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 font-bold"
                >
                    <ArrowLeft size={20} />
                    Back to Markets
                </button>

                {/* Header */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 border-b border-white/10 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center font-bold text-2xl border border-white/5">
                            {market.assetName[0]}
                        </div>
                        <div>
                            <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-3">
                                {market.uiName}
                                <span className="text-sm px-2 py-1 bg-extended-green/20 text-extended-green rounded-lg font-bold border border-extended-green/20">
                                    {market.category}
                                </span>
                            </h1>
                            <p className="text-gray-400 font-mono text-lg">{marketId}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-8">
                        <div className="text-right">
                            <a
                                href="https://app.extended.exchange/join/EXTENDED_OTC"
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex px-6 py-3 bg-extended-green hover:bg-[#00cc00] text-black font-black rounded-xl transition-all text-sm items-center gap-2 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,255,0,0.3)] hover:shadow-[0_0_30px_rgba(0,255,0,0.5)]"
                            >
                                TRADE NOW
                                <ArrowUpRight size={18} />
                            </a>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">Mark Price</p>
                            <p className="text-3xl font-black text-white tracking-tight">{formatCurrency(market.marketStats.markPrice)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">24h Change</p>
                            <p className={`text-3xl font-black tracking-tight flex items-center justify-end gap-1 ${parseFloat(market.marketStats.dailyPriceChangePercentage) >= 0 ? 'text-extended-green' : 'text-red-500'
                                }`}>
                                {parseFloat(market.marketStats.dailyPriceChangePercentage) >= 0 ? '+' : ''}
                                {(parseFloat(market.marketStats.dailyPriceChangePercentage) * 100).toFixed(2)}%
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Chart */}
                    <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 h-[400px] flex flex-col relative overflow-hidden">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <Activity size={18} className="text-extended-green" />
                            Price History
                        </h3>
                        <div className="flex-1 w-full min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#00FF00" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#00FF00" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="date" hide />
                                    <YAxis
                                        orientation="right"
                                        domain={['auto', 'auto']}
                                        tick={{ fill: '#444', fontSize: 11 }}
                                        axisLine={false}
                                        tickLine={false}
                                        tickFormatter={(val) => `$${val.toLocaleString()}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                                        labelStyle={{ color: '#888' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="price"
                                        stroke="#00FF00"
                                        strokeWidth={2}
                                        fillOpacity={1}
                                        fill="url(#colorPrice)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Order Book Summary */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 h-[400px] overflow-hidden flex flex-col">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <TrendingUp size={18} className="text-blue-400" />
                            Order Book
                        </h3>

                        <div className="flex-1 overflow-y-auto space-y-1 pr-2 font-mono text-xs">
                            <div className="grid grid-cols-2 text-gray-500 mb-2 font-bold px-2">
                                <span>Price (USD)</span>
                                <span className="text-right">Qty</span>
                            </div>
                            {/* Asks (Sell) - Reverse to show lowest ask at bottom */}
                            <div className="flex flex-col-reverse justify-end mb-2">
                                {orderBook?.ask.slice(0, 10).map((ask, i) => (
                                    <div key={i} className="grid grid-cols-2 px-2 py-0.5 hover:bg-white/5 rounded relative">
                                        <span className="text-red-400">{parseFloat(ask.price).toFixed(2)}</span>
                                        <span className="text-right text-gray-300">{parseFloat(ask.qty).toFixed(4)}</span>
                                        <div className="absolute right-0 top-0 bottom-0 bg-red-500/10" style={{ width: `${Math.min(parseFloat(ask.qty) * 10, 100)}%` }} />
                                    </div>
                                ))}
                            </div>

                            <div className="py-2 text-center border-y border-white/5 font-bold text-lg text-white">
                                {formatCurrency(market.marketStats.lastPrice)}
                            </div>

                            {/* Bids (Buy) */}
                            <div>
                                {orderBook?.bid.slice(0, 10).map((bid, i) => (
                                    <div key={i} className="grid grid-cols-2 px-2 py-0.5 hover:bg-white/5 rounded relative">
                                        <span className="text-green-400">{parseFloat(bid.price).toFixed(2)}</span>
                                        <span className="text-right text-gray-300">{parseFloat(bid.qty).toFixed(4)}</span>
                                        <div className="absolute right-0 top-0 bottom-0 bg-green-500/10" style={{ width: `${Math.min(parseFloat(bid.qty) * 10, 100)}%` }} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Trades Table */}
                <div className="mt-6 bg-[#0A0A0A] border border-white/10 rounded-3xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Clock size={18} className="text-orange-400" />
                        Recent Trades
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="text-gray-500 border-b border-white/5">
                                    <th className="pb-4 pl-4">Time</th>
                                    <th className="pb-4">Side</th>
                                    <th className="pb-4 text-right">Price</th>
                                    <th className="pb-4 text-right">Amount</th>
                                    <th className="pb-4 text-right pr-4">Total Value</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {trades.map((trade) => (
                                    <tr key={trade.i} className="hover:bg-white/5 transition-colors font-mono">
                                        <td className="py-3 pl-4 text-gray-400">{formatTime(trade.T)}</td>
                                        <td className={`py-3 font-bold ${trade.S === 'BUY' ? 'text-extended-green' : 'text-red-500'}`}>
                                            {trade.S}
                                        </td>
                                        <td className="py-3 text-right">{formatCurrency(trade.p)}</td>
                                        <td className="py-3 text-right text-gray-300">{parseFloat(trade.q).toFixed(4)}</td>
                                        <td className="py-3 text-right pr-4 text-gray-500">
                                            {(parseFloat(trade.p) * parseFloat(trade.q)).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
