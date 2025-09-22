class FlowerAnimation {
    constructor() {
        this.container = document.getElementById('flowers-container');
        this.flowerTypes = ['type1', 'type2', 'type3', 'type4', 'type5', 'type6'];
        this.animationTypes = ['anim1', 'anim2', 'anim3'];
        this.isMobile = this.detectMobile();
        this.isLowPowerMode = this.detectLowPowerMode();
        this.init();
    }

    detectMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
               || window.innerWidth < 768;
    }

    detectLowPowerMode() {
        // Detectar dispositivos con menor capacidad de procesamiento
        return navigator.hardwareConcurrency <= 2 || 
               /Android.*Version\/[0-4]|iPhone.*OS [0-9]_/i.test(navigator.userAgent);
    }

    init() {
        this.createInitialFlowers();
        this.startContinuousGeneration();
        if (!this.isLowPowerMode) {
            this.createSparkles();
        }
    }

    createInitialFlowers() {
        // Ajustar número inicial de flores según el dispositivo
        const initialCount = this.isMobile ? 8 : 15;
        const delay = this.isMobile ? 500 : 300;
        
        for (let i = 0; i < initialCount; i++) {
            setTimeout(() => {
                this.createFlower();
            }, i * delay);
        }
    }

    createFlower() {
        const flower = document.createElement('div');
        flower.className = 'flower';
        
        // Seleccionar tipo de flor aleatorio
        const flowerType = this.flowerTypes[Math.floor(Math.random() * this.flowerTypes.length)];
        const animationType = this.animationTypes[Math.floor(Math.random() * this.animationTypes.length)];
        
        flower.classList.add(flowerType, animationType);
        
        // Posición inicial aleatoria en el eje X
        const startX = Math.random() * (window.innerWidth - 60);
        flower.style.left = startX + 'px';
        
        // Tamaño aleatorio
        const scale = 0.7 + Math.random() * 0.6; // Entre 0.7 y 1.3
        flower.style.transform = `scale(${scale})`;
        
        // Duración de animación aleatoria
        const duration = 8 + Math.random() * 6; // Entre 8 y 14 segundos
        flower.style.animationDuration = `${duration}s, ${2 + Math.random() * 3}s`;
        
        // Retraso aleatorio
        const delay = Math.random() * 2;
        flower.style.animationDelay = `${delay}s`;
        
        this.container.appendChild(flower);
        
        // Eliminar la flor después de la animación
        setTimeout(() => {
            if (flower.parentNode) {
                flower.parentNode.removeChild(flower);
            }
        }, (duration + delay + 1) * 1000);
    }

    createSparkle() {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        // Posición aleatoria
        const startX = Math.random() * window.innerWidth;
        sparkle.style.left = startX + 'px';
        
        // Duración aleatoria
        const duration = 2 + Math.random() * 4;
        sparkle.style.animationDuration = `${duration}s`;
        
        this.container.appendChild(sparkle);
        
        // Eliminar después de la animación
        setTimeout(() => {
            if (sparkle.parentNode) {
                sparkle.parentNode.removeChild(sparkle);
            }
        }, duration * 1000);
    }

    createSparkles() {
        // Crear partículas brillantes solo si no es dispositivo móvil
        if (this.isMobile || this.isLowPowerMode) return;
        
        setInterval(() => {
            if (Math.random() < 0.2) { // Reducir probabilidad
                this.createSparkle();
            }
        }, 800);
    }

    startContinuousGeneration() {
        // Ajustar frecuencia de generación según el dispositivo
        const interval = this.isMobile ? 2000 : 1000;
        const probability = this.isMobile ? 0.5 : 0.7;
        
        setInterval(() => {
            if (Math.random() < probability) {
                this.createFlower();
            }
        }, interval);
    }

    // Método para ajustar la intensidad de la animación
    setIntensity(level) {
        // level: 'low', 'medium', 'high'
        const intervals = {
            low: 2000,
            medium: 1000,
            high: 500
        };
        
        // Limpiar el intervalo actual y crear uno nuevo
        if (this.generationInterval) {
            clearInterval(this.generationInterval);
        }
        
        this.generationInterval = setInterval(() => {
            if (Math.random() < 0.7) {
                this.createFlower();
            }
        }, intervals[level] || intervals.medium);
    }
}

// Clase para efectos adicionales
class BackgroundEffects {
    constructor() {
        this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
                       || window.innerWidth < 768;
        this.init();
    }

    init() {
        if (!this.isMobile) {
            this.createGradientShift();
        }
        this.addInteractiveEffects();
    }

    createGradientShift() {
        // Cambio gradual del color de fondo solo en escritorio
        let hue = 220; // Comenzar con un azul suave
        setInterval(() => {
            hue += 0.3; // Más lento para mejor rendimiento
            if (hue >= 280) hue = 220; // Ciclo más corto
            
            document.body.style.background = `linear-gradient(135deg, 
                hsl(${hue}, 60%, 70%) 0%, 
                hsl(${(hue + 40) % 360}, 60%, 65%) 100%)`;
        }, 200); // Menos frecuente
    }

    addInteractiveEffects() {
        // Efecto de click optimizado para dispositivos táctiles
        document.addEventListener(this.isMobile ? 'touchstart' : 'click', (e) => {
            const clientX = this.isMobile ? e.touches[0].clientX : e.clientX;
            const clientY = this.isMobile ? e.touches[0].clientY : e.clientY;
            this.createClickEffect(clientX, clientY);
        });

        // Efecto de movimiento solo en escritorio
        if (!this.isMobile) {
            let lastMove = 0;
            document.addEventListener('mousemove', (e) => {
                const now = Date.now();
                if (now - lastMove > 100) { // Throttle para mejor performance
                    this.createMouseTrail(e.clientX, e.clientY);
                    lastMove = now;
                }
            });
        }
    }

    createClickEffect(x, y) {
        const flowerCount = this.isMobile ? 3 : 5; // Menos flores en móviles
        
        for (let i = 0; i < flowerCount; i++) {
            const flower = document.createElement('div');
            flower.className = 'flower type' + (Math.floor(Math.random() * 6) + 1);
            flower.style.position = 'fixed';
            flower.style.left = (x - 15) + 'px';
            flower.style.top = (y - 15) + 'px';
            flower.style.pointerEvents = 'none';
            flower.style.zIndex = '1000';
            
            const angle = (i / flowerCount) * Math.PI * 2;
            const distance = 30 + Math.random() * 30; // Distancia más corta
            const endX = x + Math.cos(angle) * distance;
            const endY = y + Math.sin(angle) * distance;
            
            flower.style.animation = `click-burst 0.8s ease-out forwards`; // Más rápido
            
            // Crear animación personalizada para este efecto
            if (!document.getElementById('click-burst-style')) {
                const style = document.createElement('style');
                style.id = 'click-burst-style';
                style.textContent = `
                    @keyframes click-burst {
                        0% {
                            transform: scale(0) rotate(0deg);
                            opacity: 1;
                        }
                        100% {
                            transform: scale(1.2) rotate(180deg) translate(${endX - x}px, ${endY - y}px);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(flower);
            
            setTimeout(() => {
                if (flower.parentNode) {
                    flower.parentNode.removeChild(flower);
                }
            }, 800);
        }
    }

    createMouseTrail(x, y) {
        if (Math.random() < 0.05) { // 5% de probabilidad
            const trail = document.createElement('div');
            trail.style.position = 'fixed';
            trail.style.left = x + 'px';
            trail.style.top = y + 'px';
            trail.style.width = '3px';
            trail.style.height = '3px';
            trail.style.backgroundColor = 'rgba(255, 255, 255, 0.6)';
            trail.style.borderRadius = '50%';
            trail.style.pointerEvents = 'none';
            trail.style.zIndex = '999';
            trail.style.animation = 'fade-out 1s ease-out forwards';
            
            const style = document.createElement('style');
            style.textContent = `
                @keyframes fade-out {
                    0% {
                        opacity: 1;
                        transform: scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0);
                    }
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(trail);
            
            setTimeout(() => {
                if (trail.parentNode) {
                    trail.parentNode.removeChild(trail);
                }
                if (style.parentNode) {
                    style.parentNode.removeChild(style);
                }
            }, 1000);
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const flowerAnimation = new FlowerAnimation();
    const backgroundEffects = new BackgroundEffects();
    
    // Agregar controles opcionales (comentado por defecto)
    // const controls = document.createElement('div');
    // controls.style.position = 'fixed';
    // controls.style.top = '10px';
    // controls.style.right = '10px';
    // controls.style.zIndex = '1000';
    // controls.innerHTML = `
    //     <button onclick="flowerAnimation.setIntensity('low')">Suave</button>
    //     <button onclick="flowerAnimation.setIntensity('medium')">Medio</button>
    //     <button onclick="flowerAnimation.setIntensity('high')">Intenso</button>
    // `;
    // document.body.appendChild(controls);
    
    // Hacer las instancias globales para acceso desde controles
    window.flowerAnimation = flowerAnimation;
    window.backgroundEffects = backgroundEffects;
});