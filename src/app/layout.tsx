import "./css/euclid-circular-a-font.css";
import "./css/style.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning={true}>
      <head />
      <body suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
