import ContactList from "@/components/contact-list";
import { Stack } from "@mui/material";

export default function ContactPage() {
  return (
    <Stack spacing={4} component="main">
      <ContactList />
    </Stack>
  );
}
