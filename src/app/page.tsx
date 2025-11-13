import { Stack } from '@mui/material';
import HeroSection from '@/components/hero-section';
import StatsGrid from '@/components/stats-grid';
import BadgeAccordion from '@/components/badge-accordion';
import WakatimeCard from '@/components/wakatime-card';

export default function HomePage() {
  return (
    <Stack spacing={4} component="main">
      <HeroSection />
      <StatsGrid />
      <BadgeAccordion />
      <WakatimeCard />
    </Stack>
  );
}
