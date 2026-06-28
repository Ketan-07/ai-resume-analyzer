import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { FaPaperPlane, FaCheck, FaEnvelope, FaMapMarkerAlt, FaPhone } from 'react-icons/fa';
import { personalInfo } from '../data/personalInfo';
import { fadeUp, slideLeft, slideRight } from '../animations';
import SectionHeading from '../components/SectionHeading';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="Get In Touch"
          subtitle="Have a question or want to work together?"
        />

        <div className="grid md:grid-cols-2 gap-8">
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4">
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <FaEnvelope className="text-primary shrink-0" />
                  <a href={`mailto:${personalInfo.email}`} className="hover:text-primary transition-colors">
                    {personalInfo.email}
                  </a>
                </div>
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <FaPhone className="text-primary shrink-0" />
                  <span>{personalInfo.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
                  <FaMapMarkerAlt className="text-primary shrink-0" />
                  <span>{personalInfo.location}</span>
                </div>
              </div>
            </div>

            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-2">
                Available for work
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {personalInfo.availableForWork
                  ? 'I am currently open to new opportunities and collaborations.'
                  : 'Currently exploring new opportunities.'}
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-light-text dark:text-dark-text"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-light-text dark:text-dark-text"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-light-text dark:text-dark-text mb-2">
                  Message
                </label>
                <textarea
                  id="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-dark-bg border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-light-text dark:text-dark-text resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                disabled={sent}
                className="w-full py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {sent ? (
                  <>
                    <FaCheck /> Sent!
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> Send Message
                  </>
                )}
              </button>
              <p className="text-xs text-center text-gray-400">
                Note: For production, integrate EmailJS or a backend endpoint.
              </p>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
