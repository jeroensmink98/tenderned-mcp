import { CPVCodeEntry } from "./tenderned-types";

/**
 * Validates a CPV (Common Procurement Vocabulary) code
 * @param cpvCode The CPV code to validate (e.g., "34114210-4")
 * @returns true if the CPV code is valid, false otherwise
 */
export function isValidCPVCode(cpvCode: string): boolean {
  // Check basic format using regex
  const cpvRegex = /^(\d{8})-(\d)$/;
  if (!cpvRegex.test(cpvCode)) {
    return false;
  }

  // Extract the main code and check digit
  const [, mainCode, checkDigit] = cpvCode.match(cpvRegex)!;

  // Validate first two digits (division)
  const division = parseInt(mainCode.substring(0, 2));
  if (!isValidDivision(division)) {
    return false;
  }

  // For now, we just ensure all digits are numeric which is already done by the regex
  return true;
}

/**
 * Determines the type of contract based on the CPV code
 * @param cpvCode The CPV code to check
 * @returns 'supplies' | 'services' | 'works' | 'invalid'
 */
export function getCPVContractType(
  cpvCode: string
): "supplies" | "services" | "works" | "invalid" {
  if (!isValidCPVCode(cpvCode)) {
    return "invalid";
  }

  const division = parseInt(cpvCode.substring(0, 2));

  if ((division >= 0 && division <= 44) || division === 48) {
    return "supplies";
  } else if (division === 45) {
    return "works";
  } else if (division >= 50 && division <= 98) {
    return "services";
  }

  return "invalid";
}

/**
 * Checks if the division number is valid according to CPV specifications
 * @param division The two-digit division number
 * @returns true if the division is valid, false otherwise
 */
function isValidDivision(division: number): boolean {
  // Invalid divisions: 46, 47, 49
  const invalidDivisions = [46, 47, 49];

  // Check if division is between 0-98 and not in invalid divisions
  return (
    division >= 0 && division <= 98 && !invalidDivisions.includes(division)
  );
}

/**
 * Breaks down a CPV code into its components
 * @param cpvCode The CPV code to break down
 * @returns An object containing the components of the CPV code or null if invalid
 */
export function parseCPVCode(cpvCode: string): {
  division: string;
  group: string;
  class: string;
  category: string;
  specification: string;
  checkDigit: string;
  description?: string;
} | null {
  if (!isValidCPVCode(cpvCode)) {
    return null;
  }

  return {
    division: cpvCode.substring(0, 2),
    group: cpvCode.substring(2, 3),
    class: cpvCode.substring(3, 4),
    category: cpvCode.substring(4, 5),
    specification: cpvCode.substring(5, 8),
    checkDigit: cpvCode.substring(9, 10),
  };
}
