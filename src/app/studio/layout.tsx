export const metadata = {
  title: 'Sanity Studio',
  description: 'Sanity Studio for Montevida',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div style={{ margin: 0 }}>{children}</div>;
}
