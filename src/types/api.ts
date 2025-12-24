export interface MarketStats {
    dailyVolume: string;
    dailyVolumeBase: string;
    dailyPriceChange: string;
    dailyPriceChangePercentage: string;
    dailyLow: string;
    dailyHigh: string;
    lastPrice: string;
    askPrice: string;
    bidPrice: string;
    markPrice: string;
    indexPrice: string;
    fundingRate: string;
    nextFundingRate: number;
    openInterest: string;
    openInterestBase: string;
}

export interface Market {
    name: string;
    uiName: string;
    category: string;
    assetName: string;
    assetPrecision: number;
    collateralAssetName: string;
    active: boolean;
    status: string;
    marketStats: MarketStats;
}

export interface APIResponse {
    status: string;
    data: Market[];
}

export interface OrderBookEntry {
    qty: string;
    price: string;
}

export interface OrderBook {
    market: string;
    bid: OrderBookEntry[];
    ask: OrderBookEntry[];
}

export interface Trade {
    i: number; // id
    m: string; // market
    S: 'BUY' | 'SELL'; // side
    tT: 'TRADE' | 'LIQUIDATION'; // trade type
    T: number; // timestamp
    p: string; // price
    q: string; // quantity
}

export interface Candle {
    o: string; // open
    l: string; // low
    h: string; // high
    c: string; // close
    v: string; // volume
    T: number; // timestamp
}
