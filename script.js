const scrollButtons = document.querySelectorAll("[data-scroll-to]");

scrollButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.getElementById(button.dataset.scrollTo);
    target?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

const track = document.querySelector(".result-track");
const resultCards = [...document.querySelectorAll(".result-track .result-card")];
const dots = [...document.querySelectorAll(".carousel-dots button")];
const previousCarouselButton = document.querySelector(".carousel-arrow--prev");
const nextCarouselButton = document.querySelector(".carousel-arrow--next");

let currentCarouselIndex = 0;

const updateCarouselDots = (currentIndex) => {
  currentCarouselIndex = currentIndex;
  dots.forEach((item, itemIndex) => {
    const isCurrent = itemIndex === currentIndex;
    item.classList.toggle("is-active", isCurrent);
    item.setAttribute("aria-current", isCurrent ? "true" : "false");
  });
  if (previousCarouselButton) previousCarouselButton.disabled = currentIndex === 0;
  if (nextCarouselButton) nextCarouselButton.disabled = currentIndex === resultCards.length - 1;
};

const scrollToResultCard = (index) => {
  const safeIndex = Math.max(0, Math.min(index, resultCards.length - 1));
  const targetCard = resultCards[safeIndex];
  track?.scrollTo({
    left: targetCard
      ? targetCard.offsetLeft - track.offsetLeft - (track.clientWidth - targetCard.offsetWidth) / 2
      : 0,
    behavior: "smooth",
  });
};

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    scrollToResultCard(index);
  });
});

previousCarouselButton?.addEventListener("click", () => scrollToResultCard(currentCarouselIndex - 1));
nextCarouselButton?.addEventListener("click", () => scrollToResultCard(currentCarouselIndex + 1));

track?.addEventListener(
  "scroll",
  () => {
    const currentIndex = resultCards.reduce((nearestIndex, card, index) => {
      const viewportCenter = track.scrollLeft + track.clientWidth / 2;
      const nearestCenter = resultCards[nearestIndex].offsetLeft - track.offsetLeft + resultCards[nearestIndex].offsetWidth / 2;
      const cardCenter = card.offsetLeft - track.offsetLeft + card.offsetWidth / 2;
      const nearestDistance = Math.abs(nearestCenter - viewportCenter);
      const cardDistance = Math.abs(cardCenter - viewportCenter);
      return cardDistance < nearestDistance ? index : nearestIndex;
    }, 0);
    updateCarouselDots(currentIndex);
  },
  { passive: true },
);

updateCarouselDots(0);

const diagnosisScreen = document.querySelector(".diagnosis-screen");
const resultScreen = document.querySelector(".result-screen");
const diagnosisStartButtons = document.querySelectorAll("[data-start-diagnosis]");
const diagnosisCloseButton = document.querySelector("[data-close-diagnosis]");
const questionCard = document.querySelector(".question-card");
const questionNumber = document.querySelector(".question-number");
const questionTitle = document.querySelector("#question-title");
const questionOptions = [...document.querySelectorAll(".question-option")];
const questionProgress = document.querySelector(".diagnosis-progress");
const questionProgressBar = document.querySelector(".diagnosis-progress span");
const questionMascotText = document.querySelector(".question-mascot p");
const retryDiagnosisButton = document.querySelector("[data-retry-diagnosis]");
const resultHomeButton = document.querySelector("[data-return-home]");

const questions = [
  {
    title: "給料日が来たとき、<br />最初にしがちなことは？",
    answers: [
      "今月の予算や貯金額を<br />細かく決める",
      "入金を確認して、<br />いつも通り過ごす",
      "頑張った自分への<br />ごほうびを買う",
      "SNSで話題の商品を<br />チェックする",
    ],
  },
  {
    title: "月末に『思ったより<br />お金がない！』となったら？",
    answers: [
      "節約方法を調べて、<br />新しい方法を試す",
      "何に使ったのか、<br />あまり思い出せない",
      "楽しく使えたから<br />仕方ないと思う",
      "話題のものを<br />買いすぎたかもと思う",
    ],
  },
  {
    title: "コンビニやネットショップで、<br />ついやってしまうのは？",
    answers: [
      "ポイントや割引を調べるうちに、予定外のものまで買う",
      "少額だからいいかと、<br />なんとなく買う",
      "疲れた日にスイーツや<br />ごほうびを買う",
      "話題の商品や限定品を<br />見つけると買う",
    ],
  },
  {
    title: "貯金や家計管理について、<br />一番近いのは？",
    answers: [
      "管理方法をいろいろ試すけれど、<br />長続きしない",
      "残高は見るけれど、<br />支出の内訳は把握していない",
      "貯めたいけれど、今の楽しみも<br />我慢したくない",
      "周りで話題の方法を見ると、<br />自分も試したくなる",
    ],
  },
  {
    title: "もし自由に使える<br />1万円があったら？",
    answers: [
      "お得な使い方を念入りに<br />調べてから決める",
      "日々の買い物で、<br />いつの間にか使い切る",
      "欲しかったものや<br />特別な体験に使う",
      "今話題のアイテムや<br />サービスに使う",
    ],
  },
];

const answerTypes = ["A", "B", "C", "D"];
const resultContent = [
  { label: "カラ周り", name: "ハムスター", image: "assets/character-hamster.png", alt: "カラ周りハムスター", stats: [90, 5, 25], tags: ["#毎日コツコツ", "#調べすぎ迷子", "#がんばり損"], description: "節約やポイ活にはとっても前向き！<br>でも、お得な方法を調べたり、いろいろ試したりするうちに、手間ばかり増えているかも。頑張る量を増やすより、効果の高い方法をひとつに絞ることが、貯まる近道です。" },
  { label: "記憶喪失の", name: "カラス", image: "assets/character-crow.png", alt: "記憶喪失のカラス", stats: [35, 20, 15], tags: ["#いつの間にか", "#少額の積み重ね", "#記録がカギ"], description: "日々のお買い物を自然体で楽しめるタイプ。<br>ただ、ひとつひとつは小さな出費でも、振り返ると大きくなっていることがありそう。まずは使った金額を見える化するだけで、無理なく貯まりやすくなります。" },
  { label: "ごほうび依存の", name: "トイプー", image: "assets/character-toypoodle.png", alt: "ごほうび依存のトイプー", stats: [65, 35, 70], tags: ["#自分にごほうび", "#今を楽しむ", "#先取りがカギ"], description: "頑張った分だけ、自分を喜ばせることを大切にできるタイプ。<br>楽しみを全部我慢する必要はありません。使う前に少しだけ貯める仕組みを作れば、ごほうびも貯金も両立しやすくなります。" },
  { label: "ミーハーな", name: "ミーアキャット", image: "assets/character-meerkat.png", alt: "ミーハーなミーアキャット", stats: [80, 40, 55], tags: ["#新しいもの好き", "#限定に弱い", "#予算で安心"], description: "新しいサービスや話題の商品を見つけるのが得意なタイプ。<br>好奇心はそのままに、使ってよい金額を先に決めておくのがおすすめ。予算の中なら、罪悪感なくトレンドを楽しめます。" },
];
let currentQuestionIndex = 0;
let diagnosisAnswers = Array(questions.length).fill(null);
let questionAdvanceTimer;

const renderQuestion = (index) => {
  currentQuestionIndex = index;
  const question = questions[index];
  const savedAnswer = diagnosisAnswers[index];

  diagnosisScreen?.setAttribute("aria-label", `お金の漏れグセ診断 Q${index + 1}`);
  if (questionNumber) questionNumber.textContent = `Q${index + 1}`;
  if (questionTitle) questionTitle.innerHTML = question.title;
  if (questionProgress) questionProgress.setAttribute("aria-label", `全5問中${index + 1}問目`);
  if (questionProgressBar) questionProgressBar.style.width = `${((index + 1) / questions.length) * 100}%`;
  if (questionMascotText) questionMascotText.textContent = index === 4 ? "あと1問！直感で選んでね。" : "直感で選んでね。";

  questionOptions.forEach((option, optionIndex) => {
    const answerText = option.querySelector(".answer-letter + span");
    if (answerText) answerText.innerHTML = question.answers[optionIndex];
    const isSelected = savedAnswer === answerTypes[optionIndex];
    option.classList.toggle("is-selected", isSelected);
    option.setAttribute("aria-pressed", String(isSelected));
  });

  questionCard?.classList.remove("is-changing");
  window.scrollTo(0, 0);
};

const determineResultIndex = () => {
  const totals = answerTypes.map((type) => diagnosisAnswers.filter((answer) => answer === type).length);
  const highestTotal = Math.max(...totals);
  const tiedTypes = answerTypes.filter((type, index) => totals[index] === highestTotal);

  if (tiedTypes.length === 1) return answerTypes.indexOf(tiedTypes[0]);
  return answerTypes.indexOf(diagnosisAnswers[diagnosisAnswers.length - 1]);
};

const showDiagnosisResult = () => {
  const resultIndex = determineResultIndex();
  const content = resultContent[resultIndex];
  closeDiagnosis();
  if (!resultScreen) return;

  resultScreen.querySelector(".result-type-label").textContent = content.label;
  resultScreen.querySelector(".result-type-name").textContent = content.name;
  const resultImage = resultScreen.querySelector(".result-character img");
  resultImage.src = content.image;
  resultImage.alt = content.alt;
  resultScreen.querySelectorAll(".result-stats strong").forEach((item, index) => { item.innerHTML = `${content.stats[index]}<small>%</small>`; });
  resultScreen.querySelectorAll(".result-stats i").forEach((item, index) => item.style.setProperty("--score", `${content.stats[index]}%`));
  resultScreen.querySelector(".result-tags").innerHTML = content.tags.map((tag) => `<span>${tag}</span>`).join("");
  resultScreen.querySelector(".result-description p").innerHTML = content.description;
  resultScreen.dataset.type = answerTypes[resultIndex].toLowerCase();
  resultScreen.hidden = false;
  document.body.classList.add("is-result-open");
  requestAnimationFrame(() => window.scrollTo(0, 0));
};

retryDiagnosisButton?.addEventListener("click", () => {
  if (resultScreen) resultScreen.hidden = true;
  document.body.classList.remove("is-result-open");
  openDiagnosis();
});

resultHomeButton?.addEventListener("click", () => {
  if (resultScreen) resultScreen.hidden = true;
  document.body.classList.remove("is-result-open");
  window.scrollTo({ top: 0, behavior: "auto" });
});

document.querySelectorAll(".share-buttons a").forEach((button) => {
  button.addEventListener("click", (event) => {
    event.preventDefault();
  });
});

const openDiagnosis = () => {
  if (!diagnosisScreen) return;

  window.clearTimeout(questionAdvanceTimer);
  diagnosisAnswers = Array(questions.length).fill(null);
  renderQuestion(0);
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

diagnosisCloseButton?.addEventListener("click", () => {
  window.clearTimeout(questionAdvanceTimer);
  if (currentQuestionIndex === 0) {
    closeDiagnosis();
    return;
  }

  questionCard?.classList.add("is-changing");
  window.setTimeout(() => renderQuestion(currentQuestionIndex - 1), 140);
});

questionOptions.forEach((option) => {
  option.addEventListener("click", () => {
    window.clearTimeout(questionAdvanceTimer);
    questionOptions.forEach((item) => {
      const isSelected = item === option;
      item.classList.toggle("is-selected", isSelected);
      item.setAttribute("aria-pressed", String(isSelected));
    });

    diagnosisAnswers[currentQuestionIndex] = option.dataset.answer;
    questionAdvanceTimer = window.setTimeout(() => {
      if (currentQuestionIndex === questions.length - 1) {
        showDiagnosisResult();
        return;
      }

      questionCard?.classList.add("is-changing");
      window.setTimeout(() => renderQuestion(currentQuestionIndex + 1), 140);
    }, 260);
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
