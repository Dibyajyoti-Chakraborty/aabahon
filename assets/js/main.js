(function () {
  'use strict';

  /* ---------- Navigation drawer ---------- */
  var drawer = document.querySelector('.drawer');
  var scrim = document.querySelector('.scrim');
  var menuBtn = document.querySelector('.menu-btn');

  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('open', open);
    scrim.classList.toggle('on', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  if (menuBtn) {
    menuBtn.addEventListener('click', function () {
      setDrawer(!drawer.classList.contains('open'));
    });
    scrim.addEventListener('click', function () { setDrawer(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { setDrawer(false); closeSearch(); }
    });
  }

  /* ---------- Header dropdown (Join Us) ---------- */
  document.querySelectorAll('.site-nav>ul>li').forEach(function (li) {
    var sub = li.querySelector('.sub');
    if (!sub) return;
    var link = li.querySelector('a');
    var closeTimer = null;
    function open() { clearTimeout(closeTimer); li.classList.add('open'); }
    function close() { li.classList.remove('open'); }
    li.addEventListener('mouseenter', open);
    li.addEventListener('mouseleave', function () {
      closeTimer = setTimeout(close, 150);
    });
    link.addEventListener('click', function (e) {
      if (e.target.closest('.chev')) {
        e.preventDefault();
        li.classList.toggle('open');
      }
    });
    link.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowDown') { e.preventDefault(); open(); sub.querySelector('a').focus(); }
    });
    document.addEventListener('click', function (e) {
      if (!li.contains(e.target)) close();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  });

  /* ---------- Site search ---------- */
  var header = document.querySelector('.site-header');
  var searchBtn = document.querySelector('.search-btn');
  var searchBar = document.querySelector('.search-bar');
  var searchInput = searchBar ? searchBar.querySelector('input') : null;
  var searchBack = document.querySelector('.search-back');
  var results = document.querySelector('.search-results');

  var PAGES = [
    ['index.html', 'Home'],
    ['about.html', 'About'],
    ['events.html', 'Events'],
    ['join-us.html', 'Join Us'],
    ['memberships.html', 'Memberships'],
    ['volunteers.html', 'Volunteers'],
    ['donations.html', 'Donations'],
    ['gallery.html', 'Gallery'],
    ['faqs.html', 'FAQs'],
    ['contact-us.html', 'Contact us']
  ];

  function openSearch() {
    header.classList.add('searching');
    searchInput.focus();
  }
  function closeSearch() {
    if (!header) return;
    header.classList.remove('searching');
    if (results) results.hidden = true;
  }
  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function snippet(text, q) {
    var i = text.toLowerCase().indexOf(q.toLowerCase());
    var start = Math.max(0, i - 70);
    var end = Math.min(text.length, i + q.length + 90);
    var s = (start > 0 ? '…' : '') + text.slice(start, end) + (end < text.length ? '…' : '');
    var re = new RegExp(q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'ig');
    return escapeHtml(s).replace(re, function (m) { return '<mark>' + m + '</mark>'; });
  }
  function runSearch(q) {
    results.hidden = false;
    results.innerHTML = '<div class="inner"><h2>Search results for “' + escapeHtml(q) + '”</h2><p class="note">Searching…</p></div>';
    var hits = [];
    var pending = PAGES.length;
    var failed = 0;
    PAGES.forEach(function (page) {
      fetch(page[0]).then(function (r) { return r.text(); }).then(function (html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var main = doc.querySelector('main');
        var text = (main ? main.textContent : '').replace(/\s+/g, ' ').trim();
        if (text.toLowerCase().indexOf(q.toLowerCase()) !== -1 || page[1].toLowerCase().indexOf(q.toLowerCase()) !== -1) {
          hits.push({ href: page[0], title: page[1], text: text });
        }
      }).catch(function () { failed++; }).then(function () {
        pending--;
        if (pending === 0) render();
      });
    });
    function render() {
      var order = {};
      PAGES.forEach(function (p, i) { order[p[0]] = i; });
      hits.sort(function (a, b) { return order[a.href] - order[b.href]; });
      var out = '<div class="inner"><h2>Search results for “' + escapeHtml(q) + '”</h2>';
      if (failed === PAGES.length) {
        out += '<p class="note">Search is available when the site is served over HTTP.</p>';
      } else if (!hits.length) {
        out += '<p class="note">No results found.</p>';
      } else {
        hits.forEach(function (h) {
          out += '<div class="hit"><a href="' + h.href + '">' + escapeHtml(h.title) + '</a><p>' + snippet(h.text, q) + '</p></div>';
        });
      }
      results.innerHTML = out + '</div>';
    }
  }
  if (searchBtn) {
    searchBtn.addEventListener('click', openSearch);
    searchBack.addEventListener('click', closeSearch);
    searchBar.addEventListener('submit', function (e) {
      e.preventDefault();
      var q = searchInput.value.trim();
      if (q) runSearch(q);
    });
  }

  /* ---------- Image carousels ---------- */
  document.querySelectorAll('.carousel').forEach(function (car) {
    var slides = car.querySelectorAll('.slide');
    var dots = car.parentNode.querySelector('.dots');
    var idx = 0, timer = null;
    var auto = car.getAttribute('data-autoplay') === 'true';

    if (dots) {
      slides.forEach(function (s, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('aria-label', 'Show image ' + (i + 1));
        b.addEventListener('click', function () { show(i); restart(); });
        dots.appendChild(b);
      });
    }
    function show(i) {
      idx = (i + slides.length) % slides.length;
      slides.forEach(function (s, k) { s.classList.toggle('on', k === idx); });
      if (dots) {
        dots.querySelectorAll('button').forEach(function (b, k) { b.classList.toggle('on', k === idx); });
      }
    }
    function restart() {
      if (!auto) return;
      clearInterval(timer);
      timer = setInterval(function () { show(idx + 1); }, 5000);
    }
    car.querySelector('.prev').addEventListener('click', function () { show(idx - 1); restart(); });
    car.querySelector('.next').addEventListener('click', function () { show(idx + 1); restart(); });
    car.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { show(idx - 1); restart(); }
      if (e.key === 'ArrowRight') { show(idx + 1); restart(); }
    });
    car.addEventListener('mouseenter', function () { clearInterval(timer); });
    car.addEventListener('mouseleave', restart);
    show(0);
    restart();
  });

  /* ---------- Banner scroll chevron ---------- */
  var chev = document.querySelector('.chevron');
  if (chev) {
    chev.addEventListener('click', function (e) {
      var target = document.querySelector(chev.getAttribute('href'));
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 56, behavior: 'smooth' });
      }
    });
  }
})();
