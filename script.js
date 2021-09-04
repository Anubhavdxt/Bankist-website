'use strict';

// Universal selector
const nav = document.querySelector('.nav');

// <======================== Modal window ========================>

const modalWindow = () => {
  // Selectors
  const modal = document.querySelector('.modal');
  const overlay = document.querySelector('.overlay');
  const btnCloseModal = document.querySelector('.btn--close-modal');
  const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

  // Functions
  const openModal = function () {
    modal.classList.remove('hidden');
    overlay.classList.remove('hidden');
  };

  const closeModal = function (e) {
    e.preventDefault();
    modal.classList.add('hidden');
    overlay.classList.add('hidden');
  };

  // Event Listeners
  btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));
  btnCloseModal.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      closeModal(e);
    }
  });
};
modalWindow();

// <========================== SMOOTH SCROLL ==========================>

const smoothScroll = () => {
  const section1 = document.querySelector('#section--1');
  const btnScrollTo = document.querySelector('.btn--scroll-to');

  btnScrollTo.addEventListener('click', function () {
    // Support Modern Browsers only
    section1.scrollIntoView({ behaviour: 'smooth' });

    // Support All Browsers
    // const s1Coords = section1.getBoundingClientRect();
    // window.scrollTo({
    //   left: s1Coords.left + window.pageXOffset,
    //   top: s1Coords.y + window.pageYOffset,
    //   behavior: 'smooth',
    // });
  });

  // Scroll when navlinks are clicked
  // Event Delegation
  document.querySelector('.nav__links').addEventListener('click', function (e) {
    e.preventDefault();
    // Matching Strategy
    if (e.target.classList.contains('nav__link')) {
      const id = e.target.getAttribute('href');
      document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
    }
  });
};
smoothScroll();

// <===================== MENU FADE ANIMATION =====================>

const fadeMenu = () => {
  const handleHover = function (e) {
    if (e.target.classList.contains('nav__link')) {
      const link = e.target;
      const siblings = link.closest('.nav').querySelectorAll('.nav__link');
      const logo = link.closest('.nav').querySelector('img');
      siblings.forEach(el => {
        if (el !== link) el.style.opacity = this;
        logo.style.opacity = this;
      });
    }
  };
  nav.addEventListener('mouseover', handleHover.bind(0.5));
  nav.addEventListener('mouseout', handleHover.bind(1));
};
fadeMenu();

// <===================== TABBED COMPONENT =====================>
// Selectors
const tabs = document.querySelectorAll('.operations__tab');
const tabsContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

// Event listeners
tabsContainer.addEventListener('click', function (e) {
  const clicked = e.target.closest('.operations__tab');

  // Guard clause
  if (!clicked) return;

  // Activate tabs
  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  clicked.classList.add('operations__tab--active');

  // Activate content
  tabsContent.forEach(t => t.classList.remove('operations__content--active'));
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

// <=========================== STICKY NAVIGATION ===========================>
// INTERSECTION OBSERVER API

const navSticky = () => {
  const header = document.querySelector('.header');

  const navHeight = nav.getBoundingClientRect().height;
  const stickyNav = function (entries) {
    const [entry] = entries;
    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
  };

  const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
  });
  headerObserver.observe(header);
};
navSticky();

// <=========================== REVEALING SECTIONS ===========================>

const animateSections = () => {
  const sections = document.querySelectorAll('.section');

  const revealSection = function (entries, observer) {
    const [entry] = entries;

    // Guard clause
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  };

  const sectionObserver = new IntersectionObserver(revealSection, {
    root: null,
    threshold: 0.15,
  });

  sections.forEach(section => {
    section.classList.add('section--hidden');
    sectionObserver.observe(section);
  });
};
animateSections();

// <=========================== LAZY LOADING ===========================>

const lazyLoad = () => {
  const imgTargets = document.querySelectorAll('img[data-src]');

  const revealImg = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;
    entry.target.src = entry.target.dataset.src;
    entry.target.addEventListener('load', () =>
      entry.target.classList.remove('lazy-img')
    );
    observer.unobserve(entry.target);
  };

  const imgObserver = new IntersectionObserver(revealImg, {
    root: null,
    threshold: 0,
    rootMargin: '200px',
  });
  imgTargets.forEach(img => imgObserver.observe(img));
};
lazyLoad();

// <===================== SLIDER =====================>
const slider = function () {
  // Selectors
  const slides = document.querySelectorAll('.slide');
  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');
  const dotContainer = document.querySelector('.dots');
  let curSlide = 0;
  const maxSlide = slides.length;

  // Functions
  const goToSlide = function (slide) {
    slides.forEach((s, i) => {
      s.style.transform = `translateX(${100 * (i - slide)}%)`;
    });
  };

  const nextSlide = function () {
    curSlide === maxSlide - 1 ? (curSlide = 0) : curSlide++;
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  const prevSlide = function () {
    curSlide === 0 ? (curSlide = maxSlide - 1) : curSlide--;
    goToSlide(curSlide);
    activateDots(curSlide);
  };

  // Activate dots
  const activateDots = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));
    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  // Create dots
  const createDots = function () {
    slides.forEach((_, i) => {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const init = () => {
    goToSlide(0);
    createDots();
    activateDots(0);
  };
  init();

  // Event listeners
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', prevSlide);
  document.addEventListener('keydown', function (e) {
    e.key === 'ArrowLeft' && prevSlide();
    e.key === 'ArrowRight' && nextSlide();
  });
  dotContainer.addEventListener('click', e => {
    if (e.target.classList.contains('dots__dot')) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDots(slide);
    }
  });
};
slider();
