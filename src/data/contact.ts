export type ContactMethod = {
  label: string;
  value: string;
  href: string;
  icon: 'twitter' | 'github' | 'linkedin' | 'email';
  color: string;
};

export const contactMethods: ContactMethod[] = [
  {
    label: 'Twitter',
    value: '@ehgp93',
    href: 'https://twitter.com/ehgp93',
    icon: 'twitter',
    color: '#1DA1F2'
  },
  {
    label: 'Email',
    value: 'ehgp@utexas.edu',
    href: 'mailto:ehgp@utexas.edu',
    icon: 'email',
    color: '#FFA930'
  },
  {
    label: 'GitHub',
    value: 'ehgp',
    href: 'https://github.com/ehgp',
    icon: 'github',
    color: '#ffffff'
  },
  {
    label: 'LinkedIn',
    value: 'ehgp',
    href: 'https://www.linkedin.com/in/ehgp',
    icon: 'linkedin',
    color: '#0A66C2'
  }
];
