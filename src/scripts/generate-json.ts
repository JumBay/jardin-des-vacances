/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from "fs";
import path from "path";
import { generateDaysData } from "../data/days.ts";

const publicDir = path.join(process.cwd(), "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Write days.json
const daysData = generateDaysData();
fs.writeFileSync(
  path.join(publicDir, "days.json"),
  JSON.stringify(daysData, null, 2),
  "utf8"
);
console.log("Successfully wrote public/days.json");

// Write events.json (empty object initially)
const eventsFile = path.join(publicDir, "events.json");
if (!fs.existsSync(eventsFile)) {
  fs.writeFileSync(eventsFile, JSON.stringify({}, null, 2), "utf8");
  console.log("Successfully wrote public/events.json");
} else {
  console.log("public/events.json already exists, skipping...");
}
