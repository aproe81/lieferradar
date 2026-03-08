export const metadata = {
  title: "LieferRadar",
  description: "LieferRadar mit Verfasser-Feld",
};

export default function RootLayout({ children }) {
  return (
    <html lang="de">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
