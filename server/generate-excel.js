/**
 * generate-excel.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Generate a sample excel file with 6 rows and 6 columns for ingest test.
 */

const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const data = [
  { Title: "The Runaway Trolley", Description: "Lever to change tracks from 5 to 1.", Category: "Ethics", Difficulty: "Hard", Source: "Philosophy", Tags: "classic, trolley" },
  { Title: "Fat Man on bridge", Description: "Push the fat man to stop trolley.", Category: "Ethics", Difficulty: "Hard", Source: "Philosophy", Tags: "trolley, intent" },
  { Title: "Heinz Dilemma", Description: "Steal overpriced drug to save wife.", Category: "Moral Development", Difficulty: "Medium", Source: "Psychology", Tags: "kohlberg, theft" },
  { Title: "Prisoner's Dilemma", Description: "Cooperate or betray your partner.", Category: "Game Theory", Difficulty: "Easy", Source: "Economics", Tags: "nash, cooperation" },
  { Title: "Lifeboat", Description: "Overcrowded lifeboat, someone must leave.", Category: "Applied Ethics", Difficulty: "Hard", Source: "Marine Law", Tags: "survival, utilitarian" },
  { Title: "Experience Machine", Description: "Plug into a perfect simulation.", Category: "Metaphysics", Difficulty: "Medium", Source: "Robert Nozick", Tags: "reality, hedonism" }
];

const worksheet = XLSX.utils.json_to_sheet(data);
const workbook = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(workbook, worksheet, "Situations");

const p = path.join(__dirname, 'sample.xlsx');
XLSX.writeFile(workbook, p);

console.log(`✅ successfully created sample excel file at ${p}`);
