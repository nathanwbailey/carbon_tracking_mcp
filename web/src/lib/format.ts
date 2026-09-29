export function formatNumber(n: number, digits = 3): string {
  if (n === 0) return "0";
  if (Math.abs(n) >= 1000) return n.toLocaleString("en-GB", { maximumFractionDigits: 0 });
  return Number(n.toPrecision(digits)).toLocaleString("en-GB", { maximumFractionDigits: 6 });
}

export function formatTokens(n: number): string {
  if (n >= 1e12) return `${formatNumber(n / 1e12, 3)}T`;
  if (n >= 1e9) return `${formatNumber(n / 1e9, 3)}B`;
  if (n >= 1e6) return `${formatNumber(n / 1e6, 3)}M`;
  if (n >= 1e3) return `${formatNumber(n / 1e3, 3)}K`;
  return String(Math.round(n));
}

export function formatEnergy(kwh: number): string {
  if (kwh >= 1e6) return `${formatNumber(kwh / 1e6)} GWh`;
  if (kwh >= 1e3) return `${formatNumber(kwh / 1e3)} MWh`;
  if (kwh >= 1) return `${formatNumber(kwh)} kWh`;
  return `${formatNumber(kwh * 1000)} Wh`;
}

export function formatCo2(kg: number): string {
  if (kg >= 1000) return `${formatNumber(kg / 1000)} tCO2e`;
  if (kg >= 1) return `${formatNumber(kg)} kgCO2e`;
  return `${formatNumber(kg * 1000)} gCO2e`;
}
