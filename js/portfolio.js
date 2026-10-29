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

  cards.forEach((card, index) => {
    // A card is a focusable group, not a button: it contains real links.
    card.setAttribute("tabindex", "0");
    card.setAttribute("role", "group");
    card.setAttribute("aria-label", card.dataset.projectLabel || `Proyecto ${index + 1}`);

    const toggleCard = () => {
      card.classList.toggle("is-flipped");
    };

    const closeCard = () => {
      card.classList.remove("is-flipped");
    };

    card.addEventListener("click", (event) => {
      // Do not intercept links or controls on the back of the card.
      if (event.target.closest("a, button, input, select, textarea")) return;
      toggleCard();
    });

    card.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && card.classList.contains("is-flipped")) {
        closeCard();
        // Move focus away from a now-hidden link and back to the card.
        if (card.contains(document.activeElement)) card.focus();
        event.preventDefault();
        return;
      }

      // Only the card container itself handles Enter/Space.
      if (event.target === card && (event.key === "Enter" || event.key === " ")) {
        event.preventDefault();
        toggleCard();
      }
    });

    // Keep the accessibility state in sync if focus enters a card's back.
    card.addEventListener("focusout", () => {
      window.requestAnimationFrame(() => {
        if (!card.contains(document.activeElement) && !card.matches(":hover")) {
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
      if (collapse) collapse.getOrCreateInstance(menu).hide();
    });
  });
}
