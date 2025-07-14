import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimation, useInView } from 'framer-motion';
import { Linkedin, Mail, GitBranch, GraduationCap, Briefcase, Smartphone, Gamepad2, Mic2, ArrowRight } from 'lucide-react';

// --- Google Scholar Icon ---
const GoogleScholarIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <path fill="currentColor" d="M512 256c0 113.6-84.6 207.4-194.2 222c-12.3 2.3-24.3-6.8-26.6-19.1s6.8-24.3 19.1-26.6C404.1 414.9 480.6 342.6 480.6 256c0-106-86-192-192-192s-192 86-192 192c0 31.8 7.8 62 21.7 88.4c11.9 22.8 3.3 51.2-19.5 63.1s-51.2-3.3-63.1-19.5C2.5 344.3 0 299.8 0 256C0 114.6 114.6 0 256 0S512 114.6 512 256zM153.1 312.3c3-11.2-2.3-22.9-13.5-25.9s-22.9 2.3-25.9 13.5s2.3 22.9 13.5 25.9s22.9-2.2 25.9-13.5zM224 336c0-44.2 35.8-80 80-80s80 35.8 80 80s-35.8 80-80 80s-80-35.8-80-80z"/>
  </svg>
);


// --- Data extracted from CV ---
const portfolioData = {
  name: "Nitant Upasani",
  title: "Researcher, Mathematician, and Innovator",
  summary: "Aspiring to make a positive contribution to society and the environment through scientific openness, inclusivity, and lifelong learning.",
  contact: {
    email: "n.a.upasani@tue.nl",
    linkedin: "https://www.linkedin.com/in/nitant-upasani-1a597614a",
    googleScholar: "https://scholar.google.com/citations?user=9_y3-7sAAAAJ"
  },
  about: {
    philosophy: "My philosophy involves scientific openness, inclusivity, and lifelong learning. As a mathematician, I enjoy modeling and solving both abstract and real-world problems.",
    strengths: "My perceived strengths are perseverance, an affinity for technology, and a strong will and curiosity to learn new things.",
    values: "I value kindness, humor, and ambition in the workplace and do my best to embody these qualities myself."
  },
  skills: ["C/C++", "Python", "MATLAB", "MySQL", "HTML/CSS", "JavaScript", ".NET", "Angular", "React", "Flutter", "Dart", "LaTeX"],
  timeline: [
    { type: 'work', title: 'PhD Researcher', institution: 'Brains4Buildings', period: 'Sept 2021 - Present', description: "Conducting occupant-centered comfort research for optimized HVAC control. Sole PhD in WP3 'Smart User targeted interfaces and feedback'." },
    { type: 'education', title: 'PhD, Built Environment', institution: 'TU Eindhoven, Netherlands', period: '2021-2025' },
    { type: 'work', title: 'Full Stack Developer', institution: 'Q3 Technologies, India', period: 'Aug 2020 - July 2021', description: 'Worked on web development projects with technologies like Angular, React, and .NET.' },
    { type: 'work', title: 'Founding Engineer', institution: 'GPLAN.in', period: 'Jan 2018 - May 2020', description: 'Developed graph-based floorplanning algorithms for a web application for architects.' },
    { type: 'education', title: 'M.Sc. (Hons.) Mathematics & B.E. (Hons.) Civil Engineering', institution: 'BITS Pilani, India', period: '2015-2020' }
  ],
  projects: [
    { title: "Thermal Comfort Modeling", description: "Developed a 72% accurate, building-specific thermal comfort model using interpretable machine learning (SHAP, PDPs) on data from a custom-built app.", tags: ["Machine Learning", "App Development"] },
    { title: "Building Interfaces and Satisfaction", description: "Investigated occupant satisfaction in 11 Dutch offices, finding significant correlations between autonomy, competence, and satisfaction from 366 responses.", tags: ["Statistical Analysis", "User Satisfaction"] },
    { title: "GPLAN - Floorplanning Tool", description: "Co-developed novel graph theory and optimization algorithms to instantly generate multiple floorplans from adjacency and dimensional constraints.", tags: ["Graph Algorithms", "Optimization"] },
    { title: "Rainwater Harvesting Network Optimisation", description: "Segmented satellite imagery using CNN and solved the Steiner Tree problem with a genetic algorithm to minimize pipeline costs.", tags: ["CNN", "Genetic Algorithms"] }
  ],
  apps: [
    { icon: Smartphone, title: "Comfort App", description: "Developed for PhD research to collect real-time occupant comfort feedback via daily push notifications. Published on both major app stores.", tags: ["Mobile App"], link: "https://play.google.com/store/apps/details?id=com.comfort.comfortfeedbackapp", color: "blue" },
    { icon: Gamepad2, title: "GPLAN Game", description: "Co-developed an educational game where users generate valid floorplans by interpreting room adjacency graphs, guided by Prof. Shekhawat.", tags: ["Game Development"], link: "#", color: "green" },
    { icon: Mic2, title: "SHE Visualizer", description: "A voice-to-image web app using OpenAI APIs to transcribe voice, generate AI visuals, and email responses instantly to users at SHE 2024.", tags: ["WordPress", "OpenAI API"], link: "#", color: "purple" }
  ],
  teaching: {
    workshops: ["Graph-Theoretic algorithms for Building Architectural Floorplans (CAADRIA 2020).", "MATLAB for optimization, neural networks, and structural dynamics (BITS Pilani, 2019)."],
    supervision: ["Master Project: Interface design for all occupants of TU/e (2024).", "Tutor and Guest Lecturer: Smart Building Methodology and Technology, TU/e (2022-24)."]
  },
  publications: [
    { text: "Upasani, N., Guerra-Santin, O., & Mohammadi, M. (2024). Developing building-specific, occupant-centric thermal comfort models: A methodological approach.", journal: "Journal of Building Engineering, 95.", link: "https://doi.org/10.1016/j.jobe.2024.109705" },
    { text: "Upasani, N., Shekhawat, K., & Sachdeva, G. (2020). Automated Generation of Dimensioned Rectangular Floorplans.", journal: "Automation in Construction, 113.", link: "https://doi.org/10.1016/j.autcon.2020.103134" },
    { text: "Upasani, N., Guerra-Santin, M., Mohammadi, M., Seraj, M., & Joostens, F. (2024). Understanding thermal comfort using self-reporting and interpretable machine learning.", journal: "Energy Efficiency (revision submitted).", link: "#" },
    { text: "Upasani, N., Guerra-Santin, O., & Mohammadi, M. (2025). A self-determination theory approach to evaluating indoor environment satisfaction through building interfaces.", journal: "In preparation.", link: "#" },
    { text: "Upasani, N., Guerra-Santin, O., & Mohammadi, M. (2025). Towards a standardized digital platform for smart buildings: Ensuring a two-way communication.", journal: "In preparation.", link: "#" },
    { text: "Shekhawat, K., Upasani, N., Bisht, S., & Jain, R. (2021). A tool for computer-generated dimensioned floorplans based on given adjacencies.", journal: "Automation in Construction, 127.", link: "https://doi.org/10.1016/j.autcon.2021.103710" },
    { text: "Bisht, S., Shekhawat, K., Upasani, N., Jain, R., Tiwaskar, R., & Hebbar, C. (2022). Transforming an Adjacency Graph into Dimensioned Floorplan Layouts.", journal: "Computer Graphics Forum, 41(6).", link: "https://doi.org/10.1111/cgf.14555" },
    { text: "Nagpal, G., Chanda, U., & Upasani, N. (2022). Inventory replenishment policies for two successive generations price-sensitive technology products.", journal: "Journal of Industrial and Management Optimization, 18(3).", link: "https://doi.org/10.3934/jimo.2021031" },
    { text: "Rawat, S., Narula, R., Upasani, N., & Muthukumar, G. (2019). A relook on dosage of basalt chopped fibres and its influence on characteristics of concrete.", journal: "Advances in Structural Engineering and Rehabilitation.", link: "https://doi.org/10.1007/978-981-13-7615-3_21" },
    { text: "Upasani, N., Bansal, M., Satapathy, A., Rawat, S., & Muthukumar, G. (2019). Design and Performance Criteria for Fire-Resistant Design of Structures--An Overview.", journal: "Advances in Structural Technologies.", link: "https://doi.org/10.1007/978-981-15-5235-9_22" },
    { text: "Rawat, S., Narula, R., Kaushik, P., et al. (2024). Seismic and Fire Behaviour of FRP Strengthened Reinforced High Strength Concrete Structures-An Overview.", journal: "RC Structures Strengthened with FRP for Earthquake Resistance.", link: "https://doi.org/10.1007/978-981-97-1945-8_13" },
    { text: "Rai, A., Upasani, N., Rawat, S., & Muthukumar, G. (2018). Methodology for numerical simulation of the behaviour of deep beams.", journal: "11th Structural Engineering Convention (SEC-2018).", link: "#" },
    { text: "Upasani, N., & Gupta, R. (2019). Optimization of rainwater harvesting network in rural scenario using gis and ga.", journal: "5th International Conference on Soft Computing and Optimization.", link: "https://www.academia.edu/40409272/Optimization_of_rainwater_harvesting_network_in_rural_scenario_using_gis_and_ga" },
    { text: "Guerra-Santin, O., Lange, V., Upasani, N., Corsius, M., & Jeurens, J. (2025). User-centric interfaces for smart and healthy buildings: Exploring a design methodology.", journal: "Smart Healthy Environments (SHE) World Conference.", link: "#" }
  ]
};

// --- Reusable Animated Components ---

const Section = ({ children, id, className = '' }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });
  const controls = useAnimation();

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  return (
    <motion.section
      id={id}
      ref={ref}
      className={`py-20 md:py-28 ${className}`}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
      }}
    >
      {children}
    </motion.section>
  );
};

const SectionTitle = ({ children }) => (
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-slate-100">
    {children}
  </h2>
);

// --- Page Section Components ---

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["About", "Projects", "Apps", "Teaching", "Publications"];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900/60 backdrop-blur-lg border-b border-slate-700/50">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="#hero" className="text-xl font-bold text-white hover:text-cyan-400 transition-colors">
          {portfolioData.name}
        </a>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-slate-300 hover:text-cyan-400 transition-colors">
              {link}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400">
            <Linkedin size={20} />
          </a>
          <a href={portfolioData.contact.googleScholar} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-cyan-400">
            <GoogleScholarIcon className="w-5 h-5" />
          </a>
          <a href={`mailto:${portfolioData.contact.email}`} className="text-slate-400 hover:text-cyan-400">
            <Mail size={20} />
          </a>
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-white">
          <GitBranch size={24} />
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col space-y-4">
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={() => setIsOpen(false)} className="text-slate-300 hover:text-cyan-400 transition-colors block text-center">
              {link}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center justify-center text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-slate-900 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <div className="container mx-auto px-6 z-10">
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold text-white leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {portfolioData.name}
        </motion.h1>
        <motion.p 
          className="mt-4 text-lg md:text-2xl text-cyan-400 font-semibold"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {portfolioData.title}
        </motion.p>
        <motion.p 
          className="mt-6 max-w-3xl mx-auto text-base md:text-lg text-slate-300"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {portfolioData.summary}
        </motion.p>
      </div>
    </section>
  );
};

const About = () => {
  const [activeTab, setActiveTab] = useState('philosophy');
  const tabs = ['philosophy', 'strengths', 'values'];

  return (
    <Section id="about" className="bg-slate-800/50">
      <div className="container mx-auto px-6">
        <SectionTitle>About Me</SectionTitle>
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-2">
            <div className="mb-4 border-b border-slate-600">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                {tabs.map(tab => (
                  <li key={tab} className="mr-2">
                    <button
                      onClick={() => setActiveTab(tab)}
                      className={`inline-block p-4 border-b-2 rounded-t-lg capitalize transition-colors ${activeTab === tab ? 'text-cyan-400 border-cyan-400' : 'text-slate-400 border-transparent hover:text-slate-300 hover:border-slate-500'}`}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-slate-900/70 min-h-[120px]">
              <p className="text-slate-300">{portfolioData.about[activeTab]}</p>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-slate-100 mb-4">Technical Proficiency</h3>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.map(skill => (
                  <span key={skill} className="bg-slate-700 text-cyan-300 text-xs font-mono px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-xl font-semibold text-slate-100 mb-6">Education & Experience</h3>
            <ol className="relative border-l border-slate-700">
              {portfolioData.timeline.map((item, index) => (
                <motion.li 
                  key={index} 
                  className="mb-10 ml-8"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-slate-800 rounded-full -left-4 ring-4 ring-slate-800/50 text-cyan-400">
                    {item.type === 'work' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-100">{item.title}</h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-slate-400">{item.period} | {item.institution}</time>
                  {item.description && <p className="mb-4 text-base font-normal text-slate-300">{item.description}</p>}
                </motion.li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </Section>
  );
};

const Projects = () => (
  <Section id="projects">
    <div className="container mx-auto px-6">
      <SectionTitle>Research Projects</SectionTitle>
      <div className="grid md:grid-cols-2 gap-8">
        {portfolioData.projects.map((project, index) => (
          <motion.div
            key={index}
            className="bg-slate-800/50 rounded-lg p-6 border border-slate-700 hover:border-cyan-400/50 transition-colors duration-300"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <h3 className="text-xl font-bold text-slate-100 mb-2">{project.title}</h3>
            <p className="text-slate-300 mb-4">{project.description}</p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map(tag => (
                <span key={tag} className="bg-slate-700 text-cyan-300 text-xs font-mono px-3 py-1 rounded-full">{tag}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </Section>
);

const Apps = () => (
  <Section id="apps" className="bg-slate-800/50">
    <div className="container mx-auto px-6">
      <SectionTitle>Applications Developed</SectionTitle>
      <div className="grid md:grid-cols-3 gap-8">
        {portfolioData.apps.map((app, index) => {
          const Icon = app.icon;
          const isClickable = app.link && app.link !== "#";
          return (
            <motion.div
              key={index}
              className="bg-slate-900/70 rounded-lg p-6 border border-slate-700 hover:border-cyan-400/50 transition-colors duration-300 flex flex-col"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center mb-4">
                <div className={`p-3 rounded-full bg-${app.color}-500/10 mr-4 text-${app.color}-400`}>
                  <Icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-100">{app.title}</h3>
              </div>
              <p className="text-slate-300 mb-4 flex-grow">{app.description}</p>
              <div className="flex justify-between items-center mt-4">
                <div className="flex flex-wrap gap-2">
                  {app.tags.map(tag => (
                    <span key={tag} className="bg-slate-700 text-cyan-300 text-xs font-mono px-3 py-1 rounded-full">{tag}</span>
                  ))}
                </div>
                {isClickable ? (
                  <a href={app.link} target="_blank" rel="noopener noreferrer" className={`text-${app.color}-400 hover:text-${app.color}-300 font-semibold text-sm flex items-center`}>
                    Details <ArrowRight size={16} className="ml-1" />
                  </a>
                ) : (
                  <span className={`text-slate-500 font-semibold text-sm flex items-center cursor-default`}>
                    Details <ArrowRight size={16} className="ml-1" />
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  </Section>
);

const Teaching = () => (
  <Section id="teaching">
    <div className="container mx-auto px-6">
      <SectionTitle>Teaching & Mentorship</SectionTitle>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <motion.div 
          className="bg-slate-800/50 p-6 rounded-lg border border-slate-700"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-semibold text-lg text-slate-100 mb-3">Workshops Conducted</h3>
          <ul className="space-y-2 text-slate-300 list-disc list-inside">
            {portfolioData.teaching.workshops.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </motion.div>
        <motion.div 
          className="bg-slate-800/50 p-6 rounded-lg border border-slate-700"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-semibold text-lg text-slate-100 mb-3">Student Supervision</h3>
          <ul className="space-y-2 text-slate-300 list-disc list-inside">
            {portfolioData.teaching.supervision.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </motion.div>
      </div>
    </div>
  </Section>
);

const Publications = () => (
    <Section id="publications" className="bg-slate-800/50">
        <div className="container mx-auto px-6">
            <SectionTitle>Publications</SectionTitle>
            <div className="max-w-4xl mx-auto space-y-4">
                {portfolioData.publications.map((pub, index) => {
                    const isClickable = pub.link && pub.link !== "#";
                    const MotionComponent = isClickable ? motion.a : motion.div;
                    return (
                        <MotionComponent
                            key={index}
                            href={isClickable ? pub.link : undefined}
                            target={isClickable ? "_blank" : undefined}
                            rel={isClickable ? "noopener noreferrer" : undefined}
                            className={`block p-4 border border-slate-700 rounded-lg bg-slate-900/50 ${isClickable ? 'hover:border-cyan-400/50 hover:bg-slate-800/60' : 'cursor-default'} transition-all duration-300`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.8 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                        >
                            <p className="font-medium text-slate-200">{pub.text} <em className="text-slate-400 not-italic">{pub.journal}</em></p>
                        </MotionComponent>
                    );
                })}
            </div>
        </div>
    </Section>
);

const Footer = () => (
  <footer className="bg-slate-900 border-t border-slate-800">
    <div className="container mx-auto px-6 py-8 text-center text-slate-400">
      <p className="text-lg font-semibold text-white">{portfolioData.name}</p>
      <p className="mt-2">Let's connect and build something great together.</p>
      <div className="mt-6 flex justify-center space-x-6">
        <a href={`mailto:${portfolioData.contact.email}`} className="hover:text-cyan-400 transition-colors"><Mail size={22} /></a>
        <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors"><Linkedin size={22} /></a>
        <a href={portfolioData.contact.googleScholar} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
            <GoogleScholarIcon className="w-5 h-5" />
        </a>
      </div>
      <p className="mt-8 text-sm text-slate-500">&copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
    </div>
  </footer>
);


export default function App() {
  return (
    <div className="bg-slate-900 text-slate-300 font-sans">
      <Header />
      <main>
        <Hero />
        <About />
        <Projects />
        <Apps />
        <Teaching />
        <Publications />
      </main>
      <Footer />
    </div>
  );
}