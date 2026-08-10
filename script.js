const scrollButtons = document.querySelectorAll("[data-scroll-to]");

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTo);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const track = document.querySelector(".result-track");
const dots = [...document.querySelectorAll(".carousel-dots button")];

const updateCarouselDots = (currentIndex) => {
  dots.forEach((item, itemIndex) => {
    const isCurrent = itemIndex === currentIndex;
    item.classList.toggle("is-active", isCurrent);
    item.setAttribute("aria-current", isCurrent ? "true" : "false");
  });
};

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    track?.scrollTo({
      left: index * track.clientWidth,
      behavior: "smooth",
    });
  });
});

track?.addEventListener(
  "scroll",
  () => {
    const currentIndex = Math.round(track.scrollLeft / track.clientWidth);
    updateCarouselDots(currentIndex);
  },
  { passive: true },
);

updateCarouselDots(0);

const diagnosisScreen = document.querySelector(".diagnosis-screen");
const diagnosisStartButtons = document.querySelectorAll("[data-start-diagnosis]");
const diagnosisCloseButton = document.querySelector("[data-close-diagnosis]");
const questionOptions = document.querySelectorAll(".question-option");

const openDiagnosis = () => {
  if (!diagnosisScreen) return;

  diagnosisScreen.hidden = false;
  document.body.classList.add("is-diagnosis-open");
  window.scrollTo(0, 0);
  diagnosisCloseButton?.focus();
};

const closeDiagnosis = () => {
  if (!diagnosisScreen) return;

  diagnosisScreen.hidden = true;
  document.body.classList.remove("is-diagnosis-open");
  window.scrollTo(0, 0);
};

diagnosisStartButtons.forEach((button) => {
  button.addEventListener("click", openDiagnosis);
});

diagnosisCloseButton?.addEventListener("click", closeDiagnosis);

questionOptions.forEach((option) => {
  option.addEventListener("click", () => {
    questionOptions.forEach((item) => {
      const isSelected = item === option;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });
  });
});

const originalStartButton = document.querySelector(".cta-primary:not(.cta-floating)");
const floatingStartButton = document.querySelector(".cta-floating-bar");
const registrationSection = document.querySelector(".registration");

if (originalStartButton && floatingStartButton && registrationSection) {
  const updateFloatingButton = () => {
    const registrationTop = registrationSection.getBoundingClientRect().top;
    const hasReachedRegistration = registrationTop < window.innerHeight * 0.78;
    floatingStartButton.classList.toggle(
      "is-visible",
      window.scrollY > 150 && !hasReachedRegistration,
    );
  };

  window.addEventListener("scroll", updateFloatingButton, { passive: true });
  window.addEventListener("resize", updateFloatingButton);
  updateFloatingButton();
}

const desktopHeader = document.querySelector(".desktop-site-header");

if (desktopHeader) {
  let lastScrollY = window.scrollY;

  window.addEventListener(
    "scroll",
    () => {
      if (!window.matchMedia("(min-width: 900px)").matches) return;

      const currentScrollY = window.scrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

      if (currentScrollY > 80 && isScrollingDown) {
        desktopHeader.classList.add("is-hidden");
      } else if (!isScrollingDown || currentScrollY <= 80) {
        desktopHeader.classList.remove("is-hidden");
      }

      lastScrollY = currentScrollY;
    },
    { passive: true },
  );
}

const peekingMascot = document.querySelector(".peeking-mascot");
const problemsSection = document.querySelector(".problems");

if (peekingMascot && problemsSection) {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion && "IntersectionObserver" in window) {
    peekingMascot.classList.add("is-reveal-ready");

    const mascotObserver = new IntersectionObserver(
      ([entry], observer) => {
        if (!entry.isIntersecting) return;

        peekingMascot.classList.add("is-revealed");
        observer.unobserve(entry.target);
      },
      {
        threshold: 0.25,
        rootMargin: "0px 0px -8% 0px",
      },
    );

    mascotObserver.observe(problemsSection);
  }
}
