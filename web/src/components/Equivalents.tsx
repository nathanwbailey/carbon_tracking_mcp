import { co2Comparisons } from "../lib/energy";
import { formatNumber } from "../lib/format";

const SHORT: Record<string, string> = {
  washing_machine_cycle: "Washing machine cycles",
  ev_car_km: "km in an electric car",
  petrol_car_km: "km in a petrol car",
  short_haul_flight: "London–Berlin flights",
  beef_kg: "Servings of beef",
};

export default function Equivalents({ kgCo2 }: { kgCo2: number }) {
  return (
    <section className="card" aria-labelledby="eq-h">
      <h2 id="eq-h">In everyday terms</h2>
      <ul className="eq-grid">
        {co2Comparisons(kgCo2).map((c) => (
          <li key={c.id} title={c.label}>
            <span className="eq-count">{formatNumber(c.count)}</span>
            <span className="eq-label">{SHORT[c.id] ?? c.label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
