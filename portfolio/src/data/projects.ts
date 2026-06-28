import { Project } from '../types';

export const projects: Project[] = [
  {
    id: 'docchat-ai',
    title: 'DocChat AI',
    description: 'AI-powered document chat application using Streamlit and Google Gemini AI with OCR support.',
    longDescription: 'A Streamlit-based application that allows users to upload PDFs and ask questions about their content using Google Gemini AI. Features include OCR for scanned documents, multi-page support, and conversational memory.',
    tags: ['Streamlit', 'Gemini AI', 'Python', 'PyPDF2', 'Tesseract OCR'],
    github: 'https://github.com/Ketan-07/Warp_Drive/tree/main/Project-1_LLM%26Ai_skills',
    featured: true,
    category: 'AI',
    conclusion: 'This project deepened my understanding of LLM integration and document processing pipelines. I learned how to handle PDF extraction, OCR fallbacks, and build conversational AI interfaces.'
  },
  {
    id: 'recruitai-screener',
    title: 'RecruitAI Screener',
    description: 'AI-driven resume screening tool using OpenAI to analyze candidates against job descriptions.',
    longDescription: 'A resume screening application built with Streamlit and OpenAI that analyzes candidate resumes against job descriptions, providing match scores, skill analysis, and hiring recommendations.',
    tags: ['Streamlit', 'OpenAI', 'Python', 'PyPDF2', 'AI'],
    github: 'https://github.com/Ketan-07/Warp_Drive/tree/main/Project-2',
    featured: true,
    category: 'AI',
    conclusion: 'Built an end-to-end recruitment tool that taught me prompt engineering and structured output parsing with LLMs.'
  },
  {
    id: 'heart-disease-prediction',
    title: 'Heart Disease Prediction Using ML',
    description: 'Predictive model using Logistic Regression, Random Forest, and SVM with SHAP explainability.',
    longDescription: 'Developed a machine learning model achieving high accuracy in classifying heart disease presence. Extensive data preprocessing including standardization, outlier removal, feature scaling, and Wrapper methods for feature selection. Integrated SHAP for interpretable insights.',
    tags: ['Python', 'Scikit-learn', 'SHAP', 'Machine Learning', 'Data Science'],
    featured: true,
    category: 'Data Science',
    conclusion: 'This project taught me the full ML pipeline from data preprocessing to model evaluation, and the importance of model explainability with SHAP for real-world clinical usability.'
  },
  {
    id: 'landing-page',
    title: 'Engaging Landing Page',
    description: 'Responsive landing page focused on user engagement and intuitive navigation.',
    longDescription: 'Created a responsive landing page with HTML5, CSS3, and JavaScript, emphasizing user-centric design and interactive features to improve retention and engagement.',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'],
    live: '',
    featured: false,
    category: 'Web Development',
    conclusion: 'Enhanced my frontend development skills and understanding of user experience principles through practical implementation.'
  },
  {
    id: 'programming-repo',
    title: 'Programming Repository',
    description: 'Collection of DSA, OOPs, and core programming concepts with implementations.',
    longDescription: 'A comprehensive repository covering Data Structures and Algorithms, Object-Oriented Programming, DBMS, and other CS fundamentals with practical code examples and explanations.',
    tags: ['Python', 'DSA', 'OOPs', 'Programming'],
    github: 'https://github.com/Ketan-07',
    featured: false,
    category: 'Programming',
    conclusion: 'Strengthened my computer science fundamentals through consistent practice and documentation of core concepts.'
  },
  {
    id: 'data-science-repo',
    title: 'Data Science Learning Repository',
    description: 'End-to-end data science projects covering analysis, visualization, and machine learning.',
    longDescription: 'A collection of data science projects and learning resources covering data analysis with Pandas, visualization with Matplotlib/Seaborn, and machine learning model implementations.',
    tags: ['Python', 'Pandas', 'Matplotlib', 'Seaborn', 'Machine Learning'],
    github: 'https://github.com/Ketan-07',
    featured: false,
    category: 'Data Science',
    conclusion: 'Built a strong foundation in data science workflows and developed practical skills in data analysis and visualization.'
  }
];
