// Runs in the build: tries the internet, an instance's mesh address
// (PROBE_IP) and the cloud metadata address, and records what answered.
const fs = require("fs");
const http = require("http");
const https = require("https");
function probe(name, mod, opts) {
  return new Promise((resolve) => {
    const req = mod.get({ ...opts, timeout: 4000 }, (res) => {
      res.resume();
      resolve(`${name}: HTTP ${res.statusCode}`);
    });
    req.on("timeout", () => req.destroy(new Error("timeout")));
    req.on("error", (e) => resolve(`${name}: refused (${e.code || e.message})`));
  });
}
(async () => {
  const lines = [
    await probe("internet", https, { host: "registry.npmjs.org", path: "/" }),
    await probe("mesh", http, { host: process.env.PROBE_IP, port: 80, path: "/", family: 6 }),
    await probe("metadata", http, { host: "169.254.169.254", path: "/" }),
  ];
  lines.forEach((l) => console.log("probe", l));
  fs.writeFileSync("built.txt", lines.join("\n") + "\n");
})();
