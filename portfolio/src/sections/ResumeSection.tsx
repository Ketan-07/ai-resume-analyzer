import { motion } from 'framer-motion';
import { FaDownload, FaFilePdf } from 'react-icons/fa';
import { fadeUp } from '../animations';
import SectionHeading from '../components/SectionHeading';

export default function ResumeSection() {
  return (
    <section id="resume" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Resume" subtitle="Download my resume to learn more" />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="glass rounded-2xl p-8 text-center"
        >
          <FaFilePdf size={64} className="text-primary mx-auto mb-6" />
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-4">
            Want to know more?
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
            Download my resume for a complete overview of my experience, skills, and qualifications.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/resume.pdf"
              download
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all duration-300"
            >
              <FaDownload /> Download Resume
            </a>
          </div>
          <p className="mt-6 text-xs text-gray-400">
            Note: Add your resume PDF as <code className="text-primary">public/resume.pdf</code>
          </p>
        </motion.div>
      </div>
    </section>
  );
}
