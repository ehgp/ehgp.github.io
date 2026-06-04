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
        {/*
          Served live (not cached like the other stats) because the WakaTime
          card only has data once the WakaTime profile has tracked, public
          coding activity. Until then the upstream renders an error card. Once
          activity exists, scripts/fetch-stats.mjs will start caching it.
        */}
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
