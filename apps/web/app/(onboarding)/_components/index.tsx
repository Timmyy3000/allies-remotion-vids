"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { TextLoader } from "generative-loaders";
import "generative-loaders/styles.css";

/* =========================================================================
   TYPES & CONFIGURATIONS
   ========================================================================= */

type IntroStage =
  | "loader"
  | "settling"
  | "brandTransform"
  | "charactersEntering"
  | "idle";

interface IdleMotionConfig {
  y: number[];
  x: number[];
  rotate: number[];
  duration: number;
}

const BLUE_IDLE: IdleMotionConfig = {
  y: [0, -6, 0],
  x: [0, 2, 0],
  rotate: [0, 2, 0],
  duration: 3.7,
};

const GREEN_IDLE: IdleMotionConfig = {
  y: [0, -5, 1, 0],
  x: [0, -2, 0],
  rotate: [0, -1.5, 0],
  duration: 4.4,
};

const PINK_IDLE: IdleMotionConfig = {
  y: [0, -4, 1, 0],
  x: [0, 3, 0],
  rotate: [0, -2, 0],
  duration: 4.1,
};

const YELLOW_IDLE: IdleMotionConfig = {
  y: [0, -7, 0],
  x: [0, 1, -1, 0],
  rotate: [0, 2, 0],
  duration: 3.3,
};

/* =========================================================================
   MAIN ONBOARDING COMPONENT
   ========================================================================= */

export default function Onboarding() {
  const reducedMotion = useReducedMotion();
  const [stage, setStage] = useState<IntroStage>("loader");

  // Word-by-word staggered entrance flags
  const [wordState, setWordState] = useState({
    were: false,
    your: false,
    allies: false,
  });

  // Staggered ally entrance flags
  const [revealedAllies, setRevealedAllies] = useState({
    blue: false,
    green: false,
    pink: false,
    yellow: false,
  });

  const effectiveStage: IntroStage = reducedMotion ? "idle" : stage;
  const isWereVisible = Boolean(reducedMotion) || wordState.were;
  const isYourVisible = Boolean(reducedMotion) || wordState.your;
  const isAlliesVisible = Boolean(reducedMotion) || wordState.allies;

  const isBlueRevealed = Boolean(reducedMotion) || revealedAllies.blue;
  const isGreenRevealed = Boolean(reducedMotion) || revealedAllies.green;
  const isPinkRevealed = Boolean(reducedMotion) || revealedAllies.pink;
  const isYellowRevealed = Boolean(reducedMotion) || revealedAllies.yellow;

  useEffect(() => {
    if (reducedMotion) {
      return;
    }

    // --- 1. WORD-BY-WORD STAGGERED INTRO ---
    // "We're" starts immediately
    const word1Timer = setTimeout(() => {
      setWordState((prev) => ({ ...prev, were: true }));
    }, 40);

    // "your" starts ~240ms later
    const word2Timer = setTimeout(() => {
      setWordState((prev) => ({ ...prev, your: true }));
    }, 280);

    // "allies" starts ~240ms later
    const word3Timer = setTimeout(() => {
      setWordState((prev) => ({ ...prev, allies: true }));
    }, 520);

    // --- 2. SETTLING MOMENT ---
    // All 3 words resolve, brief pause before transformation
    const settleTimer = setTimeout(() => {
      setStage("settling");
    }, 1250);

    // --- 3. BRAND TRANSFORMATION ---
    // "allies" turns orange & translates right, Allies logo enters
    const transformTimer = setTimeout(() => {
      setStage("brandTransform");
    }, 1550);

    // --- 4. ALLY CHARACTERS ARRIVAL ---
    const charsTimer = setTimeout(() => {
      setStage("charactersEntering");
    }, 2150);

    const blueTimer = setTimeout(() => {
      setRevealedAllies((prev) => ({ ...prev, blue: true }));
    }, 2250);

    const greenTimer = setTimeout(() => {
      setRevealedAllies((prev) => ({ ...prev, green: true }));
    }, 2450);

    const pinkTimer = setTimeout(() => {
      setRevealedAllies((prev) => ({ ...prev, pink: true }));
    }, 2650);

    const yellowTimer = setTimeout(() => {
      setRevealedAllies((prev) => ({ ...prev, yellow: true }));
    }, 2850);

    // --- 5. IDLE FLOATING STATE ---
    const idleTimer = setTimeout(() => {
      setStage("idle");
    }, 3200);

    return () => {
      clearTimeout(word1Timer);
      clearTimeout(word2Timer);
      clearTimeout(word3Timer);
      clearTimeout(settleTimer);
      clearTimeout(transformTimer);
      clearTimeout(charsTimer);
      clearTimeout(blueTimer);
      clearTimeout(greenTimer);
      clearTimeout(pinkTimer);
      clearTimeout(yellowTimer);
      clearTimeout(idleTimer);
    };
  }, [reducedMotion]);

  return (
    <main className="min-h-screen w-full bg-[#FFFFFF] flex flex-col items-center justify-center relative overflow-hidden select-none px-4">
      {/* Centered Hero Stage */}
      <div className="relative flex items-center justify-center w-full max-w-[960px] py-28 sm:py-36">
        {/* Headline with 3 Independent Word Entities in an 86px Alignment Row */}
        <HeadlineLockup
          stage={effectiveStage}
          wordState={{
            were: isWereVisible,
            your: isYourVisible,
            allies: isAlliesVisible,
          }}
          reducedMotion={Boolean(reducedMotion)}
        />

        {/* Decorative Ally Characters (Reusable AllyActor + AllyOrb) */}
        {/* Blue Ally: Above headline, slightly left of center */}
        <AllyActor
          anchorClass="-top-14 sm:-top-16 left-[18%] sm:left-[28%]"
          isRevealed={isBlueRevealed}
          isFloating={effectiveStage === "idle"}
          initialRotation={-4}
          idleMotion={BLUE_IDLE}
          reducedMotion={Boolean(reducedMotion)}
        >
          <AllyOrb color="#3446E9" size={38}>
            <BlueEntity />
          </AllyOrb>
        </AllyActor>

        {/* Green Ally: Below-left of headline */}
        <AllyActor
          anchorClass="-bottom-16 sm:-bottom-20 left-[2%] sm:left-[8%]"
          isRevealed={isGreenRevealed}
          isFloating={effectiveStage === "idle"}
          initialRotation={3}
          idleMotion={GREEN_IDLE}
          reducedMotion={Boolean(reducedMotion)}
        >
          <AllyOrb color="#12C25B" size={38}>
            <GreenEntity />
          </AllyOrb>
        </AllyActor>

        {/* Pink/Red Ally: To the right of "allies" */}
        <AllyActor
          anchorClass="-top-4 sm:-top-6 right-[1%] sm:right-[6%]"
          isRevealed={isPinkRevealed}
          isFloating={effectiveStage === "idle"}
          initialRotation={-3}
          idleMotion={PINK_IDLE}
          reducedMotion={Boolean(reducedMotion)}
        >
          <AllyOrb color="#FD304F" size={38}>
            <PinkEntity />
          </AllyOrb>
        </AllyActor>

        {/* Yellow Ally: Below headline, slightly right of center */}
        <AllyActor
          anchorClass="-bottom-16 sm:-bottom-20 right-[22%] sm:right-[32%]"
          isRevealed={isYellowRevealed}
          isFloating={effectiveStage === "idle"}
          initialRotation={4}
          idleMotion={YELLOW_IDLE}
          reducedMotion={Boolean(reducedMotion)}
        >
          <AllyOrb color="#FBE65F" size={38}>
            <YellowEntity />
          </AllyOrb>
        </AllyActor>
      </div>
    </main>
  );
}

/* =========================================================================
   HEADLINE LOCKUP (86PX ALIGNMENT ROW WITH 3 INDEPENDENT ANIMATED WORDS)
   ========================================================================= */

function HeadlineLockup({
  stage,
  wordState,
  reducedMotion,
}: {
  stage: IntroStage;
  wordState: { were: boolean; your: boolean; allies: boolean };
  reducedMotion: boolean;
}) {
  const isTransformed =
    stage === "brandTransform" ||
    stage === "charactersEntering" ||
    stage === "idle";

  return (
    <div
      className="headline-row relative inline-flex items-center justify-center whitespace-nowrap flex-nowrap h-[48px] sm:h-[68px] md:h-[86px] font-[700] text-[40px] sm:text-[56px] md:text-[72px] leading-[1] text-[#121212] select-none"
      style={
        {
          fontFamily:
            'var(--font-open-runde), "SF Pro Rounded", system-ui, -apple-system, sans-serif',
          letterSpacing: "-0.5px",
          "--tl-font":
            'var(--font-open-runde), "SF Pro Rounded", system-ui, -apple-system, sans-serif',
          "--tl-color": "#121212",
        } as React.CSSProperties
      }
    >
      {/* Normalize TextLoader internal wrappers to full-height flex centering */}
      <style>{`
        .headline-row .tl-loader,
        .headline-row .tl-visual {
          display: inline-flex !important;
          align-items: center !important;
          height: 100% !important;
          line-height: 1 !important;
        }
        .headline-row .tl-copy,
        .headline-row .tl-word {
          display: inline-flex !important;
          align-items: center !important;
          height: 100% !important;
          line-height: 1 !important;
        }
        .headline-row .tl-char {
          display: inline-block !important;
          line-height: 1 !important;
        }
      `}</style>

      {/* WORD 1: "We're" (Stationary Anchor in 86px Center Box) */}
      <div className="headline-word-wrapper h-full inline-flex items-center relative">
        {wordState.were ? (
          <TextLoader
            text="We're"
            variant="focus"
            speed={1.15}
            color="#121212"
            className="inline-block text-[40px] sm:text-[56px] md:text-[72px] font-[700] leading-[1] tracking-[-0.5px]"
          />
        ) : (
          <span className="invisible leading-[1]">We&apos;re</span>
        )}
      </div>

      {/* Spacing between "We're" and "your" */}
      <span className="inline-block select-none" style={{ width: "0.26em" }}>
        &nbsp;
      </span>

      {/* WORD 2: "your" (Stationary Anchor in 86px Center Box) */}
      <div className="headline-word-wrapper h-full inline-flex items-center relative">
        {wordState.your ? (
          <TextLoader
            text="your"
            variant="focus"
            speed={1.15}
            color="#121212"
            className="inline-block text-[40px] sm:text-[56px] md:text-[72px] font-[700] leading-[1] tracking-[-0.5px]"
          />
        ) : (
          <span className="invisible leading-[1]">your</span>
        )}
      </div>

      {/* TRANSFORMING LOGO SLOT & WORD 3 ("allies") */}
      <div className="relative inline-flex items-center h-full">
        {/* Natural initial spacing between "your" and "allies" */}
        <span className="inline-block select-none" style={{ width: "0.26em" }}>
          &nbsp;
        </span>

        {/* LOGO ENTRANCE SLOT (Optically Centered in 86px Height Row) */}
        <div
          className="logo-alignment-wrapper absolute left-[0.26em] top-0 bottom-0 flex items-center justify-center pointer-events-none"
          style={{
            width: "1.24em",
          }}
        >
          {isTransformed && (
            <motion.div
              className="logo-animation-wrapper flex items-center justify-center"
              initial={
                reducedMotion
                  ? { opacity: 1, scale: 1, y: 0 }
                  : { opacity: 0, scale: 0.72, y: 8 }
              }
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={
                reducedMotion
                  ? { duration: 0.01 }
                  : {
                      type: "spring",
                      stiffness: 220,
                      damping: 17,
                      mass: 0.8,
                      delay: 0.08,
                    }
              }
            >
              <AlliesLogo />
            </motion.div>
          )}
        </div>

        {/* WORD 3: "allies" (Centered in 86px Row, Transforms Color + Translates Right) */}
        <div className="headline-word-wrapper h-full inline-flex items-center relative">
          <motion.div
            className="allies-motion-wrapper inline-flex items-center origin-left select-none"
            initial={false}
            animate={{
              x: isTransformed ? "1.40em" : "0em",
              color: isTransformed ? "#FF5800" : "#121212",
            }}
            transition={{
              x: reducedMotion
                ? { duration: 0.01 }
                : { type: "spring", stiffness: 200, damping: 20, mass: 0.8 },
              color: reducedMotion
                ? { duration: 0.01 }
                : { duration: 0.4, ease: "easeOut" },
            }}
          >
            {wordState.allies ? (
              <TextLoader
                text="allies"
                variant="focus"
                speed={1.15}
                color="currentColor"
                className="inline-block text-[40px] sm:text-[56px] md:text-[72px] font-[700] leading-[1] tracking-[-0.5px]"
              />
            ) : (
              <span className="invisible leading-[1]">allies</span>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   OFFICIAL ALLIES LOGO COMPONENT (89 × 86)
   ========================================================================= */

function AlliesLogo() {
  return (
    <svg
      viewBox="0 0 89 86"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[49px] h-[48px] sm:w-[70px] sm:h-[68px] md:w-[89px] md:h-[86px] shrink-0 select-none block"
      style={{
        filter: "drop-shadow(0 2px 8px rgba(255, 88, 0, 0.22))",
      }}
    >
      <rect width="88.2783" height="86" rx="21.5" fill="#FF5800" />
      <path
        d="M69.8432 38.4509C69.0729 48.3073 65.3218 51.7372 61.764 55.4198C58.2062 59.1024 61.0803 65.8854 56.872 66.7565C52.6638 67.6276 50.8682 60.5466 49.8965 60.5466C48.9248 60.5466 49.534 71.6667 44.0491 71.6667C38.5641 71.6667 38.7386 60.5466 37.8229 60.5466C36.9071 60.5466 34.191 68.1917 30.3367 66.9009C26.4824 65.6102 29.2989 58.7414 25.2964 55.492C20.9066 51.9282 17.842 48.7045 17.3655 38.9563C16.889 29.2082 25.7411 14.3333 44.0491 14.3333C62.357 14.3333 70.6136 28.5945 69.8432 38.4509Z"
        fill="white"
      />
      <path
        d="M61.764 55.4198L63.0768 56.6881V56.6881L61.764 55.4198ZM69.8432 38.4509L71.663 38.5931V38.5931L69.8432 38.4509ZM17.3655 38.9563L19.1886 38.8672L17.3655 38.9563ZM25.2964 55.492L26.4469 54.0749H26.4469L25.2964 55.492ZM30.3367 66.9009L29.7571 68.6317V68.6317L30.3367 66.9009ZM56.872 66.7565L57.242 68.5439V68.5439L56.872 66.7565ZM61.764 55.4198L63.0768 56.6881C64.8077 54.8964 66.8142 52.9488 68.4279 50.1662C70.065 47.3433 71.26 43.7485 71.663 38.5931L69.8432 38.4509L68.0235 38.3087C67.6561 43.0097 66.5904 46.058 65.27 48.3348C63.9261 50.652 62.2782 52.2606 60.4513 54.1516L61.764 55.4198ZM44.0491 14.3333V12.5081C24.5994 12.5081 15.0199 28.3567 15.5424 39.0455L17.3655 38.9563L19.1886 38.8672C18.7581 30.0597 26.8828 16.1586 44.0491 16.1586V14.3333ZM17.3655 38.9563L15.5424 39.0455C15.7892 44.0959 16.7148 47.6389 18.2685 50.4309C19.8201 53.2191 21.9133 55.0965 24.146 56.9091L25.2964 55.492L26.4469 54.0749C24.2898 52.3238 22.6557 50.8074 21.4584 48.6558C20.2632 46.5079 19.4182 43.5649 19.1886 38.8672L17.3655 38.9563ZM25.2964 55.492L24.146 56.9091C25.4807 57.9927 25.7631 59.709 26.0602 62.1514C26.1916 63.2315 26.3447 64.5599 26.7846 65.6918C27.2671 66.9335 28.152 68.0942 29.7571 68.6317L30.3367 66.9009L30.9163 65.1701C30.5942 65.0623 30.3858 64.8803 30.1873 64.3696C29.9462 63.7491 29.8306 62.9152 29.6841 61.7105C29.4253 59.5836 29.1146 56.2407 26.4469 54.0749L25.2964 55.492ZM30.3367 66.9009L29.7571 68.6317C31.3967 69.1808 32.873 68.7258 34.0091 67.976C35.0938 67.2601 35.9771 66.2155 36.6569 65.2828C37.3394 64.3463 37.9424 63.3389 38.3484 62.7015C38.5716 62.351 38.7155 62.1425 38.8075 62.0303C38.8551 61.9723 38.8356 62.0066 38.7553 62.0695C38.7116 62.1037 38.3749 62.3719 37.8229 62.3719V60.5466V58.7213C37.1564 58.7213 36.6911 59.0493 36.5052 59.1948C36.2826 59.3691 36.1071 59.5664 35.9852 59.7148C35.7384 60.0158 35.4897 60.3944 35.2693 60.7404C34.788 61.4961 34.2994 62.3194 33.7066 63.1328C33.111 63.95 32.5354 64.5747 31.9982 64.9292C31.5124 65.2498 31.2038 65.2664 30.9163 65.1701L30.3367 66.9009ZM37.8229 60.5466V62.3719C36.8696 62.3719 36.4481 61.659 36.431 61.6315C36.357 61.5117 36.3504 61.4528 36.3838 61.5613C36.443 61.7534 36.5158 62.0896 36.6175 62.6249C36.8068 63.6209 37.0591 65.1077 37.4613 66.5859C37.8595 68.0492 38.4521 69.6981 39.4223 71.0129C40.4329 72.3825 41.9446 73.492 44.0491 73.492V71.6667V69.8414C43.411 69.8414 42.8877 69.5608 42.3597 68.8454C41.7914 68.0752 41.342 66.9441 40.9838 65.6274C40.6295 64.3256 40.4109 63.0323 40.2039 61.9433C40.1075 61.4361 40.0009 60.9035 39.8729 60.4875C39.8127 60.292 39.7107 59.9941 39.5359 59.7115C39.4181 59.521 38.8907 58.7213 37.8229 58.7213V60.5466ZM44.0491 71.6667V73.492C46.1646 73.492 47.6598 72.3703 48.6356 70.9755C49.5652 69.647 50.0976 67.9869 50.4419 66.5251C50.7896 65.049 50.9906 63.5567 51.147 62.5699C51.2316 62.0358 51.2941 61.7081 51.346 61.5268C51.3757 61.4231 51.3671 61.4959 51.2843 61.63C51.2391 61.7032 50.8169 62.3719 49.8965 62.3719V60.5466V58.7213C48.8546 58.7213 48.3233 59.4769 48.1776 59.713C47.9943 60.01 47.8938 60.3216 47.8364 60.522C47.7142 60.9489 47.622 61.4899 47.5414 61.9984C47.3674 63.0966 47.1957 64.3843 46.8886 65.6882C46.5781 67.0064 46.1737 68.1264 45.6445 68.8828C45.1615 69.5731 44.676 69.8414 44.0491 69.8414V71.6667ZM49.8965 60.5466V62.3719C49.3971 62.3719 49.0754 62.1488 48.9801 62.076C48.874 61.9948 48.8359 61.9366 48.8656 61.9746C48.9249 62.0504 49.0335 62.2183 49.2189 62.5435C49.5448 63.1151 50.0554 64.0869 50.6471 64.9836C51.7486 66.6526 53.8842 69.2389 57.242 68.5439L56.872 66.7565L56.5021 64.9691C55.6516 65.1452 54.7854 64.6265 53.694 62.9728C53.1894 62.2082 52.8058 61.4642 52.3902 60.7353C52.2049 60.4103 51.9809 60.0318 51.7396 59.7237C51.619 59.5698 51.4386 59.3603 51.1973 59.1759C50.9669 58.9997 50.5174 58.7213 49.8965 58.7213V60.5466ZM56.872 66.7565L57.242 68.5439C58.9236 68.1958 59.9753 67.1815 60.5677 65.9027C61.0895 64.7762 61.2542 63.4379 61.376 62.3445C61.6527 59.8604 61.8219 57.9869 63.0768 56.6881L61.764 55.4198L60.4513 54.1516C58.1484 56.5353 57.9757 59.8947 57.7479 61.9405C57.6174 63.1121 57.4893 63.863 57.2552 64.3684C57.0917 64.7214 56.9245 64.8817 56.5021 64.9691L56.872 66.7565ZM69.8432 38.4509L71.663 38.5931C72.5104 27.7504 63.4945 12.5081 44.0491 12.5081V14.3333V16.1586C61.2194 16.1586 68.7168 29.4385 68.0235 38.3087L69.8432 38.4509Z"
        fill="black"
      />
      <path
        d="M28.5931 27.6198C30.8708 27.6198 32.717 31.0867 32.717 35.3623C32.717 39.638 30.8708 43.1049 28.5931 43.1049C26.3154 43.1049 24.4692 39.638 24.4692 35.3623C24.4692 31.0867 26.3154 27.6198 28.5931 27.6198Z"
        fill="black"
      />
      <mask
        id="mask0_36_2291"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="24"
        y="27"
        width="9"
        height="17"
      >
        <path
          d="M28.5961 27.6285C30.8622 27.6285 32.7117 31.0795 32.7117 35.3622C32.7117 39.6449 30.8622 43.0959 28.5961 43.0959C26.3134 43.0959 24.4639 39.6449 24.4639 35.3622C24.4639 31.0795 26.3134 27.6285 28.5961 27.6285Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask0_36_2291)">
        <path
          d="M27.8888 35.1518C28.0875 35.2634 28.0875 35.5495 27.8888 35.6611L22.9456 38.4368C22.7509 38.5461 22.5105 38.4054 22.5105 38.1821L22.5105 32.6307C22.5105 32.4074 22.7509 32.2667 22.9456 32.3761L27.8888 35.1518Z"
          fill="white"
        />
      </g>
      <path
        d="M42.3302 27.6198C44.6079 27.6198 46.4541 31.0866 46.4541 35.3623C46.4541 39.6379 44.6079 43.1048 42.3302 43.1048C40.0525 43.1048 38.2063 39.6379 38.2063 35.3623C38.2063 31.0866 40.0525 27.6198 42.3302 27.6198Z"
        fill="black"
      />
      <mask
        id="mask1_36_2291"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="38"
        y="27"
        width="9"
        height="17"
      >
        <path
          d="M42.3335 27.6285C44.5996 27.6285 46.4491 31.0795 46.4491 35.3622C46.4491 39.6449 44.5996 43.0959 42.3335 43.0959C40.0508 43.0959 38.2013 39.6449 38.2013 35.3622C38.2013 31.0795 40.0508 27.6285 42.3335 27.6285Z"
          fill="white"
        />
      </mask>
      <g mask="url(#mask1_36_2291)">
        <path
          d="M41.6257 35.1517C41.8245 35.2633 41.8245 35.5494 41.6257 35.661L36.6825 38.4367C36.4878 38.546 36.2475 38.4053 36.2475 38.1821L36.2475 32.6307C36.2475 32.4074 36.4878 32.2667 36.6825 32.376L41.6257 35.1517Z"
          fill="white"
        />
      </g>
    </svg>
  );
}

/* =========================================================================
   REUSABLE ALLY ORB COMPONENT
   ========================================================================= */

interface AllyOrbProps {
  color: string;
  size?: number;
  children?: React.ReactNode;
  className?: string;
}

export function AllyOrb({
  color,
  size = 38,
  children,
  className = "",
}: AllyOrbProps) {
  return (
    <div
      className={`rounded-full flex items-center justify-center relative overflow-hidden shrink-0 select-none shadow-[0_2px_10px_rgba(0,0,0,0.06)] ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
    >
      {/* Optical centering container for inside entities */}
      <div className="w-[72%] h-[72%] flex items-center justify-center relative">
        {children}
      </div>
    </div>
  );
}

/* =========================================================================
   REUSABLE ALLY ACTOR (MOTION & LIFECYCLE WRAPPER)
   ========================================================================= */

interface AllyActorProps {
  children: React.ReactNode;
  anchorClass: string;
  isRevealed: boolean;
  isFloating: boolean;
  initialRotation?: number;
  idleMotion: IdleMotionConfig;
  reducedMotion?: boolean;
}

export function AllyActor({
  children,
  anchorClass,
  isRevealed,
  isFloating,
  initialRotation = 0,
  idleMotion,
  reducedMotion = false,
}: AllyActorProps) {
  return (
    // Layer 1: Base Page Anchor
    <div
      className={`ally-position-anchor absolute pointer-events-none z-10 ${anchorClass}`}
    >
      {/* Layer 2: Future Cursor Interaction Offset Layer (currently 0) */}
      <motion.div
        className="future-interaction-layer"
        style={{ x: 0, y: 0 }}
      >
        {/* Layer 3: Entrance Pop + Idle Float Motion Layer */}
        <motion.div
          className="entrance-and-float-layer scale-75 sm:scale-90 md:scale-100 origin-center"
          initial={{
            opacity: 0,
            scale: 0,
            y: 8,
            rotate: initialRotation,
          }}
          animate={
            isRevealed
              ? isFloating && !reducedMotion
                ? {
                    opacity: 1,
                    scale: 1,
                    y: idleMotion.y,
                    x: idleMotion.x,
                    rotate: idleMotion.rotate,
                  }
                : {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    x: 0,
                    rotate: 0,
                  }
              : {
                  opacity: 0,
                  scale: 0,
                  y: 8,
                  rotate: initialRotation,
                }
          }
          transition={
            isFloating && !reducedMotion
              ? {
                  y: {
                    duration: idleMotion.duration,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  x: {
                    duration: idleMotion.duration * 1.15,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                  rotate: {
                    duration: idleMotion.duration * 0.95,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }
              : {
                  opacity: { duration: reducedMotion ? 0.01 : 0.35, ease: "easeOut" },
                  scale: reducedMotion
                    ? { duration: 0.01 }
                    : { type: "spring", stiffness: 280, damping: 18, mass: 0.7 },
                  y: { duration: reducedMotion ? 0.01 : 0.35, ease: "easeOut" },
                }
          }
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
  );
}

/* =========================================================================
   ALLY CHARACTER ENTITIES (FACE ARTWORK)
   ========================================================================= */

function PupilWithReflection({
  pupilW,
  pupilH,
}: {
  pupilW: number;
  pupilH: number;
}) {
  return (
    <div
      style={{
        width: pupilW,
        height: pupilH,
        backgroundColor: "#000000",
        borderRadius: "99px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "15%",
          right: "15%",
          width: pupilW * 0.65,
          height: pupilH * 0.45,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <svg viewBox="0 0 3 3" fill="none" className="w-full h-full">
          <polygon points="1.5,0 3,3 0,3" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );
}

export function BlueEntity() {
  return (
    <div className="w-[26px] h-[26px] rounded-full bg-white border-[1.8px] border-black flex items-center justify-center relative shadow-sm">
      <div className="flex gap-[4px] items-center">
        <PupilWithReflection pupilW={3.6} pupilH={6.2} />
        <PupilWithReflection pupilW={3.6} pupilH={6.2} />
      </div>
    </div>
  );
}

export function GreenEntity() {
  return (
    <div className="w-[26px] h-[23px] rounded-full bg-white border-[1.6px] border-black flex items-center justify-center relative shadow-sm">
      <div className="flex gap-[4px] items-center">
        <PupilWithReflection pupilW={3.4} pupilH={6.2} />
        <PupilWithReflection pupilW={3.4} pupilH={6.2} />
      </div>
    </div>
  );
}

export function PinkEntity() {
  return (
    <div className="w-[26px] h-[27px] rounded-full bg-white border-[1.7px] border-black flex items-center justify-center relative shadow-sm">
      <div className="flex gap-[4.5px] items-center">
        <PupilWithReflection pupilW={3.8} pupilH={6.8} />
        <PupilWithReflection pupilW={3.8} pupilH={6.8} />
      </div>
    </div>
  );
}

export function YellowEntity() {
  return (
    <div className="w-[24px] h-[24px] rounded-[6.5px] bg-white border-[1.6px] border-black flex items-center justify-center relative shadow-sm">
      <div className="flex gap-[4px] items-center">
        <PupilWithReflection pupilW={3.6} pupilH={6.8} />
        <PupilWithReflection pupilW={3.6} pupilH={6.8} />
      </div>
    </div>
  );
}
