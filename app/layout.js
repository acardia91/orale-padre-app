export const metadata = {
  title: 'Orale Padre - Plataforma Interna',
  description: 'Gestion interna de restaurantes Orale Padre',
};
export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
