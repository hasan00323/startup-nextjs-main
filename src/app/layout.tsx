import Footer from "@/components/Footer";
import Header from "@/components/Header";
import "../styles/index.css";
import { Providers } from "./providers";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className="bg-[#FCFCFC] font-sans dark:bg-black">
        <Providers>
          <div className="isolate">
            <Header />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
