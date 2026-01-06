import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowRight, ShieldCheck, Send, Wallet, MessageSquare, User, Info, CheckCircle } from 'lucide-react';


// Sample Data Generators
const CHART_DATA_SETS = {
    '7D': [],
    '14D': [],
    '30D': [],
    'ALL': [],
};

const MOCK_ORDERBOOK = {
    asks: [] as { price: number; notional: number; size: number }[],
    bids: [] as { price: number; notional: number; size: number }[]
};

const MOCK_TRADES: any[] = [];

const MOCK_REVIEWS: any[] = [];

export function ExtendedOTC() {
    const [timeRange, setTimeRange] = useState<'7D' | '14D' | '30D' | 'ALL'>('7D');
    const multisig = "0x653645A075F127870b821bD4154E6a9538D3F4aA";

    const currentData = CHART_DATA_SETS[timeRange];
    // const currentPrice = currentData[currentData.length - 1].price;
    // const startPrice = currentData[0].price;
    const percentChange = 0; // ((currentPrice - startPrice) / startPrice) * 100;

    return (
        <div className="min-h-screen bg-transparent font-sans text-white relative overflow-x-hidden">

            <div className="relative z-10 container mx-auto px-4 max-w-7xl pt-24 pb-24 space-y-8">

                {/* Header Section with Title */}
                <div className="flex flex-col items-center justify-center gap-2 pb-8 text-center relative group">
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                        Extended OTC
                    </h1>
                    <div className="h-1 w-24 bg-gradient-to-r from-transparent via-extended-green to-transparent rounded-full opacity-50" />
                    <p className="text-gray-400 text-lg max-w-2xl mt-2">
                        The community market for Extended XP
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <StatCard label="AVERAGE PRICE" value="-" highlighted />
                    <StatCard label="MIN PRICE" value="-" />
                    <StatCard label="MAX PRICE" value="-" />
                    <StatCard label="VOLUME" value="-" />
                </div>

                {/* Content Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Chart Area */}
                    <div className="lg:col-span-2 bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 relative overflow-hidden group hover:border-extended-green/30 transition-all duration-500 min-h-[400px] flex flex-col">
                        {/* Ambient Glow */}
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-extended-green/5 rounded-full blur-[100px] pointer-events-none" />

                        <div className="flex flex-col md:flex-row items-center justify-between mb-8 relative z-10 gap-4">
                            <div className="flex items-center gap-3 self-start md:self-auto">
                                <div className="w-2 h-8 bg-extended-green rounded-full shadow-[0_0_10px_#00ff00]" />
                                <h3 className="text-xl font-bold text-white">XP Price Action</h3>
                            </div>

                            <div className="flex items-center gap-4 self-end md:self-auto">
                                {/* Time Filter Moved Here */}
                                <div className="inline-flex bg-white/5 p-1 rounded-xl border border-white/10 backdrop-blur-sm scale-90 origin-right">
                                    {(['7D', '14D', '30D', 'ALL'] as const).map((range) => (
                                        <button
                                            key={range}
                                            onClick={() => setTimeRange(range)}
                                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${timeRange === range
                                                ? 'bg-extended-green text-black shadow-[0_0_20px_rgba(0,255,0,0.3)]'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>

                                <span className={`text-sm font-bold px-3 py-1 rounded-full border ${percentChange >= 0
                                    ? 'text-extended-green bg-extended-green/10 border-extended-green/20'
                                    : 'text-red-500 bg-red-500/10 border-red-500/20'
                                    }`}>
                                    {percentChange >= 0 ? '+' : ''}{percentChange.toFixed(2)}%
                                </span>
                            </div>
                        </div>

                        {currentData.length === 0 ? (
                            <div className="flex-1 w-full flex items-center justify-center border border-dashed border-white/10 rounded-2xl bg-white/5 mx-auto">
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                                        <span className="text-2xl">📉</span>
                                    </div>
                                    <p className="text-gray-400 font-bold">Coming Soon</p>
                                    <p className="text-xs text-gray-600">Market data will appear here once trades occur.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[350px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={currentData}>
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
                                            tick={{ fill: '#444', fontSize: 12, fontWeight: 700 }}
                                            axisLine={false}
                                            tickLine={false}
                                            tickFormatter={(val) => `$${val.toFixed(2)}`}
                                        />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#0F0F0F', border: '1px solid #222', borderRadius: '12px', boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)' }}
                                            itemStyle={{ color: '#fff', fontWeight: 'bold' }}
                                            labelStyle={{ color: '#888', marginBottom: '0.25rem' }}
                                            labelFormatter={(label, payload) => {
                                                if (payload && payload.length > 0) {
                                                    return payload[0].payload.fullDate;
                                                }
                                                return label;
                                            }}
                                            formatter={(value: number | undefined) => [value ? `$${value.toFixed(2)}` : '', 'Price']}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="price"
                                            stroke="#00FF00"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorPrice)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>

                    {/* Quick Trade / Info Panel */}
                    {/* Sell your XP Form */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6 relative overflow-hidden group hover:border-extended-green/30 transition-all duration-500">
                        {/* Dollar Sign Watermark */}
                        <div className="absolute -top-4 -right-2 text-[#1A1A1A] font-black text-[12rem] leading-none select-none pointer-events-none z-0 rotate-12">
                            $
                        </div>

                        <div className="relative z-10">
                            <h3 className="text-2xl font-bold text-white mb-2">Sell your XP</h3>
                            <p className="text-sm text-gray-400">Get instant liquidity for your Paradex points via our trusted OTC desk.</p>
                        </div>

                        <div className="space-y-5 relative z-10 mt-2">
                            {/* XP Amount Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-extended-green uppercase tracking-wide">XP AMOUNT</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g. 10000"
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-gray-600 focus:outline-none focus:border-extended-green/50 transition-colors font-bold text-lg"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">XP</span>
                                </div>
                            </div>

                            {/* Price Per XP Input */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-extended-green uppercase tracking-wide">PRICE PER XP</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="e.g. 2.45"
                                        className="w-full bg-black/50 border border-white/10 rounded-2xl py-4 px-5 text-white placeholder-gray-600 focus:outline-none focus:border-extended-green/50 transition-colors font-bold text-lg"
                                    />
                                    <span className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">USDC</span>
                                </div>
                            </div>

                            {/* Create Offer Button */}
                            <a href="https://t.me/extended_otc" target="_blank" rel="noreferrer" className="w-full py-4 bg-extended-green hover:bg-[#00cc00] text-black font-black text-lg rounded-2xl transition-all shadow-[0_0_20px_rgba(0,255,0,0.3)] flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] mt-4 tracking-wide uppercase group cursor-pointer border-b-4 border-black/20">
                                <Send size={20} className="group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />
                                CREATE OFFER
                            </a>

                            <div className="flex items-center justify-center gap-2 text-gray-500 text-xs mt-2">
                                <Info size={14} />
                                <span>Secure transaction via Telegram</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Market Data */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Orderbook */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <Wallet className="text-extended-green" size={20} />
                                Live Orderbook
                            </h3>
                            {MOCK_ORDERBOOK.asks.length > 0 || MOCK_ORDERBOOK.bids.length > 0 ? (
                                <div className="px-3 py-1 bg-extended-green/10 text-extended-green text-xs font-bold rounded border border-extended-green/20 shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                                    MID $2.42
                                </div>
                            ) : null}
                        </div>

                        {MOCK_ORDERBOOK.asks.length === 0 && MOCK_ORDERBOOK.bids.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2">
                                    <Wallet size={20} className="text-gray-500" />
                                </div>
                                <p className="text-gray-500 font-bold">Coming Soon</p>
                                <p className="text-xs text-gray-600">The orderbook is currently empty.</p>
                            </div>
                        ) : (
                            <div className="space-y-1 text-sm font-mono flex-1">
                                <div className="flex justify-between text-[10px] text-gray-500 mb-2 uppercase tracking-wider px-2 font-bold">
                                    <span>Price</span>
                                    <span>Notional</span>
                                    <span>Size (XP)</span>
                                </div>
                                {/* Asks */}
                                <div className="flex flex-col-reverse justify-end gap-1">
                                    {MOCK_ORDERBOOK.asks.map((ask, i) => (
                                        <div key={i} className="flex justify-between py-2 px-3 hover:bg-red-500/10 cursor-pointer rounded-lg transition-all relative group">
                                            <div className="absolute left-0 top-0 bottom-0 bg-red-500/20 rounded-l-lg transition-all" style={{ width: `${Math.random() * 40}%` }} />
                                            <span className="text-red-400 relative z-10 font-bold">${ask.price.toFixed(2)}</span>
                                            <span className="text-gray-400 relative z-10 opacity-70">${ask.notional.toLocaleString()}</span>
                                            <span className="text-white relative z-10 font-bold">{ask.size.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>

                                <div className="py-4 flex items-center justify-center gap-4 opacity-50">
                                    <div className="h-px bg-current flex-1" />
                                    <span className="text-[10px] uppercase tracking-widest font-bold text-extended-green">Spread 0.01</span>
                                    <div className="h-px bg-current flex-1" />
                                </div>

                                {/* Bids */}
                                <div className="gap-1 flex flex-col">
                                    {MOCK_ORDERBOOK.bids.map((bid, i) => (
                                        <div key={i} className="flex justify-between py-2 px-3 hover:bg-extended-green/10 cursor-pointer rounded-lg transition-all relative group">
                                            <div className="absolute left-0 top-0 bottom-0 bg-extended-green/20 rounded-l-lg transition-all" style={{ width: `${Math.random() * 40}%` }} />
                                            <span className="text-extended-green relative z-10 font-bold">${bid.price.toFixed(2)}</span>
                                            <span className="text-gray-400 relative z-10 opacity-70">${bid.notional.toLocaleString()}</span>
                                            <span className="text-white relative z-10 font-bold">{bid.size.toLocaleString()}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Trades */}
                    <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                <span className="text-extended-green text-xl">⚡</span>
                                Recent Trades
                            </h3>
                            {MOCK_TRADES.length > 0 ? (
                                <div className="flex gap-2">
                                    <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-gray-400 transition-colors border border-white/5"><ArrowRight size={14} className="rotate-180" /></button>
                                    <button className="w-8 h-8 flex items-center justify-center hover:bg-white/10 rounded-lg text-gray-400 transition-colors border border-white/5"><ArrowRight size={14} /></button>
                                </div>
                            ) : null}
                        </div>

                        {MOCK_TRADES.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2 opacity-50">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mb-2">
                                    <span className="text-xl">⏱️</span>
                                </div>
                                <p className="text-gray-500 font-bold">Coming Soon</p>
                                <p className="text-xs text-gray-600">Transactions will appear here in real-time.</p>
                            </div>
                        ) : (
                            <div className="overflow-hidden">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className="text-[10px] text-gray-500 uppercase border-b border-white/5 tracking-wider">
                                            <th className="text-left py-4 px-2 font-bold">Date</th>
                                            <th className="text-right py-4 px-2 font-bold">Size</th>
                                            <th className="text-right py-4 px-2 font-bold">Total</th>
                                            <th className="text-right py-4 px-2 font-bold">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="font-mono">
                                        {MOCK_TRADES.map((trade, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                                <td className="py-4 px-2 text-gray-400 group-hover:text-white transition-colors capitalize">{trade.date}</td>
                                                <td className="py-4 px-2 text-right text-white font-bold">{trade.size.toLocaleString()} XP</td>
                                                <td className="py-4 px-2 text-right text-gray-500 group-hover:text-gray-300">${trade.total.toLocaleString()}</td>
                                                <td className="py-4 px-2 text-right text-extended-green font-bold text-shadow-glow">${trade.price.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* How It Works Section */}
                <div className="pt-8">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-2 bg-extended-green/10 rounded-lg">
                            <ShieldCheck className="text-extended-green" size={24} />
                        </div>
                        <h2 className="text-3xl font-black text-white tracking-tight">How It Works</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Step 1 */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 relative group hover:border-extended-green/50 transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 shadow-lg hover:shadow-extended-green/10">
                            <div className="absolute top-6 left-6 w-10 h-10 bg-extended-green rounded-xl text-black font-black text-lg flex items-center justify-center shadow-[0_4px_20px_rgba(0,255,0,0.3)] group-hover:scale-110 transition-transform">
                                1
                            </div>
                            <div className="mt-12">
                                <h3 className="text-xl font-bold text-white mb-3">Initiate Trade</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    XP are transferable. Buyers deposit 100% collateral (USDC) to our secure multisig wallet to start the process.
                                </p>
                            </div>
                            <div className="mt-6 p-4 bg-black/50 rounded-xl border border-white/5 hover:border-extended-green/30 transition-colors">
                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1 block">OFFICIAL MULTISIG</span>
                                <a
                                    href="https://arbiscan.io/address/0x653645A075F127870b821bD4154E6a9538D3F4aA"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-sm text-extended-green font-mono break-all font-bold hover:underline flex items-center gap-2"
                                >
                                    {multisig}
                                    <ArrowRight size={12} className="-rotate-45" />
                                </a>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 relative group hover:border-extended-green/50 transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 shadow-lg hover:shadow-extended-green/10">
                            <div className="absolute top-6 left-6 w-10 h-10 bg-white/10 rounded-xl text-white font-black text-lg flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform group-hover:border-extended-green/50 group-hover:text-extended-green">
                                2
                            </div>
                            <div className="mt-12">
                                <h3 className="text-xl font-bold text-white mb-3">Place Order</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Contact <a href="https://t.me/extended_otc" target="_blank" className="text-extended-green hover:underline font-bold">@extended_otc</a> on Telegram with your bid/ask details. We handle all sizes with no minimums.
                                </p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-8 relative group hover:border-extended-green/50 transition-all duration-300 hover:scale-[1.02] hover:bg-white/5 shadow-lg hover:shadow-extended-green/10">
                            <div className="absolute top-6 left-6 w-10 h-10 bg-white/10 rounded-xl text-white font-black text-lg flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform group-hover:border-extended-green/50 group-hover:text-extended-green">
                                3
                            </div>
                            <div className="mt-12">
                                <h3 className="text-xl font-bold text-white mb-3">Settlement</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    Funds are secured. Seller transfers XP. Funds are released. Simple, fast, and secure escrow service.
                                </p>
                            </div>
                            <div className="mt-6 flex flex-row flex-wrap gap-2">
                                <div className="px-4 py-2 bg-extended-green/10 border border-extended-green/30 rounded-lg text-xs font-bold text-extended-green shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                                    2% Fee $500 - $50k
                                </div>
                                <div className="px-4 py-2 bg-extended-green/10 border border-extended-green/30 rounded-lg text-xs font-bold text-extended-green shadow-[0_0_10px_rgba(0,255,0,0.1)]">
                                    1% Fee &gt;$50k
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Profile Header Card (Moved here) */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-extended-green/5 rounded-full blur-[120px] pointer-events-none" />

                    {/* Logo */}
                    <div className="relative shrink-0">
                        <div className="absolute inset-0 bg-extended-green rounded-full blur-md opacity-20 animate-pulse" />
                        <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-white/10 to-transparent border border-white/10 relative z-10">
                            <img
                                src="/assets/otc_logo.jpg"
                                alt="Extended OTC"
                                className="w-full h-full object-cover rounded-full"
                            />
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-center md:text-left space-y-4 relative z-10">
                        <div>
                            <h1 className="text-3xl font-black text-white flex flex-col md:flex-row items-center md:items-end gap-3 justify-center md:justify-start">
                                ExtendedOTC
                                <span className="text-extended-green text-lg font-bold">@extended_otc</span>
                            </h1>
                            <p className="text-gray-400 mt-2 max-w-2xl leading-relaxed">
                                The OTC market to buy and sell Extended XPs. Also a community hub to share and discuss about Extended-related topics. Community owned OTC market.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <a
                                href="https://x.com/ExtendedOTC1"
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-2 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                Follow on X
                            </a>
                            <a
                                href="https://t.me/extended_otc"
                                target="_blank"
                                rel="noreferrer"
                                className="px-6 py-2 bg-extended-green/10 text-extended-green border border-extended-green/20 font-bold rounded-full hover:bg-extended-green/20 transition-colors flex items-center gap-2"
                            >
                                <Send size={16} />
                                Join Telegram
                            </a>
                        </div>
                    </div>
                </div>

                {/* Community Trust Section */}
                <div className="pt-8 mb-12">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <MessageSquare className="text-purple-400" size={24} />
                            </div>
                            <h2 className="text-3xl font-black text-white tracking-tight">Community Trust</h2>
                        </div>
                        <div className="flex gap-2">
                            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
                                <ArrowRight size={18} className="rotate-180" />
                            </button>
                            <button className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    </div>



                    {/* Reviews Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {MOCK_REVIEWS.length === 0 ? (
                            <div className="col-span-full text-center py-12 bg-[#0A0A0A] border border-white/10 rounded-3xl">
                                <p className="text-gray-500 font-bold">Reviews Coming Soon</p>
                            </div>
                        ) : (
                            MOCK_REVIEWS.map((review, i) => (
                                <div key={i} className="bg-[#0A0A0A] border border-white/10 rounded-3xl p-6 relative group hover:border-extended-green/30 transition-all">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/10 flex items-center justify-center">
                                                <User size={18} className="text-gray-400" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold text-white text-sm">{review.user}</span>
                                                    {review.verified && <CheckCircle size={12} className="text-extended-green fill-extended-green/20" />}
                                                </div>
                                                <span className="text-xs text-gray-500 block">{review.handle}</span>
                                            </div>
                                        </div>
                                        <span className="text-xs text-gray-600 font-mono">{review.time}</span>
                                    </div>

                                    <p className="text-gray-300 text-sm leading-relaxed mb-4">
                                        "{review.text}"
                                    </p>

                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <div key={star} className="w-1.5 h-1.5 rounded-full bg-extended-green shadow-[0_0_5px_#00ff00]" />
                                        ))}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Info Text */}
                <div className="text-center pt-8 border-t border-white/5">
                    <p className="text-gray-500 text-sm">
                        Extended OTC is a community-run initiative. Always verify keys. <br />
                        Join the <a href="https://t.me/extended_otc" className="text-extended-green hover:underline">Telegram Channel</a> for support.
                    </p>
                </div>
            </div>
        </div>
    );
}

function StatCard({ label, value, highlighted = false }: { label: string, value: string, highlighted?: boolean }) {
    return (
        <div className={`bg-[#0A0A0A] border rounded-2xl p-6 flex flex-col gap-1 transition-all duration-300 group relative overflow-hidden hover:scale-105 hover:bg-white/5 ${highlighted ? 'border-extended-green/20 shadow-[0_0_30px_rgba(0,255,0,0.05)]' : 'border-white/10'
            }`}>
            {highlighted && <div className="absolute -top-10 -right-10 w-32 h-32 bg-extended-green/10 rounded-full blur-2xl group-hover:bg-extended-green/20 transition-colors" />}
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider group-hover:text-gray-400 transition-colors">{label}</span>
            <span className={`text-3xl font-black tracking-tight ${highlighted ? 'text-extended-green' : 'text-white'} group-hover:text-extended-green transition-colors`}>
                {value === '-' ? <span className="text-2xl opacity-50">--</span> : value}
            </span>
        </div>
    );
}
