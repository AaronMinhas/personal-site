export interface Recommendation {
  title: string;
  description: string;
  url: string;
  preview?: string;
  /** Official logo shown after the title, e.g. "/images/logos/obsidian.webp". */
  logo?: string;
  /**
   * Longer write-up shown in the preview modal, one string per paragraph. Plain
   * text, except that [label](https://…) becomes a link. Needs `preview`.
   */
  notes?: string[];
  /** Year first used, shown as a [used since 2022] tag in the modal. Leave off if unknown. */
  since?: number;
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
    title: "apps",
    lastModified: "2026-10-13",
    openByDefault: true,
    items: [
      {
        title: "CleanShot X",
        description: "Screenshots and screen recordings.",
        url: "https://cleanshot.com/",
        preview: "/images/software/cleanshot-x.webp",
        logo: "/images/logos/cleanshot-x.webp",
        notes: [
          "I use CleanShot X every single day, for everything.",
          "The newer recording features are great, although not as good as [Screen Studio](https://screen.studio)'s. They have only just been released, and I am hopeful for improvements.",
          "Screen Studio is good, but it is a monthly subscription, which I don't feel is worth it. I am glad I now get the majority of its features in CleanShot X, which I have been using for years.",
        ],
        since: 2023,
        tags: ["utility"],
      },
      {
        title: "AeroSpace",
        description: "Tiling window manager for macOS.",
        url: "https://github.com/nikitabobko/AeroSpace",
        preview: "/images/software/aerospace.webp",
        logo: "/images/logos/aerospace.webp",
        notes: [
          "It takes some getting used to, but once understood it makes controlling the Mac super fluid.",
        ],
        since: 2026,
        tags: ["macOS"],
      },
      {
        title: "Deskflow",
        description: "Shares one keyboard and mouse between computers.",
        url: "https://github.com/deskflow/deskflow",
        preview: "/images/software/deskflow.webp",
        logo: "/images/logos/deskflow.webp",
        notes: [
          "Every time I am at my desk I use this app. It is crucial to my workflow, and its ease of use is highly appreciated.",
        ],
        since: 2026,
        tags: ["utility"],
      },
      {
        title: "Obsidian",
        description: "Notes and thesis research.",
        url: "https://obsidian.md/",
        preview: "/images/software/obsidian.webp",
        logo: "/images/logos/obsidian.webp",
        notes: [
          "I've used Obsidian on and off since I started university, and it has become a crucial part of my day-to-day life.",
          "Being able to capture my thoughts as notes and link them together makes it easy to find old ideas and build on them. It works best with consistent use.",
        ],
        since: 2022,
        tags: ["notes"],
      },
      {
        title: "Antinote",
        description: "A scratchpad for quick notes.",
        url: "https://antinote.io/",
        preview: "/images/software/antinote.webp",
        logo: "/images/logos/antinote.webp",
        notes: [
          "I use Antinote frequently for ephemeral notes. Quickly create and destroy thoughts.",
        ],
        since: 2025,
        tags: ["notes"],
      },
      {
        title: "Alcove",
        description: "Dynamic Island for the Mac's notch.",
        url: "https://tryalcove.com/",
        preview: "/images/software/alcove.webp",
        logo: "/images/logos/alcove.webp",
        notes: [
          "The best macOS notch app I have used to date.",
        ],
        since: 2025,
        tags: ["macOS"],
      },
      {
        title: "Vorssaint",
        description: "Menu bar toolkit for monitoring and upkeep.",
        url: "https://vorssaint.com/",
        preview: "/images/software/vorssaint.webp",
        logo: "/images/logos/vorssaint.webp",
        notes: [
          "Vorssaint is a ton of utility apps combined into one. I mainly use it for monitoring: power, network and disk.",
          "I also use it to keep the Mac awake, keep my apps updated, uninstall apps, and lock the keyboard while I clean the laptop.",
          "Perhaps in the future I will test the wide variety of other features this app provides.",
        ],
        since: 2026,
        tags: ["utility"],
      },
      {
        title: "TextSniper",
        description: "Copies text from anything on screen.",
        url: "https://textsniper.app/",
        preview: "/images/software/textsniper.webp",
        logo: "/images/logos/textsniper.webp",
        notes: [
          "I use TextSniper a lot. It is reliable OCR that never fails me.",
          "CleanShot X and Vorssaint both have OCR as well, so as I make this list it seems a little redundant...",
          "However, I have used TextSniper since I bought my Mac, so I'm in no rush to replace it.",
        ],
        since: 2023,
        tags: ["utility"],
      },
    ],
  },
  {
    title: "tooling",
    lastModified: "2026-10-13",
    openByDefault: true,
    items: [
      {
        title: "Zed",
        description: "My code editor.",
        url: "https://zed.dev/",
        preview: "/images/software/zed.webp",
        logo: "/images/logos/zed.webp",
        notes: [
          "A lightweight code editor with Vim bindings, and one I enjoy using.",
        ],
        since: 2025,
        tags: ["editor"],
      },
      {
        title: "cmux",
        description: "My terminal for agentic coding.",
        url: "https://cmux.com/",
        preview: "/images/software/cmux.webp",
        logo: "/images/logos/cmux.webp",
        notes: [
          "As a fan of Ghostty, I naturally like cmux as well. It makes agentic coding simpler for me, so I use it a lot.",
        ],
        since: 2026,
        tags: ["terminal"],
      },
      {
        title: "Claude Code",
        description: "Anthropic's coding agent.",
        url: "https://claude.com/product/claude-code",
        preview: "/images/software/claude-code.webp",
        logo: "/images/logos/claude-code.webp",
        notes: [
          "Good ol' Claude, no further explanation needed.",
        ],
        tags: ["ai coding"],
      },
      {
        title: "Codex",
        description: "OpenAI's coding agent.",
        url: "https://openai.com/codex/",
        preview: "/images/software/codex.webp",
        logo: "/images/logos/codex.webp",
        notes: [
          "I mostly use it for high-level architectural planning and design decisions, with plenty of back-and-forth discussion.",
        ],
        tags: ["ai coding"],
      },
    ],
  },
];
