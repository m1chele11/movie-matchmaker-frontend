import "./globals.css";




export const metadata = {
  title: "MovieMatcher",
  description: "Find your next favorite movie match!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}

