export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'My Work', href: '/my-work' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Resumes', href: '/resumes' }
];
