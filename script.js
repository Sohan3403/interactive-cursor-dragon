document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const segmentCount = 25; // সেগমেন্ট সংখ্যা বাড়িয়েছি
    const segments = [];

    let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    let points = new Array(segmentCount).fill(null).map(() => ({ ...mouse }));
    let lastMousePosition = { ...mouse };
    
    let hue = 0; // রঙ পরিবর্তনের জন্য

    // ড্রাগনের অংশগুলো তৈরি করা
    for (let i = 0; i < segmentCount; i++) {
        const segment = document.createElement('div');
        segment.classList.add('dragon-segment');
        
        // CSS থেকে বেস ফিল্টার স্টাইল সংরক্ষণ করা
        segment.dataset.baseFilter = window.getComputedStyle(segment).getPropertyValue('filter');

        if (i === 0) {
            segment.classList.add('dragon-head');
        } else if (i === 8 || i === 15) { // পাখনার অবস্থান
            segment.classList.add('dragon-fins');
        }
        
        body.appendChild(segment);
        segments.push(segment);
    }

    // মাউসের অবস্থান ট্র্যাক করা
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    const ease = 0.25; // ফলো করার স্পিড বাড়িয়েছি

    function animate() {
        // মাউসের গতি হিসাব করা
        const speed = Math.sqrt(Math.pow(mouse.x - lastMousePosition.x, 2) + Math.pow(mouse.y - lastMousePosition.y, 2));
        lastMousePosition = { ...mouse };

        // রঙ পরিবর্তনের জন্য hue আপডেট করা
        hue = (hue + 1) % 360;

        let prevPoint = points[0];
        points[0] = { ...mouse };

        // প্রতিটি সেগমেন্ট তার আগেরটিকে অনুসরণ করবে
        for (let i = 1; i < segmentCount; i++) {
            const point = points[i];
            const dx = prevPoint.x - point.x;
            const dy = prevPoint.y - point.y;
            
            point.x += dx * ease;
            point.y += dy * ease;
            
            prevPoint = point;
        }

        // প্রতিটি সেগমেন্টের স্টাইল আপডেট করা
        segments.forEach((segment, index) => {
            const point = points[index];
            
            // মাউসের গতির উপর ভিত্তি করে আকার পরিবর্তন
            const scale = 1 - (speed * 0.01);
            const size = 30 * Math.max(0.3, scale); // সর্বনিম্ন আকার限制 করা
            
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
