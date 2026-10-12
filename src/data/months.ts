export interface Month {
  /** The month being summarised, as YYYY-MM. */
  month: string;
  /** One line shown in the list on the homepage. */
  summary: string;
  /** Longer write-up shown in the modal, one string per paragraph. */
  notes?: string[];
  /** Optional photo for the modal and hover preview, e.g. "/images/months/2026-09.jpg". */
  photo?: string;
  photoAlt?: string;
}

// Add last month's entry at the end of each month. Order doesn't matter; the
// homepage sorts newest first and shows the latest few.
export const months: Month[] = [];
