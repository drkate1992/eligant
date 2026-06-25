import { handle, ok } from "@/lib/api";
import { FX_FALLBACK } from "@/lib/constants";
import type { FxRate } from "@/types";

// Returns USD-based FX rates. If OPEN_EXCHANGE_APP_ID is set, fetches live rates;
// otherwise serves the static fallback. Public endpoint (rates aren't user data).
export async function GET() {
  return handle(async () => {
    const appId = process.env.OPEN_EXCHANGE_APP_ID;
    if (appId) {
      try {
        const res = await fetch(
          `https://openexchangerates.org/api/latest.json?app_id=${appId}`,
          { next: { revalidate: 60 } },
        );
        if (res.ok) {
          const json = (await res.json()) as { rates: Record<string, number> };
          const rates: FxRate[] = FX_FALLBACK.map((f) => {
            const live = json.rates[f.code];
            // API gives USD->X; we display X->USD (inverse) to match the UI.
            return {
              ...f,
              rate: live ? Number((1 / live).toFixed(6)) : f.rate,
            };
          });
          return ok(rates);
        }
      } catch {
        // fall through to static
      }
    }
    return ok(FX_FALLBACK as unknown as FxRate[]);
  });
}
