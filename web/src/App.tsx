import { useState } from "react";
import Breakdown from "./components/Breakdown";
import Equivalents from "./components/Equivalents";
import Methodology from "./components/Methodology";
import TokenInput from "./components/TokenInput";
import grid from "./data/grid_intensity.json";
import { estimateEnergyKwh, kwhToCo2Kg, type Tokens } from "./lib/energy";
import { formatCo2, formatEnergy } from "./lib/format";
import { SCENARIOS } from "./lib/scenarios";
import { SERIES_COLORS, useTheme } from "./lib/theme";

const FIELDS: { key: keyof Tokens; label: string; hint: string }[] = [
  { key: "input", label: "Input tokens", hint: "Uncached prompt tokens" },
  { key: "output", label: "Output tokens", hint: "Generated tokens, including reasoning" },
  { key: "cacheRead", label: "Cache read tokens", hint: "Prompt tokens served from cache" },
  { key: "cacheWrite", label: "Cache write tokens", hint: "Prompt tokens written to cache" },
];

export default function App() {
  const [theme, toggleTheme] = useTheme();
  const [tokens, setTokens] = useState<Tokens>(SCENARIOS[1].tokens);
  const [scenarioId, setScenarioId] = useState<string | null>(SCENARIOS[1].id);
  const [regionId, setRegionId] = useState(grid.regions[0].id);

  const region = grid.regions.find((r) => r.id === regionId) ?? grid.regions[0];
  const kwh = estimateEnergyKwh(tokens);
  const kgCo2 = kwhToCo2Kg(kwh, region.gco2_per_kwh);
  const colors = SERIES_COLORS[theme];

  return (
    <main>
      <header>
        <div>
          <h1>AI token carbon impact</h1>
          <p className="lede">
            Enter input, output and cached token counts to estimate the energy and CO2e of AI coding-agent usage.
          </p>
        </div>
        <button type="button" className="link-btn" onClick={toggleTheme}>
          {theme === "light" ? "Dark mode" : "Light mode"}
        </button>
      </header>

      <section className="card" aria-labelledby="scen-h">
        <h2 id="scen-h">Start from a scenario</h2>
        <div className="chips" role="group" aria-label="Scenarios">
          {SCENARIOS.map((s) => (
            <button
              key={s.id}
              type="button"
              className="chip"
              aria-pressed={scenarioId === s.id}
              onClick={() => {
                setTokens(s.tokens);
                setScenarioId(s.id);
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
        <p className="hint">
          {SCENARIOS.find((s) => s.id === scenarioId)?.description ?? "Custom token counts."} Illustrative assumptions.
        </p>
      </section>

      <div className="layout">
        <section className="card" aria-labelledby="calc-h">
          <h2 id="calc-h">Tokens</h2>
          {FIELDS.map((f, i) => (
            <TokenInput
              key={f.key}
              id={f.key}
              label={f.label}
              hint={f.hint}
              color={colors[i]}
              value={tokens[f.key]}
              onChange={(n) => {
                setTokens({ ...tokens, [f.key]: n });
                setScenarioId(null);
              }}
            />
          ))}
          <div className="region">
            <label htmlFor="region">Grid carbon intensity</label>
            <select id="region" value={regionId} onChange={(e) => setRegionId(e.target.value)}>
              {grid.regions.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}: {r.gco2_per_kwh} gCO2/kWh
                </option>
              ))}
            </select>
            <p className="hint">
              {region.year} ·{" "}
              <a href={region.source} target="_blank" rel="noreferrer">
                source
              </a>
            </p>
          </div>
        </section>

        <div className="results">
          <section className="card totals" aria-live="polite">
            <div>
              <span className="total-label">Energy</span>
              <span className="total-value">{formatEnergy(kwh)}</span>
            </div>
            <div>
              <span className="total-label">Carbon</span>
              <span className="total-value">{formatCo2(kgCo2)}</span>
            </div>
          </section>
          <Breakdown tokens={tokens} theme={theme} />
          <Equivalents kgCo2={kgCo2} />
        </div>
      </div>

      <Methodology />
    </main>
  );
}
