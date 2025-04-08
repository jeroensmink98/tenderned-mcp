import { describe, it, expect } from "vitest";
import { TenderNedAPI } from "../src/lib/tenderned-api";

describe("TenderNedAPI - Documents", () => {
  const api = new TenderNedAPI();
  const testPublicationId = "370662"; // Static publication ID

  it("should fetch documents for a tender", async () => {
    const documents = await api.getDocuments(testPublicationId);

    expect(documents).toBeDefined();
    expect(Array.isArray(documents.documenten)).toBe(true);

    // Don't require downloadZip to be present
    if (documents.links?.downloadZip) {
      expect(documents.links.downloadZip.href).toBeDefined();
      expect(documents.links.downloadZip.title).toBeDefined();
    }

    if (documents.documenten.length > 0) {
      const firstDoc = documents.documenten[0];
      expect(firstDoc.documentId).toBeDefined();
      expect(firstDoc.documentNaam).toBeDefined();
      expect(firstDoc.typeDocument).toBeDefined();
      expect(firstDoc.datumPublicatie).toBeDefined();
      expect(firstDoc.links.download).toBeDefined();
    }
  });

  it("should generate correct document download URLs", () => {
    const documentId = "12100312";

    const downloadUrl = api.getDocumentDownloadUrl(
      testPublicationId,
      documentId
    );
    expect(downloadUrl).toContain(
      `/publicaties/${testPublicationId}/documenten/${documentId}/content`
    );

    const zipUrl = api.getDocumentsZipDownloadUrl(testPublicationId);
    expect(zipUrl).toContain(
      `/publicaties/${testPublicationId}/documenten/zip`
    );
  });

  it("should handle known document types", async () => {
    const documents = await api.getDocuments(testPublicationId);

    if (documents.documenten.length > 0) {
      documents.documenten.forEach((doc) => {
        expect(doc.typeDocument.code).toBeDefined();
        expect(doc.typeDocument.omschrijving).toBeDefined();
        expect(doc.publicatieCategorie.code).toBeDefined();
        expect(doc.publicatieCategorie.omschrijving).toBeDefined();
      });
    }
  });
});
