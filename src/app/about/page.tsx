import ContactList from "@/components/contact-list";
import ProfileBanner from "@/components/profile-banner";
import SectionCard from "@/components/section-card";
import { aboutIntro, industries } from "@/data/about";
import { Chip, Stack, Typography } from "@mui/material";

export default function AboutPage() {
  return (
    <Stack spacing={4} component="main">
      <ProfileBanner />
      <SectionCard title="About Me" eyebrow="Profile" eyebrowVariant="h4">
        <Stack spacing={2}>
          <Typography>{aboutIntro}</Typography>
          <Typography
            variant="h6"
            fontFamily="var(--font-roboto-mono, monospace)"
          >
            Industries & Focus
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {industries.map((item) => (
              <Chip
                key={item}
                label={item}
                variant="outlined"
                sx={{ borderColor: "divider" }}
              />
            ))}
          </Stack>
        </Stack>
      </SectionCard>
      <ContactList />
    </Stack>
  );
}
