import { audioManager } from './audio/audioManager.js';
import { threeScene } from './three/threeScene.js';
import { uiAnimations } from './animations/uiAnimations.js';

class App {
    constructor() {
        this.preloadOverlay = document.getElementById('preload-overlay');
        this.loadingBar = document.getElementById('loading-bar');
        this.overlay = document.getElementById('overlay');
        this.launchBtn = document.getElementById('launch-portfolio-btn');
        this.soundToggleButton = document.getElementById('sound-toggle-btn');
        this.assetsLoaded = 0;
        this.totalAssets = 4; // Three.js, Audio, Textures, Shaders

        this.initCustomCursor();
    }

    async loadAssets() {
        const loadingPromises = [
            this.loadThreeJsAssets(),
            this.loadAudioAssets(),
            this.loadTextures(),
            this.loadShaders()
        ];

        await Promise.all(loadingPromises);
    }

    updateLoadingProgress(progress) {
        this.assetsLoaded++;
        const totalProgress = (this.assetsLoaded / this.totalAssets) * 100;
        this.loadingBar.style.width = `${totalProgress}%`;
    }

    init() {
        this.setupEventListeners();
        this.startPreload();
    }

    setupEventListeners() {
        this.launchBtn.addEventListener('click', () => this.handleLaunchClick());
        this.soundToggleButton.addEventListener('click', () => this.handleSoundToggle());
    }

    handleLaunchClick() {
        audioManager.playClickSound();
        this.launchBtn.style.transition = 'all 0.2s ease-out';
        this.launchBtn.style.transform = 'scale(0.8)';
        this.launchBtn.style.opacity = 0;
        setTimeout(() => {
            window.location.href = 'https://portfolio.qntmai.space';
        }, 300);
    }

    handleSoundToggle() {
        const soundOn = audioManager.toggleSound();
        this.soundToggleButton.classList.toggle('off', !soundOn);
        this.soundToggleButton.innerHTML = soundOn ? '&#x1F50A;' : '&#x1F507;';
    }

    startPreload() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 10;
            if (progress > 100) progress = 100;
            this.loadingBar.style.width = progress + '%';

            if (progress === 100) {
                clearInterval(interval);
                setTimeout(() => {
                    this.preloadOverlay.style.opacity = 0;
                    setTimeout(() => {
                        this.preloadOverlay.style.display = 'none';
                        this.overlay.style.opacity = 1;
                        
                        // Initialize all components
                        threeScene.init();
                        threeScene.animate();
                        uiAnimations.init();
                        audioManager.init();
                    }, 1000);
                }, 500);
            }
        }, 100);
    }

    initCustomCursor() {
        // Create cursor element
        const cursor = document.createElement('div');
        cursor.className = 'custom-cursor';
        document.body.appendChild(cursor);

        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            cursor.style.left = e.clientX + 'px';
            cursor.style.top = e.clientY + 'px';
        });

        // Add hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('button, .launch-button, .sound-toggle');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('active'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
        });

        // Hide cursor when it leaves the window
        document.addEventListener('mouseout', (e) => {
            if (e.relatedTarget === null) {
                cursor.style.opacity = '0';
            }
        });

        document.addEventListener('mouseover', () => {
            cursor.style.opacity = '1';
        });
    }
}

// Initialize the application when the window loads
window.onload = () => {
    const app = new App();
    app.init();
};
