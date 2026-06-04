"use client";

import SectionCard from "@/components/section-card";
import { localStats } from "@/data/embeds";
import { Box } from "@mui/material";

// Locally cached SVGs (see scripts/fetch-stats.mjs); no runtime dependency on
// the external stats services.
const stats = [
  { title: "GitHub Activity", src: localStats.activity },
  { title: "Contribution Streak", src: localStats.streak },
  { title: "Top Languages", src: localStats.topLanguages },
];

export default function StatsGrid() {
  return (
    <SectionCard title="Stats" eyebrow="📊" eyebrowVariant="h4">
      <Box
        sx={{
          display: "grid",
          gap: 2,
          gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0, 1fr))" },
        }}
      >
        {stats.map((stat) => (
          <Box
            key={stat.title}
            component="img"
            src={stat.src}
            alt={stat.title}
            sx={{ width: "100%", borderRadius: 2, border: "1px solid #333" }}
            loading="lazy"
          />
        ))}
      </Box>
    </SectionCard>
  );
}
