// Select elements
let navBar = document.querySelector(".nav-bar");
let hamburger = document.querySelector(".hamburger");
let navLinks = document.querySelectorAll("header nav a");
let sections = document.querySelectorAll("section");
let header = document.querySelector("header");

// Toggle mobile menu
hamburger.onclick = function () {
  navBar.classList.toggle("active");
};

// Scroll spy and sticky header
window.onscroll = () => {
  let scrollY = window.scrollY;

  // Sticky header effect
  if (scrollY > 80) {
    header.classList.add("fixed-header");
  } else {
    header.classList.remove("fixed-header");
  }

  // Scroll spy: highlight active nav link
  sections.forEach(sec => {
    let top = scrollY;
    let offset = sec.offsetTop - 150;
    let height = sec.offsetHeight;
    let id = sec.getAttribute("id");

    if (top >= offset && top < offset + height) {
      navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${id}`) {
          link.classList.add("active");
        }
      });
    }
  });
};

// Smooth scroll with offset and close mobile menu on link click
navLinks.forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    let targetId = link.getAttribute("href").substring(1);
    let targetElement = document.getElementById(targetId);

    window.scrollTo({
      top: targetElement.offsetTop - 150,
      behavior: "smooth"
    });

    // Close mobile nav menu
    navBar.classList.remove("active");
  });
});




//testimonials slider

const slider = document.getElementById('testimonial-slider');
let position = 0;

function getVisibleCount() {
  if (window.innerWidth >= 992) return 3;
  if (window.innerWidth >= 600) return 2;
  return 1;
}

function slide(direction) {
  const card = slider.querySelector('.testimonial-card');
  const cardWidth = card.offsetWidth + 20; // width + margin
  const visibleCount = getVisibleCount();
  const totalCards = slider.children.length;

  const maxPosition = totalCards - visibleCount;
  position += direction;

  if (position < 0) position = 0;
  if (position > maxPosition) position = maxPosition;

  slider.style.transform = `translateX(-${position * cardWidth}px)`;
}

// Recalculate position on resize to prevent blank space
window.addEventListener('resize', () => {
  slide(0);
});


//appointment form validation
const form = document.getElementById('appointment-form');
const thankYouMsg = document.getElementById('thank-you-msg');

form.addEventListener('submit', function(e) {
  e.preventDefault();

  const name = document.getElementById('name').value.trim();
  const surname = document.getElementById('surname').value.trim();
  const email = document.getElementById('email').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const reason = document.getElementById('reason').value.trim();

  const message = `
📅 New Appointment Request:

👤 Name: ${name} ${surname}
📧 Email: ${email}
📞 Phone: ${phone}
📝 Reason: ${reason}
  `;

  const token = "7812234567:AAER3DbLxUU7ddGOj8SoAm28iibrno1AmsY"; // <-- Replace this
  const chat_id = "1522497065"; // <-- Replace this
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  fetch(url, {
    method: "POST",
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chat_id,
      text: message
    })
  })
  .then(response => {
    if (response.ok) {
      form.reset();
      thankYouMsg.style.display = 'block';
    } else {
      alert("Something went wrong. Please try again.");
    }
  })
  .catch(err => {
    alert("Error sending message.");
    console.error(err);
  });
});



//scroll animation
function reveal() {
  var reveals = document.querySelectorAll(".reveal");

  for (var i = 0; i < reveals.length; i++) {
    var windowHeight = window.innerHeight;
    var elementTop = reveals[i].getBoundingClientRect().top;
    var elementVisible = 150;

    if (elementTop < windowHeight - elementVisible) {
      reveals[i].classList.add("active");
    } else {
      reveals[i].classList.remove("active");
    }
  }
}



window.addEventListener("scroll", reveal);
// Initialize Isotope with "work" as the default filter
var $galleryContainer = $('.gallery').isotope({
  itemSelector: '.item',
  layoutMode: 'fitRows',
  filter: '.work'  // Show "My Work" images by default
});
// Handle button clicks
$('.button-group .button').on('click', function(){
  $('.button-group .button').removeClass('active');
  $(this).addClass('active');
  var value = $(this).attr('data-filter');
  $galleryContainer.isotope({
      filter: value
  });
});
