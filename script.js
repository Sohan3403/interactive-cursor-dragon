document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const segmentCount = 25;
    const segments = [];

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let points = new Array(segmentCount).fill(null).map(() => ({ ...mouse }));
    
    let hue = 0;

    for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        segment.classList.add('dragon-segment');

        if (i === 0) {
            segment.classList.add('dragon-head');
        } else if (i === 8 || i === 15) {
            segment.classList.add('dragon-fins');
        }
        
        body.appendChild(segment);
        segments.push(segment);
    }

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    const ease = 0.25;

    function animate() {
        hue = (hue + 1) % 360;

        let prevPoint = points[0];
        points[0] = { ...mouse };

        for (let i = 1; i < segmentCount; i++) {
            const point = points[i];
            const dx = prevPoint.x - point.x;
            const dy = prevPoint.y - point.y;
            
            point.x += dx * ease;
            point.y += dy * ease;
            
            prevPoint = point;
        }

        segments.forEach((segment, index) => {
            const point = points[index];
            
            // --- লেজ চিকন করার জন্য নতুন লজিক ---
            const max_size = segment.classList.contains('dragon-head') ? 40 : 30; // মাথার আকার বড়
            const tapering_factor = 0.8; // লেজ কতটা চিকন হবে (0 থেকে 1)
            const size = max_size * (1 - (index / segmentCount) * tapering_factor);
            
            segment.style.width = `${size}px`;
            segment.style.height = `${size}px`;
            
            // ফিল্টার এবং রঙ পরিবর্তন সঠিকভাবে প্রয়োগ করা
            const baseFilter = segment.classList.contains('dragon-head') ? 'blur(12px) drop-shadow(0 0 20px rgba(255, 255, 0, 0.9)) drop-shadow(0 0 30px rgba(255, 255, 0, 0.7))' 
                             : segment.classList.contains('dragon-fins') ? 'blur(10px) drop-shadow(0 0 15px rgba(255, 153, 0, 0.8)) drop-shadow(0 0 25px rgba(255, 153, 0, 0.6))'
                             : 'blur(10px) drop-shadow(0 0 15px rgba(0, 255, 0, 0.8)) drop-shadow(0 0 25px rgba(0, 255, 0, 0.6))';
            
            segment.style.filter = `hue-rotate(${hue}deg) ${baseFilter}`;

            segment.style.transform = `translate(${point.x - size / 2}px, ${point.y - size / 2}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
});
