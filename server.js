const http = require("http");
const fs = require("fs");
const built = fs.readFileSync("built.txt", "utf8");
const port = Number(process.env.PORT || 8080);
http
  .createServer((_, res) => res.end(`railpack-proof node ${process.version}\n${built}`))
  .listen(port, "::", () => console.log(`listening on ${port}`));
