import { useId } from "react";

type PerfumeBottleProps = {
  tone?: string;
  view?: number;
  label?: string;
  className?: string;
};

export function PerfumeBottle({
  tone = "#9a68ef",
  view = 0,
  label = "Tu Perfumería DEMO",
  className,
}: PerfumeBottleProps) {
  const rawId = useId().replace(/:/g, "");
  const glassId = `glass-${rawId}`;
  const liquidId = `liquid-${rawId}`;
  const shineId = `shine-${rawId}`;
  const shifted = view % 4;
  const capTone = shifted === 1 ? "#d6be8b" : shifted === 2 ? "#b8a0dd" : "#2b2831";
  const labelText = shifted === 2 ? "ESSENCE / 01" : shifted === 3 ? "EDITION · DEMO" : label;

  return (
    <svg
      className={className}
      viewBox="0 0 260 300"
      role="img"
      aria-label={`Ilustración provisional de perfume, vista ${shifted + 1}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={glassId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f8efff" stopOpacity=".44" />
          <stop offset=".38" stopColor={tone} stopOpacity=".7" />
          <stop offset="1" stopColor="#17131c" stopOpacity=".96" />
        </linearGradient>
        <linearGradient id={liquidId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={tone} stopOpacity=".55" />
          <stop offset="1" stopColor={tone} stopOpacity=".95" />
        </linearGradient>
        <linearGradient id={shineId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity=".62" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <ellipse cx="130" cy="268" rx="80" ry="13" fill="#000" opacity=".48" />
      <ellipse cx="130" cy="260" rx="86" ry="9" fill={tone} opacity=".19" />
      <rect x="112" y="42" width="36" height="28" rx="4" fill={capTone} />
      <rect x="118" y="30" width="24" height="14" rx="3" fill="#d8cbb7" opacity=".88" />
      <rect x="99" y="64" width="62" height="22" rx="6" fill={tone} opacity=".7" />
      <path
        d={shifted === 1
          ? "M81 95 Q81 82 96 82 H164 Q179 82 179 97 L187 219 Q189 239 168 244 H92 Q71 239 73 219 Z"
          : "M84 97 Q84 83 99 83 H161 Q176 83 176 97 L182 218 Q183 239 164 242 H96 Q77 239 78 218 Z"}
        fill={`url(#${glassId})`}
        stroke="#f4e8ff"
        strokeOpacity=".55"
        strokeWidth="2"
      />
      <path
        d="M87 177 Q130 164 173 177 L176 219 Q177 234 160 237 H100 Q83 234 84 219 Z"
        fill={`url(#${liquidId})`}
        opacity=".78"
      />
      <path d="M98 101 Q95 111 96 127 L99 209" fill="none" stroke={`url(#${shineId})`} strokeWidth="7" strokeLinecap="round" opacity=".7" />
      <path d="M165 103 L169 214" fill="none" stroke="#fff" strokeWidth="1" strokeOpacity=".26" />
      <rect x="96" y="137" width="68" height="55" rx={shifted === 3 ? "2" : "8"} fill="#efe3d0" fillOpacity=".88" />
      <text x="130" y="155" textAnchor="middle" fill="#28212b" fontSize="6" fontFamily="Arial, sans-serif" letterSpacing="1.4">
        TU PERFUMERÍA
      </text>
      <text x="130" y="171" textAnchor="middle" fill="#33263d" fontSize="9" fontFamily="Georgia, serif" fontWeight="bold">
        {labelText.slice(0, 18)}
      </text>
      <path d="M117 181 H143" stroke="#9a68ef" strokeWidth="1" opacity=".7" />
      <text x="130" y="189" textAnchor="middle" fill="#6c5a69" fontSize="5" fontFamily="Arial, sans-serif" letterSpacing="1.6">
        MUESTRA · DEMO
      </text>
      {shifted === 2 && <circle cx="130" cy="117" r="12" fill="none" stroke="#d6be8b" strokeWidth="1.5" opacity=".8" />}
      {shifted === 3 && <path d="M68 245 H192 L182 264 H78 Z" fill="#d6be8b" fillOpacity=".18" stroke="#d6be8b" strokeOpacity=".5" />}
    </svg>
  );
}
