document.addEventListener("DOMContentLoaded", () => {
  console.log("JavaScript is loaded and running!");

  // Initialize Littlefoot (optional custom button template)
  littlefoot.littlefoot({
    buttonTemplate: `
      <button aria-label="Footnote <% number %>" class="littlefoot__button"
        id="<% reference %>" title="See Footnote <% number %>">
        <% number %>
      </button>`
  });

  // Hamburger Menu Toggle
  const hamburgerMenu = document.getElementById("hamburger-menu");
  const navButtons = document.getElementById("nav-buttons");

  // Default text for the hamburger menu
  const defaultMenuText = "Contents";
  let lastViewedChapter = defaultMenuText; // Stores last viewed chapter title
  hamburgerMenu.textContent = defaultMenuText;

  hamburgerMenu.addEventListener("click", () => {
    const isActive = navButtons.classList.toggle("active"); // Toggle visibility

    // When menu is active, set text to "Contents", otherwise restore last viewed chapter
    hamburgerMenu.textContent = isActive ? defaultMenuText : lastViewedChapter;
  });

  // Close menu when clicking outside
  document.addEventListener("click", (event) => {
    if (!navButtons.contains(event.target) && !hamburgerMenu.contains(event.target)) {
      navButtons.classList.remove("active");
      hamburgerMenu.textContent = lastViewedChapter; // Restore last viewed chapter
    }
  });

  // Smooth scrolling for navigation buttons
  document.querySelectorAll(".nav-button").forEach(button => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      document.querySelectorAll(".nav-button").forEach(btn => {
        btn.classList.remove("active");
      });

      // Add active class to the clicked button
      button.classList.add("active");

      const target = document.getElementById(button.getAttribute("data-target"));
      if (target) {
        // Scroll to the target element with some padding at the top
        window.scrollTo({
          top: target.offsetTop - 90, // Adjust for sticky nav and extra padding
          behavior: "smooth"
        });

        // Update last viewed chapter
        lastViewedChapter = button.textContent.trim();
        hamburgerMenu.textContent = lastViewedChapter;
      }

      // Close the menu after clicking a button (only on mobile)
      if (window.innerWidth < 1440) {
        navButtons.classList.remove("active");
        hamburgerMenu.textContent = lastViewedChapter; // Restore last viewed chapter
      }
    });
  });

  // Intersection Observer to track chapters and highlight active button
  const chapters = document.querySelectorAll("h2:not(.abstract)"); // Exclude Abstract
  const buttons = document.querySelectorAll(".nav-button");

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.target.classList.contains("abstract")) return;

      if (entry.isIntersecting) {
        const targetChapter = entry.target;
        const targetId = targetChapter.id;

        // Remove active class from all buttons
        buttons.forEach(button => button.classList.remove("active"));

        // Add active class to the button that corresponds to the chapter
        const activeButton = document.querySelector(`.nav-button[data-target="${targetId}"]`);
        if (activeButton) {
          activeButton.classList.add("active");

          // Update last viewed chapter (but only if menu is not open)
          if (!navButtons.classList.contains("active")) {
            lastViewedChapter = activeButton.textContent.trim();
            hamburgerMenu.textContent = lastViewedChapter;
          }
        }
      }
    });
  }, {
    threshold: 0.5
  });

  // Observe all chapters
  chapters.forEach(chapter => {
    observer.observe(chapter);
  });

  // Back to Top button functionality
  const backToTopButton = document.getElementById("back-to-top");

  // Show or hide the back-to-top button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.scrollY > 200) { // Show button after scrolling 200px
      backToTopButton.style.display = "block";
    } else {
      backToTopButton.style.display = "none";
      lastViewedChapter = defaultMenuText; // Reset to "Contents" when at the top
      if (!navButtons.classList.contains("active")) {
        hamburgerMenu.textContent = defaultMenuText;
      }
    }
  });

  // Scroll to top when button is clicked
  backToTopButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    // Reset hamburger menu text to "Contents" after scrolling to top
    setTimeout(() => {
      lastViewedChapter = defaultMenuText;
      hamburgerMenu.textContent = defaultMenuText;
    }, 500);
  });
});
