import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'UIT FMS System',
  description: 'Frontend for Facility Management System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
