/* Seena cookie consent.
   Google Tag Manager (GA4 + Meta Pixel) loads only after the visitor clicks Accept.
   Choice is stored in localStorage as {v:"granted"|"denied", t:timestamp} and asked again after 6 months.
   Footer link "Cookie settings" calls window.seenaCookieSettings() to reopen the banner. */
(function () {
  var GTM_ID = 'GTM-K4CWWPMN';
  var KEY = 'seena_consent';
  var MAX_AGE = 1000 * 60 * 60 * 24 * 182;
  var gtmLoaded = false;

  function read() {
    try {
      var c = JSON.parse(localStorage.getItem(KEY));
      if (c && (c.v === 'granted' || c.v === 'denied') && Date.now() - c.t < MAX_AGE) return c.v;
    } catch (e) {}
    return null;
  }
  function save(v) {
    try { localStorage.setItem(KEY, JSON.stringify({ v: v, t: Date.now() })); } catch (e) {}
  }
  function clearCookies() {
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (/^(_ga|_gid|_gat|_fbp|_fbc)/.test(name)) {
        var host = location.hostname.replace(/^www\./, '');
        ['', host, '.' + host].forEach(function (d) {
          document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + (d ? '; domain=' + d : '');
        });
      }
    });
  }
  function loadGTM() {
    if (gtmLoaded) return;
    gtmLoaded = true;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtm.js?id=' + GTM_ID;
    document.head.appendChild(s);
  }

  var css =
    '.sc-banner{position:fixed;left:16px;right:16px;bottom:16px;z-index:1000;max-width:560px;margin:0 auto;background:#fff;color:#2a2520;border-radius:14px;box-shadow:0 8px 40px rgba(0,0,0,.18);padding:22px 24px;font-family:"DM Sans",sans-serif;font-size:14px;line-height:1.6}' +
    '.sc-banner p{margin:0 0 16px}' +
    '.sc-banner a{color:#3d5843;text-decoration:underline}' +
    '.sc-actions{display:flex;gap:10px;flex-wrap:wrap}' +
    '.sc-actions button{flex:1 1 140px;font:inherit;font-weight:500;padding:11px 18px;border-radius:999px;cursor:pointer;border:1.5px solid #3d5843}' +
    '.sc-reject{background:#fff;color:#3d5843}' +
    '.sc-accept{background:#3d5843;color:#fff}' +
    '.sc-actions button:focus-visible{outline:2px solid #7daa86;outline-offset:2px}';

  function showBanner() {
    if (document.querySelector('.sc-banner')) return;
    if (!document.getElementById('sc-style')) {
      var st = document.createElement('style');
      st.id = 'sc-style';
      st.textContent = css;
      document.head.appendChild(st);
    }
    var b = document.createElement('div');
    b.className = 'sc-banner';
    b.setAttribute('role', 'dialog');
    b.setAttribute('aria-label', 'Cookie preferences');
    b.innerHTML =
      '<p>We use Google Analytics and the Meta Pixel to see how visitors use this site and to measure our ads. They only run if you accept. You can change your choice any time under Cookie settings at the bottom of each page. <a href="/about/privacy-policy/">Privacy Policy</a></p>' +
      '<div class="sc-actions"><button type="button" class="sc-reject">Reject</button><button type="button" class="sc-accept">Accept</button></div>';
    document.body.appendChild(b);
    b.querySelector('.sc-accept').onclick = function () { save('granted'); b.remove(); loadGTM(); };
    b.querySelector('.sc-reject').onclick = function () {
      var wasLoaded = gtmLoaded;
      save('denied'); clearCookies(); b.remove();
      if (wasLoaded) location.reload();
    };
  }

  window.seenaCookieSettings = showBanner;

  var choice = read();
  if (choice === 'granted') {
    loadGTM();
  } else if (choice === null) {
    if (document.body) showBanner();
    else document.addEventListener('DOMContentLoaded', showBanner);
  }
})();
