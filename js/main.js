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

// Initialize all components when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initEarth();
    initShowcaseScroll();
    initImpactTicker();
    
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
