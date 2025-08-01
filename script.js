// Birthday Animation Website - Enhanced JavaScript

class BirthdayApp {
    constructor() {
        this.candles = document.querySelectorAll('.candle');
        this.candlesLit = new Array(this.candles.length).fill(true);
        this.confettiCanvas = document.getElementById('confetti-canvas');
        this.confettiCtx = this.confettiCanvas.getContext('2d');
        this.confettiParticles = [];
        this.animationId = null;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.startBackgroundAnimations();
        this.startCountdown();
        this.setupAgeDisplay();
        this.animateEntrance();
    }

    setupCanvas() {
        this.confettiCanvas.width = window.innerWidth;
        this.confettiCanvas.height = window.innerHeight;
        
        window.addEventListener('resize', () => {
            this.confettiCanvas.width = window.innerWidth;
            this.confettiCanvas.height = window.innerHeight;
        });
    }

    setupEventListeners() {
        // Candle click events
        this.candles.forEach((candle, index) => {
            candle.addEventListener('click', () => this.blowOutCandle(index));
            
            // Hover effects
            candle.addEventListener('mouseenter', () => {
                if (this.candlesLit[index]) {
                    candle.style.transform = 'scale(1.15) rotate(2deg)';
                }
            });
            
            candle.addEventListener('mouseleave', () => {
                if (this.candlesLit[index]) {
                    candle.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });

        // Control buttons
        document.getElementById('confetti-btn').addEventListener('click', () => {
            this.triggerConfetti();
            this.addButtonClickEffect(event.target);
        });

        document.getElementById('balloons-btn').addEventListener('click', () => {
            this.releaseBalloons();
            this.addButtonClickEffect(event.target);
        });

        document.getElementById('fireworks-btn').addEventListener('click', () => {
            this.triggerFireworks();
            this.addButtonClickEffect(event.target);
        });

        document.getElementById('reset-btn').addEventListener('click', () => {
            this.resetCandles();
            this.addButtonClickEffect(event.target);
        });

        // Age input
        const ageInput = document.getElementById('age-input');
        ageInput.addEventListener('input', () => this.updateAgeDisplay());
    }

    addButtonClickEffect(button) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
            button.style.transform = '';
        }, 150);
    }

    blowOutCandle(index) {
        if (!this.candlesLit[index]) return;

        const candle = this.candles[index];
        const flame = candle.querySelector('.flame');
        
        if (flame) {
            flame.classList.add('blown-out');
            this.candlesLit[index] = false;
            
            // Create smoke effect
            this.createSmokeEffect(candle);
            
            // Add candle shake effect
            candle.style.animation = 'candleShake 0.5s ease-out';
            setTimeout(() => {
                candle.style.animation = '';
            }, 500);

            // Check if all candles are blown out
            if (this.candlesLit.every(lit => !lit)) {
                setTimeout(() => this.celebrateAllCandlesOut(), 1000);
            }
        }
    }

    createSmokeEffect(candle) {
        const smoke = document.createElement('div');
        smoke.className = 'smoke';
        candle.appendChild(smoke);

        setTimeout(() => {
            if (smoke.parentNode) {
                smoke.remove();
            }
        }, 3000);
    }

    celebrateAllCandlesOut() {
        // Cake celebration animation
        const cake = document.querySelector('.cake');
        if (cake) {
            cake.classList.add('celebration');
            setTimeout(() => cake.classList.remove('celebration'), 2000);
        }

        // Show congratulations message
        this.showCongratulationsMessage();

        // Trigger automatic effects
        setTimeout(() => this.triggerConfetti(), 500);
        setTimeout(() => this.releaseBalloons(), 1000);
        setTimeout(() => this.triggerFireworks(), 1500);
    }

    showCongratulationsMessage() {
        const messages = [
            '🎉 Amazing! Your wish will come true! 🌟',
            '🎊 Happy Birthday ERIS 🎈',
            '✨ Perfect! Time to party! 🎉',
            '🌟 Wonderful! Best birthday ever! 🎂'
        ];
        
        const message = document.createElement('div');
        message.className = 'congratulations';
        message.innerHTML = messages[1];    // Math.floor(Math.random() * messages.length)
        
        document.body.appendChild(message);

        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }

    resetCandles() {
        this.candles.forEach((candle, index) => {
            const flame = candle.querySelector('.flame');
            if (flame) {
                flame.classList.remove('blown-out');
                this.candlesLit[index] = true;
            }
            
            // Remove smoke effects
            const smoke = candle.querySelector('.smoke');
            if (smoke) {
                smoke.remove();
            }
        });

        // Reset cake
        const cake = document.querySelector('.cake');
        if (cake) {
            cake.classList.remove('celebration');
        }

        // Add reset animation
        this.candles.forEach((candle, index) => {
            setTimeout(() => {
                candle.style.animation = 'candleRelight 0.8s ease-out';
                setTimeout(() => {
                    candle.style.animation = '';
                }, 800);
            }, index * 100);
        });
    }

    triggerConfetti() {
        const colors = ['#FF1493', '#FFD700', '#8A2BE2', '#00BFFF', '#FF6347', '#32CD32'];
        const particleCount = 200;

        for (let i = 0; i < particleCount; i++) {
            this.confettiParticles.push({
                x: Math.random() * this.confettiCanvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 15,
                vy: Math.random() * 5 + 3,
                color: colors[Math.floor(Math.random() * colors.length)],
                shape: Math.random() > 0.5 ? 'square' : 'circle',
                rotation: Math.random() * 360,
                rotationSpeed: (Math.random() - 0.5) * 15,
                size: Math.random() * 10 + 5,
                gravity: 0.15 + Math.random() * 0.1,
                life: 1.0,
                decay: Math.random() * 0.02 + 0.01
            });
        }

        this.animateConfetti();
    }

    animateConfetti() {
        this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);

        for (let i = this.confettiParticles.length - 1; i >= 0; i--) {
            const particle = this.confettiParticles[i];

            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vy += particle.gravity;
            particle.rotation += particle.rotationSpeed;
            particle.life -= particle.decay;

            // Air resistance
            particle.vx *= 0.99;
            particle.vy *= 0.99;

            // Draw particle
            this.confettiCtx.save();
            this.confettiCtx.translate(particle.x, particle.y);
            this.confettiCtx.rotate((particle.rotation * Math.PI) / 180);
            this.confettiCtx.globalAlpha = particle.life;
            this.confettiCtx.fillStyle = particle.color;

            if (particle.shape === 'square') {
                this.confettiCtx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
            } else {
                this.confettiCtx.beginPath();
                this.confettiCtx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
                this.confettiCtx.fill();
            }

            this.confettiCtx.restore();

            // Remove dead particles
            if (particle.life <= 0 || particle.y > this.confettiCanvas.height + 100) {
                this.confettiParticles.splice(i, 1);
            }
        }

        if (this.confettiParticles.length > 0) {
            this.animationId = requestAnimationFrame(() => this.animateConfetti());
        }
    }

    releaseBalloons() {
        const balloonsContainer = document.getElementById('balloons-container');
        const colors = ['#FF1493', '#FFD700', '#8A2BE2', '#00BFFF', '#FF6347', '#32CD32', '#FF69B4'];
        
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const balloon = document.createElement('div');
                balloon.className = 'balloon';
                balloon.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                balloon.style.left = Math.random() * 100 + '%';
                balloon.style.animationDuration = (6 + Math.random() * 4) + 's';
                balloon.style.animationDelay = Math.random() * 2 + 's';
                
                balloonsContainer.appendChild(balloon);

                // Remove balloon after animation
                setTimeout(() => {
                    if (balloon.parentNode) {
                        balloon.remove();
                    }
                }, 10000);
            }, i * 200);
        }
    }

    triggerFireworks() {
        const fireworksContainer = document.getElementById('fireworks-container');
        const colors = ['#FF1493', '#FFD700', '#8A2BE2', '#00BFFF', '#FF6347', '#32CD32'];
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const firework = document.createElement('div');
                firework.className = 'firework';
                firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
                firework.style.left = Math.random() * 100 + '%';
                firework.style.top = Math.random() * 50 + '%';
                firework.style.boxShadow = `0 0 20px ${colors[Math.floor(Math.random() * colors.length)]}`;
                
                fireworksContainer.appendChild(firework);

                // Remove firework after animation
                setTimeout(() => {
                    if (firework.parentNode) {
                        firework.remove();
                    }
                }, 2000);
            }, i * 300);
        }
    }

    startBackgroundAnimations() {
        // Create floating stars
        this.createStars();
        
        // Create floating hearts
        this.createFloatingHearts();
        
        // Animate message bubbles
        this.animateMessages();
    }

    createStars() {
        const starsContainer = document.querySelector('.stars');
        const starSymbols = ['✨', '⭐', '🌟', '💫'];
        
        for (let i = 0; i < 30; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            star.innerHTML = starSymbols[Math.floor(Math.random() * starSymbols.length)];
            star.style.left = Math.random() * 100 + '%';
            star.style.top = Math.random() * 100 + '%';
            star.style.animationDelay = Math.random() * 3 + 's';
            star.style.animationDuration = (2 + Math.random() * 2) + 's';
            
            starsContainer.appendChild(star);
        }
    }

    createFloatingHearts() {
        const heartsContainer = document.querySelector('.floating-hearts');
        const heartSymbols = ['💖', '💕', '💗', '💝', '💘'];
        
        setInterval(() => {
            if (Math.random() < 0.3) {
                const heart = document.createElement('div');
                heart.className = 'heart';
                heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
                heart.style.left = Math.random() * 100 + '%';
                heart.style.animationDuration = (10 + Math.random() * 5) + 's';
                
                heartsContainer.appendChild(heart);

                setTimeout(() => {
                    if (heart.parentNode) {
                        heart.remove();
                    }
                }, 15000);
            }
        }, 2000);
    }

    animateMessages() {
        const messages = document.querySelectorAll('.message-bubble');
        messages.forEach((message, index) => {
            message.style.animationDelay = (index * 2) + 's';
        });
    }

    startCountdown() {
        const updateCountdown = () => {
            const now = new Date();
            const nextBirthday = new Date(now.getFullYear() + 1, 0, 0); // Next New Year as example
            const timeDiff = nextBirthday - now;

            const hours = Math.floor(timeDiff / (1000 * 60 * 60)) % 24;
            const minutes = Math.floor(timeDiff / (1000 * 60)) % 60;
            const seconds = Math.floor(timeDiff / 1000) % 60;

            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
        };

        updateCountdown();
        setInterval(updateCountdown, 1000);
    }

    setupAgeDisplay() {
        const ageInput = document.getElementById('age-input');
        this.updateAgeDisplay();
        
        ageInput.addEventListener('change', () => {
            this.updateAgeDisplay();
        });
    }

    updateAgeDisplay() {
        const ageInput = document.getElementById('age-input');
        const ageDisplay = document.getElementById('age-display');
        const ageCelebration = document.getElementById('age-celebration');
        
        const age = parseInt(ageInput.value) || 25;
        ageDisplay.textContent = age;

        // Age-specific celebrations
        let celebration = '';
        if (age <= 10) {
            celebration = '🧸 What a special little star! 🌈✨';
        } else if (age <= 18) {
            celebration = '🎒 Growing up so wonderfully! 🌟🎓';
        } else if (age <= 30) {
            celebration = '🎯 Living your amazing life! ✨🚀';
        } else if (age <= 50) {
            celebration = '🏆 Wisdom and wonderful experiences! 🎊👑';
        } else {
            celebration = '👑 A true treasure and inspiration! 💎🌟';
        }

        // Milestone celebrations
        if (age % 10 === 0) {
            celebration += `<br><strong>🎉 MILESTONE BIRTHDAY! ${age} years of pure awesome! 🎉</strong>`;
        }

        ageCelebration.innerHTML = celebration;
        
        // Add celebration animation
        ageCelebration.style.animation = 'none';
        setTimeout(() => {
            ageCelebration.style.animation = 'celebrationBounce 2s ease-in-out infinite';
        }, 10);
    }

    animateEntrance() {
        // Stagger entrance animations
        const elements = [
            '.header',
            '.cake-section',
            '.controls-section',
            '.age-section',
            '.messages-section',
            '.countdown-section'
        ];

        elements.forEach((selector, index) => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.opacity = '0';
                element.style.transform = 'translateY(50px)';
                
                setTimeout(() => {
                    element.style.transition = 'all 0.8s ease-out';
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';
                }, index * 200);
            }
        });
    }
}

// Add custom CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes candleShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-2px); }
        75% { transform: translateX(2px); }
    }
    
    @keyframes candleRelight {
        0% { transform: scale(1); }
        50% { transform: scale(1.1); }
        100% { transform: scale(1); }
    }
    
    @keyframes slideInDown {
        0% {
            transform: translateY(-100px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BirthdayApp();
});

// Add some fun keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key.toLowerCase()) {
        case 'c':
            document.getElementById('confetti-btn').click();
            break;
        case 'b':
            document.getElementById('balloons-btn').click();
            break;
        case 'f':
            document.getElementById('fireworks-btn').click();
            break;
        case 'r':
            document.getElementById('reset-btn').click();
            break;
    }
});