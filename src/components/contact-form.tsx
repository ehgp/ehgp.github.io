"use client";

import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import * as yup from "yup";

const contactEndpoint = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT;
const formsprEndpoint = process.env.NEXT_PUBLIC_FORMSPREE;
const recaptchaSiteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

const validationSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Enter a valid email")
    .required("Email is required"),
  message: yup
    .string()
    .min(10, "Please provide a bit more detail")
    .required("Message is required"),
});

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [statusMessage, setStatusMessage] = useState("");
  const { executeRecaptcha } = useGoogleReCaptcha();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, helpers) => {
      setStatus("idle");
      setStatusMessage("");

      if (!executeRecaptcha || !recaptchaSiteKey) {
        setStatus("error");
        setStatusMessage(
          "reCAPTCHA is not configured. Please set NEXT_PUBLIC_RECAPTCHA_SITE_KEY."
        );
        helpers.setSubmitting(false);
        return;
      }

      const submissionEndpoint = formsprEndpoint ?? contactEndpoint;

      if (!submissionEndpoint) {
        setStatus("error");
        setStatusMessage(
          "Contact endpoint is missing. Set NEXT_PUBLIC_FORMSPREE or NEXT_PUBLIC_CONTACT_ENDPOINT."
        );
        helpers.setSubmitting(false);
        return;
      }

      try {
        const token = await executeRecaptcha("contact_form");
        const payload = formsprEndpoint
          ? {
              email: values.email,
              name: values.name,
              message: values.message,
              token,
            }
          : { ...values, token };

        const response = await fetch(submissionEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Failed to submit");
        }

        helpers.resetForm();
        setStatus("success");
        setStatusMessage("Message sent successfully.");
      } catch (err) {
        setStatus("error");
        setStatusMessage(
          "Unable to send message right now. Please try again later."
        );
        if (process.env.NODE_ENV !== "production") {
          console.error(err);
        }
      } finally {
        helpers.setSubmitting(false);
      }
    },
  });

  return (
    <Box component="form" onSubmit={formik.handleSubmit} noValidate>
      <Stack spacing={2}>
        {!recaptchaSiteKey && (
          <Alert severity="warning">
            Provide <code>NEXT_PUBLIC_RECAPTCHA_SITE_KEY</code> to enable spam
            protection.
          </Alert>
        )}
        {!contactEndpoint && (
          <Alert severity="warning">
            Provide <code>NEXT_PUBLIC_CONTACT_ENDPOINT</code> to send
            submissions to your backend or webhook.
          </Alert>
        )}
        {status !== "idle" && statusMessage && (
          <Alert severity={status === "success" ? "success" : "error"}>
            {statusMessage}
          </Alert>
        )}
        <TextField
          id="name"
          name="name"
          label="Name"
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
          autoComplete="name"
          required
        />
        <TextField
          id="email"
          name="email"
          label="Email"
          type="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
          helperText={formik.touched.email && formik.errors.email}
          autoComplete="email"
          required
        />
        <TextField
          id="message"
          name="message"
          label="Message"
          multiline
          minRows={4}
          value={formik.values.message}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.message && Boolean(formik.errors.message)}
          helperText={formik.touched.message && formik.errors.message}
          required
        />
        <Typography variant="caption" color="text.secondary">
          Your information will only be used to reply to your inquiry.
        </Typography>
        <Button
          type="submit"
          variant="contained"
          size="large"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? "Sending…" : "Send message"}
        </Button>
      </Stack>
    </Box>
  );
}
