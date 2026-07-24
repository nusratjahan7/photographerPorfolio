"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1];

function CircularStamp({ text = "CERTIFIED · PROFESSIONAL PHOTOGRAPHER · " }) {
  const prefersReduced = useReducedMotion();
  const chars = text.split("");
  const step = 360 / chars.length;

  return (
    <motion.div
      className="relative h-[104px] w-[104px] shrink-0 sm:h-[124px] sm:w-[124px]"
      initial={{ opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 1.1, ease: EASE }}
    >
      <motion.div
        className="absolute inset-0"
        animate={prefersReduced ? {} : { rotate: 360 }}
        transition={
          prefersReduced ? {} : { duration: 14, repeat: Infinity, ease: "linear" }
        }
      >
        {chars.map((ch, i) => (
          <span
            key={i}
            className="absolute left-1/2 top-1/2 font-mono text-[8px] font-bold tracking-widest text-neutral-200 sm:text-[9px]"
            style={{
              transform: `rotate(${i * step}deg) translateY(-52px)`,
              transformOrigin: "0 0",
            }}
          >
            {ch}
          </span>
        ))}
      </motion.div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-red-600/70 bg-black/60 sm:h-16 sm:w-16">
          <svg viewBox="0 0 24 24" className="h-6 w-6 text-red-500" fill="none">
            <path
              d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

function FocusBracket({ className, delay = 0 }) {
  return (
    <motion.span
      className={`pointer-events-none absolute h-6 w-6 border-white/80 sm:h-8 sm:w-8 ${className}`}
      initial={{ opacity: 0, scale: 1.4 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    />
  );
}

export default function PhotographerHero({
  name = "Edward Newgate",
  tagline = "Photography that speaks for itself. I capture weddings and events for brands wanting more than pictures, they want stories.",
  badgeText = "CERTIFIED · PROFESSIONAL PHOTOGRAPHER · ",
  imageSrc = "/portrait.png",
}) {
  const prefersReduced = useReducedMotion();
  const containerRef = useRef(null);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Ghost name typography (Background level) */}
      <div className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center overflow-hidden">
        <motion.h1
          initial={{ opacity: 0, letterSpacing: "0.15em" }}
          animate={{ opacity: 1, letterSpacing: "0em" }}
          transition={{ duration: 1.4, ease: EASE }}
          className="whitespace-nowrap text-[clamp(2.5rem,18vw,11rem)] font-black uppercase leading-none text-white/[0.055]"
          style={{ fontFamily: "var(--font-display, 'Arial Narrow', sans-serif)" }}
        >
          {name}
        </motion.h1>
      </div>

      {/* Main image layer, pinned to the very top and stretched full height */}
      <div className="absolute inset-0 z-10 flex items-end justify-center">
        <div className="relative h-full w-full">
          <Image
            src={imageSrc}
            alt={name}
            fill
            priority
            quality={100}
            sizes="100vw"
            className="object-contain  z-10 object-bottom  md:object-top"
          />
          {/* soft bottom fade only, so the tagline/badge stay readable */}
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black via-black/20 to-transparent" />
        </div>
      </div>

      {/* Autofocus viewfinder frame (Overlays) */}
      <div className="absolute left-1/2 top-[34%] z-20 h-20 w-20 -translate-x-1/2 -translate-y-1/2 sm:top-[38%] sm:h-40 sm:w-40">
        <FocusBracket className="left-0 top-0 border-l-2 border-t-2" delay={0.4} />
        <FocusBracket className="right-0 top-0 border-r-2 border-t-2" delay={0.5} />
        <FocusBracket className="bottom-0 left-0 border-b-2 border-l-2" delay={0.6} />
        <FocusBracket className="bottom-0 right-0 border-b-2 border-r-2" delay={0.7} />
        {!prefersReduced && (
          <motion.span
            className="absolute inset-0 rounded-sm border border-red-500/0"
            animate={{ borderColor: ["rgba(239,68,68,0)", "rgba(239,68,68,0.6)", "rgba(239,68,68,0)"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          />
        )}
      </div>

      {/* Bottom content row */}
      <div className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-6 p-6 sm:flex-row sm:items-end sm:justify-between sm:p-10 lg:p-14">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.9, ease: EASE }}
          className="max-w-xs text-[13px] leading-relaxed text-neutral-300 sm:max-w-sm sm:text-sm"
        >
          {tagline}
        </motion.p>

        <CircularStamp text={badgeText} />
      </div>

      {/* Top/bottom hairlines */}
      <div className="absolute inset-x-0 top-0 z-20 h-px bg-white/10" />
      <div className="absolute inset-x-0 bottom-0 z-20 h-px bg-white/10" />
    </section>
  );
}