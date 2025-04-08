import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ES Module compatible __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the input file
const inputPath = path.join(__dirname, "../data/cpv-codes.txt");
const outputPath = path.join(__dirname, "../data/cpv-codes.json");

const content = fs.readFileSync(inputPath, "utf-8");

// Parse the content
const cpvCodes: { [key: string]: string } = {};

content.split("\n").forEach((line) => {
  // Skip empty lines
  if (!line.trim()) return;

  // Extract code and description
  const match = line.match(/^(\d{8}-\d)\s+(.+)$/);
  if (match) {
    const [, code, description] = match;
    cpvCodes[code] = description;
  }
});

// Write to JSON file
fs.writeFileSync(outputPath, JSON.stringify(cpvCodes, null, 2));

console.log(
  `Converted ${Object.keys(cpvCodes).length} CPV codes to JSON format`
);
