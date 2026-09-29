import { describe, expect, it } from "vitest";
import { co2Comparisons, estimateEnergyKwh, kwhToCo2Kg } from "./energy";

const zero = { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };

// Same pinned values as tests/test_dashboard_data.py.
describe("energy model parity with Python", () => {
  it("1M input + 1M output = 7.68 kWh", () => {
    expect(estimateEnergyKwh({ ...zero, input: 1e6, output: 1e6 })).toBeCloseTo(7.68);
  });
  it("1M cache read = 0.128 kWh", () => {
    expect(estimateEnergyKwh({ ...zero, cacheRead: 1e6 })).toBeCloseTo(0.128);
  });
  it("1M cache write = 1.6 kWh", () => {
    expect(estimateEnergyKwh({ ...zero, cacheWrite: 1e6 })).toBeCloseTo(1.6);
  });
});

describe("carbon", () => {
  it("converts kWh to kgCO2e", () => {
    expect(kwhToCo2Kg(10, 141)).toBeCloseTo(1.41);
  });
  it("counts equivalents", () => {
    const flights = co2Comparisons(261).find((c) => c.id === "short_haul_flight");
    expect(flights?.count).toBeCloseTo(1);
  });
});
