import ContactList from "@/components/contact-list";
import DriveEmbed from "@/components/drive-embed";
import SectionCard from "@/components/section-card";
import { driveEmbeds } from "@/data/embeds";
import { myWorkIntro } from "@/data/my-work";
import { Button, Stack, Typography } from "@mui/material";
import Link from "next/link";

export default function MyWorkPage() {
  return (
    <Stack spacing={4} component="main">
      <SectionCard
        title={myWorkIntro.title}
        eyebrow="Projects"
        eyebrowVariant="h4"
        action={
          <Link
            href={myWorkIntro.link.href}
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Button>{myWorkIntro.link.label}</Button>
          </Link>
        }
      >
        <Typography>{myWorkIntro.body}</Typography>
      </SectionCard>
      <SectionCard
        title="All Projects"
        eyebrow="Projects Gallery"
        eyebrowVariant="h4"
      >
        <DriveEmbed src={driveEmbeds.projects} title="Project gallery" />
      </SectionCard>
      <ContactList />
    </Stack>
  );
}
