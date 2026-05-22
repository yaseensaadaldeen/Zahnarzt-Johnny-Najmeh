import { useState } from 'react';
import { Card } from '../components/Card';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const galleryImages = [
    {
      url: '/images/treatment_room.jpg',
      thumbnail: '/images/treatment_room.jpg',
      title: 'Modern Treatment Room',
      description: 'Our state-of-the-art treatment rooms equipped with the latest dental technology'
    },
    {
      url: '/images/waiting_area.jpg',
      thumbnail: '/images/waiting_area.jpg',
      title: 'Comfortable Waiting Area',
      description: 'Relax in our welcoming waiting area designed for your comfort'
    },
    {
      url: '/images/dental_equipment.jpg',
      thumbnail: '/images/dental_equipment.jpg',
      title: 'Advanced Dental Chair',
      description: 'Experience comfort with our ergonomic dental chairs'
    },
    {
      url: '/images/reception.jpg',
      thumbnail: '/images/reception.jpg',
      title: 'Reception Area',
      description: 'Our friendly reception team is ready to assist you'
    },
    {
      url: '/images/implants.jpg',
      thumbnail: '/images/implants.jpg',
      title: 'Treatment Equipment',
      description: 'Cutting-edge equipment for precise, comfortable treatments'
    },
    {
      url: '/images/crowns.jpg',
      thumbnail: '/images/crowns.jpg',
      title: 'Dental Technology',
      description: 'Advanced technology for accurate diagnostics and treatments'
    },
    {
      url: '/images/checkup.jpg',
      thumbnail: '/images/checkup.jpg',
      title: 'Digital X-Ray',
      description: 'State-of-the-art digital imaging for precise diagnosis'
    },
    {
      url: '/images/corridor.jpg',
      thumbnail: '/images/corridor.jpg',
      title: 'Clinic Corridor',
      description: 'Clean, modern hallways throughout our facility'
    },
    {
      url: '/images/team.jpg',
      thumbnail: '/images/team.jpg',
      title: 'Our Professional Team',
      description: 'Experienced, caring dental professionals dedicated to your smile'
    },
    {
      url: '/images/veneers.jpg',
      thumbnail: '/images/veneers.jpg',
      title: 'Patient Care',
      description: 'Personalized care and attention for every patient'
    },
    {
      url: '/images/consultation.jpg',
      thumbnail: '/images/consultation.jpg',
      title: 'Consultation Room',
      description: 'Private consultation rooms for discussing your treatment plan'
    },
    {
      url: '/images/fillings.jpg',
      thumbnail: '/images/fillings.jpg',
      title: 'Sterilization Equipment',
      description: 'Highest standards of hygiene and sterilization'
    }
  ];

  const openLightbox = (index: number) => {
    setSelectedImage(index);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  const nextImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage + 1) % galleryImages.length);
    }
  };

  const prevImage = () => {
    if (selectedImage !== null) {
      setSelectedImage((selectedImage - 1 + galleryImages.length) % galleryImages.length);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gradient-to-br from-primary to-cyan-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="font-serif text-5xl font-bold mb-6">Clinic Gallery</h1>
          <p className="text-xl max-w-2xl mx-auto opacity-90">
            Take a virtual tour of our modern facility where comfort meets cutting-edge technology
          </p>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-gradient-to-b from-white to-slate-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, index) => (
              <div
                key={index}
                onClick={() => openLightbox(index)}
                className="group relative aspect-video overflow-hidden rounded-2xl cursor-pointer"
              >
                <img
                  src={image.thumbnail}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-white font-semibold text-lg mb-1">{image.title}</h3>
                    <p className="text-white/80 text-sm">{image.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold mb-6">
              Where Comfort Meets Modern Dentistry
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our clinic is designed with your comfort and well-being in mind. Every detail, from our welcoming
              waiting area to our state-of-the-art treatment rooms, has been carefully considered to provide
              you with the best possible dental experience.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-4xl font-bold text-primary mb-2">15+</div>
                <div className="text-muted-foreground">Years of Excellence</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">5,000+</div>
                <div className="text-muted-foreground">Happy Patients</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-primary mb-2">100%</div>
                <div className="text-muted-foreground">Modern Equipment</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <X size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
            className="absolute left-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
            className="absolute right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight size={24} />
          </button>

          <div className="max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={galleryImages[selectedImage].url}
              alt={galleryImages[selectedImage].title}
              className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
            />
            <div className="text-center mt-6 text-white">
              <h3 className="text-2xl font-semibold mb-2">
                {galleryImages[selectedImage].title}
              </h3>
              <p className="text-white/80">{galleryImages[selectedImage].description}</p>
              <p className="text-white/60 text-sm mt-2">
                {selectedImage + 1} / {galleryImages.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
