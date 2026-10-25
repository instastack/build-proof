// Runs in the build: records the build argument the image was built with.
const fs = require("fs");
fs.writeFileSync("built.txt", `PROOF_ARG=${process.env.PROOF_ARG ?? "(unset)"}\n`);
console.log("build.js wrote built.txt:", fs.readFileSync("built.txt", "utf8").trim());
