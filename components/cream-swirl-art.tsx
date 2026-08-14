export function CreamSwirlArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <defs>
        <linearGradient id="bgCream" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FBF9F5" />
          <stop offset="100%" stopColor="#F0E3DB" />
        </linearGradient>
        <linearGradient id="swirlBurgundy" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C97A7D" />
          <stop offset="50%" stopColor="#A84A4D" />
          <stop offset="100%" stopColor="#7B282B" />
        </linearGradient>
        <radialGradient id="ambientLight" cx="25%" cy="20%" r="60%">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <filter id="softBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
      </defs>

      {/* Background */}
      <rect width="400" height="400" fill="url(#bgCream)" />
      <rect width="400" height="400" fill="url(#ambientLight)" />

      {/* Cream ribbon swirl */}
      <path
        d="M 268,55 C 368,55 368,172 276,188 C 184,204 184,308 272,324 C 320,332 348,314 336,286"
        fill="none"
        stroke="url(#swirlBurgundy)"
        strokeWidth="62"
        strokeLinecap="round"
      />

      {/* Glossy highlight streak along the ribbon */}
      <path
        d="M 250,68 C 336,72 344,162 266,182 C 196,198 192,296 262,318"
        fill="none"
        stroke="#FFFFFF"
        strokeOpacity="0.28"
        strokeWidth="10"
        strokeLinecap="round"
        filter="url(#softBlur)"
      />

      {/* Scattered droplets */}
      {[
        { cx: 90, cy: 300, r: 7 },
        { cx: 120, cy: 340, r: 4.5 },
        { cx: 70, cy: 250, r: 3.5 },
        { cx: 330, cy: 110, r: 6 },
        { cx: 300, cy: 80, r: 4 },
        { cx: 355, cy: 230, r: 5 },
      ].map((d, i) => (
        <g key={i}>
          <circle cx={d.cx} cy={d.cy} r={d.r} fill="#FFFFFF" fillOpacity="0.85" />
          <circle cx={d.cx - d.r * 0.3} cy={d.cy - d.r * 0.3} r={d.r * 0.35} fill="#FFFFFF" />
        </g>
      ))}
    </svg>
  )
}
