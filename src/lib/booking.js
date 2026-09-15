// Eigen afsprakenagenda op basis van Cal.com: beschikbaarheid, buffers en boekingen komen uit Cal.com.
// Overgenomen van de website van JONES advocaten, zodat beide sites dezelfde agenda en dezelfde werking hebben.
/* eslint-disable */
export function startBooking(embed, CAL_LINK, opts){
    var videoOnly = !!(opts && opts.videoOnly);
    var allowSlot = opts && typeof opts.allowSlot === 'function' ? opts.allowSlot : null;
    var lastDate = opts && opts.lastDate ? opts.lastDate : null; // 'JJJJ-MM-DD': laatste dag waarop geboekt kan worden
    if (!embed || !CAL_LINK || embed.dataset.bkStarted) return;
    embed.dataset.bkStarted = '1';

    var parts = CAL_LINK.split('/'), USER = parts[0], SLUG = parts[1];
    var TZ = 'Europe/Brussels', API = 'https://api.cal.com/v2';
    var state = { event: null, days: {}, loaded: {}, month: null, day: null, slot: null, loading: false };

    var fmtDayShort = new Intl.DateTimeFormat('nl-BE', { weekday: 'short', timeZone: TZ });
    var fmtDayNum = new Intl.DateTimeFormat('nl-BE', { day: 'numeric', timeZone: TZ });
    var fmtLong = new Intl.DateTimeFormat('nl-BE', { weekday: 'long', day: 'numeric', month: 'long', timeZone: TZ });
    var fmtMonth = new Intl.DateTimeFormat('nl-BE', { month: 'long', year: 'numeric', timeZone: TZ });
    var fmtTime = new Intl.DateTimeFormat('nl-BE', { hour: '2-digit', minute: '2-digit', timeZone: TZ });
    var esc = function(t){ return String(t).replace(/[&<>"']/g, function(c){ return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]; }); };
    var ymd = function(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0'); };
    var addDays = function(d, n){ var x = new Date(d); x.setDate(x.getDate() + n); return x; };
    var mondayOf = function(d){ var x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); var wd = (x.getDay() + 6) % 7; return addDays(x, -wd); };
    var noonOf = function(key){ var p = key.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2], 12)); };

    function fallbackHtml(msg){
      return '<div class="bk-card bk-center"><p class="result-kicker">Agenda</p><h3 class="bk-title">' + msg + '</h3>' +
        '<p class="bk-muted">Geef uw voorkeursmoment door via het contactformulier, dan nemen wij contact met u op.</p>' +
        '<div class="result-actions"><a class="mg-btn mg-btn-rust" href="/contact">Naar het contactformulier</a></div></div>';
    }

    embed.classList.add('is-custom');
    embed.innerHTML = '<div class="bk-card"><div class="bk-skeleton"><span></span><span></span><span></span></div><p class="bk-muted bk-loading">Beschikbare momenten laden…</p></div>';

    var headersGet = { 'cal-api-version': '2024-09-04' };
    var today = new Date();
    var todayKey = ymd(today);
    var firstMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    var MAX_MONTHS = 6;
    if (lastDate) {
      var lp = lastDate.split('-');
      MAX_MONTHS = Math.max(1, Math.min(MAX_MONTHS, (+lp[0] - firstMonth.getFullYear()) * 12 + (+lp[1] - 1 - firstMonth.getMonth()) + 1));
    }
    var monthKey = function(d){ return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0'); };

    function loadMonth(m){
      var key = monthKey(m);
      if (state.loaded[key]) return Promise.resolve();
      var from = new Date(m.getFullYear(), m.getMonth(), 1);
      if (from < today) from = today;
      var to = new Date(m.getFullYear(), m.getMonth() + 1, 1);
      return fetch(API + '/slots?username=' + encodeURIComponent(USER) + '&eventTypeSlug=' + encodeURIComponent(SLUG) + '&start=' + ymd(from) + '&end=' + ymd(to) + '&timeZone=' + encodeURIComponent(TZ), { headers: headersGet })
        .then(function(r){ return r.json(); })
        .then(function(j){
          if (!j || !j.data) throw new Error('geen data');
          Object.keys(j.data).forEach(function(k){ if (lastDate && k > lastDate) return; var list = (j.data[k] || []).filter(function(sl){ return !allowSlot || allowSlot(sl.start); }); if (list.length) state.days[k] = list; });
          state.loaded[key] = true;
        });
    }
    function firstDayIn(m){
      var mk = monthKey(m);
      return Object.keys(state.days).filter(function(k){ return k.slice(0, 7) === mk; }).sort()[0] || null;
    }

    fetch(API + '/event-types?username=' + encodeURIComponent(USER) + '&eventSlug=' + encodeURIComponent(SLUG), { headers: { 'cal-api-version': '2024-06-14' } })
      .then(function(r){ return r.json(); })
      .then(function(res){
        var ev = res && res.data; if (Array.isArray(ev)) ev = ev[0];
        if (!ev) throw new Error('geen data');
        state.event = ev;
        // Zoek de eerste maand met vrije momenten (maximaal MAX_MONTHS vooruit)
        var tryMonth = function(n){
          var m = new Date(firstMonth.getFullYear(), firstMonth.getMonth() + n, 1);
          return loadMonth(m).then(function(){
            if (firstDayIn(m) || n >= MAX_MONTHS - 1) return m;
            return tryMonth(n + 1);
          });
        };
        return tryMonth(0);
      })
      .then(function(m){
        state.month = m;
        state.day = firstDayIn(m);
        if (!state.day) { embed.innerHTML = fallbackHtml('Er zijn momenteel geen vrije momenten'); return; }
        renderPicker();
      })
      .catch(function(){ embed.innerHTML = fallbackHtml('De agenda kon niet geladen worden'); });

    function locationOptions(){
      var map = {
        'address': 'Op kantoor', 'attendeeAddress': 'Op uw adres', 'attendeePhone': 'Telefonisch (wij bellen u)',
        'phone': 'Telefonisch', 'link': 'Online', 'attendeeDefined': 'Andere locatie'
      };
      var vid = { 'cal-video': 'Videogesprek', 'google-meet': 'Videogesprek (Google Meet)', 'zoom': 'Videogesprek (Zoom)', 'office365-video': 'Videogesprek (Teams)' };
      return (state.event.locations || []).map(function(l){
        // Oudere API-versies geven sommige locaties door als { type: 'unknown', location: '{"type":"inPerson",…}' }
        if (l.type === 'unknown' && l.location) {
          try {
            var inner = JSON.parse(l.location);
            if (inner.type === 'inPerson') return { type: 'address' };
            if (inner.type === 'attendeeInPerson') return { type: 'attendeeAddress' };
            if (inner.type === 'phone' || inner.type === 'userPhone') return { type: 'phone' };
            if (inner.type === 'link') return { type: 'link' };
          } catch (e) {}
        }
        return l;
      }).filter(function(l){ return l.type !== 'unknown' && (!videoOnly || l.type === 'integration'); }).map(function(l, idx){
        var label = l.type === 'integration' ? (vid[l.integration] || 'Videogesprek') : (map[l.type] || 'Afspraak');
        return { idx: idx, loc: l, label: label };
      }).sort(function(a, b){
        var pr = function(o){ return o.loc.type === 'address' ? 0 : o.loc.type === 'integration' ? 1 : o.loc.type === 'attendeeAddress' ? 3 : 2; };
        return pr(a) - pr(b);
      }).map(function(o, k){ o.idx = k; return o; });
    }
    function descSlug(){
      var f = state.event.bookingFields || [];
      var has = function(slug){ return f.some(function(x){ return x.slug === slug && !x.hidden; }); };
      return has('notes') ? 'notes' : (has('title') ? 'title' : null);
    }

    function renderPicker(){
      var m = state.month, html = '';
      var idx = (m.getFullYear() - firstMonth.getFullYear()) * 12 + (m.getMonth() - firstMonth.getMonth());
      var canPrev = idx > 0, canNext = idx < MAX_MONTHS - 1;
      var monthName = fmtMonth.format(new Date(Date.UTC(m.getFullYear(), m.getMonth(), 15, 12)));
      html += '<div class="bk-card"><div class="bk-head"><div><p class="result-kicker">Stap 1 van 2</p><h3 class="bk-title">Kies een dag</h3></div></div>';
      html += '<div class="bk-split"><div class="bk-cal">' +
        '<div class="bk-cal-head"><span class="bk-month-name">' + monthName + '</span><div class="bk-nav">' +
        '<button type="button" class="bk-arrow" data-month="-1" aria-label="Vorige maand"' + (canPrev ? '' : ' disabled') + '>&larr;</button>' +
        '<button type="button" class="bk-arrow" data-month="1" aria-label="Volgende maand"' + (canNext ? '' : ' disabled') + '>&rarr;</button></div></div>' +
        '<div class="bk-grid bk-dows">' + ['ma','di','wo','do','vr','za','zo'].map(function(d){ return '<span>' + d + '</span>'; }).join('') + '</div>' +
        '<div class="bk-grid' + (state.loading ? ' is-loading' : '') + '">';
      var lead = (new Date(m.getFullYear(), m.getMonth(), 1).getDay() + 6) % 7;
      var daysInMonth = new Date(m.getFullYear(), m.getMonth() + 1, 0).getDate();
      for (var e = 0; e < lead; e++) html += '<span class="bk-cell is-blank"></span>';
      for (var d = 1; d <= daysInMonth; d++) {
        var key = ymd(new Date(m.getFullYear(), m.getMonth(), d));
        var n = (state.days[key] || []).length, sel = key === state.day;
        html += '<button type="button" class="bk-cell' + (n ? ' has-slots' : '') + (sel ? ' is-selected' : '') + (key === todayKey ? ' is-today' : '') + '" data-day="' + key + '"' + (n ? '' : ' disabled') +
          ' aria-pressed="' + sel + '" aria-label="' + fmtLong.format(noonOf(key)) + (n ? ', ' + n + ' vrije momenten' : ', geen vrije momenten') + '">' + d + '</button>';
      }
      html += '</div></div><div class="bk-slots">';
      var list = state.day && state.day.slice(0, 7) === monthKey(m) ? (state.days[state.day] || []) : [];
      if (state.loading) {
        html += '<p class="bk-muted bk-empty">Momenten laden…</p>';
      } else if (list.length) {
        html += '<div class="bk-times-head"><h4 class="bk-sub">' + fmtLong.format(noonOf(state.day)) + '</h4><span class="bk-muted">' + list.length + (list.length === 1 ? ' moment' : ' momenten') + '</span></div><div class="bk-times">';
        list.forEach(function(sl, k){ html += '<button type="button" class="bk-time" data-slot="' + k + '">' + fmtTime.format(new Date(sl.start)) + '</button>'; });
        html += '</div>';
      } else {
        html += '<p class="bk-muted bk-empty">' + (firstDayIn(m) ? 'Kies een dag met een stipje om de vrije uren te zien.' : 'Geen vrije momenten in deze maand. Bekijk de volgende maand.') + '</p>';
      }
      html += '</div></div><p class="bk-foot">' + (videoOnly ? 'Videogesprek' : 'Eerste consultatie') + ' &middot; ' + (state.event.lengthInMinutes || 30) + ' minuten &middot; &euro;75 excl. btw &middot; tijden in Belgische tijd</p></div>';
      embed.innerHTML = html;
    }

    function renderForm(){
      var sl = state.slot, start = new Date(sl.start), endT = new Date(start.getTime() + (state.event.lengthInMinutes || 30) * 60000);
      var locs = locationOptions();
      var prev = null; try { prev = JSON.parse(sessionStorage.getItem('mgz-contact') || 'null'); } catch (e) {}
      var html = '<div class="bk-card"><button type="button" class="back-link bk-back" data-back="1"><span aria-hidden="true">&larr;</span> Ander moment</button>' +
        '<p class="result-kicker">Stap 2 van 2</p><h3 class="bk-title">Uw gegevens</h3>' +
        '<div class="bk-summary"><span class="bk-summary-date">' + fmtLong.format(start) + '</span><span class="bk-summary-time">' + fmtTime.format(start) + ' – ' + fmtTime.format(endT) + '</span></div>' +
        '<form class="bk-form" novalidate>' +
        '<div class="field-row"><label class="field"><span class="field-label">Voornaam <em>*</em></span><input name="voornaam" autocomplete="given-name" required value="' + (prev ? esc(prev.voornaam) : '') + '"></label>' +
        '<label class="field"><span class="field-label">Achternaam <em>*</em></span><input name="achternaam" autocomplete="family-name" required value="' + (prev ? esc(prev.achternaam) : '') + '"></label></div>' +
        '<div class="field-row"><label class="field"><span class="field-label">E-mail <em>*</em></span><input type="email" name="email" autocomplete="email" required value="' + (prev ? esc(prev.email) : '') + '"></label>' +
        '<label class="field"><span class="field-label">Telefoon <span class="field-opt">(optioneel)</span></span><input type="tel" name="telefoon" inputmode="tel" autocomplete="tel" placeholder="+32470123456" value="' + (prev && prev.telefoon ? esc(prev.telefoon) : '') + '"></label></div>';
      if (locs.length > 1) {
        html += '<fieldset class="bk-locs"><legend class="field-label">Hoe wilt u het gesprek voeren? <em>*</em></legend>';
        locs.forEach(function(o, k){ html += '<label class="opt"><input type="radio" name="locatie" value="' + o.idx + '"' + (k === 0 ? ' checked' : '') + '> ' + o.label + '</label>'; });
        html += '</fieldset>';
      }
      if (locs.some(function(o){ return o.loc.type === 'attendeeAddress'; })) {
        html += '<label class="field bk-address" hidden><span class="field-label">Uw adres <em>*</em></span><input name="adres" autocomplete="street-address"></label>';
      }
      html += '<label class="field"><span class="field-label">Korte omschrijving van uw vraag <em>*</em></span><textarea name="omschrijving" rows="4" required placeholder="Waarover gaat het?">' + (prev ? esc((prev.onderwerp ? prev.onderwerp + ': ' : '') + prev.bericht) : '') + '</textarea></label>' +
        '<p class="form-error" role="alert" hidden></p>' +
        '<button type="submit" class="mg-btn mg-btn-rust form-submit">Bevestig afspraak</button>' +
        '<p class="form-note">U ontvangt meteen een bevestiging per e-mail. Annuleren of verplaatsen kan via de link in die e-mail.' + (videoOnly ? ' Het gesprek wordt gevoerd door een advocaat ingeschreven aan de balie West-Vlaanderen; u ontvangt de volledige gegevens van de advocaat vóór er een opdracht is.' : '') + '</p>' +
        '</form></div>';
      embed.innerHTML = html;
      var form = embed.querySelector('form');
      var addr = embed.querySelector('.bk-address');
      function syncAddr(){
        if (!addr) return;
        var r = form.querySelector('input[name="locatie"]:checked');
        var o = r ? locs[+r.value] : locs[0];
        var show = o && o.loc.type === 'attendeeAddress';
        addr.hidden = !show; addr.querySelector('input').required = show;
      }
      form.addEventListener('change', syncAddr); syncAddr();
      form.addEventListener('submit', function(e){ e.preventDefault(); submitBooking(form, locs); });
      // Telefoon: enkel cijfers, met eventueel een + vooraan
      var telInput = form.querySelector('input[name="telefoon"]');
      if (telInput) telInput.addEventListener('input', function(){
        var v = telInput.value, plus = v.trim().charAt(0) === '+' ? '+' : '';
        var clean = plus + v.replace(/\D/g, '').slice(0, 15);
        if (clean !== v) telInput.value = clean;
      });
    }

    function normPhone(v){
      var p = v.replace(/[\s.\/()-]/g, '');
      if (/^00\d+/.test(p)) p = '+' + p.slice(2);
      else if (/^0\d{8,9}$/.test(p)) p = '+32' + p.slice(1);
      return /^\+\d{8,15}$/.test(p) ? p : null;
    }

    function submitBooking(form, locs){
      var err = form.querySelector('.form-error'), btn = form.querySelector('.form-submit');
      err.hidden = true;
      var ok = true, first = null;
      form.querySelectorAll('[required]').forEach(function(el){
        var valid = el.value.trim() !== '' && (el.type !== 'email' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(el.value.trim()));
        var w = el.closest('.field'); if (w) w.classList.toggle('is-invalid', !valid);
        if (!valid) { ok = false; first = first || el; }
      });
      if (!ok) { err.textContent = 'Vul de verplichte velden in (met een *) en controleer uw e-mailadres.'; err.hidden = false; first.focus(); return; }

      var fd = new FormData(form);
      var desc = fd.get('omschrijving').trim();
      var telRaw = (fd.get('telefoon') || '').trim(), tel = telRaw ? normPhone(telRaw) : null;
      // Heeft het afspraaktype geen telefoonveld, dan komt het nummer in de omschrijving
      var hasPhoneField = (state.event.bookingFields || []).some(function(x){ return x.slug === 'attendeePhoneNumber' && !x.hidden; });
      if (telRaw && (!tel || !hasPhoneField)) { desc += (desc ? '\n\n' : '') + 'Telefoon: ' + (tel || telRaw); tel = null; }
      var body = {
        start: new Date(state.slot.start).toISOString(),
        eventTypeSlug: SLUG, username: USER,
        attendee: { name: (fd.get('voornaam').trim() + ' ' + fd.get('achternaam').trim()), email: fd.get('email').trim(), timeZone: TZ, language: 'nl' }
      };
      if (tel) body.attendee.phoneNumber = tel;
      var r = form.querySelector('input[name="locatie"]:checked');
      var o = r ? locs[+r.value] : locs[0];
      if (o) {
        if (o.loc.type === 'integration') body.location = { type: 'integration', integration: o.loc.integration };
        else if (o.loc.type === 'attendeeAddress') body.location = { type: 'attendeeAddress', address: (fd.get('adres') || '').trim() };
        // Op kantoor: zelfde formaat als de boekingspagina van Cal.com zelf (het API-type 'address' wordt geweigerd)
        else if (o.loc.type === 'address') body.bookingFieldsResponses = { location: { value: 'inPerson', optionValue: '' } };
      }
      var slug = descSlug();
      if (slug) { body.bookingFieldsResponses = body.bookingFieldsResponses || {}; body.bookingFieldsResponses[slug] = slug === 'title' ? desc.slice(0, 250) : desc; }

      btn.disabled = true; btn.textContent = 'Bezig met boeken…';
      fetch(API + '/bookings', { method: 'POST', headers: { 'cal-api-version': '2026-02-25', 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
        .then(function(res){ return res.json().then(function(j){ return { ok: res.ok, j: j }; }); })
        .then(function(x){
          if (!x.ok || x.j.status === 'error') {
            var m = x.j && x.j.error && x.j.error.message ? x.j.error.message : '';
            throw new Error(m);
          }
          renderDone(body, o, x.j.data);
        })
        .catch(function(e){
          err.innerHTML = 'Boeken lukte niet' + (e.message ? ' (' + esc(e.message) + ')' : '') + '. Kies een ander moment of <a href="/contact">geef uw voorkeursmoment door via het contactformulier</a>.';
          err.hidden = false; btn.disabled = false; btn.textContent = 'Bevestig afspraak';
        });
    }

    function renderDone(body, o, data){
      var start = new Date(body.start);
      var pending = data && data.status === 'pending';
      embed.innerHTML = '<div class="bk-card bk-done">' +
        '<div class="bk-check" aria-hidden="true"></div>' +
        '<p class="result-kicker">' + (pending ? 'Aanvraag verstuurd' : 'Afspraak bevestigd') + '</p>' +
        '<h3 class="bk-title">' + (pending ? 'Uw aanvraag is ontvangen' : 'Uw afspraak staat vast') + '</h3>' +
        '<div class="bk-summary"><span class="bk-summary-date">' + fmtLong.format(start) + '</span><span class="bk-summary-time">' + fmtTime.format(start) + (o ? ' &middot; ' + o.label : '') + '</span></div>' +
        '<p class="bk-muted">' + (pending ? 'U krijgt een e-mail zodra de afspraak bevestigd is.' : 'U ontvangt een bevestiging op ' + esc(body.attendee.email) + ', met de mogelijkheid om te verplaatsen of te annuleren.') + '</p>' +
        '<p class="bk-muted">' + (videoOnly ? 'U krijgt de link naar het videogesprek in de bevestiging. Houd de documenten die met uw vraag te maken hebben bij de hand.' : 'Breng naar de consultatie alle documenten mee die met uw vraag te maken hebben.') + '</p></div>';
      try { sessionStorage.removeItem('mgz-contact'); } catch (e) {}
    }

    embed.addEventListener('click', function(e){
      var t = e.target.closest('button'); if (!t || t.disabled) return;
      if (t.hasAttribute('data-month')) {
        var m = state.month;
        state.month = new Date(m.getFullYear(), m.getMonth() + +t.getAttribute('data-month'), 1);
        state.day = firstDayIn(state.month);
        state.loading = !state.loaded[monthKey(state.month)];
        renderPicker();
        loadMonth(state.month).then(function(){
          state.loading = false;
          if (!state.day) state.day = firstDayIn(state.month);
          renderPicker();
        }).catch(function(){ embed.innerHTML = fallbackHtml('De agenda kon niet geladen worden'); });
      } else if (t.hasAttribute('data-day')) {
        state.day = t.getAttribute('data-day'); renderPicker();
      } else if (t.hasAttribute('data-slot')) {
        state.slot = state.days[state.day][+t.getAttribute('data-slot')]; renderForm();
        var f = embed.querySelector('input[name="voornaam"]'); if (f && !f.value) f.focus({ preventScroll: true });
      } else if (t.hasAttribute('data-back')) {
        renderPicker();
      }
    });
  }
