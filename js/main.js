(function () {
  // 1. Scroll Reveal Observer
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    document.querySelectorAll('.rv').forEach(function (el) {
      io.observe(el);
    });
  } else {
    document.querySelectorAll('.rv').forEach(function (el) {
      el.classList.add('in');
    });
  }

  // 2. Sticky Header State & Floating Back-to-Top Button
  var header = document.querySelector('header');
  var backTop = document.createElement('button');
  backTop.className = 'back-top';
  backTop.setAttribute('aria-label', 'Back to top');
  backTop.innerHTML = '↑';
  document.body.appendChild(backTop);

  backTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  window.addEventListener(
    'scroll',
    function () {
      var y = window.scrollY;
      if (header) {
        header.classList.toggle('scrolled', y > 16);
      }
      backTop.classList.toggle('show', y > 420);
    },
    { passive: true }
  );

  // 3. Mobile Drawer Toggle
  var menuBtn = document.querySelector('.menu-toggle');
  var drawer = document.querySelector('.mobile-drawer');
  if (menuBtn && drawer) {
    var menuPath = menuBtn.querySelector('path');
    var hamburgerD = 'M4 6h16M4 12h16M4 18h16';
    var closeD = 'M6 6l12 12M6 18L18 6';

    function setDrawerState(isOpen) {
      drawer.classList.toggle('open', isOpen);
      menuBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      document.body.style.overflow = isOpen ? 'hidden' : '';
      if (menuPath) {
        menuPath.setAttribute('d', isOpen ? closeD : hamburgerD);
      }
    }

    menuBtn.addEventListener('click', function () {
      var isOpen = !drawer.classList.contains('open');
      setDrawerState(isOpen);
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setDrawerState(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        setDrawerState(false);
      }
    });
  }

  // 4. Filter Pills (Industries & Careers)
  var filterGroups = document.querySelectorAll('[data-filter-group]');
  filterGroups.forEach(function (group) {
    var targetSelector = group.getAttribute('data-filter-group');
    var items = document.querySelectorAll(targetSelector);
    var buttons = group.querySelectorAll('.filter-btn');

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) {
          b.classList.remove('active');
        });
        btn.classList.add('active');
        var cat = btn.getAttribute('data-filter');

        items.forEach(function (item) {
          var itemCat = item.getAttribute('data-category') || '';
          if (cat === 'all' || itemCat.indexOf(cat) !== -1) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });

  // 5. Live Job Search & Quick Apply Pre-fill (Careers page)
  var jobSearch = document.getElementById('job-search');
  var jobItems = document.querySelectorAll('.job-item');
  if (jobSearch) {
    jobSearch.addEventListener('input', function () {
      var q = jobSearch.value.toLowerCase().trim();
      jobItems.forEach(function (item) {
        var text = item.textContent.toLowerCase();
        item.style.display = text.indexOf(q) !== -1 ? '' : 'none';
      });
    });
  }

  jobItems.forEach(function (item) {
    var applyBtn = item.querySelector('a[href="#apply-form"]');
    var titleEl = item.querySelector('h3');
    if (applyBtn && titleEl) {
      applyBtn.addEventListener('click', function () {
        var roleTitle = titleEl.textContent.trim();
        var summaryArea = document.getElementById('cand-summary');
        var nameInput = document.getElementById('cand-name');
        if (summaryArea && !summaryArea.value) {
          summaryArea.value = 'Applying for: ' + roleTitle + '\n\n';
        }
        setTimeout(function () {
          if (nameInput) nameInput.focus();
        }, 450);
      });
    }
  });

  // 6. FAQ Accordion (Open first item by default)
  var faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach(function (item, idx) {
    var btn = item.querySelector('.faq-q');
    var ans = item.querySelector('.faq-a');
    if (btn && ans) {
      if (idx === 0) {
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 40 + 'px';
      }
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        faqItems.forEach(function (other) {
          other.classList.remove('open');
          var otherAns = other.querySelector('.faq-a');
          if (otherAns) otherAns.style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('open');
          ans.style.maxHeight = ans.scrollHeight + 'px';
        }
      });
    }
  });

  // 7. Interactive Form Handling + Toast
  var forms = document.querySelectorAll('form[data-interactive-form]');
  var toast = document.getElementById('toast');

  function showToast(msg) {
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(function () {
      toast.classList.remove('show');
    }, 4500);
  }

  forms.forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var nameInput = form.querySelector('[name="name"]');
      var typeInput = form.querySelector('[name="inquiry_type"]');
      var name = nameInput ? nameInput.value : 'there';
      var type = typeInput ? typeInput.value : 'your inquiry';
      showToast('Thank you, ' + name + '! We have received ' + type + ' and our Tampa team will respond shortly.');
      form.reset();
    });
  });

  // 8. Inquiry Type Pre-fill from URL Query (?topic=...)
  var params = new URLSearchParams(window.location.search);
  var topic = params.get('topic');
  var inquirySelect = document.getElementById('inquiry-type');
  if (topic && inquirySelect) {
    for (var i = 0; i < inquirySelect.options.length; i++) {
      if (inquirySelect.options[i].value.toLowerCase().indexOf(topic.toLowerCase()) !== -1) {
        inquirySelect.selectedIndex = i;
        break;
      }
    }
  }
})();
