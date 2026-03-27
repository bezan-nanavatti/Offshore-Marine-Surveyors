"use client";

/**
 * Code-split boundary for below-the-fold homepage sections.
 *
 * Next.js 16: dynamic imports from a Server Component to a Client Component
 * do not produce separate chunks. The split must happen inside a Client
 * Component. This wrapper owns that boundary so Hero and TrustStrip ship in
 * the critical bundle while everything below the fold is deferred.
 */
import dynamic from "next/dynamic";

const Services = dynamic(() => import("./Services"));
const About = dynamic(() => import("./About"));
const GlobalOperations = dynamic(() => import("./GlobalOperations"));
const WhyChooseUs = dynamic(() => import("./WhyChooseUs"));
const ContactCTA = dynamic(() => import("./ContactCTA"));

export default function BelowFold() {
  return (
    <>
      <Services />
      <About />
      <GlobalOperations />
      <WhyChooseUs />
      <ContactCTA />
    </>
  );
}
