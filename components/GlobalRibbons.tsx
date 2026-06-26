"use client";

import dynamic from "next/dynamic";

const Ribbons = dynamic(() => import("@/components/Ribbons"), { ssr: false });

export function GlobalRibbons() {
  return (
    <div className="fixed inset-0 w-full h-full z-0 pointer-events-none">
      <Ribbons
        colors={["#a8aaac", "#680000"]}
        baseSpring={0.03}
        baseFriction={0.85}
        baseThickness={10}
        offsetFactor={0.05}
        maxAge={500}
        pointCount={50}
        speedMultiplier={0.6}
        enableFade={false}
        enableShaderEffect={false}
        effectAmplitude={2}
      />
    </div>
  );
}
