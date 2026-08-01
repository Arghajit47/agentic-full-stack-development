import puppeteer, { type Browser } from "puppeteer";
import lighthouse, { type RunnerResult } from "lighthouse";
import type { Config } from "lighthouse";

export interface LighthouseRunOptions {
  url: string;
  config?: Partial<Config["settings"]>;
}

export interface LighthouseScores {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

export async function runLighthouse(options: LighthouseRunOptions): Promise<LighthouseScores> {
  const { url, config } = options;
  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--remote-debugging-port=9222", "--no-sandbox", "--disable-setuid-sandbox"],
    });
    const result: RunnerResult | undefined = await lighthouse(
      url,
      { port: 9222, output: "json", logLevel: "error" },
      config ? { extends: "lighthouse:default", settings: config } : undefined
    );
    if (!result) throw new Error(`Lighthouse returned no result for ${url}`);
    const { categories } = result.lhr;
    return {
      performance: Math.round((categories.performance?.score ?? 0) * 100),
      accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
      bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
      seo: Math.round((categories.seo?.score ?? 0) * 100),
    };
  } finally {
    await browser?.close();
  }
}
