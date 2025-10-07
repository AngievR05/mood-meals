// client/updateApiCalls.js
const fs = require("fs");
const path = require("path");

const SRC_DIR = path.join(__dirname, "src");

const LOCALHOST_REGEX = /http:\/\/localhost:5000\/api\/([\w\/-]+)/g;

// Recursively walk src directory to get all .jsx files
const walk = (dir) => {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) results = results.concat(walk(fullPath));
    else if (fullPath.endsWith(".jsx")) results.push(fullPath);
  });
  return results;
};

const files = walk(SRC_DIR);

files.forEach((file) => {
  let content = fs.readFileSync(file, "utf8");
  let updated = content;

  const matches = [...content.matchAll(LOCALHOST_REGEX)];
  if (matches.length > 0) {
    // Replace each match with `/api/<endpoint>`
    matches.forEach((match) => {
      const endpoint = match[1]; // e.g., "feedback" or "groceries/123"
      updated = updated.replace(match[0], `/api/${endpoint}`);
    });

    // Add import * as API from "../api"; if not already present
    if (!/from\s+["']\.{1,2}\/api["']/.test(updated)) {
      // Find the first import block and insert after it
      const importEnd = updated.search(/(?:\n\s*\n)|$/); 
      updated =
        updated.slice(0, importEnd) +
        '\nimport * as API from "../api";' +
        updated.slice(importEnd);
    }

    fs.writeFileSync(file, updated, "utf8");
    console.log(`✅ Updated API calls in ${file}`);
  }
});

console.log("✅ Done updating all components!");
