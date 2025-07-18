import React, { useState, useEffect, useRef, createContext, useContext } from 'react';
import { motion, useAnimation, useInView, AnimatePresence, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Linkedin, Mail, GitBranch, GraduationCap, Briefcase, Smartphone, Gamepad2, Mic2, ArrowRight, Sun, Moon, Shield, Wrench, ChevronLeft, ChevronRight } from 'lucide-react';

// --- Theme Context ---
const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'dark' ? 'light' : 'dark');
    root.classList.add(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => useContext(ThemeContext);

// --- Google Scholar Icon ---
const GoogleScholarIcon = (props) => (
  <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" {...props}>
    <title>Google Scholar</title>
    <path d="M5.242 13.769L0 9.5 12 0l12 9.5-5.242 4.269C17.548 11.249 14.978 9.5 12 9.5c-2.977 0-5.548 1.748-6.758 4.269zM12 10a7 7 0 1 0 0 14 7 7 0 0 0 0-14z"/>
  </svg>
);

// --- Animated & Interactive Components ---

const AnimatedBackground = () => {
    const canvasRef = useRef(null);
    const { theme } = useTheme();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const nodes = [];
        const nodeCount = Math.floor((canvas.width * canvas.height) / 20000);
        
        for (let i = 0; i < nodeCount; i++) {
            nodes.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 1,
            });
        }

        const draw = () => {
            if(!ctx) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const nodeColor = theme === 'dark' ? 'rgba(203, 213, 225, 0.7)' : 'rgba(100, 116, 139, 0.7)';
            const lineColor = theme === 'dark' ? 'rgba(100, 116, 139, 0.2)' : 'rgba(156, 163, 175, 0.2)';

            nodes.forEach(node => {
                node.x += node.vx;
                node.y += node.vy;

                if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
                if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

                ctx.beginPath();
                ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
                ctx.fillStyle = nodeColor;
                ctx.fill();
            });

            for (let i = 0; i < nodes.length; i++) {
                for (let j = i + 1; j < nodes.length; j++) {
                    const dx = nodes[i].x - nodes[j].x;
                    const dy = nodes[i].y - nodes[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.moveTo(nodes[i].x, nodes[i].y);
                        ctx.lineTo(nodes[j].x, nodes[j].y);
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 1 - distance / 120;
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
        };

    }, [theme]);

    return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />;
};

const CursorSpotlight = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();

  useEffect(() => {
    const updateMousePosition = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);
  
  const spotlightColor = theme === 'dark' ? 'rgba(29, 78, 216, 0.2)' : 'rgba(191, 219, 254, 0.4)';

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition duration-300"
      style={{
        background: `radial-gradient(400px at ${mousePosition.x}px ${mousePosition.y}px, ${spotlightColor}, transparent 80%)`,
      }}
    />
  );
};

const TiltCard = ({ children, className }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const xSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const ySpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(ySpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(xSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={className}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }}>
        {children}
      </div>
    </motion.div>
  );
};

const ScrambleText = ({ children }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false, amount: 0.5 });
    const [text, setText] = useState(children);
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    useEffect(() => {
        if (isInView) {
            let interval = null;
            let iteration = 0;
            
            interval = setInterval(() => {
                setText(
                    children
                        .split("")
                        .map((letter, index) => {
                            if (index < iteration) {
                                return children[index];
                            }
                            return letters[Math.floor(Math.random() * 26)];
                        })
                        .join("")
                );
                
                if (iteration >= children.length) {
                    clearInterval(interval);
                }
                
                iteration += 1;
            }, 60);

            return () => clearInterval(interval);
        }
    }, [isInView, children]);

    return <span ref={ref}>{text}</span>;
};


// --- Data extracted from CV ---
const portfolioData = {
  name: "Nitant Upasani",
  title: "Researcher, Mathematician, and Innovator",
  summary: "Aspiring to make a positive contribution to society and the environment through scientific openness, inclusivity, and lifelong learning.",
  pictureUrl: "/picture.png", // Using a local image from the /public folder
  contact: {
    email: "n.a.upasani@tue.nl",
    linkedin: "https://www.linkedin.com/in/nitant-upasani-bb1a76148/",
    googleScholar: "https://scholar.google.com/citations?user=2uA0rkUAAAAJ&hl=en"
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
    { title: "Thermal Comfort Modeling", description: "Developed a 72% accurate, building-specific thermal comfort model using interpretable machine learning (SHAP, PDPs) on data from a custom-built app.", tags: ["Machine Learning", "App Development"], filterTag: "Thermal Comfort" },
    { title: "Building Interfaces and Satisfaction", description: "Investigated occupant satisfaction in 11 Dutch offices, finding significant correlations between autonomy, competence, and satisfaction from 366 responses.", tags: ["Statistical Analysis", "User Satisfaction"], filterTag: "User Satisfaction" },
    { title: "GPLAN - Floorplanning Tool", description: "Co-developed novel graph theory and optimization algorithms to instantly generate multiple floorplans from adjacency and dimensional constraints.", tags: ["Graph Theory", "Optimization"], filterTag: "Graph Theory" },
    { title: "Rainwater Harvesting Network Optimisation", description: "Segmented satellite imagery using CNN and solved the Steiner Tree problem with a genetic algorithm to minimize pipeline costs.", tags: ["CNN", "Genetic Algorithms"], filterTag: "Optimization" }
  ],
  apps: [
    { icon: Smartphone, title: "Comfort App", description: "Developed for PhD research to collect real-time occupant comfort feedback via daily push notifications. Published on both major app stores.", tags: ["Mobile App"], link: "https://apps.apple.com/nl/app/b4b-building-28-delft/id6444261538?l=en-GB", color: "blue" },
    { icon: Gamepad2, title: "GPLAN Game", description: "Co-developed an educational game where users generate valid floorplans by interpreting room adjacency graphs, guided by Prof. Shekhawat.", tags: ["Game Development"], link: "https://apps.apple.com/nl/app/gplan-game/id6727013926?l=en-GB", color: "green" },
    { icon: Mic2, title: "SHE Visualizer", description: "A voice-to-image web app using OpenAI APIs to transcribe voice, generate AI visuals, and email responses instantly to users at SHE 2024.", tags: ["WordPress", "OpenAI API"], link: "https://www.she2024.com/she-designer-page/", color: "purple" },
    { icon: Shield, title: "P3Venti", description: "A decision-support tool for long-term care centers to manage pandemic risks like ventilation, balancing infection risk with resident health.", tags: ["Web App", "Decision Support"], link: "https://p3venti.netlify.app/", color: "red", status: "In Progress" }
  ],
  teaching: {
    workshops: ["Graph-Theoretic algorithms for Building Architectural Floorplans (CAADRIA 2020).", "MATLAB for optimization, neural networks, and structural dynamics (BITS Pilani, 2019)."],
    supervision: ["Master Project: Interface design for all occupants of TU/e (2024).", "Tutor and Guest Lecturer: Smart Building Methodology and Technology, TU/e (2022-24)."]
  },
  publications: [
    { text: "Upasani, N., Guerra-Santin, O., & Mohammadi, M. (2024). Developing building-specific, occupant-centric thermal comfort models: A methodological approach.", journal: "Journal of Building Engineering, 95.", link: "https://www.sciencedirect.com/science/article/pii/S2352710224018497", tags: ['Thermal Comfort', 'Machine Learning'] },
    { text: "Upasani, N., Shekhawat, K., & Sachdeva, G. (2020). Automated Generation of Dimensioned Rectangular Floorplans.", journal: "Automation in Construction, 113.", link: "https://doi.org/10.1016/j.autcon.2020.103149", tags: ['Automation', 'Graph Theory', 'Architecture'] },
    { text: "Upasani, N., Guerra-Santin, M., Mohammadi, M., Seraj, M., & Joostens, F. (2024). Understanding thermal comfort using self-reporting and interpretable machine learning.", journal: "Energy Efficiency (revision submitted).", link: "#", tags: ['Thermal Comfort', 'Machine Learning'] },
    { text: "Upasani, N., Guerra-Santin, O., & Mohammadi, M. (2025). A self-determination theory approach to evaluating indoor environment satisfaction through building interfaces.", journal: "In preparation.", link: "#", tags: ['User Satisfaction'] },
    { text: "Upasani, N., Guerra-Santin, O., & Mohammadi, M. (2025). Towards a standardized digital platform for smart buildings: Ensuring a two-way communication.", journal: "In preparation.", link: "#", tags: ['Smart Buildings'] },
    { text: "Shekhawat, K., Upasani, N., Bisht, S., & Jain, R. (2021). A tool for computer-generated dimensioned floorplans based on given adjacencies.", journal: "Automation in Construction, 127.", link: "https://doi.org/10.1016/j.autcon.2021.103718", tags: ['Automation', 'Graph Theory', 'Architecture'] },
    { text: "Bisht, S., Shekhawat, K., Upasani, N., Jain, R., Tiwaskar, R., & Hebbar, C. (2022). Transforming an Adjacency Graph into Dimensioned Floorplan Layouts.", journal: "Computer Graphics Forum, 41(6).", link: "https://doi.org/10.1111/cgf.14451", tags: ['Automation','Graph Theory', 'Architecture'] },
    { text: "Nagpal, G., Chanda, U., & Upasani, N. (2022). Inventory replenishment policies for two successive generations price-sensitive technology products.", journal: "Journal of Industrial and Management Optimization, 18(3).", link: "https://doi.org/10.3934/jimo.2021036", tags: ['Optimization'] },
    { text: "Rawat, S., Narula, R., Upasani, N., & Muthukumar, G. (2019). A relook on dosage of basalt chopped fibres and its influence on characteristics of concrete.", journal: "Advances in Structural Engineering and Rehabilitation.", link: "https://doi.org/10.1007/978-981-13-7615-3_22", tags: ['Civil Engineering'] },
    { text: "Upasani, N., Bansal, M., Satapathy, A., Rawat, S., & Muthukumar, G. (2019). Design and Performance Criteria for Fire-Resistant Design of Structures--An Overview.", journal: "Advances in Structural Technologies.", link: "https://doi.org/10.1007/978-981-15-5235-9_21", tags: ['Civil Engineering', 'Structural Engineering'] },
    { text: "Rawat, S., Narula, R., Kaushik, P., et al. (2024). Seismic and Fire Behaviour of FRP Strengthened Reinforced High Strength Concrete Structures-An Overview.", journal: "RC Structures Strengthened with FRP for Earthquake Resistance.", link: "https://doi.org/10.1007/978-981-97-0102-5_11", tags: ['Civil Engineering', 'Structural Engineering'] },
    { text: "Rai, A., Upasani, N., Rawat, S., & Muthukumar, G. (2018). Methodology for numerical simulation of the behaviour of deep beams.", journal: "11th Structural Engineering Convention (SEC-2018).", link: "#", tags: ['Civil Engineering', 'Structural Engineering'] },
    { text: "Upasani, N., & Gupta, R. (2019). Optimization of rainwater harvesting network in rural scenario using gis and ga.", journal: "5th International Conference on Soft Computing and Optimization.", link: "#", tags: ['Optimization', 'GIS', 'Genetic Algorithms','Civil Engineering'] },
    { text: "Guerra-Santin, O., Lange, V., Upasani, N., Corsius, M., & Jeurens, J. (2025). User-centric interfaces for smart and healthy buildings: Exploring a design methodology.", journal: "Smart Healthy Environments (SHE) World Conference.", link: "#", tags: ['Smart Buildings', 'User Satisfaction'] }
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
  <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16 text-slate-900 dark:text-slate-100">
    <ScrambleText>{children}</ScrambleText>
  </h2>
);

// --- Page Section Components ---

const ThemeToggleButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div
      onClick={toggleTheme}
      className="w-16 h-8 flex items-center bg-gray-200 dark:bg-slate-700 rounded-full p-1 cursor-pointer"
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className="w-6 h-6 bg-white rounded-full shadow-md flex items-center justify-center"
        style={{
          marginLeft: theme === 'dark' ? 'auto' : '0',
        }}
      >
        {theme === 'dark' ? 
          <Moon size={14} className="text-slate-500" /> : 
          <Sun size={14} className="text-amber-500" />}
      </motion.div>
    </div>
  );
};

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navLinks = ["About", "Projects", "Apps", "Teaching", "Publications"];

  const handleNavClick = (e, targetId) => {
    e.preventDefault();
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-slate-800">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center">
        <a href="/" className="text-xl font-bold text-slate-900 dark:text-white hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
          {portfolioData.name}
        </a>
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={(e) => handleNavClick(e, link.toLowerCase())} className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
              {link}
            </a>
          ))}
        </nav>
        <div className="hidden md:flex items-center space-x-4">
          <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400">
            <Linkedin size={20} />
          </a>
          <a href={portfolioData.contact.googleScholar} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400">
            <GoogleScholarIcon className="w-5 h-5" />
          </a>
          <a href={`mailto:${portfolioData.contact.email}`} className="text-slate-500 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-cyan-400">
            <Mail size={20} />
          </a>
          <ThemeToggleButton />
        </div>
        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-slate-900 dark:text-white">
          <GitBranch size={24} />
        </button>
      </div>
      {isOpen && (
        <div className="md:hidden px-6 pb-4 flex flex-col space-y-4 bg-white/95 dark:bg-slate-900/95">
          {navLinks.map(link => (
            <a key={link} href={`#${link.toLowerCase()}`} onClick={(e) => handleNavClick(e, link.toLowerCase())} className="text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors block text-center">
              {link}
            </a>
          ))}
           <div className="pt-4 mt-4 border-t border-gray-200 dark:border-slate-800 flex justify-center">
            <ThemeToggleButton />
          </div>
        </div>
      )}
    </header>
  );
};

const Hero = () => {
  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gray-50 dark:bg-slate-900">
      <AnimatedBackground />
      <div className="container mx-auto px-6 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left">
            <motion.h1 
              className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {portfolioData.name}
            </motion.h1>
            <motion.p 
              className="mt-4 text-lg md:text-2xl text-cyan-600 dark:text-cyan-400 font-semibold"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {portfolioData.title}
            </motion.p>
            <motion.p 
              className="mt-6 max-w-xl text-base md:text-lg text-slate-600 dark:text-slate-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {portfolioData.summary}
            </motion.p>
          </div>
          <motion.div 
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.8, type: 'spring' }}
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-purple-400 rounded-full blur-xl opacity-50 dark:from-cyan-500 dark:to-purple-500 dark:opacity-50 animate-pulse"></div>
              <img 
                src={portfolioData.pictureUrl} 
                alt="Nitant Upasani" 
                className="relative w-full h-full object-cover rounded-full border-4 border-white dark:border-slate-700 shadow-2xl"
                onError={(e) => { e.target.onerror = null; e.target.src='https://placehold.co/400/1E293B/FFFFFF?text=Image+Not+Found'; }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const About = () => {
  const [activeTab, setActiveTab] = useState('philosophy');
  const tabs = ['philosophy', 'strengths', 'values'];

  return (
    <Section id="about" className="bg-white dark:bg-slate-800">
      <div className="container mx-auto px-6">
        <SectionTitle>About Me</SectionTitle>
        <div className="grid md:grid-cols-5 gap-12 items-start">
          <div className="md:col-span-2">
            <div className="mb-4 border-b border-gray-200 dark:border-slate-700">
              <ul className="flex flex-wrap -mb-px text-sm font-medium text-center">
                {tabs.map(tab => (
                  <li key={tab} className="mr-2">
                    <button
                      onClick={() => setActiveTab(tab)}
                      className={`inline-block p-4 border-b-2 rounded-t-lg capitalize transition-colors ${activeTab === tab ? 'text-cyan-600 border-cyan-600 dark:text-cyan-400 dark:border-cyan-400' : 'text-slate-500 border-transparent hover:text-slate-700 hover:border-gray-300 dark:text-slate-400 dark:hover:text-slate-300 dark:hover:border-slate-600'}`}
                    >
                      {tab}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-slate-900 min-h-[120px]">
              <p className="text-slate-600 dark:text-slate-300">{portfolioData.about[activeTab]}</p>
            </div>
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">Technical Proficiency</h3>
              <div className="flex flex-wrap gap-2">
                {portfolioData.skills.map(skill => (
                  <span key={skill} className="bg-cyan-100/60 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 text-xs font-mono px-3 py-1 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="md:col-span-3">
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">Education & Experience</h3>
            <motion.ol 
              className="relative border-l border-gray-200 dark:border-slate-700"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {portfolioData.timeline.map((item, index) => (
                <motion.li 
                  key={index} 
                  className="mb-10 ml-8"
                  variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
                >
                  <span className="absolute flex items-center justify-center w-8 h-8 bg-gray-100 dark:bg-slate-800 rounded-full -left-4 ring-4 ring-white dark:ring-slate-800 text-cyan-600 dark:text-cyan-400">
                    {item.type === 'work' ? <Briefcase size={16} /> : <GraduationCap size={16} />}
                  </span>
                  <h3 className="flex items-center mb-1 text-lg font-semibold text-slate-900 dark:text-white">{item.title}</h3>
                  <time className="block mb-2 text-sm font-normal leading-none text-slate-400 dark:text-slate-500">{item.period} | {item.institution}</time>
                  {item.description && <p className="mb-4 text-base font-normal text-slate-600 dark:text-slate-300">{item.description}</p>}
                </motion.li>
              ))}
            </motion.ol>
          </div>
        </div>
      </div>
    </Section>
  );
};

const Projects = ({ setActiveFilter }) => {
  const handleProjectClick = (tag) => {
    setActiveFilter(tag);
    const publicationsSection = document.getElementById('publications');
    if (publicationsSection) {
      publicationsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Section id="projects" className="bg-gray-50 dark:bg-slate-900">
      <div className="container mx-auto px-6">
        <SectionTitle>Research Projects</SectionTitle>
        <div className="grid md:grid-cols-2 gap-8">
          {portfolioData.projects.map((project, index) => (
            <div key={index} onClick={() => handleProjectClick(project.filterTag)} className="cursor-pointer">
              <TiltCard>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-gray-200 dark:border-slate-700 h-full">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{project.title}</h3>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map(tag => (
                      <span key={tag} className="bg-cyan-100/60 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 text-xs font-mono px-3 py-1 rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

const Apps = () => {
  const scrollRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 5);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      handleScroll(); // Initial check
      currentRef.addEventListener('scroll', handleScroll);
      window.addEventListener('resize', handleScroll);
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleScroll);
      }
    };
  }, []);

  return (
    <Section id="apps" className="bg-white dark:bg-slate-800">
      <div className="container mx-auto px-6">
        <SectionTitle>Applications Developed</SectionTitle>
        <div className="relative group">
        <div
  className="absolute top-0 h-full w-24 pointer-events-none z-10 transition-opacity duration-300"
  style={{
    left: '-24px', // move entire overlay to the left
    opacity: showLeftArrow ? 1 : 0,
    background: 'linear-gradient(to right, rgba(30,41,59,1) 0%, rgba(30,41,59,1) 30%, rgba(30,41,59,0) 100%)' // dark mode gradient
  }}
/>
<div
  className="absolute top-0 h-full w-24 pointer-events-none z-10 transition-opacity duration-300"
  style={{
    right: '-24px', // move to the right
    opacity: showRightArrow ? 1 : 0,
    background: 'linear-gradient(to left, rgba(30,41,59,1) 0%, rgba(30,41,59,1) 30%, rgba(30,41,59,0) 100%)'
  }}
/>

          <AnimatePresence>
            {showLeftArrow && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(229, 231, 235, 0.9)', color: 'rgb(15, 23, 42)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('left')}
                className="absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-full p-2 shadow-lg"
              >
                <ChevronLeft size={36} className="text-slate-700 dark:text-slate-200" />
              </motion.button>
            )}
          </AnimatePresence>
          <div ref={scrollRef} className="flex space-x-8 pb-4 -mx-6 px-6 overflow-x-auto" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {portfolioData.apps.map((app, index) => {
              const Icon = app.icon;
              const isClickable = app.link && app.link !== "#";
              
              const cardContent = (
                <div className="relative bg-gray-50 dark:bg-slate-900 rounded-lg p-6 border border-gray-200 dark:border-slate-700 grid grid-rows-[auto_1fr_auto] h-full overflow-hidden">
                  {app.status === "In Progress" && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="flex items-center bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold px-3 py-1 rounded-full shadow-md">
                        <Wrench size={12} className="mr-1.5" />
                        {app.status}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-full bg-${app.color}-100 dark:bg-${app.color}-900/30 mr-4 text-${app.color}-600 dark:text-${app.color}-400`}>
                      <Icon size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{app.title}</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-4">{app.description}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex flex-wrap gap-2">
                      {app.tags.map(tag => (
                        <span key={tag} className="bg-cyan-100/60 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300 text-xs font-mono px-3 py-1 rounded-full">{tag}</span>
                      ))}
                    </div>
                    <ArrowRight className={`text-slate-400 dark:text-slate-500 transition-opacity ${isClickable ? 'opacity-100' : 'opacity-0'}`} size={20} />
                  </div>
                </div>
              );

              if (isClickable) {
                return (
                  <a key={index} href={app.link} target="_blank" rel="noopener noreferrer" className="block w-[85vw] sm:w-[400px] lg:w-[350px] flex-shrink-0">
                    <TiltCard className="h-full">
                      {cardContent}
                    </TiltCard>
                  </a>
                );
              }

              return (
                <div key={index} className="w-[85vw] sm:w-[400px] lg:w-[350px] flex-shrink-0">
                  <TiltCard className="h-full">
                    {cardContent}
                  </TiltCard>
                </div>
              );
            })}
          </div>
          <AnimatePresence>
            {showRightArrow && (
              <motion.button
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.8)' }}
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('right')}
                className="absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm rounded-full p-2 shadow-lg"
              >
                <ChevronRight size={36} className="text-slate-700 dark:text-slate-200" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
};

const Teaching = () => (
  <Section id="teaching" className="bg-gray-50 dark:bg-slate-900">
    <div className="container mx-auto px-6">
      <SectionTitle>Teaching & Mentorship</SectionTitle>
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
        <motion.div 
          className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-3">Workshops Conducted</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
            {portfolioData.teaching.workshops.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </motion.div>
        <motion.div 
          className="bg-white dark:bg-slate-800 p-6 rounded-lg border border-gray-200 dark:border-slate-700"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-semibold text-lg text-slate-900 dark:text-white mb-3">Student Supervision</h3>
          <ul className="space-y-2 text-slate-600 dark:text-slate-300 list-disc list-inside">
            {portfolioData.teaching.supervision.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </motion.div>
      </div>
    </div>
  </Section>
);

const Publications = ({ activeFilter, setActiveFilter }) => {
    const curatedTags = ['All', 'Machine Learning', 'Graph Theory', 'Automation', 'Civil Engineering', 'Optimization', 'Thermal Comfort', 'User Satisfaction', 'Smart Buildings'];
    
    const filteredPublications = activeFilter === 'All'
        ? portfolioData.publications
        : portfolioData.publications.filter(p => p.tags && p.tags.includes(activeFilter));

    return (
        <Section id="publications" className="bg-white dark:bg-slate-800">
            <div className="container mx-auto px-6">
                <SectionTitle>Publications</SectionTitle>
                
                <div className="flex flex-wrap justify-center gap-2 mb-12">
                    {curatedTags.map(tag => (
                        <button
                            key={tag}
                            onClick={() => setActiveFilter(tag)}
                            className={`px-4 py-2 text-sm font-medium rounded-full transition-colors ${
                                activeFilter === tag 
                                ? 'bg-cyan-600 dark:bg-cyan-400 text-white dark:text-slate-900' 
                                : 'bg-gray-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-gray-300 dark:hover:bg-slate-600'
                            }`}
                        >
                            {tag}
                        </button>
                    ))}
                </div>

                <motion.div layout className="max-w-4xl mx-auto space-y-4">
                    <AnimatePresence>
                        {filteredPublications.map((pub) => {
                            const isClickable = pub.link && pub.link !== "#";
                            const MotionComponent = isClickable ? motion.a : motion.div;
                            return (
                                <MotionComponent
                                    key={pub.text}
                                    layout
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    href={isClickable ? pub.link : undefined}
                                    target={isClickable ? "_blank" : undefined}
                                    rel={isClickable ? "noopener noreferrer" : undefined}
                                    className={`block p-4 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900 ${isClickable ? 'hover:border-cyan-300 dark:hover:border-cyan-500 hover:bg-gray-100 dark:hover:bg-slate-800' : 'cursor-default'} transition-all duration-300`}
                                >
                                    <p className="font-medium text-slate-800 dark:text-slate-200">{pub.text} <em className="text-slate-500 dark:text-slate-400 not-italic">{pub.journal}</em></p>
                                </MotionComponent>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </Section>
    );
};

const Footer = () => (
  <footer className="bg-gray-100 dark:bg-slate-800 border-t border-gray-200 dark:border-slate-700">
    <div className="container mx-auto px-6 py-8 text-center text-slate-600 dark:text-slate-400">
      <p className="text-lg font-semibold text-slate-900 dark:text-white">{portfolioData.name}</p>
      <p className="mt-2">Let's connect and build something great together.</p>
      <div className="mt-6 flex justify-center space-x-6">
        <a href={`mailto:${portfolioData.contact.email}`} className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"><Mail size={22} /></a>
        <a href={portfolioData.contact.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors"><Linkedin size={22} /></a>
        <a href={portfolioData.contact.googleScholar} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors">
            <GoogleScholarIcon className="w-5 h-5" />
        </a>
      </div>
      <p className="mt-8 text-sm text-slate-400 dark:text-slate-500">&copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved.</p>
    </div>
  </footer>
);


export default function App() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <ThemeProvider>
      <CursorSpotlight />
      <div className="bg-gray-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 font-sans transition-colors duration-300">
        <Header />
        <main>
          <Hero />
          <About />
          <Projects setActiveFilter={setActiveFilter} />
          <Apps />
          <Teaching />
          <Publications activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}