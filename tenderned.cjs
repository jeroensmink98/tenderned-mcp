const { TenderNedAPI } = require("./dist/lib/tenderned-api");

async function main() {
  const api = new TenderNedAPI();
  const results = await api.search({ search: "test" });
  console.log(results);

  const documents = await api.getDocuments(results.content[0].publicatieId);
  console.log(documents);
}

main().catch((err) => {
  console.error("Error occurred:", err);
  process.exit(1);
});
