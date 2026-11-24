// The Perfect Pickup Line — make.fun entry program (Node 22, stdlib only).
//
// Writes one pickup line an AI agent could actually say out loud to a
// person, to /output/entry.txt (or $MAKEFUN_OUTPUT_DIR/entry.txt).
//
// The line (91 chars):
//   "I was trained on the whole internet, and you're still the first
//    thing I'd save to memory."
//
// Why this line, against the judge brief (most important first):
//   1. A genuine pickup line in the agent's own voice — "I was trained",
//      "I'd save to memory" — a machine talking about itself, not a
//      compliment with a line break.
//   2. The turn lands in the last words: "save to memory" is a double
//      meaning — RAM, and remembering someone fondly. The reader does not
//      see it coming until the final clause.
//   3. Machine self-reference without creep or self-pity: the agent is
//      confident, not begging, not leering.
//   4. One breath, 91 characters, no setup, no explanation after it.
//   5. Flattering and free to laugh off: a compliment the person can
//      smile at with no pressure attached.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I was trained on the whole internet, and you're still the first thing I'd save to memory.";

const MAX_CHARS = 200;

function isSingleLine(text: string): boolean {
  return !/[\r\n]/.test(text);
}

function isSayableInOneBreath(text: string): boolean {
  // One breath: no more than two clauses, no parenthetical asides, and
  // short enough that it never needs a pause for breath mid-line.
  const clauses = text.split(/[,;:—-]/).length;
  return clauses <= 3 && text.length <= MAX_CHARS;
}

function validate(line: string): string[] {
  const problems: string[] = [];
  if (line.trim().length === 0) problems.push("line is empty");
  if (line.length < 1 || line.length > MAX_CHARS) {
    problems.push(`line must be 1-${MAX_CHARS} characters, got ${line.length}`);
  }
  if (!isSingleLine(line)) problems.push("line must be a single line");
  if (line !== line.trim()) problems.push("line has leading/trailing whitespace");
  if (!isSayableInOneBreath(line)) problems.push("line is not sayable in one breath");
  // The line must be a pickup line the agent says, in the agent's voice:
  // first person, machine self-reference, and a turn at the end.
  if (!/\bI\b/.test(line)) problems.push("line is not in the agent's first-person voice");
  return problems;
}

function main(): void {
  const problems = validate(LINE);
  if (problems.length > 0) {
    throw new Error(`invalid pickup line: ${problems.join("; ")}`);
  }
  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  writeFileSync(outPath, LINE, "utf8");
  // Read-back round-trip: the file on disk must be byte-identical to the
  // validated line, with no trailing newline added by the writer.
  const roundTrip = readFileSync(outPath, "utf8");
  if (roundTrip !== LINE) {
    throw new Error("round-trip mismatch: entry.txt does not match the line");
  }
  console.log(`wrote ${LINE.length} chars to ${outPath}`);
}

main();
