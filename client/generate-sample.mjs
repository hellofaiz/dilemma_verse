/**
 * generate-sample.mjs
 * Run with: node generate-sample.mjs
 * Creates: public/sample-dilemmas.xlsx
 */

import * as XLSX from 'xlsx';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rows = [
  { Situation: 'The Trolley Problem', Description: 'A runaway trolley is heading towards five people. You can divert it to a track with one person. Do you pull the lever?', Category: 'Ethics', Difficulty: 'Hard', Source: 'Philosophy' },
  { Situation: "The Prisoner's Dilemma", Description: 'Two suspects can betray each other or stay silent. Both staying silent yields the best collective outcome, but individual incentives push toward betrayal.', Category: 'Game Theory', Difficulty: 'Medium', Source: 'Economics' },
  { Situation: 'The Heinz Dilemma', Description: "Heinz's wife needs a drug he can't afford. Should he steal it to save her life?", Category: 'Moral Development', Difficulty: 'Medium', Source: 'Psychology' },
  { Situation: 'The Violinist', Description: 'You wake up connected to a world-famous violinist who needs your kidneys to survive for 9 months. Is it ethical to disconnect?', Category: 'Ethics', Difficulty: 'Hard', Source: 'Philosophy' },
  { Situation: 'The Ticking Time Bomb', Description: 'A terrorist knows the location of a bomb. Is torture justified to extract information that saves thousands of lives?', Category: 'Applied Ethics', Difficulty: 'Hard', Source: 'Political Philosophy' },
  { Situation: 'The Experience Machine', Description: 'A machine can simulate a perfect life. Would you plug in permanently, forsaking reality?', Category: 'Metaphysics', Difficulty: 'Medium', Source: 'Robert Nozick' },
];

const ws = XLSX.utils.json_to_sheet(rows);
const wb = XLSX.utils.book_new();
XLSX.utils.book_append_sheet(wb, ws, 'Dilemmas');

const outDir = path.join(__dirname, 'public');
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const outPath = path.join(outDir, 'sample-dilemmas.xlsx');
XLSX.writeFile(wb, outPath);
console.log('✅ Created:', outPath);
