export type ProviderSource = {
  provider: "mock" | "naver" | "fred" | "ecos";
  isMock: boolean;
  label: string;
  fetchedAt: string;
};

export type ProviderResult<T> = {
  data: T;
  source: ProviderSource;
};
