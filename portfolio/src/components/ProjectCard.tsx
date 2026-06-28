import { motion } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { Project } from '../types';
import { fadeUp } from '../animations';

interface Props {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}

export default function ProjectCard({ project, index, onOpen }: Props) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      custom={index}
      className="group relative glass rounded-xl overflow-hidden hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
      onClick={() => onOpen(project)}
    >
      <div className="p-6">
        {project.featured && (
          <span className="inline-block px-3 py-1 mb-3 text-xs font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-full">
            Featured
          </span>
        )}
        <h3 className="text-xl font-bold text-light-text dark:text-dark-text mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">
          {project.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-4">
          {project.conclusion}
        </p>
        <div className="flex gap-3">
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label={`View ${project.title} on GitHub`}
            >
              <FaGithub size={20} />
            </a>
          )}
          {project.live && (
            <a
              href={project.live}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-gray-400 hover:text-primary transition-colors"
              aria-label={`View ${project.title} live`}
            >
              <FaExternalLinkAlt size={18} />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
