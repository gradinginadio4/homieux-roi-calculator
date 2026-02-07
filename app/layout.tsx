// app/layout.tsx
import './globals.css';

export const metadata = {
  title: 'Homieux ROI Calculator',
  description: 'ROI calculator for Homieux Media',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
