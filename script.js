document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const segmentCount = 20;
    const segments = [];

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    
    let points = new Array(segmentCount).fill(null).map(() => ({ ...mouse }));

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        segment.classList.add('dragon-segment');
        
        if (i === 0) {
            segment.classList.add('dragon-head');
        } else if (i === 7 || i === 14) {
            segment.classList.add('dragon-fins');
        }

        body.appendChild(segment);
        segments.push(segment);
    }

    const easing = 0.15;

    function animate() {
        let leaderX = mouse.x;
        let leaderY = mouse.y;
        let totalDistance = 0;

        points.forEach((point, index) => {
            point.x += (leaderX - point.x) * easing;
            point.y += (leaderY - point.y) * easing;
            
            let distance = Math.sqrt(Math.pow(leaderX - point.x, 2) + Math.pow(leaderY - point.y, 2));
            totalDistance += distance;

            const segment = segments[index];
            segment.style.left = ${point.x - segment.offsetWidth / 2}px;
            segment.style.top = ${point.y - segment.offsetHeight / 2}px;

            leaderX = point.x;
            leaderY = point.y;
        });

        const avgDistance = totalDistance / (segmentCount - 1);
        const isStretched = avgDistance > 15;

        segments.forEach(seg => {
            seg.classList.toggle('dragon-stretched', isStretched);
            seg.classList.toggle('dragon-collapsed', !isStretched);
        });

        requestAnimationFrame(animate);
    }

    animate();
});
