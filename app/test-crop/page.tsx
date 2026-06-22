"use client";

import { useEffect, useRef, useState } from "react";

interface CropConfig {
  x: number;
  y: number;
  w: number;
  h: number;
}

const INITIAL_CROPS: Record<string, CropConfig> = {
  front: { x: 234, y: 160, w: 350, h: 560 }, // 1:1.6 aspect ratio
  frontLeft: { x: 64, y: 80, w: 231, h: 370 }, // 1:1.6 aspect ratio
  frontRight: { x: 522, y: 80, w: 231, h: 370 }, // 1:1.6 aspect ratio
  rear: { x: 82, y: 505, w: 196, h: 315 }, // 1:1.6 aspect ratio
  profile: { x: 577, y: 505, w: 196, h: 315 }, // 1:1.6 aspect ratio
};

export default function TestCropPage() {
  const [crops, setCrops] = useState<Record<string, CropConfig>>(INITIAL_CROPS);
  const [activeKey, setActiveKey] = useState<string>("front");
  const [removeBg, setRemoveBg] = useState<boolean>(true);
  const [featherX, setFeatherX] = useState<number>(3.0); // Power factor for X fade
  const [featherY, setFeatherY] = useState<number>(2.0); // Power factor for Y fade
  const [bgThreshold, setBgThreshold] = useState<number>(180); // Brightness threshold
  const [bgTolerance, setBgTolerance] = useState<number>(30); // Brightness tolerance
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasesRef = useRef<Record<string, HTMLCanvasElement | null>>({});

  const handleSliderChange = (field: keyof CropConfig, value: number) => {
    setCrops((prev) => ({
      ...prev,
      [activeKey]: {
        ...prev[activeKey],
        [field]: value,
      },
    }));
  };

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const drawCrops = () => {
      Object.entries(crops).forEach(([key, config]) => {
        const canvas = canvasesRef.current[key];
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = config.w;
        canvas.height = config.h;
        ctx.clearRect(0, 0, config.w, config.h);
        
        ctx.drawImage(
          img,
          config.x,
          config.y,
          config.w,
          config.h,
          0,
          0,
          config.w,
          config.h
        );

        if (removeBg) {
          try {
            const imgData = ctx.getImageData(0, 0, config.w, config.h);
            const data = imgData.data;
            const w = config.w;
            const h = config.h;

            for (let yIndex = 0; yIndex < h; yIndex++) {
              for (let xIndex = 0; xIndex < w; xIndex++) {
                const i = (yIndex * w + xIndex) * 4;
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                let alpha = data[i + 3];

                // 1. Calculate luminance
                const lum = r * 0.299 + g * 0.587 + b * 0.114;

                // 2. Background removal based on brightness (since background is light gray)
                // We only do this if it's not the skin (face is usually in the middle-top)
                // But we can do a softer tolerance
                if (lum > bgThreshold) {
                  const diff = lum - bgThreshold;
                  if (diff >= bgTolerance) {
                    alpha = 0;
                  } else {
                    alpha = Math.round((1 - diff / bgTolerance) * 255);
                  }
                }

                // 3. Apply soft edge feathering
                // X distance from center (0 to 1)
                const distX = Math.abs(xIndex - w / 2) / (w / 2);
                // Y distance from bottom (0 at bottom, 1 at top)
                const distY = (h - yIndex) / h;

                // Edge fade multipliers
                const fadeX = Math.max(0, 1 - Math.pow(distX, featherX));
                const fadeY = Math.max(0, 1 - Math.pow(distY, featherY));
                
                // Combine them
                const finalAlpha = Math.min(alpha, Math.round(fadeX * fadeY * 255));
                data[i + 3] = finalAlpha;
              }
            }
            ctx.putImageData(imgData, 0, 0);
          } catch (e) {
            console.error("Canvas error:", e);
          }
        }
      });
    };

    if (img.complete) {
      drawCrops();
    } else {
      img.onload = drawCrops;
    }
  }, [crops, removeBg, featherX, featherY, bgThreshold, bgTolerance]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-8 font-sans">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        Advanced Avatar Calibration & Hologram Preview
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <div className="space-y-6 bg-slate-900/50 p-6 rounded-xl border border-slate-800">
          <div className="flex gap-2 flex-wrap mb-4">
            {Object.keys(crops).map((key) => (
              <button
                key={key}
                onClick={() => setActiveKey(key)}
                className={`px-4 py-2 rounded font-semibold text-sm transition ${
                  activeKey === key
                    ? "bg-rose-600 text-white shadow-lg"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                {key.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Sliders for Cropping */}
          <div className="grid grid-cols-2 gap-4 bg-slate-950/80 p-4 rounded border border-slate-850">
            <div>
              <label className="block text-xs text-slate-400 mb-1">X: {crops[activeKey].x}px</label>
              <input
                type="range"
                min="0"
                max="818"
                value={crops[activeKey].x}
                onChange={(e) => handleSliderChange("x", parseInt(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Y: {crops[activeKey].y}px</label>
              <input
                type="range"
                min="0"
                max="1024"
                value={crops[activeKey].y}
                onChange={(e) => handleSliderChange("y", parseInt(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Width: {crops[activeKey].w}px</label>
              <input
                type="range"
                min="10"
                max="818"
                value={crops[activeKey].w}
                onChange={(e) => handleSliderChange("w", parseInt(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Height: {crops[activeKey].h}px</label>
              <input
                type="range"
                min="10"
                max="1024"
                value={crops[activeKey].h}
                onChange={(e) => handleSliderChange("h", parseInt(e.target.value))}
                className="w-full accent-rose-600"
              />
            </div>
          </div>

          {/* Advanced Hologram Controls */}
          <div className="bg-slate-950/80 p-4 rounded border border-slate-850 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-slate-300">Enable Hologram Processing</label>
              <input
                type="checkbox"
                checked={removeBg}
                onChange={(e) => setRemoveBg(e.target.checked)}
                className="w-4 h-4 accent-rose-600 cursor-pointer"
              />
            </div>
            {removeBg && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Feather X Power: {featherX}</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={featherX}
                    onChange={(e) => setFeatherX(parseFloat(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Feather Y Power: {featherY}</label>
                  <input
                    type="range"
                    min="1"
                    max="6"
                    step="0.5"
                    value={featherY}
                    onChange={(e) => setFeatherY(parseFloat(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bg Threshold (Bright): {bgThreshold}</label>
                  <input
                    type="range"
                    min="100"
                    max="240"
                    value={bgThreshold}
                    onChange={(e) => setBgThreshold(parseInt(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1">Bg Tolerance: {bgTolerance}</label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={bgTolerance}
                    onChange={(e) => setBgTolerance(parseInt(e.target.value))}
                    className="w-full accent-rose-600"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="relative border border-slate-800 rounded bg-slate-950 overflow-hidden" style={{ width: "409px", height: "512px" }}>
            <img
              ref={imgRef}
              src="/images/avatar_sheet.png"
              alt="Avatar Sheet"
              className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none select-none opacity-40"
            />
            <div
              className="absolute border-2 border-rose-500 bg-rose-500/10 pointer-events-none transition-all duration-75"
              style={{
                left: `${crops[activeKey].x / 2}px`,
                top: `${crops[activeKey].y / 2}px`,
                width: `${crops[activeKey].w / 2}px`,
                height: `${crops[activeKey].h / 2}px`,
              }}
            >
              <span className="absolute top-0 left-0 bg-rose-600 text-white text-[9px] px-1 font-bold">
                {activeKey}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Rendered crops */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold mb-4 border-b border-slate-800 pb-2 text-slate-300">
            Holographic Crop Results (Transparency Check)
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.keys(crops).map((key) => (
              <div key={key} className="flex flex-col items-center p-4 bg-slate-900/30 rounded border border-slate-800/80">
                <span className="text-xs text-slate-400 mb-2 font-mono uppercase">{key}</span>
                <div className="border border-slate-700 bg-[radial-gradient(#e11d48_1px,transparent_1px)] [background-size:16px_16px] bg-slate-950 rounded flex items-center justify-center overflow-hidden h-[180px] w-full">
                  <canvas
                    ref={(el) => {
                      canvasesRef.current[key] = el;
                    }}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900/50 p-4 rounded border border-slate-800">
            <h3 className="text-sm font-bold text-slate-300 mb-2">Coordinates & Parameters:</h3>
            <pre className="text-xs bg-slate-950 p-3 rounded overflow-x-auto text-emerald-400 border border-slate-850">
              {JSON.stringify({ crops, removeBg, featherX, featherY, bgThreshold, bgTolerance }, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
