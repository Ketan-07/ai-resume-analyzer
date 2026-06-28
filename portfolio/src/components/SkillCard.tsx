import { motion } from 'framer-motion';
import { Skill } from '../types';
import { scaleIn } from '../animations';

interface Props {
  skill: Skill;
  index: number;
}

export default function SkillCard({ skill, index }: Props) {
  return (
    <motion.div
      variants={scaleIn}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      className="glass rounded-xl p-4 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
    >
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-light-text dark:text-dark-text group-hover:text-primary transition-colors">
          {skill.name}
        </span>
        <span className="text-xs text-primary">{skill.level}%</span>
      </div>
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${skill.level}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
        />
      </div>
    </motion.div>
  );
}
