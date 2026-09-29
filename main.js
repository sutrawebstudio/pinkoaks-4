/**
 * PINK OAKS - BANI PARK, JAIPUR
 * Interactive Engine & UI Handlers
 */

document.addEventListener('DOMContentLoaded', () => {
    initPreloader();
    initHeaderScroll();
    initMobileMenu();
    initSmoothScroll();
    initThemeMap();
    initBookingModal();
    initBrochureModal();
    initFloorplanModal();
    initLightboxModal();
    initCalculator();
    initPageVisitForm();
    initBackToTop();

    // Luxury Motion Engine Handlers
    initAestheticAnimations();
    initLenisSmoothScroll();
    initScrollProgress();
    initLuxuryHeroTimeline();
    initSectionScrollReveals();
    init3DTiltPhysics();
    initMagneticButtons();
});

/* ==========================================================================
   Preloader Handler
   ========================================================================== */
function initPreloader() {
    const preloader = document.getElementById('site-preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('fade-out');
            }, 500);
        });

        // Fallback hide after 2s max
        setTimeout(() => {
            if (!preloader.classList.contains('fade-out')) {
                preloader.classList.add('fade-out');
            }
        }, 2000);
    }
}

/* ==========================================================================
   1. Header Scroll & Active Links
   ========================================================================== */
function initHeaderScroll() {
    const header = document.getElementById('site-header');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Active Section Detection
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    });
}

/* ==========================================================================
   2. Mobile Menu Toggle
   ========================================================================== */
function initMobileMenu() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (toggleBtn && navMenu) {
        toggleBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            toggleBtn.classList.toggle('open');
        });

        // Close menu on link click
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }
}

/* ==========================================================================
   3. Smooth Scroll
   ========================================================================== */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/* ==========================================================================
   4. Theme Customized Interactive Map (Leaflet)
   ========================================================================== */
function initThemeMap() {
    const mapContainer = document.getElementById('theme-map');
    if (!mapContainer) return;

    if (typeof L === 'undefined') {
        // In case Leaflet script is still downloading from CDN
        let attempts = 0;
        const retryTimer = setInterval(() => {
            attempts++;
            if (typeof L !== 'undefined') {
                clearInterval(retryTimer);
                initThemeMap();
            } else if (attempts > 30) {
                clearInterval(retryTimer);
                console.warn('Leaflet library failed to load.');
            }
        }, 100);
        return;
    }

    // Avoid duplicate initialization
    if (mapContainer._leaflet_id) {
        return;
    }

    // Bani Park Jaipur coordinates
    const pinkOaksCoords = [26.9275, 75.7940];
    const centerCoords = [26.9240, 75.8020];

    const map = L.map('theme-map', {
        center: centerCoords,
        zoom: 13,
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false
    });

    // Add Zoom Control at bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // 100% Free, no API key required, reliable worldwide street tiles (Esri WorldStreetMap)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012'
    }).addTo(map);

    // Landmarks dataset
    const landmarks = {
        'pinkoaks': {
            coords: pinkOaksCoords,
            title: 'PINK OAKS',
            desc: 'Site Location | Bani Park, Jaipur',
            type: 'pinkoaks'
        },
        'mi-road': {
            coords: [26.9210, 75.8080],
            title: 'M.I. Road',
            desc: '5 mins drive | Premier Shopping Hub',
            type: 'shopping'
        },
        'railway': {
            coords: [26.9216, 75.7865],
            title: 'Railway Station',
            desc: '10 mins drive | Main Transport Hub',
            type: 'transit'
        },
        'cscheme': {
            coords: [26.9085, 75.7980],
            title: 'C-Scheme',
            desc: '10 mins drive | Upscale Commercial Zone',
            type: 'shopping'
        },
        'citypalace': {
            coords: [26.9258, 75.8237],
            title: 'City Palace',
            desc: '15 mins drive | Royal Heritage Quarter',
            type: 'shopping'
        },
        'airport': {
            coords: [26.8289, 75.8056],
            title: 'Jaipur Airport',
            desc: '25 mins drive | International Airport',
            type: 'transit'
        }
    };

    const markersMap = {};

    // 1. Create Pink Oaks Main Site Marker
    const pinkIcon = L.divIcon({
        className: 'custom-leaflet-marker',
        html: `<div class="leaflet-pink-oaks-pin">❖</div>`,
        iconSize: [42, 42],
        iconAnchor: [21, 21]
    });

    const pinkMarker = L.marker(landmarks['pinkoaks'].coords, { icon: pinkIcon }).addTo(map);
    pinkMarker.bindPopup(`
        <div class="map-popup-card">
            <h4 class="map-popup-title">PINK OAKS</h4>
            <p class="map-popup-desc">3 & 4 BHK Boutique Residences<br>Bani Park, Jaipur</p>
        </div>
    `);
    markersMap['pinkoaks'] = pinkMarker;

    // 2. Create Landmark Markers
    Object.keys(landmarks).forEach(key => {
        if (key === 'pinkoaks') return;
        const item = landmarks[key];

        const lmIcon = L.divIcon({
            className: 'custom-landmark-marker',
            html: `<div class="leaflet-landmark-pin"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="vertical-align: middle; margin-right: 2px;"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg> ${item.title}</div>`,
            iconSize: null,
            iconAnchor: [50, 15]
        });

        const marker = L.marker(item.coords, { icon: lmIcon }).addTo(map);
        marker.bindPopup(`
            <div class="map-popup-card">
                <h4 class="map-popup-title">${item.title}</h4>
                <p class="map-popup-desc">${item.desc}</p>
            </div>
        `);
        markersMap[key] = marker;
    });

    // 3. Distance List Item Click / Hover Interactivity
    const distanceItems = document.querySelectorAll('.distance-item');
    if (distanceItems.length > 0) {
        distanceItems.forEach(item => {
            const landmarkKey = item.getAttribute('data-landmark');

            item.addEventListener('mouseenter', () => {
                distanceItems.forEach(i => i.classList.remove('highlight'));
                item.classList.add('highlight');
                if (markersMap[landmarkKey]) {
                    const targetCoords = landmarks[landmarkKey].coords;
                    map.panTo(targetCoords, { animate: true, duration: 0.8 });
                    markersMap[landmarkKey].openPopup();
                }
            });

            item.addEventListener('click', () => {
                if (markersMap[landmarkKey]) {
                    map.flyTo(landmarks[landmarkKey].coords, 14, { duration: 1.2 });
                    markersMap[landmarkKey].openPopup();
                }
            });
        });
    }

    // 4. Category Filter Tabs
    const filterTabs = document.querySelectorAll('.loc-tab');
    if (filterTabs.length > 0) {
        filterTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                filterTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                const category = tab.getAttribute('data-filter');
                distanceItems.forEach(item => {
                    const type = item.getAttribute('data-type');
                    if (category === 'all' || type === category) {
                        item.style.display = 'flex';
                    } else {
                        item.style.display = 'none';
                    }
                });
            });
        });
    }

    // 5. Invalidate Size Triggers to ensure proper rendering across devices & animations
    const forceMapUpdate = () => {
        if (map) {
            map.invalidateSize();
        }
    };

    setTimeout(forceMapUpdate, 250);
    setTimeout(forceMapUpdate, 600);
    setTimeout(forceMapUpdate, 1200);
    window.addEventListener('resize', forceMapUpdate);
    window.addEventListener('load', forceMapUpdate);

    // ResizeObserver if available
    if (window.ResizeObserver && mapContainer) {
        const ro = new ResizeObserver(() => forceMapUpdate());
        ro.observe(mapContainer);
    }
}

/* ==========================================================================
   5. Site Visit Booking Modal Form
   ========================================================================== */
function initBookingModal() {
    const modal = document.getElementById('modal-booking');
    const triggers = document.querySelectorAll('.trigger-modal-booking');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const form = document.getElementById('booking-form');
    const dateInput = document.getElementById('preferred-date');

    // Set min date to today
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('user-name').value;
            const phone = document.getElementById('user-phone').value;
            const unit = document.getElementById('unit-interest').value;

            closeModal(modal);
            showToast(`Thank you, ${name}! Your site visit request for ${unit} has been received. We will contact you at ${phone}.`);
            form.reset();
        });
    }
}

/* ==========================================================================
   6. Floorplan Lightbox & Interactive Blueprint Render
   ========================================================================== */
const FLOOR_PLAN_DATA = {
    'flat-a': {
        title: 'FLAT TYPE A — 3 BHK',
        sub: 'Built-up Area: 1,615 sq.ft. | Sale Area: 2,260 sq.ft.',
        svgPath: 'assets/flat_a.png',
        specs: [
            '3 Bedrooms with 4 Washrooms for enhanced family comfort',
            'Spacious L-shaped living and dining area forms heart of home',
            'Dedicated Puja space & Utility balcony',
            '10-Foot ceilings with natural cross-ventilation',
            'Vastu certified by 265 Degree Consultants'
        ]
    },
    'flat-b': {
        title: 'FLAT TYPE B — 4 BHK (Signature Residence)',
        sub: 'Built-up Area: 1,880 sq.ft. | Sale Area: 2,635 sq.ft.',
        svgPath: 'assets/flat_b.png',
        specs: [
            '4 Bedrooms & 4 Balconies filled with natural light',
            'Expansive social spaces created for a full family life',
            'A home designed for privacy when you want it and togetherness when it matters',
            'Dedicated Puja room & Dress areas',
            '10-Foot ceilings & Vastu certified by 265 Degree Consultants'
        ]
    },
    'flat-c': {
        title: 'FLAT TYPE C — 3 BHK',
        sub: 'Built-up Area: 1,550 sq.ft. | Sale Area: 2,170 sq.ft.',
        svgPath: 'assets/flat_c.png',
        specs: [
            'Generous 15’3” × 26’3” dining-cum-living space',
            'Dedicated Puja room, dress areas & utility balcony',
            'A 3 BHK that lives considerably larger than its label',
            '10-Foot ceilings with natural light in every room',
            'Vastu certified by 265 Degree Consultants'
        ]
    }
};

function initFloorplanModal() {
    const modal = document.getElementById('modal-floorplan');
    const triggers = document.querySelectorAll('.trigger-modal-floorplan, .plan-image-frame');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const tabBtns = document.querySelectorAll('.plan-tabs .tab-btn');

    triggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const planKey = trigger.getAttribute('data-plan') || 'flat-a';
            loadFloorplanContent(planKey);
            openModal(modal);
        });
    });

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const planKey = btn.getAttribute('data-tab');
            loadFloorplanContent(planKey);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    }
}

function loadFloorplanContent(key) {
    const data = FLOOR_PLAN_DATA[key] || FLOOR_PLAN_DATA['flat-a'];
    document.getElementById('fp-modal-title').textContent = data.title;
    document.getElementById('fp-modal-sub').textContent = data.sub;

    const graphicContainer = document.getElementById('floorplan-graphic');
    if (graphicContainer) {
        graphicContainer.innerHTML = data.svg;
    }

    const specsList = document.getElementById('fp-specs-list');
    if (specsList) {
        specsList.innerHTML = data.specs.map(spec => `<li>${spec}</li>`).join('');
    }

    // Update active tab styling
    document.querySelectorAll('.plan-tabs .tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === key);
    });
}

/* ==========================================================================
   Brochure Modal Handler
   ========================================================================== */
function initBrochureModal() {
    const modal = document.getElementById('modal-brochure');
    const triggers = document.querySelectorAll('.trigger-modal-brochure');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const form = document.getElementById('brochure-form');

    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            openModal(modal);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('brochure-name').value;
            const email = document.getElementById('brochure-email').value;

            closeModal(modal);
            showToast(`e-Brochure successfully sent to ${email}. Thank you, ${name}!`);
            form.reset();
        });
    }
}

/* ==========================================================================
   Image Lightbox Viewer Handler
   ========================================================================== */
function initLightboxModal() {
    const modal = document.getElementById('modal-lightbox');
    const triggers = document.querySelectorAll('.hero-bg-visual, .interior-image-frame');
    const closeBtn = modal ? modal.querySelector('.modal-close') : null;
    const viewer = document.getElementById('lightbox-viewer');

    triggers.forEach(trigger => {
        trigger.style.cursor = 'pointer';
        trigger.addEventListener('click', () => {
            if (viewer) {
                viewer.innerHTML = `
                    <div style="text-align:center; padding: 20px;">
                        <img src="1787637120542_0.webp" style="max-width:100%; border-radius: 12px; box-shadow: 0 10px 40px rgba(0,0,0,0.5);" alt="Pink Oaks Preview">
                        <p style="margin-top: 16px; font-family: var(--font-serif); font-size: 1.2rem; color: #FAF8F5;">PINK OAKS — BANI PARK, JAIPUR</p>
                    </div>
                `;
            }
            openModal(modal);
        });
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => closeModal(modal));
    }

    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal(modal);
        });
    }
}

/* ==========================================================================
   Residence Calculator Handler
   ========================================================================== */
function initCalculator() {
    const flatSelect = document.getElementById('calc-flat');
    const dpRange = document.getElementById('calc-dp-range');
    const tenureRange = document.getElementById('calc-tenure-range');
    const dpPercentVal = document.getElementById('dp-percent-val');
    const tenureVal = document.getElementById('tenure-val');

    const emiEl = document.getElementById('calc-emi');
    const totalPriceEl = document.getElementById('calc-total-price');
    const dpAmountEl = document.getElementById('calc-dp-amount');
    const loanAmountEl = document.getElementById('calc-loan-amount');

    if (!flatSelect || !dpRange || !tenureRange) return;

    function updateCalc() {
        const total = parseFloat(flatSelect.value);
        const dpPercent = parseFloat(dpRange.value);
        const tenureYears = parseFloat(tenureRange.value);

        if (dpPercentVal) dpPercentVal.textContent = `${dpPercent}%`;
        if (tenureVal) tenureVal.textContent = `${tenureYears} Years`;

        const dpAmount = total * (dpPercent / 100);
        const loanAmount = total - dpAmount;

        // Interest rate default 8.5%
        const annualRate = 8.5;
        const monthlyRate = annualRate / 12 / 100;
        const totalMonths = tenureYears * 12;

        const emi = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

        if (totalPriceEl) totalPriceEl.textContent = `₹ ${(total / 10000000).toFixed(2)} Cr`;
        if (dpAmountEl) dpAmountEl.textContent = `₹ ${(dpAmount / 100000).toFixed(1)} Lacs`;
        if (loanAmountEl) loanAmountEl.textContent = `₹ ${(loanAmount / 10000000).toFixed(2)} Cr`;
        if (emiEl) emiEl.textContent = `₹ ${Math.round(emi).toLocaleString('en-IN')} / mo`;
    }

    flatSelect.addEventListener('change', updateCalc);
    dpRange.addEventListener('input', updateCalc);
    tenureRange.addEventListener('input', updateCalc);

    updateCalc();
}

/* ==========================================================================
   7. Modal Utilities
   ========================================================================== */
function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

// ESC Key listener
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal(document.getElementById('modal-booking'));
        closeModal(document.getElementById('modal-floorplan'));
    }
});

/* ==========================================================================
   8. Toast System & Back to Top
   ========================================================================== */
function showToast(message) {
    const toast = document.getElementById('toast-msg');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

/* ==========================================================================
   Canvas Asset Cropper Engine
   ========================================================================== */
function autoCropAssets() {
    const img = new Image();
    img.src = '1787637120542_0.webp';
    img.onload = () => {
        const w = img.naturalWidth;
        const h = img.naturalHeight;

        function cropToDataUrl(cropX, cropY, cropW, cropH) {
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(cropW);
            canvas.height = Math.round(cropH);
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, cropW, cropH);
            return canvas.toDataURL('image/png');
        }

        // 1. Hero visual (right side of hero section)
        const heroUrl = cropToDataUrl(w * 0.35, 0, w * 0.65, h * 0.22);
        const heroBg = document.getElementById('hero-bg-visual');
        if (heroBg) {
            heroBg.style.backgroundImage = `url(${heroUrl})`;
            heroBg.style.backgroundSize = 'cover';
            heroBg.style.backgroundPosition = 'center right';
        }

        // 2. Interior room
        const interiorUrl = cropToDataUrl(w * 0.42, h * 0.32, w * 0.58, h * 0.14);
        const interiorBg = document.querySelector('.interior-crop-bg');
        if (interiorBg) {
            interiorBg.style.backgroundImage = `url(${interiorUrl})`;
            interiorBg.style.backgroundSize = 'cover';
            interiorBg.style.backgroundPosition = 'center';
        }

        // 3. Map
        const mapUrl = cropToDataUrl(0, h * 0.55, w * 0.52, h * 0.14);
        const mapBg = document.querySelector('.map-crop-bg');
        if (mapBg) {
            mapBg.style.backgroundImage = `url(${mapUrl})`;
            mapBg.style.backgroundSize = 'cover';
            mapBg.style.backgroundPosition = 'center';
        }

        // 4. Floor plans
        const flatAUrl = cropToDataUrl(w * 0.17, h * 0.725, w * 0.17, h * 0.08);
        const flatACrop = document.querySelector('.crop-flat-a');
        if (flatACrop) {
            flatACrop.style.backgroundImage = `url(${flatAUrl})`;
            flatACrop.style.backgroundSize = 'contain';
            flatACrop.style.backgroundPosition = 'center';
            flatACrop.style.backgroundRepeat = 'no-repeat';
        }

        const flatBUrl = cropToDataUrl(w * 0.47, h * 0.725, w * 0.17, h * 0.08);
        const flatBCrop = document.querySelector('.crop-flat-b');
        if (flatBCrop) {
            flatBCrop.style.backgroundImage = `url(${flatBUrl})`;
            flatBCrop.style.backgroundSize = 'contain';
            flatBCrop.style.backgroundPosition = 'center';
            flatBCrop.style.backgroundRepeat = 'no-repeat';
        }

        const flatCUrl = cropToDataUrl(w * 0.77, h * 0.725, w * 0.19, h * 0.08);
        const flatCCrop = document.querySelector('.crop-flat-c');
        if (flatCCrop) {
            flatCCrop.style.backgroundImage = `url(${flatCUrl})`;
            flatCCrop.style.backgroundSize = 'contain';
            flatCCrop.style.backgroundPosition = 'center';
            flatCCrop.style.backgroundRepeat = 'no-repeat';
        }

        // 5. Cherry Blossom Banner
        const blossomUrl = cropToDataUrl(0, h * 0.81, w * 0.55, h * 0.07);
        const blossomBg = document.querySelector('.blossom-banner-bg');
        if (blossomBg) {
            blossomBg.style.backgroundImage = `url(${blossomUrl})`;
            blossomBg.style.backgroundSize = 'cover';
            blossomBg.style.backgroundPosition = 'center';
        }
    };
}

/* ==========================================================================
   Page Site Visit Form Handler
   ========================================================================== */
function initPageVisitForm() {
    const form = document.getElementById('page-visit-form');
    const dateInput = document.getElementById('visit-date');

    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.min = today;
        dateInput.value = today;
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('visit-name').value;
            const phone = document.getElementById('visit-phone').value;
            const interest = document.getElementById('visit-interest').value;
            const date = document.getElementById('visit-date').value;
            const time = document.getElementById('visit-time').value;

            showToast(`Thank you, ${name}! Your site visit appointment for ${interest} on ${date} (${time}) is confirmed. We will reach out to ${phone}.`);
            form.reset();
        });
    }
}

/* ==========================================================================
   Aesthetic GSAP & Lenis Motion Engine
   ========================================================================== */
function initAestheticAnimations() {
    // 1. Initialize Lenis Smooth Inertial Scroll
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            touchMultiplier: 1.8
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0, 0);
        }
    }

    // 2. GSAP ScrollTrigger Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Stagger Reveal for Section Titles
        gsap.utils.toArray('.section-title, .page-hero-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: 'top 88%',
                    toggleActions: 'play none none reverse'
                },
                y: 35,
                opacity: 0,
                duration: 1,
                ease: 'power3.out'
            });
        });

        // Stagger Cards Reveal
        gsap.utils.toArray('.pillars-grid, .amenities-grid, .floorplan-cards-grid').forEach(grid => {
            const cards = grid.children;
            gsap.from(cards, {
                scrollTrigger: {
                    trigger: grid,
                    start: 'top 82%',
                    toggleActions: 'play none none reverse'
                },
                y: 45,
                opacity: 0,
                duration: 0.85,
                stagger: 0.12,
                ease: 'power3.out'
            });
        });

        // Image Parallax Scroll Effect
        gsap.utils.toArray('.interior-image-frame, .family-card-main, .map-container').forEach(imgFrame => {
            gsap.to(imgFrame, {
                scrollTrigger: {
                    trigger: imgFrame,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1.2
                },
                y: -20,
                ease: 'none'
            });
        });

        // Floral Motif Rotation on Scroll
        gsap.utils.toArray('.floral-motif').forEach(flower => {
            gsap.to(flower, {
                scrollTrigger: {
                    trigger: flower,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                rotation: 90,
                ease: 'none'
            });
        });
    }
}

function initBackToTop() {
    const backBtn = document.getElementById('back-to-top');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            if (lenisEngine) {
                lenisEngine.scrollTo(0, { duration: 1.2 });
            } else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }
        });
    }
}

/* ==========================================================================
   9. LUXURY GSAP & LENIS MOTION ENGINE
   ========================================================================== */

let lenisEngine = null;

function initLenisSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    lenisEngine = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.8,
    });

    function raf(time) {
        lenisEngine.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);
        lenisEngine.on('scroll', ScrollTrigger.update);
        gsap.ticker.add((time) => {
            lenisEngine.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }
}

function initScrollProgress() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    const progressEl = document.getElementById('scroll-progress');
    if (!progressEl) return;

    gsap.to(progressEl, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
            trigger: document.body,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.3
        }
    });
}

function initLuxuryHeroTimeline() {
    if (typeof gsap === 'undefined') return;

    const heroTl = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1.1 } });

    // Hero visual entrance & scale reveal
    const heroBg = document.getElementById('hero-bg-visual');
    if (heroBg) {
        heroTl.fromTo(heroBg, 
            { scale: 1.2, opacity: 0 },
            { scale: 1, opacity: 1, duration: 1.6 },
            0
        );

        // Subtle Parallax on Hero Visual
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.to(heroBg, {
                yPercent: 12,
                ease: 'none',
                scrollTrigger: {
                    trigger: '.hero-section',
                    start: 'top top',
                    end: 'bottom top',
                    scrub: true
                }
            });
        }
    }

    // Hero Text Stagger Entrance
    if (document.querySelector('.hero-title')) {
        heroTl.fromTo('.hero-title',
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1.2 },
            0.2
        );
    }

    if (document.querySelector('.hero-divider')) {
        heroTl.fromTo('.hero-divider',
            { scale: 0, rotation: -45, opacity: 0 },
            { scale: 1, rotation: 0, opacity: 1, duration: 0.8, ease: 'back.out(1.7)' },
            0.5
        );
    }

    if (document.querySelector('.hero-tagline')) {
        heroTl.fromTo('.hero-tagline',
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 1 },
            0.6
        );
    }

    if (document.querySelectorAll('.hero-cta-group .btn-primary, .hero-cta-group .btn-secondary').length) {
        heroTl.fromTo('.hero-cta-group .btn-primary, .hero-cta-group .btn-secondary',
            { y: 25, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.9, stagger: 0.15 },
            0.8
        );
    }

    if (document.querySelector('.rera-badge')) {
        heroTl.fromTo('.rera-badge',
            { opacity: 0 },
            { opacity: 1, duration: 1 },
            1.1
        );
    }
}

function initSectionScrollReveals() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    // Batch reveal elements for smooth staggered scrolling into view
    const groups = [
        { selector: '.pillar-card', stagger: 0.1 },
        { selector: '.res-card', stagger: 0.15 },
        { selector: '.amenity-card', stagger: 0.08 },
        { selector: '.plan-card', stagger: 0.15 },
        { selector: '.spec-card', stagger: 0.12 },
        { selector: '.pricing-card', stagger: 0.15 },
        { selector: '.gallery-item', stagger: 0.1 }
    ];

    groups.forEach(group => {
        const els = document.querySelectorAll(group.selector);
        if (!els.length) return;

        gsap.fromTo(els, 
            { y: 45, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                stagger: group.stagger,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: els[0].parentElement,
                    start: 'top 85%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });

    // Section Titles & Motifs Fade Up
    document.querySelectorAll('.section-title, .section-subtitle, .section-header-center, .section-header').forEach(heading => {
        gsap.fromTo(heading,
            { y: 35, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: heading,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                }
            }
        );
    });
}

function init3DTiltPhysics() {
    const cards = document.querySelectorAll('.pillar-card, .res-card, .amenity-card, .plan-card, .spec-card, .pricing-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -6;
            const rotateY = ((x - centerX) / centerX) * 6;

            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.015, 1.015, 1.015)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

function initMagneticButtons() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary, .btn-phone');

    buttons.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'translate(0px, 0px)';
        });
    });
}


