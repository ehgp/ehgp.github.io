export type HeroHighlight = {
  text: string;
  href?: string;
};

export type HeroSections = {
  title: string;
  description: string;
  id: string;
};

export const hero: {
  greeting: string;
  emojiSrc: string;
  subtitle: string;
  highlights: HeroHighlight[];
} = {
  greeting: "Hi, I'm EHGP",
  emojiSrc: "/wave.gif",
  subtitle: "🌐 Web Developer 🧑\u200d💻 Data Scientist 🧩 Cybersecurity",
  highlights: [
    { text: "🌱 I’m currently learning ERP, Open Source Solutions, XR" },
    { text: "💬 Ask me about Web Development, Web3, Investments, Engineering" },
  ],
};

export const sections: HeroSections[] = [
  {
    title: "Stats",
    description: "Live GitHub activity snapshots to highlight consistency.",
    id: "stats",
  },
  {
    title: "Languages & Tools",
    description:
      "A snapshot of the languages, frameworks, and cloud stacks I rely on.",
    id: "badges",
  },
];
