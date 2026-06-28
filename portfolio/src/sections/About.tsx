import { motion } from 'framer-motion';
import { FaGraduationCap, FaBullseye, FaStar, FaRocket } from 'react-icons/fa';
import { personalInfo } from '../data/personalInfo';
import { education } from '../data/education';
import { fadeUp, slideLeft, slideRight, staggerContainer } from '../animations';
import SectionHeading from '../components/SectionHeading';

export default function About() {
  return (
    <section id="about" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="About Me" subtitle="A brief introduction about myself" />

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            variants={slideLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
              <FaBullseye className="text-primary" /> Career Objective
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {personalInfo.objective}
            </p>
          </motion.div>

          <motion.div
            variants={slideRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glass rounded-2xl p-6"
          >
            <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-4 flex items-center gap-2">
              <FaStar className="text-primary" /> Highlight
            </h3>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              {personalInfo.highlight}
            </p>
            <div className="mt-4 p-3 bg-primary/5 rounded-lg">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                <FaRocket className="inline mr-1 text-primary" />
                <strong>Current Focus:</strong> {personalInfo.currentFocus}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text flex items-center gap-2 mb-6">
            <FaGraduationCap className="text-primary" /> Education
          </h3>
          {education.map((edu, index) => (
            <motion.div
              key={index}
              variants={fadeUp}
              className="glass rounded-xl p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap justify-between items-start gap-2">
                <div>
                  <h4 className="font-bold text-light-text dark:text-dark-text">{edu.degree}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{edu.institution}, {edu.location}</p>
                </div>
                <span className="text-sm text-primary font-semibold whitespace-nowrap">{edu.startYear} - {edu.endYear}</span>
              </div>
              <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                {edu.grade}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
