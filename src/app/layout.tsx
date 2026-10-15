import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Avenova Workspace — Engineering Preview",
  description: "A focused lead and follow-up workspace concept for service businesses.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
