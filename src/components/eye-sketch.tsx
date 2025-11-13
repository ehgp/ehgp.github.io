'use client';

import { Box, Typography } from '@mui/material';
import { useEffect, useRef } from 'react';
import type p5 from 'p5';
import usePrefersReducedMotion from '@/hooks/use-prefers-reduced-motion';

const CANVAS = { width: 320, height: 150 } as const;
const INNER_COLORS = ['cyan', 'magenta', 'yellow'];

export default function EyeSketch() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (!containerRef.current || prefersReducedMotion) {
      return undefined;
    }

    let instance: p5 | undefined;
    let isMounted = true;

    const loadSketch = async () => {
      const { default: P5 } = await import('p5');
      if (!isMounted || !containerRef.current) {
        return;
      }

      instance = new P5((p: p5) => {
        let x = 1;
        let y = 1;
        const easing = 0.1;
        let nextBlink = 0;
        let innerColor = INNER_COLORS[0];

        p.setup = () => {
          const canvas = p.createCanvas(CANVAS.width, CANVAS.height);
          canvas.parent(containerRef.current!);
          p.rectMode(p.CENTER);
        };

        p.draw = () => {
          p.background(51);
          p.fill(51);
          p.strokeWeight(3);
          p.stroke(255);

          const headSize = Math.min(p.width / 2, p.height / 2);
          p.line(p.width / 2 - headSize / 2, p.height / 2, p.width / 2 - headSize / 2, p.height);
          p.line(p.width / 2 + headSize / 2, p.height / 2, p.width / 2 + headSize / 2, p.height);
          p.arc(p.width / 2, p.height / 2, headSize, headSize, Math.PI, 2 * Math.PI);

          p.push();

          const targetX = p.mouseX;
          const dx = targetX - x;
          x += dx * easing;

          const targetY = p.mouseY;
          const dy = targetY - y;
          y += dy * easing;

          const mX = Math.min(x, p.width * 2.5) - p.width / 2;
          const mY = Math.min(y, p.width * 2.5) - p.height / 2;
          const ipd = headSize / 4;
          const pupilSize = 8;

          p.translate(p.width / 2, p.height / 2);

          p.translate(mX * 0.025, mY * 0.025);
          p.rect(0, 0, ipd * 4, pupilSize * 5);
          p.stroke(innerColor);
          p.rect(0, 0, ipd * 4 - 10, pupilSize * 5 - 10);

          p.stroke(255);
          p.translate(mX * -0.005, mY * -0.005);
          const blink = p.millis() > nextBlink;

          if (blink) {
            p.line(-ipd / 2 - 1, 0, -ipd / 2 + 1, 0);
            p.line(ipd / 2 - 1, 0, ipd / 2 + 1, 0);
            if (p.millis() > nextBlink + 100) {
              nextBlink = p.millis() + p.random() * 3000;
              innerColor = INNER_COLORS[Math.floor(p.random(INNER_COLORS.length))];
            }
          } else {
            p.line(-ipd / 2, pupilSize / 2, -ipd / 2, -pupilSize / 2);
            p.line(ipd / 2, pupilSize / 2, ipd / 2, -pupilSize / 2);
          }

          p.noFill();
          p.translate(mX * 0.005, mY * 0.005);

          const offset = -((p.millis() % 1000) / 1000);
          p.translate(offset * mX * 0.01, offset * mY * 0.01);

          for (let i = 3 + offset; i < 9; i += 1) {
            p.stroke(255, 255, 255, 255 - ((i - 1) * 255) / 8);
            p.translate(mX * 0.01, mY * 0.01);
            p.rect(0, 0, (ipd * 4 * i) / 2, (pupilSize * 5 * i) / 2);
          }

          p.pop();
        };
      });
    };

    void loadSketch();

    return () => {
      isMounted = false;
      instance?.remove();
    };
  }, [prefersReducedMotion]);

  return (
    <Box
      ref={containerRef}
      sx={{
        width: CANVAS.width,
        height: CANVAS.height,
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'black',
        overflow: 'hidden'
      }}
      aria-hidden={!prefersReducedMotion}
    >
      {prefersReducedMotion && (
        <Typography variant="caption" color="text.secondary">
          Animation disabled to respect reduced motion preferences.
        </Typography>
      )}
    </Box>
  );
}
