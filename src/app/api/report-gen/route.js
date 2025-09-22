import { chromium as playwright } from "playwright";
import Chromium from "@sparticuz/chromium";

export async function POST() {
  try {
    const browser = await playwright.launch({
      args: [...Chromium.args, "--no-sandbox", "--disable-setuid-sandbox"],
      executablePath: await Chromium.executablePath(
        "https://github.com/Sparticuz/chromium/releases/download/v121.0.0/chromium-v121.0.0-pack.tar"
      ),
      headless: true,
    });

    const page = await browser.newPage();

    // Mock an API endpoint inside the page
    await page.route("**/api/report-data", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ reportData: "Hello" }),
      });
    });

    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/test`;
    await page.goto(url, { waitUntil: "networkidle" });

    const screenshot = await page.screenshot({
      type: "png",
      fullPage: true,
    });

    await browser.close();

    return new Response(screenshot, {
      headers: {
        "Content-Type": "image/png",
        "Content-Disposition": "attachment; filename=report.png",
      },
    });
  } catch (err) {
    console.error("Report generation error:", err);
    return new Response(
      JSON.stringify({ error: "Failed to generate report" }),
      {
        status: 500,
      }
    );
  }
}
