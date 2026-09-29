import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "./Navbar";
import Footer from "./Footer";
import SceneBackground from "./three/SceneBackground";
import ScrollProgressBar from "./motion/ScrollProgressBar";

export default function Layout() {
  const location = useLocation();

  return (
    <>
      {/* Persistent 3D scene behind every page */}
      <SceneBackground />
      <ScrollProgressBar />

      <div className="relative z-10">
        <Navbar />
        {/*
          Deliberately NOT using AnimatePresence with mode="wait" here.
          That mode makes the incoming page wait for the outgoing page's
          exit animation to fully finish before it renders — and on a
          page as heavy as Home (video playlist, scroll-scrubbed sections,
          3D coverflow, multiple scroll listeners), something in that exit
          could stall or throw during cleanup, which left the *next* page
          stuck waiting forever with nothing on screen. Nav/3D background
          stayed visible because they live outside this block — only the
          gated content area went blank.

          A simple key-based remount with its own enter animation avoids
          that dependency entirely: the new page starts appearing
          immediately, regardless of what the previous page was doing.
        */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] as const }}
          className={location.pathname === "/" ? undefined : "pt-[86px] sm:pt-[96px]"}
        >
          <Outlet />
        </motion.div>
        <Footer />
      </div>
    </>
  );
}
