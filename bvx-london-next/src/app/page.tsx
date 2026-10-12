// Placeholder homepage for the migration foundation PR only.
//
// This is explicitly NOT a first pass at the real BVX London homepage —
// no header, cart, product grid, or WooCommerce logic has been migrated
// yet. It exists only so the project builds and has a route to render.
// The real homepage is ported in a later, dedicated PR.
export default function Home() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>BVX London — migration foundation</h1>
      <p>
        This is a placeholder page for the Next.js migration foundation.
        The live site at wearbvx.com is still served from the root
        index.html and is unaffected by this project.
      </p>
    </main>
  );
}
