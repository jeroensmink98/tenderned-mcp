import { describe, it, expect, test } from "vitest";
import { TenderNedAPI } from "./tenderned-api";

describe("TenderNedAPI - Search", () => {
  const api = new TenderNedAPI();
  const testPublicationId = "370662"; // Static publication ID

  it("should be defined", () => {
    expect(TenderNedAPI).toBeDefined();
  });

  it("should perform a basic search", async () => {
    const results = await api.search({ search: "innovatie" }); // Search term that should find our test publication

    expect(results).toBeDefined();

    expect(Array.isArray(results.content)).toBe(true);
    expect(typeof results.totalElements).toBe("number");
    expect(typeof results.totalPages).toBe("number");

    // Check if our known publication is in the results
    const hasTestPublication = results.content.some(
      (pub) => pub.publicatieId === testPublicationId
    );
    expect(hasTestPublication).toBe(true);

    // Check publication structure
    const publication = results.content.find(
      (pub) => pub.publicatieId === testPublicationId
    );
    if (publication) {
      expect(publication.aanbestedingNaam).toBeDefined();
      expect(publication.publicatieDatum).toBeDefined();
      expect(publication.opdrachtBeschrijving).toBeDefined();
    }
  });

  it("should handle pagination", async () => {
    const page1 = await api.search({
      search: "test",
      page: 0,
      size: 10,
    });

    const page2 = await api.search({
      search: "test",
      page: 1,
      size: 10,
    });

    expect(page1.number).toBe(0);
    expect(page2.number).toBe(1);
    expect(page1.size).toBe(10);
    expect(page2.size).toBe(10);

    // Ensure we get different results on different pages
    if (page1.content.length > 0 && page2.content.length > 0) {
      expect(page1.content[0].publicatieId).not.toBe(
        page2.content[0].publicatieId
      );
    }
  });

  it("should filter by publication last 30 days", async () => {
    const results = await api.search({
      search: "test",
      publicatieDatumPreset: "AF30", // Last 30 days
    });

    if (results.content.length > 0) {
      // Check if publications are within the last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      results.content.forEach((publication) => {
        const publicationDate = new Date(publication.publicatieDatum);
        expect(publicationDate.getTime()).toBeGreaterThan(
          thirtyDaysAgo.getTime()
        );
      });
    }
  });

  it("should filter by publication last 7 days", async () => {
    const results = await api.search({
      search: "test",
      publicatieDatumPreset: "AF7", // Last 7 days
    });

    if (results.content.length > 0) {
      // Check if publications are within the last 7 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);

      results.content.forEach((publication) => {
        const publicationDate = new Date(publication.publicatieDatum);
        expect(publicationDate.getTime()).toBeGreaterThan(
          thirtyDaysAgo.getTime()
        );
      });
    }
  });

  it("should handle empty search results", async () => {
    const results = await api.search({
      search: "thisisaveryunlikelysearchterm123456789",
    });

    expect(results.content).toEqual([]);
    expect(results.totalElements).toBe(0);
    expect(results.totalPages).toBe(0);
  });

  it("should handle special characters in search", async () => {
    const results = await api.search({
      search: "test & development",
    });

    expect(results).toBeDefined();
    expect(Array.isArray(results.content)).toBe(true);
  });

  it("should sort results", async () => {
    const results = await api.search({
      search: "test",
      sort: "relevantie",
    });

    expect(results).toBeDefined();
    expect(Array.isArray(results.content)).toBe(true);
  });
});

describe("TenderNedAPI", () => {
  const api = new TenderNedAPI();
  const mercellTenderId = "373946"; // Known Mercell tender
  const nonMercellTenderId = "370662"; // Known non-Mercell tender

  describe("isMercellTender", () => {
    it("should correctly identify a Mercell tender", async () => {
      const isMercell = await api.isMercellTender(mercellTenderId);
      expect(isMercell).toBe(true);
    });

    it("should correctly identify a non-Mercell tender", async () => {
      const isMercell = await api.isMercellTender(nonMercellTenderId);
      expect(isMercell).toBe(false);
    });

    it("should handle non-existent tenders", async () => {
      const isMercell = await api.isMercellTender("999999999");
      expect(isMercell).toBe(false);
    });
  });
});

test("test", () => {
  console.log("test");
});
