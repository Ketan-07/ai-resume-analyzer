import { motion } from 'framer-motion';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { codingProfiles } from '../data/codingProfiles';
import { fadeUp, staggerContainer } from '../animations';
import SectionHeading from '../components/SectionHeading';

const iconMap: Record<string, React.ReactNode> = {
  FaGithub: <FaGithub size={32} />,
  FaLinkedin: <FaLinkedin size={32} />,
};

export default function CodingProfiles() {
  return (
    <section id="profiles" className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <SectionHeading title="Coding Profiles" subtitle="Where to find me online" />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto"
        >
          {codingProfiles.map((profile, index) => (
            <motion.a
              key={profile.platform}
              variants={fadeUp}
              href={profile.url}
              target="_blank"
              rel="noopener noreferrer"
              className="glass rounded-xl p-6 flex items-center gap-4 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
            >
              <div className="text-primary group-hover:scale-110 transition-transform">
                {iconMap[profile.icon] || <FaGithub size={32} />}
              </div>
              <div>
                <h3 className="font-bold text-light-text dark:text-dark-text">{profile.platform}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">@{profile.username}</p>
                {profile.rating && (
                  <span className="text-xs text-primary">{profile.rating}</span>
                )}
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
