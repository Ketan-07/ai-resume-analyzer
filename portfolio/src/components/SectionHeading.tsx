import { motion } from 'framer-motion';
import { fadeUp } from '../animations';

interface Props {
  title: string;
  subtitle?: string;
  centered?: boolean;
}

export default function SectionHeading({ title, subtitle, centered = true }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={`mb-12 ${centered ? 'text-center' : ''}`}
    >
      <h2 className="text-3xl md:text-4xl font-bold text-light-text dark:text-dark-text">
        {title}
      </h2>
      <div className={`mt-2 h-1 w-16 bg-gradient-to-r from-primary to-secondary rounded-full ${centered ? 'mx-auto' : ''}`} />
      {subtitle && (
        <p className="mt-4 text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
