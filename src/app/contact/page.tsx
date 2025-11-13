import ContactList from "@/components/contact-list";
import SectionCard from "@/components/section-card";
import { Stack, Typography } from "@mui/material";

export default function ContactPage() {
  return (
    <Stack spacing={4} component="main">
      <SectionCard
        title="Let’s collaborate"
        eyebrow="Contact"
        eyebrowVariant="h4"
      >
        <Typography>
          Whether you want to discuss full-stack architectures, XR, or emerging
          tech investments, I respond fastest on Twitter and email.
        </Typography>
        {/* <ContactForm /> */}
      </SectionCard>
      <ContactList />
    </Stack>
  );
}
