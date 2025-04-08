import { describe, it, expect } from "vitest";
import { TenderNedAPI } from "../src/lib/tenderned-api";
import { isValidCPVCode } from "../src/lib/tenderned-types";

describe("TenderNedAPI - Search", () => {
  const api = new TenderNedAPI();

  describe("Date Filtering", () => {
    it("should filter by publication last 30 days", async () => {
      const results = await api.search({
        publicatieDatumPreset: "AF30",
      });

      if (results.content.length > 0) {
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
        publicatieDatumPreset: "AF7",
      });

      if (results.content.length > 0) {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        results.content.forEach((publication) => {
          const publicationDate = new Date(publication.publicatieDatum);
          expect(publicationDate.getTime()).toBeGreaterThan(
            sevenDaysAgo.getTime()
          );
        });
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle special characters in search", async () => {
      const results = await api.search({
        search: "test & development",
      });

      expect(results).toBeDefined();
      expect(Array.isArray(results.content)).toBe(true);
    });

    it("should handle sorting", async () => {
      const results = await api.search({
        search: "test",
        sort: "relevantie",
      });

      expect(results).toBeDefined();
      expect(Array.isArray(results.content)).toBe(true);
    });
  });
});
