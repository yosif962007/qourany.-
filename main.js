// main.js

// دالة لعرض الرسائل المنبثقة
function showPopup(type, message) {
    const popup = document.getElementById("popupMsg");
    if (!popup) {
        console.error("Popup element not found!");
        return;
    }
    
    // إزالة أي فئات سابقة
    popup.className = 'popup';
    
    // إضافة الفئة الجديدة بناءً على النوع
    popup.classList.add(type);
    popup.textContent = message;
    popup.classList.add("show");
    
    // إخفاء الرسالة بعد 3 ثوانٍ
    setTimeout(() => {
        popup.classList.remove("show");
    }, 3000); // 3 ثواني
}

// دالة لتشغيل الصوت
function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.play().catch(e => console.error("Error playing sound:", e));
    } else {
        console.warn("Sound element not found:", soundId);
    }
}

// دالة تبديل الوضع (نهاري/ليلي)
function toggleMode() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    // بمجرد تبديل الوضع، نقوم بتحديث ألوان الجسيمات
    updateParticlesColor();
}

// دالة لتحديث ألوان جسيمات particles.js بناءً على الوضع الحالي
function updateParticlesColor() {
    // التأكد من أن particles.js قد تم تهيئته (pJSDom[0] هو الكائن الخاص بـ particles.js)
    if (typeof pJSDom !== 'undefined' && pJSDom.length > 0) {
        const pJS = pJSDom[0].pJS; // الوصول إلى كائن particlesJS
        
        if (document.body.classList.contains('dark-mode')) {
            // ألوان جريئة وفاتحة للوضع الليلي (بنفسجي وردي)
            pJS.particles.color.value = "#FFCCFF";
            pJS.particles.line_linked.color = "#FF99FF";
            pJS.particles.opacity.value = 0.6;
            pJS.particles.size.value = 4;
        } else {
            // ألوان مثيرة وجذابة للوضع النهاري (برتقالي محمر)
            // هذه الألوان ستبرز بشكل جيد على الخلفية #e0e6ed الجديدة
            pJS.particles.color.value = "#FF6347"; // Tomato
            pJS.particles.line_linked.color = "#FF4500"; // OrangeRed
            pJS.particles.opacity.value = 0.5;
            pJS.particles.size.value = 3;
        }
        // إعادة رسم الجسيمات لتطبيق التغييرات
        pJS.fn.particlesDraw();
    }
}

// تهيئة Particles.js عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    if (typeof particlesJS !== 'undefined') { // التحقق من وجود particlesJS
        particlesJS("particles-js", {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#FF6347" // لون افتراضي للوضع النهاري (برتقالي محمر)
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5, // شفافية افتراضية
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 3, // حجم افتراضي
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#FF4500", // لون افتراضي للخطوط (برتقالي غامق)
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "grab" // هذا هو الوضع الذي يجعل الجسيمات تتأثر بالماوس/اللمس
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 140,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true
        });
        // بعد تهيئة particles.js، نقوم بتحديث ألوانها مرة واحدة بناءً على الوضع الحالي
        updateParticlesColor();
    } else {
        console.error("particlesJS is not defined. Make sure particles.min.js is loaded correctly.");
    }
});