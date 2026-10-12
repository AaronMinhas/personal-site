export interface Recommendation {
  title: string;
  description: string;
  url: string;
  preview?: string;
  /** Official logo shown by itself on hover, e.g. "/images/logos/obsidian.svg". */
  logo?: string;
  /** Longer write-up shown in the preview modal, one string per paragraph. Needs `preview`. */
  notes?: string[];
  tags?: string[];
}

export interface RecommendationCategory {
  title: string;
  lastModified: string;
  /** Expanded on page load. Leave off and the category starts collapsed. */
  openByDefault?: boolean;
  items: Recommendation[];
}

// Add a new category as another object, then update only that category's date
// whenever its item list changes.
export const recommendationCategories: RecommendationCategory[] = [
  {
    title: "software",
    lastModified: "2026-10-12",
    openByDefault: true,
    items: [
      {
        title: "Obsidian",
        description: "Notes and thesis research.",
        url: "https://obsidian.md/",
        preview: "/images/software/obsidian.webp",
        logo: "/images/logos/obsidian.svg",
        notes: [
          "I've used Obsidian on and off since I started university, and it has become a crucial part of my day-to-day life.",
          "Being able to capture my thoughts as notes and link them together makes it easy to find old ideas and build on them. It works best with consistent use.",
        ],
        tags: ["notes"],
      },
    ],
  },
];
