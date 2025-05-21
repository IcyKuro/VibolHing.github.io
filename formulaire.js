document.getElementById("contactForm").addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("emailAddress").value;
    const sujet = document.getElementById("sujet").value;
    const message = document.getElementById("message").value;

    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=hingvibol@gmail.com&su=${encodeURIComponent(
      sujet
    )}&body=${encodeURIComponent(`${message}`)}`;

    window.open(gmailLink, '_blank'); // ouvre dans un nouvel onglet
  });