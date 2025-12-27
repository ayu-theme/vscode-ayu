#!/usr/bin/env node

const colors = [
  ["Black", 30],
  ["Red", 31],
  ["Green", 32],
  ["Yellow", 33],
  ["Blue", 34],
  ["Magenta", 35],
  ["Cyan", 36],
  ["White", 37],
];

function printColors() {
  console.log("Foreground Colors");
  console.log("=".repeat(60));
  console.log(
    "Color".padEnd(10) +
      "Normal".padEnd(15) +
      "Bright".padEnd(15) +
      "Dim".padEnd(15),
  );
  console.log("-".repeat(60));

  for (const [name, code] of colors) {
    const normal = `\x1b[${code}m${name}\x1b[0m`;
    const bright = `\x1b[${code + 60}m${name}\x1b[0m`;
    const dim = `\x1b[2;${code}m${name}\x1b[0m`;
    console.log(
      name.padEnd(10) +
        normal.padEnd(15 + 9) +
        bright.padEnd(15 + 11) +
        dim.padEnd(15 + 11),
    );
  }

  console.log("\n");
  console.log("Background Combinations");
  console.log("=".repeat(60));
  console.log("Normal foreground on each background:\n");

  for (const [bgName, bgCode] of colors) {
    const bg = bgCode + 10;
    let line = `  On ${bgName.padEnd(8)}  `;
    for (const [fgName, fgCode] of colors) {
      line += `\x1b[${fgCode};${bg}m ${fgName.padEnd(7)} \x1b[0m`;
    }
    console.log(line);
  }

  console.log("\n");
  console.log("Bright foreground on each background:\n");

  for (const [bgName, bgCode] of colors) {
    const bg = bgCode + 10;
    let line = `  On ${bgName.padEnd(8)}  `;
    for (const [fgName, fgCode] of colors) {
      line += `\x1b[${fgCode + 60};${bg}m ${fgName.padEnd(7)} \x1b[0m`;
    }
    console.log(line);
  }
}

printColors();
