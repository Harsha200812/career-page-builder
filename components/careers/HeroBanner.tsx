'use client'

interface Props {
  companyName: string
  bannerUrl: string | null
  logoUrl: string | null
  tagline?: string
  primaryColor?: string
}

export default function HeroBanner({
  companyName,
  bannerUrl,
  logoUrl,
  tagline,
  primaryColor = '#2563eb'
}: Props) {
  const style = primaryColor ? { '--company-primary': primaryColor } as React.CSSProperties : undefined

  return (
    <div
      className="relative bg-gradient-to-r from-gray-900 to-gray-700 text-white py-24"
      style={style}
    >
      <div className="absolute inset-0 overflow-hidden">
        {bannerUrl && (
          <img
            src={bannerUrl}
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
        )}
      </div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {logoUrl && (
          <img
            src={logoUrl}
            alt={`${companyName} logo`}
            className="mx-auto h-24 w-auto mb-6"
          />
        )}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
          {companyName}
        </h1>
        {tagline && (
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto">
            {tagline}
          </p>
        )}
        <div className="mt-8">
          <a
            href="#jobs"
            style={{ backgroundColor: primaryColor }}
            className="inline-block text-white px-8 py-3 rounded-lg font-semibold hover:opacity-90 transition"
          >
            View Open Positions
          </a>
        </div>
      </div>
    </div>
  )
}
