import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaGithub, FaCodeBranch, FaStar, FaEye, FaCode } from 'react-icons/fa';
import { fadeUp, staggerContainer } from '../animations';
import SectionHeading from '../components/SectionHeading';

interface Repo {
  id: number;
  name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string;
  topics: string[];
}

export default function GitHubSection() {
  const [repos, setRepos] = useState<Repo[]>([]);

  useEffect(() => {
    fetch('https://api.github.com/users/Ketan-07/repos?sort=updated&per_page=6')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRepos(data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="github" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          title="GitHub"
          subtitle="My recent repositories and open source work"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {repos.map((repo, index) => (
            <motion.a
              key={repo.id}
              variants={fadeUp}
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-5 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-bold text-light-text dark:text-dark-text group-hover:text-primary transition-colors truncate">
                  {repo.name}
                </h3>
                <FaGithub className="text-gray-400 shrink-0 ml-2" size={18} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 line-clamp-2">
                {repo.description || 'No description'}
              </p>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                {repo.language && (
                  <span className="flex items-center gap-1">
                    <FaCode /> {repo.language}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <FaStar /> {repo.stargazers_count}
                </span>
                <span className="flex items-center gap-1">
                  <FaCodeBranch /> {repo.forks_count}
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <a
            href="https://github.com/Ketan-07"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 dark:bg-gray-700 text-white rounded-full hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
          >
            <FaGithub /> View All Repositories
          </a>
        </motion.div>
      </div>
    </section>
  );
}
