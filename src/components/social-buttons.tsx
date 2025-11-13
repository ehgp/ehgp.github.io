"use client";

import { SocialLink } from "@/data/socials";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Button, Stack } from "@mui/material";
import Link from "next/link";

export default function SocialButtons({ socials }: { socials: SocialLink[] }) {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={1.5}
      flexWrap="wrap"
      sx={{ width: "100%" }}
    >
      {socials.map((social) => (
        <Button
          key={social.label}
          component={Link}
          href={social.href}
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          endIcon={<OpenInNewIcon fontSize="small" />}
          sx={{
            borderColor: social.color,
            color: social.color,
            minWidth: 100,
            width: { xs: "100%", md: "auto" },
            flex: { xs: "1 1 auto", sm: "0 0 auto" },
            justifyContent: "space-between",
          }}
        >
          {social.label}
        </Button>
      ))}
    </Stack>
  );
}
