import { marketIndicators, marketSummary, type MarketIndicator } from "@/data/market";
import type { ProviderResult } from "./types";

export interface MarketDataProvider {
  getIndicators(): Promise<ProviderResult<MarketIndicator[]>>;
}

class MockMarketProvider implements MarketDataProvider {
  async getIndicators(): Promise<ProviderResult<MarketIndicator[]>> {
    return {
      data: marketIndicators,
      source: {
        provider: "mock",
        isMock: true,
        label: "EconFlow MVP 예시 데이터",
        fetchedAt: marketSummary.updatedAt,
      },
    };
  }
}

export const getMarketProvider = (): MarketDataProvider => new MockMarketProvider();

export async function getMarketData() {
  return getMarketProvider().getIndicators();
}
