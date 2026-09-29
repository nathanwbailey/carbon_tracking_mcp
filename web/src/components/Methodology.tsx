import model from "../data/model.json";
import grid from "../data/grid_intensity.json";
import { EQUIVALENTS } from "../lib/energy";

const REPO = "https://github.com/nathanwbailey/carbon_tracking_mcp";

export default function Methodology() {
  const r = model.rates_wh_per_mtok;
  return (
    <section className="card" aria-labelledby="method-h">
      <h2 id="method-h">Method and caveats</h2>
      <p>
        <strong>Order-of-magnitude, directional estimates only, not an audited figure.</strong> Energy uses a flat
        rate per token type, anchored at a 500K-token context, following{" "}
        <a href="https://simonpcouch.com/blog/2026-01-20-cc-impact/">Simon Couch's method</a>. Cache rates are set by
        Anthropic's price ratios, on the guess that energy scales with price.
      </p>
      <table>
        <thead>
          <tr>
            <th>Token type</th>
            <th>Wh per million tokens</th>
          </tr>
        </thead>
        <tbody>
          <tr><td>Input</td><td>{r.input}</td></tr>
          <tr><td>Output</td><td>{r.output}</td></tr>
          <tr><td>Cache read (0.1× input)</td><td>{r.cache_read}</td></tr>
          <tr><td>Cache write (1.25× input)</td><td>{r.cache_write}</td></tr>
        </tbody>
      </table>
      <ul className="notes">
        <li>Short requests are overestimated and very long ones underestimated, because one rate covers all context lengths.</li>
        <li>The model name is ignored, so every model gets the same rates.</li>
        <li>Scenario token counts are illustrative assumptions, not measurements.</li>
        <li>{grid.note}</li>
        <li>Comparisons are not grid-dependent: {EQUIVALENTS.map((e) => e.label).join("; ")}.</li>
      </ul>
      <p>
        Rates are generated from the model in the <a href={REPO}>MCP repository</a>, so this page and the MCP tools
        use the same numbers.
      </p>
    </section>
  );
}
