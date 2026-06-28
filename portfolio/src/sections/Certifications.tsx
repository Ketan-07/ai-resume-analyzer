import { motion } from 'framer-motion';
import { FaCertificate, FaExternalLinkAlt } from 'react-icons/fa';
import { certificates } from '../data/certificates';
import { fadeUp, staggerContainer } from '../animations';
import SectionHeading from '../components/SectionHeading';

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Certifications" subtitle="Professional certifications I've earned" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {certificates.map((cert, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="glass rounded-xl p-6 text-center hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="text-primary mb-4 flex justify-center">
                <FaCertificate size={40} className="group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="font-bold text-light-text dark:text-dark-text mb-2">{cert.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{cert.issuer}</p>
              <span className="text-xs text-primary">{cert.date}</span>
              {cert.link && (
                <a
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-3 text-sm text-primary hover:underline"
                >
                  View <FaExternalLinkAlt size={12} />
                </a>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
