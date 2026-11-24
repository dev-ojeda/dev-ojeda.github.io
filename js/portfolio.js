"use strict";

/**
 * Portfolio frontend interactions.
 * Bootstrap 5 bundle is loaded by index.html. No extra dependencies.
 */

document.addEventListener("DOMContentLoaded", () => {
  initializeProjectCards();
  initializeNavigation();
});

function initializeProjectCards() {
  const cards = document.querySelectorAll(".card-flip");
  const hoverEnabled = window.matchMedia("(hover: hover) and (pointer: fine)");

  cards.forEach((card, index) => {
    const front = card.querySelector(".card-front");
    const back = card.querySelector(".card-back");

    if (!front || !back) return;

    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "group");
    card.setAttribute(
      "aria-label",
      card.dataset.projectLabel || `Proyecto ${index + 1}`
    );

    const setCardFlipped = (flipped) => {
      card.classList.toggle("is-flipped", flipped);

      front.inert = flipped;
      back.inert = !flipped;

      front.setAttribute("aria-hidden", String(flipped));
      back.setAttribute("aria-hidden", String(!flipped));

      // Avoid leaving focus inside a face that becomes inaccessible.
      if (!flipped && back.contains(document.activeElement)) {
        card.focus();
      }
    };

    const toggleCard = () => {
      setCardFlipped(!card.classList.contains("is-flipped"));
    };

    const closeCard = () => {
      setCardFlipped(false);
    };

    // Initial accessibility state.
    setCardFlipped(false);

    card.addEventListener("click", (event) => {
      // Preserve native interaction with links and controls.
      if (event.target.closest("a, button, input, select, textarea")) {
        return;
      }

      toggleCard();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && card.classList.contains("is-flipped")) {
        closeCard();
        event.preventDefault();
        return;
      }

      // Only the card container handles Enter and Space.
      if (
        event.target === card &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        toggleCard();
      }
    });

    // Mouse hover interaction, synchronized with accessibility state.
    if (hoverEnabled.matches) {
      card.addEventListener("mouseenter", () => {
        setCardFlipped(true);
      });

      card.addEventListener("mouseleave", () => {
        if (!card.contains(document.activeElement)) {
          closeCard();
        }
      });
    }

    // Close when keyboard focus leaves the entire card.
    card.addEventListener("focusout", () => {
      window.requestAnimationFrame(() => {
        if (
          !card.contains(document.activeElement) &&
          !card.matches(":hover")
        ) {
          closeCard();
        }
      });
    });
  });
}

function initializeNavigation() {
  const navbar = document.querySelector(".navbar");
  const menu = navbar?.querySelector(".navbar-collapse");

  if (!navbar || !menu) return;

  menu.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => {
      if (!menu.classList.contains("show")) return;

      const collapse = window.bootstrap?.Collapse;

      if (collapse) {
        collapse.getOrCreateInstance(menu).hide();
      }
    });
  });
}