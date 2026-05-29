import AnimatedSection from './AnimatedSection';

export default function PageHero({ title, description, invert = false }) {
  return (
    <AnimatedSection>
      <section
        className="section"
        style={{
          background: invert
            ? 'linear-gradient(135deg, #993500 0%, #7a2b00 100%)'
            : 'linear-gradient(180deg, #ecfeff 0%, #ffffff 100%)',
          color: invert ? '#ffffff' : 'var(--foreground)',
        }}
      >
        <div className="container text-center">
          <h1 className="heading-display" style={{ marginBottom: '20px' }}>{title}</h1>
          <p className="lead" style={{ color: invert ? 'rgba(255,255,255,0.9)' : 'var(--muted-foreground)', maxWidth: '760px', margin: '0 auto' }}>
            {description}
          </p>
        </div>
      </section>
    </AnimatedSection>
  );
}
