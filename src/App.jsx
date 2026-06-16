import { useState, useEffect, useRef } from 'react'
import './App.css'

// ── Data ──────────────────────────────────────────────────────────────────────
const DATA = {
  name: "Alex Chen",
  title: "Full-Stack Engineer & Open Source Contributor",
  location: "San Francisco, CA",
  github: "alexchen",
  email: "alex@devcraft.io",
  bio: "I build infrastructure that scales and interfaces that sing. Obsessed with developer experience, distributed systems, and the elegant solution hiding inside every complex problem.",
  stats: [
    { label: "Repositories", value: "47", icon: "📦" },
    { label: "Contributions", value: "1.2k", icon: "🔥" },
    { label: "Stars Earned", value: "3.8k", icon: "⭐" },
    { label: "Followers", value: "892", icon: "👥" },
  ],
  skills: [
    { name: "TypeScript", level: 95, color: "#3178c6" },
    { name: "React / Next.js", level: 92, color: "#61dafb" },
    { name: "Node.js", level: 88, color: "#00d9a3" },
    { name: "Go", level: 80, color: "#00add8" },
    { name: "PostgreSQL", level: 85, color: "#336791" },
    { name: "Docker / K8s", level: 78, color: "#2496ed" },
    { name: "Rust", level: 65, color: "#ce422b" },
    { name: "AWS / GCP", level: 82, color: "#6c63ff" },
  ],
  projects: [
    {
      name: "Forge CLI",
      desc: "A blazing-fast scaffolding tool for modern web projects. Supports 12+ templates, plugin system, and auto-detects your package manager.",
      stars: 1240,
      forks: 89,
      lang: "TypeScript",
      langColor: "#3178c6",
      tags: ["CLI", "DX", "Open Source"],
      link: "#",
    },
    {
      name: "StreamDB",
      desc: "Lightweight real-time database with WebSocket sync, offline support, and conflict-free replicated data types (CRDTs) built-in.",
      stars: 876,
      forks: 61,
      lang: "Go",
      langColor: "#00add8",
      tags: ["Database", "Real-time", "CRDT"],
      link: "#",
    },
    {
      name: "Prism UI",
      desc: "Headless component library for React with zero runtime CSS, full accessibility, and a themeable token system that ships at 4kb.",
      stars: 1580,
      forks: 132,
      lang: "TypeScript",
      langColor: "#3178c6",
      tags: ["UI", "Accessibility", "React"],
      link: "#",
    },
    {
      name: "Patchwork",
      desc: "Git-native content management — write in markdown, version with git, deploy anywhere. No database, no lock-in.",
      stars: 534,
      forks: 48,
      lang: "Rust",
      langColor: "#ce422b",
      tags: ["CMS", "Git", "Rust"],
      link: "#",
    },
    {
      name: "Porthole",
      desc: "Zero-config observability for Node.js. Auto-instruments your app, streams traces to any OpenTelemetry backend.",
      stars: 423,
      forks: 37,
      lang: "Node.js",
      langColor: "#00d9a3",
      tags: ["Observability", "DevOps"],
      link: "#",
    },
    {
      name: "Lens",
      desc: "Browser extension that overlays accessibility scores, WCAG violations, and color contrast ratios on any webpage as you browse.",
      stars: 198,
      forks: 22,
      lang: "JavaScript",
      langColor: "#f7df1e",
      tags: ["A11y", "Browser", "Tool"],
      link: "#",
    },
  ],
  timeline: [
    { year: "2024", role: "Staff Engineer", company: "Vercel", note: "Leading the Edge Runtime team" },
    { year: "2022", role: "Senior SWE", company: "Stripe", note: "Payments infrastructure, SDKs" },
    { year: "2020", role: "SWE II", company: "GitHub", note: "Actions & Codespaces platform" },
    { year: "2018", role: "Junior Dev", company: "Shopify", note: "Storefront API, first real job" },
    { year: "2017", role: "CS Graduate", company: "UC Berkeley", note: "B.S. Computer Science" },
  ],
}

// ── Terminal Hero ─────────────────────────────────────────────────────────────
function Terminal() {
  const lines = [
    { delay: 0,    text: "$ whoami",                      type: "cmd" },
    { delay: 600,  text: DATA.name.toLowerCase().replace(' ', '_'), type: "out" },
    { delay: 1000, text: "$ cat about.txt",               type: "cmd" },
    { delay: 1600, text: DATA.title,                      type: "out" },
    { delay: 2000, text: "📍 " + DATA.location,           type: "out" },
    { delay: 2400, text: "$ git log --oneline -3",        type: "cmd" },
    { delay: 3000, text: "a4f2c1b feat: ship StreamDB v2.1",  type: "git" },
    { delay: 3200, text: "9e3d0fa fix: reduce bundle 40%",    type: "git" },
    { delay: 3400, text: "2bc7aa0 docs: update API reference", type: "git" },
    { delay: 3800, text: "$ _",                           type: "cmd" },
  ]
  const [visible, setVisible] = useState([])

  useEffect(() => {
    lines.forEach((l, i) => {
      setTimeout(() => setVisible(v => [...v, i]), l.delay)
    })
  }, [])

  return (
    <div className="terminal">
      <div className="terminal-header">
        <span className="dot red" />
        <span className="dot yellow" />
        <span className="dot green" />
        <span className="terminal-title">zsh — portfolio</span>
      </div>
      <div className="terminal-body">
        {lines.map((l, i) => visible.includes(i) && (
          <div key={i} className={`t-line t-${l.type}`}>
            {l.type === 'cmd' ? (
              <><span className="t-prompt">❯</span> {l.text === '$ _' ? <span className="cursor">▋</span> : l.text.replace('$ ', '')}</>
            ) : l.type === 'git' ? (
              <><span className="t-hash">{l.text.split(' ')[0]}</span> <span className="t-msg">{l.text.slice(8)}</span></>
            ) : (
              <span className="t-output">{l.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Skill Bar ─────────────────────────────────────────────────────────────────
function SkillBar({ name, level, color, index }) {
  const [width, setWidth] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setTimeout(() => setWidth(level), index * 80)
      }
    }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [level, index])

  return (
    <div className="skill-row" ref={ref}>
      <div className="skill-meta">
        <span className="skill-name">{name}</span>
        <span className="skill-pct" style={{ color }}>{level}%</span>
      </div>
      <div className="skill-track">
        <div
          className="skill-fill"
          style={{ width: `${width}%`, background: `linear-gradient(90deg, ${color}88, ${color})`, transition: 'width 1s cubic-bezier(0.4,0,0.2,1)' }}
        />
      </div>
    </div>
  )
}

// ── Project Card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, index }) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setVis(true)
    }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="proj-card"
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s`
      }}
    >
      <div className="proj-top">
        <span className="proj-icon">⬡</span>
        <div className="proj-links">
          <a href={project.link} className="proj-link" aria-label="View repository">
            <GitIcon />
          </a>
          <a href={project.link} className="proj-link" aria-label="Open project">
            <ExtIcon />
          </a>
        </div>
      </div>
      <h3 className="proj-name">{project.name}</h3>
      <p className="proj-desc">{project.desc}</p>
      <div className="proj-tags">
        {project.tags.map(t => <span key={t} className="tag">{t}</span>)}
      </div>
      <div className="proj-footer">
        <span className="proj-lang">
          <span className="lang-dot" style={{ background: project.langColor }} />
          {project.lang}
        </span>
        <span className="proj-stat">⭐ {project.stars.toLocaleString()}</span>
        <span className="proj-stat">⑂ {project.forks}</span>
      </div>
    </div>
  )
}

// ── Icons ─────────────────────────────────────────────────────────────────────
const GitIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
  </svg>
)

const ExtIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
    <polyline points="15 3 21 3 21 9"/>
    <line x1="10" y1="14" x2="21" y2="3"/>
  </svg>
)

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  return (
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="#hero" className="nav-logo">
          <span className="logo-bracket">&lt;</span>AC<span className="logo-bracket">/&gt;</span>
        </a>
        <ul className="nav-links">
          {['About', 'Skills', 'Projects', 'Experience', 'Contact'].map(item => (
            <li key={item}>
              <a href={`#${item.toLowerCase()}`} className="nav-link">{item}</a>
            </li>
          ))}
        </ul>
        <a
          href={`https://github.com/${DATA.github}`}
          className="nav-cta"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub <GitIcon />
        </a>
      </div>
    </nav>
  )
}

// ── Stat Counter ──────────────────────────────────────────────────────────────
function StatCounter({ value, label, icon }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const num = parseFloat(value.replace('k', '')) * (value.includes('k') ? 1000 : 1)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0
        const step = num / 60
        const id = setInterval(() => {
          start += step
          if (start >= num) { setCount(num); clearInterval(id) }
          else setCount(Math.floor(start))
        }, 16)
      }
    }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [num])

  const display = count >= 1000 ? (count / 1000).toFixed(1) + 'k' : count.toString()

  return (
    <div ref={ref} className="stat-card">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{display}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}

// ── Grid Background ───────────────────────────────────────────────────────────
function GridBg() {
  return (
    <div className="grid-bg" aria-hidden="true">
      <div className="grid-lines" />
      <div className="glow glow-1" />
      <div className="glow glow-2" />
    </div>
  )
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <>
      <Nav />
      <GridBg />

      {/* HERO */}
      <section id="hero" className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <p className="hero-eyebrow"><span className="dot-green" />Available for new opportunities</p>
            <h1 className="hero-name">{DATA.name}</h1>
            <h2 className="hero-role">{DATA.title}</h2>
            <p className="hero-bio">{DATA.bio}</p>
            <div className="hero-actions">
              <a href="#projects" className="btn-primary">View My Work</a>
              <a href={`mailto:${DATA.email}`} className="btn-ghost">Get in Touch</a>
            </div>
            <div className="hero-chips">
              {['TypeScript', 'React', 'Go', 'Kubernetes'].map(t => (
                <span key={t} className="chip">{t}</span>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <Terminal />
          </div>
        </div>

        {/* Stats bar */}
        <div className="stats-bar">
          <div className="container stats-inner">
            {DATA.stats.map(s => <StatCounter key={s.label} {...s} />)}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-left">
              <p className="section-eyebrow">$ cat about.md</p>
              <h2 className="section-title">Crafting software<br /><em>with intention</em></h2>
              <p className="about-text">
                I've spent 7 years at the intersection of infrastructure and product — from managing global payment systems at Stripe to building the tools that millions of developers use every day on GitHub.
              </p>
              <p className="about-text">
                Outside of work, I contribute heavily to open source. I believe great software is built in the open, with thoughtful APIs and documentation that respects developers' time.
              </p>
              <div className="about-meta">
                <div className="meta-item"><span className="meta-key">Location</span><span className="meta-val">{DATA.location}</span></div>
                <div className="meta-item"><span className="meta-key">GitHub</span><span className="meta-val">@{DATA.github}</span></div>
                <div className="meta-item"><span className="meta-key">Focus</span><span className="meta-val">Backend · DX · OSS</span></div>
              </div>
            </div>
            <div className="about-right">
              <div className="avatar-wrap">
                <div className="avatar-ring" />
                <div className="avatar-placeholder">
                  <span>AC</span>
                </div>
                <div className="avatar-badge">
                  <span>⭐ 3.8k</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" className="section section-alt">
        <div className="container">
          <p className="section-eyebrow">$ ls skills/</p>
          <h2 className="section-title">Technical Stack</h2>
          <div className="skills-grid">
            {DATA.skills.map((s, i) => <SkillBar key={s.name} {...s} index={i} />)}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <div className="container">
          <p className="section-eyebrow">$ git ls-files --pinned</p>
          <h2 className="section-title">Featured Projects</h2>
          <p className="section-sub">Things I've built and shipped — mostly open source, always with love.</p>
          <div className="projects-grid">
            {DATA.projects.map((p, i) => <ProjectCard key={p.name} project={p} index={i} />)}
          </div>
          <div className="more-link">
            <a href={`https://github.com/${DATA.github}`} className="btn-ghost" target="_blank" rel="noopener noreferrer">
              See all repositories → 
            </a>
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" className="section section-alt">
        <div className="container">
          <p className="section-eyebrow">$ git log --career</p>
          <h2 className="section-title">Experience</h2>
          <div className="timeline">
            {DATA.timeline.map((item, i) => (
              <div key={i} className="timeline-item">
                <div className="timeline-year">{item.year}</div>
                <div className="timeline-line">
                  <div className="timeline-dot" />
                  {i < DATA.timeline.length - 1 && <div className="timeline-connector" />}
                </div>
                <div className="timeline-content">
                  <h3 className="timeline-role">{item.role}</h3>
                  <p className="timeline-company">{item.company}</p>
                  <p className="timeline-note">{item.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="container contact-inner">
          <p className="section-eyebrow">$ ssh alex@devcraft.io</p>
          <h2 className="section-title">Let's Build<br /><em>Something Great</em></h2>
          <p className="contact-sub">
            Whether it's a job opportunity, a collaboration, or just a technical rabbit hole — my inbox is open.
          </p>
          <div className="contact-actions">
            <a href={`mailto:${DATA.email}`} className="btn-primary btn-large">
              Send Email
            </a>
            <a href={`https://github.com/${DATA.github}`} className="btn-ghost btn-large" target="_blank" rel="noopener noreferrer">
              <GitIcon /> Follow on GitHub
            </a>
          </div>
          <div className="contact-links">
            <a href="#" className="social-link">Twitter</a>
            <span>·</span>
            <a href="#" className="social-link">LinkedIn</a>
            <span>·</span>
            <a href="#" className="social-link">DEV.to</a>
            <span>·</span>
            <a href="#" className="social-link">Resume</a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-logo"><span className="logo-bracket">&lt;</span>AC<span className="logo-bracket">/&gt;</span></span>
          <span className="footer-text">Built with React + Vite · Deployed on GitHub Pages</span>
          <span className="footer-copy">© 2025 {DATA.name}</span>
        </div>
      </footer>
    </>
  )
}
