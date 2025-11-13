"use client";

import SectionCard from "@/components/section-card";
import { githubStats } from "@/data/embeds";
import { Box } from "@mui/material";

const stats = [
  { title: "GitHub Activity", src: githubStats.activity },
  { title: "Contribution Streak", src: githubStats.streak },
  { title: "Top Languages", src: githubStats.topLanguages },
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
