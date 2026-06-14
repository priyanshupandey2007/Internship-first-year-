// Smooth scroll to projects section
function scrollToProjects() {
    document
        .getElementById("projects")
        .scrollIntoView({
            behavior: "smooth"
        });
}

// Form submission with validation
document
    .querySelector("form")
    .addEventListener("submit", function(e) {
        e.preventDefault();

        // Get form values
        const name = document.querySelector('input[type="text"]').value;
        const email = document.querySelector('input[type="email"]').value;
        const message = document.querySelector('textarea').value;

        // Basic validation
        if (name.trim() === "" || email.trim() === "" || message.trim() === "") {
            alert("Please fill in all fields!");
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Please enter a valid email address!");
            return;
        }

        // Success message
        alert("Message Sent Successfully! Thanks for reaching out, " + name + "! 🎉");

        // Clear form
        this.reset();
    });

// Add scroll animation for cards
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all cards
const cards = document.querySelectorAll('.card');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(card);
});

// Observe skill boxes
const skillBoxes = document.querySelectorAll('.skill-box');
skillBoxes.forEach(box => {
    box.style.opacity = '0';
    box.style.transform = 'translateY(30px)';
    box.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(box);
});

// Observe stat boxes
const stats = document.querySelectorAll('.stat');
stats.forEach(stat => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateY(30px)';
    stat.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(stat);
});

// Active navigation link highlighting
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('nav a');

window.addEventListener('scroll', () => {
    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.style.color = 'white';
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.style.color = '#667eea';
        }
    });
});

// Add dynamic year to footer
const year = new Date().getFullYear();
document.querySelector('footer p').textContent = 
    `© ${year} Priyanshu Pandey | AI/ML Enthusiast | Always Learning & Growing 🚀`;