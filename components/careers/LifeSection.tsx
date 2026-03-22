'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
  const scrollRef = useRef<HTMLDivElement>(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -400, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 400, behavior: 'smooth' })
    }
  }

  return (
    <section
      id="life"
      className="py-20 md:py-32 overflow-hidden"
      style={{ backgroundColor: 'var(--company-surface-container-low)' }}
    >
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 mb-12 md:mb-16">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-headline text-4xl font-extrabold mb-4" style={{ color: 'var(--company-on-surface)' }}>
              Life at {companyName}
            </h2>
            <p className="max-w-xl text-lg" style={{ color: 'var(--company-on-surface-variant)' }}>
              {description}
            </p>
          </motion.div>
          
          <div className="flex gap-3 hidden md:flex">
            <button 
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--company-surface-container)' }}
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-6 h-6" style={{ color: 'var(--company-on-surface)' }} />
            </button>
            <button 
              onClick={scrollRight}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-105"
              style={{ backgroundColor: 'var(--company-surface-container)' }}
              aria-label="Scroll right"
            >
              <ChevronRight className="w-6 h-6" style={{ color: 'var(--company-on-surface)' }} />
            </button>
          </div>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-6 md:gap-8 px-6 md:px-12 overflow-x-auto pb-12 scrollbar-none snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {images.length > 0 ? images.map((image, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            key={index}
            className={`min-w-[300px] md:min-w-[400px] h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden organic-shadow relative shrink-0 snap-center transition-transform hover:scale-[1.02] duration-500 ${index % 2 !== 0 ? 'md:mt-12' : ''}`}
          >
            <img
              src={image.url}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 inset-x-0 p-6 md:p-8 bg-gradient-to-t from-black/80 via-black/40 to-transparent">
              <h4 className="text-white font-bold text-lg md:text-xl font-headline tracking-wide">{image.alt || 'Company Culture'}</h4>
            </div>
          </motion.div>
        )) : (
          /* Placeholder if no images */
          [1, 2, 3, 4].map((index) => (
            <div
              key={index}
              className={`min-w-[300px] md:min-w-[400px] h-[400px] md:h-[500px] rounded-[2rem] md:rounded-[2.5rem] overflow-hidden organic-shadow relative shrink-0 snap-center transition-transform hover:scale-[1.02] duration-500 ${index % 2 !== 0 ? 'md:mt-12' : ''}`}
            >
              <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                <span className="text-slate-400 font-medium">Add culture photos in dashboard</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}
