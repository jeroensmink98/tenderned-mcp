import { describe, it, expect } from "vitest";
import { TenderNedAPI } from "../src/lib/tenderned-api";

describe("TenderNedAPI - CPV Search", () => {
  const singleCpv = ["30100000-1"];
  const multipleCpv = ["30100000-1", "09000000-3"];

  const api = new TenderNedAPI();
  it("should search with a single valid CPV code and search term", async () => {
    const results = await api.search({
      cpvCodes: singleCpv,
      search: "bloem",
    });
    expect(results).toBeDefined();
    expect(results.content).toBeDefined();
    expect(results.content.length).toBeGreaterThan(0);
  });

  it("should search only with a term and no CPV codes", async () => {
    const results = await api.search({
      search: "bloem",
    });

    expect(results).toBeDefined();
    expect(results.content).toBeDefined();
    expect(results.content.length).toBeGreaterThan(0);
  });

  it("should search with a single valid CPV code and no search term", async () => {
    const results = await api.search({
      cpvCodes: singleCpv,
    });
    console.log(results);
    expect(results).toBeDefined();
    expect(results.content).toBeDefined();
    expect(results.content.length).toBeGreaterThan(0);
  });

  it("should search with multiple valid CPV codes and no term", async () => {
    const results = await api.search({
      cpvCodes: multipleCpv,
    });
    expect(results).toBeDefined();
    expect(results.content).toBeDefined();
    expect(results.content.length).toBeGreaterThan(0);
  });
});
