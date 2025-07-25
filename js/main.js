// Initialize Lucide icons
lucide.createIcons();

// Theme Toggle
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.querySelector('.theme-icon');
const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

// Check for saved theme preference or use system preference
const currentTheme = localStorage.getItem('theme') || 
    (prefersDarkScheme.matches ? 'dark' : 'light');
document.documentElement.setAttribute('data-theme', currentTheme);
updateThemeIcon(currentTheme);

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.setAttribute('data-lucide', 'sun');
    } else {
        themeIcon.setAttribute('data-lucide', 'moon');
    }
    lucide.createIcons();
}

// Role Cycling Animation
const roles = [
    'AI & Climate Change Innovator',
    'Award-Winning Entrepreneur',
    'PhD Researcher',
    'Educator & Mentor',
    'Public Speaker'
];

let roleIndex = 0;
const roleElement = document.getElementById('roleCycler');

function cycleRoles() {
    roleElement.style.opacity = '0';
    
    setTimeout(() => {
        roleIndex = (roleIndex + 1) % roles.length;
        roleElement.textContent = roles[roleIndex];
        roleElement.style.opacity = '1';
    }, 500);
}

// Start role cycling after initial load
setTimeout(cycleRoles, 2000);
setInterval(cycleRoles, 4000);

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Scroll Effect
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Add/remove scrolled class based on scroll position
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    // Hide/show navbar on scroll direction
    if (currentScroll <= 0) {
        navbar.classList.remove('scroll-up');
        return;
    }
    
    if (currentScroll > lastScroll && !navbar.classList.contains('scroll-down')) {
        // Scroll down
        navbar.classList.remove('scroll-up');
        navbar.classList.add('scroll-down');
    } else if (currentScroll < lastScroll && navbar.classList.contains('scroll-down')) {
        // Scroll up
        navbar.classList.remove('scroll-down');
        navbar.classList.add('scroll-up');
    }
    
    lastScroll = currentScroll;
});

// Initialize Three.js Earth
function initEarth() {
    const container = document.getElementById('earthContainer');
    if (!container) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // Create Earth
    const geometry = new THREE.SphereGeometry(5, 64, 64);
    
    // Load Earth texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load('https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg');
    const bumpMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_normal_2048.jpg');
    const specularMap = textureLoader.load('https://threejs.org/examples/textures/planets/earth_specular_2048.jpg');
    
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        bumpMap: bumpMap,
        bumpScale: 0.05,
        specularMap: specularMap,
        specular: new THREE.Color('grey'),
        shininess: 5
    });
    
    const earth = new THREE.Mesh(geometry, material);
    scene.add(earth);
    
    // Add ambient light
    const ambientLight = new THREE.AmbientLight(0x333333);
    scene.add(ambientLight);
    
    // Add directional light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 3, 5);
    scene.add(directionalLight);
    
    // Position camera
    camera.position.z = 15;
    
    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        earth.rotation.y += 0.002;
        renderer.render(scene, camera);
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    // Start animation
    animate();
}

// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Initialize showcase scroll animations
function initShowcaseScroll() {
    const steps = document.querySelectorAll('.text-step');
    const visuals = document.querySelectorAll('.visual-item');
    
    steps.forEach((step, index) => {
        const stepNumber = parseInt(step.getAttribute('data-step'));
        
        gsap.to(step, {
            scrollTrigger: {
                trigger: '.showcase',
                start: 'top center+=100',
                end: 'bottom center',
                scrub: 0.5,
                onEnter: () => {
                    // Hide all steps and visuals
                    steps.forEach(s => s.classList.remove('active'));
                    visuals.forEach(v => v.classList.remove('active'));
                    
                    // Show current step and corresponding visual
                    step.classList.add('active');
                    const visual = document.querySelector(`.visual-item[data-step="${stepNumber}"]`);
                    if (visual) visual.classList.add('active');
                },
                onEnterBack: () => {
                    // Show previous step when scrolling up
                    const prevStep = steps[Math.max(0, index - 1)];
                    if (prevStep) {
                        steps.forEach(s => s.classList.remove('active'));
                        visuals.forEach(v => v.classList.remove('active'));
                        
                        const prevStepNumber = parseInt(prevStep.getAttribute('data-step'));
                        prevStep.classList.add('active');
                        const visual = document.querySelector(`.visual-item[data-step="${prevStepNumber}"]`);
                        if (visual) visual.classList.add('active');
                    }
                }
            }
        });
    });
}

// Initialize impact ticker animation
function initImpactTicker() {
    const track = document.querySelector('.ticker-track');
    if (!track) return;
    
    // Duplicate items for seamless looping
    const items = document.querySelectorAll('.ticker-item');
    items.forEach(item => {
        const clone = item.cloneNode(true);
        track.appendChild(clone);
    });
    
    // Animate the track
    gsap.to(track, {
        x: `-=${track.scrollWidth / 2}`,
        duration: 30,
        ease: 'none',
        repeat: -1
    });
}

// Project Modal System
const projectData = {
    'planty': {
        title: 'Planty - Smart Agriculture Platform',
        description: 'Revolutionary AI-powered agriculture platform that transforms traditional farming through precision irrigation, crop monitoring, and predictive analytics.',
        features: [
            'AI-driven crop health monitoring',
            'Precision irrigation optimization',
            'Weather pattern prediction',
            'Soil condition analysis',
            'Mobile farmer interface',
            'Real-time alerts and recommendations'
        ],
        achievements: [
            '1st Place - Th3 Place AI Hackathon',
            'Winner - Startup Power Competition',
            '20% increase in crop efficiency',
            '5,000+ active users'
        ],
        technologies: ['Python', 'TensorFlow', 'IoT Sensors', 'React Native', 'AWS'],
        impact: '15-20% improvement in crop yields reported by farmers using Planty'
    },
    'smart-pot': {
        title: 'Smart Pot - Intelligent Irrigation System',
        description: 'Patented smart irrigation system that revolutionizes home gardening with automated water management and soil health monitoring.',
        features: [
            'Automated watering schedules',
            'Soil moisture monitoring',
            'Nutrient level tracking',
            'Mobile app control',
            'Weather integration',
            'Plant growth analytics'
        ],
        achievements: [
            'Patent filed and pending',
            '30% water conservation',
            'Featured in AgTech Magazine',
            'Pilot program success'
        ],
        technologies: ['Arduino', 'IoT Sensors', 'Mobile App', 'Cloud Analytics'],
        impact: 'Reduces water usage by 30% while improving plant health'
    },
    'climate-ai': {
        title: 'Climate AI - Prediction & Adaptation',
        description: 'Advanced machine learning models for climate prediction and adaptation strategies, helping communities prepare for environmental changes.',
        features: [
            'Climate pattern prediction',
            'Extreme weather forecasting',
            'Adaptation strategy recommendations',
            'Community risk assessment',
            'Policy impact analysis',
            'Real-time monitoring dashboard'
        ],
        achievements: [
            '95% prediction accuracy',
            '3 peer-reviewed publications',
            'USAID collaboration',
            'Global climate summit presentation'
        ],
        technologies: ['Deep Learning', 'Satellite Data', 'Python', 'TensorFlow', 'GIS'],
        impact: 'Helping communities prepare for climate change with 95% accuracy'
    },
    'street-tech': {
        title: 'STREET TECH - Innovation Platform',
        description: 'Comprehensive entrepreneurship platform connecting innovators with resources, mentorship, and funding opportunities in emerging markets.',
        features: [
            'Startup incubation program',
            'Mentor matching system',
            'Funding opportunity alerts',
            'Skill development workshops',
            'Community networking events',
            'Success tracking analytics'
        ],
        achievements: [
            '500+ startups supported',
            '$2M+ in funding facilitated',
            '15 countries reached',
            '80% success rate'
        ],
        technologies: ['Web Platform', 'Mobile App', 'Database Management', 'Analytics'],
        impact: 'Empowering entrepreneurs across 15 countries with $2M+ in funding'
    },
    'renewable-energy': {
        title: 'Solar Optimization - Desert Technology',
        description: 'Advanced algorithms for optimizing solar panel efficiency and energy storage systems specifically designed for harsh desert environments.',
        features: [
            'Solar panel efficiency optimization',
            'Energy storage management',
            'Desert condition adaptation',
            'Predictive maintenance',
            'Grid integration solutions',
            'Performance analytics'
        ],
        achievements: [
            '25% efficiency improvement',
            'IEEE publication',
            '2023 Innovation Award',
            'Commercial deployment'
        ],
        technologies: ['Machine Learning', 'IoT', 'Energy Systems', 'Python', 'MATLAB'],
        impact: '25% increase in solar efficiency in desert environments'
    },
    'water-management': {
        title: 'Water Intelligence - Smart Distribution',
        description: 'Intelligent water management system leveraging satellite data and AI to optimize water distribution in water-scarce regions.',
        features: [
            'Satellite data integration',
            'Water demand prediction',
            'Distribution optimization',
            'Leak detection system',
            'Quality monitoring',
            'Community usage analytics'
        ],
        achievements: [
            '40% water conservation',
            '10,000+ families served',
            'USAID funding secured',
            'UN recognition'
        ],
        technologies: ['Satellite Data', 'AI/ML', 'IoT Sensors', 'GIS', 'Cloud Computing'],
        impact: 'Providing clean water access to 10,000+ families with 40% conservation'
    }
};

function openProjectModal(projectId) {
    const project = projectData[projectId];
    if (!project) return;
    
    // Create modal HTML
    const modalHTML = `
        <div class="project-modal-overlay" id="projectModal" onclick="closeProjectModal(event)">
            <div class="project-modal" onclick="event.stopPropagation()">
                <button class="modal-close" onclick="closeProjectModal()">&times;</button>
                <div class="modal-header">
                    <h2>${project.title}</h2>
                    <p class="modal-description">${project.description}</p>
                </div>
                <div class="modal-content">
                    <div class="modal-section">
                        <h3>Key Features</h3>
                        <ul class="feature-list">
                            ${project.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-section">
                        <h3>Achievements</h3>
                        <ul class="achievement-list">
                            ${project.achievements.map(achievement => `<li>${achievement}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="modal-section">
                        <h3>Technologies</h3>
                        <div class="tech-tags">
                            ${project.technologies.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
                        </div>
                    </div>
                    <div class="modal-section impact-section">
                        <h3>Impact</h3>
                        <p class="impact-text">${project.impact}</p>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-primary" onclick="contactAboutProject('${projectId}')">Get in Touch</button>
                    <button class="btn btn-outline" onclick="closeProjectModal()">Close</button>
                </div>
            </div>
        </div>
    `;
    
    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Animate modal in
    gsap.fromTo('#projectModal', 
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
    );
    
    gsap.fromTo('#projectModal .project-modal', 
        { scale: 0.8, y: 50 },
        { scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.7)', delay: 0.1 }
    );
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
}

function closeProjectModal(event) {
    if (event && event.target !== event.currentTarget) return;
    
    const modal = document.getElementById('projectModal');
    if (!modal) return;
    
    // Animate modal out
    gsap.to(modal, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    });
}

function contactAboutProject(projectId) {
    const project = projectData[projectId];
    const subject = `Inquiry about ${project.title}`;
    const body = `Hi Abdulrahman,\n\nI'm interested in learning more about your ${project.title} project. Could we schedule a time to discuss?\n\nBest regards`;
    
    window.open(`mailto:contact@abdulrahmanhussein.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
    closeProjectModal();
}

// Enhanced horizontal scrolling for projects
function initProjectsScroll() {
    const container = document.getElementById('projectsScroll');
    if (!container) return;
    
    // Auto-scroll functionality
    let isAutoScrolling = true;
    let scrollPosition = 0;
    const scrollSpeed = 1;
    const maxScroll = container.scrollWidth - container.clientWidth;
    
    function autoScroll() {
        if (!isAutoScrolling) return;
        
        scrollPosition += scrollSpeed;
        if (scrollPosition >= maxScroll) {
            scrollPosition = 0;
        }
        
        container.scrollLeft = scrollPosition;
        requestAnimationFrame(autoScroll);
    }
    
    // Pause auto-scroll on hover
    container.addEventListener('mouseenter', () => {
        isAutoScrolling = false;
    });
    
    container.addEventListener('mouseleave', () => {
        isAutoScrolling = true;
        autoScroll();
    });
    
    // Start auto-scroll
    autoScroll();
    
    // Add scroll indicators
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator-projects';
    scrollIndicator.innerHTML = '<span>Scroll to explore more projects →</span>';
    container.parentNode.appendChild(scrollIndicator);
}

// Enhanced skills animation
function initSkillsAnimation() {
    const skillCards = document.querySelectorAll('.skill-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-progress');
                const targetWidth = progressBar.style.width;
                
                gsap.fromTo(progressBar, 
                    { width: '0%' },
                    { width: targetWidth, duration: 1.5, ease: 'power2.out', delay: 0.2 }
                );
                
                gsap.fromTo(entry.target, 
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.6, ease: 'power2.out' }
                );
                
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    
    skillCards.forEach(card => observer.observe(card));
}

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initEarth();
    initShowcaseScroll();
    initImpactTicker();
    initProjectsScroll();
    initSkillsAnimation();
    
    // Add loading class to body until everything is ready
    document.body.classList.add('loaded');
    
    // Initialize GSAP animations
    gsap.from('.hero-content > *', {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
    });
    
    // Animate project cards on scroll
    gsap.registerPlugin(ScrollTrigger);
    
    gsap.utils.toArray('.project-card').forEach((card, index) => {
        gsap.fromTo(card, 
            { y: 100, opacity: 0, scale: 0.8 },
            {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 0.8,
                ease: 'back.out(1.7)',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 80%',
                    end: 'bottom 20%',
                    toggleActions: 'play none none reverse'
                },
                delay: index * 0.1
            }
        );
    });
});

// Handle scroll animations for sections
const sections = document.querySelectorAll('section');

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});
