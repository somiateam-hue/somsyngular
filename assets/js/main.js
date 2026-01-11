// Entities
import { ContactSubmission } from '../../Entities/ContactSubmission.js';

console.log("SOM ATLAS SYSTEM: Loaded");

export default function initApp() {
    console.log("SOM ATLAS SYSTEM: Initializing App Logic...");

    // 1. CHATBOT LOGIC
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatWindow = document.getElementById('chat-window');

    if (chatbotToggle && chatWindow) {
        // Clone to remove old listeners
        const newToggle = chatbotToggle.cloneNode(true);
        chatbotToggle.parentNode.replaceChild(newToggle, chatbotToggle);

        // Notification Badge Logic
        setTimeout(() => {
            if (chatWindow.classList.contains('hidden')) {
                const badge = document.createElement('div');
                badge.id = 'chat-badge';
                badge.style.position = 'absolute';
                badge.style.top = '-5px';
                badge.style.right = '-5px';
                badge.style.background = '#ef4444';
                badge.style.color = 'white';
                badge.style.borderRadius = '50%';
                badge.style.width = '20px';
                badge.style.height = '20px';
                badge.style.fontSize = '12px';
                badge.style.display = 'flex';
                badge.style.alignItems = 'center';
                badge.style.justifyContent = 'center';
                badge.style.fontWeight = 'bold';
                badge.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
                badge.innerHTML = '1';
                newToggle.appendChild(badge);
                newToggle.style.animation = 'pulse 2s infinite';
            }
        }, 5000); // Show notification after 5s

        newToggle.addEventListener('click', () => {
            console.log("Chatbot CLICKED");
            const isHidden = chatWindow.classList.contains('hidden');

            // Remove badge
            const badge = document.getElementById('chat-badge');
            if (badge) badge.remove();
            newToggle.style.animation = '';

            if (isHidden) {
                // Open
                chatWindow.classList.remove('hidden');
                chatWindow.style.display = 'flex'; // FORCE DISPLAY
                setTimeout(() => {
                    const input = chatWindow.querySelector('input');
                    if (input) input.focus();
                }, 50);
            } else {
                // Close
                chatWindow.classList.add('hidden');
                chatWindow.style.display = 'none';
            }
        });

        // Chat Input Logic
        const chatInput = chatWindow.querySelector('input');
        const chatBody = chatWindow.querySelector('div:nth-child(2)'); // Content area

        if (chatInput && chatBody) {
            chatInput.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter' && chatInput.value.trim() !== "") {
                    const userMsg = chatInput.value.trim();

                    // User Msg
                    addChatMessage(chatBody, userMsg, 'user');
                    chatInput.value = "";

                    // Bot Typing
                    const typingId = showTyping(chatBody);

                    // Bot Response via Webhook
                    try {
                        const response = await fetch('https://n8n.srv1119749.hstgr.cloud/webhook/845ded30-928e-4bf0-9498-4e4ebaf4d6b8', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ message: userMsg })
                        });
                        const data = await response.json();
                        removeTyping(typingId);

                        // Handle various n8n response formats
                        const botText = data.output || data.text || data.message || (typeof data === 'string' ? data : JSON.stringify(data));
                        addChatMessage(chatBody, botText, 'bot');

                    } catch (error) {
                        console.error('Chatbot Error:', error);
                        removeTyping(typingId);
                        addChatMessage(chatBody, "Lo siento, tuve un problema de conexión. Intenta de nuevo más tarde.", 'bot');
                    }
                }
            });
        }
    } else {
        console.error("Chatbot elements not found!");
    }

    // 2. CONTACT FORM LOGIC
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Clone to remove old listeners
        const newForm = contactForm.cloneNode(true);
        contactForm.parentNode.replaceChild(newForm, contactForm);

        newForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const form = e.target;
            const submitBtn = form.querySelector('button[type="submit"]');

            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            const submission = new ContactSubmission(data);
            const validation = submission.validate();

            if (!validation.isValid) {
                alert("⚠️ " + validation.errors.join("\n"));
                return;
            }

            submitBtn.textContent = "Enviando...";
            submitBtn.disabled = true;

            // --- REAL N8N CONNECTION START ---
            // Replace this URL with your actual production n8n/webhook URL
            const WEBHOOK_URL = 'https://n8n.srv1119749.hstgr.cloud/webhook/a761a7e9-5fb1-4998-9cd8-7bdb73cde558';

            try {
                // Determine if we should send to real webhook or fallback for demo
                const isProduction = !WEBHOOK_URL.includes('YOUR_N8N');

                if (isProduction) {
                    const response = await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(submission.toJSON())
                    });

                    if (!response.ok) throw new Error('Network response was not ok');
                } else {
                    // Demo Mode: Simulate network delay if no real URL is set
                    console.log("[DEV MODE] Form Data:", submission.toJSON());
                    await new Promise(r => setTimeout(r, 1000));
                }

                // Success
                submitBtn.textContent = "¡Mensaje Recibido!";
                submitBtn.style.background = "#22c55e";
                submitBtn.style.borderColor = "#22c55e";
                form.reset();

                // Save backup to LocalStorage just in case
                try {
                    const submissions = JSON.parse(localStorage.getItem('som_atlas_leads') || '[]');
                    submissions.unshift(submission.toJSON());
                    localStorage.setItem('som_atlas_leads', JSON.stringify(submissions));
                } catch (e) { console.error('Local backup failed', e); }

            } catch (error) {
                console.error('Error submitting form:', error);
                submitBtn.textContent = "Hubo un error :(";
                submitBtn.style.background = "#ef4444";
                submitBtn.style.borderColor = "#ef4444";
                alert("Hubo un problema enviando tu mensaje. Por favor intenta de nuevo o escríbenos a contacto@somsyngular.com");
            }
            // --- REAL N8N CONNECTION END ---

            setTimeout(() => {
                submitBtn.textContent = "Enviar Mensaje";
                submitBtn.disabled = false;
                submitBtn.style.background = "";
                submitBtn.style.borderColor = "";
            }, 5000);
        });
    }

    // 3. SCROLL ANIMATIONS
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // 4. TAB LOGIC (Services)
    const tabs = document.querySelectorAll('.service-tab');
    const contents = document.querySelectorAll('.service-content');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('tab-active'));
            tab.classList.add('tab-active');
            const target = tab.dataset.target;
            contents.forEach(c => c.style.display = (c.id === target) ? 'block' : 'none');
        });
    });

    // 5. FILTER LOGIC (Portfolio)
    const filters = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');
    filters.forEach(btn => {
        btn.addEventListener('click', () => {
            filters.forEach(b => {
                b.classList.remove('filter-active');
                b.classList.remove('btn-primary');
                b.classList.add('btn-ghost');
            });
            btn.classList.add('filter-active');
            btn.classList.remove('btn-ghost');

            const cat = btn.dataset.filter;
            projects.forEach(p => {
                p.style.display = (cat === 'all' || p.dataset.category === cat) ? 'block' : 'none';
                if (p.style.display === 'block') setTimeout(() => p.style.opacity = '1', 50);
                else p.style.opacity = '0';
            });
        });
    });

    // 6. FAQ ACCORDION LOGIC
    document.querySelectorAll('.faq-item').forEach(item => {
        item.querySelector('.faq-header').addEventListener('click', () => {
            const body = item.querySelector('.faq-body');
            const isOpen = body.style.maxHeight !== '0px' && body.style.maxHeight !== '';

            // Close all
            document.querySelectorAll('.faq-body').forEach(b => b.style.maxHeight = '0px');

            // Toggle current
            if (!isOpen) {
                body.style.maxHeight = body.scrollHeight + 'px';
            }
        });
    });

    // 7. PARTICLE NETWORK BACKGROUND
    const heroSection = document.getElementById('hero');
    if (heroSection) {
        initParticles(heroSection);
    }

    // 8. ROI CALCULATOR LOGIC
    const roiEmployees = document.getElementById('roi-employees');
    const roiSalary = document.getElementById('roi-salary');
    const roiPercent = document.getElementById('roi-percent');
    const roiDisplay = document.getElementById('roi-percent-display');
    const roiTotal = document.getElementById('roi-total');

    if (roiEmployees && roiSalary && roiPercent) {
        function calculateROI() {
            const emp = parseInt(roiEmployees.value) || 0;
            const sal = parseInt(roiSalary.value) || 0;
            const pct = parseInt(roiPercent.value) || 0;

            roiDisplay.innerText = pct + "%";

            const savings = (emp * sal) * (pct / 100);
            roiTotal.innerText = "€" + savings.toLocaleString('en-US'); // US locale for commas
        }

        roiEmployees.addEventListener('input', calculateROI);
        roiSalary.addEventListener('input', calculateROI);
        roiPercent.addEventListener('input', calculateROI);
    }

    // 9. COOKIE BANNER LOGIC
    const cookieBanner = document.getElementById('cookie-banner');
    const acceptCookies = document.getElementById('accept-cookies');

    if (cookieBanner && !localStorage.getItem('som_atlas_cookies')) {
        setTimeout(() => {
            cookieBanner.style.display = 'block';
            cookieBanner.classList.add('reveal');
            cookieBanner.classList.add('active');
        }, 2000);
    }

    if (acceptCookies) {
        acceptCookies.addEventListener('click', () => {
            localStorage.setItem('som_atlas_cookies', 'true');
            cookieBanner.style.display = 'none';
        });
    }

    // 10. PROJECT MODAL LOGIC (New)
    const modal = document.getElementById('project-modal');
    const backdrop = document.getElementById('modal-backdrop');
    const closeModal = document.getElementById('close-modal');

    if (modal && backdrop) {
        // Open Modal
        document.querySelectorAll('.project-card').forEach(card => {
            card.style.cursor = 'pointer';
            card.addEventListener('click', () => {
                const img = card.querySelector('img').src;
                const title = card.querySelector('h3').innerText;
                const desc = card.querySelector('p').innerText;
                const tags = card.querySelectorAll('div > span'); // Select tags

                // Populate
                document.getElementById('modal-img').src = img;
                document.getElementById('modal-title').innerText = title;
                document.getElementById('modal-desc').innerText = desc + " Este proyecto es un ejemplo de cómo aplicamos tecnología avanzada para resolver problemas reales. Si buscas una solución similar, contáctanos.";

                // Tags
                const tagsContainer = document.getElementById('modal-tags');
                tagsContainer.innerHTML = '';
                tags.forEach(tag => {
                    const newTag = tag.cloneNode(true);
                    newTag.style.background = 'rgba(255,255,255,0.1)';
                    newTag.style.color = '#38bdf8';
                    newTag.style.border = '1px solid rgba(56, 189, 248, 0.3)';
                    tagsContainer.appendChild(newTag);
                });

                // Show
                modal.style.display = 'flex';
                backdrop.style.display = 'block';
                document.body.style.overflow = 'hidden'; // Stop scroll
            });
        });

        // Close Logic
        function hideModal() {
            modal.style.display = 'none';
            backdrop.style.display = 'none';
            document.body.style.overflow = '';
        }

        closeModal.addEventListener('click', hideModal);
        backdrop.addEventListener('click', hideModal);
    }

    // 11. NEURAL NETWORK ANIMATION (New)
    initNeuralNetwork('neural-canvas');
}

function initNeuralNetwork(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        initParticles();
    }

    function initParticles() {
        particles = [];
        const count = Math.floor(width * height / 15000); // Density
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = '#38bdf8';
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.15)';

        // Update & Draw Particles
        for (let i = 0; i < particles.length; i++) {
            let p = particles[i];

            // Move
            p.x += p.vx;
            p.y += p.vy;

            // Bounce
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;

            // Draw Dot
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();

            // Connect
            for (let j = i + 1; j < particles.length; j++) {
                let p2 = particles[j];
                let dx = p.x - p2.x;
                let dy = p.y - p2.y;
                let dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 100) {
                    ctx.beginPath();
                    ctx.lineWidth = 1 - (dist / 100);
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();
}

function initParticles(container) {
    const canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = '-1';
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = container.offsetWidth;
        height = canvas.height = container.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }
        draw() {
            ctx.fillStyle = 'rgba(0, 198, 255, 0.3)';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    for (let i = 0; i < 50; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
            // Connections
            particles.forEach(p2 => {
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    ctx.strokeStyle = `rgba(0, 198, 255, ${0.1 - dist / 1500})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(animate);
    }
    animate();
}


// Helpers
function addChatMessage(container, text, sender) {
    const div = document.createElement('div');
    div.style.padding = "0.8rem";
    div.style.borderRadius = "8px";
    div.style.marginBottom = "0.5rem";
    div.style.maxWidth = "85%";

    if (sender === 'user') {
        div.style.background = "var(--gradient-primary)";
        div.style.color = "white";
        div.style.marginLeft = "auto";
    } else {
        div.style.background = "rgba(255,255,255,0.1)";
        div.style.color = "var(--text-secondary)";
    }
    div.textContent = text;
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
}

function showTyping(container) {
    const div = document.createElement('div');
    div.id = 'typing-' + Date.now();
    div.style.padding = "0.5rem";
    div.style.color = "var(--text-secondary)";
    div.style.fontStyle = "italic";
    div.textContent = "Escribiendo...";
    container.appendChild(div);
    container.scrollTop = container.scrollHeight;
    return div.id;
}

function removeTyping(id) {
    const el = document.getElementById(id);
    if (el) el.remove();
}

function getBotResponse(msg) {
    msg = msg.toLowerCase();
    if (msg.includes('precio') || msg.includes('costo')) return "¿Te gustaría agendar una llamada para un presupuesto a medida?";
    if (msg.includes('servicios')) return "Desarrollo Web, Chatbots de IA y Automatización. ¿Qué necesitas?";
    if (msg.includes('hola')) return "¡Hola! ¿Cómo podemos escalar tu negocio hoy?";
    return "Déjanos tus datos en el formulario y te contactamos enseguida.";
}
