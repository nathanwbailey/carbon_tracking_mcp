import { formatTokens } from "../lib/format";

const MAX_EXPONENT = 12; // slider spans 1 token to 1 trillion on a log scale
const STEPS = 1000;

const toSlider = (tokens: number) => (tokens < 1 ? 0 : Math.min(STEPS, (Math.log10(tokens) / MAX_EXPONENT) * STEPS));
const fromSlider = (pos: number) => (pos <= 0 ? 0 : Math.round(10 ** ((pos / STEPS) * MAX_EXPONENT)));

type Props = { id: string; label: string; hint: string; color: string; value: number; onChange: (n: number) => void };

export default function TokenInput({ id, label, hint, color, value, onChange }: Props) {
  return (
    <div className="token-input">
      <div className="token-head">
        <label htmlFor={`${id}-num`}>
          <span className="swatch" style={{ background: color }} aria-hidden="true" />
          {label}
        </label>
        <span className="token-short">{formatTokens(value)}</span>
      </div>
      <p className="hint">{hint}</p>
      <input
        type="range"
        min={0}
        max={STEPS}
        value={toSlider(value)}
        aria-label={`${label} tokens (log scale)`}
        onChange={(e) => onChange(fromSlider(Number(e.target.value)))}
      />
      <input
        id={`${id}-num`}
        type="number"
        min={0}
        step={1}
        inputMode="numeric"
        value={value}
        onChange={(e) => onChange(Math.max(0, Math.floor(Number(e.target.value) || 0)))}
      />
    </div>
  );
}
