export interface Project {
  title: string;
  description: string;
  url: string;
  tags?: string[];
}

export const projects: Project[] = [
  {
    title: "This Website",
    description: "Personal site built with Astro.",
    url: "https://github.com/AaronMinhas/personal-site",
    tags: ["software", "astro"],
  },
];
