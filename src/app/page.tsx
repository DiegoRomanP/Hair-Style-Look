export default function HomePage() {
  return (
    <main className="shell">
      <section aria-labelledby="hero-title" className="hero">
        <p className="eyebrow">Hair Style Look</p>
        <h1 id="hero-title">Decide tu próximo look junto a tu estilista.</h1>
        <p className="lead">
          Una consulta guiada para visualizar opciones y convertirlas en un servicio
          revisado por profesionales.
        </p>
        <div className="notice" role="status">
          <strong>Próximamente en el salón piloto.</strong>
          <p>La experiencia estará disponible mediante el código QR del salón.</p>
        </div>
        <ol className="flow-preview" aria-label="Proceso de consulta del piloto">
          <li>Consentimiento claro antes de usar una fotografía.</li>
          <li>Opciones del catálogo que el salón puede realizar.</li>
          <li>Revisión final junto a tu estilista.</li>
        </ol>
      </section>
    </main>
  );
}
