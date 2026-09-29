import model from "../data/model.json";

// Rates come from src/data/model.json, generated from src/mcps/energy_estimate.py.
export type Tokens = { input: number; output: number; cacheRead: number; cacheWrite: number };
export type TokenKind = keyof Tokens;

export const TOKEN_KINDS: TokenKind[] = ["input", "output", "cacheRead", "cacheWrite"];

const RATES_WH_PER_MTOK: Record<TokenKind, number> = {
  input: model.rates_wh_per_mtok.input,
  output: model.rates_wh_per_mtok.output,
  cacheRead: model.rates_wh_per_mtok.cache_read,
  cacheWrite: model.rates_wh_per_mtok.cache_write,
};

export const DEFAULT_INTENSITY_GCO2_PER_KWH = model.default_intensity_gco2_per_kwh;
export const EQUIVALENTS = model.equivalents;

export function energyKwhByKind(tokens: Tokens): Record<TokenKind, number> {
  const out = {} as Record<TokenKind, number>;
  for (const kind of TOKEN_KINDS) out[kind] = (tokens[kind] * RATES_WH_PER_MTOK[kind]) / 1e6 / 1000;
  return out;
}

export function estimateEnergyKwh(tokens: Tokens): number {
  const byKind = energyKwhByKind(tokens);
  return TOKEN_KINDS.reduce((sum, kind) => sum + byKind[kind], 0);
}

export function kwhToCo2Kg(kwh: number, intensityGco2PerKwh: number): number {
  return (kwh * intensityGco2PerKwh) / 1000;
}

export function co2Comparisons(kgCo2: number) {
  return EQUIVALENTS.map((eq) => ({ ...eq, count: kgCo2 / eq.kg_co2 }));
}
