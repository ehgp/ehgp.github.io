import ContactList from "@/components/contact-list";
import DriveEmbed from "@/components/drive-embed";
import SectionCard from "@/components/section-card";
import { driveEmbeds } from "@/data/embeds";
import { Stack, Typography } from "@mui/material";

export default function ResumesPage() {
  return (
    <Stack spacing={4} component="main">
      <SectionCard title="Tech Resume" eyebrow="Resumes" eyebrowVariant="h4">
        <Typography variant="body2" color="text.secondary" mb={2}>
          Embedded view hosted on Google Drive for the most recent version.
        </Typography>
        <DriveEmbed src={driveEmbeds.resumeTech} title="Tech resume" />
      </SectionCard>
      <ContactList />
    </Stack>
  );
}
