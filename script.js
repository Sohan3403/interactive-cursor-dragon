document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const segmentCount = 20;
    const segments = [];

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let points = new Array(segmentCount).fill(null).map(() => ({...mouse}));

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

    const ease = 0.15;

    function animate() {
        let prevPoint = points[0];

        points[0] = {...mouse};

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
            segment.style.transform = `translate(${point.x - 15}px, ${point.y - 15}px)`;
        });

        requestAnimationFrame(animate);
    }

    animate();
});
