(function () {
  'use strict';

  function enhanceCodeBlocks() {
    var figures = document.querySelectorAll('figure.highlight');
    figures.forEach(function (fig) {
      if (fig.closest('.code-block')) return;

      var lang = '';
      var classes = fig.className.split(/\s+/);
      for (var i = 0; i < classes.length; i++) {
        if (classes[i] !== 'highlight') {
          lang = classes[i];
          break;
        }
      }

      var wrapper = document.createElement('div');
      wrapper.className = 'code-block';

      var header = document.createElement('div');
      header.className = 'code-header';

      var langSpan = document.createElement('span');
      langSpan.className = 'code-lang';
      langSpan.textContent = lang || 'code';

      var copyBtn = document.createElement('button');
      copyBtn.className = 'code-copy';
      copyBtn.textContent = 'Copy';
      copyBtn.addEventListener('click', function () {
        var code = fig.querySelector('td.code pre, pre');
        if (!code) return;
        var text = code.textContent;
        navigator.clipboard.writeText(text).then(function () {
          copyBtn.textContent = 'Copied!';
          copyBtn.classList.add('copied');
          setTimeout(function () {
            copyBtn.textContent = 'Copy';
            copyBtn.classList.remove('copied');
          }, 2000);
        });
      });

      header.appendChild(langSpan);
      header.appendChild(copyBtn);

      fig.parentNode.insertBefore(wrapper, fig);
      wrapper.appendChild(header);
      wrapper.appendChild(fig);
    });
  }

  function enhanceMathBlocks() {
    var displays = document.querySelectorAll('.katex-display');
    displays.forEach(function (el) {
      if (el.closest('.math-block')) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'math-block';
      el.parentNode.insertBefore(wrapper, el);
      wrapper.appendChild(el);
    });
  }

  function wrapTables() {
    var body = document.querySelector('.js-post-body');
    if (!body) return;
    var tables = body.querySelectorAll('table');
    tables.forEach(function (table) {
      if (table.closest('.table-wrapper') || table.closest('figure.highlight')) return;
      var wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  function initCollapse() {
    document.addEventListener('click', function (e) {
      var trigger = e.target.closest('[data-toggle="collapse"]');
      if (!trigger) return;
      e.preventDefault();
      var targetSel = trigger.getAttribute('data-target');
      if (!targetSel) return;
      var target = document.querySelector(targetSel);
      if (!target) return;
      target.classList.toggle('is-open');
    });
  }

  function addRefTracking() {
    var hostname = window.location.hostname;
    var ref = hostname || 'loreley.one';
    var links = document.querySelectorAll('a[href]');
    links.forEach(function (link) {
      var href = link.getAttribute('href');
      if (!href) return;
      try {
        var url = new URL(href, window.location.origin);
        if (url.hostname === hostname || url.hostname === '') return;
        if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
        if (!url.searchParams.has('ref')) {
          url.searchParams.set('ref', ref);
          link.setAttribute('href', url.toString());
        }
      } catch (e) {}
    });
  }

  function buildToc() {
    var postBody = document.querySelector('.js-post-body');
    var tocList = document.getElementById('toc-list');
    if (!postBody || !tocList) return;

    var headings = postBody.querySelectorAll('h2, h3');
    if (headings.length < 2) {
      var sidebar = document.querySelector('.toc-sidebar');
      if (sidebar) sidebar.style.display = 'none';
      return;
    }

    var fragment = document.createDocumentFragment();
    var observeTargets = [];

    headings.forEach(function (heading, idx) {
      if (!heading.id) {
        heading.id = 'heading-' + idx;
      }

      var li = document.createElement('li');
      if (heading.tagName === 'H3') {
        li.className = 'toc-h3';
      }

      var a = document.createElement('a');
      a.href = '#' + heading.id;
      a.textContent = heading.textContent;
      li.appendChild(a);
      fragment.appendChild(li);
      observeTargets.push({ el: heading, link: a });
    });

    tocList.appendChild(fragment);

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            observeTargets.forEach(function (t) {
              t.link.classList.remove('active');
            });
            for (var i = 0; i < observeTargets.length; i++) {
              if (observeTargets[i].el === entry.target) {
                observeTargets[i].link.classList.add('active');
                break;
              }
            }
          }
        });
      }, { rootMargin: '-80px 0px -60% 0px', threshold: 0 });

      observeTargets.forEach(function (t) {
        observer.observe(t.el);
      });
    }
  }

  function initFadeIn() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('.fade-in').forEach(function (el) {
        el.classList.add('visible');
      });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(function (el) {
      observer.observe(el);
    });
  }

  function initNav() {
    var nav = document.querySelector('.nav');
    var toggle = document.querySelector('.nav-toggle');
    var links = document.querySelector('.nav-links');

    if (nav) {
      window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
          nav.classList.add('scrolled');
        } else {
          nav.classList.remove('scrolled');
        }
      }, { passive: true });
    }

    if (toggle && links) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('open');
        links.classList.toggle('open');
      });

      links.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () {
          toggle.classList.remove('open');
          links.classList.remove('open');
        });
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    enhanceCodeBlocks();
    enhanceMathBlocks();
    wrapTables();
    initCollapse();
    buildToc();
    initFadeIn();
    initNav();
    addRefTracking();
  });
})();
