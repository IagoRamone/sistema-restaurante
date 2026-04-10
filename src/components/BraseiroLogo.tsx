"use client";

export default function BraseiroLogo() {
  return (
    <div className="flex items-center gap-3">
      {/* Globe + Flame icon */}
      <svg width="40" height="54" viewBox="0 0 36 50" fill="none" className="flex-shrink-0">
        {/* Flame */}
        <path
          d="M 18 0
             C 22 4, 27 9, 24 15
             C 27 12, 30 14, 27 18
             C 25 15, 22 16, 18 18
             C 14 16, 11 15, 9 18
             C 6 14, 9 12, 12 15
             C 9 9, 14 4, 18 0
             Z"
          fill="#dc2626"
        />
        {/* Inner flame highlight */}
        <path
          d="M 18 4 C 15 8, 15 13, 17 16 C 18.5 13, 21 16, 18 4 Z"
          fill="#fca5a5"
          opacity="0.45"
        />

        {/* Globe outer circle */}
        <circle cx="18" cy="37" r="12" stroke="#dc2626" strokeWidth="2" />

        {/* Equator */}
        <ellipse cx="18" cy="37" rx="12" ry="5" stroke="#dc2626" strokeWidth="1.5" />

        {/* Upper latitude */}
        <ellipse cx="18" cy="31" rx="8.5" ry="3" stroke="#dc2626" strokeWidth="1" />

        {/* Lower latitude */}
        <ellipse cx="18" cy="43" rx="8.5" ry="3" stroke="#dc2626" strokeWidth="1" />

        {/* Central meridian */}
        <ellipse cx="18" cy="37" rx="5.5" ry="12" stroke="#dc2626" strokeWidth="1.5" />
      </svg>

      {/* Text */}
      <div className="flex flex-col leading-none gap-1">
        {/* — BRASEIRO — */}
        <div className="flex items-center gap-1.5">
          <div className="h-px w-5 bg-red-700" />
          <span className="text-[9px] tracking-[0.35em] text-red-500 font-bold uppercase">
            Braseiro
          </span>
          <div className="h-px w-5 bg-red-700" />
        </div>

        {/* CONTINENTAL */}
        <span
          className="text-[26px] font-black text-white uppercase leading-none tracking-wider"
          style={{ letterSpacing: "0.08em" }}
        >
          Continental
        </span>

        {/* EST. 1972 */}
        <span className="text-[8px] tracking-[0.2em] text-gray-500 font-medium uppercase">
          Est. 1972 &middot; Carnes e Galetos na Brasa
        </span>
      </div>
    </div>
  );
}
