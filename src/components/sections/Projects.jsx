import { useRef } from 'react';
import { motion } from 'framer-motion';
import ScrollReveal from '../ui/ScrollReveal';
import TextReveal from '../ui/TextReveal';
import HorizontalScroll from '../ui/HorizontalScroll';
import ScrollPanel from '../ui/ScrollPanel';
import NodeDiagram from '../ui/NodeDiagram';
import LiveRepos from '../features/LiveRepos.jsx';

const projects = [
  {
    title: "Collaborative Code & Whiteboard",
    image: "/project-codecollab.svg",
    tech: ["React", "Node.js", "Express", "MongoDB", "WebSockets", "Monaco Editor"],
    color: "from-blue-500/20 to-purple-500/20",
    liveLink: "",
    githubLink: "",
    description: "A full-stack real-time collaboration platform with live code editing, whiteboarding, authentication, and multi-language execution. Optimized rendering and APIs, cutting load time from 3.2s to 1.8s and lifting Lighthouse performance from 68% to 91%.",
    diagramNodes: [
      { 
        id: 'client', 
        label: 'React Client', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>, 
        col: 1, row: 1,
        desc: 'Monaco editor + whiteboard UI'
      },
      { 
        id: 'ws', 
        label: 'Socket.IO', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>, 
        col: 2, row: 1,
        desc: 'Real-time sync engine'
      },
      { 
        id: 'auth', 
        label: 'JWT Auth', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>, 
        col: 2, row: 2,
        desc: 'Authentication and sessions'
      },
      { 
        id: 'db', 
        label: 'MongoDB', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>, 
        col: 3, row: 1,
        desc: 'Session and document store'
      },
    ],
    diagramLines: [
      { from: 'client', to: 'ws', animated: true },
      { from: 'ws', to: 'auth', animated: true },
      { from: 'ws', to: 'db', animated: true },
    ]
  },
  {
    title: "StudySphere",
    image: "/project-studysphere.svg",
    tech: ["React", "Node.js", "Express", "MongoDB", "Python"],
    color: "from-emerald-500/20 to-blue-500/20",
    liveLink: "https://face-atten-d.vercel.app/",
    githubLink: "https://github.com/Prince671/face_Attend",
    description: "An AI-powered face recognition attendance and LMS platform with automated attendance, authentication, and course management. Optimized APIs and rendering, cutting load time from 3.0s to 1.7s and lifting performance from 70% to 92%.",
    diagramNodes: [
      { 
        id: 'client', 
        label: 'React UI', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>, 
        col: 1, row: 1,
        desc: 'Attendance & LMS dashboard'
      },
      { 
        id: 'api', 
        label: 'Express API', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>, 
        col: 2, row: 1,
        desc: 'Core REST service'
      },
      { 
        id: 'ml', 
        label: 'Face Recognition (Python)', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"></circle><circle cx="9" cy="10" r="1"></circle><circle cx="15" cy="10" r="1"></circle><path d="M8 15a4 4 0 0 0 8 0"></path></svg>, 
        col: 3, row: 1,
        desc: 'Attendance recognition service'
      },
      { 
        id: 'db', 
        label: 'MongoDB', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>, 
        col: 2, row: 2,
        desc: 'Students, courses, records'
      },
    ],
    diagramLines: [
      { from: 'client', to: 'api', animated: true },
      { from: 'api', to: 'ml', animated: true },
      { from: 'api', to: 'db', animated: true },
    ]
  },
  {
    title: "RAG Application",
    image: "/project-rag.svg",
    tech: ["LangChain", "Pinecone", "Generative AI", "Vector Embeddings"],
    color: "from-violet-500/20 to-red-500/20",
    liveLink: "https://r-a-g.vercel.app/",
    githubLink: "https://github.com/Prince671/RAG/",
    description: "A Retrieval-Augmented Generation application built with LangChain, Pinecone, and vector embeddings for semantic search and context-aware document Q&A. Optimized retrieval workflows, cutting load time from 3.1s to 1.9s and lifting performance from 67% to 90%.",
    diagramNodes: [
      { 
        id: 'docs', 
        label: 'Documents', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>, 
        col: 1, row: 1,
        desc: 'Source documents ingested'
      },
      { 
        id: 'embed', 
        label: 'LangChain', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="18" r="3"></circle><path d="M9 6h6a3 3 0 0 1 3 3v6"></path></svg>, 
        col: 2, row: 1,
        desc: 'Chunking & embedding pipeline'
      },
      { 
        id: 'vector', 
        label: 'Pinecone', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>, 
        col: 3, row: 1,
        desc: 'Vector similarity search'
      },
      { 
        id: 'llm', 
        label: 'Generative AI', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.6h7.6z"></path></svg>, 
        col: 3, row: 2,
        desc: 'Context-aware answer generation'
      },
    ],
    diagramLines: [
      { from: 'docs', to: 'embed', animated: true },
      { from: 'embed', to: 'vector', animated: true },
      { from: 'vector', to: 'llm', animated: true },
    ]
  },
  {
    title: "NotesFlow",
    image: "/project-notesflow.svg",
    tech: ["React", "Node.js", "Express", "MongoDB", "Cloudinary", "JWT"],
    color: "from-amber-500/20 to-red-500/20",
    liveLink: "",
    githubLink: "https://github.com/Prince671/Notes_Flow",
    description: "A full-stack notes management app with folder organization, shareable notes, file/image uploads via Cloudinary, and an integrated AI assistant that can answer questions about your notes.",
    diagramNodes: [
      { 
        id: 'client', 
        label: 'React UI', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>, 
        col: 1, row: 1,
        desc: 'Notes, folders & AI sidebar'
      },
      { 
        id: 'api', 
        label: 'Express API', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>, 
        col: 2, row: 1,
        desc: 'Auth, CRUD & AI routes'
      },
      { 
        id: 'db', 
        label: 'MongoDB', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>, 
        col: 3, row: 1,
        desc: 'Notes, folders & users'
      },
      { 
        id: 'cloud', 
        label: 'Cloudinary', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z"></path></svg>, 
        col: 2, row: 2,
        desc: 'Image & file uploads'
      },
    ],
    diagramLines: [
      { from: 'client', to: 'api', animated: true },
      { from: 'api', to: 'db', animated: true },
      { from: 'api', to: 'cloud', animated: true },
    ]
  },
  {
    title: "AI Agent",
    image: "/project-aiagent.svg",
    tech: ["Python", "Flask", "LangChain", "Mistral AI", "MongoDB", "React"],
    color: "from-red-500/20 to-violet-500/20",
    liveLink: "",
    githubLink: "https://github.com/Prince671/AI-Agent",
    description: "A tool-using intelligent assistant built with LangChain and Mistral AI — it reasons over a query, automatically selects the right tool (weather, news, stocks, currency, places), and streams a grounded response back in real time, with voice input/output and persistent chat history.",
    diagramNodes: [
      { 
        id: 'client', 
        label: 'React UI', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><line x1="12" y1="18" x2="12.01" y2="18"></line></svg>, 
        col: 1, row: 1,
        desc: 'Streaming chat + voice I/O'
      },
      { 
        id: 'flask', 
        label: 'Flask API', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>, 
        col: 2, row: 1,
        desc: 'Auth, streaming SSE endpoint'
      },
      { 
        id: 'agent', 
        label: 'LangChain Agent', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="18" cy="18" r="3"></circle><path d="M9 6h6a3 3 0 0 1 3 3v6"></path></svg>, 
        col: 3, row: 1,
        desc: 'Selects & calls the right tool'
      },
      { 
        id: 'mistral', 
        label: 'Mistral AI', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l2.4 7.2H22l-6 4.6 2.3 7.2-6.3-4.6-6.3 4.6 2.3-7.2-6-4.6h7.6z"></path></svg>, 
        col: 3, row: 2,
        desc: 'Core LLM reasoning'
      },
      { 
        id: 'db', 
        label: 'MongoDB', 
        icon: <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"></ellipse><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path></svg>, 
        col: 2, row: 2,
        desc: 'Chat history & accounts'
      },
    ],
    diagramLines: [
      { from: 'client', to: 'flask', animated: true },
      { from: 'flask', to: 'agent', animated: true },
      { from: 'agent', to: 'mistral', animated: true },
      { from: 'flask', to: 'db', animated: true },
    ]
  }
];

/* Total panels = projects + 1 CTA panel */
const PANEL_COUNT = projects.length + 1;

const Projects = () => {
  const sectionRef = useRef(null);

  return (
    <section id="projects" className="relative">
      {/* Section Header — sits above the horizontal scroll area */}
      <div className="section-padding pb-0 bg-transparent relative z-10">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-12 md:mb-16"
          >
            <ScrollReveal delay={0}>
              <div className="flex items-center gap-4 mb-2">
                <div className="w-8 h-[1px]" style={{ backgroundColor: 'var(--color-red)', opacity: 0.7 }}></div>
                <h4 className="font-mono text-sm text-muted tracking-widest uppercase"><span className="text-red">// 02</span> &mdash; PORTFOLIO</h4>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold mb-4 text-accent">
                <TextReveal text="FEATURED PROJECTS" delay={0.2} />
              </h2>
              <div className="w-16 h-[4px] mb-6" style={{ backgroundColor: 'var(--color-red)' }} />
              <p className="text-muted max-w-2xl text-lg hidden md:block">
                Scroll down to explore — each project slides in horizontally.
              </p>
            </ScrollReveal>
          </motion.div>
        </div>
      </div>

      {/* Horizontal Scroll Area */}
      <HorizontalScroll panelCount={PANEL_COUNT}>
        {projects.map((project, idx) => (
          <ScrollPanel key={idx}>
            <div className="w-full h-full flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 px-6 md:px-20 lg:px-32">
              {/* Image Side */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, ease: [0.25, 1, 0.35, 1] }}
                className="w-full md:w-1/2 relative"
              >
                <div 
                  className="border-4 border-border-strong p-1 shadow-[6px_6px_0px_var(--color-border-strong)] bg-primary overflow-hidden"
                  data-cursor-text="EXPLORE"
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-auto grayscale hover:grayscale-0 transition-all duration-700 object-cover object-center opacity-90 hover:opacity-100"
                  />
                </div>

                {/* Floating index badge */}
                <div
                  className="absolute -top-4 -left-4 w-12 h-12 flex items-center justify-center font-mono text-sm font-bold border-2 border-border-strong"
                  style={{ backgroundColor: 'var(--color-red)', color: '#fff' }}
                >
                  {String(idx + 1).padStart(2, '0')}
                </div>
              </motion.div>

              {/* Content Side */}
              <motion.div
                initial={{ opacity: 0, x: 60 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.7, delay: 0.15, ease: [0.25, 1, 0.35, 1] }}
                className="w-full md:w-1/2 flex flex-col gap-6"
              >
                <h3 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-accent leading-none">
                  {project.title}
                </h3>

                {project.description && (
                  <p className="text-sm md:text-base text-muted leading-relaxed max-w-xl">
                    {project.description}
                  </p>
                )}

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, i) => (
                    <span
                      key={i}
                      className="text-[10px] py-1 px-2 border border-red font-mono uppercase tracking-[0.15em] text-red bg-red/10"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* System Architecture Node Diagram */}
                <div className="hidden md:block">
                  <h4 className="text-xs font-mono text-red uppercase tracking-widest mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-red inline-block"></span>
                    System Architecture
                  </h4>
                  <NodeDiagram nodes={project.diagramNodes} lines={project.diagramLines} />
                </div>

                {/* Links */}
                <div className="flex gap-4 mt-2">
                  {project.githubLink && project.githubLink !== '#' && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-mono text-muted hover:text-accent transition-colors border-b border-border-strong hover:border-accent pb-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.581 9.522 21.276 9.522 21.008C9.522 20.766 9.513 20.011 9.508 19.172C6.726 19.791 6.143 17.898 6.143 17.898C5.699 16.754 5.064 16.451 5.064 16.451C4.187 15.818 5.131 15.829 5.131 15.829C6.104 15.898 6.626 16.868 6.626 16.868C7.498 18.412 8.974 17.945 9.541 17.687C9.63 17.058 9.888 16.592 10.175 16.32C7.956 16.046 5.62 15.233 5.62 11.477C5.62 10.386 6.01 9.491 6.646 8.787C6.546 8.531 6.202 7.57 6.747 6.181C6.747 6.181 7.563 5.908 9.497 7.211C10.29 7.002 11.151 6.898 12.001 6.894C12.849 6.899 13.71 7.002 14.505 7.211C16.437 5.908 17.252 6.181 17.252 6.181C17.798 7.57 17.454 8.531 17.354 8.787C17.991 9.491 18.379 10.386 18.379 11.477C18.379 15.246 16.038 16.044 13.813 16.313C14.172 16.647 14.492 17.308 14.492 18.313C14.492 19.754 14.479 20.674 14.479 21.007C14.479 21.278 14.659 21.586 15.167 21.49C19.137 20.162 22 16.418 22 12C22 6.477 17.523 2 12 2Z" />
                      </svg>
                      Source
                    </a>
                  )}
                  {project.liveLink && project.liveLink !== '#' && (
                    <a
                      href={project.liveLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-mono text-muted hover:text-red transition-colors border-b border-border-strong hover:border-red pb-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </motion.div>
            </div>
          </ScrollPanel>
        ))}

        {/* CTA / "More Coming" Panel */}
        <ScrollPanel className="bg-transparent">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease: [0.25, 1, 0.35, 1] }}
            className="flex flex-col items-center justify-center text-center gap-8 px-6"
          >
            <div className="w-20 h-20 border-2 border-red flex items-center justify-center mb-2">
              <span className="text-red text-4xl font-mono">+</span>
            </div>

            <h3 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter text-accent leading-none">
              More Projects<br />Coming Soon
            </h3>

            <p className="text-muted font-mono text-sm max-w-md">
              I'm always building. Check back for new backend systems, security tools, and full-stack experiments.
            </p>

            <a
              href="https://github.com/Prince671"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-text="GITHUB"
              className="inline-flex items-center gap-2 px-6 py-3 border-2 border-red text-red font-mono text-sm uppercase tracking-widest hover:bg-red hover:text-white transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.581 9.522 21.276 9.522 21.008C9.522 20.766 9.513 20.011 9.508 19.172C6.726 19.791 6.143 17.898 6.143 17.898C5.699 16.754 5.064 16.451 5.064 16.451C4.187 15.818 5.131 15.829 5.131 15.829C6.104 15.898 6.626 16.868 6.626 16.868C7.498 18.412 8.974 17.945 9.541 17.687C9.63 17.058 9.888 16.592 10.175 16.32C7.956 16.046 5.62 15.233 5.62 11.477C5.62 10.386 6.01 9.491 6.646 8.787C6.546 8.531 6.202 7.57 6.747 6.181C6.747 6.181 7.563 5.908 9.497 7.211C10.29 7.002 11.151 6.898 12.001 6.894C12.849 6.899 13.71 7.002 14.505 7.211C16.437 5.908 17.252 6.181 17.252 6.181C17.798 7.57 17.454 8.531 17.354 8.787C17.991 9.491 18.379 10.386 18.379 11.477C18.379 15.246 16.038 16.044 13.813 16.313C14.172 16.647 14.492 17.308 14.492 18.313C14.492 19.754 14.479 20.674 14.479 21.007C14.479 21.278 14.659 21.586 15.167 21.49C19.137 20.162 22 16.418 22 12C22 6.477 17.523 2 12 2Z" />
              </svg>
              View All on GitHub
            </a>
          </motion.div>
        </ScrollPanel>
      </HorizontalScroll>

      <div className="container-custom">
        <LiveRepos />
      </div>
    </section>
  );
};

export default Projects;