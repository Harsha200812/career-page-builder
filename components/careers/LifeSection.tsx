'use client'

interface ImageItem {
  url: string
  alt: string
}

interface Props {
  companyName: string
  images: ImageItem[]
  title?: string
  description?: string
}

export default function LifeSection({
  companyName,
  images,
  title = 'Life at Company',
  description = 'A glimpse into our workplace culture',
}: Props) {
  return (
    <section
      id="life"
      className="py-20 md:py-32"
      style={{ backgroundColor: 'var(--company-surface-container)' }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-12">
        <div className="text-center mb-12">
          <span
            className="inline-block px-4 py-1.5 mb-4 rounded-full text-xs font-bold tracking-widest uppercase"
            style={{
              backgroundColor: 'var(--company-secondary) + 30',
              color: 'var(--company-secondary)',
            }}
          >
            {title}
          </span>

          <h2
            className="font-headline text-3xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--company-primary)' }}
          >
            A Day in the Life
          </h2>

          <p className="max-w-2xl mx-auto" style={{ color: 'var(--company-on-surface-variant)' }}>
            {description}
          </p>
        </div>

        {/* Photo Grid with organic layout */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {images.slice(0, 6).map((image, index) => (
            <div
              key={index}
              className={`
                relative overflow-hidden rounded-2xl organic-shadow
                ${index === 0 ? 'md:col-span-2 md:row-span-2' : ''}
                ${index === 1 ? 'md:col-span-1' : ''}
                ${index === 2 ? 'md:col-span-1' : ''}
              `}
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />

              {/* Overlay with caption */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <p className="text-white text-sm font-medium">{image.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
