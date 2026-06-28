import { education } from '../data/education';
import { experiences } from '../data/experience';
import { fadeUp, staggerContainer } from '../animations';
import SectionHeading from '../components/SectionHeading';
import TimelineItem from '../components/TimelineItem';
import { motion } from 'framer-motion';

export default function Timeline() {
  return (
    <section id="timeline" className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <SectionHeading title="Timeline" subtitle="My journey so far" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-6">Education</h3>
          {education.map((edu, index) => (
            <TimelineItem
              key={index}
              title={edu.degree}
              subtitle={`${edu.institution}, ${edu.location}`}
              period={`${edu.startYear} - ${edu.endYear}`}
              grade={edu.grade}
              index={index}
            />
          ))}

          {experiences.length > 0 && (
            <>
              <h3 className="text-lg font-bold text-light-text dark:text-dark-text mb-6 mt-10">Experience</h3>
              {experiences.map((exp, index) => (
                <TimelineItem
                  key={index}
                  title={exp.role}
                  subtitle={`${exp.company}, ${exp.location}`}
                  period={`${exp.startDate} - ${exp.endDate}`}
                  description={exp.description[0]}
                  index={education.length + index}
                />
              ))}
            </>
          )}
        </motion.div>
      </div>
    </section>
  );
}
