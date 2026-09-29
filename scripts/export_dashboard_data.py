"""Export the energy model and CO2 equivalents as JSON for the web dashboard.

The dashboard never hard-codes rates: it reads web/src/data/model.json, which is
generated here from the same constants the MCP servers use.

    uv run python scripts/export_dashboard_data.py          # write the file
    uv run python scripts/export_dashboard_data.py --check  # fail if it is stale
"""

from __future__ import annotations

import argparse
import json
import sys
from dataclasses import asdict
from pathlib import Path

from mcps.carbon_equivalents import _DATA_PATH, UK_GRID_GCO2_PER_KWH, load_equivalents
from mcps.energy_estimate import EnergyRates

OUTPUT_PATH = Path(__file__).resolve().parent.parent / "web" / "src" / "data" / "model.json"


def build_dashboard_data() -> dict:
    raw = json.loads(Path(_DATA_PATH).read_text(encoding="utf-8"))
    sources = {item["id"]: item.get("source", "") for item in raw["items"]}
    return {
        "rates_wh_per_mtok": asdict(EnergyRates()),
        "default_intensity_gco2_per_kwh": raw.get("grid_intensity_gco2_per_kwh", UK_GRID_GCO2_PER_KWH),
        "default_intensity_source": raw.get("grid_intensity_source", ""),
        "equivalents": [
            {"id": eq.id, "label": eq.label, "kg_co2": eq.kg_co2, "source": sources[eq.id]}
            for eq in load_equivalents()
        ],
    }


def render(data: dict) -> str:
    return json.dumps(data, indent=2) + "\n"


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--check", action="store_true", help="exit 1 if the committed JSON is out of date")
    args = parser.parse_args()

    rendered = render(build_dashboard_data())
    if args.check:
        if not OUTPUT_PATH.exists() or OUTPUT_PATH.read_text(encoding="utf-8") != rendered:
            print(f"{OUTPUT_PATH} is stale; run scripts/export_dashboard_data.py", file=sys.stderr)
            return 1
        return 0

    OUTPUT_PATH.write_text(rendered, encoding="utf-8")
    print(f"wrote {OUTPUT_PATH}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
