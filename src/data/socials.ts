export type SocialLink = {
  label: string;
  href: string;
  icon: "twitter" | "github" | "linkedin" | "email" | "portfolio" | "paper";
  color: string;
};

export const primarySocials: SocialLink[] = [
  {
    label: "Resume",
    href: "https://ehgp.github.io/resumes",
    icon: "paper",
    color: "#ffffff",
  },
  {
    label: "@ehgp93",
    href: "https://twitter.com/ehgp93",
    icon: "twitter",
    color: "#1DA1F2",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ehgp/",
    icon: "linkedin",
    color: "#0A66C2",
  },
  {
    label: "📫 Reach me",
    href: "mailto:ehgp95@gmail.com",
    icon: "email",
    color: "#FFA930",
  },
  {
    label: "👨\u200d💻 Projects",
    href: "https://ehgp.github.io/my-work/",
    icon: "portfolio",
    color: "#ffffff",
  },
];

export const contactLinks: SocialLink[] = [
  {
    label: "@ehgp93",
    href: "https://twitter.com/ehgp93",
    icon: "twitter",
    color: "#1DA1F2",
  },
  {
    label: "ehgp",
    href: "https://github.com/ehgp",
    icon: "github",
    color: "#ffffff",
  },
  {
    label: "ehgp",
    href: "https://www.linkedin.com/in/ehgp/",
    icon: "linkedin",
    color: "#0A66C2",
  },
  {
    label: "Mail EHGP",
    href: "mailto:ehgp95@gmail.com",
    icon: "email",
    color: "#FFA930",
  },
];
