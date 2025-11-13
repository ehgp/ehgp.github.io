"use client";

import SectionCard from "@/components/section-card";
import { badgeSections } from "@/data/badges";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Stack,
  Typography,
} from "@mui/material";

export default function BadgeAccordion() {
  return (
    <SectionCard title="Stacks" eyebrow="🛠️" eyebrowVariant="h4">
      <Stack spacing={2}>
        {badgeSections.map((section) => (
          <Accordion
            key={section.title}
            defaultExpanded
            disableGutters
            sx={{
              bgcolor: "transparent",
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "none",
              "&:before": { display: "none" },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                "& .MuiAccordionSummary-expandIconWrapper": {
                  transition: "transform 0.3s ease",
                },
                "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                  transform: "rotate(180deg)",
                },
              }}
            >
              <Typography variant="h6">
                {section.emoji} {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack direction="row" flexWrap="wrap" gap={1.5}>
                {section.badges.map((badge) => (
                  <Box
                    key={badge.label}
                    component="a"
                    href={badge.href}
                    target="_blank"
                    rel="noreferrer"
                    sx={{ display: "inline-block" }}
                  >
                    <Box
                      component="img"
                      src={badge.image}
                      alt={badge.label}
                      loading="lazy"
                      sx={{ height: 32 }}
                    />
                  </Box>
                ))}
              </Stack>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </SectionCard>
  );
}
