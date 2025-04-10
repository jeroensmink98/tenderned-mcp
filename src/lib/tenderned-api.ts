import {
  TenderNedSearchParams,
  TenderNedSearchResponse,
  TenderNedDocumentsResponse,
  TenderNedPublication,
  isValidCPVCode,
} from "./tenderned-types";

export class TenderNedClient {
  private baseUrl = "https://www.tenderned.nl/papi/tenderned-rs-tns/v2";

  async get<T>(
    endpoint: string,
    params: Record<string, string | number | boolean | string[]> = {}
  ): Promise<T> {
    const queryParams: string[] = [];

    for (const [key, value] of Object.entries(params)) {
      if (value === undefined) continue;

      if (Array.isArray(value)) {
        // Handle array parameters by repeating the key
        value.forEach((v) =>
          queryParams.push(`${key}=${encodeURIComponent(v)}`)
        );
      } else {
        queryParams.push(`${key}=${encodeURIComponent(value)}`);
      }
    }

    const queryString = queryParams.join("&");
    const url = `${this.baseUrl}${endpoint}${
      queryString ? `?${queryString}` : ""
    }`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  /**
   * Search for tenders
   * @param params - The search parameters
   * @returns The search results
   * @throws Error if any provided CPV code is invalid
   */
  async search(
    params: TenderNedSearchParams
  ): Promise<TenderNedSearchResponse> {
    // Validate CPV codes if provided
    if (params.cpvCodes?.length) {
      const invalidCodes = params.cpvCodes.filter(
        (code) => !isValidCPVCode(code)
      );
      if (invalidCodes.length > 0) {
        throw new Error(`Invalid CPV code(s): ${invalidCodes.join(", ")}`);
      }
    }

    const defaultParams = {
      page: 0,
      size: 50,
      sort: "relevantie",
      useExperimentalFeature: false,
      ...params,
    };

    return this.get<TenderNedSearchResponse>("/publicaties", defaultParams);
  }

  /**
   * Get documents for a specific tender
   * @param publicatieId - The ID of the tender publication
   * @returns The documents associated with the tender
   */
  async getDocuments(
    publicatieId: string
  ): Promise<TenderNedDocumentsResponse> {
    return this.get<TenderNedDocumentsResponse>(
      `/publicaties/${publicatieId}/documenten`
    );
  }

  /**
   * Get the download URL for a specific document
   * @param publicatieId - The ID of the tender publication
   * @param documentId - The ID of the document
   * @returns The full download URL for the document
   */
  getDocumentDownloadUrl(publicatieId: string, documentId: string): string {
    return `${this.baseUrl}/publicaties/${publicatieId}/documenten/${documentId}/content`;
  }

  /**
   * Get the download URL for all documents as ZIP
   * @param publicatieId - The ID of the tender publication
   * @returns The full download URL for the ZIP file containing all documents
   */
  getDocumentsZipDownloadUrl(publicatieId: string): string {
    return `${this.baseUrl}/publicaties/${publicatieId}/documenten/zip`;
  }

  /**
   * Check if a tender is a Mercell tender
   * @param publicatieId - The ID of the tender publication
   * @returns Promise<boolean> indicating if it's a Mercell tender
   */
  async isMercellTender(publicatieId: string): Promise<boolean> {
    try {
      const publication = await this.get<TenderNedPublication>(
        `/publicaties/${publicatieId}`
      );
      return publication?.urlTsenderNaam === "Mercell";
    } catch {
      return false;
    }
  }
}

export class TenderNedAPI {
  private client: TenderNedClient;

  constructor(client?: TenderNedClient) {
    this.client = client || new TenderNedClient();
  }

  /**
   * Search for tenders
   * @param params - The search parameters
   * @returns The search results
   */
  async search(
    params: TenderNedSearchParams
  ): Promise<TenderNedSearchResponse> {
    return this.client.search(params);
  }

  /**
   * Get documents for a specific tender
   * @param publicatieId - The ID of the tender publication
   * @returns The documents associated with the tender
   */
  async getDocuments(
    publicatieId: string
  ): Promise<TenderNedDocumentsResponse> {
    return this.client.getDocuments(publicatieId);
  }

  /**
   * Get the download URL for a specific document
   * @param publicatieId - The ID of the tender publication
   * @param documentId - The ID of the document
   * @returns The full download URL for the document
   */
  getDocumentDownloadUrl(publicatieId: string, documentId: string): string {
    return this.client.getDocumentDownloadUrl(publicatieId, documentId);
  }

  /**
   * Get the download URL for all documents as ZIP
   * @param publicatieId - The ID of the tender publication
   * @returns The full download URL for the ZIP file containing all documents
   */
  getDocumentsZipDownloadUrl(publicatieId: string): string {
    return this.client.getDocumentsZipDownloadUrl(publicatieId);
  }

  /**
   * Check if a tender is a Mercell tender
   * @param publicatieId - The ID of the tender publication
   * @returns Promise<boolean> indicating if it's a Mercell tender
   */
  async isMercellTender(publicatieId: string): Promise<boolean> {
    return this.client.isMercellTender(publicatieId);
  }
}
