"use client";

import SectionCard from "@/components/section-card";
import { contactMethods } from "@/data/contact";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import Link from "next/link";

const iconMap = {
  twitter: TwitterIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: EmailIcon,
};

export default function ContactList() {
  return (
    <SectionCard title="Contact" eyebrow="Reach out" eyebrowVariant="h4">
      <List>
        {contactMethods.map((method) => {
          const Icon = iconMap[method.icon];
          return (
            <ListItem
              key={method.label}
              component={Link}
              href={method.href}
              target={method.icon === "email" ? "_self" : "_blank"}
              rel="noreferrer"
              sx={{ color: "inherit" }}
            >
              <ListItemAvatar>
                <Avatar
                  sx={{
                    bgcolor: "transparent",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Icon htmlColor={method.color} />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={method.value} secondary={method.label} />
            </ListItem>
          );
        })}
      </List>
    </SectionCard>
  );
}
