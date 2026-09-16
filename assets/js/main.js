// Mobile nav toggle + dropdown on tap (mirrors original Google Sites behaviour)
(function () {
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  // On small screens, let the "Join Us" parent toggle its submenu on click.
  document.querySelectorAll('.has-dropdown > .dropbtn').forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      if (window.matchMedia('(max-width:880px)').matches) {
        e.preventDefault();
        var dd = btn.parentElement.querySelector('.dropdown');
        if (dd) dd.style.display = dd.style.display === 'flex' ? 'none' : 'flex';
      }
    });
  });
})();
