export interface Term {
  title?: string;
  description: string;
  image?: string;
}

// Definitions shown by <Tooltip term="..." />, keyed by the term, e.g.
//   "CI/CD": { description: "Continuous integration and delivery." },
export const terms: Record<string, Term> = {};
