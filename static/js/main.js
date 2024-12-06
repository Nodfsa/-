document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    

    const tl = gsap.timeline();
    

    tl.to('.loading-bar', {
        width: '100%',
        duration: 2,
        ease: 'power2.inOut'
    }).to(loadingScreen, {
        opacity: 0,
        duration: 0.5,
        onComplete: () => {
            loadingScreen.style.display = 'none';
            animateContent();
        }
    });
});


function animateContent() {
    const elements = document.querySelectorAll('.card, .post, h1, h2, p');
    
    gsap.from(elements, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out'
    });
}


function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            

            const spans = navToggle.querySelectorAll('span');
            if (navLinks.classList.contains('active')) {
                gsap.to(spans[0], { rotation: 45, y: 8 });
                gsap.to(spans[1], { opacity: 0 });
                gsap.to(spans[2], { rotation: -45, y: -8 });
            } else {
                gsap.to(spans[0], { rotation: 0, y: 0 });
                gsap.to(spans[1], { opacity: 1 });
                gsap.to(spans[2], { rotation: 0, y: 0 });
            }
        });
    }
}


function initCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            gsap.to(card, {
                y: -5,
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });
}


function likePost(postId) {
    fetch(`/like_post/${postId}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const likeCount = document.querySelector(`#like-count-${postId}`);
            const likeIcon = likeCount.previousElementSibling;
            

            gsap.timeline()
                .to(likeIcon, {
                    scale: 1.5,
                    duration: 0.2,
                    ease: 'power2.out'
                })
                .to(likeIcon, {
                    scale: 1,
                    duration: 0.2,
                    ease: 'elastic.out(1, 0.3)'
                });
            
            likeCount.textContent = data.likes;
        }
    });
}


function viewPost(postId) {
    fetch(`/view_post/${postId}`, {
        method: 'POST',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            const viewCount = document.querySelector(`#view-count-${postId}`);
            gsap.from(viewCount, {
                scale: 1.2,
                duration: 0.3,
                ease: 'power2.out'
            });
            viewCount.textContent = data.views;
        }
    });
}

function handleFileUpload() {
    const fileInput = document.querySelector('#file-input');
    const filePreview = document.querySelector('#file-preview');
    
    if (fileInput) {
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const previewContent = file.type.startsWith('image/') 
                        ? `<img src="${e.target.result}" alt="Preview" style="max-width: 200px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">`
                        : `<div class="file-preview-box">
                            <span class="file-icon">📄</span>
                            <span class="file-name">${file.name}</span>
                           </div>`;
                    
                    filePreview.innerHTML = previewContent;
                    
                    gsap.from(filePreview.children[0], {
                        opacity: 0,
                        y: 20,
                        duration: 0.5,
                        ease: 'power2.out'
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

function initFormAnimation() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const button = form.querySelector('button[type="submit"]');
            if (button) {
                gsap.to(button, {
                    scale: 0.95,
                    duration: 0.1,
                    yoyo: true,
                    repeat: 1
                });
            }
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initCardHoverEffects();
    handleFileUpload();
    initSmoothScroll();
    initFormAnimation();
});
