
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const segmentCount = 20; // ড্রাগনের মোট অংশের সংখ্যা
    const segments = []; // ড্রাগনের DOM elements গুলো এখানে থাকবে

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let points = new Array(segmentCount).fill(null).map(() => ({ ...mouse }));

    // মাউসের শেষ অবস্থান ট্র্যাক করার জন্য
    let lastMouseX = mouse.x;
    let lastMouseY = mouse.y;
    let mouseSpeed = 0; // মাউসের গতি
    let lastUpdateTime = performance.now(); // শেষ আপডেটের সময়

    let hue = 0; // বর্তমান হিউ ভ্যালু
    const hueSpeed = 0.5; // হিউ পরিবর্তনের গতি

    window.addEventListener('mousemove', (event) => {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastUpdateTime;

        // মাউসের গতি হিসাব করা
        const dx = event.clientX - mouse.x;
        const dy = event.clientY - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        mouseSpeed = distance / deltaTime; // পিক্সেল প্রতি মিলিসেকেন্ড

        mouse.x = event.clientX;
        mouse.y = event.clientY;
        lastUpdateTime = currentTime;
    });

    for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        segment.classList.add('dragon-segment');

        if (i === 0) {
            segment.classList.add('dragon-head');
        } else if (i === 7 || i === 14) { // পাখনার জন্য দুটি ভিন্ন অবস্থান
            segment.classList.add('dragon-fins');
        }

        body.appendChild(segment);
        segments.push(segment);
    }

    const ease = 0.15; // স্মুথ ফলো করার জন্য ইজিং ফ্যাক্টর

    function animate() {
        const currentTime = performance.now();
        const deltaTime = currentTime - lastUpdateTime;
        lastUpdateTime = currentTime;

        // হিউ ভ্যালু পরিবর্তন করা
        hue = (hue + hueSpeed) % 360;

        // মাউসের শেষ অবস্থান থেকে বর্তমান অবস্থান পর্যন্ত দূরত্ব হিসাব করা
        const totalDistance = Math.sqrt(
            Math.pow(mouse.x - lastMouseX, 2) +
            Math.pow(mouse.y - lastMouseY, 2)
        );
        lastMouseX = mouse.x;
        lastMouseY = mouse.y;

        // ড্রাগনের স্ট্রেচিং এবং কলাপ্সিং এর লজিক
        const isStretched = totalDistance > 10; // যদি দ্রুত নড়ে
        const isCollapsed = totalDistance < 1 && mouseSpeed < 0.1; // যদি স্থির থাকে

        let prevPoint = points[0];

        // প্রথম সেগমেন্ট মাউসকে সরাসরি অনুসরণ করবে
        points[0] = { ...mouse };

        // বাকি সেগমেন্টগুলো আগের সেগমেন্টকে অনুসরণ করবে
        for (let i = 1; i < segmentCount; i++) {
            const point = points[i];
            const dx = prevPoint.x - point.x;
            const dy = prevPoint.y - point.y;

            // angle calculation for rotation (optional, but good for realistic movement)
            // const angle = Math.atan2(dy, dx);

            point.x += dx * ease;
            point.y += dy * ease;

            prevPoint = point;
        }

        segments.forEach((segment, index) => {
            const point = points[index];

            // প্রতিটি সেগমেন্টের স্টাইল আপডেট করা
            segment.style.transform = `translate(${point.x - (segment.offsetWidth / 2)}px, ${point.y - (segment.offsetHeight / 2)}px)`;
            segment.style.filter = `hue-rotate(${hue}deg) ${segment.style.filter.split(') ').slice(1).join(') ')}`; // Hue rotation যোগ করা

            // স্ট্রেচিং এবং কলাপ্সিং ক্লাস যোগ/বাদ দেওয়া
            if (index !== 0) { // মাথা ছাড়া বাকি অংশগুলো প্রভাবিত হবে
                if (isStretched) {
                    segment.classList.add('dragon-stretched');
                    segment.classList.remove('dragon-collapsed');
                } else if (isCollapsed) {
                    segment.classList.add('dragon-collapsed');
                    segment.classList.remove('dragon-stretched');
                } else {
                    segment.classList.remove('dragon-stretched', 'dragon-collapsed');
                }
            }
        });

        requestAnimationFrame(animate); // পরের ফ্রেমের জন্য অ্যানিমেশন কল করা
    }

    animate(); // অ্যানিমেশন শুরু করা
});
