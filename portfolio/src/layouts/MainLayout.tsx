import { ReactNode } from 'react';
import Navbar from '../sections/Navbar';
import Footer from '../sections/Footer';
import ScrollToTop from '../components/ScrollToTop';
import UniverseBackground from '../components/UniverseBackground';

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="min-h-screen relative text-dark-text transition-colors duration-300">
      <UniverseBackground />
      <div className="relative z-10">
        <Navbar />
        <main>{children}</main>
        <Footer />
        <ScrollToTop />
      </div>
    </div>
  );
}
