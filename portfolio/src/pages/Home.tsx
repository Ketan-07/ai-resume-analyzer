import { lazy, Suspense } from 'react';
import Hero from '../sections/Hero';

const About = lazy(() => import('../sections/About'));
const Skills = lazy(() => import('../sections/Skills'));
const Projects = lazy(() => import('../sections/Projects'));
const GitHubSection = lazy(() => import('../sections/GitHubSection'));
const CodingProfiles = lazy(() => import('../sections/CodingProfiles'));
const Certifications = lazy(() => import('../sections/Certifications'));
const Timeline = lazy(() => import('../sections/Timeline'));
const ResumeSection = lazy(() => import('../sections/ResumeSection'));
const Contact = lazy(() => import('../sections/Contact'));

function SectionFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />
      <Suspense fallback={<SectionFallback />}><About /></Suspense>
      <Suspense fallback={<SectionFallback />}><Skills /></Suspense>
      <Suspense fallback={<SectionFallback />}><Projects /></Suspense>
      <Suspense fallback={<SectionFallback />}><GitHubSection /></Suspense>
      <Suspense fallback={<SectionFallback />}><CodingProfiles /></Suspense>
      <Suspense fallback={<SectionFallback />}><Certifications /></Suspense>
      <Suspense fallback={<SectionFallback />}><Timeline /></Suspense>
      <Suspense fallback={<SectionFallback />}><ResumeSection /></Suspense>
      <Suspense fallback={<SectionFallback />}><Contact /></Suspense>
    </>
  );
}
