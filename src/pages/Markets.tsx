import { useState, useEffect } from 'react';
import type { Market, APIResponse } from '../types/api';
import { Search, ArrowUpRight, ArrowDownRight, TrendingUp, Activity, BarChart3, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

const AnimatedValue = ({ value, className }: { value: React.ReactNode, className?: string }) => (
    <motion.div
        key={String(value)}
        initial={{ opacity: 0.5, y: -5, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={className}
    >
        {value}
    </motion.div>
);


export function Markets() {
    const [markets, setMarkets] = useState<Market[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'ALL' | 'L1' | 'Meme' | 'DeFi' | 'AI' | 'TradFi'>('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [tvl, setTvl] = useState<number | null>(null);
    const [fees, setFees] = useState<number | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        const fetchMarkets = async () => {
            try {
                const marketsRes = await fetch('/api/v1/info/markets');
                const data: APIResponse = await marketsRes.json();
                if (data.status === 'OK') {
                    setMarkets(data.data);
                }
                setLastUpdated(new Date());
            } catch (error) {
                console.error('Failed to fetch markets', error);
            } finally {
                setLoading(false);
            }
        };

        const fetchDefiLlamaStats = async () => {
            try {
                // Fetch TVL
                const tvlRes = await fetch('https://api.llama.fi/protocol/extended');
                const tvlData = await tvlRes.json();
                if (tvlData.currentChainTvls) {
                    const totalTvl = Object.values(tvlData.currentChainTvls).reduce((acc: number, val: any) => acc + val, 0);
                    setTvl(totalTvl as number);
                }

                // Fetch Fees
                const feesRes = await fetch('https://api.llama.fi/summary/fees/extended?dataType=dailyFees');
                const feesData = await feesRes.json();
                if (feesData.total24h) {
                    setFees(feesData.total24h);
                }
            } catch (error) {
                console.error('Failed to fetch DefiLlama stats', error);
            }
        };

        fetchMarkets();
        fetchDefiLlamaStats();
        const interval = setInterval(() => {
            fetchMarkets();
            fetchDefiLlamaStats();
        }, 30000); // Sync markets/stats every 30s

        return () => clearInterval(interval);
    }, []);

    const filteredMarkets = markets.filter(market => {
        const matchesCategory = filter === 'ALL' || market.category === filter;
        const matchesSearch = market.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            market.assetName.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    // Sort by Volume for default view
    const sortedMarkets = [...filteredMarkets].sort((a, b) =>
        parseFloat(b.marketStats.dailyVolume) - parseFloat(a.marketStats.dailyVolume)
    );

    const formatCurrency = (val: string | number) => {
        const num = typeof val === 'string' ? parseFloat(val) : val;
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: num < 1 ? 4 : 2,
            maximumFractionDigits: num < 1 ? 4 : 2,
        }).format(num);
    };

    const formatLargeCurrency = (val: number) => {
        if (val >= 1_000_000_000) {
            return '$' + (val / 1_000_000_000).toFixed(2) + 'B';
        }
        if (val >= 1_000_000) {
            return '$' + (val / 1_000_000).toFixed(2) + 'M';
        }
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(val);
    };

    const formatPct = (val: string) => {
        const num = parseFloat(val) * 100;
        return `${num > 0 ? '+' : ''}${num.toFixed(2)}%`;
    };

    // Calculate Global Stats
    const totalVolume24h = markets.reduce((acc, market) => acc + parseFloat(market.marketStats.dailyVolume), 0);
    const totalOpenInterest = markets.reduce((acc, market) => acc + parseFloat(market.marketStats.openInterest), 0);
    const activeMarketsValue = markets.length;

    // Calculate Top Cards
    const topGainer = [...markets].sort((a, b) => parseFloat(b.marketStats.dailyPriceChangePercentage) - parseFloat(a.marketStats.dailyPriceChangePercentage))[0];
    const topLoser = [...markets].sort((a, b) => parseFloat(a.marketStats.dailyPriceChangePercentage) - parseFloat(b.marketStats.dailyPriceChangePercentage))[0];
    const topVolume = [...markets].sort((a, b) => parseFloat(b.marketStats.dailyVolume) - parseFloat(a.marketStats.dailyVolume))[0];
    const topFunding = [...markets].sort((a, b) => parseFloat(b.marketStats.fundingRate) - parseFloat(a.marketStats.fundingRate))[0];


    return (
        <div className="min-h-screen bg-transparent font-sans text-white relative overflow-x-hidden pb-24 selection:bg-extended-green selection:text-black">


            <div className="relative z-10 container mx-auto px-4 pt-24 max-w-7xl">

                {/* Header - Centered */}
                <div className="flex flex-col items-center justify-center text-center gap-4 mb-12">
                    <div className="flex items-center gap-3 mb-2 justify-center">
                        <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
                            Markets <span className="text-extended-green">Explorer</span>
                        </h1>
                        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-extended-green/10 border border-extended-green/20 mt-1">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-extended-green opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-extended-green"></span>
                            </span>
                            <span className="text-[10px] font-bold text-extended-green uppercase tracking-wider">
                                LIVE SYNC
                            </span>
                        </div>
                    </div>
                    <p className="text-gray-400 max-w-xl text-center font-medium tracking-wide">
                        Real-time analytics across the entire Extended ecosystem.
                        {lastUpdated && (
                            <span className="text-xs text-gray-600 font-mono ml-2">
                                Updated: {lastUpdated.toLocaleTimeString()}
                            </span>
                        )}
                    </p>
                </div>

                {/* Global Stats Banner - Clean Text Cards */}
                {!loading && (
                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total 24h Volume</h3>
                            <AnimatedValue
                                value={formatLargeCurrency(totalVolume24h)}
                                className="text-2xl md:text-3xl font-black text-white tracking-tighter"
                            />
                        </div>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Open Interest</h3>
                            <AnimatedValue
                                value={formatLargeCurrency(totalOpenInterest)}
                                className="text-2xl md:text-3xl font-black text-white tracking-tighter"
                            />
                        </div>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Active Markets</h3>
                            <AnimatedValue
                                value={activeMarketsValue}
                                className="text-2xl md:text-3xl font-black text-white tracking-tighter"
                            />
                        </div>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">24h Fees</h3>
                            <AnimatedValue
                                value={fees ? formatLargeCurrency(fees) : formatLargeCurrency(totalVolume24h * 0.0005)}
                                className="text-2xl md:text-3xl font-black text-white tracking-tighter"
                            />
                        </div>
                        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden transition-all">
                            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">TVL</h3>
                            <AnimatedValue
                                value={tvl ? formatLargeCurrency(tvl) : formatLargeCurrency(totalOpenInterest * 3.5)}
                                className="text-2xl md:text-3xl font-black text-white tracking-tighter"
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp size={20} className="text-extended-green" />
                    <h2 className="text-xl font-bold text-white">Market Highlights</h2>
                </div>

                {/* Highlights Grid - Flat */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
                        <HighlightCard
                            title="Top Gainer (24h)"
                            market={topGainer}
                            icon={<TrendingUp className="text-extended-green" />}
                            type="gainer"
                        />
                        <HighlightCard
                            title="Biggest Dip (24h)"
                            market={topLoser}
                            icon={<TrendingDown className="text-red-500" />}
                            type="loser"
                        />
                        <HighlightCard
                            title="Highest Volume (24h)"
                            market={topVolume}
                            icon={<Activity className="text-blue-400" />}
                            type="volume"
                        />
                        <HighlightCard
                            title="Highest Funding"
                            market={topFunding}
                            icon={<BarChart3 className="text-purple-400" />}
                            type="funding"
                        />
                    </div>
                )}

                {/* Filters & Search - Flat */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6 bg-white/5 p-2 rounded-2xl border border-white/10 backdrop-blur-sm">
                    <div className="flex items-center gap-1 overflow-x-auto w-full md:w-auto p-1">
                        {(['ALL', 'L1', 'Meme', 'DeFi', 'AI', 'TradFi'] as const).map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${filter === cat
                                    ? 'bg-extended-green text-black shadow-lg shadow-extended-green/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    <div className="relative w-full md:w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-extended-green transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Search asset..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-extended-green/50 transition-all"
                        />
                    </div>
                </div>

                {/* Market Table - Flat */}
                <div className="bg-[#0A0A0A] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
                                    <th className="p-6 font-bold">Asset</th>
                                    <th className="p-6 font-bold text-right">Price</th>
                                    <th className="p-6 font-bold text-right">24h Change</th>
                                    <th className="p-6 font-bold text-right">24h Volume</th>
                                    <th className="p-6 font-bold text-right">Open Interest</th>
                                    <th className="p-6 font-bold text-right hidden md:table-cell">Funding</th>
                                    <th className="p-6 font-bold text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="p-12 text-center text-gray-500">
                                            Loading markets...
                                        </td>
                                    </tr>
                                ) : sortedMarkets.map((market) => (
                                    <tr key={market.name} className="group hover:bg-white/5 transition-colors">
                                        <td className="p-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center font-bold text-sm border border-white/5">
                                                    {market.assetName[0]}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-white flex items-center gap-2">
                                                        {market.uiName}
                                                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-white/10 text-gray-400 border border-white/5 font-mono">
                                                            {market.category}
                                                        </span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 font-mono mt-0.5">
                                                        Perpetual
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right font-mono font-bold text-white text-lg">
                                            {formatCurrency(market.marketStats.lastPrice)}
                                        </td>
                                        <td className="p-6 text-right font-mono font-bold">
                                            <span className={`inline-flex items-center gap-1 ${parseFloat(market.marketStats.dailyPriceChangePercentage) >= 0
                                                ? 'text-extended-green'
                                                : 'text-red-500'
                                                }`}>
                                                {parseFloat(market.marketStats.dailyPriceChangePercentage) >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                                {formatPct(market.marketStats.dailyPriceChangePercentage)}
                                            </span>
                                        </td>
                                        <td className="p-6 text-right font-mono text-gray-300">
                                            ${parseFloat(market.marketStats.dailyVolume).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-6 text-right font-mono text-gray-300">
                                            ${parseFloat(market.marketStats.openInterest).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </td>
                                        <td className="p-6 text-right font-mono text-orange-400 hidden md:table-cell">
                                            {(parseFloat(market.marketStats.fundingRate) * 100).toFixed(4)}%
                                        </td>
                                        <td className="p-6 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <a
                                                    href="https://app.extended.exchange/join/RAPIDO"
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="inline-flex px-4 py-2 bg-extended-green hover:bg-[#00cc00] text-black border border-extended-green hover:border-[#00cc00] rounded-lg transition-all font-bold text-xs"
                                                >
                                                    Trade
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="text-center mt-12 text-gray-600 text-sm">
                    <p>Metrics updated in real-time. Unofficial dashboard.</p>
                </div>
            </div>
        </div>
    );
}

function HighlightCard({ title, market, icon, type }: { title: string, market: Market, icon: React.ReactNode, type: 'gainer' | 'volume' | 'funding' | 'loser' }) {
    if (!market) return null;

    const formatCurrency = (val: string) => '$' + parseFloat(val).toLocaleString(undefined, { maximumFractionDigits: 2 });

    let mainValue = '';
    let subValue = '';

    if (type === 'gainer') {
        const pct = parseFloat(market.marketStats.dailyPriceChangePercentage) * 100;
        mainValue = `+${pct.toFixed(2)}%`;
        subValue = `Price: ${formatCurrency(market.marketStats.lastPrice)}`;
    } else if (type === 'loser') {
        const pct = parseFloat(market.marketStats.dailyPriceChangePercentage) * 100;
        mainValue = `${pct.toFixed(2)}%`;
        subValue = `Price: ${formatCurrency(market.marketStats.lastPrice)}`;
    } else if (type === 'volume') {
        const vol = parseFloat(market.marketStats.dailyVolume);
        if (vol >= 1_000_000_000) {
            mainValue = '$' + (vol / 1_000_000_000).toFixed(2) + 'B';
        } else if (vol >= 1_000_000) {
            mainValue = '$' + (vol / 1_000_000).toFixed(2) + 'M';
        } else {
            mainValue = '$' + vol.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        subValue = '24h Volume';
    } else if (type === 'funding') {
        mainValue = `${(parseFloat(market.marketStats.fundingRate) * 100).toFixed(4)}%`;
        subValue = 'Funding Rate (1h)';
    }

    return (
        <div className="bg-[#0A0A0A] border border-white/10 rounded-2xl p-6 relative overflow-hidden group hover:border-extended-green/30 transition-all">
            {/* Background Gradient for Type */}
            {type === 'gainer' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-extended-green to-transparent opacity-50" />
            )}
            {type === 'loser' && (
                <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
            )}

            <div className="relative z-10">
                <div className="absolute top-0 right-0 p-0 opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-500">
                    <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                        {icon}
                    </div>
                </div>

                <p className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-4">{title}</p>

                <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-xs border border-white/5">
                        {market.assetName[0]}
                    </div>
                    <h3 className="text-xl font-bold text-white">{market.uiName}</h3>
                </div>

                <div className={`text-3xl font-black tracking-tighter mb-1 ${type === 'gainer' ? 'text-extended-green' : type === 'loser' ? 'text-red-500' : 'text-white'
                    }`}>
                    {mainValue}
                </div>
                <p className="text-sm text-gray-500 font-mono">{subValue}</p>
            </div>
        </div>
    );
}
