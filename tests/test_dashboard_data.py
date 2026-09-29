import importlib.util
import json
import unittest
from pathlib import Path

from mcps.energy_estimate import estimate_request_energy_wh

_SCRIPT = Path(__file__).resolve().parent.parent / "scripts" / "export_dashboard_data.py"
_spec = importlib.util.spec_from_file_location("export_dashboard_data", _SCRIPT)
export = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(export)


class DashboardDataTests(unittest.TestCase):
    def test_committed_model_json_matches_python_model(self):
        committed = json.loads(export.OUTPUT_PATH.read_text(encoding="utf-8"))
        self.assertEqual(committed, export.build_dashboard_data())

    def test_known_values_pinned_for_js_parity(self):
        # web/src/lib/energy.test.ts asserts the same numbers.
        self.assertAlmostEqual(estimate_request_energy_wh(1_000_000, 1_000_000) / 1000, 7.68)
        self.assertAlmostEqual(estimate_request_energy_wh(0, 0, 1_000_000) / 1000, 0.128)
        self.assertAlmostEqual(estimate_request_energy_wh(0, 0, 0, 1_000_000) / 1000, 1.6)


if __name__ == "__main__":
    unittest.main()
