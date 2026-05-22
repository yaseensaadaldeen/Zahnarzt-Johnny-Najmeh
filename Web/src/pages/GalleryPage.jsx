import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import PageHero from '../components/PageHero';
import { galleryImages } from '../data/siteContent';
import { useLanguage } from '../contexts/LanguageContext';

export default function GalleryPage() {
  const { t } = useLanguage();
  const [selectedIndex, setSelectedIndex] = useState(null);

  return (
    <div>
      <PageHero
        invert
        title={t({ de: 'Unsere Klinik', en: 'Our Clinic' })}
        description={t({
          de: 'Wo Komfort auf moderne Zahnmedizin trifft.',
          en: 'Where comfort meets modern dentistry.',
        })}
      />
      <section className="section">
        <div className="container">
          <div className="grid-3">
            {galleryImages.map((image, index) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setSelectedIndex(index)}
                style={{ padding: 0, border: 0, background: 'transparent', cursor: 'pointer', textAlign: 'left' }}
              >
                <div className="surface-card" style={{ overflow: 'hidden' }}>
                  <img src={image.url} alt={t(image.title)} style={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover' }} />
                  <div style={{ padding: '18px' }}>
                    <strong>{t(image.title)}</strong>
                    <p className="muted" style={{ marginBottom: 0 }}>{t(image.description)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedIndex !== null ? (
          <motion.div className="surface-card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, zIndex: 80, background: 'rgba(0,0,0,0.92)', borderRadius: 0, border: 0, display: 'grid', placeItems: 'center', padding: 24 }}>
            <button type="button" onClick={() => setSelectedIndex(null)} style={{ position: 'absolute', top: 20, right: 20, width: 48, height: 48, borderRadius: 999, border: 0, background: 'rgba(255,255,255,0.12)', color: '#fff' }}><X /></button>
            <button type="button" onClick={() => setSelectedIndex((value) => (value === 0 ? galleryImages.length - 1 : value - 1))} style={{ position: 'absolute', left: 20, top: '50%', width: 48, height: 48, borderRadius: 999, border: 0, background: 'rgba(255,255,255,0.12)', color: '#fff' }}><ChevronLeft /></button>
            <button type="button" onClick={() => setSelectedIndex((value) => (value === galleryImages.length - 1 ? 0 : value + 1))} style={{ position: 'absolute', right: 20, top: '50%', width: 48, height: 48, borderRadius: 999, border: 0, background: 'rgba(255,255,255,0.12)', color: '#fff' }}><ChevronRight /></button>
            <div style={{ maxWidth: 1080, width: '100%' }}>
              <img src={galleryImages[selectedIndex].url} alt={t(galleryImages[selectedIndex].title)} style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }} />
              <div style={{ textAlign: 'center', color: '#fff', marginTop: 20 }}>
                <strong style={{ display: 'block', fontSize: '1.35rem', marginBottom: 8 }}>{t(galleryImages[selectedIndex].title)}</strong>
                <span style={{ color: 'rgba(255,255,255,0.76)' }}>{t(galleryImages[selectedIndex].description)}</span>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
