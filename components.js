(function () {
  var src = document.currentScript.getAttribute('src');
  var base = src.replace('components.js', '');
  var isHome = base === '' || base === './';

  // Umami analytics
  var s = document.createElement('script');
  s.defer = true;
  s.src = 'https://umami-qxbp-production.up.railway.app/script.js';
  s.dataset.websiteId = '5af10090-1da4-4d35-ad86-74235dbe5fbc';
  document.head.appendChild(s);

  // Nav
  var nav = document.querySelector('nav');
  if (nav) {
    if (isHome) {
      nav.innerHTML =
        '<a href="' + base + 'blog/">Blog</a>' +
        '<a href="' + base + 'links/">Links</a>';
    } else {
      nav.innerHTML =
        '<a class="nav-home" href="' + base + '">Loreley</a>' +
        '<div class="nav-links">' +
          '<a href="' + base + 'blog/">Blog</a>' +
          '<a href="' + base + 'links/">Links</a>' +
        '</div>';
    }
  }

  // Footer
  var footer = document.querySelector('footer');
  if (footer) {
    footer.innerHTML =
      '<span class="copyright">&copy; 2026 Lukas Bogacz</span>' +
      '<div class="footer-links">' +
        '<a href="mailto:info@loreley.one">Email</a>' +
        '<a href="https://www.linkedin.com/in/lukas-bogacz/">LinkedIn</a>' +
        '<a href="https://github.com/basedlukas">GitHub</a>' +
        '<a href="' + base + 'blog/">Blog</a>' +
      '</div>';
  }
})();
