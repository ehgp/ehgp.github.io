"use client";

import SectionCard from "@/components/section-card";
import SocialButtons from "@/components/social-buttons";
import { hero } from "@/data/home";
import { primarySocials } from "@/data/socials";
import { Box, Chip, Stack, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <SectionCard title={hero.greeting} eyebrow="EHGP" eyebrowVariant="h4">
      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Image src={hero.emojiSrc} alt="Waving hand" width={48} height={48} />
          <Typography variant="h5" color="text.secondary">
            {hero.subtitle}
          </Typography>
        </Stack>
        <Stack spacing={1.5}>
          {hero.highlights.map((highlight) => {
            if (!highlight.href) {
              return (
                <Chip
                  key={highlight.text}
                  label={highlight.text}
                  variant="outlined"
                  sx={{ borderColor: "divider", color: "text.secondary" }}
                />
              );
            }

            const external = highlight.href.startsWith("http");
            return (
              <Box
                key={highlight.text}
                component={Link}
                href={highlight.href}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
                sx={{ textDecoration: "none", display: "inline-flex" }}
              >
                <Chip
                  label={highlight.text}
                  variant="outlined"
                  sx={{ borderColor: "divider", color: "text.secondary" }}
                />
              </Box>
            );
          })}
        </Stack>
        <SocialButtons socials={primarySocials} />
        {/* <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' } }}>
          <EyeSketch />
        </Box> */}
      </Stack>
    </SectionCard>
  );
}
