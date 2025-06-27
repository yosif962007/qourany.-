// ====== Global Variables and DOM Elements ======
const quranAudioPlayer = document.getElementById('quranAudioPlayer');
const readerSelect = document.getElementById('readerSelect');
const surahSelect = document.getElementById('surahSelect');
const playPauseBtn = document.getElementById('playPauseBtn');
const rewindBtn = document.getElementById('rewindBtn');
const forwardBtn = document.getElementById('forwardBtn');
const progressBar = document.getElementById('progressBar');
const currentTimeDisplay = document.getElementById('currentTimeDisplay');
const durationDisplay = document.getElementById('durationDisplay');
const currentSurahName = document.getElementById('currentSurahName');
const downloadAudioBtn = document.getElementById('downloadAudioBtn');
const quranTextDisplay = document.getElementById('quranTextDisplay');

const authSection = document.getElementById('authSection');
const loggedInUsernameSpan = document.getElementById('loggedInUsername');
const widgetUsernameSpan = document.getElementById('widgetUsername');
const widgetAvatarImg = document.getElementById('widgetAvatar');
const userProfileWidget = document.getElementById('userProfileWidget');
const dropdownMenu = userProfileWidget.querySelector('.dropdown-menu');

const developerInfoModal = document.getElementById('developerInfoModal');
const problemReportDisplay = document.getElementById('problemReportDisplay'); // New ID for display div
// هذه الروابط قد لا تكون موجودة مباشرة في HTML، لكن يمكن استخدامها لإنشاء الروابط ديناميكياً
const whatsappContactLink = document.getElementById('whatsappContactLink'); 
const telegramContactLink = document.getElementById('telegramContactLink');
const currentUserForReportSpan = document.getElementById('currentUserForReport');

// Hadith section elements
const hadithSearchInput = document.getElementById('hadithSearchInput');
const hadithDisplay = document.getElementById('hadithDisplay');

// Prayer times section elements
const citySelect = document.getElementById('citySelect');
const prayerTimesDisplay = document.getElementById('prayerTimesDisplay');

// Pop-up and Sound Elements
const popup = document.getElementById("popupMsg");
const successSound = document.getElementById("successSound");
const errorSound = document.getElementById("errorSound");
const warningSound = document.getElementById("warningSound");
const notificationSound = document.getElementById("notificationSound"); // Notification sound from profile.html


// ****** معلومات التواصل الخاصة بالمطور ******
const DEVELOPER_TELEGRAM_USERNAME = 'Sarehny_yosif_bot'; // تغير اسم البوت
const DEVELOPER_PHONE_NUMBER = '201553179352'; // رقم افتراضي

// Current user and reader/surah state
let currentUser = null;
let allReaders = [];
let allSurahs = [];
let currentSurahId = null;
let currentReaderId = null;
let notificationsEnabled = localStorage.getItem('notificationsEnabled') === 'true'; // حالة الإشعارات

// بيانات الأحاديث (مثال - في الواقع ستحتاج إلى جلبها من API أو ملف كبير)
const allHadith = [
    { text: "إنما الأعمال بالنيات، وإنما لكل امرئ ما نوى...", source: "البخاري ومسلم" },
    { text: "من كان يؤمن بالله واليوم الآخر فليقل خيراً أو ليصمت...", source: "البخاري ومسلم" },
    { text: "المسلم من سلم المسلمون من لسانه ويده...", source: "البخاري" },
    { text: "الدين النصيحة...", source: "مسلم" },
    { text: "لا يؤمن أحدكم حتى يحب لأخيه ما يحب لنفسه...", source: "البخاري ومسلم" },
    { text: "من صلى علي صلاة صلى الله عليه بها عشراً...", source: "مسلم" },
    { text: "خيركم من تعلم القرآن وعلمه...", source: "البخاري" },
    { text: "الحياء لا يأتي إلا بخير...", source: "البخاري ومسلم" },
    { text: "الطهور شطر الإيمان...", source: "مسلم" },
    { text: "تبسمك في وجه أخيك صدقة...", source: "الترمذي" }
];

// بيانات الأذكار (مثال - يمكن نقلها إلى ملف JSON منفصل أو جلبها من API)
const azkarData = {
    morning: [
        { text: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذَا الْيَوْمِ وَخَيْرَ مَا بَعْدَهُ، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذَا الْيَوْمِ وَشَرِّ مَا بَعْدَهُ، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.", count: 1 },
        { text: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ.", count: 1 },
        { text: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ.", count: 1 },
        { text: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلاَئِكَتِكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.", count: 4 },
        { text: "اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.", count: 1 },
        { text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ.", count: 3 },
        { text: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.", count: 7 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ.", count: 3 },
        { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.", count: 10 }
    ],
    evening: [
        { text: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ، لاَ إِلَهَ إِلاَّ اللَّهُ وَحْدَهُ لاَ شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ. رَبِّ أَسْأَلُكَ خَيْرَ مَا فِي هَذِهِ اللَّيْلَةِ وَخَيْرَ مَا بَعْدَهَا، وَأَعُوذُ بِكَ مِنْ شَرِّ مَا فِي هَذِهِ اللَّيْلَةِ وَشَرِّ مَا بَعْدَهَا، رَبِّ أَعُوذُ بِكَ مِنَ الْكَسَلِ وَسُوءِ الْكِبَرِ، رَبِّ أَعُوذُ بِكَ مِنْ عَذَابٍ فِي النَّارِ وَعَذَابٍ فِي الْقَبْرِ.", count: 1 },
        { text: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ.", count: 1 },
        { text: "اللَّهُمَّ أَنْتَ رَبِّي لاَ إِلَهَ إِلاَّ أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ، أَبُوءُ لَكَ بِنِعْمَتِكَ عَلَيَّ، وَأَبُوءُ بِذَنْبِي فَاغْفِرْ لِي فَإِنَّهُ لاَ يَغْفِرُ الذُّنُوبَ إِلاَّ أَنْتَ.", count: 1 },
        { text: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلاَئِكَتِكَ وَجَمِيعَ خَلْقِكَ، أَنَّكَ أَنْتَ اللَّهُ لاَ إِلَهَ إِلاَّ أَنْتَ وَحْدَكَ لاَ شَرِيكَ لَكَ، وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ.", count: 4 },
        { text: "اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لاَ شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ.", count: 1 },
        { text: "اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لاَ إِلَهَ إِلاَّ أَنْتَ. اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لاَ إِلَهَ إِلاَّ أَنْتَ.", count: 3 },
        { text: "حَسْبِيَ اللَّهُ لاَ إِلَهَ إِلاَّ هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ.", count: 7 },
        { text: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ.", count: 3 },
        { text: "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ.", count: 10 }
    ],
    sleep: [
        { text: "بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا.", count: 1 },
        { text: "بِاسْمِكَ رَبِّ وَضَعْتُ جَنْبِي وَبِكَ أَرْفَعُهُ، إِنْ أَمْسَكْتَ نَفْسِي فَارْحَمْهَا، وَإِنْ أَرْسَلْتَهَا فَاحْفَظْهَا بِمَا تَحْفَظُ بِهِ عِبَادَكَ الصَّالِحِينَ.", count: 1 },
        { text: "اللهم قني عذابك يوم تبعث عبادك.", count: 3 },
        { text: "سبحان الله (33 مرة)، الحمد لله (33 مرة)، الله أكبر (34 مرة).", count: 1 }
    ],
    after_prayer: [
        { text: "أَسْتَغْفِرُ اللَّهَ (ثلاث مرات)", count: 3 },
        { text: "اللَّهُمَّ أَنْتَ السَّلَامُ وَمِنْكَ السَّلَامُ تَبَارَكْتَ يَا ذَا الْجَلَالِ وَالْإِكْرَامِ.", count: 1 },
        { text: "لا إله إلا الله وحده لا شريك له، له الملك وله الحمد وهو على كل شيء قدير. لا حول ولا قوة إلا بالله، لا إله إلا الله ولا نعبد إلا إياه، له النعمة وله الفضل وله الثناء الحسن، لا إله إلا الله مخلصين له الدين ولو كره الكافرون.", count: 1 },
        { text: "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ.", count: 1 }
    ]
};


// ====== Storage Module (Assumed from storage.js) ======
// يجب أن يكون ملف storage.js منفصلاً ومحملاً قبل هذا الملف.
// إذا كان ملف storage.js غير موجود، فسيحدث خطأ.
// يجب التأكد أن الدوال التالية موجودة في Storage:
// Storage.saveUser(username, { password: password, avatar: 'default-avatar.png' });
// Storage.verifyUser(username, password);
// Storage.userExists(username);
// Storage.getUserData(username);
// Storage.updateUserData(username, newData);
// Storage.deleteUser(username);


// ====== Utility Functions ======

// دالة لعرض الرسائل المنبثقة (من main.js)
function showPopup(type, message) {
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

// دالة لتشغيل الصوت (من main.js)
function playSound(soundElement) {
    if (notificationsEnabled && soundElement) { // Play sound only if notifications are enabled
        soundElement.currentTime = 0; // Reset sound to start
        soundElement.play().catch(e => console.error("Error playing sound:", e));
    } else {
        // console.warn("Sound element not found or notifications disabled."); // Removed for less console spam
    }
}


function loadCurrentUser() {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
}

function saveCurrentUser() {
    localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function updateProfileDisplay() {
    if (currentUser) {
        loggedInUsernameSpan.textContent = currentUser.username;
        widgetUsernameSpan.textContent = currentUser.username;
        widgetAvatarImg.src = currentUser.avatar || 'default-avatar.png';
    } else {
        loggedInUsernameSpan.textContent = 'مستخدم';
        widgetUsernameSpan.textContent = 'مستخدم';
        widgetAvatarImg.src = 'default-avatar.png';
    }
}

function hideAllSections() {
    document.querySelectorAll('.content-section').forEach(section => {
        section.style.display = 'none';
    });
}

function showSection(sectionId) {
    hideAllSections();
    const section = document.getElementById(sectionId);
    if (section) {
        section.style.display = 'block';
    }
    // Update active nav item in sidebar
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.section === sectionId) {
            item.classList.add('active');
        }
    });
    // Hide dropdown menu if open
    userProfileWidget.classList.remove('active');
    // Hide modal if open
    if (developerInfoModal.style.display === 'flex') {
        closeDeveloperInfoModal();
    }
    // Hide problem report contact info display (if previously shown)
    if (problemReportDisplay) {
        problemReportDisplay.style.display = 'none';
    }

    // Initialize sections upon navigation
    if (sectionId === 'hadith') {
        displayHadith(allHadith);
    } else if (sectionId === 'azkar') {
        // Find the currently active azkar category button or default to 'morning'
        const activeAzkarBtn = document.querySelector('.azkar-cat-btn.active');
        const initialAzkarType = activeAzkarBtn ? activeAzkarBtn.dataset.azkarType : 'morning';
        initAzkarSection(initialAzkarType); 
    }
}

// Function to update the text of the notification toggle button
function updateNotificationButtonText() {
    const toggleNotificationsBtn = document.getElementById('toggleNotificationsBtn');
    if (toggleNotificationsBtn) {
        if (notificationsEnabled) {
            toggleNotificationsBtn.innerHTML = '<i class="fas fa-volume-up"></i> تعطيل الإشعارات';
        } else {
            toggleNotificationsBtn.innerHTML = '<i class="fas fa-volume-mute"></i> تشغيل الإشعارات';
        }
    }
}

// ====== Authentication Functions ======
function login() {
    const username = document.getElementById('authUsername').value;
    const password = document.getElementById('authPassword').value;
    const authMessage = document.getElementById('authMessage');

    if (Storage.verifyUser(username, password)) {
        const userData = Storage.getUserData(username);
        currentUser = { username: username, avatar: userData.avatar || 'default-avatar.png' };
        saveCurrentUser();
        updateProfileDisplay();
        authSection.style.display = 'none';
        showSection(localStorage.getItem('lastActiveSection') || 'quran'); // Go to last active or Quran
        authMessage.textContent = '';
        showPopup('success', `مرحباً بك، ${username}!`);
        playSound(successSound);
    } else {
        authMessage.textContent = 'اسم المستخدم أو كلمة المرور غير صحيحة.';
        showPopup('error', 'خطأ في تسجيل الدخول: اسم المستخدم أو كلمة المرور غير صحيحة.');
        playSound(errorSound);
    }
}

function register() {
    const username = document.getElementById('authUsername').value;
    const password = document.getElementById('authPassword').value;
    const authMessage = document.getElementById('authMessage');

    if (Storage.userExists(username)) {
        authMessage.textContent = 'اسم المستخدم موجود بالفعل.';
        showPopup('warning', 'اسم المستخدم موجود بالفعل.');
        playSound(warningSound);
    } else {
        Storage.saveUser(username, { password: password, avatar: 'default-avatar.png' });
        authMessage.textContent = 'تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.';
        showPopup('success', 'تم التسجيل بنجاح! يمكنك الآن تسجيل الدخول.');
        playSound(successSound);
    }
}

function logout() {
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('lastActiveSection'); // Clear last active section on logout
    showSection('authSection');
    document.getElementById('authUsername').value = '';
    document.getElementById('authPassword').value = '';
    document.getElementById('authMessage').textContent = '';
    updateProfileDisplay();
    showPopup('success', 'تم تسجيل الخروج بنجاح.');
    playSound(successSound);
}


// ====== Profile & Settings Functions ======
function changeUsername() {
    if (!currentUser) {
        showPopup('error', 'الرجاء تسجيل الدخول أولاً.');
        playSound(errorSound);
        return;
    }

    const newUsername = document.getElementById('newUsername').value;
    if (!newUsername.trim()) {
        showPopup('warning', 'اسم المستخدم لا يمكن أن يكون فارغًا.');
        playSound(warningSound);
        return;
    }

    // Check if new username is different from current and if it already exists
    if (newUsername !== currentUser.username && Storage.userExists(newUsername)) {
        showPopup('warning', 'اسم المستخدم هذا موجود بالفعل.');
        playSound(warningSound);
        return;
    }
    
    if (newUsername === currentUser.username) {
        showPopup('info', 'اسم المستخدم الجديد هو نفس الاسم الحالي.');
        playSound(warningSound);
        return;
    }

    const oldUserData = Storage.getUserData(currentUser.username);
    if (!oldUserData) { // Should not happen if currentUser is set correctly
        showPopup('error', 'حدث خطأ: لا يمكن العثور على بيانات المستخدم الحالي.');
        playSound(errorSound);
        return;
    }

    // Delete old user entry and save with new username
    Storage.deleteUser(currentUser.username); 
    Storage.saveUser(newUsername, {
        password: oldUserData.password, // Password is automatically re-hashed by saveUser
        avatar: oldUserData.avatar
    });

    currentUser.username = newUsername;
    saveCurrentUser();
    updateProfileDisplay();
    showPopup('success', 'تم تغيير اسم المستخدم بنجاح!');
    playSound(successSound);
    document.getElementById('newUsername').value = ''; // Clear the input field
}

function changePassword() {
    if (!currentUser) {
        showPopup('error', 'الرجاء تسجيل الدخول أولاً.');
        playSound(errorSound);
        return;
    }

    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (!newPassword || newPassword.length < 6) {
        showPopup('warning', 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل.');
        playSound(warningSound);
        return;
    }
    if (newPassword !== confirmNewPassword) {
        showPopup('error', 'كلمتا المرور غير متطابقتين.');
        playSound(errorSound);
        return;
    }

    // `updateUserData` will handle password hashing
    if (Storage.updateUserData(currentUser.username, { password: newPassword })) {
        showPopup('success', 'تم تغيير كلمة المرور بنجاح!');
        playSound(successSound);
        document.getElementById('newPassword').value = '';
        document.getElementById('confirmNewPassword').value = '';
    } else {
        showPopup('error', 'حدث خطأ أثناء تغيير كلمة المرور.');
        playSound(errorSound);
    }
}

function uploadAvatar() {
    if (!currentUser) {
        showPopup('error', 'الرجاء تسجيل الدخول أولاً.');
        playSound(errorSound);
        return;
    }

    const avatarFile = document.getElementById('avatarUpload').files[0];
    if (avatarFile) {
        // Limit file size to 2MB (adjust as needed)
        if (avatarFile.size > 2 * 1024 * 1024) { 
            showPopup('warning', 'حجم الصورة كبير جداً (الحد الأقصى 2MB).');
            playSound(warningSound);
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const newAvatar = e.target.result; // Base64 string
            currentUser.avatar = newAvatar;
            saveCurrentUser(); // Update local storage (current session user)
            updateProfileDisplay(); // Update UI immediately
            
            // Also update in the main Storage module
            if (Storage.updateUserData(currentUser.username, { avatar: newAvatar })) {
                showPopup('success', 'تم تغيير الصورة الشخصية بنجاح!');
                playSound(successSound);
            } else {
                showPopup('error', 'حدث خطأ أثناء تحديث الصورة الشخصية في التخزين الدائم.');
                playSound(errorSound);
            }
        };
        reader.readAsDataURL(avatarFile); // Read file as Base64
    } else {
        showPopup('warning', 'الرجاء اختيار ملف صورة.');
        playSound(warningSound);
    }
}

function resetAvatar() {
    if (!currentUser) {
        showPopup('error', 'الرجاء تسجيل الدخول أولاً.');
        playSound(errorSound);
        return;
    }

    const defaultAvatar = 'default-avatar.png'; // Make sure this file exists
    currentUser.avatar = defaultAvatar;
    saveCurrentUser(); // Update local storage (current session user)
    updateProfileDisplay(); // Update UI immediately
    
    // Also update in the main Storage module
    if (Storage.updateUserData(currentUser.username, { avatar: defaultAvatar })) {
        showPopup('success', 'تم إعادة تعيين الصورة الافتراضية.');
        playSound(successSound);
    } else {
        showPopup('error', 'حدث خطأ أثناء إعادة تعيين الصورة الافتراضية في التخزين الدائم.');
        playSound(errorSound);
    }
}

// ====== Notification Functionality ======
function toggleNotifications() {
    notificationsEnabled = !notificationsEnabled;
    localStorage.setItem('notificationsEnabled', notificationsEnabled);
    updateNotificationButtonText(); // Update button text immediately
    if (notificationsEnabled) {
        showPopup('info', 'تم تفعيل الإشعارات.');
        playSound(notificationSound); // Play notification sound when enabled
    } else {
        showPopup('info', 'تم تعطيل الإشعارات.');
    }
}


// ====== Problem Report Functionality ======
function submitProblemReport() {
    if (!currentUser) {
        showPopup('error', 'الرجاء تسجيل الدخول أولاً للإبلاغ عن مشكلة.');
        playSound(errorSound);
        return;
    }

    const contactInfoInput = document.getElementById('contactInfo');
    const problemDescriptionInput = document.getElementById('problemDescription');
    const problemReportDisplayDiv = document.getElementById('problemReportDisplay'); 

    const contactInfo = contactInfoInput.value.trim();
    const problemDescription = problemDescriptionInput.value.trim();

    if (!contactInfo) {
        showPopup('warning', 'الرجاء إدخال رقم الهاتف أو اسم مستخدم التليجرام الخاص بك لكي نتمكن من التواصل معك.');
        playSound(warningSound);
        contactInfoInput.focus();
        return;
    }

    if (!problemDescription) {
        showPopup('warning', 'الرجاء كتابة وصف للمشكلة التي تواجهها.');
        playSound(warningSound);
        problemDescriptionInput.focus();
        return;
    }

    const message = `
بلاغ مشكلة من المستخدم: ${currentUser.username}
معلومات التواصل للمستخدم: ${contactInfo}
وصف المشكلة:
${problemDescription}
`;
    const encodedMessage = encodeURIComponent(message);

    if (problemReportDisplayDiv) { // Ensure the display div exists
        problemReportDisplayDiv.innerHTML = `
            <p>شكراً لك يا <strong>${currentUser.username}</strong> على بلاغك! يمكنك التواصل معنا مباشرةً بخصوص المشكلة عبر الروابط التالية:</p>
            <a href="https://wa.me/${DEVELOPER_PHONE_NUMBER}?text=${encodedMessage}" target="_blank" class="contact-link whatsapp"><i class="fab fa-whatsapp"></i> تواصل عبر واتساب</a>
            <a href="https://t.me/${DEVELOPER_TELEGRAM_USERNAME}?text=${encodedMessage}" target="_blank" class="contact-link telegram"><i class="fab fa-telegram-plane"></i> تواصل عبر تيليجرام</a>
        `;
        problemReportDisplayDiv.style.display = 'block';
    }

    showPopup('success', 'تم تسجيل بيانات بلاغك بنجاح! يرجى استخدام الروابط أدناه للتواصل مباشرة معنا بخصوص المشكلة.');
    playSound(successSound);

    // Clear form fields
    contactInfoInput.value = '';
    problemDescriptionInput.value = '';
}


// ====== Developer Info Modal Functions ======
function showDeveloperInfo() {
    developerInfoModal.style.display = 'flex';
    // Update bot username in the modal content if needed
    developerInfoModal.querySelector('.telegram-contact-btn').href = `https://t.me/${DEVELOPER_TELEGRAM_USERNAME}`;
    developerInfoModal.querySelector('.small-note').textContent = `تأكد أن بوتك @${DEVELOPER_TELEGRAM_USERNAME} مستعد لاستقبال الرسائل.`;

    userProfileWidget.classList.remove('active'); // Close dropdown if open
}

function closeDeveloperInfoModal() {
    developerInfoModal.style.display = 'none';
}


// ====== Quran Features (API Integration) ======
async function fetchReaders() {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/edition?format=audio&language=ar');
        const data = await response.json();
        allReaders = data.data;

        readerSelect.innerHTML = '<option value="">اختر قارئ</option>';
        allReaders.forEach(reader => {
            const option = document.createElement('option');
            option.value = reader.identifier;
            option.textContent = reader.englishName.replace('Audio', '').trim(); // Remove 'Audio' from name
            readerSelect.appendChild(option);
        });
        // Try to load last selected reader
        const lastReader = localStorage.getItem('lastReader');
        if (lastReader && allReaders.some(r => r.identifier === lastReader)) {
            readerSelect.value = lastReader;
            currentReaderId = lastReader;
        }

    } catch (error) {
        console.error('Error fetching readers:', error);
        showPopup('error', 'حدث خطأ أثناء جلب القراء.');
        playSound(errorSound);
    }
}

async function fetchSurahs() {
    try {
        const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data = await response.json();
        allSurahs = data.data;

        surahSelect.innerHTML = '<option value="">اختر سورة</option>';
        allSurahs.forEach(surah => {
            const option = document.createElement('option');
            option.value = surah.number;
            option.textContent = `${surah.number}. ${surah.name} (${surah.englishName})`;
            surahSelect.appendChild(option);
        });
        // Try to load last selected surah
        const lastSurah = localStorage.getItem('lastSurah');
        if (lastSurah && allSurahs.some(s => s.number == lastSurah)) { // Compare number, not string
            surahSelect.value = lastSurah;
            currentSurahId = lastSurah;
        }

        // If both are selected from local storage, load the surah
        if (currentReaderId && currentSurahId) {
            loadSurah(currentSurahId, currentReaderId);
        }

    } catch (error) {
        console.error('Error fetching surahs:', error);
        showPopup('error', 'حدث خطأ أثناء جلب السور.');
        playSound(errorSound);
    }
}

async function loadSurah(surahNumber, readerIdentifier) {
    if (!surahNumber || !readerIdentifier) {
        quranTextDisplay.innerHTML = '<p>الرجاء اختيار قارئ وسورة.</p>';
        showPopup('warning', 'الرجاء اختيار قارئ وسورة.');
        playSound(warningSound);
        return;
    }

    try {
        // Fetch Surah text
        const surahTextResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`);
        const surahTextData = await surahTextResponse.json();
        const surah = surahTextData.data;

        let textHtml = `<h3>${surah.name}</h3>`;
        if (surah.number !== 9) { // No Bismillah for Surah At-Tawbah (9)
             textHtml += `<p class="bismillah">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>`;
        }
        surah.ayahs.forEach(ayah => {
            textHtml += `<p>${ayah.text} ﴿${ayah.numberInSurah}﴾</p>`;
        });
        quranTextDisplay.innerHTML = textHtml;
        quranTextDisplay.scrollTop = 0; // Scroll to top after loading new surah


        // Fetch Surah audio
        const audioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/${readerIdentifier}`);
        const audioData = await audioResponse.json();
        const currentAudioUrl = audioData.data.audio;

        quranAudioPlayer.src = currentAudioUrl;
        currentSurahName.textContent = surah.name;
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>'; // Reset play button
        downloadAudioBtn.href = currentAudioUrl;
        downloadAudioBtn.style.display = 'inline-block';
        showPopup('success', `تم تحميل سورة ${surah.name} بنجاح.`);
        playSound(successSound);

        // Save last selected surah and reader
        localStorage.setItem('lastSurah', surahNumber);
        localStorage.setItem('lastReader', readerIdentifier);

    } catch (error) {
        console.error('Error loading surah:', error);
        quranTextDisplay.innerHTML = '<p>حدث خطأ أثناء تحميل السورة. الرجاء المحاولة لاحقاً.</p>';
        showPopup('error', 'حدث خطأ أثناء تحميل السورة.');
        playSound(errorSound);
    }
}

// ****** Quran Audio Player Controls ******
function togglePlayPause() {
    if (!quranAudioPlayer.src || quranAudioPlayer.src === window.location.href || quranAudioPlayer.src === "") {
        showPopup('warning', 'الرجاء اختيار قارئ وسورة أولاً.');
        playSound(warningSound);
        return;
    }
    if (quranAudioPlayer.paused) {
        quranAudioPlayer.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        quranAudioPlayer.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function updateProgressBar() {
    const { duration, currentTime } = quranAudioPlayer;
    const progressPercent = (currentTime / duration) * 100;
    progressBar.value = progressPercent || 0;

    currentTimeDisplay.textContent = formatTime(currentTime);
    durationDisplay.textContent = formatTime(duration);
}

function setProgress(e) {
    const width = this.clientWidth;
    const clickX = e.offsetX;
    const duration = quranAudioPlayer.duration;
    if (isNaN(duration) || duration === 0) return; // Prevent division by zero
    quranAudioPlayer.currentTime = (clickX / width) * duration;
}

function formatTime(seconds) {
    if (isNaN(seconds)) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

function rewind10Seconds() {
    if (quranAudioPlayer.src && quranAudioPlayer.src !== window.location.href && quranAudioPlayer.src !== "") {
        if (quranAudioPlayer.currentTime > 10) {
            quranAudioPlayer.currentTime -= 10;
        } else {
            quranAudioPlayer.currentTime = 0;
        }
    } else {
        showPopup('warning', 'الرجاء اختيار قارئ وسورة أولاً.');
        playSound(warningSound);
    }
}

function forward10Seconds() {
    if (quranAudioPlayer.src && quranAudioPlayer.src !== window.location.href && quranAudioPlayer.src !== "") {
        if (quranAudioPlayer.currentTime + 10 < quranAudioPlayer.duration) {
            quranAudioPlayer.currentTime += 10;
        } else {
            quranAudioPlayer.currentTime = quranAudioPlayer.duration;
        }
    } else {
        showPopup('warning', 'الرجاء اختيار قارئ وسورة أولاً.');
        playSound(warningSound);
    }
}


// ====== Azkar Section ======
function initAzkarSection(type = 'morning') {
    const azkarDisplay = document.getElementById('azkarDisplay');
    azkarDisplay.innerHTML = `<p style="text-align: center;">جاري تحميل أذكار ${type}...</p>`;

    const selectedAzkar = azkarData[type] || [];
    let azkarHtml = '';
    if (selectedAzkar.length > 0) {
        selectedAzkar.forEach((zikr, index) => {
            // Retrieve saved count from localStorage for this specific zikr
            const savedCount = localStorage.getItem(`azkar-${type}-${index}-count`);
            const initialCount = savedCount ? parseInt(savedCount) : 0;

            azkarHtml += `
                <div class="azkar-item">
                    <h3>${zikr.text.split('.')[0]}...</h3>
                    <p class="azkar-text">"${zikr.text}"</p>
                    <div class="azkar-controls">
                        <span class="azkar-counter" id="counter-${type}-${index}">${initialCount}</span>
                        <button class="azkar-count-btn" onclick="incrementCounter('counter-${type}-${index}', ${zikr.count}, '${type}', ${index})">عد</button>
                        <button class="azkar-reset-btn" onclick="resetCounter('counter-${type}-${index}', '${type}', ${index})">تصفير</button>
                    </div>
                </div>
            `;
        });
    } else {
        azkarHtml = `<p style="text-align: center;">لا توجد أذكار لهذا النوع حالياً.</p>`;
    }
    
    // Simulate loading time for better UX
    setTimeout(() => {
        azkarDisplay.innerHTML = azkarHtml;
        showPopup('info', `تم تحميل أذكار ${type}.`);
    }, 300);
}

function incrementCounter(counterId, maxCount, type, index) {
    const counterElement = document.getElementById(counterId);
    if (!counterElement) return;
    let count = parseInt(counterElement.textContent);
    if (isNaN(count)) count = 0;
    
    if (count < maxCount) {
        count++;
        counterElement.textContent = count;
        localStorage.setItem(`azkar-${type}-${index}-count`, count); // Save count
        // Optional: Play a subtle count sound here if you have one
    } else {
        showPopup('success', 'لقد أكملت هذا الذكر! يمكنك تصفيره للبدء من جديد.');
        playSound(successSound);
    }
}

function resetCounter(counterId, type, index) {
    const counterElement = document.getElementById(counterId);
    if (counterElement) {
        counterElement.textContent = '0';
        localStorage.setItem(`azkar-${type}-${index}-count`, 0); // Reset saved count
        showPopup('info', 'تم تصفير العداد.');
        // Optional: Play a subtle reset sound here if you have one
    }
}


// ====== Hadith Section ======
function displayHadith(hadithToDisplay) {
    hadithDisplay.innerHTML = '';
    if (hadithToDisplay.length === 0) {
        hadithDisplay.innerHTML = '<p style="text-align: center;">لم يتم العثور على أحاديث مطابقة.</p>';
        return;
    }

    hadithToDisplay.forEach(hadith => {
        const hadithItem = document.createElement('div');
        hadithItem.classList.add('hadith-item');
        hadithItem.innerHTML = `
            <p>${hadith.text}</p>
            <p class="source">المصدر: ${hadith.source}</p>
        `;
        hadithDisplay.appendChild(hadithItem);
    });
}

function searchHadith() {
    const searchTerm = hadithSearchInput.value.trim().toLowerCase();
    if (!searchTerm) {
        displayHadith(allHadith); // If search term is empty, display all hadith
        showPopup('info', 'عرض جميع الأحاديث.');
        return;
    }

    const filteredHadith = allHadith.filter(hadith =>
        hadith.text.toLowerCase().includes(searchTerm) ||
        hadith.source.toLowerCase().includes(searchTerm)
    );
    displayHadith(filteredHadith);
    if (filteredHadith.length > 0) {
        showPopup('success', `تم العثور على ${filteredHadith.length} حديث مطابقة.`);
        playSound(successSound);
    } else {
        showPopup('warning', 'لم يتم العثور على أحاديث مطابقة لـ: "' + searchTerm + '"');
        playSound(warningSound);
    }
}


// ====== Prayer Times Section ======
async function getPrayerTimes() {
    const selectedCity = citySelect.value;
    if (!selectedCity) {
        showPopup('warning', 'الرجاء اختيار مدينة أولاً.');
        playSound(warningSound);
        prayerTimesDisplay.innerHTML = '';
        return;
    }

    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const method = 5; // Example method: Egyptian General Authority of Survey (standard for Egypt)

    prayerTimesDisplay.innerHTML = `<p style="text-align: center;">جاري تحميل مواقيت الصلاة لـ ${selectedCity}...</p>`;

    try {
        let latitude, longitude;
        // This is a simplified approach. For a real app, use a robust city lookup API
        // or a more comprehensive list of coordinates.
        switch (selectedCity) {
            case 'Cairo': latitude = 30.0444; longitude = 31.2357; break;
            case 'Alexandria': latitude = 31.2001; longitude = 29.9187; break;
            case 'Giza': latitude = 30.0131; longitude = 31.2089; break;
            case 'Shubra El-Kheima': latitude = 30.1293; longitude = 31.2427; break;
            case 'Port Said': latitude = 31.2565; longitude = 32.2842; break;
            case 'Suez': latitude = 29.9737; longitude = 32.5263; break;
            case 'Mansoura': latitude = 31.0379; longitude = 31.3815; break;
            case 'Tanta': latitude = 30.7933; longitude = 31.0004; break;
            case 'Assiut': latitude = 27.1788; longitude = 31.1859; break;
            default: 
                showPopup('error', 'الإحداثيات غير متوفرة لهذه المدينة.'); 
                playSound(errorSound);
                prayerTimesDisplay.innerHTML = '<p style="text-align: center;">لا يمكن جلب مواقيت الصلاة لهذه المدينة.</p>'; 
                return;
        }

        const response = await fetch(`https://api.aladhan.com/v1/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}`);
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
            const today = new Date().getDate();
            const prayerTimesToday = data.data.find(day => new Date(day.date.readable).getDate() === today);

            if (prayerTimesToday) {
                const times = prayerTimesToday.timings;
                prayerTimesDisplay.innerHTML = `
                    <h3>مواقيت الصلاة لمدينة ${selectedCity} - اليوم (${prayerTimesToday.date.gregorian.date})</h3>
                    <table>
                        <thead>
                            <tr>
                                <th>الصلاة</th>
                                <th>الوقت</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr><td>الفجر</td><td>${times.Fajr.split(' ')[0]}</td></tr>
                            <tr><td>الشروق</td><td>${times.Sunrise.split(' ')[0]}</td></tr>
                            <tr><td>الظهر</td><td>${times.Dhuhr.split(' ')[0]}</td></tr>
                            <tr><td>العصر</td><td>${times.Asr.split(' ')[0]}</td></tr>
                            <tr><td>المغرب</td><td>${times.Maghrib.split(' ')[0]}</td></tr>
                            <tr><td>العشاء</td><td>${times.Isha.split(' ')[0]}</td></tr>
                        </tbody>
                    </table>
                    <p style="font-size: 0.8em; margin-top: 15px; color: #666;">
                        *مواعيد الصلاة مقدمة من خدمة Aladhan API.
                    </p>
                `;
                showPopup('success', `تم تحميل مواقيت الصلاة لـ ${selectedCity}.`);
                playSound(successSound);
            } else {
                prayerTimesDisplay.innerHTML = '<p style="text-align: center;">لم يتم العثور على مواقيت صلاة لهذا اليوم.</p>';
                showPopup('warning', 'لم يتم العثور على مواقيت صلاة لهذا اليوم.');
                playSound(warningSound);
            }
        } else {
            prayerTimesDisplay.innerHTML = '<p style="text-align: center;">حدث خطأ في جلب مواقيت الصلاة. الرجاء التأكد من اتصالك بالإنترنت أو المحاولة لاحقاً.</p>';
            showPopup('error', 'حدث خطأ في جلب مواقيت الصلاة.');
            playSound(errorSound);
        }

    } catch (error) {
        console.error('Error fetching prayer times:', error);
        prayerTimesDisplay.innerHTML = '<p style="text-align: center;">حدث خطأ أثناء جلب مواقيت الصلاة. الرجاء المحاولة لاحقاً.</p>';
        showPopup('error', 'حدث خطأ أثناء جلب مواقيت الصلاة.');
        playSound(errorSound);
    }
}


// ====== Dark Mode / Light Mode Functionality (from main.js) ======
function toggleMode() {
    document.body.classList.toggle("dark-mode");
    const isDarkMode = document.body.classList.contains("dark-mode");
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    // Update the button text
    const darkModeToggleBtn = document.getElementById('darkModeToggle');
    if (darkModeToggleBtn) {
        if (isDarkMode) {
            darkModeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> الوضع النهاري';
        } else {
            darkModeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> الوضع الليلي';
        }
    }
    // Update particles color if particles.js is initialized
    updateParticlesColor();
    showPopup('info', `تم تبديل الوضع إلى ${isDarkMode ? 'الوضع الليلي' : 'الوضع النهاري'}.`);
}

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
            pJS.particles.color.value = "#FF6347"; // Tomato
            pJS.particles.line_linked.color = "#FF4500"; // OrangeRed
            pJS.particles.opacity.value = 0.5;
            pJS.particles.size.value = 3;
        }
        // إعادة رسم الجسيمات لتطبيق التغييرات
        pJS.fn.particlesDraw();
    }
}

// Function to apply saved theme on load
function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        if (!document.body.classList.contains('dark-mode')) {
            document.body.classList.add('dark-mode'); // Directly add class, then update particles
        }
    } else {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode'); // Directly remove class, then update particles
        }
    }
    updateParticlesColor(); // Always update particles color based on final theme
    // Update button text after setting the theme
    const darkModeToggleBtn = document.getElementById('darkModeToggle');
    if (darkModeToggleBtn) {
        if (document.body.classList.contains('dark-mode')) {
            darkModeToggleBtn.innerHTML = '<i class="fas fa-sun"></i> الوضع النهاري';
        } else {
            darkModeToggleBtn.innerHTML = '<i class="fas fa-moon"></i> الوضع الليلي';
        }
    }
}


// ====== Event Listeners ======
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Particles.js if it's available
    if (typeof particlesJS !== 'undefined') {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 80, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#FF6347" }, // Default for light mode
                "shape": { "type": "circle", "stroke": { "width": 0, "color": "#000000" }, "polygon": { "nb_sides": 5 } },
                "opacity": { "value": 0.5, "random": false, "anim": { "enable": false, "speed": 1, "opacity_min": 0.1, "sync": false } },
                "size": { "value": 3, "random": true, "anim": { "enable": false, "speed": 40, "size_min": 0.1, "sync": false } },
                "line_linked": { "enable": true, "distance": 150, "color": "#FF4500", "opacity": 0.4, "width": 1 },
                "move": { "enable": true, "speed": 6, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false, "attract": { "enable": false, "rotateX": 600, "rotateY": 1200 } }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" }, "resize": true },
                "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } }, "bubble": { "distance": 400, "size": 40, "duration": 2, "opacity": 8, "speed": 3 }, "repulse": { "distance": 200, "duration": 0.4 }, "push": { "particles_nb": 4 }, "remove": { "particles_nb": 2 } }
            },
            "retina_detect": true
        });
        applySavedTheme(); // Apply theme and update particles colors initially
    } else {
        console.error("particlesJS is not defined. Make sure particles.min.js is loaded correctly if you intend to use it.");
        applySavedTheme(); // Still apply theme even without particles.js
    }

    loadCurrentUser();
    updateProfileDisplay();
    updateNotificationButtonText(); // Update notification button text on load

    // Determine which section to show on load
    if (currentUser) {
        // If logged in, check if a section was previously active or default to 'quran'
        const lastActiveSection = localStorage.getItem('lastActiveSection');
        showSection(lastActiveSection || 'quran');
    } else {
        showSection('authSection');
    }


    fetchReaders();
    fetchSurahs();

    // Sidebar navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = item.dataset.section;
            if (sectionId) {
                if (currentUser) {
                    showSection(sectionId);
                    localStorage.setItem('lastActiveSection', sectionId); // Save last active section
                } else {
                    showPopup('warning', 'الرجاء تسجيل الدخول أولاً.');
                    playSound(warningSound);
                }
            }
        });
    });

    // Handle user profile widget dropdown
    userProfileWidget.addEventListener('click', (event) => {
        // Prevent click inside dropdown from closing it immediately
        // Check if the click target is within the dropdown menu itself
        if (dropdownMenu.contains(event.target)) {
            // If the click is on one of the dropdown links, let the onclick handler handle it
            // and don't close the dropdown immediately. The onclick function might close it itself.
            return; 
        }
        userProfileWidget.classList.toggle('active');
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (event) => {
        if (!userProfileWidget.contains(event.target) && userProfileWidget.classList.contains('active')) {
            userProfileWidget.classList.remove('active');
        }
    });

    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === developerInfoModal) {
            closeDeveloperInfoModal();
        }
    });


    quranAudioPlayer.addEventListener('timeupdate', updateProgressBar);
    quranAudioPlayer.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
        progressBar.value = 0;
        currentTimeDisplay.textContent = '00:00';
        showPopup('info', 'انتهت السورة، يمكنك اختيار سورة أخرى.');
        playSound(notificationSound);
    });
    quranAudioPlayer.addEventListener('loadedmetadata', updateProgressBar);

    playPauseBtn.addEventListener('click', togglePlayPause);
    rewindBtn.addEventListener('click', rewind10Seconds);
    forwardBtn.addEventListener('click', forward10Seconds);
    progressBar.addEventListener('click', setProgress);

    readerSelect.addEventListener('change', () => {
        currentReaderId = readerSelect.value;
        if (currentReaderId && currentSurahId) {
            loadSurah(currentSurahId, currentReaderId);
        } else if (currentReaderId && !currentSurahId) {
            showPopup('info', 'الرجاء اختيار سورة الآن.');
            playSound(notificationSound);
        }
    });

    surahSelect.addEventListener('change', () => {
        currentSurahId = surahSelect.value;
        if (currentReaderId && currentSurahId) {
            loadSurah(currentSurahId, currentReaderId);
        } else if (currentSurahId && !currentReaderId) {
            showPopup('info', 'الرجاء اختيار قارئ أولاً.');
            playSound(notificationSound);
        }
    });

    downloadAudioBtn.style.display = 'none';

    // Azkar category buttons
    const azkarCatButtons = document.querySelectorAll('.azkar-cat-btn');
    azkarCatButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            azkarCatButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            initAzkarSection(btn.dataset.azkarType);
        });
    });

    document.getElementById('searchHadithBtn').addEventListener('click', searchHadith);
    hadithSearchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchHadith();
        }
    });

    document.getElementById('getPrayerTimesBtn').addEventListener('click', getPrayerTimes);

    // Initial check for notification button text
    updateNotificationButtonText(); 
});