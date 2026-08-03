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

export interface LighthouseResult {
  scores: LighthouseScores;
  reportHtml: string;
}

export async function runLighthouse(options: LighthouseRunOptions): Promise<LighthouseResult> {
  const { url, config } = options;
  let browser: Browser | null = null;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const port = parseInt(new URL(browser.wsEndpoint()).port, 10);
    const result: RunnerResult | undefined = await lighthouse(
      url,
      {
        port,
        output: ["json", "html"],
        logLevel: "error",
        throttlingMethod: "provided",
        throttling: {
          rttMs: 0,
          throughputKbps: 0,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      },
      config ? { extends: "lighthouse:default", settings: config } : undefined
    );
    if (!result) throw new Error(`Lighthouse returned no result for ${url}`);
    const { categories } = result.lhr;
    const reports = result.report as string[];
    return {
      scores: {
        performance: Math.round((categories.performance?.score ?? 0) * 100),
        accessibility: Math.round((categories.accessibility?.score ?? 0) * 100),
        bestPractices: Math.round((categories["best-practices"]?.score ?? 0) * 100),
        seo: Math.round((categories.seo?.score ?? 0) * 100),
      },
      reportHtml: reports[1] ?? "",
    };
  } finally {
    await browser?.close();
  }
}
