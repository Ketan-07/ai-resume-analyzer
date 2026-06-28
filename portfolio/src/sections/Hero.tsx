import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin, FaEnvelope, FaArrowDown } from 'react-icons/fa';
import { useTypewriter } from '../hooks/useTypewriter';
import { personalInfo } from '../data/personalInfo';
import { socialLinks } from '../data/social';
import { fadeUp } from '../animations';

export default function Hero() {
  const typedText = useTypewriter(
    ['AI & Data Science Enthusiast', 'Python Developer', 'ML Engineer', 'Problem Solver'],
    80, 40, 2000
  );

  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-48 h-48 bg-accent/10 rounded-full blur-3xl animate-pulse-glow" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          <span className="inline-block px-4 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-4">
            {personalInfo.location}
          </span>
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-4xl md:text-6xl lg:text-7xl font-bold text-light-text dark:text-dark-text mb-6"
        >
          Hi, I'm{' '}
          <span className="gradient-text">{personalInfo.name}</span>
        </motion.h1>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="h-12 mb-8"
        >
          <span className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-mono">
            {typedText}
            <span className="animate-pulse">|</span>
          </span>
        </motion.div>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-8"
        >
          {personalInfo.bio}
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          <button
            onClick={() => scrollTo('#projects')}
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
          >
            View My Work
          </button>
          <button
            onClick={() => scrollTo('#contact')}
            className="px-8 py-3 border border-gray-300 dark:border-gray-600 text-light-text dark:text-dark-text rounded-full font-semibold hover:border-primary hover:text-primary transition-all duration-300"
          >
            Contact Me
          </button>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="flex justify-center gap-6"
        >
          {socialLinks.map((link) => (
            <a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-primary transition-colors transform hover:scale-110"
              aria-label={link.name}
            >
              {link.name === 'GitHub' && <FaGithub size={24} />}
              {link.name === 'LinkedIn' && <FaLinkedin size={24} />}
              {link.name === 'Email' && <FaEnvelope size={24} />}
            </a>
          ))}
        </motion.div>
      </div>

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        onClick={() => scrollTo('#about')}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce"
        aria-label="Scroll down"
      >
        <FaArrowDown size={20} />
      </motion.button>
    </section>
  );
}
