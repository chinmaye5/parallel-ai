import { Space_Grotesk, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-grotesk',
  weight: ['400', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '600', '800'],
});

export const metadata = {
  title: 'ParallelAI — Collective Intelligence Machine',
  description: 'Multi-LLM parallel consensus engine. Direct, uncompromised raw outputs across 5 AI models.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-[#0e0e11] text-[#f4f4f0]">
        {children}
      </body>
    </html>
  );
}