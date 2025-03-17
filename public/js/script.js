document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generateBtn');
    const joinBtn = document.getElementById('joinBtn');

    generateBtn.addEventListener('click', () => {
        // Generate unique code logic
        window.location.href = '/generate';
    });

    joinBtn.addEventListener('click', () => {
        // Join room logic
        const roomId = prompt('Enter room code:');
        if (roomId) {
            window.location.href = `/join/${roomId}`;
        }
    });
});