const fs = require("fs");
const path = require("path");
const https = require("https");
const {
  getIntrospectionQuery,
  buildClientSchema,
  printSchema,
} = require("graphql");
require("dotenv").config();

const GITHUB_TOKEN = process.env.VITE_GITHUB_TOKEN;

if (!GITHUB_TOKEN) {
  console.error("Error: VITE_GITHUB_TOKEN is not defined in .env file");
  console.error("Please create a .env file and set VITE_GITHUB_TOKEN");
  process.exit(1);
}

const fetchSchema = () => {
  console.log("Fetching GraphQL schema from GitHub API...");
  const query = getIntrospectionQuery();
  const options = {
    hostname: "api.github.com",
    path: "/graphql",
    method: "POST",
    headers: {
      Authorization: `Bearer ${GITHUB_TOKEN}`,
      "User-Agent": "Relay-Schema-Downloader",
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify({ query })),
    },
  };

  const req = https.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      if (res.statusCode >= 400) {
        console.error(
          `Error fetching schema: ${res.statusCode} ${res.statusMessage}`,
        );
        console.error(data);
        process.exit(1);
      }

      try {
        const result = JSON.parse(data);
        if (result.errors) {
          console.error("Errors in introspection query:", result.errors);
          process.exit(1);
        }

        const schema = buildClientSchema(result.data);
        const sdl = printSchema(schema);

        fs.writeFileSync(path.join(process.cwd(), "schema.graphql"), sdl);
        console.log("Schema successfully fetched and saved to schema.graphql");
      } catch (err) {
        console.error("Error parsing schema response:", err);
        process.exit(1);
      }
    });
  });

  req.on("error", (e) => {
    console.error(`Problem with request: ${e.message}`);
    process.exit(1);
  });

  req.write(JSON.stringify({ query }));
  req.end();
};

fetchSchema();
