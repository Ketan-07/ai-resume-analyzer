import { FaGithub, FaLinkedin, FaEnvelope, FaHeart, FaArrowUp } from 'react-icons/fa';
import { socialLinks } from '../data/social';
import { navLinks } from '../data/navLinks';
import { personalInfo } from '../data/personalInfo';

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-dark-card border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">{personalInfo.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {personalInfo.title}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-light-text dark:text-dark-text mb-4">Quick Links</h4>
            <div className="space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.href}
                  onClick={() => scrollTo(link.href)}
                  className="block text-sm text-gray-500 dark:text-gray-400 hover:text-primary transition-colors"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-bold text-light-text dark:text-dark-text mb-4">Connect</h4>
            <div className="flex gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                  aria-label={link.name}
                >
                  {link.name === 'GitHub' && <FaGithub size={20} />}
                  {link.name === 'LinkedIn' && <FaLinkedin size={20} />}
                  {link.name === 'Email' && <FaEnvelope size={20} />}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 flex items-center gap-1">
            &copy; {new Date().getFullYear()} {personalInfo.name}. Made with <FaHeart className="text-red-500" /> using React & Tailwind.
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="p-2 text-gray-400 hover:text-primary transition-colors"
            aria-label="Back to top"
          >
            <FaArrowUp />
          </button>
        </div>
      </div>
    </footer>
  );
}
