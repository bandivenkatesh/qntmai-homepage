class UIAnimations {
    constructor() {
        this.subtitles = document.querySelectorAll('.subtitle-item');
        this.currentSubtitleIndex = 0;
        this.slogans = ["_Enter the System_", "_Cognition Unleashed_", "_Decoding the Unknown_", "_Perception Shift_"];
        this.currentSloganIndex = 0;
        this.isAnimating = false;
        this.RAF = null;
    }

    // Add throttling for smooth animations
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    startSubtitleCarousel() {
        setInterval(() => {
            this.subtitles[this.currentSubtitleIndex].classList.remove('active');
            this.currentSubtitleIndex = (this.currentSubtitleIndex + 1) % this.subtitles.length;
            this.subtitles[this.currentSubtitleIndex].classList.add('active');
        }, 4000);
    }

    startSloganFlicker() {
        const sloganField = document.querySelector('.slogan-field');

        setInterval(() => {
            sloganField.style.opacity = 0;
            setTimeout(() => {
                this.currentSloganIndex = (this.currentSloganIndex + 1) % this.slogans.length;
                sloganField.textContent = this.slogans[this.currentSloganIndex];
                sloganField.style.opacity = 1;
            }, 200);
        }, 5000);
    }

    onScroll() {
        const sections = [
            document.getElementById('architectural-constructs'),
            document.getElementById('genesis-protocol'),
            document.getElementById('digital-sigil'),
            document.getElementById('skills'),
            document.getElementById('projects'),
            document.getElementById('contact')
        ];

        const scrollY = window.scrollY;
        const viewportHeight = window.innerHeight;

        sections.forEach(section => {
            if (!section) return;
            
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollY + viewportHeight * 0.8 > sectionTop && 
                scrollY < sectionTop + sectionHeight * 0.8) {
                section.classList.add('visible');
            } else {
                section.classList.remove('visible');
            }
        });
    }

    init() {
        window.addEventListener('scroll', () => this.onScroll(), false);
        this.startSubtitleCarousel();
        this.startSloganFlicker();
    }
}

export const uiAnimations = new UIAnimations();
