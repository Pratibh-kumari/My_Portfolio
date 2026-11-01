(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('.theme-icon');
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') root.dataset.theme = savedTheme;
  const updateThemeIcon = () => { themeIcon.textContent = root.dataset.theme === 'dark' ? '☼' : '☾'; };
  updateThemeIcon();
  themeToggle.addEventListener('click', () => {
    root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', root.dataset.theme);
    updateThemeIcon();
  });

  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  menuToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }));

  const roles = ['Digital Forensics & Incident Response', 'Threat Analysis & SOC', 'AI-powered Security', 'Secure Systems & Networking'];
  const typedRole = document.getElementById('typedRole');
  let roleIndex = 0, charIndex = roles[0].length, deleting = true;
  function typeRole() {
    const current = roles[roleIndex];
    if (deleting) {
      charIndex--;
      typedRole.textContent = current.slice(0, Math.max(0, charIndex));
      if (charIndex <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; }
      setTimeout(typeRole, 35);
    } else {
      const next = roles[roleIndex];
      charIndex++;
      typedRole.textContent = next.slice(0, charIndex);
      if (charIndex >= next.length) { deleting = true; setTimeout(typeRole, 1700); }
      else setTimeout(typeRole, 55);
    }
  }
  setTimeout(typeRole, 1800);

  const defaultProjects = [
    { title: 'ForensiQ', type: 'DIGITAL FORENSICS', description: 'A modular digital forensics toolkit for investigation workflows and CTF challenges.', category: 'security', tags: 'Python, DFIR, CTF', status: 'Ongoing build', link: '', image: '' },
    { title: 'ArmourTrack', type: 'ACCOUNTABILITY', description: 'A digital asset accountability system using signed QR codes and a tamper-evident ledger.', category: 'security iot', tags: 'ESP32, RFID, GPS, RSA', status: 'Craftathon 2026 · First Runner-Up', link: '', image: '' },
    { title: 'Secure POS System', type: 'EMBEDDED SECURITY', description: 'A hardware-security focused POS modernization prototype.', category: 'security iot', tags: 'Embedded, Hardware Security', status: 'HackTheSpring 2026', link: '', image: '' },
    { title: 'GreenWave', type: 'COMPUTER VISION', description: 'An AI-driven emergency traffic corridor system for emergency vehicles.', category: 'ai iot', tags: 'Computer Vision, IoT, Embedded', status: 'National showcase selection', link: '', image: '' }
  ];
  let projects;
  try {
    projects = JSON.parse(localStorage.getItem('portfolio-projects')) || defaultProjects;
  } catch (error) {
    projects = defaultProjects;
  }
  const projectGrid = document.getElementById('projectGrid');
  const projectCount = document.getElementById('projectCount');
  const projectForm = document.getElementById('projectForm');
  const filterButtons = document.querySelectorAll('.filter-btn');
  const escapeHtml = value => String(value).replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[character]));

  function renderProjects(filter = 'all') {
    projectGrid.innerHTML = '';
    const visibleProjects = projects.filter(project => filter === 'all' || project.category.split(' ').includes(filter));
    visibleProjects.forEach((project, index) => {
      const card = document.createElement('article');
      card.className = 'project-card reveal';
      card.dataset.category = project.category;
      const image = project.image ? `<img class="project-image" src="${escapeHtml(project.image)}" alt="${escapeHtml(project.title)} project preview" />` : '<div class="project-symbol">⌁</div>';
      const tags = project.tags.split(',').map(tag => `<span>${escapeHtml(tag.trim())}</span>`).join('');
      const link = project.link ? `<a class="project-link" href="${escapeHtml(project.link)}" target="_blank" rel="noopener">View project ↗</a>` : '';
      card.innerHTML = `<div class="project-top"><span class="project-index mono">P / ${String(projects.indexOf(project) + 1).padStart(2, '0')}</span><span class="project-type">${escapeHtml(project.type)}</span></div>${image}<h3>${escapeHtml(project.title)}</h3><p>${escapeHtml(project.description)}</p><div class="project-tags">${tags}</div><div class="project-bottom"><span>${escapeHtml(project.status)}</span>${link}</div>`;
      projectGrid.appendChild(card);
    });
    projectCount.textContent = `${String(visibleProjects.length).padStart(2, '0')} PROJECTS`;
  }

  function renderEditor() {
    projectForm.innerHTML = projects.map((project, index) => `<fieldset class="project-form-card"><legend>Project ${index + 1}</legend><label>Name<input name="title-${index}" value="${escapeHtml(project.title)}" required /></label><label>Type<input name="type-${index}" value="${escapeHtml(project.type)}" /></label><label>Description<textarea name="description-${index}" required>${escapeHtml(project.description)}</textarea></label><label>Category<select name="category-${index}"><option value="security" ${project.category === 'security' ? 'selected' : ''}>Security</option><option value="ai" ${project.category === 'ai' ? 'selected' : ''}>AI / ML</option><option value="iot" ${project.category === 'iot' ? 'selected' : ''}>IoT / Systems</option><option value="security iot" ${project.category === 'security iot' ? 'selected' : ''}>Security + IoT</option><option value="ai iot" ${project.category === 'ai iot' ? 'selected' : ''}>AI + IoT</option></select></label><label>Technologies<input name="tags-${index}" value="${escapeHtml(project.tags)}" placeholder="Python, Git, HTML" /></label><label>Status<input name="status-${index}" value="${escapeHtml(project.status)}" /></label><label>GitHub or demo URL<input name="link-${index}" type="url" value="${escapeHtml(project.link)}" placeholder="https://github.com/..." /></label><label>Project image<input name="image-${index}" type="file" accept="image/*" /></label>${project.image ? `<img class="editor-preview" src="${escapeHtml(project.image)}" alt="Current project preview" />` : ''}</fieldset>`).join('') + '<button class="button button-primary" type="submit">Save projects</button>';
  }

  filterButtons.forEach(button => button.addEventListener('click', () => {
    filterButtons.forEach(item => item.classList.remove('active'));
    button.classList.add('active');
    renderProjects(button.dataset.filter);
  }));
  document.getElementById('toggleProjectEditor').addEventListener('click', () => {
    projectForm.hidden = !projectForm.hidden;
    if (!projectForm.hidden) renderEditor();
  });
  document.getElementById('addProject').addEventListener('click', () => {
    projects.push({ title: 'New project', type: 'PROJECT TYPE', description: 'Describe your project here.', category: 'security', tags: 'Technology, Tool', status: 'In progress', link: '', image: '' });
    localStorage.setItem('portfolio-projects', JSON.stringify(projects));
    renderProjects(document.querySelector('.filter-btn.active').dataset.filter);
    projectForm.hidden = false;
    renderEditor();
  });
  projectForm.addEventListener('submit', event => {
    event.preventDefault();
    const formData = new FormData(projectForm);
    projects = projects.map((project, index) => ({ ...project, title: formData.get(`title-${index}`), type: formData.get(`type-${index}`), description: formData.get(`description-${index}`), category: formData.get(`category-${index}`), tags: formData.get(`tags-${index}`), status: formData.get(`status-${index}`), link: formData.get(`link-${index}`) }));
    const imageInputs = projectForm.querySelectorAll('input[type="file"]');
    Promise.all(Array.from(imageInputs).map((input, index) => input.files[0] ? new Promise(resolve => { const reader = new FileReader(); reader.onload = () => { projects[index].image = reader.result; resolve(); }; reader.readAsDataURL(input.files[0]); }) : Promise.resolve())).then(() => {
      localStorage.setItem('portfolio-projects', JSON.stringify(projects));
      renderProjects(document.querySelector('.filter-btn.active').dataset.filter);
      renderEditor();
    });
  });
  renderProjects();

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

  const progress = document.getElementById('scrollProgress');
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
  document.getElementById('year').textContent = new Date().getFullYear();
})();
