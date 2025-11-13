"use client";

import SectionCard from "@/components/section-card";
import { githubStats } from "@/data/embeds";
import { Box } from "@mui/material";

export default function WakatimeCard() {
  return (
    <SectionCard title="This week I coded" eyebrow="🧑‍🔬" eyebrowVariant="h4">
      <Box
        component="a"
        href="https://wakatime.com/@ehgp"
        target="_blank"
        rel="noreferrer"
      >
        <Box
          component="img"
          src={githubStats.wakatime}
          alt="Wakatime stats"
          loading="lazy"
          sx={{ width: "100%", borderRadius: 2 }}
        />
      </Box>
    </SectionCard>
  );
}
