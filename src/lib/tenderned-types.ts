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
  search: string;
  page?: number;
  size?: number;
  publicatieDatumPreset?: string;
  sort?: string;
  useExperimentalFeature?: boolean;
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
