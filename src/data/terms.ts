export interface Term {
  title?: string;
  description: string;
  image?: string;
}

export const terms: Record<string, Term> = {
  "CI/CD": {
    title: "CI/CD",
    description:
      "Continuous Integration and Continuous Delivery. A method to frequently deliver apps to customers by introducing automation into the stages of app development.",
  },
  "HTML": {
    description:
      "HyperText Markup Language. The standard markup language for documents designed to be displayed in a web browser.",
    image: "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDdtY2J6eXJ6eXJ6eXJ6eXJ6eXJ6eXJ6eXJ6eXJ6eXJ6eXJ6eSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3oKIPnAiaMCws8nOsE/giphy.gif",
  },
  "Astro": {
    description: "A web framework for building fast, content-focused websites.",
  },
};
