import { audioManager } from '../audio/audioManager.js';

class ThreeScene {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.composer = null;
        this.particles = null;
        this.aiCore = null;
        this.energyConduits = null;
        this.nebula = null;
        this.mouseX = 0;
        this.mouseY = 0;
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;
    }

    init() {
        this.setupScene();
        this.setupLighting();
        this.setupPostProcessing();
        this.createAICore();
        this.createParticleSystem();
        this.createEnergyConduits();
        this.createNebula();
        this.setupEventListeners();
    }

    setupScene() {
        // Scene with fog for depth
        this.scene = new THREE.Scene();
        this.scene.fog = new THREE.Fog(0x000000, 1, 1000);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.z = 5;

        // Renderer setup with transparency and antialiasing
        const canvas = document.getElementById('webgl-canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true, 
            alpha: true,
            powerPreference: "high-performance"
        });
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for better performance
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setClearColor(0x000000, 0);
        this.renderer.shadowMap.enabled = true; // Enable shadows
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    }

    setupLighting() {
        const ambientLight = new THREE.AmbientLight(0x404040, 2);
        this.scene.add(ambientLight);

        const pointLight1 = new THREE.PointLight(0x8a2be2, 5, 50);
        pointLight1.position.set(5, 5, 5);
        this.scene.add(pointLight1);

        const pointLight2 = new THREE.PointLight(0x00ffff, 5, 50);
        pointLight2.position.set(-5, -5, -5);
        this.scene.add(pointLight2);

        const pointLight3 = new THREE.PointLight(0xff00ff, 5, 50);
        pointLight3.position.set(0, 0, 5);
        this.scene.add(pointLight3);
    }

    setupPostProcessing() {
        this.composer = new THREE.EffectComposer(this.renderer);
        this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));

        const bloomPass = new THREE.UnrealBloomPass(
            new THREE.Vector2(window.innerWidth, window.innerHeight),
            1.5, 0.4, 0.85
        );
        bloomPass.threshold = 0;
        bloomPass.strength = 1.5;
        bloomPass.radius = 0.5;
        this.composer.addPass(bloomPass);

        // Add Chromatic Aberration shader
        const chromaticAberrationShader = {
            uniforms: {
                "tDiffuse": { value: null },
                "resolution": { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                "amount": { value: 0.001 }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D tDiffuse;
                uniform vec2 resolution;
                uniform float amount;
                varying vec2 vUv;

                void main() {
                    vec2 uv = vUv;
                    vec4 color = texture2D(tDiffuse, uv);
                    vec4 colorR = texture2D(tDiffuse, uv + vec2(amount, 0.0));
                    vec4 colorG = texture2D(tDiffuse, uv + vec2(-amount, amount));
                    vec4 colorB = texture2D(tDiffuse, uv + vec2(-amount, -amount));

                    gl_FragColor = vec4(colorR.r, colorG.g, colorB.b, color.a);
                }
            `
        };
        this.composer.addPass(new THREE.ShaderPass(chromaticAberrationShader));
    }

    createAICore() {
        // Implementation of AI Core creation
        // ... (rest of the AI Core creation code)
    }

    createParticleSystem() {
        // Implementation of Particle System creation
        // ... (rest of the Particle System creation code)
    }

    createEnergyConduits() {
        // Implementation of Energy Conduits creation
        // ... (rest of the Energy Conduits creation code)
    }

    createNebula() {
        // Implementation of Nebula creation
        // ... (rest of the Nebula creation code)
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const delta = 0.01;

        if (this.aiCore) {
            this.aiCore.rotation.x += delta * 0.1;
            this.aiCore.rotation.y += delta * 0.2;
            this.aiCore.children[0].rotation.z += delta * 0.3;
        }

        if (this.particles) {
            const positions = this.particles.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] -= delta * 0.01;
                if (positions[i + 1] < -10) {
                    positions[i + 1] = 10;
                }
            }
            this.particles.geometry.attributes.position.needsUpdate = true;
        }

        if (this.energyConduits) {
            this.energyConduits.children.forEach((conduit, index) => {
                conduit.material.color.offsetHSL(0.0005 * (index % 2 === 0 ? 1 : -1), 0, 0);
            });
        }

        if (this.nebula && this.nebula.material.uniforms.u_time) {
            this.nebula.material.uniforms.u_time.value += delta;
        }

        if (this.composer) {
            this.composer.render();
        } else if (this.renderer) {
            this.renderer.render(this.scene, this.camera);
        }
    }

    setupEventListeners() {
        document.addEventListener('mousemove', (event) => this.onDocumentMouseMove(event), false);
        window.addEventListener('resize', () => this.onWindowResize(), false);
    }

    onDocumentMouseMove(event) {
        this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

        this.camera.position.x = this.mouseX * 0.5;
        this.camera.position.y = this.mouseY * 0.5;
        this.camera.lookAt(this.scene.position);

        if (this.nebula && this.nebula.material.uniforms.u_mouse) {
            this.nebula.material.uniforms.u_mouse.value.set(
                event.clientX / window.innerWidth,
                1.0 - (event.clientY / window.innerHeight)
            );
        }

        audioManager.playChimeSound();
    }

    onWindowResize() {
        this.windowHalfX = window.innerWidth / 2;
        this.windowHalfY = window.innerHeight / 2;

        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        // Update renderer and composer
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        if (this.composer) {
            this.composer.setSize(window.innerWidth, window.innerHeight);
            // Update all post-processing passes
            this.composer.passes.forEach(pass => {
                if (pass.uniforms && pass.uniforms.resolution) {
                    pass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
                }
            });
        }

        // Force a few frames of rendering after resize
        for (let i = 0; i < 3; i++) {
            this.animate();
        }
    }

    dispose() {
        // Dispose geometries
        this.scene.traverse(object => {
            if (object.geometry) {
                object.geometry.dispose();
            }
            if (object.material) {
                if (Array.isArray(object.material)) {
                    object.material.forEach(material => material.dispose());
                } else {
                    object.material.dispose();
                }
            }
        });

        // Dispose composer and renderer
        if (this.composer) {
            this.composer.passes.forEach(pass => {
                if (pass.dispose) pass.dispose();
            });
        }
        
        this.renderer.dispose();

        // Remove event listeners
        window.removeEventListener('resize', this.onWindowResize.bind(this));
        document.removeEventListener('mousemove', this.onDocumentMouseMove.bind(this));
        window.removeEventListener('scroll', this.onWindowScroll.bind(this));
    }
}

export const threeScene = new ThreeScene();
