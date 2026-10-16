/* CSE — Congo Service Engineering SARL */
(function () {
  'use strict';

  // Address enquiries are sent to. Replace with the real inbox before launch.
  var CONTACT_EMAIL = 'info@cse-company.cd';

  var ARROW = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
  var CHECK = '<span class="check check--sm" aria-hidden="true"><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6 9 17l-5-5"/></svg></span>';

  function pexels(id, w) {
    return 'https://images.pexels.com/photos/' + id + '/pexels-photo-' + id + '.jpeg?auto=compress&cs=tinysrgb&w=' + w;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  /* ---------- Mobile menu ---------- */

  var toggle = document.querySelector('.menu-toggle');
  var menu = document.getElementById('mobile-menu');
  if (toggle && menu) {
    var setMenu = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
    };
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    window.matchMedia('(min-width: 1201px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Clients marquee: duplicate the set for a seamless loop ---------- */

  var track = document.querySelector('.marquee__track');
  if (track) {
    Array.prototype.slice.call(track.children).forEach(function (li) {
      var clone = li.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelector('img').alt = '';
      track.appendChild(clone);
    });
  }

  /* ---------- Projects filter ---------- */

  var filterBar = document.querySelector('[data-project-filters]');
  if (filterBar) {
    var cards = document.querySelectorAll('.project-card');
    var empty = document.querySelector('[data-projects-empty]');
    filterBar.addEventListener('click', function (e) {
      var btn = e.target.closest('.filter');
      if (!btn) return;
      var cat = btn.getAttribute('data-filter');
      filterBar.querySelectorAll('.filter').forEach(function (b) {
        b.setAttribute('aria-pressed', String(b === btn));
      });
      var shown = 0;
      cards.forEach(function (card) {
        var match = cat === 'All' || card.getAttribute('data-category') === cat;
        card.hidden = !match;
        if (match) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    });
  }

  /* ---------- Services page ---------- */

  var SERVICES = [
    {
      key: 'civil', short: 'civil', t: 'Civil Engineering & Construction', photo: 1117452, img: 'Construction site',
      long: 'From commercial buildings to industrial foundations, we design and build structures that are safe, durable and delivered to specification — managing every stage from site survey to handover.',
      scope: ['Site surveys, geotechnical studies & design', 'Reinforced concrete & steel structures', 'Earthworks, foundations & drainage', 'Project & construction management'],
      sectors: ['Mining', 'Commercial', 'Public sector', 'Residential']
    },
    {
      key: 'industrial', short: 'industrial', t: 'Industrial Engineering', photo: 257700, img: 'Industrial plant',
      long: 'We help industrial operators improve plant performance — designing, installing and upgrading process systems that increase throughput and reduce downtime.',
      scope: ['Process plant design & layout', 'Equipment installation & integration', 'Plant upgrades & debottlenecking', 'Commissioning & performance testing'],
      sectors: ['Mining & processing', 'Manufacturing', 'Cement', 'Oil & gas']
    },
    {
      key: 'mechanical', short: 'mechanical', t: 'Mechanical Engineering', photo: 190574, img: 'Mechanical works',
      long: 'Our mechanical teams install, align and commission rotating and static equipment — pumps, conveyors, mills and piping — to manufacturer standards.',
      scope: ['Pumps, conveyors & mill drives', 'Piping fabrication & installation', 'Alignment, balancing & commissioning', 'Overhauls & component replacement'],
      sectors: ['Mining', 'Water utilities', 'Industrial plants', 'Energy']
    },
    {
      key: 'electrical', short: 'electrical', t: 'Electrical Installations', photo: 442150, img: 'Electrical installation',
      long: 'We deliver safe, reliable power — from high-voltage substations to building distribution, control panels and instrumentation.',
      scope: ['HV/MV substations & transformers', 'Power distribution & cabling', 'Control panels, automation & instrumentation', 'Lighting, earthing & lightning protection'],
      sectors: ['Mining', 'Utilities', 'Commercial buildings', 'Industrial plants']
    },
    {
      key: 'infrastructure', short: 'infrastructure', t: 'Infrastructure Development', photo: 2138126, img: 'Infrastructure works',
      long: 'We build the roads, utilities and networks that connect sites and communities — planned for local conditions and long service life.',
      scope: ['Roads, access tracks & bridges', 'Water supply & treatment networks', 'Fuel & storage facilities', 'Site infrastructure for mining camps'],
      sectors: ['Public sector', 'Mining', 'Energy', 'Logistics']
    },
    {
      key: 'maintenance', short: 'maintenance', t: 'Technical Maintenance', photo: 2965260, img: 'Maintenance team',
      long: 'Planned and corrective maintenance that keeps plants, substations and equipment running — with on-call technicians and clear reporting.',
      scope: ['Preventive maintenance programmes', 'Breakdown & emergency response', 'Shutdown planning & execution', 'Condition monitoring & reporting'],
      sectors: ['Mining', 'Industrial plants', 'Utilities', 'Commercial facilities']
    }
  ];

  var svcTabs = document.querySelector('[data-svc-tabs]');
  var svcPanel = document.querySelector('[data-svc-panel]');
  if (svcTabs && svcPanel) {
    var n = SERVICES.length;
    var num = function (i) { return String(i + 1).padStart(2, '0'); };

    svcTabs.innerHTML = SERVICES.map(function (s, i) {
      return '<button type="button" role="tab" class="svc-tab" id="tab-' + s.key + '" aria-controls="svc-panel" data-index="' + i + '">' +
        '<span class="svc-tab__n">' + num(i) + '</span><span class="svc-tab__t">' + escapeHtml(s.t) + '</span>' + ARROW + '</button>';
    }).join('');
    var tabButtons = svcTabs.querySelectorAll('.svc-tab');

    var render = function (i, opts) {
      opts = opts || {};
      var s = SERVICES[i];
      var prev = SERVICES[(i + n - 1) % n], next = SERVICES[(i + 1) % n];
      tabButtons.forEach(function (b, j) {
        var on = j === i;
        b.setAttribute('aria-selected', String(on));
        b.tabIndex = on ? 0 : -1;
        // Scroll only the tab strip (horizontal on small screens), never the page.
        if (on && opts.scrollTab && svcTabs.scrollWidth > svcTabs.clientWidth) {
          svcTabs.scrollLeft = b.offsetLeft - svcTabs.offsetLeft - 20;
        }
      });
      svcPanel.setAttribute('aria-labelledby', 'tab-' + s.key);
      svcPanel.innerHTML =
        '<div class="svc-panel__media"><img class="cover" src="' + pexels(s.photo, 1400) + '" alt="' + escapeHtml(s.img) + '"></div>' +
        '<div class="svc-panel__head"><span class="eyebrow">Service ' + num(i) + '</span>' +
          '<h2 class="h2">' + escapeHtml(s.t) + '</h2><p>' + escapeHtml(s.long) + '</p></div>' +
        '<div class="svc-panel__cols">' +
          '<div><h3>What’s included</h3><ul class="scope-list">' +
            s.scope.map(function (x) { return '<li>' + CHECK + escapeHtml(x) + '</li>'; }).join('') + '</ul></div>' +
          '<div><h3>Sectors we serve</h3><ul class="chips">' +
            s.sectors.map(function (x) { return '<li>' + escapeHtml(x) + '</li>'; }).join('') + '</ul></div>' +
        '</div>' +
        '<div class="svc-quote"><div><strong>Planning a ' + s.short + ' project?</strong>' +
          '<span>Talk to our engineers about scope, timeline and budget.</span></div>' +
          '<a class="btn btn-primary" href="contact.html?service=' + s.key + '#quote">Request a Quote' + ARROW + '</a></div>' +
        '<div class="svc-pager">' +
          '<button type="button" data-go="' + ((i + n - 1) % n) + '">← ' + escapeHtml(prev.t) + '</button>' +
          '<button type="button" data-go="' + ((i + 1) % n) + '">' + escapeHtml(next.t) + ' →</button></div>';
      if (opts.updateHash) history.replaceState(null, '', '#' + s.key);
    };

    var go = function (i, focusTab) {
      render(i, { updateHash: true, scrollTab: true });
      if (focusTab) tabButtons[i].focus();
      if (svcPanel.getBoundingClientRect().top < 0) {
        svcPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    svcTabs.addEventListener('click', function (e) {
      var b = e.target.closest('.svc-tab');
      if (b) go(+b.getAttribute('data-index'));
    });
    svcTabs.addEventListener('keydown', function (e) {
      var cur = Array.prototype.indexOf.call(tabButtons, document.activeElement);
      if (cur < 0) return;
      var map = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in map) { e.preventDefault(); go((cur + map[e.key] + n) % n, true); }
      else if (e.key === 'Home') { e.preventDefault(); go(0, true); }
      else if (e.key === 'End') { e.preventDefault(); go(n - 1, true); }
    });
    svcPanel.addEventListener('click', function (e) {
      var b = e.target.closest('[data-go]');
      if (b) go(+b.getAttribute('data-go'));
    });

    var fromHash = function () {
      var key = location.hash.slice(1);
      var idx = SERVICES.findIndex(function (s) { return s.key === key; });
      return idx < 0 ? 0 : idx;
    };
    render(fromHash(), { scrollTab: true });
    window.addEventListener('hashchange', function () { render(fromHash(), { scrollTab: true }); });
  }

  /* ---------- Contact form ---------- */

  var form = document.querySelector('[data-contact-form]');
  if (form) {
    var seg = document.querySelector('[data-form-tabs]');
    var quoteFields = form.querySelectorAll('[data-quote-only]');
    var msgLabel = form.querySelector('[data-msg-label]');
    var submitBtn = form.querySelector('[type="submit"]');
    var note = form.querySelector('[data-form-note]');
    var mode = 'contact';

    var setMode = function (m) {
      mode = m;
      seg.querySelectorAll('button').forEach(function (b) {
        b.setAttribute('aria-selected', String(b.getAttribute('data-mode') === m));
      });
      quoteFields.forEach(function (f) {
        f.hidden = m !== 'quote';
        f.querySelectorAll('input, select').forEach(function (el) { el.disabled = m !== 'quote'; });
      });
      msgLabel.textContent = m === 'quote' ? 'Project scope & timeline' : 'Message';
      submitBtn.textContent = m === 'quote' ? 'Request a Quote' : 'Send Message';
    };

    seg.addEventListener('click', function (e) {
      var b = e.target.closest('button');
      if (b) setMode(b.getAttribute('data-mode'));
    });

    var params = new URLSearchParams(location.search);
    var svc = params.get('service');
    if (svc) {
      var sel = form.querySelector('select[name="service"]');
      var match = sel && sel.querySelector('option[data-key="' + svc + '"]');
      if (match) match.selected = true;
    }
    setMode(location.hash === '#quote' || svc ? 'quote' : 'contact');

    // No backend yet: hand the enquiry to the visitor's email app.
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;
      var d = new FormData(form);
      var subject = (mode === 'quote' ? 'Quote request' : 'Enquiry') + ' — ' + d.get('name') +
        (d.get('company') ? ' (' + d.get('company') + ')' : '');
      var lines = [
        'Name: ' + d.get('name'),
        'Company: ' + (d.get('company') || '-'),
        'Email: ' + d.get('email'),
        'Phone: ' + (d.get('phone') || '-')
      ];
      if (mode === 'quote') {
        lines.push('Service: ' + d.get('service'), 'Project location: ' + (d.get('location') || '-'));
      }
      lines.push('', d.get('message'));
      window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(lines.join('\n'));
      if (note) note.textContent = 'Your email app should open with the message ready to send. If it doesn’t, write to ' + CONTACT_EMAIL + '.';
    });
  }

  /* ---------- Footer year ---------- */

  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
