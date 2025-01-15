// Initialize GSAP
gsap.registerPlugin(ScrollTrigger);

// Custom Cursor
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', (e) => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0
    });
    gsap.to(cursorFollower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1
    });
});

// Magnetic Effect
document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        
        gsap.to(button, {
            x: x * 0.2,
            y: y * 0.2,
            duration: 0.3,
            ease: "power2.out"
        });
    });

    button.addEventListener('mouseleave', () => {
        gsap.to(button, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power2.out"
        });
    });
});

// Loading Animation
window.addEventListener('load', () => {
    const loadingScreen = document.querySelector('.loading-screen');
    const tl = gsap.timeline();

    tl.to('.progress-bar::after', {
        width: '100%',
        duration: 1,
        ease: 'power2.inOut'
    })
    .to(loadingScreen, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            loadingScreen.style.display = 'none';
            initAnimations();
        }
    });
});

// Mobile Menu Toggle
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
let menuOpen = false;

menuBtn?.addEventListener('click', () => {
    if (!menuOpen) {
        menuBtn.classList.add('open');
        gsap.to(navLinks, {
            display: 'flex',
            opacity: 1,
            y: 0,
            duration: 0.3
        });
        menuOpen = true;
    } else {
        menuBtn.classList.remove('open');
        gsap.to(navLinks, {
            opacity: 0,
            y: -20,
            duration: 0.3,
            onComplete: () => {
                navLinks.style.display = 'none';
            }
        });
        menuOpen = false;
    }
});

// Text Rotation Animation
class TxtRotate {
    constructor(el, toRotate, period) {
        this.toRotate = toRotate;
        this.el = el;
        this.loopNum = 0;
        this.period = parseInt(period, 10) || 2000;
        this.txt = '';
        this.tick();
        this.isDeleting = false;
    }
    
    tick() {
        const i = this.loopNum % this.toRotate.length;
        const fullTxt = this.toRotate[i];

        if (this.isDeleting) {
            this.txt = fullTxt.substring(0, this.txt.length - 1);
        } else {
            this.txt = fullTxt.substring(0, this.txt.length + 1);
        }

        this.el.innerHTML = '<span class="wrap">' + this.txt + '</span>';

        let delta = 200 - Math.random() * 100;

        if (this.isDeleting) { delta /= 2; }

        if (!this.isDeleting && this.txt === fullTxt) {
            delta = this.period;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.loopNum++;
            delta = 500;
        }

        setTimeout(() => {
            this.tick();
        }, delta);
    }
}

// Initialize Animations
function initAnimations() {
    // Text Rotation
    const elements = document.getElementsByClassName('txt-rotate');
    for (let i = 0; i < elements.length; i++) {
        const toRotate = elements[i].getAttribute('data-rotate');
        const period = elements[i].getAttribute('data-period');
        if (toRotate) {
            new TxtRotate(elements[i], JSON.parse(toRotate), period);
        }
    }

    // Split Text Animation
    const splitTexts = document.querySelectorAll('.split-text');
    splitTexts.forEach(text => {
        const split = new SplitType(text, { types: 'words, chars' });
        gsap.from(split.chars, {
            opacity: 0,
            y: 20,
            duration: 0.7,
            stagger: 0.02
        });
    });

    // Hero Section Animation
    gsap.from('.hero-content .glitch-text', {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: 'power4.out',
        delay: 0.5
    });

    // Skill Cards Animation
    const skillCards = document.querySelectorAll('.skill-card');
    skillCards.forEach((card, index) => {
        gsap.from(card, {
            duration: 0.6,
            opacity: 0,
            y: 30,
            delay: index * 0.1,
            scrollTrigger: {
                trigger: card,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });

    // Tech Stack Animation
    const techItems = document.querySelectorAll('.tech-item');
    techItems.forEach((item, index) => {
        gsap.from(item, {
            scale: 0,
            opacity: 0,
            duration: 0.5,
            delay: index * 0.1,
            ease: 'back.out(1.7)',
            scrollTrigger: {
                trigger: item,
                start: 'top 80%'
            }
        });
    });

    // Section Titles Animation
    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        gsap.from(title, {
            duration: 1,
            y: 50,
            opacity: 0,
            scrollTrigger: {
                trigger: title,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

// Three.js Scene Setup
function initThreeJS() {
    // Hero Canvas
    const heroCanvas = document.getElementById('hero-canvas');
    const heroScene = new THREE.Scene();
    const heroCamera = new THREE.PerspectiveCamera(75, heroCanvas.clientWidth / heroCanvas.clientHeight, 0.1, 1000);
    const heroRenderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    heroRenderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
    heroCanvas.appendChild(heroRenderer.domElement);

    // Create animated geometry
    const geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    const material = new THREE.MeshPhongMaterial({
        color: 0x6c63ff,
        wireframe: true,
        emissive: 0x6c63ff,
        emissiveIntensity: 0.2
    });
    const torusKnot = new THREE.Mesh(geometry, material);
    
    heroScene.add(torusKnot);

    // Add lights
    const pointLight = new THREE.PointLight(0x6c63ff, 1, 100);
    pointLight.position.set(10, 10, 10);
    heroScene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040);
    heroScene.add(ambientLight);

    heroCamera.position.z = 30;

    // Mouse movement effect
    let mouseX = 0;
    let mouseY = 0;
    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);
        
        // Rotate based on mouse position
        torusKnot.rotation.x += 0.01;
        torusKnot.rotation.y += 0.01;
        torusKnot.position.x = mouseX * 5;
        torusKnot.position.y = mouseY * 5;

        // Pulsating effect
        const time = Date.now() * 0.001;
        material.emissiveIntensity = 0.2 + Math.sin(time) * 0.1;
        
        heroRenderer.render(heroScene, heroCamera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        heroCamera.aspect = heroCanvas.clientWidth / heroCanvas.clientHeight;
        heroCamera.updateProjectionMatrix();
        heroRenderer.setSize(heroCanvas.clientWidth, heroCanvas.clientHeight);
    });
}

// Initialize Three.js scenes
initThreeJS();

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: target,
                    offsetY: 100
                },
                ease: "power2.inOut"
            });
        }
    });
});

// Project Showcase Data
const projects = [
    {
        title: "Interactive Web Portfolio",
        description: "A stunning 3D portfolio website with dynamic animations and interactive elements.",
        image: "https://images.unsplash.com/photo-1547658719-da2b51169166?auto=format&fit=crop&q=80",
        tags: ["Three.js", "GSAP", "JavaScript", "WebGL"],
        demoLink: "#",
        githubLink: "#",
        fullDescription: "A cutting-edge portfolio website that pushes the boundaries of web design. Features include interactive 3D elements, particle systems, custom shaders, and smooth page transitions. Built with Three.js and GSAP for immersive user experience.",
        features: ["3D Animations", "Custom Shaders", "Responsive Design", "Performance Optimized"]
    },
    {
        title: "AI-Powered Task Manager",
        description: "Smart task management app with AI scheduling and priority optimization.",
        image: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?auto=format&fit=crop&q=80",
        tags: ["React", "Python", "TensorFlow", "Node.js"],
        demoLink: "#",
        githubLink: "#",
        fullDescription: "An intelligent task management system that uses AI to optimize task scheduling and improve productivity. Features include smart prioritization, workload balancing, and predictive task completion estimates.",
        features: ["AI Scheduling", "Real-time Updates", "Team Collaboration", "Analytics Dashboard"]
    },
    {
        title: "Crypto Trading Platform",
        description: "Real-time cryptocurrency trading platform with advanced analytics.",
        image: "https://images.unsplash.com/photo-1518546305927-5a555bb7020d?auto=format&fit=crop&q=80",
        tags: ["Vue.js", "WebSocket", "Node.js", "MongoDB"],
        demoLink: "#",
        githubLink: "#",
        fullDescription: "A sophisticated cryptocurrency trading platform with real-time market data, advanced charting, and automated trading strategies. Integrates multiple exchanges and provides detailed analytics.",
        features: ["Real-time Trading", "Advanced Charts", "Portfolio Tracking", "Automated Trading"]
    },
    {
        title: "Social Media Dashboard",
        description: "Unified social media management platform with AI-powered insights.",
        image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c2a2?auto=format&fit=crop&q=80",
        tags: ["React", "Redux", "Node.js", "AI/ML"],
        demoLink: "#",
        githubLink: "#",
        fullDescription: "A comprehensive social media management dashboard that unifies multiple platforms and provides AI-powered insights. Features include automated posting, engagement analytics, and content optimization.",
        features: ["Multi-platform Integration", "AI Analytics", "Automated Scheduling", "Engagement Tracking"]
    },
    {
        title: "AR Shopping Experience",
        description: "Augmented reality shopping app for immersive product visualization.",
        image: "https://images.unsplash.com/photo-1633536726481-465c3676851d?auto=format&fit=crop&q=80",
        tags: ["AR.js", "Three.js", "React Native", "WebXR"],
        demoLink: "#",
        githubLink: "#",
        fullDescription: "An innovative shopping experience that uses augmented reality to help customers visualize products in their space. Features include real-time 3D product rendering, measurements, and social sharing.",
        features: ["AR Visualization", "3D Product View", "Real-time Measurements", "Social Integration"]
    },
    {
        title: "Smart Home Controller",
        description: "IoT-based smart home control system with voice commands.",
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80",
        tags: ["IoT", "React", "Node.js", "WebSocket"],
        demoLink: "#",
        githubLink: "#",
        fullDescription: "A comprehensive smart home control system that integrates various IoT devices and provides voice-controlled automation. Features include scene creation, energy monitoring, and AI-powered automation.",
        features: ["Voice Control", "Device Integration", "Energy Monitoring", "Automated Scenes"]
    }
];

// Enhanced createProjectCards function with more animations
function createProjectCards() {
    const showcaseGrid = document.querySelector('.showcase-grid');
    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.innerHTML = `
            <div class="project-image-container">
                <img src="${project.image}" alt="${project.title}" class="project-image">
                <div class="project-overlay">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                    </div>
                    <div class="project-features">
                        ${project.features.map(feature => `
                            <div class="feature-item">
                                <i class="fas fa-check-circle"></i>
                                <span>${feature}</span>
                            </div>
                        `).join('')}
                    </div>
                    <a href="#" class="view-project">
                        <span>View Details</span>
                        <i class="fas fa-arrow-right"></i>
                    </a>
                </div>
            </div>
        `;

        // Enhanced scroll animation
        gsap.from(card, {
            opacity: 0,
            y: 50,
            rotation: 5,
            duration: 0.8,
            delay: index * 0.2,
            ease: "power3.out",
            scrollTrigger: {
                trigger: card,
                start: 'top 85%',
                end: 'top 15%',
                toggleActions: 'play none none reverse'
            }
        });

        // Hover animations
        const imageContainer = card.querySelector('.project-image-container');
        const overlay = card.querySelector('.project-overlay');
        const title = card.querySelector('.project-title');
        const description = card.querySelector('.project-description');
        const tags = card.querySelector('.project-tags');
        const features = card.querySelector('.project-features');
        const viewButton = card.querySelector('.view-project');

        card.addEventListener('mouseenter', () => {
            gsap.to(imageContainer, { scale: 1.05, duration: 0.3 });
            gsap.to(overlay, { opacity: 1, y: 0, duration: 0.3 });
            gsap.from([title, description, tags, features, viewButton], {
                y: 20,
                opacity: 0,
                duration: 0.4,
                stagger: 0.1,
                ease: "power2.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(imageContainer, { scale: 1, duration: 0.3 });
            gsap.to(overlay, { opacity: 0, y: 20, duration: 0.3 });
        });

        // Add click handler
        card.addEventListener('click', () => showProjectModal(project));
        showcaseGrid.appendChild(card);
    });
}

// Create and handle modal
function createModal() {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="modal-close">
                <i class="fas fa-times"></i>
            </button>
            <img class="modal-image" src="" alt="">
            <h2 class="modal-title"></h2>
            <p class="modal-description"></p>
            <div class="modal-links">
                <a href="#" class="modal-link demo-link">
                    <i class="fas fa-external-link-alt"></i>
                    Live Demo
                </a>
                <a href="#" class="modal-link github-link">
                    <i class="fab fa-github"></i>
                    View Code
                </a>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Close modal on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            hideProjectModal();
        }
    });

    // Close modal on close button click
    modal.querySelector('.modal-close').addEventListener('click', hideProjectModal);

    return modal;
}

const modal = createModal();

function showProjectModal(project) {
    const modalContent = modal.querySelector('.modal-content');
    modal.querySelector('.modal-image').src = project.image;
    modal.querySelector('.modal-title').textContent = project.title;
    modal.querySelector('.modal-description').textContent = project.fullDescription;
    modal.querySelector('.demo-link').href = project.demoLink;
    modal.querySelector('.github-link').href = project.githubLink;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    // Animate modal content
    gsap.fromTo(modalContent,
        {
            opacity: 0,
            y: 50
        },
        {
            opacity: 1,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        }
    );
}

function hideProjectModal() {
    const modalContent = modal.querySelector('.modal-content');

    gsap.to(modalContent, {
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// Initialize project showcase
createProjectCards();

// Projects Data
const projectsData = [
    {
        title: 'E-commerce Platform',
        description: 'A full-stack e-commerce solution with real-time inventory management',
        tags: ['React', 'Node.js', 'MongoDB', 'WebSocket']
    },
    {
        title: '3D Product Configurator',
        description: 'Interactive 3D product visualization tool',
        tags: ['Three.js', 'WebGL', 'GSAP']
    },
    {
        title: 'Cybersecurity Dashboard',
        description: 'Real-time security monitoring and threat detection',
        tags: ['Vue.js', 'Python', 'Machine Learning']
    }
];

// Populate Projects
function populateProjects() {
    const projectsGrid = document.querySelector('.projects-grid');
    projectsData.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.innerHTML = `
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
            </div>
        `;
        projectsGrid.appendChild(projectCard);

        // Animate project cards
        gsap.from(projectCard, {
            duration: 0.8,
            opacity: 0,
            y: 50,
            rotation: 5,
            delay: index * 0.2,
            scrollTrigger: {
                trigger: projectCard,
                start: 'top 80%',
                toggleActions: 'play none none reverse'
            }
        });
    });
}

populateProjects();

// Contact Form Validation and Animation
const contactForm = document.getElementById('contactForm');
const formInputs = contactForm.querySelectorAll('input, textarea');

formInputs.forEach(input => {
    // Floating label animation
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        if (!input.value) {
            input.parentElement.classList.remove('focused');
        }
    });

    // Input animation
    input.addEventListener('input', () => {
        if (input.value) {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    });
});

// Form validation
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showError(input, message) {
    const formGroup = input.parentElement;
    formGroup.classList.add('error');
    const error = formGroup.querySelector('.error-message');
    error.textContent = message;

    gsap.to(error, {
        opacity: 1,
        y: 0,
        duration: 0.3
    });
}

function removeError(input) {
    const formGroup = input.parentElement;
    formGroup.classList.remove('error');
    const error = formGroup.querySelector('.error-message');
    
    gsap.to(error, {
        opacity: 0,
        y: -10,
        duration: 0.3
    });
}

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Validate Name
    const name = document.getElementById('name');
    if (name.value.trim() === '') {
        showError(name, 'Name is required');
        isValid = false;
    } else {
        removeError(name);
    }

    // Validate Email
    const email = document.getElementById('email');
    if (email.value.trim() === '') {
        showError(email, 'Email is required');
        isValid = false;
    } else if (!validateEmail(email.value)) {
        showError(email, 'Please enter a valid email');
        isValid = false;
    } else {
        removeError(email);
    }

    // Validate Subject
    const subject = document.getElementById('subject');
    if (subject.value.trim() === '') {
        showError(subject, 'Subject is required');
        isValid = false;
    } else {
        removeError(subject);
    }

    // Validate Message
    const message = document.getElementById('message');
    if (message.value.trim() === '') {
        showError(message, 'Message is required');
        isValid = false;
    } else {
        removeError(message);
    }

    if (isValid) {
        // Animate submit button
        const submitBtn = contactForm.querySelector('.submit-btn');
        const submitText = submitBtn.querySelector('.submit-text');
        const submitIcon = submitBtn.querySelector('.submit-icon');

        gsap.to(submitText, {
            opacity: 0,
            x: -20,
            duration: 0.3
        });

        gsap.to(submitIcon, {
            opacity: 1,
            x: 0,
            duration: 0.3,
            delay: 0.1
        });

        // Simulate form submission
        setTimeout(() => {
            // Reset form with animation
            formInputs.forEach(input => {
                gsap.to(input, {
                    value: '',
                    duration: 0.3
                });
                input.parentElement.classList.remove('focused');
            });

            // Reset button
            gsap.to([submitText, submitIcon], {
                opacity: 1,
                x: 0,
                duration: 0.3,
                delay: 0.5
            });

            // Show success message
            const formHeader = document.querySelector('.form-header');
            const originalContent = formHeader.innerHTML;
            
            formHeader.innerHTML = `
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. I'll get back to you soon.</p>
            `;

            gsap.from(formHeader.children, {
                y: 20,
                opacity: 0,
                duration: 0.5,
                stagger: 0.1
            });

            // Reset form header after 3 seconds
            setTimeout(() => {
                formHeader.innerHTML = originalContent;
                gsap.from(formHeader.children, {
                    y: 20,
                    opacity: 0,
                    duration: 0.5,
                    stagger: 0.1
                });
            }, 3000);
        }, 1500);
    }
});

// Animate contact cards on scroll
const contactCards = document.querySelectorAll('.contact-card');
contactCards.forEach((card, index) => {
    gsap.from(card, {
        opacity: 0,
        x: -50,
        duration: 0.8,
        delay: index * 0.2,
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
        }
    });
});

// Footer animations
gsap.from('.footer-content > *', {
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 80%'
    }
});

// Animate footer shape
gsap.to('.footer-shape', {
    scaleY: 1.5,
    duration: 2,
    ease: 'power1.inOut',
    repeat: -1,
    yoyo: true
});
