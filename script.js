const header = document.querySelector("header");
const menuToggle = document.querySelector(".menu-toggle");
const menu = document.querySelector(".menu");
const menuLinks = document.querySelectorAll('.menu a[href^="#"]');

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

const portfolioTrack = document.querySelector(".portfolio-track");
const portfolioPrev = document.querySelector("[data-carousel-prev]");
const portfolioNext = document.querySelector("[data-carousel-next]");

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
    const files = formData.getAll("files").filter((file) => file && file.name);
    const fileText = files.length > 0 ? ` We received ${files.length} attached file${files.length === 1 ? "" : "s"}.` : "";

    formStatus.textContent = `Thank you, ${name}. Your request has been received.${fileText}`;
    orderForm.reset();

    if (fileName) {
      fileName.textContent = "No file chosen";
    }
  });
}
