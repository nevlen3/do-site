const header = document.querySelector("header");
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll('.menu a[href^="#"]');
const faqItems = document.querySelectorAll(".faq-item");

// Closes mobile navigation and resets accessibility state.
// Закрывает мобильное меню и сбрасывает состояние для доступности.
function closeMenu() {
  document.body.classList.remove("nav-open");
  if (menuToggle) {
    menuToggle.setAttribute("aria-expanded", "false");
  }
}

if (menuToggle) {
  // Toggles mobile navigation open/close on burger button click.
  // Переключает мобильное меню (открыть/закрыть) по клику на бургер.
  menuToggle.addEventListener("click", () => {
    const isOpen = document.body.classList.toggle("nav-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

menuLinks.forEach((link) => {
  // Smoothly scrolls to target section and compensates fixed header height.
  // Плавно прокручивает к секции и учитывает высоту фиксированного хедера.
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");
    if (!targetId || !targetId.startsWith("#")) {
      return;
    }

    const target = document.querySelector(targetId);
    if (!target) {
      return;
    }

    event.preventDefault();

    const headerHeight = header ? header.offsetHeight : 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerHeight + 6;

    window.scrollTo({
      top: y,
      behavior: "smooth"
    });

    closeMenu();
  });
});

if (menu) {
  // Closes mobile menu when user clicks outside menu area.
  // Закрывает мобильное меню при клике вне области меню.
  document.addEventListener("click", (event) => {
    const clickedInsideMenu = menu.contains(event.target);
    const clickedToggle = menuToggle && menuToggle.contains(event.target);

    if (!clickedInsideMenu && !clickedToggle) {
      closeMenu();
    }
  });
}

function openFaqItem(item) {
  const answer = item.querySelector(".faq-answer");
  const button = item.querySelector(".faq-question");
  if (!answer || !button) {
    return;
  }

  item.classList.add("is-open");
  button.setAttribute("aria-expanded", "true");
  answer.style.maxHeight = `${answer.scrollHeight}px`;
}

function closeFaqItem(item) {
  const answer = item.querySelector(".faq-answer");
  const button = item.querySelector(".faq-question");
  if (!answer || !button) {
    return;
  }

  item.classList.remove("is-open");
  button.setAttribute("aria-expanded", "false");
  answer.style.maxHeight = "0px";
}

if (faqItems.length > 0) {
  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    if (!button) {
      return;
    }

    if (item.classList.contains("is-open")) {
      openFaqItem(item);
    } else {
      closeFaqItem(item);
    }

    button.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");

      faqItems.forEach((otherItem) => {
        if (otherItem !== item) {
          closeFaqItem(otherItem);
        }
      });

      if (isOpen) {
        closeFaqItem(item);
      } else {
        openFaqItem(item);
      }
    });
  });

  window.addEventListener("resize", () => {
    faqItems.forEach((item) => {
      if (item.classList.contains("is-open")) {
        const answer = item.querySelector(".faq-answer");
        if (answer) {
          answer.style.maxHeight = `${answer.scrollHeight}px`;
        }
      }
    });
  });
}

const portfolioTrack = document.querySelector(".portfolio-track");
const portfolioPrev = document.querySelector("[data-carousel-prev]");
const portfolioNext = document.querySelector("[data-carousel-next]");
const portfolioModal = document.querySelector("#portfolioModal");
const portfolioModalTitle = document.querySelector("#portfolioModalTitle");
const portfolioModalGallery = document.querySelector("#portfolioModalGallery");
const portfolioModalOrder = document.querySelector("#portfolioModalOrder");
const orderSection = document.querySelector("#order");
const orderServiceSelect = document.querySelector('#orderForm select[name="service"]');

const portfolioSamples = {
  "appearance-retouching": [
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498843053639-170ff2122f35?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519699047748-de8e457a634e?q=80&w=1200&auto=format&fit=crop"
  ],
  "ai-art-ai-photoshoots": [
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464863979621-258859e62245?q=80&w=1200&auto=format&fit=crop"
  ],
  "photo-restoration": [
    "https://images.unsplash.com/photo-1473283147055-e39c5146c6c3?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1464863979621-258859e62245?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?q=80&w=1200&auto=format&fit=crop"
  ],
  "photo-manipulation-collages": [
    "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1472145246862-b24cf25c4a36?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=1200&auto=format&fit=crop"
  ],
  "face-swap": [
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521119989659-a83eee488004?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1200&auto=format&fit=crop"
  ],
  "photo-quality-enhancement": [
    "https://images.unsplash.com/photo-1516726817505-f5ed825624d8?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1487412912498-0447578fcca8?q=80&w=1200&auto=format&fit=crop"
  ],
  "covers-design": [
    "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1516382799247-87df95d790b7?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?q=80&w=1200&auto=format&fit=crop"
  ],
  "social-media-editing": [
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=1200&auto=format&fit=crop"
  ],
  "creative-digital-editing": [
    "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=1200&auto=format&fit=crop"
  ],
  other: [
    "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1200&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200&auto=format&fit=crop"
  ]
};

let activeService = "";

function renderModalGallery(serviceKey, serviceTitle) {
  if (!portfolioModalGallery) {
    return;
  }

  const images = portfolioSamples[serviceKey] || portfolioSamples.other;
  portfolioModalGallery.innerHTML = "";

  images.slice(0, 3).forEach((url, index) => {
    const image = document.createElement("img");
    image.src = url;
    image.alt = `${serviceTitle} sample ${index + 1}`;
    image.loading = "lazy";
    portfolioModalGallery.append(image);
  });
}

function closePortfolioModal() {
  if (!portfolioModal) {
    return;
  }

  portfolioModal.classList.remove("is-open");
  portfolioModal.setAttribute("aria-hidden", "true");
}

function openPortfolioModal(serviceKey, serviceTitle) {
  if (!portfolioModal || !portfolioModalTitle) {
    return;
  }

  activeService = serviceKey;
  if (portfolioModalOrder) {
    portfolioModalOrder.dataset.service = serviceKey;
  }
  portfolioModalTitle.textContent = serviceTitle;
  renderModalGallery(serviceKey, serviceTitle);
  portfolioModal.classList.add("is-open");
  portfolioModal.setAttribute("aria-hidden", "false");
}

if (portfolioTrack) {
  portfolioTrack.addEventListener("click", (event) => {
    const card = event.target.closest(".work-card");

    if (!card) {
      return;
    }

    const serviceKey = card.dataset.service;
    const heading = card.querySelector(".overlay h3");

    if (!serviceKey || !heading) {
      return;
    }

    openPortfolioModal(serviceKey, heading.textContent.trim());
  });
}

if (portfolioModal) {
  portfolioModal.querySelectorAll("[data-modal-close]").forEach((closeElement) => {
    closeElement.addEventListener("click", closePortfolioModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closePortfolioModal();
      closeAuthModal();
      closeSupportModal();
    }
  });
}

if (portfolioModalOrder) {
  portfolioModalOrder.addEventListener("click", () => {
    const selectedService = portfolioModalOrder.dataset.service || activeService;

    if (orderServiceSelect && selectedService) {
      orderServiceSelect.value = selectedService;
    }

    closePortfolioModal();

    if (orderSection) {
      const headerHeight = header ? header.offsetHeight : 0;
      const y = orderSection.getBoundingClientRect().top + window.scrollY - headerHeight + 6;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    }
  });
}

if (portfolioTrack) {
  const originalCards = Array.from(portfolioTrack.children);

  if (originalCards.length > 0) {
    const beforeSet = document.createDocumentFragment();
    const afterSet = document.createDocumentFragment();
    let firstAfterClone = null;
    let startScroll = 0;
    let loopDistance = 0;
    let isJumping = false;

    originalCards.forEach((card) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.dataset.carouselClone = "before";
      beforeSet.append(clone);
    });

    originalCards.forEach((card, index) => {
      const clone = card.cloneNode(true);
      clone.setAttribute("aria-hidden", "true");
      clone.dataset.carouselClone = "after";

      if (index === 0) {
        firstAfterClone = clone;
      }

      afterSet.append(clone);
    });

    portfolioTrack.prepend(beforeSet);
    portfolioTrack.append(afterSet);

    const getCardStep = () => {
      const card = portfolioTrack.querySelector(".work-card");
      const styles = window.getComputedStyle(portfolioTrack);
      const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;

      return card ? card.getBoundingClientRect().width + gap : portfolioTrack.clientWidth;
    };

    const jumpTo = (left) => {
      isJumping = true;
      portfolioTrack.style.scrollBehavior = "auto";
      portfolioTrack.scrollLeft = left;

      requestAnimationFrame(() => {
        portfolioTrack.style.scrollBehavior = "";
        isJumping = false;
      });
    };

    const getCenteredScroll = (card) => {
      return card.offsetLeft - (portfolioTrack.clientWidth - card.offsetWidth) / 2;
    };

    const measureCarousel = () => {
      startScroll = getCenteredScroll(originalCards[0]);
      loopDistance = firstAfterClone ? getCenteredScroll(firstAfterClone) - startScroll : portfolioTrack.scrollWidth / 3;
      jumpTo(startScroll);
    };

    const keepCarouselLooping = () => {
      if (isJumping || loopDistance <= 0) {
        return;
      }

      const step = getCardStep();
      const leftEdge = startScroll - step * 0.75;
      const rightEdge = startScroll + loopDistance - step * 0.25;

      if (portfolioTrack.scrollLeft < leftEdge) {
        jumpTo(portfolioTrack.scrollLeft + loopDistance);
      }

      if (portfolioTrack.scrollLeft > rightEdge) {
        jumpTo(portfolioTrack.scrollLeft - loopDistance);
      }
    };

    const scrollCarousel = (direction) => {
      portfolioTrack.scrollBy({
        left: getCardStep() * direction,
        behavior: "smooth"
      });
    };

    portfolioPrev?.addEventListener("click", () => scrollCarousel(-1));
    portfolioNext?.addEventListener("click", () => scrollCarousel(1));
    portfolioTrack.addEventListener("scroll", () => requestAnimationFrame(keepCarouselLooping));
    window.addEventListener("resize", measureCarousel);

    requestAnimationFrame(measureCarousel);
  }
}

const sliders = document.querySelectorAll(".ba-slider");

sliders.forEach((slider) => {
  const range = slider.querySelector(".ba-range");
  if (!range) {
    return;
  }

  // Updates before/after divider position and clamps value to 0..100.
  // Обновляет позицию разделителя до/после и ограничивает значение 0..100.
  const applyPosition = (value) => {
    const safe = Math.min(100, Math.max(0, Number(value)));
    slider.style.setProperty("--position", `${safe}%`);
  };

  // Sets initial slider position from data attribute or input value.
  // Устанавливает стартовую позицию из data-атрибута или значения input.
  applyPosition(slider.dataset.start || range.value);

  // Repaints slider live while user drags range input.
  // Обновляет слайдер в реальном времени при перетаскивании ползунка.
  range.addEventListener("input", (event) => {
    applyPosition(event.target.value);
  });
});

const orderForm = document.querySelector("#orderForm");
const formStatus = document.querySelector("#formStatus");
const filesInput = document.querySelector("#filesInput");
const fileTrigger = document.querySelector("[data-file-trigger]");
const fileName = document.querySelector("[data-file-name]");
const reviewsList = document.querySelector("#reviewsList");
const reviewsSort = document.querySelector("#reviewsSort");
const reviewsAverage = document.querySelector("#reviewsAverage");
const reviewsCount = document.querySelector("#reviewsCount");
const reviewsStars = document.querySelector("#reviewsStars");
const reviewsPrevBtn = document.querySelector("#reviewsPrevBtn");
const reviewsNextBtn = document.querySelector("#reviewsNextBtn");
const reviewForm = document.querySelector("#reviewForm");
const reviewStatus = document.querySelector("#reviewStatus");
const reviewComposer = document.querySelector("#reviewComposer");
const reviewAuthState = document.querySelector("#reviewAuthState");
const openReviewComposerBtn = document.querySelector("#openReviewComposerBtn");
const logoutReviewUserBtn = document.querySelector("#logoutReviewUserBtn");
const reviewAuthModal = document.querySelector("#reviewAuthModal");
const reviewAuthStatus = document.querySelector("#reviewAuthStatus");
const reviewLoginForm = document.querySelector("#reviewLoginForm");
const reviewRegisterForm = document.querySelector("#reviewRegisterForm");
const authTabs = document.querySelectorAll(".auth-tab");
const authPanels = document.querySelectorAll("[data-auth-panel]");
const headerSignInBtn = document.querySelector("#headerSignInBtn");
const headerAuthUser = document.querySelector("#headerAuthUser");
const openSupportModalBtn = document.querySelector("#openSupportModalBtn");
const supportModal = document.querySelector("#supportModal");
const supportForm = document.querySelector("#supportForm");
const supportStatus = document.querySelector("#supportStatus");

const ORDER_EMAILS_KEY = "nevodstudio_order_emails_v1";
const REVIEWS_KEY = "nevodstudio_reviews_v1";
const USERS_KEY = "nevodstudio_users_v1";
const CURRENT_USER_KEY = "nevodstudio_current_user_v1";
const SUPPORT_MESSAGES_KEY = "nevodstudio_support_messages_v1";

const SERVICE_LABELS = {
  "appearance-retouching": "Appearance Retouching",
  "ai-art-ai-photoshoots": "AI Art / AI Photoshoots",
  "photo-restoration": "Photo Restoration",
  "photo-manipulation-collages": "Photo Manipulation & Collages",
  "face-swap": "Face Swap",
  "photo-quality-enhancement": "Photo Quality Enhancement",
  "covers-design": "Covers & Design",
  "social-media-editing": "Social Media Editing",
  "creative-digital-editing": "Creative Digital Editing",
  other: "Other"
};

const demoReviews = [
  {
    id: "demo-1",
    name: "Olivia W.",
    email: "olivia@example.com",
    service: "appearance-retouching",
    rating: 5,
    text: "Fast turnaround and very natural retouch. Skin looks clean but still real.",
    date: "2026-04-18",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=300&auto=format&fit=crop",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=700&auto=format&fit=crop" }
    ]
  },
  {
    id: "demo-2",
    name: "Max B.",
    email: "max@example.com",
    service: "covers-design",
    rating: 5,
    text: "Cover design was exactly in the style we needed for campaign launch.",
    date: "2026-05-01",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300&auto=format&fit=crop",
    media: [
      { type: "image", url: "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=700&auto=format&fit=crop" },
      { type: "image", url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=700&auto=format&fit=crop" }
    ]
  },
  {
    id: "demo-3",
    name: "Nora H.",
    email: "nora@example.com",
    service: "photo-restoration",
    rating: 4,
    text: "Old family photo was restored beautifully. Small details are back and colors feel alive.",
    date: "2026-05-09",
    avatar: "",
    media: [
      { type: "file", name: "restoration-result.pdf" }
    ]
  }
];

function readStorageJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }

    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

function writeStorageJson(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getStars(rating) {
  const safe = Math.max(1, Math.min(5, Number(rating) || 0));
  return "★".repeat(safe) + "☆".repeat(5 - safe);
}

let orderedEmails = readStorageJson(ORDER_EMAILS_KEY, []);
let allReviews = readStorageJson(REVIEWS_KEY, demoReviews);
let users = readStorageJson(USERS_KEY, []);
let supportMessages = readStorageJson(SUPPORT_MESSAGES_KEY, []);
let currentUser = (() => {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw);
    return parsed && parsed.email ? parsed : null;
  } catch {
    return null;
  }
})();

if (!localStorage.getItem(REVIEWS_KEY)) {
  writeStorageJson(REVIEWS_KEY, allReviews);
}

function ensureOrderedEmail(email) {
  const normalized = normalizeEmail(email);
  if (!normalized || orderedEmails.includes(normalized)) {
    return;
  }

  orderedEmails.push(normalized);
  writeStorageJson(ORDER_EMAILS_KEY, orderedEmails);
}

function saveCurrentUser(user) {
  currentUser = user;
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
    return;
  }

  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ email: normalizeEmail(user.email) }));
}

function openAuthModal(activeTab = "login") {
  if (!reviewAuthModal) {
    return;
  }

  reviewAuthModal.classList.add("is-open");
  reviewAuthModal.setAttribute("aria-hidden", "false");
  setAuthTab(activeTab);
}

function closeAuthModal() {
  if (!reviewAuthModal) {
    return;
  }

  reviewAuthModal.classList.remove("is-open");
  reviewAuthModal.setAttribute("aria-hidden", "true");
}

function openSupportModal() {
  if (!supportModal) {
    return;
  }

  supportModal.classList.add("is-open");
  supportModal.setAttribute("aria-hidden", "false");
  if (supportStatus) {
    supportStatus.textContent = "";
  }
}

function closeSupportModal() {
  if (!supportModal) {
    return;
  }

  supportModal.classList.remove("is-open");
  supportModal.setAttribute("aria-hidden", "true");
}

function setAuthTab(tab) {
  authTabs.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.authTab === tab);
  });

  authPanels.forEach((panel) => {
    panel.classList.toggle("is-hidden", panel.dataset.authPanel !== tab);
  });

  if (reviewAuthStatus) {
    reviewAuthStatus.textContent = "";
  }
}

function updateReviewAuthUI() {
  const loggedIn = Boolean(currentUser && currentUser.email);

  if (reviewAuthState) {
    reviewAuthState.textContent = loggedIn
      ? `Signed in as ${currentUser.email}. You can open the review form below.`
      : "Sign in to leave a review. Reviews are still limited to clients who submitted an order.";
  }

  if (logoutReviewUserBtn) {
    logoutReviewUserBtn.style.display = loggedIn ? "inline-flex" : "none";
  }

  if (headerAuthUser) {
    headerAuthUser.textContent = loggedIn ? currentUser.email : "";
  }

  if (headerSignInBtn) {
    headerSignInBtn.textContent = loggedIn ? "Sign out" : "Sign in";
  }

  if (!loggedIn && reviewComposer) {
    reviewComposer.classList.add("is-hidden");
  }
}

function renderReviewMedia(media = []) {
  if (!media.length) {
    return "";
  }

  const items = media
    .slice(0, 3)
    .map((item) => {
      if (item.type === "image") {
        return `<div class="review-media-item"><img src="${escapeHtml(item.url)}" alt="Review media image"></div>`;
      }

      if (item.type === "video") {
        return `<div class="review-media-item"><video src="${escapeHtml(item.url)}" controls preload="metadata"></video></div>`;
      }

      return `<div class="review-media-item"><span class="review-file-chip">${escapeHtml(item.name || "Attached file")}</span></div>`;
    })
    .join("");

  return `<div class="review-media">${items}</div>`;
}

function renderReviews() {
  if (!reviewsList || !reviewsAverage || !reviewsCount || !reviewsStars) {
    return;
  }

  const selectedSort = reviewsSort ? reviewsSort.value : "newest";
  const visibleReviews = [...allReviews].sort((a, b) => {
    const dateA = new Date(a.date).getTime() || 0;
    const dateB = new Date(b.date).getTime() || 0;
    const ratingA = Number(a.rating) || 0;
    const ratingB = Number(b.rating) || 0;

    if (selectedSort === "oldest") {
      return dateA - dateB;
    }

    if (selectedSort === "rating-desc") {
      return ratingB - ratingA || dateB - dateA;
    }

    if (selectedSort === "rating-asc") {
      return ratingA - ratingB || dateB - dateA;
    }

    return dateB - dateA;
  });

  const average = allReviews.length
    ? allReviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / allReviews.length
    : 0;

  reviewsAverage.textContent = average ? average.toFixed(1) : "0.0";
  reviewsCount.textContent = String(allReviews.length);
  reviewsStars.textContent = getStars(Math.round(average || 0));

  if (visibleReviews.length === 0) {
    reviewsList.innerHTML = '<div class="reviews-empty">No reviews for this service yet.</div>';
    return;
  }

  reviewsList.innerHTML = visibleReviews.map((review) => {
    const serviceLabel = SERVICE_LABELS[review.service] || SERVICE_LABELS.other;
    const avatarInitial = escapeHtml((review.name || "?").charAt(0).toUpperCase());
    const avatarHtml = review.avatar
      ? `<img class="review-avatar" src="${escapeHtml(review.avatar)}" alt="${escapeHtml(review.name)} avatar">`
      : `<div class="review-avatar review-avatar-fallback">${avatarInitial}</div>`;

    return `
      <article class="review-card">
        <div class="review-head">
          ${avatarHtml}
          <div class="review-meta">
            <strong>${escapeHtml(review.name)}</strong>
            <span>${escapeHtml(review.email)}</span>
          </div>
          <div class="review-rating" aria-label="${Number(review.rating)} out of 5 stars">${getStars(Number(review.rating))}</div>
        </div>
        <p class="review-text">${escapeHtml(review.text)}</p>
        <div class="review-footer">
          <span class="review-service">${escapeHtml(serviceLabel)}</span>
          <span class="review-date">${escapeHtml(review.date)}</span>
        </div>
        ${renderReviewMedia(review.media)}
      </article>
    `;
  }).join("");

  if (window.innerWidth <= 760) {
    reviewsList.scrollLeft = 0;
  }

  updateReviewsCarouselButtons();
}

function getReviewStep() {
  if (!reviewsList) {
    return 0;
  }

  const firstCard = reviewsList.querySelector(".review-card, .reviews-empty");
  if (!firstCard) {
    return 0;
  }

  const styles = window.getComputedStyle(reviewsList);
  const gap = Number.parseFloat(styles.columnGap || styles.gap) || 0;
  return firstCard.getBoundingClientRect().width + gap;
}

function updateReviewsCarouselButtons() {
  if (!reviewsList || !reviewsPrevBtn || !reviewsNextBtn) {
    return;
  }

  if (window.innerWidth > 760) {
    reviewsPrevBtn.disabled = true;
    reviewsNextBtn.disabled = true;
    return;
  }

  const maxScrollLeft = Math.max(0, reviewsList.scrollWidth - reviewsList.clientWidth);
  const current = reviewsList.scrollLeft;
  const hasScrollableContent = maxScrollLeft > 2;

  reviewsPrevBtn.disabled = !hasScrollableContent || current <= 2;
  reviewsNextBtn.disabled = !hasScrollableContent || current >= maxScrollLeft - 2;
}

function scrollReviews(direction) {
  if (!reviewsList) {
    return;
  }

  const step = getReviewStep();
  if (!step) {
    return;
  }

  reviewsList.scrollBy({
    left: step * direction,
    behavior: "smooth"
  });
}

function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("File read failed"));
    reader.readAsDataURL(file);
  });
}

async function mapReviewMedia(files) {
  const limitedFiles = files.slice(0, 3);
  const result = [];

  for (const file of limitedFiles) {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if ((isImage || isVideo) && file.size <= 1_500_000) {
      try {
        const url = await fileToDataUrl(file);
        result.push({ type: isImage ? "image" : "video", url });
        continue;
      } catch {
        result.push({ type: "file", name: file.name });
        continue;
      }
    }

    result.push({ type: "file", name: file.name });
  }

  return result;
}

if (reviewsSort) {
  reviewsSort.addEventListener("change", renderReviews);
}

if (reviewsPrevBtn) {
  reviewsPrevBtn.addEventListener("click", () => {
    scrollReviews(-1);
  });
}

if (reviewsNextBtn) {
  reviewsNextBtn.addEventListener("click", () => {
    scrollReviews(1);
  });
}

if (reviewsList) {
  reviewsList.addEventListener("scroll", updateReviewsCarouselButtons);
}

window.addEventListener("resize", updateReviewsCarouselButtons);

if (openReviewComposerBtn) {
  openReviewComposerBtn.addEventListener("click", () => {
    if (!currentUser || !currentUser.email) {
      openAuthModal("login");
      return;
    }

    if (reviewComposer) {
      reviewComposer.classList.remove("is-hidden");
      reviewComposer.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

if (logoutReviewUserBtn) {
  logoutReviewUserBtn.addEventListener("click", () => {
    saveCurrentUser(null);
    updateReviewAuthUI();
    if (reviewStatus) {
      reviewStatus.textContent = "You have signed out.";
    }
  });
}

if (headerSignInBtn) {
  headerSignInBtn.addEventListener("click", () => {
    if (currentUser && currentUser.email) {
      saveCurrentUser(null);
      updateReviewAuthUI();
      if (reviewStatus) {
        reviewStatus.textContent = "You have signed out.";
      }
      return;
    }

    openAuthModal("login");
  });
}

authTabs.forEach((button) => {
  button.addEventListener("click", () => {
    setAuthTab(button.dataset.authTab || "login");
  });
});

if (reviewAuthModal) {
  reviewAuthModal.querySelectorAll("[data-auth-close]").forEach((element) => {
    element.addEventListener("click", closeAuthModal);
  });
}

if (openSupportModalBtn) {
  openSupportModalBtn.addEventListener("click", openSupportModal);
}

if (supportModal) {
  supportModal.querySelectorAll("[data-support-close]").forEach((element) => {
    element.addEventListener("click", closeSupportModal);
  });
}

if (supportForm) {
  supportForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(supportForm);
    const email = normalizeEmail(formData.get("email"));
    const password = String(formData.get("password") || "");
    const question = String(formData.get("question") || "").trim();

    if (!email || password.length < 6 || question.length < 10) {
      if (supportStatus) {
        supportStatus.textContent = "Please provide valid email, password (min 6 chars), and a detailed question.";
      }
      return;
    }

    const existingUser = users.find((user) => user.email === email);
    if (existingUser && existingUser.password !== password) {
      if (supportStatus) {
        supportStatus.textContent = "This email is already registered with another password.";
      }
      return;
    }

    if (!existingUser) {
      users.push({ email, password });
      writeStorageJson(USERS_KEY, users);
    }

    supportMessages = [
      {
        id: `support-${Date.now()}`,
        email,
        question,
        date: new Date().toISOString(),
        status: "new"
      },
      ...supportMessages
    ].slice(0, 200);

    writeStorageJson(SUPPORT_MESSAGES_KEY, supportMessages);
    saveCurrentUser({ email });
    updateReviewAuthUI();

    if (supportStatus) {
      supportStatus.textContent = "Thanks. Your question has been sent to admin support.";
    }

    supportForm.reset();
  });
}

if (reviewLoginForm) {
  reviewLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(reviewLoginForm);
    const email = normalizeEmail(formData.get("email"));
    const password = String(formData.get("password") || "");

    const foundUser = users.find((user) => user.email === email && user.password === password);
    if (!foundUser) {
      if (reviewAuthStatus) {
        reviewAuthStatus.textContent = "Invalid email or password.";
      }
      return;
    }

    saveCurrentUser({ email: foundUser.email });
    updateReviewAuthUI();
    closeAuthModal();

    if (reviewComposer) {
      reviewComposer.classList.remove("is-hidden");
    }

    if (reviewStatus) {
      reviewStatus.textContent = "Signed in successfully. You can publish a review.";
    }

    reviewLoginForm.reset();
  });
}

if (reviewRegisterForm) {
  reviewRegisterForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(reviewRegisterForm);
    const email = normalizeEmail(formData.get("email"));
    const password = String(formData.get("password") || "");

    if (!email || password.length < 6) {
      if (reviewAuthStatus) {
        reviewAuthStatus.textContent = "Please provide a valid email and password (min 6 chars).";
      }
      return;
    }

    if (users.some((user) => user.email === email)) {
      if (reviewAuthStatus) {
        reviewAuthStatus.textContent = "This email is already registered. Please sign in.";
      }
      return;
    }

    users.push({ email, password });
    writeStorageJson(USERS_KEY, users);
    saveCurrentUser({ email });
    updateReviewAuthUI();
    closeAuthModal();

    if (reviewComposer) {
      reviewComposer.classList.remove("is-hidden");
    }

    if (reviewStatus) {
      reviewStatus.textContent = "Account created. You can now publish your review.";
    }

    reviewRegisterForm.reset();
  });
}

if (reviewForm && reviewStatus) {
  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!currentUser || !currentUser.email) {
      reviewStatus.textContent = "Please sign in first.";
      openAuthModal("login");
      return;
    }

    const formData = new FormData(reviewForm);
    const email = normalizeEmail(currentUser.email);

    if (!orderedEmails.includes(email)) {
      reviewStatus.textContent = "Review rejected: your account has no submitted order yet.";
      return;
    }

    const mediaFiles = formData.getAll("media").filter((file) => file && file.name);
    const media = await mapReviewMedia(mediaFiles);

    const newReview = {
      id: `review-${Date.now()}`,
      name: String(formData.get("name") || "Client").trim(),
      email,
      service: String(formData.get("service") || "other"),
      rating: Number(formData.get("rating") || 5),
      text: String(formData.get("text") || "").trim(),
      avatar: String(formData.get("avatar") || "").trim(),
      date: new Date().toISOString().slice(0, 10),
      media
    };

    allReviews = [newReview, ...allReviews];
    writeStorageJson(REVIEWS_KEY, allReviews);
    reviewForm.reset();
    reviewStatus.textContent = "Thank you. Your review has been published.";
    renderReviews();
  });
}

renderReviews();
updateReviewAuthUI();

if (filesInput && fileTrigger && fileName) {
  // Uses a custom trigger so file picker labels stay in English on any OS locale.
  // Использует кастомную кнопку, чтобы подписи загрузки оставались на английском при любой локали ОС.
  fileTrigger.addEventListener("click", () => {
    filesInput.click();
  });

  filesInput.addEventListener("change", () => {
    const count = filesInput.files ? filesInput.files.length : 0;

    if (count === 0) {
      fileName.textContent = "No file chosen";
      return;
    }

    if (count === 1) {
      fileName.textContent = filesInput.files[0].name;
      return;
    }

    fileName.textContent = `${count} files selected`;
  });
}

if (orderForm && formStatus) {
  // Handles form submit locally (demo): shows success message and clears fields.
  // Обрабатывает отправку формы локально (демо): показывает успех и очищает поля.
  orderForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(orderForm);
    const name = (formData.get("name") || "friend").toString().trim();
    const email = formData.get("email");
    const files = formData.getAll("files").filter((file) => file && file.name);
    const fileText = files.length > 0 ? ` We received ${files.length} attached file${files.length === 1 ? "" : "s"}.` : "";

    ensureOrderedEmail(email);

    formStatus.textContent = `Thank you, ${name}. Your request has been received.${fileText}`;
    orderForm.reset();

    if (fileName) {
      fileName.textContent = "No file chosen";
    }
  });
}
