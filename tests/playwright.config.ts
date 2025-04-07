import { PlaywrightTestConfig } from "@playwright/test";
import devices from "@playwright/test";
import fs from "fs";
import { join } from "path";
import dotenv from "dotenv";


const config: PlaywrightTestConfig = {
  testDir: ".",
  timeout: 2 * 60 * 60 * 1000,
  expect: {
   
    timeout: 60 * 60 * 1000,
  },
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "html",
  use: {
    actionTimeout: 0,
    baseURL: getBaseURL(),
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
};

function getBaseURL() {
  if (!process.env.REACT_APP_WEB_BASE_URL && !process.env.CI) {
    let environment = process.env.AZURE_ENV_NAME;
    if (!environment) {
      try {
        let configfilePath = join(__dirname, "..", ".azure", "config.json");
        if (fs.existsSync(configfilePath)) {
          let configFile = JSON.parse(fs.readFileSync(configfilePath, "utf-8"));
          environment = configFile["defaultEnvironment"];
        }
      } catch (err) {
        console.log("Unable to load default environment: " + err);
      }
    }

    if (environment) {
      let envPath = join(__dirname, "..", ".azure", environment, ".env");
      console.log("Loading env from: " + envPath);
      dotenv.config({ path: envPath });
      return process.env.REACT_APP_WEB_BASE_URL;
    }
  }

  let baseURL = process.env.REACT_APP_WEB_BASE_URL || "http://localhost:3000";
  console.log("baseUrl: " + baseURL);
  return baseURL;
}

export default config;
