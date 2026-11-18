// Edit only the text inside quotes. Placeholder content is marked TODO.
window.CONFIG = {
  name: ["Joshua", ""],                                      // first line, optional accent line
  role: "Mobile Application Developer · Flutter & Dart",
  status: "Open to Flutter and mobile developer roles",
  about: {
    title: "I build mobile apps that run a business.",
    text: "Mobile application developer with 2 years of Flutter and Dart experience at iSpider Software Solutions, building ERP and business management apps with REST APIs and SQL Server backends.",
    stats: [["2+", "Years of Flutter"], ["5", "Projects"], ["8.3", "MCA CGPA"]]
  },
  projects: [
    { title: "TexNexa", tech: "Flutter · Dart · REST API", desc: "ERP and business management mobile app, my current project.", link: "#" },
    { title: "iQSpider ERP", tech: "Flutter · SQL Server", desc: "Business management and employee modules, from expenses to production dashboards.", link: "#" },
    { title: "SLIMS", tech: "Flutter · Face recognition", desc: "Smart attendance app with teacher and student face enrolment.", link: "#" }
  ],
  skills: ["Flutter", "Dart", "REST APIs", "SQL Server", "ASP.NET / .NET", "API development", "UI development", "C, C++, HTML (basic)"],
  resume: {
    experience: [["Mobile Application Developer", "iSpider Software Solutions · 2 years"]],
    education: [["MCA", "Christ College of Engineering and Technology · 2023–2025 · CGPA 8.3"], ["B.Sc Computer Science", "Tagore College of Arts and Science, Pondicherry"]],
    file: "media/resume.pdf"                                  // add your PDF here
  },
  contact: {
    title: "Let's build something together.",
    email: "joshua.joe.dev@gmail.com",
    links: [["LinkedIn", "https://www.linkedin.com/in/jerojoshua143"], ["GitHub", "https://github.com/joshuajoedev-ops"]]
  },
  // Film seconds from film_master.mp4. Re-time here if you rebuild the film.
  timing: {
    order: ["intro", "about", "work", "skills", "resume", "contact"],
    hold:  { intro: 6.6, about: 14.9, work: 28.2, skills: 37.0, resume: 39.85, contact: 42.6 },
    win:   { intro: [3.2, 7.4], about: [12.8, 17.0], work: [25.2, 30.4], skills: [33.4, 39.0], resume: [39.3, 40.9], contact: [40.9, 99] },
    travelH: { intro: 2, about: 3, work: 4, skills: 3, resume: 1.5, contact: 2 },        // scroll length (screen heights) before each hold
    holdH:   { intro: 1, about: 1, work: 1.5, skills: 1, resume: 1, contact: 1 },
    cardsAt: 26.2, chipsAt: 34.0, resumeDrop: [39.5, 40.1], frameDraw: [41.2, 42.2],
    shift: [[0, 22], [7.4, 22], [10, 0]]                                                 // desktop sideways shift (vw) over film time
  }
};
