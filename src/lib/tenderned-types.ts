export interface TenderNedPublication {
  publicatieId: string;
  publicatieDatum: string;
  typePublicatie: {
    code: string;
    omschrijving: string;
  };
  aanbestedingNaam: string;
  aanbestedendeDienstNaam: string;
  opdrachtgeverNaam: string;
  sluitingsDatum?: string;
  procedure: {
    code: string;
    omschrijving: string;
  };
  typeOpdracht: {
    code: string;
    omschrijving: string;
  };
  cpvCodes?: TenderNedCPVCode[];
  digitaal: boolean;
  europees: boolean;
  opdrachtBeschrijving: string;
  link: {
    href: string;
    title: string;
  };
  urlTsenderNaam?: string;
  urlTsenderWebsite?: string;
}

export interface TenderNedSearchResponse {
  content: TenderNedPublication[];
  first: boolean;
  last: boolean;
  totalElements: number;
  totalPages: number;
  size: number;
  numberOfElements: number;
  number: number;
}

export interface TenderNedSearchParams {
  search?: string;
  page?: number;
  size?: number;
  publicatieDatumPreset?: string;
  sort?: string;
  useExperimentalFeature?: boolean;
  cpvCodes?: string[];
}

export interface TenderNedDocumentType {
  code: string;
  omschrijving: string;
}

export interface TenderNedPublicatieCategorie {
  code: string;
  omschrijving: string;
}

export interface TenderNedDocument {
  documentId: string;
  documentNaam: string;
  typeDocument: TenderNedDocumentType;
  datumPublicatie: string;
  publicatieCategorie: TenderNedPublicatieCategorie;
  virusIndicatie: boolean;
  grootte: number;
  links: {
    download: {
      href: string;
      title: string;
    };
  };
}

export interface TenderNedDocumentsResponse {
  documenten: TenderNedDocument[];
  links?: {
    downloadZip?: {
      href: string;
      title: string;
    };
  };
}

// Common document type codes
export enum TenderNedDocumentTypeCode {
  PDF = "pdf",
  ZIP = "zip",
}

// Common publication category codes
export enum TenderNedPublicatieCategorieCode {
  AANKONDIGING = "ANK",
  NOTA_VAN_INLICHTINGEN = "NVI",
  AANBESTEDINGSDOCUMENTEN = "DOC",
}

// CPV Code types
export interface CPVCodeEntry {
  code: string;
  description: string;
}

export interface TenderNedCPVCode {
  code: string;
  omschrijving: string;
}

// Convert CPV code entry to TenderNed format
export function convertCPVCodeToTenderNed(
  entry: CPVCodeEntry
): TenderNedCPVCode {
  return {
    code: entry.code,
    omschrijving: entry.description,
  };
}

// CPV code validation
export function isValidCPVCode(code: string): boolean {
  // CPV code format: XXXXXXXX-X (8 digits, hyphen, 1 digit)
  const cpvRegex = /^\d{8}-\d$/;

  if (!cpvRegex.test(code)) {
    return false;
  }

  // Extract the first two digits to validate the category
  const firstTwoDigits = parseInt(code.substring(0, 2), 10);

  // Check if the first two digits are valid according to the rules:
  // Supplies: 00-44 or 48
  // Services: 50-98
  // Works: 45
  // Invalid: 46, 47, 49
  if (firstTwoDigits === 46 || firstTwoDigits === 47 || firstTwoDigits === 49) {
    return false;
  }

  return true;
}
