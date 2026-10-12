import type { Metadata } from 'next';
import './globals.css';

// Placeholder root layout for the migration foundation only.
//
// The real site loads Google Fonts (Inter Tight / JetBrains Mono / Inter)
// via plain <link> tags rather than next/font, to avoid any rendering or
// metric differences from the current production page. That choice carries
// over here, but the actual font links are not added until the page
// content that needs them is migrated — adding them now, unused, would
// just be dead weight in this foundation PR.
export const metadata: Metadata = {
  title: 'BVX London',
  description: 'Migration foundation placeholder — not the live site.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
