const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const successPopup = document.getElementById('successPopup');
const confettiContainer = document.getElementById('confettiContainer');

// Check if device is mobile
const isMobileDevice = () => {
    // Check user agent
    const userAgentCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    // Check viewport width (for DevTools mobile emulation)
    const viewportCheck = window.innerWidth <= 768;
    return userAgentCheck || viewportCheck;
};

// Array of fun evasion messages
const funMessages = [
    "Not so fast!",
    "You'll never get me!",
    "Nope, try again!",
    "I'm too quick!",
    "Come on, say yes!",
    "Get the hint?",
    "Nice try!"
];

let messageIndex = 0;

// Make the No button float away from cursor on desktop
document.addEventListener('mousemove', (e) => {
    // Skip on mobile devices
    if (isMobileDevice()) return;

    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const noBtnRect = noBtn.getBoundingClientRect();
    const noBtnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const noBtnCenterY = noBtnRect.top + noBtnRect.height / 2;

    const mouseX = e.clientX;
    const mouseY = e.clientY;

    const distance = Math.hypot(mouseX - noBtnCenterX, mouseY - noBtnCenterY);

    // If cursor is within 120px of the button, make it float away
    if (distance < 120) {
        const angle = Math.atan2(noBtnCenterY - mouseY, noBtnCenterX - mouseX);
        
        // Calculate movement distance relative to container size
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        const moveDistance = Math.min(containerWidth, containerHeight) * 0.2; // 20% of smaller dimension
        
        // Calculate new position relative to button's current position
        let newX = noBtnCenterX + Math.cos(angle) * moveDistance;
        let newY = noBtnCenterY + Math.sin(angle) * moveDistance;

        // Constrain to stay within container
        const btnWidth = noBtnRect.width;
        const btnHeight = noBtnRect.height;
        const containerLeft = containerRect.left;
        const containerRight = containerRect.right;
        const containerTop = containerRect.top;
        const containerBottom = containerRect.bottom;

        newX = Math.max(containerLeft + 10, Math.min(newX, containerRight - btnWidth - 10));
        newY = Math.max(containerTop + 10, Math.min(newY, containerBottom - btnHeight - 10));

        // Convert back to transform-relative coordinates
        const translateX = newX - (noBtnRect.left + noBtnRect.width / 2);
        const translateY = newY - (noBtnRect.top + noBtnRect.height / 2);

        noBtn.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${Math.random() * 20 - 10}deg)`;
        noBtn.style.transition = 'transform 0.1s ease-out';
    }
});

// Make the No button float away from touch on mobile
document.addEventListener('touchmove', (e) => {
    if (!isMobileDevice()) return;
    
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const noBtnRect = noBtn.getBoundingClientRect();
    const noBtnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const noBtnCenterY = noBtnRect.top + noBtnRect.height / 2;

    const touchX = touch.clientX;
    const touchY = touch.clientY;

    const distance = Math.hypot(touchX - noBtnCenterX, touchY - noBtnCenterY);

    // If finger is within ~180px of the button, make it sprint farther and faster
    if (distance < 180) {
        const angle = Math.atan2(noBtnCenterY - touchY, noBtnCenterX - touchX);
        
        // Calculate movement distance relative to container size (bigger on mobile)
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        // increase to ~60% of smaller dimension for a big jump
        const moveDistance = Math.min(containerWidth, containerHeight) * 0.6;
        
        // Add a small random multiplier so it sometimes jumps further
        const randomBoost = 0.8 + Math.random() * 0.8;
        
        // Calculate new position relative to button's current position
        let newX = noBtnCenterX + Math.cos(angle) * moveDistance * randomBoost;
        let newY = noBtnCenterY + Math.sin(angle) * moveDistance * randomBoost;

        // Constrain to stay within container
        const btnWidth = noBtnRect.width;
        const btnHeight = noBtnRect.height;
        const containerLeft = containerRect.left;
        const containerRight = containerRect.right;
        const containerTop = containerRect.top;
        const containerBottom = containerRect.bottom;

        newX = Math.max(containerLeft + 6, Math.min(newX, containerRight - btnWidth - 6));
        newY = Math.max(containerTop + 6, Math.min(newY, containerBottom - btnHeight - 6));

        // Convert back to transform-relative coordinates
        const translateX = newX - (noBtnRect.left + noBtnRect.width / 2);
        const translateY = newY - (noBtnRect.top + noBtnRect.height / 2);

        noBtn.style.willChange = 'transform';
        noBtn.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${Math.random() * 40 - 20}deg)`;
        // much quicker transition to feel snappier on phones
        noBtn.style.transition = 'transform 0.05s cubic-bezier(0.2,0.8,0.2,1)';
        
        // Show fun message on mobile
        showFloatingMessage();
    }
}, { passive: true });

// Prevent clicking the No button
noBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Show fun evasion message (optional)
    showFloatingMessage();
    
    return false;
});

// Disable context menu on No button
noBtn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    return false;
});

// Add touch support for mobile (fine-grained movement on direct touch)
noBtn.addEventListener('touchmove', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const noBtnRect = noBtn.getBoundingClientRect();
    const noBtnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const noBtnCenterY = noBtnRect.top + noBtnRect.height / 2;

    const touchX = touch.clientX;
    const touchY = touch.clientY;

    const distance = Math.hypot(touchX - noBtnCenterX, touchY - noBtnCenterY);

    // Trigger earlier and jump farther on phones
    if (distance < 220) {
        const angle = Math.atan2(noBtnCenterY - touchY, noBtnCenterX - touchX);
        const containerWidth = containerRect.width;
        const containerHeight = containerRect.height;
        const moveDistance = Math.min(containerWidth, containerHeight) * 0.6;
        const randomBoost = 0.6 + Math.random() * 1.0;
        
        let newX = noBtnCenterX + Math.cos(angle) * moveDistance * randomBoost;
        let newY = noBtnCenterY + Math.sin(angle) * moveDistance * randomBoost;

        // Constrain to stay within container
        const btnWidth = noBtnRect.width;
        const btnHeight = noBtnRect.height;
        const containerLeft = containerRect.left;
        const containerRight = containerRect.right;
        const containerTop = containerRect.top;
        const containerBottom = containerRect.bottom;

        newX = Math.max(containerLeft + 6, Math.min(newX, containerRight - btnWidth - 6));
        newY = Math.max(containerTop + 6, Math.min(newY, containerBottom - btnHeight - 6));

        const translateX = newX - (noBtnRect.left + noBtnRect.width / 2);
        const translateY = newY - (noBtnRect.top + noBtnRect.height / 2);

        noBtn.style.willChange = 'transform';
        noBtn.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${Math.random() * 40 - 20}deg)`;
        noBtn.style.transition = 'transform 0.05s cubic-bezier(0.2,0.8,0.2,1)';
    }
    
    return false;
}, { passive: false });

// Add touch support - trigger on any touch attempt
noBtn.addEventListener('touchstart', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const container = document.querySelector('.container');
    const containerRect = container.getBoundingClientRect();
    const touch = e.touches[0];
    const noBtnRect = noBtn.getBoundingClientRect();
    const noBtnCenterX = noBtnRect.left + noBtnRect.width / 2;
    const noBtnCenterY = noBtnRect.top + noBtnRect.height / 2;

    const touchX = touch.clientX;
    const touchY = touch.clientY;

    const angle = Math.atan2(noBtnCenterY - touchY, noBtnCenterX - touchX);
    
    // Calculate movement distance relative to container size (bigger jump on phones)
    const containerWidth = containerRect.width;
    const containerHeight = containerRect.height;
    const moveDistance = Math.min(containerWidth, containerHeight) * 0.6;
    
    // Calculate new position
    let newX = noBtnCenterX + Math.cos(angle) * moveDistance;
    let newY = noBtnCenterY + Math.sin(angle) * moveDistance;

    // Constrain to stay within container
    const btnWidth = noBtnRect.width;
    const btnHeight = noBtnRect.height;
    const containerLeft = containerRect.left;
    const containerRight = containerRect.right;
    const containerTop = containerRect.top;
    const containerBottom = containerRect.bottom;

    newX = Math.max(containerLeft + 10, Math.min(newX, containerRight - btnWidth - 10));
    newY = Math.max(containerTop + 10, Math.min(newY, containerBottom - btnHeight - 10));

    // Convert back to transform-relative coordinates
    const translateX = newX - (noBtnRect.left + noBtnRect.width / 2);
    const translateY = newY - (noBtnRect.top + noBtnRect.height / 2);

    noBtn.style.transform = `translate(${translateX}px, ${translateY}px) rotate(${Math.random() * 20 - 10}deg)`;
    noBtn.style.transition = 'transform 0.1s ease-out';
    
    // Show fun message
    showFloatingMessage();
    
    return false;
}, { passive: false });

// Function to show floating messages (optional visual feedback)
function showFloatingMessage() {
    const message = funMessages[messageIndex % funMessages.length];
    messageIndex++;
    
    const floatingDiv = document.createElement('div');
    floatingDiv.textContent = message;
    floatingDiv.style.position = 'fixed';
    floatingDiv.style.left = Math.random() * (window.innerWidth - 200) + 'px';
    floatingDiv.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    floatingDiv.style.fontSize = '1.2rem';
    floatingDiv.style.fontWeight = 'bold';
    floatingDiv.style.color = '#f093fb';
    floatingDiv.style.zIndex = '50';
    floatingDiv.style.animation = 'floatMessage 2s ease-out forwards';
    floatingDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.2)';
    
    document.body.appendChild(floatingDiv);
    
    setTimeout(() => floatingDiv.remove(), 2000);
}

// Add animation for floating messages
const style = document.createElement('style');
style.textContent = `
    @keyframes floatMessage {
        0% {
            opacity: 1;
            transform: translateY(0) scale(1);
        }
        100% {
            opacity: 0;
            transform: translateY(-100px) scale(1.2);
        }
    }
`;
document.head.appendChild(style);

// Yes button functionality
yesBtn.addEventListener('click', () => {
    showSuccessPopup();
    createConfetti();
});

// Show success popup with celebration
function showSuccessPopup() {
    successPopup.classList.add('show');
    
    // Trigger animations
    setTimeout(() => {
        playSuccessSound();
    }, 300);
}

// Create confetti falling animation
function createConfetti() {
    const confettiPieces = 60;
    const colors = ['#ff6b9d', '#c06c84', '#6c5b7b', '#ff8fa3', '#f5576c', '#ffd6e8', '#ffb3d9'];
    
    for (let i = 0; i < confettiPieces; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 15 + 5 + 'px';
        confetti.style.height = Math.random() * 15 + 5 + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animationDelay = Math.random() * 0.5 + 's';
        confetti.style.animationDuration = Math.random() * 2 + 2.5 + 's';
        
        confettiContainer.appendChild(confetti);
    }
}

// Optional: Play a success sound (using Web Audio API)
function playSuccessSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create a simple success melody
        const notes = [523, 659, 784]; // C5, E5, G5
        let currentNote = 0;
        
        function playNote(frequency, duration) {
            const osc = audioContext.createOscillator();
            const gain = audioContext.createGain();
            
            osc.connect(gain);
            gain.connect(audioContext.destination);
            
            osc.frequency.value = frequency;
            osc.type = 'sine';
            
            gain.gain.setValueAtTime(0.3, audioContext.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            osc.start(audioContext.currentTime);
            osc.stop(audioContext.currentTime + duration);
        }
        
        notes.forEach((freq, index) => {
            setTimeout(() => {
                playNote(freq, 0.2);
            }, index * 150);
        });
    } catch (e) {
        // Fallback if audio context fails - silent success is still a success!
        console.log('Success! 🎉');
    }
}

// Add some initial interactivity hints
window.addEventListener('load', () => {
    // Add a subtle pulse to the Yes button
    setTimeout(() => {
        yesBtn.style.animation = 'none';
        setTimeout(() => {
            yesBtn.style.animation = '';
        }, 10);
    }, 2000);
});
