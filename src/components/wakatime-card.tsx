"use client";

import SectionCard from "@/components/section-card";
import { localStats } from "@/data/embeds";
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
        {/*
          Cached SVG built from the WakaTime JSON API by scripts/fetch-stats.mjs.
          When no coding time was tracked in the last 7 days the card renders a
          "no tracked coding time" state instead of an upstream error card.
        */}
        <Box
          component="img"
          src={localStats.wakatime}
          alt="WakaTime last 7 days"
          loading="lazy"
          sx={{ width: "100%", borderRadius: 2 }}
        />
      </Box>
    </SectionCard>
  );
}
