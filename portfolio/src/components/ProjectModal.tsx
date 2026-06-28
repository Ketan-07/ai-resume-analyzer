import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt, FaTimes } from 'react-icons/fa';
import { Project } from '../types';

interface Props {
  project: Project | null;
  onClose: () => void;
}

export default function ProjectModal({ project, onClose }: Props) {
  if (!project) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-dark-card rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              {project.featured && (
                <span className="inline-block px-3 py-1 mb-2 text-xs font-semibold text-white bg-gradient-to-r from-primary to-secondary rounded-full">
                  Featured
                </span>
              )}
              <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">
                {project.title}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <FaTimes size={24} />
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
            {project.longDescription}
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 text-sm bg-primary/10 text-primary rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mb-6 p-4 bg-gray-50 dark:bg-dark-bg rounded-lg">
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {project.conclusion}
            </p>
          </div>

          <div className="flex gap-4">
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <FaGithub /> View Code
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
              >
                <FaExternalLinkAlt /> Live Demo
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
