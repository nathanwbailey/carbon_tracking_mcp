import { useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { TOKEN_KINDS, energyKwhByKind, type TokenKind, type Tokens } from "../lib/energy";
import { formatEnergy, formatTokens } from "../lib/format";
import { SERIES_COLORS, SURFACE, type Theme } from "../lib/theme";

const LABELS: Record<TokenKind, string> = {
  input: "Input",
  output: "Output",
  cacheRead: "Cache read",
  cacheWrite: "Cache write",
};

export default function Breakdown({ tokens, theme }: { tokens: Tokens; theme: Theme }) {
  const [showTable, setShowTable] = useState(false);
  const colors = SERIES_COLORS[theme];
  const energy = energyKwhByKind(tokens);
  const totalTokens = TOKEN_KINDS.reduce((s, k) => s + tokens[k], 0);
  const totalEnergy = TOKEN_KINDS.reduce((s, k) => s + energy[k], 0);

  const share = (values: Record<TokenKind, number>, total: number) =>
    Object.fromEntries(TOKEN_KINDS.map((k) => [k, total ? (values[k] / total) * 100 : 0]));
  const data = [
    { name: "Share of tokens", ...share(tokens, totalTokens) },
    { name: "Share of energy", ...share(energy, totalEnergy) },
  ];

  return (
    <section className="card" aria-labelledby="breakdown-h">
      <div className="card-head">
        <h2 id="breakdown-h">Where the energy goes</h2>
        <button type="button" className="link-btn" onClick={() => setShowTable((v) => !v)}>
          {showTable ? "Show chart" : "Show table"}
        </button>
      </div>
      <p className="hint">Cache reads are usually most of the tokens but a small share of the energy.</p>
      {totalTokens === 0 ? (
        <p className="empty">Enter some tokens to see the split.</p>
      ) : showTable ? (
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Tokens</th>
              <th>Energy</th>
              <th>Energy share</th>
            </tr>
          </thead>
          <tbody>
            {TOKEN_KINDS.map((k, i) => (
              <tr key={k}>
                <td>
                  <span className="swatch" style={{ background: colors[i] }} aria-hidden="true" />
                  {LABELS[k]}
                </td>
                <td>{formatTokens(tokens[k])}</td>
                <td>{formatEnergy(energy[k])}</td>
                <td>{totalEnergy ? ((energy[k] / totalEnergy) * 100).toFixed(1) : "0"}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="chart" role="img" aria-label="Stacked bars comparing each token type's share of tokens and of energy">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 8, top: 4, bottom: 4 }} barCategoryGap={18}>
              <XAxis type="number" domain={[0, 100]} tickFormatter={(v) => `${v}%`} stroke="var(--text-muted)" tickLine={false} />
              <YAxis type="category" dataKey="name" width={110} stroke="var(--text-muted)" tickLine={false} axisLine={false} />
              <Tooltip
                cursor={{ fill: "var(--grid)" }}
                formatter={(v, name) => [`${Number(v).toFixed(1)}%`, name]}
                contentStyle={{ background: "var(--surface-2)", border: "1px solid var(--grid)", borderRadius: 8, color: "var(--text-primary)" }}
              />
              <Legend
                itemSorter={null}
                formatter={(value) => <span style={{ color: "var(--text-secondary)" }}>{value}</span>}
              />
              {TOKEN_KINDS.map((k, i) => (
                <Bar
                  key={k}
                  dataKey={k}
                  name={LABELS[k]}
                  stackId="s"
                  fill={colors[i]}
                  stroke={SURFACE[theme]}
                  strokeWidth={2}
                  isAnimationActive={false}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}
