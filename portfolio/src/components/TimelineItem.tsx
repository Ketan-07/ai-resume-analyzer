import { motion } from 'framer-motion';
import { slideLeft } from '../animations';

interface Props {
  title: string;
  subtitle: string;
  period: string;
  description?: string;
  grade?: string;
  index: number;
}

export default function TimelineItem({ title, subtitle, period, description, grade, index }: Props) {
  return (
    <motion.div
      variants={slideLeft}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      className="relative pl-8 pb-8 border-l-2 border-primary/30 last:pb-0"
    >
      <div className="absolute left-0 top-0 w-4 h-4 -translate-x-[9px] rounded-full bg-primary border-2 border-white dark:border-dark-bg" />
      <div className="glass rounded-xl p-5">
        <span className="text-xs text-primary font-semibold">{period}</span>
        <h3 className="text-lg font-bold text-light-text dark:text-dark-text mt-1">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
        {description && (
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{description}</p>
        )}
        {grade && (
          <span className="inline-block mt-2 px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
            {grade}
          </span>
        )}
      </div>
    </motion.div>
  );
}
