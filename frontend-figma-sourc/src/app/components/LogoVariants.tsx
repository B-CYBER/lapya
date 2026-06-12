import React from 'react';

// Logo Variant 1: LP Letters Form Blueberry
// The "L" becomes the stem/leaf, the "P" becomes the rounded berry body
export const LogoVariant1 = ({ size = 96, onLight = true }) => {
  const navyColor = '#1E2A5E';
  const marigoldColor = '#E8A92E';
  const whiteColor = '#FFFFFF';

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Blueberry body (P shape integrated) */}
      <circle cx="50" cy="55" r="35" fill={navyColor} />

      {/* P cutout/highlight creating the letter */}
      <path
        d="M 42 35 L 42 75 M 42 35 L 58 35 A 10 10 0 0 1 58 55 L 42 55"
        stroke={onLight ? marigoldColor : whiteColor}
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.3"
      />

      {/* Leaf crown forming "L" shape */}
      <path
        d="M 40 20 L 40 35 L 50 35"
        stroke={marigoldColor}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Small leaves */}
      <ellipse cx="48" cy="23" rx="8" ry="5" fill={marigoldColor} transform="rotate(-25 48 23)" />
      <ellipse cx="55" cy="26" rx="7" ry="4" fill={marigoldColor} transform="rotate(15 55 26)" />

      {/* Highlight dot */}
      <circle cx="65" cy="45" r="6" fill={onLight ? whiteColor : marigoldColor} opacity="0.6" />
    </svg>
  );
};

// Logo Variant 2: Interlocking LP Silhouette
// Letters interlock to form the overall berry shape
export const LogoVariant2 = ({ size = 96, onLight = true }) => {
  const navyColor = '#1E2A5E';
  const marigoldColor = '#E8A92E';
  const whiteColor = '#FFFFFF';

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Main berry shape constructed from L and P letterforms */}
      <path
        d="M 25 30 L 25 75 Q 25 85 35 85 L 50 85 Q 75 85 75 60 Q 75 45 60 45 L 40 45 L 40 30 Q 40 20 50 20 L 60 20"
        fill={navyColor}
        stroke={navyColor}
        strokeWidth="2"
      />

      {/* Inner P loop */}
      <ellipse cx="57" cy="55" rx="12" ry="10" fill={onLight ? marigoldColor : whiteColor} opacity="0.25" />

      {/* Leaf accent at top forming part of L */}
      <path
        d="M 45 15 Q 40 10 35 15 Q 32 18 35 22 Q 38 25 42 23 Q 45 22 45 18 Z"
        fill={marigoldColor}
      />
      <path
        d="M 52 12 Q 48 8 44 11 Q 42 13 44 16 Q 46 19 49 18 Q 52 17 52 14 Z"
        fill={marigoldColor}
      />

      {/* Highlight dot */}
      <circle cx="70" cy="50" r="7" fill={whiteColor} opacity="0.5" />
    </svg>
  );
};

// Logo Variant 3: Clean Blueberry with Wordmark
// Simple, scalable blueberry silhouette - safest option for small sizes
export const LogoVariant3 = ({ size = 96, onLight = true, showWordmark = false }) => {
  const navyColor = '#1E2A5E';
  const marigoldColor = '#E8A92E';
  const whiteColor = '#FFFFFF';

  return (
    <svg
      width={showWordmark ? size * 2.5 : size}
      height={size}
      viewBox={showWordmark ? "0 0 250 100" : "0 0 100 100"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Classic blueberry shape */}
      <circle cx="50" cy="52" r="36" fill={navyColor} />

      {/* Characteristic blueberry crown indent at top */}
      <path
        d="M 50 16 Q 45 22 42 16 Q 40 12 42 8 Q 45 5 48 8 Q 50 10 50 16 Z"
        fill={navyColor}
        stroke={navyColor}
        strokeWidth="1"
      />

      {/* Star-shaped crown/calyx */}
      <path
        d="M 50 20 L 52 28 L 60 28 L 54 33 L 56 41 L 50 36 L 44 41 L 46 33 L 40 28 L 48 28 Z"
        fill={marigoldColor}
      />

      {/* Subtle LP monogram in negative space */}
      <text
        x="42"
        y="62"
        fontFamily="var(--font-heading), sans-serif"
        fontSize="28"
        fontWeight="700"
        fill={onLight ? marigoldColor : whiteColor}
        opacity="0.2"
      >
        LP
      </text>

      {/* Highlight shine */}
      <ellipse cx="62" cy="42" rx="8" ry="10" fill={whiteColor} opacity="0.4" transform="rotate(-30 62 42)" />
      <circle cx="66" cy="38" r="4" fill={whiteColor} opacity="0.6" />

      {/* Wordmark (if enabled) */}
      {showWordmark && (
        <text
          x="110"
          y="62"
          fontFamily="var(--font-heading), sans-serif"
          fontSize="36"
          fontWeight="700"
          fill={navyColor}
        >
          Lapya
        </text>
      )}
    </svg>
  );
};

// Combined Logo Display Component for Demo
export const LogoShowcase = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-8">
      <div style={{ backgroundColor: '#FBFAF7' }} className="p-12 rounded-3xl">
        <h1 className="text-center mb-12" style={{
          fontFamily: 'Fraunces, serif',
          fontSize: '2.5rem',
          color: '#1E2A5E',
          fontWeight: 600
        }}>
          Lapya Logo Variants — Blueberry Edition
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Variant 1 */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <LogoVariant1 size={120} onLight={true} />
            </div>
            <div className="bg-[#1E2A5E] p-8 rounded-2xl">
              <LogoVariant1 size={120} onLight={false} />
            </div>
            <div className="text-center">
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#1E2A5E' }}>
                Variant 1
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#5E6680' }}>
                LP Letters Form Berry
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem' }}>
                L = leaf stem, P = berry body
              </p>
            </div>
          </div>

          {/* Variant 2 */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <LogoVariant2 size={120} onLight={true} />
            </div>
            <div className="bg-[#1E2A5E] p-8 rounded-2xl">
              <LogoVariant2 size={120} onLight={false} />
            </div>
            <div className="text-center">
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#1E2A5E' }}>
                Variant 2
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#5E6680' }}>
                Interlocking LP
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem' }}>
                Letters form berry silhouette
              </p>
            </div>
          </div>

          {/* Variant 3 */}
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <LogoVariant3 size={120} onLight={true} />
            </div>
            <div className="bg-[#1E2A5E] p-8 rounded-2xl">
              <LogoVariant3 size={120} onLight={false} />
            </div>
            <div className="text-center">
              <h3 style={{ fontFamily: 'Sora, sans-serif', fontWeight: 700, color: '#1E2A5E' }}>
                Variant 3
              </h3>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.875rem', color: '#5E6680' }}>
                Classic Berry + Wordmark
              </p>
              <p style={{ fontFamily: 'Inter, sans-serif', fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem' }}>
                Safest for small sizes
              </p>
            </div>
          </div>
        </div>

        {/* Size Test Row */}
        <div className="mt-16 pt-12 border-t-2" style={{ borderColor: '#E7E4DD' }}>
          <h3 className="text-center mb-8" style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1.5rem',
            color: '#1E2A5E',
            fontWeight: 700
          }}>
            Scale Test (Favicon → App Icon)
          </h3>
          <div className="flex justify-center items-end gap-8">
            <div className="text-center">
              <LogoVariant3 size={32} onLight={true} />
              <p style={{ fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem' }}>32px</p>
            </div>
            <div className="text-center">
              <LogoVariant3 size={64} onLight={true} />
              <p style={{ fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem' }}>64px</p>
            </div>
            <div className="text-center">
              <LogoVariant3 size={128} onLight={true} />
              <p style={{ fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem' }}>128px</p>
            </div>
            <div className="text-center">
              <LogoVariant3 size={96} onLight={true} showWordmark={true} />
              <p style={{ fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem' }}>With wordmark</p>
            </div>
          </div>
        </div>

        {/* Color Palette Reference */}
        <div className="mt-16 pt-12 border-t-2" style={{ borderColor: '#E7E4DD' }}>
          <h3 className="text-center mb-8" style={{
            fontFamily: 'Sora, sans-serif',
            fontSize: '1.5rem',
            color: '#1E2A5E',
            fontWeight: 700
          }}>
            Blueberry Color Palette
          </h3>
          <div className="grid grid-cols-5 gap-4 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto shadow-md" style={{ backgroundColor: '#1E2A5E' }}></div>
              <p style={{ fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem', fontFamily: 'Inter' }}>
                Blueberry<br/>Navy
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto shadow-md" style={{ backgroundColor: '#3D6BE5' }}></div>
              <p style={{ fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem', fontFamily: 'Inter' }}>
                Blueberry<br/>Cobalt
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto shadow-md" style={{ backgroundColor: '#A8BCF0' }}></div>
              <p style={{ fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem', fontFamily: 'Inter' }}>
                Periwinkle
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto shadow-md" style={{ backgroundColor: '#E8A92E' }}></div>
              <p style={{ fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem', fontFamily: 'Inter' }}>
                Marigold
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 rounded-2xl mx-auto shadow-md" style={{ backgroundColor: '#F4D27A' }}></div>
              <p style={{ fontSize: '0.75rem', color: '#5E6680', marginTop: '0.5rem', fontFamily: 'Inter' }}>
                Butter<br/>Yellow
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
