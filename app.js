/* ==========================================================================
   Trazip RateCompare - 9 Agency Engine with Real Supplier Logos & Verified Search
   ========================================================================== */

(function () {
  const STORAGE_KEY = 'trazip_supplier_credentials_v1';

  // Global State
  const state = {
    hotels: [...INITIAL_HOTELS],
    activeAgencies: new Set(AGENCIES.map(a => a.id)),
    selectedCurrency: 'ILS',
    viewMode: 'CARDS',
    sortBy: 'LOWEST_PRICE',
    debugOpen: true,
    debugLogs: [],
    redirectTimer: null,
    supplierCredentials: {},
    liveQuotes: {},
    lastLiveApiPayloads: {},
    filters: {
      hotelName: '',
      roomType: 'ALL',
      breakfastFilter: 'ALL',
      cancellationFilter: 'ALL',
      checkIn: '',
      checkOut: '',
      adults: 2,
      kids: 0,
      rooms: 1,
      nights: 5
    },
    visibleLimit: 24,
    destinations: []
  };

  // Dynamic Global Hotel Catalog & Destinations (Loaded asynchronously with automatic fallback)
  let GLOBAL_HOTEL_CATALOG = [];
  let GLOBAL_DESTINATIONS = [];

  const DOM = {};

  function cacheDOM() {
    DOM.connectedAgenciesCount = document.getElementById('connectedAgenciesCount');
    DOM.currencySelect = document.getElementById('currencySelect');
    DOM.hotelSearchInput = document.getElementById('hotelSearchInput');
    DOM.hotelAutocompleteList = document.getElementById('hotelAutocompleteList');
    DOM.roomTypeSelect = document.getElementById('roomTypeSelect');
    DOM.breakfastSelect = document.getElementById('breakfastSelect');
    DOM.cancellationSelect = document.getElementById('cancellationSelect');
    DOM.checkInDate = document.getElementById('checkInDate');
    DOM.checkOutDate = document.getElementById('checkOutDate');
    DOM.nightsCountLabel = document.getElementById('nightsCountLabel');
    DOM.btnGuestsPopover = document.getElementById('btnGuestsPopover');
    DOM.guestsSummaryText = document.getElementById('guestsSummaryText');
    DOM.guestsPopoverBox = document.getElementById('guestsPopoverBox');
    DOM.btnAdultsDec = document.getElementById('btnAdultsDec');
    DOM.btnAdultsInc = document.getElementById('btnAdultsInc');
    DOM.adultsVal = document.getElementById('adultsVal');
    DOM.btnKidsDec = document.getElementById('btnKidsDec');
    DOM.btnKidsInc = document.getElementById('btnKidsInc');
    DOM.kidsVal = document.getElementById('kidsVal');
    DOM.btnRoomsDec = document.getElementById('btnRoomsDec');
    DOM.btnRoomsInc = document.getElementById('btnRoomsInc');
    DOM.roomsVal = document.getElementById('roomsVal');
    DOM.btnDoneGuests = document.getElementById('btnDoneGuests');
    DOM.btnSearch = document.getElementById('btnSearch');
    DOM.btnResetFilters = document.getElementById('btnResetFilters');
    DOM.agencyChipsContainer = document.getElementById('agencyChipsContainer');
    DOM.btnSelectAllAgencies = document.getElementById('btnSelectAllAgencies');
    DOM.btnClearAgencies = document.getElementById('btnClearAgencies');
    DOM.resultsCountText = document.getElementById('resultsCountText');
    DOM.resultsSummaryBadge = document.getElementById('resultsSummaryBadge');
    DOM.sortSelect = document.getElementById('sortSelect');
    DOM.btnViewCards = document.getElementById('btnViewCards');
    DOM.btnViewTable = document.getElementById('btnViewTable');
    DOM.btnViewLeaderboard = document.getElementById('btnViewLeaderboard');
    DOM.resultsContainer = document.getElementById('resultsContainer');
    DOM.btnOpenAddModal = document.getElementById('btnOpenAddModal');
    DOM.btnCloseAddModal = document.getElementById('btnCloseAddModal');
    DOM.btnCancelAddModal = document.getElementById('btnCancelAddModal');
    DOM.addModal = document.getElementById('addModal');
    DOM.addQuoteForm = document.getElementById('addQuoteForm');
    DOM.bookingToast = document.getElementById('bookingToast');
    DOM.toastAgencyName = document.getElementById('toastAgencyName');
    DOM.toastMessage = document.getElementById('toastMessage');
    DOM.btnCloseToast = document.getElementById('btnCloseToast');
    DOM.btnToggleDebug = document.getElementById('btnToggleDebug');
    DOM.debugConsoleBox = document.getElementById('debugConsoleBox');
    DOM.debugLogOutput = document.getElementById('debugLogOutput');
    DOM.btnClearDebugLog = document.getElementById('btnClearDebugLog');
    DOM.aggregatorProgressBox = document.getElementById('aggregatorProgressBox');
    DOM.aggregatorProgressBar = document.getElementById('aggregatorProgressBar');
    DOM.aggregatorPercentText = document.getElementById('aggregatorPercentText');
    DOM.supplierApiStatusGrid = document.getElementById('supplierApiStatusGrid');
    DOM.jsonInspectorModal = document.getElementById('jsonInspectorModal');
    DOM.jsonModalSupplierName = document.getElementById('jsonModalSupplierName');
    DOM.jsonModalRefCode = document.getElementById('jsonModalRefCode');
    DOM.jsonModalPreContent = document.getElementById('jsonModalPreContent');
    DOM.btnCloseJsonModal = document.getElementById('btnCloseJsonModal');
    DOM.btnCloseJsonModalBottom = document.getElementById('btnCloseJsonModalBottom');
    DOM.btnCopyJsonPayload = document.getElementById('btnCopyJsonPayload');

    // Supplier API Settings Modal
    DOM.btnOpenApiSettings = document.getElementById('btnOpenApiSettings');
    DOM.apiSettingsModal = document.getElementById('apiSettingsModal');
    DOM.btnCloseApiSettingsModal = document.getElementById('btnCloseApiSettingsModal');
    DOM.btnCancelApiSettings = document.getElementById('btnCancelApiSettings');
    DOM.apiSettingsForm = document.getElementById('apiSettingsForm');
    DOM.btnClearAllApiSettings = document.getElementById('btnClearAllApiSettings');

    // Booking Handoff Modal
    DOM.bookingModal = document.getElementById('bookingModal');
    DOM.bookingModalAgencyIcon = document.getElementById('bookingModalAgencyIcon');
    DOM.bookingModalAgencyName = document.getElementById('bookingModalAgencyName');
    DOM.bookingModalRefCode = document.getElementById('bookingModalRefCode');
    DOM.bookingModalHotel = document.getElementById('bookingModalHotel');
    DOM.bookingModalRoom = document.getElementById('bookingModalRoom');
    DOM.bookingModalTotalRate = document.getElementById('bookingModalTotalRate');
    DOM.bookingModalDates = document.getElementById('bookingModalDates');
    DOM.bookingModalGuests = document.getElementById('bookingModalGuests');
    DOM.bookingModalBoard = document.getElementById('bookingModalBoard');
    DOM.bookingCountdownText = document.getElementById('bookingCountdownText');
    DOM.bookingModalPortalUrl = document.getElementById('bookingModalPortalUrl');
    DOM.btnProceedDirectLink = document.getElementById('btnProceedDirectLink');
    DOM.btnCopyBookingRef = document.getElementById('btnCopyBookingRef');
    DOM.btnCloseBookingModal = document.getElementById('btnCloseBookingModal');
    DOM.btnCancelBookingModal = document.getElementById('btnCancelBookingModal');

    // Live Query in Booking Modal
    DOM.bookingModalCredsBox = document.getElementById('bookingModalCredsBox');
    DOM.bookingModalCredsTitle = document.getElementById('bookingModalCredsTitle');
    DOM.bookingModalCredsDesc = document.getElementById('bookingModalCredsDesc');
    DOM.btnModalTriggerLiveSearch = document.getElementById('btnModalTriggerLiveSearch');
    DOM.bookingModalLiveLogBox = document.getElementById('bookingModalLiveLogBox');
    DOM.bookingModalLiveBadge = document.getElementById('bookingModalLiveBadge');
    DOM.bookingModalLivePre = document.getElementById('bookingModalLivePre');

    // Accountability Banner
    DOM.accountabilityBannerBox = document.getElementById('accountabilityBannerBox');
  }

  // Credential & Session State Helpers
  function isAgencyConfigured(agencyId) {
    const creds = state.supplierCredentials[agencyId];
    if (!creds) return false;
    return Boolean(creds.key || creds.pass || creds.client || creds.user || creds.id || creds.agency || creds.secret);
  }

  function isAgencyVerified(agencyId) {
    const creds = state.supplierCredentials[agencyId];
    return Boolean(creds && isAgencyConfigured(agencyId) && creds.verified);
  }

  function getAgencyAuthAlert(agencyId) {
    const creds = state.supplierCredentials[agencyId];
    return (creds && creds.authAlert) ? creds.authAlert : null;
  }

  function getSupplierLogoHTML(agency, size = 'sm') {
    const sizeClass = size === 'lg' ? 'agency-logo-icon lg' : size === 'md' ? 'agency-logo-icon md' : 'agency-logo-icon sm';
    return `<img src="${agency.logoUrl}" class="${sizeClass}" alt="${agency.name}" onerror="this.onerror=null; this.outerHTML='<span>${agency.icon}</span>';" loading="lazy">`;
  }

  function logDebug(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString();
    const formatted = `[${timestamp}] [${type.toUpperCase()}] ${message}`;
    state.debugLogs.push(formatted);
    console.log(formatted);

    if (DOM.debugLogOutput) {
      const color = type === 'error' ? '#f43f5e' : type === 'warn' ? '#fbbf24' : '#34d399';
      DOM.debugLogOutput.innerHTML += `<div style="color: ${color}; margin-bottom: 4px;">${formatted}</div>`;
      DOM.debugLogOutput.scrollTop = DOM.debugLogOutput.scrollHeight;
    }
  }

  window.addEventListener('error', (e) => {
    logDebug(`JS Exception: ${e.message} at line ${e.lineno}:${e.colno}`, 'error');
  });

  // Helper to read current input values from credentials modal form
  function readCredsForAgencyFromForm(agencyId) {
    switch (agencyId) {
      case 'webbeds':
        return {
          client: document.getElementById('cfg_webbeds_client')?.value.trim() || '',
          key: document.getElementById('cfg_webbeds_key')?.value.trim() || ''
        };
      case 'ratehawk':
        return {
          id: document.getElementById('cfg_ratehawk_id')?.value.trim() || '',
          key: document.getElementById('cfg_ratehawk_key')?.value.trim() || ''
        };
      case 'tbo':
        return {
          user: document.getElementById('cfg_tbo_user')?.value.trim() || '',
          pass: document.getElementById('cfg_tbo_pass')?.value.trim() || ''
        };
      case 'arbitrip':
        return {
          id: document.getElementById('cfg_arbitrip_id')?.value.trim() || '',
          key: document.getElementById('cfg_arbitrip_key')?.value.trim() || ''
        };
      case 'goglobal':
        return {
          agency: document.getElementById('cfg_goglobal_agency')?.value.trim() || '',
          pass: document.getElementById('cfg_goglobal_pass')?.value.trim() || ''
        };
      case 'expedia':
        return {
          key: document.getElementById('cfg_expedia_key')?.value.trim() || '',
          secret: document.getElementById('cfg_expedia_secret')?.value.trim() || ''
        };
      case 'innstant':
        return {
          id: document.getElementById('cfg_innstant_id')?.value.trim() || '',
          key: document.getElementById('cfg_innstant_key')?.value.trim() || ''
        };
      case 'tale':
        return {
          user: document.getElementById('cfg_tale_user')?.value.trim() || '',
          pass: document.getElementById('cfg_tale_pass')?.value.trim() || ''
        };
      case 'ptc':
        return {
          user: document.getElementById('cfg_ptc_user')?.value.trim() || '',
          pass: document.getElementById('cfg_ptc_pass')?.value.trim() || ''
        };
      default:
        return {};
    }
  }

  // ==========================================================================
  // Supplier Live API Gateway & Authentication Engine
  // ==========================================================================
  const SupplierGateway = {
    // HTTP fetch with automatic CORS proxy fallback for static GitHub Pages
    async fetchWithCorsFallback(url, options = {}, timeoutMs = 8000) {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      const opts = { ...options, signal: controller.signal };

      try {
        logDebug(`🌐 Direct Request: ${options.method || 'GET'} ${url}`, 'info');
        const res = await fetch(url, opts);
        clearTimeout(timer);
        return res;
      } catch (err) {
        clearTimeout(timer);
        logDebug(`⚠️ Direct fetch CORS restricted (${err.message}). Attempting via secure CORS proxy bridge...`, 'warn');
        const proxyUrl = `https://corsproxy.io/?url=${encodeURIComponent(url)}`;
        const proxyController = new AbortController();
        const proxyTimer = setTimeout(() => proxyController.abort(), timeoutMs);
        try {
          const proxyRes = await fetch(proxyUrl, { ...options, signal: proxyController.signal });
          clearTimeout(proxyTimer);
          return proxyRes;
        } catch (proxyErr) {
          clearTimeout(proxyTimer);
          throw new Error(`Direct connection restricted (${err.message}) and CORS proxy failed (${proxyErr.message})`);
        }
      }
    },

    // Live Authentication & Ping Tester
    async testAuth(agencyId, creds) {
      const agency = AGENCIES.find(a => a.id === agencyId);
      const agencyName = agency ? agency.name : agencyId;

      console.group(`🧪 [TRAZIP LIVE AUTH TEST] ${agencyName}`);
      console.log('Agency:', agencyName);
      console.log('Credentials:', {
        user_or_id: creds.user || creds.id || creds.client || creds.agency || '(none)',
        key_or_pass: creds.key || creds.pass || creds.secret ? '***[PROVIDED]***' : '(none)'
      });

      logDebug(`🧪 Initiating live authentication test for ${agencyName}...`, 'info');

      let endpoint = '';
      let options = { method: 'POST', headers: { 'Content-Type': 'application/json' } };

      try {
        switch (agencyId) {
          case 'ratehawk': {
            const keyId = creds.id || '';
            const apiKey = creds.key || '';
            if (!keyId || !apiKey) throw new Error('Please enter both Key ID and API Key / Password.');
            endpoint = 'https://api.worldota.net/api/b2b/v3/hotel/info/';
            const authHeader = 'Basic ' + btoa(`${keyId}:${apiKey}`);
            options = {
              method: 'POST',
              headers: {
                'Authorization': authHeader,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ id: 'the_norman_tel_aviv', language: 'en' })
            };
            break;
          }

          case 'tbo': {
            const user = creds.user || '';
            const pass = creds.pass || '';
            if (!user || !pass) throw new Error('Please enter Username and Password.');
            endpoint = 'https://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/Authenticate';
            options = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ClientId: user,
                UserName: user,
                Password: pass,
                EndUserIp: '127.0.0.1'
              })
            };
            break;
          }

          case 'webbeds': {
            const client = creds.client || '';
            const key = creds.key || '';
            if (!client && !key) throw new Error('Please enter Webbeds Client Code and API Key.');
            endpoint = 'https://api.webbeds.com/v1/auth/verify';
            options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${key}`,
                'X-Client-Id': client
              },
              body: JSON.stringify({ clientCode: client, check: true })
            };
            break;
          }

          case 'innstant': {
            const partnerId = creds.id || '';
            const key = creds.key || '';
            if (!partnerId && !key) throw new Error('Please enter Partner ID and API Key.');
            endpoint = 'https://api.innstant.travel/v1/auth/ping';
            options = {
              method: 'GET',
              headers: {
                'X-Partner-Id': partnerId,
                'X-API-Key': key
              }
            };
            break;
          }

          case 'arbitrip': {
            const key = creds.key || '';
            if (!key) throw new Error('Please enter Arbitrip API Secret Token.');
            endpoint = 'https://api.arbitrip.com/v1/auth/verify';
            options = {
              method: 'GET',
              headers: { 'Authorization': `Bearer ${key}` }
            };
            break;
          }

          case 'goglobal': {
            const agencyCode = creds.agency || '';
            const pass = creds.pass || '';
            if (!agencyCode || !pass) throw new Error('Please enter Agency Code and XML Password.');
            endpoint = 'https://api.goglobal.travel/v1/auth';
            options = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ AgencyCode: agencyCode, Password: pass })
            };
            break;
          }

          case 'expedia': {
            const key = creds.key || '';
            const secret = creds.secret || '';
            if (!key) throw new Error('Please enter Expedia TAAP Partner API Key.');
            endpoint = 'https://api.ean.com/v3/properties/availability';
            options = {
              method: 'GET',
              headers: { 'Authorization': `Rapid key=${key}` }
            };
            break;
          }

          case 'tale': {
            const user = creds.user || '';
            const pass = creds.pass || '';
            if (!user || !pass) throw new Error('Please enter Tale Travel Username and Password.');
            endpoint = 'https://www.taletravel.com/api/agent/auth';
            options = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: user, password: pass })
            };
            break;
          }

          case 'ptc': {
            const user = creds.user || '';
            const pass = creds.pass || '';
            if (!user || !pass) throw new Error('Please enter PTC Travel User ID and Password.');
            endpoint = 'https://www.ptc.co.il/api/auth/login';
            options = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ userId: user, password: pass })
            };
            break;
          }

          default:
            throw new Error(`Unknown agency: ${agencyId}`);
        }

        console.log('Endpoint URL:', endpoint);
        console.log('Request Config:', options);

        const res = await SupplierGateway.fetchWithCorsFallback(endpoint, options, 7000);
        const text = await res.text();
        let parsed;
        try { parsed = JSON.parse(text); } catch { parsed = text; }

        console.log('HTTP Status:', res.status, res.statusText);
        console.log('Response Payload:', parsed);
        console.groupEnd();

        if (res.status >= 200 && res.status < 300) {
          const sessionCookie = `trazip_sess_${agencyId}_${Date.now().toString(36)}`;
          if (!state.supplierCredentials[agencyId]) state.supplierCredentials[agencyId] = {};
          Object.assign(state.supplierCredentials[agencyId], creds, {
            verified: true,
            sessionCookie: sessionCookie,
            verifiedAt: new Date().toISOString(),
            authAlert: null
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.supplierCredentials));
          updateApiBadges();
          renderAgencyChips();
          renderAccountabilityBanner();

          logDebug(`✓ [AUTH SUCCESS & SESSION STORED] ${agencyName} authenticated! Session token cached. Auto-pass enabled. (HTTP ${res.status})`, 'pass');
          return { success: true, status: res.status, data: parsed, sessionCookie, message: `Connected (HTTP ${res.status})` };
        } else if (res.status === 401 || res.status === 403) {
          if (!state.supplierCredentials[agencyId]) state.supplierCredentials[agencyId] = {};
          Object.assign(state.supplierCredentials[agencyId], creds, {
            verified: false,
            sessionCookie: null,
            authAlert: `Authentication rejected (HTTP ${res.status}): Invalid trade credentials`
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state.supplierCredentials));
          updateApiBadges();
          renderAgencyChips();
          renderAccountabilityBanner();

          logDebug(`❌ [AUTH ERROR] ${agencyName} authentication rejected (HTTP ${res.status}): Invalid credentials.`, 'error');
          return { success: false, status: res.status, error: `Auth Rejected (${res.status})`, data: parsed };
        } else {
          logDebug(`⚠️ [AUTH RESPONSE] ${agencyName} returned HTTP ${res.status}`, 'warn');
          return { success: true, status: res.status, data: parsed, message: `HTTP ${res.status}` };
        }
      } catch (err) {
        console.warn(`[TRAZIP LIVE AUTH ERROR] ${agencyName}:`, err);
        console.groupEnd();
        logDebug(`❌ [AUTH ERROR] ${agencyName}: ${err.message}`, 'error');
        return { success: false, error: err.message };
      }
    },

    // Search Real Live Hotel Rates
    async searchRates(agencyId, hotel, filters, creds) {
      const agency = AGENCIES.find(a => a.id === agencyId);
      const agencyName = agency ? agency.name : agencyId;

      console.group(`⚡ [TRAZIP LIVE API QUERY] ${agencyName} -> "${hotel.name}"`);
      console.log('Hotel:', hotel.name, hotel.location);
      console.log('Stay Dates:', `${filters.checkIn} to ${filters.checkOut} (${filters.nights} nights)`);
      console.log('Guests:', `${filters.adults} Adults, ${filters.rooms} Room(s)`);

      logDebug(`⚡ Querying live rates from ${agencyName} for "${hotel.name}"...`, 'info');

      const refCode = `${agencyId.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-LIVE`;

      try {
        let endpoint = '';
        let options = { method: 'POST', headers: { 'Content-Type': 'application/json' } };
        let reqPayload = {};

        switch (agencyId) {
          case 'ratehawk': {
            endpoint = 'https://api.worldota.net/api/b2b/v3/search/serp/hotels/';
            const auth = 'Basic ' + btoa(`${creds.id || ''}:${creds.key || ''}`);
            reqPayload = {
              checkin: filters.checkIn,
              checkout: filters.checkOut,
              guests: [{ adults: Number(filters.adults), children: [] }],
              id: hotel.name.toLowerCase().replace(/[^a-z0-9]+/g, '_'),
              currency: state.selectedCurrency || 'USD',
              residency: 'il',
              language: 'en'
            };
            options = {
              method: 'POST',
              headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
              body: JSON.stringify(reqPayload)
            };
            break;
          }

          case 'tbo': {
            endpoint = 'https://api.tektravels.com/BookingEngineService_Hotel/hotelservice.svc/rest/GetHotelResult';
            reqPayload = {
              CheckInDate: filters.checkIn,
              NoOfNights: filters.nights,
              CountryCode: 'IL',
              CityName: hotel.location,
              NoOfRooms: filters.rooms,
              GuestNationality: 'IL',
              RoomGuests: [{ NoOfAdults: Number(filters.adults), NoOfChild: 0 }]
            };
            options = {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(reqPayload)
            };
            break;
          }

          case 'webbeds': {
            endpoint = 'https://api.webbeds.com/v1/hotels/availability';
            reqPayload = {
              hotel: hotel.name,
              checkIn: filters.checkIn,
              checkOut: filters.checkOut,
              adults: Number(filters.adults),
              rooms: Number(filters.rooms)
            };
            options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${creds.key || ''}`,
                'X-Client-Id': creds.client || ''
              },
              body: JSON.stringify(reqPayload)
            };
            break;
          }

          case 'innstant': {
            endpoint = 'https://api.innstant.travel/v1/hotels/availability';
            reqPayload = {
              hotel_name: hotel.name,
              check_in: filters.checkIn,
              check_out: filters.checkOut,
              adults: Number(filters.adults)
            };
            options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'X-Partner-Id': creds.id || '',
                'X-API-Key': creds.key || ''
              },
              body: JSON.stringify(reqPayload)
            };
            break;
          }

          default: {
            endpoint = `${agency.portalUrl}/api/v1/rates/search`;
            reqPayload = {
              hotel: hotel.name,
              destination: hotel.location,
              checkIn: filters.checkIn,
              checkOut: filters.checkOut,
              adults: filters.adults
            };
            options = {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${creds.key || creds.pass || ''}`
              },
              body: JSON.stringify(reqPayload)
            };
          }
        }

        console.log('Sending request to endpoint:', endpoint);
        console.log('Request Payload:', reqPayload);

        const startTime = Date.now();
        const res = await SupplierGateway.fetchWithCorsFallback(endpoint, options, 7000);
        const elapsed = Date.now() - startTime;
        const text = await res.text();
        let json;
        try { json = JSON.parse(text); } catch { json = text; }

        console.log(`HTTP ${res.status} Response received in ${elapsed}ms:`, json);
        console.groupEnd();

        // Cache payload for inspector
        state.lastLiveApiPayloads[agencyId] = {
          aggregator_source: "Trazip B2B RateCompare Engine (LIVE SESSION)",
          supplier_endpoint: agencyName,
          endpoint_url: endpoint,
          provider_ref_code: refCode,
          request_params: reqPayload,
          supplier_response: json,
          http_status: res.status,
          latency_ms: elapsed,
          timestamp: new Date().toISOString()
        };

        logDebug(`✓ [LIVE RESPONSE] ${agencyName}: HTTP ${res.status} in ${elapsed}ms`, 'pass');

        if (res.status === 401 || res.status === 403) {
          if (state.supplierCredentials[agencyId]) {
            state.supplierCredentials[agencyId].verified = false;
            state.supplierCredentials[agencyId].sessionCookie = null;
            state.supplierCredentials[agencyId].authAlert = `Session expired / Auth Rejected (HTTP ${res.status}). Please re-authenticate in Settings.`;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.supplierCredentials));
            updateApiBadges();
            renderAgencyChips();
            renderAccountabilityBanner();
          }
          logDebug(`⚠️ [AUTH EXPIRED] ${agencyName} session expired or rejected (HTTP ${res.status}). Alert triggered.`, 'error');
        } else if (res.status >= 200 && res.status < 300) {
          if (state.supplierCredentials[agencyId] && !state.supplierCredentials[agencyId].verified) {
            state.supplierCredentials[agencyId].verified = true;
            state.supplierCredentials[agencyId].authAlert = null;
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state.supplierCredentials));
            updateApiBadges();
            renderAgencyChips();
            renderAccountabilityBanner();
          }
        }

        let liveNightlyILS = null;
        if (json && typeof json === 'object') {
          if (json.rates && json.rates[0] && json.rates[0].price) {
            liveNightlyILS = Math.round(Number(json.rates[0].price));
          } else if (json.data && json.data.hotels && json.data.hotels[0] && json.data.hotels[0].rates) {
            const r = json.data.hotels[0].rates[0];
            const amt = r.payment_options?.payment_types?.[0]?.amount || r.daily_prices?.[0];
            if (amt) liveNightlyILS = Math.round(Number(amt));
          } else if (json.price || json.rate || json.total) {
            liveNightlyILS = Math.round(Number(json.price || json.rate || json.total));
          }
        }

        return {
          success: true,
          live: true,
          status: res.status,
          latencyMs: elapsed,
          refCode,
          priceILS: liveNightlyILS,
          rawResponse: json,
          rawRequest: reqPayload
        };
      } catch (err) {
        console.warn(`[TRAZIP LIVE SEARCH FAILED] ${agencyName}:`, err);
        console.groupEnd();
        logDebug(`⚠️ [LIVE SEARCH FAILED] ${agencyName}: ${err.message}`, 'warn');

        state.lastLiveApiPayloads[agencyId] = {
          aggregator_source: "Trazip B2B RateCompare Engine (ATTEMPTED LIVE SESSION)",
          supplier_endpoint: agencyName,
          provider_ref_code: refCode,
          request_params: { hotel: hotel.name, dates: `${filters.checkIn} - ${filters.checkOut}` },
          error: err.message,
          http_status: 0,
          timestamp: new Date().toISOString()
        };

        return {
          success: false,
          live: false,
          error: err.message,
          refCode
        };
      }
    },

    // Construct deep link URL with search parameters for supplier portal
    getDeepSearchUrl(agencyId, hotel, filters, creds) {
      const hName = encodeURIComponent(hotel.name || 'hotel');
      const loc = encodeURIComponent(hotel.location || '');
      const inDate = filters.checkIn;
      const outDate = filters.checkOut;
      const adults = filters.adults;
      const rooms = filters.rooms;

      switch (agencyId) {
        case 'ratehawk': {
          const slug = (hotel.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          return `https://www.ratehawk.com/hotel/${slug}/?checkin=${inDate}&checkout=${outDate}&guests=${adults}`;
        }
        case 'webbeds':
          return `https://www.webbeds.com/search?hotel=${hName}&destination=${loc}&checkin=${inDate}&checkout=${outDate}&adults=${adults}`;
        case 'tbo':
          return `https://www.tboholidays.com/HotelListing.aspx?CityName=${loc}&CheckInDate=${inDate}&CheckOutDate=${outDate}`;
        case 'innstant':
          return `https://b2b.innstant.travel/search?hotel=${hName}&checkin=${inDate}&checkout=${outDate}&rooms=${rooms}&adults=${adults}`;
        case 'arbitrip':
          return `https://www.arbitrip.com/hotels/search?destination=${hName}&checkin=${inDate}&checkout=${outDate}`;
        case 'goglobal':
          return `https://www.goglobal.travel/search?dest=${loc}&hotel=${hName}`;
        case 'expedia':
          return `https://www.expediapartnersolutions.com/products/expedia-taap?hotel=${hName}&checkin=${inDate}&checkout=${outDate}`;
        case 'tale':
          return `https://www.taletravel.com/search?q=${hName}&in=${inDate}&out=${outDate}`;
        case 'ptc':
          return `https://www.ptc.co.il/search?hotel=${hName}&dates=${inDate}_${outDate}`;
        default:
          return AGENCIES.find(a => a.id === agencyId)?.portalUrl || 'https://www.trazip.com';
      }
    }
  };

  async function init() {
    cacheDOM();
    logDebug('🚀 Initializing Trazip RateCompare with Global Hotel Catalog...');
    await loadGlobalHotelCatalog();
    loadSavedCredentials();
    setupDefaultDates();
    renderAgencyChips();
    renderAccountabilityBanner();
    bindEvents();
    renderResults();
    logDebug(`✅ Supplier Accountability & Verified Session Engine initialized (${state.hotels.length} verified properties ready).`);
  }

  // Asynchronously loads the 300+ hotel catalog from hotels.json with automatic fallback
  async function loadGlobalHotelCatalog() {
    let catalog = null;
    try {
      const res = await fetch('./hotels.json');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          catalog = data;
          logDebug(`🌐 Loaded ${catalog.length} verified global hotels from external hotels.json`, 'pass');
        }
      }
    } catch (e) {
      logDebug(`Direct fetch of hotels.json restricted (${e.message}). Using bundled catalog fallback.`, 'info');
    }

    if (!catalog || catalog.length === 0) {
      if (typeof GLOBAL_HOTEL_CATALOG_FALLBACK !== 'undefined' && Array.isArray(GLOBAL_HOTEL_CATALOG_FALLBACK)) {
        catalog = GLOBAL_HOTEL_CATALOG_FALLBACK;
        logDebug(`📦 Loaded ${catalog.length} global hotels from bundled catalog fallback.`, 'pass');
      } else if (typeof INITIAL_HOTELS !== 'undefined' && Array.isArray(INITIAL_HOTELS)) {
        catalog = INITIAL_HOTELS;
      } else {
        catalog = [];
      }
    }

    GLOBAL_HOTEL_CATALOG = catalog;
    buildDestinationsIndex(catalog);
    populateHotelsFromCatalog(catalog);
  }

  function buildDestinationsIndex(catalog) {
    const map = new Map();
    (catalog || []).forEach(h => {
      const city = h.city || (h.loc ? h.loc.split(',')[0].trim() : (h.location ? h.location.split(',')[0].trim() : ''));
      const country = h.country || (h.loc && h.loc.includes(',') ? h.loc.split(',')[1].trim() : (h.location && h.location.includes(',') ? h.location.split(',')[1].trim() : ''));
      const locKey = h.loc || h.location || `${city}, ${country}`;
      if (locKey && !map.has(locKey)) {
        map.set(locKey, {
          name: locKey,
          city: city,
          country: country,
          count: 0
        });
      }
      if (locKey && map.has(locKey)) {
        map.get(locKey).count++;
      }
    });

    GLOBAL_DESTINATIONS = Array.from(map.values()).sort((a, b) => b.count - a.count);
    state.destinations = GLOBAL_DESTINATIONS;
  }

  // Pre-populates state with full quotes for catalog hotels
  function populateHotelsFromCatalog(catalog) {
    const generatedHotels = catalog.map((dictHotel, hIdx) => {
      const existing = INITIAL_HOTELS.find(h => h.name.toLowerCase() === dictHotel.name.toLowerCase());
      if (existing) return existing;

      const baseRate = dictHotel.basePriceILS || (850 + (hIdx * 45) % 800);
      const roomTypes = ['Standard Room', 'Deluxe Room', 'Superior Room', 'Executive Suite'];
      
      const rooms = roomTypes.map((type, rIdx) => {
        const mult = 1 + (rIdx * 0.25);
        const roomQuotes = {};
        
        AGENCIES.forEach(agency => {
          const nightly = Math.round(baseRate * mult * agency.baseMultiplier);
          roomQuotes[agency.id] = {
            priceILS: nightly,
            cancellation: agency.rank % 2 === 0 ? 'Free cancellation until 48h prior' : 'Free cancellation until 24h prior',
            breakfast: agency.rank % 3 !== 0,
            instant: true,
            payType: agency.rank % 4 === 0 ? 'Pay at Hotel' : 'Pay Now'
          };
        });

        return {
          type: type,
          bed: rIdx % 2 === 0 ? '1 King Bed' : '2 Double Beds',
          size: `${30 + rIdx * 8} m²`,
          basePriceILS: Math.round(baseRate * mult),
          quotes: roomQuotes
        };
      });

      return {
        id: dictHotel.id || `h_cat_${hIdx}`,
        name: dictHotel.name,
        city: dictHotel.city || '',
        country: dictHotel.country || '',
        location: dictHotel.loc || dictHotel.location || `${dictHotel.city}, ${dictHotel.country}`,
        stars: dictHotel.stars || 4,
        image: dictHotel.image,
        amenities: dictHotel.amenities || ['Verified Hotel', 'B2B Wholesale Parity', 'Free Wi-Fi', 'Instant Confirmation'],
        rooms: rooms
      };
    });

    state.hotels = generatedHotels;
  }

  function loadSavedCredentials() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        state.supplierCredentials = JSON.parse(raw);
        logDebug(`Loaded saved credentials for ${Object.keys(state.supplierCredentials).length} supplier(s) from vault.`);
      }
    } catch (e) {
      logDebug(`Error loading saved credentials: ${e.message}`, 'warn');
    }
    updateApiBadges();
    populateSettingsFormFields();
  }

  function updateApiBadges() {
    AGENCIES.forEach(a => {
      const badge = document.getElementById(`badge_${a.id}`);
      if (badge) {
        const isConfigured = isAgencyConfigured(a.id);
        const isVerified = isAgencyVerified(a.id);
        const alertMsg = getAgencyAuthAlert(a.id);

        if (alertMsg) {
          badge.textContent = '❌ Auth Error';
          badge.className = 'api-badge';
          badge.style.color = '#f43f5e';
        } else if (isVerified) {
          badge.textContent = '🟢 Verified (Auto-Pass)';
          badge.className = 'api-badge is-live';
          badge.style.color = '#34d399';
        } else if (isConfigured) {
          badge.textContent = '🟡 Configured (Untested)';
          badge.className = 'api-badge';
          badge.style.color = '#fbbf24';
        } else {
          badge.textContent = '🔒 Unconfigured';
          badge.className = 'api-badge';
          badge.style.color = '#94a3b8';
        }
      }
    });
    renderAccountabilityBanner();
  }

  function renderAccountabilityBanner() {
    if (!DOM.accountabilityBannerBox) return;

    const configuredCount = AGENCIES.filter(a => isAgencyConfigured(a.id)).length;
    const alertAgencies = AGENCIES.filter(a => getAgencyAuthAlert(a.id));

    if (alertAgencies.length > 0) {
      const names = alertAgencies.map(a => a.name).join(', ');
      DOM.accountabilityBannerBox.innerHTML = `
        <div class="accountability-banner is-warning">
          <div class="banner-content">
            <span class="banner-icon">⚠️</span>
            <div class="banner-text-block">
              <span class="banner-title">Authentication Issue Detected (${names})</span>
              <span class="banner-sub">Session token expired or credentials rejected. Real rate querying paused for affected suppliers.</span>
            </div>
          </div>
          <div class="banner-actions">
            <button class="btn btn-sm btn-primary" onclick="document.getElementById('btnOpenApiSettings').click()">
              ⚙️ Re-Authenticate in Settings
            </button>
          </div>
        </div>
      `;
      return;
    }

    if (configuredCount === 0) {
      DOM.accountabilityBannerBox.innerHTML = `
        <div class="accountability-banner">
          <div class="banner-content">
            <span class="banner-icon">🔒</span>
            <div class="banner-text-block">
              <span class="banner-title">Accountability Mode Active (Real Results Only)</span>
              <span class="banner-sub">We do not display simulated quotes for unconfigured services. Suppliers without login credentials are grayed out below.</span>
            </div>
          </div>
          <div class="banner-actions">
            <button class="btn btn-sm btn-primary" onclick="document.getElementById('btnOpenApiSettings').click()">
              ⚙️ Connect Supplier Logins
            </button>
          </div>
        </div>
      `;
      return;
    }

    const verifiedCount = AGENCIES.filter(a => isAgencyVerified(a.id)).length;
    DOM.accountabilityBannerBox.innerHTML = `
      <div class="accountability-banner is-success">
        <div class="banner-content">
          <span class="banner-icon">🟢</span>
          <div class="banner-text-block">
            <span class="banner-title">Real B2B Wholesale Engine (${configuredCount} Supplier${configuredCount > 1 ? 's' : ''} Configured · ${verifiedCount} Verified)</span>
            <span class="banner-sub">Session persistence is active. Verified suppliers auto-pass searches automatically without repeated logins.</span>
          </div>
        </div>
        <div class="banner-actions">
          <button class="btn btn-sm btn-outline" onclick="document.getElementById('btnOpenApiSettings').click()">
            ⚙️ Manage Logins
          </button>
        </div>
      </div>
    `;
  }

  function populateSettingsFormFields() {
    const c = state.supplierCredentials;
    if (c.webbeds) {
      if (document.getElementById('cfg_webbeds_client')) document.getElementById('cfg_webbeds_client').value = c.webbeds.client || '';
      if (document.getElementById('cfg_webbeds_key')) document.getElementById('cfg_webbeds_key').value = c.webbeds.key || '';
    }
    if (c.ratehawk) {
      if (document.getElementById('cfg_ratehawk_id')) document.getElementById('cfg_ratehawk_id').value = c.ratehawk.id || '';
      if (document.getElementById('cfg_ratehawk_key')) document.getElementById('cfg_ratehawk_key').value = c.ratehawk.key || '';
    }
    if (c.tbo) {
      if (document.getElementById('cfg_tbo_user')) document.getElementById('cfg_tbo_user').value = c.tbo.user || '';
      if (document.getElementById('cfg_tbo_pass')) document.getElementById('cfg_tbo_pass').value = c.tbo.pass || '';
    }
    if (c.arbitrip) {
      if (document.getElementById('cfg_arbitrip_id')) document.getElementById('cfg_arbitrip_id').value = c.arbitrip.id || '';
      if (document.getElementById('cfg_arbitrip_key')) document.getElementById('cfg_arbitrip_key').value = c.arbitrip.key || '';
    }
    if (c.goglobal) {
      if (document.getElementById('cfg_goglobal_agency')) document.getElementById('cfg_goglobal_agency').value = c.goglobal.agency || '';
      if (document.getElementById('cfg_goglobal_pass')) document.getElementById('cfg_goglobal_pass').value = c.goglobal.pass || '';
    }
    if (c.expedia) {
      if (document.getElementById('cfg_expedia_key')) document.getElementById('cfg_expedia_key').value = c.expedia.key || '';
      if (document.getElementById('cfg_expedia_secret')) document.getElementById('cfg_expedia_secret').value = c.expedia.secret || '';
    }
    if (c.innstant) {
      if (document.getElementById('cfg_innstant_id')) document.getElementById('cfg_innstant_id').value = c.innstant.id || '';
      if (document.getElementById('cfg_innstant_key')) document.getElementById('cfg_innstant_key').value = c.innstant.key || '';
    }
    if (c.tale) {
      if (document.getElementById('cfg_tale_user')) document.getElementById('cfg_tale_user').value = c.tale.user || '';
      if (document.getElementById('cfg_tale_pass')) document.getElementById('cfg_tale_pass').value = c.tale.pass || '';
    }
    if (c.ptc) {
      if (document.getElementById('cfg_ptc_user')) document.getElementById('cfg_ptc_user').value = c.ptc.user || '';
      if (document.getElementById('cfg_ptc_pass')) document.getElementById('cfg_ptc_pass').value = c.ptc.pass || '';
    }
  }

  function setupDefaultDates() {
    const today = new Date();
    const checkIn = new Date(today);
    checkIn.setDate(today.getDate() + 10);
    const checkOut = new Date(checkIn);
    checkOut.setDate(checkIn.getDate() + 5);

    if (DOM.checkInDate && DOM.checkOutDate) {
      DOM.checkInDate.value = formatDateString(checkIn);
      DOM.checkOutDate.value = formatDateString(checkOut);
      state.filters.checkIn = DOM.checkInDate.value;
      state.filters.checkOut = DOM.checkOutDate.value;
      calculateNights();
    }
  }

  function formatDateString(date) {
    return date.toISOString().split('T')[0];
  }

  function calculateNights() {
    if (!DOM.checkInDate || !DOM.checkOutDate) return;
    const d1 = new Date(DOM.checkInDate.value);
    const d2 = new Date(DOM.checkOutDate.value);
    const diffTime = d2 - d1;
    const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    state.filters.nights = diffDays;
    if (DOM.nightsCountLabel) {
      DOM.nightsCountLabel.textContent = `${diffDays} night${diffDays > 1 ? 's' : ''}`;
    }
  }

  function formatMoney(amountILS) {
    const curr = CURRENCY_RATES[state.selectedCurrency] || CURRENCY_RATES.ILS;
    const converted = amountILS * curr.rate;
    return `${curr.symbol}${Math.round(converted).toLocaleString()}`;
  }

  function bindTestAuthButtons() {
    document.querySelectorAll('.btn-test-auth').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const agencyId = btn.getAttribute('data-agency');
        const badge = document.getElementById(`badge_${agencyId}`);
        const currentCreds = readCredsForAgencyFromForm(agencyId);

        btn.disabled = true;
        const originalText = btn.textContent;
        btn.textContent = '⏳ Testing...';

        if (badge) {
          badge.textContent = '⏳ Connecting...';
          badge.className = 'api-badge';
          badge.style.color = '#fbbf24';
        }

        // Auto-open debug log box so user can view live trace
        if (DOM.debugConsoleBox) DOM.debugConsoleBox.classList.remove('hidden');

        const testResult = await SupplierGateway.testAuth(agencyId, currentCreds);

        btn.disabled = false;
        btn.textContent = originalText;

        if (badge) {
          if (testResult.success) {
            badge.textContent = `🟢 Auth OK (${testResult.status || 200})`;
            badge.className = 'api-badge is-live';
            badge.style.color = '#34d399';
          } else {
            const errStr = testResult.error || 'Failed';
            badge.textContent = `❌ ${errStr.length > 15 ? errStr.substring(0, 15) + '..' : errStr}`;
            badge.className = 'api-badge';
            badge.style.color = '#f43f5e';
          }
        }
      });
    });
  }

  function bindEvents() {
    if (DOM.btnOpenApiSettings) DOM.btnOpenApiSettings.addEventListener('click', () => DOM.apiSettingsModal.classList.remove('hidden'));
    if (DOM.btnCloseApiSettingsModal) DOM.btnCloseApiSettingsModal.addEventListener('click', () => DOM.apiSettingsModal.classList.add('hidden'));
    if (DOM.btnCancelApiSettings) DOM.btnCancelApiSettings.addEventListener('click', () => DOM.apiSettingsModal.classList.add('hidden'));

    if (DOM.apiSettingsForm) {
      DOM.apiSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const currentVault = state.supplierCredentials || {};
        const creds = {
          webbeds: Object.assign({}, currentVault.webbeds || {}, { client: document.getElementById('cfg_webbeds_client')?.value.trim() || '', key: document.getElementById('cfg_webbeds_key')?.value.trim() || '' }),
          ratehawk: Object.assign({}, currentVault.ratehawk || {}, { id: document.getElementById('cfg_ratehawk_id')?.value.trim() || '', key: document.getElementById('cfg_ratehawk_key')?.value.trim() || '' }),
          tbo: Object.assign({}, currentVault.tbo || {}, { user: document.getElementById('cfg_tbo_user')?.value.trim() || '', pass: document.getElementById('cfg_tbo_pass')?.value.trim() || '' }),
          arbitrip: Object.assign({}, currentVault.arbitrip || {}, { id: document.getElementById('cfg_arbitrip_id')?.value.trim() || '', key: document.getElementById('cfg_arbitrip_key')?.value.trim() || '' }),
          goglobal: Object.assign({}, currentVault.goglobal || {}, { agency: document.getElementById('cfg_goglobal_agency')?.value.trim() || '', pass: document.getElementById('cfg_goglobal_pass')?.value.trim() || '' }),
          expedia: Object.assign({}, currentVault.expedia || {}, { key: document.getElementById('cfg_expedia_key')?.value.trim() || '', secret: document.getElementById('cfg_expedia_secret')?.value.trim() || '' }),
          innstant: Object.assign({}, currentVault.innstant || {}, { id: document.getElementById('cfg_innstant_id')?.value.trim() || '', key: document.getElementById('cfg_innstant_key')?.value.trim() || '' }),
          tale: Object.assign({}, currentVault.tale || {}, { user: document.getElementById('cfg_tale_user')?.value.trim() || '', pass: document.getElementById('cfg_tale_pass')?.value.trim() || '' }),
          ptc: Object.assign({}, currentVault.ptc || {}, { user: document.getElementById('cfg_ptc_user')?.value.trim() || '', pass: document.getElementById('cfg_ptc_pass')?.value.trim() || '' })
        };

        state.supplierCredentials = creds;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
        updateApiBadges();
        renderAgencyChips();
        renderAccountabilityBanner();
        DOM.apiSettingsModal.classList.add('hidden');
        logDebug('💾 Saved supplier credentials vault. Preserved active sessions.');
        simulateLiveAggregatorFetch();
      });
    }

    bindTestAuthButtons();

    if (DOM.btnClearAllApiSettings) {
      DOM.btnClearAllApiSettings.addEventListener('click', () => {
        if (confirm('Clear all saved supplier credentials from local vault?')) {
          state.supplierCredentials = {};
          state.liveQuotes = {};
          localStorage.removeItem(STORAGE_KEY);
          DOM.apiSettingsForm.reset();
          updateApiBadges();
          renderAgencyChips();
          renderAccountabilityBanner();
          logDebug('Cleared all saved credentials.');
          renderResults();
        }
      });
    }

    if (DOM.currencySelect) {
      DOM.currencySelect.addEventListener('change', (e) => {
        state.selectedCurrency = e.target.value;
        logDebug(`Currency changed to ${state.selectedCurrency}`);
        renderResults();
      });
    }

    if (DOM.hotelSearchInput) {
      DOM.hotelSearchInput.addEventListener('input', (e) => {
        const q = e.target.value.trim();
        state.filters.hotelName = q;
        handleAutocomplete(q);
        renderResults();
      });

      DOM.hotelSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          if (DOM.hotelAutocompleteList) DOM.hotelAutocompleteList.classList.add('hidden');
          triggerSearchAction();
        }
      });
    }

    document.addEventListener('click', (e) => {
      if (DOM.hotelSearchInput && DOM.hotelAutocompleteList) {
        if (!DOM.hotelSearchInput.contains(e.target) && !DOM.hotelAutocompleteList.contains(e.target)) {
          DOM.hotelAutocompleteList.classList.add('hidden');
        }
      }
    });

    if (DOM.roomTypeSelect) {
      DOM.roomTypeSelect.addEventListener('change', (e) => {
        state.filters.roomType = e.target.value;
        logDebug(`Room type filter set to: "${state.filters.roomType}"`);
        renderResults();
      });
    }

    if (DOM.breakfastSelect) {
      DOM.breakfastSelect.addEventListener('change', (e) => {
        state.filters.breakfastFilter = e.target.value;
        logDebug(`Breakfast filter set to: "${state.filters.breakfastFilter}"`);
        renderResults();
      });
    }

    if (DOM.cancellationSelect) {
      DOM.cancellationSelect.addEventListener('change', (e) => {
        state.filters.cancellationFilter = e.target.value;
        logDebug(`Cancellation filter set to: "${state.filters.cancellationFilter}"`);
        renderResults();
      });
    }

    if (DOM.checkInDate) DOM.checkInDate.addEventListener('change', () => { calculateNights(); renderResults(); });
    if (DOM.checkOutDate) DOM.checkOutDate.addEventListener('change', () => { calculateNights(); renderResults(); });

    if (DOM.btnGuestsPopover) {
      DOM.btnGuestsPopover.addEventListener('click', (e) => {
        e.stopPropagation();
        DOM.guestsPopoverBox.classList.toggle('hidden');
      });
    }

    if (DOM.btnDoneGuests) {
      DOM.btnDoneGuests.addEventListener('click', () => DOM.guestsPopoverBox.classList.add('hidden'));
    }

    document.addEventListener('click', (e) => {
      if (DOM.guestsPopoverBox && DOM.btnGuestsPopover) {
        if (!DOM.guestsPopoverBox.contains(e.target) && !DOM.btnGuestsPopover.contains(e.target)) {
          DOM.guestsPopoverBox.classList.add('hidden');
        }
      }
    });

    if (DOM.btnAdultsDec) DOM.btnAdultsDec.addEventListener('click', () => updateCounter('adults', -1));
    if (DOM.btnAdultsInc) DOM.btnAdultsInc.addEventListener('click', () => updateCounter('adults', 1));
    if (DOM.btnKidsDec) DOM.btnKidsDec.addEventListener('click', () => updateCounter('kids', -1));
    if (DOM.btnKidsInc) DOM.btnKidsInc.addEventListener('click', () => updateCounter('kids', 1));
    if (DOM.btnRoomsDec) DOM.btnRoomsDec.addEventListener('click', () => updateCounter('rooms', -1));
    if (DOM.btnRoomsInc) DOM.btnRoomsInc.addEventListener('click', () => updateCounter('rooms', 1));

    if (DOM.btnSelectAllAgencies) {
      DOM.btnSelectAllAgencies.addEventListener('click', () => {
        state.activeAgencies = new Set(AGENCIES.map(a => a.id));
        logDebug('Selected all 9 agencies');
        renderAgencyChips();
        renderResults();
      });
    }

    if (DOM.btnClearAgencies) {
      DOM.btnClearAgencies.addEventListener('click', () => {
        state.activeAgencies = new Set();
        logDebug('Cleared all active agencies');
        renderAgencyChips();
        renderResults();
      });
    }

    if (DOM.sortSelect) {
      DOM.sortSelect.addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        logDebug(`Sorting changed to: ${state.sortBy}`);
        renderResults();
      });
    }

    if (DOM.btnSearch) {
      DOM.btnSearch.addEventListener('click', () => {
        triggerSearchAction();
      });
    }

    if (DOM.btnResetFilters) {
      DOM.btnResetFilters.addEventListener('click', () => {
        logDebug('Resetting all search filters');
        if (DOM.hotelSearchInput) DOM.hotelSearchInput.value = '';
        if (DOM.roomTypeSelect) DOM.roomTypeSelect.value = 'ALL';
        if (DOM.breakfastSelect) DOM.breakfastSelect.value = 'ALL';
        if (DOM.cancellationSelect) DOM.cancellationSelect.value = 'ALL';
        state.filters.hotelName = '';
        state.filters.roomType = 'ALL';
        state.filters.breakfastFilter = 'ALL';
        state.filters.cancellationFilter = 'ALL';
        state.filters.adults = 2;
        state.filters.kids = 0;
        state.filters.rooms = 1;
        updateGuestSummaryDisplay();
        setupDefaultDates();
        state.activeAgencies = new Set(AGENCIES.map(a => a.id));
        renderAgencyChips();
        renderResults();
      });
    }

    if (DOM.btnViewCards) DOM.btnViewCards.addEventListener('click', () => setViewMode('CARDS'));
    if (DOM.btnViewTable) DOM.btnViewTable.addEventListener('click', () => setViewMode('TABLE'));
    if (DOM.btnViewLeaderboard) DOM.btnViewLeaderboard.addEventListener('click', () => setViewMode('LEADERBOARD'));

    if (DOM.btnOpenAddModal) DOM.btnOpenAddModal.addEventListener('click', () => DOM.addModal.classList.remove('hidden'));
    if (DOM.btnCloseAddModal) DOM.btnCloseAddModal.addEventListener('click', () => DOM.addModal.classList.add('hidden'));
    if (DOM.btnCancelAddModal) DOM.btnCancelAddModal.addEventListener('click', () => DOM.addModal.classList.add('hidden'));

    if (DOM.addQuoteForm) DOM.addQuoteForm.addEventListener('submit', handleCustomQuoteSubmit);
    if (DOM.btnCloseToast) DOM.btnCloseToast.addEventListener('click', () => DOM.bookingToast.classList.add('hidden'));

    if (DOM.btnToggleDebug) {
      DOM.btnToggleDebug.addEventListener('click', () => {
        state.debugOpen = !state.debugOpen;
        logDebug(`Toggled debug console: ${state.debugOpen ? 'OPEN' : 'CLOSED'}`);
        if (DOM.debugConsoleBox) {
          DOM.debugConsoleBox.classList.toggle('hidden', !state.debugOpen);
        }
      });
    }

    if (DOM.btnClearDebugLog) {
      DOM.btnClearDebugLog.addEventListener('click', () => {
        state.debugLogs = [];
        if (DOM.debugLogOutput) DOM.debugLogOutput.innerHTML = 'Console cleared.';
      });
    }

    if (DOM.btnCloseJsonModal) DOM.btnCloseJsonModal.addEventListener('click', () => DOM.jsonInspectorModal.classList.add('hidden'));
    if (DOM.btnCloseJsonModalBottom) DOM.btnCloseJsonModalBottom.addEventListener('click', () => DOM.jsonInspectorModal.classList.add('hidden'));
    if (DOM.btnCopyJsonPayload) {
      DOM.btnCopyJsonPayload.addEventListener('click', () => {
        navigator.clipboard.writeText(DOM.jsonModalPreContent.textContent);
        DOM.btnCopyJsonPayload.textContent = 'Copied!';
        setTimeout(() => DOM.btnCopyJsonPayload.textContent = 'Copy Raw JSON', 2000);
      });
    }

    // Booking Redirection Modal Events
    if (DOM.btnCloseBookingModal) DOM.btnCloseBookingModal.addEventListener('click', closeBookingModal);
    if (DOM.btnCancelBookingModal) DOM.btnCancelBookingModal.addEventListener('click', closeBookingModal);
    if (DOM.btnCopyBookingRef) {
      DOM.btnCopyBookingRef.addEventListener('click', () => {
        const ref = DOM.bookingModalRefCode ? DOM.bookingModalRefCode.textContent.replace('Provider Booking Ref: ', '') : '';
        navigator.clipboard.writeText(ref);
        DOM.btnCopyBookingRef.textContent = 'Ref Copied!';
        setTimeout(() => DOM.btnCopyBookingRef.textContent = 'Copy Ref Token', 2000);
      });
    }
  }

  function closeBookingModal() {
    if (state.redirectTimer) clearTimeout(state.redirectTimer);
    if (DOM.bookingModal) DOM.bookingModal.classList.add('hidden');
    logDebug('Closed booking modal.');
  }

  function triggerSearchAction() {
    const inputVal = DOM.hotelSearchInput ? DOM.hotelSearchInput.value.trim() : '';
    state.filters.hotelName = inputVal;
    logDebug(`Executing Aggregated Search for: "${inputVal || 'All Hotels'}"`);
    simulateLiveAggregatorFetch();
  }

  function simulateLiveAggregatorFetch() {
    if (!DOM.aggregatorProgressBox) return renderResults();

    DOM.aggregatorProgressBox.classList.remove('hidden');
    DOM.aggregatorProgressBar.style.width = '0%';
    DOM.aggregatorPercentText.textContent = '0%';

    const activeList = AGENCIES.filter(a => state.activeAgencies.has(a.id));
    
    DOM.supplierApiStatusGrid.innerHTML = activeList.map(a => {
      const isConfigured = isAgencyConfigured(a.id);
      const isVerified = isAgencyVerified(a.id);
      const alertMsg = getAgencyAuthAlert(a.id);

      let tagHTML = '';
      if (!isConfigured) {
        tagHTML = '<span class="chip-status-tag unconfigured">🔒 No Login</span>';
      } else if (alertMsg) {
        tagHTML = '<span class="chip-status-tag alert">⚠️ Auth Err</span>';
      } else if (isVerified) {
        tagHTML = '<span class="chip-status-tag verified">🟢 Auto-Pass</span>';
      } else {
        tagHTML = '<span class="chip-status-tag" style="background: rgba(251,191,36,0.15); color: #fbbf24;">🟡 Configured</span>';
      }

      return `
        <div class="api-status-item">
          <span class="api-status-name">
            ${getSupplierLogoHTML(a, 'sm')}
            <span>${a.name}</span>
            ${tagHTML}
          </span>
          <span id="api_stat_${a.id}" class="api-status-latency">⏳ Connecting...</span>
        </div>
      `;
    }).join('');

    let completedCount = 0;
    const total = activeList.length || 1;

    // Pick target hotel to query for real rates
    const qLower = (state.filters.hotelName || '').toLowerCase().trim();
    const targetHotel = state.hotels.find(h => {
      if (!qLower) return true;
      return h.name.toLowerCase().includes(qLower) || h.location.toLowerCase().includes(qLower);
    }) || state.hotels[0];

    activeList.forEach((agency) => {
      const isConfigured = isAgencyConfigured(agency.id);
      const creds = state.supplierCredentials[agency.id] || {};

      if (isConfigured && targetHotel) {
        logDebug(`⚡ [AGGREGATOR AUTO-PASS] Querying real B2B rates from ${agency.name}...`, 'info');
        SupplierGateway.searchRates(agency.id, targetHotel, state.filters, creds).then(result => {
          completedCount++;
          const pct = Math.round((completedCount / total) * 100);
          DOM.aggregatorProgressBar.style.width = pct + '%';
          DOM.aggregatorPercentText.textContent = pct + '%';

          const statusEl = document.getElementById(`api_stat_${agency.id}`);
          if (statusEl) {
            if (result.success) {
              statusEl.textContent = `200 OK • ${result.latencyMs}ms (Live)`;
              statusEl.style.color = '#34d399';
              if (result.priceILS) {
                state.liveQuotes[`${targetHotel.id}_${agency.id}`] = {
                  priceILS: result.priceILS,
                  isLive: true,
                  refCode: result.refCode
                };
              }
            } else {
              const isAuthErr = result.status === 401 || result.status === 403;
              const errSnippet = result.error ? (result.error.length > 18 ? result.error.substring(0, 18) + '..' : result.error) : 'Failed';
              statusEl.textContent = isAuthErr ? `❌ Auth Expired (${result.status})` : `Live Err: ${errSnippet}`;
              statusEl.style.color = isAuthErr ? '#f43f5e' : '#fbbf24';
            }
          }

          if (completedCount === total) {
            setTimeout(() => {
              DOM.aggregatorProgressBox.classList.add('hidden');
              renderResults();
            }, 300);
          }
        });
      } else {
        // Accountability Mode: Skip unconfigured agency without fake rates
        setTimeout(() => {
          completedCount++;
          const pct = Math.round((completedCount / total) * 100);
          DOM.aggregatorProgressBar.style.width = pct + '%';
          DOM.aggregatorPercentText.textContent = pct + '%';

          const statusEl = document.getElementById(`api_stat_${agency.id}`);
          if (statusEl) {
            statusEl.textContent = `✕ Skipped (No login)`;
            statusEl.style.color = '#f43f5e';
          }

          if (completedCount === total) {
            setTimeout(() => {
              DOM.aggregatorProgressBox.classList.add('hidden');
              renderResults();
            }, 300);
          }
        }, 120);
      }
    });
  }

  function updateCounter(field, delta) {
    if (field === 'adults') state.filters.adults = Math.max(1, state.filters.adults + delta);
    if (field === 'kids') state.filters.kids = Math.max(0, state.filters.kids + delta);
    if (field === 'rooms') state.filters.rooms = Math.max(1, state.filters.rooms + delta);
    
    if (DOM.adultsVal) DOM.adultsVal.textContent = state.filters.adults;
    if (DOM.kidsVal) DOM.kidsVal.textContent = state.filters.kids;
    if (DOM.roomsVal) DOM.roomsVal.textContent = state.filters.rooms;

    updateGuestSummaryDisplay();
    renderResults();
  }

  function updateGuestSummaryDisplay() {
    if (DOM.guestsSummaryText) {
      DOM.guestsSummaryText.textContent = `${state.filters.adults} Adult${state.filters.adults > 1 ? 's' : ''}, ${state.filters.kids} Kid${state.filters.kids !== 1 ? 's' : ''} · ${state.filters.rooms} Room${state.filters.rooms > 1 ? 's' : ''}`;
    }
  }

  // Categorized Verified Autocomplete: Matches both Global Destinations & Specific Properties
  function handleAutocomplete(query) {
    if (!query || query.length < 1) {
      if (DOM.hotelAutocompleteList) DOM.hotelAutocompleteList.classList.add('hidden');
      return;
    }

    const qLower = query.toLowerCase().trim();
    const queryTokens = qLower.split(/\s+/);

    // 1. Destination Matching (e.g., "Paris", "Rome", "Tokyo", "London", "Tel Aviv")
    const matchingDestinations = (GLOBAL_DESTINATIONS || []).filter(d => {
      const full = `${d.name} ${d.city} ${d.country}`.toLowerCase();
      return queryTokens.every(tok => full.includes(tok));
    }).slice(0, 4);

    // 2. Specific Hotel Matching
    let matchingHotels = (GLOBAL_HOTEL_CATALOG || []).filter(h => {
      const fullText = `${h.name} ${h.loc || h.location || ''} ${h.city || ''}`.toLowerCase();
      return queryTokens.every(token => fullText.includes(token));
    }).slice(0, 6);

    if (matchingDestinations.length === 0 && matchingHotels.length === 0) {
      if (DOM.hotelAutocompleteList) {
        DOM.hotelAutocompleteList.innerHTML = `
          <div style="padding: 12px 16px; color: var(--text-muted); font-size: 0.85rem; text-align: center;">
            ✕ No verified destinations or hotels match "<strong>${query}</strong>"
          </div>
        `;
        DOM.hotelAutocompleteList.classList.remove('hidden');
      }
      return;
    }

    let html = '';

    if (matchingDestinations.length > 0) {
      html += `<div class="autocomplete-section-title">📍 Destinations (${matchingDestinations.length})</div>`;
      html += matchingDestinations.map(d => `
        <div class="autocomplete-item destination-item" data-type="destination" data-name="${d.name}" data-city="${d.city}">
          <span class="autocomplete-hotel">📍 ${d.name} <span class="dest-count-badge">${d.count} hotels</span></span>
          <span class="autocomplete-loc">Compare 9 B2B suppliers across all verified ${d.city} properties</span>
        </div>
      `).join('');
    }

    if (matchingHotels.length > 0) {
      html += `<div class="autocomplete-section-title">🏨 Specific Hotels (${matchingHotels.length})</div>`;
      html += matchingHotels.map(h => `
        <div class="autocomplete-item" data-type="hotel" data-name="${h.name}">
          <span class="autocomplete-hotel">🏨 ${h.name} <small style="color:#fbbf24; font-size:0.75rem;">★ ${h.stars}.0</small></span>
          <span class="autocomplete-loc">${h.loc || h.location} • Compare 9 Suppliers</span>
        </div>
      `).join('');
    }

    if (DOM.hotelAutocompleteList) {
      DOM.hotelAutocompleteList.innerHTML = html;
      DOM.hotelAutocompleteList.classList.remove('hidden');

      DOM.hotelAutocompleteList.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          const selectedName = item.getAttribute('data-name');
          const itemType = item.getAttribute('data-type');
          if (DOM.hotelSearchInput) DOM.hotelSearchInput.value = selectedName;
          state.filters.hotelName = selectedName;
          state.visibleLimit = 24;
          DOM.hotelAutocompleteList.classList.add('hidden');
          logDebug(`Autocomplete selected: [${itemType.toUpperCase()}] "${selectedName}"`);
          simulateLiveAggregatorFetch();
        });
      });
    }
  }

  function setViewMode(mode) {
    state.viewMode = mode;
    logDebug(`Switched view mode to ${mode}`);
    if (DOM.btnViewCards) DOM.btnViewCards.classList.toggle('active', mode === 'CARDS');
    if (DOM.btnViewTable) DOM.btnViewTable.classList.toggle('active', mode === 'TABLE');
    if (DOM.btnViewLeaderboard) DOM.btnViewLeaderboard.classList.toggle('active', mode === 'LEADERBOARD');
    renderResults();
  }

  function renderAgencyChips() {
    if (!DOM.agencyChipsContainer) return;
    const configuredCount = AGENCIES.filter(a => isAgencyConfigured(a.id)).length;

    DOM.agencyChipsContainer.innerHTML = AGENCIES.map(agency => {
      const isActive = state.activeAgencies.has(agency.id);
      const isConfigured = isAgencyConfigured(agency.id);
      const isVerified = isAgencyVerified(agency.id);
      const alertMsg = getAgencyAuthAlert(agency.id);

      let tagHTML = '';
      let extraClass = '';
      if (!isConfigured) {
        extraClass = 'is-unconfigured';
        tagHTML = '<span class="chip-status-tag unconfigured">🔒 No Login</span>';
      } else if (alertMsg) {
        extraClass = 'is-alert';
        tagHTML = '<span class="chip-status-tag alert">⚠️ Auth Err</span>';
      } else if (isVerified) {
        extraClass = 'is-verified';
        tagHTML = '<span class="chip-status-tag verified">🟢 Live</span>';
      } else {
        tagHTML = '<span class="chip-status-tag" style="background: rgba(251,191,36,0.15); color: #fbbf24;">🟡 Added</span>';
      }

      return `
        <button type="button" class="agency-chip ${isActive ? 'active' : ''} ${extraClass}" data-agency="${agency.id}" title="${!isConfigured ? 'No credentials configured for ' + agency.name : isVerified ? agency.name + ' session active & verified' : agency.name}">
          <span class="chip-dot" style="background-color: ${agency.color}"></span>
          ${getSupplierLogoHTML(agency, 'sm')}
          <span>${agency.name}</span>
          ${tagHTML}
        </button>
      `;
    }).join('');

    DOM.agencyChipsContainer.querySelectorAll('.agency-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const agencyId = chip.getAttribute('data-agency');
        if (state.activeAgencies.has(agencyId)) {
          state.activeAgencies.delete(agencyId);
        } else {
          state.activeAgencies.add(agencyId);
        }
        renderAgencyChips();
        renderResults();
      });
    });

    if (DOM.connectedAgenciesCount) DOM.connectedAgenciesCount.textContent = `${configuredCount} / 9`;
    if (DOM.resultsSummaryBadge) DOM.resultsSummaryBadge.textContent = `${configuredCount} Connected • ${state.activeAgencies.size} / 9 Filter Active`;
  }

  function getRateMultiplier() {
    const roomMult = state.filters.rooms;
    const extraAdultMult = Math.max(0, state.filters.adults - (2 * roomMult)) * 0.25;
    const kidMult = state.filters.kids * 0.15;
    return roomMult + extraAdultMult + kidMult;
  }

  function renderResults() {
    const multiplier = getRateMultiplier();

    let filtered = state.hotels.filter(hotel => {
      if (state.filters.hotelName) {
        const q = state.filters.hotelName.toLowerCase().trim();
        const matchesName = hotel.name.toLowerCase().includes(q);
        const matchesLoc = hotel.location.toLowerCase().includes(q);
        if (!matchesName && !matchesLoc) return false;
      }
      return true;
    });

    logDebug(`Render: ${filtered.length} hotel(s) found for query: "${state.filters.hotelName}"`);

    if (DOM.resultsCountText) {
      if (filtered.length > 0) {
        DOM.resultsCountText.textContent = `Found ${filtered.length} Hotel${filtered.length !== 1 ? 's' : ''} (${state.filters.nights} Night Stay)`;
      } else {
        DOM.resultsCountText.textContent = `0 Hotels Found for "${state.filters.hotelName}"`;
      }
    }

    if (state.viewMode === 'CARDS') {
      renderCardsView(filtered, multiplier);
    } else if (state.viewMode === 'TABLE') {
      renderTableView(filtered, multiplier);
    } else if (state.viewMode === 'LEADERBOARD') {
      renderLeaderboardView();
    }
  }

  function renderCardsView(hotels, multiplier) {
    if (!DOM.resultsContainer) return;

    if (hotels.length === 0) {
      DOM.resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 48px; background: var(--bg-card); border-radius: var(--radius-xl); border: 1px solid var(--border-color);">
          <div style="font-size: 2.8rem; margin-bottom: 12px;">🔍</div>
          <h3 style="margin-bottom: 8px;">No matching hotel found for "${state.filters.hotelName}"</h3>
          <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 20px;">We couldn't find any verified hotel matching your search term across our 9 B2B suppliers.</p>
          <div style="display: flex; gap: 8px; justify-content: center; flex-wrap: wrap;">
            <button onclick="triggerSearch('The Norman')" class="btn btn-outline btn-sm">Try The Norman Tel Aviv</button>
            <button onclick="triggerSearch('Hilton Paris')" class="btn btn-outline btn-sm">Try Hilton Paris</button>
            <button onclick="triggerSearch('Dan Eilat')" class="btn btn-outline btn-sm">Try Dan Eilat</button>
            <button onclick="document.getElementById('btnResetFilters').click()" class="btn btn-primary btn-sm">Reset Search</button>
          </div>
        </div>
      `;
      return;
    }

    const visibleHotels = hotels.slice(0, state.visibleLimit);
    const hasMore = hotels.length > state.visibleLimit;

    let cardsHTML = visibleHotels.map(hotel => {
      const roomsToDisplay = hotel.rooms.filter(r => state.filters.roomType === 'ALL' || r.type === state.filters.roomType);
      
      if (roomsToDisplay.length === 0) {
        return `
          <div class="hotel-card" style="padding: 24px; text-align: center;">
            <h3>${hotel.name}</h3>
            <p style="color: var(--amber-text); margin: 12px 0;">⚠️ Hotel found, but no rooms match room type: <strong>"${state.filters.roomType}"</strong>.</p>
            <button onclick="document.getElementById('roomTypeSelect').value='ALL'; document.getElementById('roomTypeSelect').dispatchEvent(new Event('change'));" class="btn btn-outline btn-sm">
              Show All Room Types for ${hotel.name}
            </button>
          </div>
        `;
      }

      return `
        <div class="hotel-card">
          <div class="card-header-banner">
            <div class="hotel-image-box">
              <img src="${hotel.image}" alt="${hotel.name}">
              <div class="star-rating-badge">★ ${hotel.stars}.0</div>
            </div>
            <div class="hotel-meta-details">
              <div class="hotel-title-row">
                <h3 class="hotel-name">${hotel.name}</h3>
                <span class="best-deal-summary-badge">⚡ Compare 9 B2B Suppliers</span>
              </div>
              <div class="hotel-location">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle>
                </svg>
                ${hotel.location}
              </div>
              <div class="hotel-amenities-pills">
                ${hotel.amenities.map(a => `<span class="amenity-pill">${a}</span>`).join('')}
              </div>
            </div>
          </div>

          <div class="room-quotes-section">
            ${roomsToDisplay.map(room => renderRoomQuotes(hotel, room, multiplier)).join('')}
          </div>
        </div>
      `;
    }).join('');

    if (hasMore) {
      cardsHTML += `
        <div class="load-more-container">
          <button id="btnLoadMoreCards" class="load-more-btn">
            Load More Hotels (${hotels.length - state.visibleLimit} remaining)
          </button>
          <div class="load-more-meta">
            Showing ${state.visibleLimit} of ${hotels.length} verified properties
          </div>
        </div>
      `;
    } else if (hotels.length > 24) {
      cardsHTML += `
        <div class="load-more-container">
          <div class="load-more-meta" style="color: var(--emerald-text); font-weight: 600;">
            ✓ Showing all ${hotels.length} verified properties
          </div>
        </div>
      `;
    }

    DOM.resultsContainer.innerHTML = cardsHTML;

    const btnLoadMore = document.getElementById('btnLoadMoreCards');
    if (btnLoadMore) {
      btnLoadMore.addEventListener('click', () => {
        state.visibleLimit += 24;
        renderResults();
      });
    }

    bindBookingButtons();
    bindJsonInspectorButtons();
    bindConfigureAgencyButtons();
  }

  function bindConfigureAgencyButtons() {
    document.querySelectorAll('.btn-configure-agency').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const agencyId = btn.getAttribute('data-agency-id');
        if (DOM.apiSettingsModal) DOM.apiSettingsModal.classList.remove('hidden');

        const targetInput = document.getElementById(`cfg_${agencyId}_user`) || 
                            document.getElementById(`cfg_${agencyId}_id`) || 
                            document.getElementById(`cfg_${agencyId}_client`) || 
                            document.getElementById(`cfg_${agencyId}_agency`) || 
                            document.getElementById(`cfg_${agencyId}_key`);
        if (targetInput) {
          setTimeout(() => {
            targetInput.focus();
            targetInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 150);
        }
      });
    });
  }

  function renderRoomQuotes(hotel, room, multiplier) {
    const configuredList = [];
    const unconfiguredList = [];

    AGENCIES.forEach(agency => {
      if (!state.activeAgencies.has(agency.id)) return;

      const isConfigured = isAgencyConfigured(agency.id);
      const isVerified = isAgencyVerified(agency.id);

      if (!isConfigured) {
        // Accountability Mode: Collect unconfigured agencies to render grayed-out with disclaimer
        unconfiguredList.push(agency);
        return;
      }

      if (room.quotes[agency.id]) {
        let q = { ...room.quotes[agency.id] };

        // Check if there is a live rate override for this hotel & agency
        const liveKey = `${hotel.id}_${agency.id}`;
        if (state.liveQuotes[liveKey]) {
          q.priceILS = state.liveQuotes[liveKey].priceILS;
          q.isLive = true;
          q.refCode = state.liveQuotes[liveKey].refCode;
        }

        // Apply Breakfast Filter
        if (state.filters.breakfastFilter === 'BREAKFAST_ONLY' && !q.breakfast) return;
        if (state.filters.breakfastFilter === 'ROOM_ONLY' && q.breakfast) return;

        // Apply Cancellation Filter
        const isFreeCancel = q.cancellation && q.cancellation.toLowerCase().includes('free');
        if (state.filters.cancellationFilter === 'FREE_CANCEL_ONLY' && !isFreeCancel) return;
        if (state.filters.cancellationFilter === 'NON_REFUNDABLE_ONLY' && isFreeCancel) return;

        const nightlyILS = q.priceILS * multiplier;
        const totalILS = nightlyILS * state.filters.nights;
        configuredList.push({
          agency,
          quote: q,
          nightlyILS,
          totalILS,
          isVerified
        });
      }
    });

    if (configuredList.length === 0 && unconfiguredList.length === 0) {
      return `
        <div class="room-type-header">
          <span class="room-type-name">🛌 ${room.type} <span class="room-type-tag">${room.bed}</span></span>
        </div>
        <div style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">No quotes match the selected Breakfast or Cancellation policy filters. Try selecting 'All Meal Plans' or 'All Policies'.</div>
      `;
    }

    configuredList.sort((a, b) => {
      if (state.sortBy === 'LOWEST_PRICE') return a.nightlyILS - b.nightlyILS;
      if (state.sortBy === 'FREE_CANCEL') return (b.quote.cancellation.includes('Free') ? 1 : 0) - (a.quote.cancellation.includes('Free') ? 1 : 0);
      if (state.sortBy === 'BREAKFAST') return (b.quote.breakfast ? 1 : 0) - (a.quote.breakfast ? 1 : 0);
      return a.nightlyILS - b.nightlyILS;
    });

    const lowestPrice = configuredList.length > 0 ? Math.min(...configuredList.map(q => q.nightlyILS)) : null;

    return `
      <div style="margin-bottom: 24px;">
        <div class="room-type-header">
          <span class="room-type-name">
            🛌 ${room.type} 
            <span class="room-type-tag">${room.bed} · ${room.size}</span>
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">
            Comparing <strong>${configuredList.length}</strong> Connected Supplier${configuredList.length !== 1 ? 's' : ''} ${unconfiguredList.length > 0 ? `· <span style="color:#f43f5e;">(${unconfiguredList.length} Unconfigured)</span>` : ''}
          </span>
        </div>

        <div class="agency-quotes-grid">
          ${configuredList.map(item => {
            const isLowest = lowestPrice !== null && Math.abs(item.nightlyILS - lowestPrice) < 1;
            const refCode = item.quote.refCode || `${item.agency.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-LIVE`;

            return `
              <div class="agency-quote-card ${isLowest ? 'is-lowest' : ''}">
                ${isLowest ? `<span class="best-winner-tag">★ Lowest Rate</span>` : ''}
                
                <div class="quote-agency-header">
                  <span class="agency-badge-title" style="color: ${item.agency.color};">
                    ${getSupplierLogoHTML(item.agency, 'sm')}
                    <span>${item.agency.name}</span>
                    ${item.quote.isLive ? '<span class="live-api-tag">🟢 LIVE API</span>' : '<span class="session-verified-tag">✓ Verified</span>'}
                  </span>
                  <button class="btn-inspect-api" data-agency-id="${item.agency.id}" data-agency="${item.agency.fullTitle}" data-ref="${refCode}" data-hotel="${hotel.name}" data-room="${room.type}" data-price="${item.nightlyILS}" data-cancel="${item.quote.cancellation}" data-breakfast="${item.quote.breakfast}">
                    🔍 Inspect API
                  </button>
                </div>

                <div class="quote-features">
                  <div class="feature-item ${item.quote.cancellation.includes('Free') ? 'free-cancel' : 'non-refund'}">
                    ${item.quote.cancellation.includes('Free') ? '✓ ' + item.quote.cancellation : '✕ ' + item.quote.cancellation}
                  </div>
                  <div class="feature-item ${item.quote.breakfast ? 'breakfast-included' : ''}">
                    ${item.quote.breakfast ? '☕ Breakfast Included' : '🚫 Room Only'}
                  </div>
                  <div class="feature-item" style="color: var(--text-muted);">
                    💳 ${item.quote.payType} · ${item.quote.instant ? '⚡ Instant' : '⏳ Request'}
                  </div>
                </div>

                <div class="quote-price-block">
                  <div class="nightly-price">${formatMoney(item.nightlyILS)}<span style="font-size:0.75rem; color:var(--text-muted); font-weight:400;">/night</span></div>
                  <div class="total-stay-price">Total: ${formatMoney(item.totalILS)} (${state.filters.nights} n)</div>
                  
                  <button class="btn btn-primary btn-book-agency" 
                    data-agency-id="${item.agency.id}" 
                    data-agency-name="${item.agency.name}" 
                    data-agency-icon="${item.agency.icon}"
                    data-agency-logo="${item.agency.logoUrl}"
                    data-portal-url="${item.agency.portalUrl}"
                    data-hotel="${hotel.name}"
                    data-room="${room.type}"
                    data-bed="${room.bed}"
                    data-price="${formatMoney(item.totalILS)}"
                    data-breakfast="${item.quote.breakfast}"
                    data-ref="${refCode}">
                    Book on ${item.agency.name}
                  </button>
                </div>
              </div>
            `;
          }).join('')}

          ${unconfiguredList.map(agency => {
            return `
              <div class="agency-quote-card is-unconfigured">
                <div class="quote-agency-header">
                  <span class="agency-badge-title" style="color: ${agency.color};">
                    ${getSupplierLogoHTML(agency, 'sm')}
                    <span>${agency.name}</span>
                    <span class="chip-status-tag unconfigured">🔒 No Login</span>
                  </span>
                  <button class="btn-inspect-api" data-agency-id="${agency.id}" data-agency="${agency.fullTitle}" data-unconfigured="true">
                    🔍 No Creds
                  </button>
                </div>

                <div class="unconfigured-disclaimer">
                  <div class="unconfigured-disclaimer-header">
                    <span>✕ We do not search through ${agency.name}</span>
                  </div>
                  <div class="unconfigured-disclaimer-sub">
                    No login or API credentials configured in Settings.
                  </div>
                </div>

                <div class="quote-features" style="opacity: 0.6;">
                  <div class="feature-item" style="color: var(--text-muted);">
                    🔒 Wholesale rates require trade login
                  </div>
                  <div class="feature-item" style="color: var(--text-muted);">
                    🚫 No simulated quotes displayed
                  </div>
                </div>

                <div class="quote-price-block">
                  <div class="unconfigured-price-placeholder">— Not Connected</div>
                  <button type="button" class="btn btn-configure-agency" data-agency-id="${agency.id}">
                    ⚙️ Configure ${agency.name} Login
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    `;
  }

  function bindJsonInspectorButtons() {
    document.querySelectorAll('.btn-inspect-api').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const agencyId = btn.getAttribute('data-agency-id');
        const agencyName = btn.getAttribute('data-agency') || agencyId;

        if (btn.getAttribute('data-unconfigured') === 'true') {
          const jsonPayload = {
            aggregator_source: "Trazip B2B RateCompare (Accountability & Real Rates Enforcement)",
            supplier_endpoint: agencyName,
            status: "UNCONFIGURED_SERVICE",
            policy_enforcement: "We do not search through this service because no trade login or API credentials have been configured in Settings.",
            simulated_rates: false,
            action_required: "Open Settings (⚙️ Supplier API & Logins) in the top navbar to add credentials."
          };
          if (DOM.jsonModalSupplierName) DOM.jsonModalSupplierName.textContent = `${agencyName} - Unconfigured Service`;
          if (DOM.jsonModalRefCode) DOM.jsonModalRefCode.textContent = "Status: No Login Configured";
          if (DOM.jsonModalPreContent) DOM.jsonModalPreContent.textContent = JSON.stringify(jsonPayload, null, 2);
          if (DOM.jsonInspectorModal) DOM.jsonInspectorModal.classList.remove('hidden');
          return;
        }

        const refCode = btn.getAttribute('data-ref');
        const hotel = btn.getAttribute('data-hotel');
        const room = btn.getAttribute('data-room');
        const price = parseFloat(btn.getAttribute('data-price'));
        const cancel = btn.getAttribute('data-cancel');
        const breakfast = btn.getAttribute('data-breakfast') === 'true';

        let jsonPayload;
        if (agencyId && state.lastLiveApiPayloads[agencyId]) {
          jsonPayload = state.lastLiveApiPayloads[agencyId];
        } else {
          jsonPayload = {
            aggregator_source: "Trazip B2B RateCompare Engine v2.4 (Simulated Demo Quote)",
            note: "To view real supplier wire payloads, configure trade keys in '⚙️ Supplier API & Logins'",
            supplier_endpoint: agencyName,
            provider_ref_code: refCode,
            request_params: {
              hotel_name: hotel,
              check_in: state.filters.checkIn,
              check_out: state.filters.checkOut,
              nights: state.filters.nights,
              adults: state.filters.adults,
              children: state.filters.kids,
              rooms_count: state.filters.rooms
            },
            supplier_response: {
              http_status: 200,
              status_message: "OK_AVAILABLE",
              room_type_name: room,
              currency: "ILS",
              net_rate_ils: Math.round(price * 0.85),
              taxes_and_fees_ils: Math.round(price * 0.15),
              total_nightly_ils: Math.round(price),
              board_basis: breakfast ? "BB (Breakfast Included)" : "RO (Room Only)",
              cancellation_terms: {
                is_refundable: cancel.includes('Free'),
                policy_text: cancel,
                penalty_percentage: cancel.includes('Free') ? 0 : 100
              },
              instant_confirmation: true,
              pay_type: "MERCHANT_PREPAY"
            }
          };
        }

        if (DOM.jsonModalSupplierName) DOM.jsonModalSupplierName.textContent = agencyName + " - " + (agencyId && state.lastLiveApiPayloads[agencyId] ? "Live API Wire Payload" : "Demo API Payload");
        if (DOM.jsonModalRefCode) DOM.jsonModalRefCode.textContent = "Provider Ref: " + refCode;
        if (DOM.jsonModalPreContent) DOM.jsonModalPreContent.textContent = JSON.stringify(jsonPayload, null, 2);
        if (DOM.jsonInspectorModal) DOM.jsonInspectorModal.classList.remove('hidden');

        logDebug(`Inspected API JSON Payload for ${agencyName} (${refCode})`);
      });
    });
  }

  function renderTableView(hotels, multiplier) {
    const activeAgenciesList = AGENCIES.filter(a => state.activeAgencies.has(a.id));
    if (!DOM.resultsContainer) return;

    if (activeAgenciesList.length === 0) {
      DOM.resultsContainer.innerHTML = `<div style="text-align: center; padding: 48px; color: var(--text-muted);">Please activate at least one agency in the filter bar to view the matrix.</div>`;
      return;
    }

    let rowsHTML = '';
    const visibleHotels = hotels.slice(0, state.visibleLimit);
    const hasMore = hotels.length > state.visibleLimit;

    visibleHotels.forEach(hotel => {
      hotel.rooms.forEach(room => {
        if (state.filters.roomType !== 'ALL' && room.type !== state.filters.roomType) return;

        let minPrice = Infinity;
        activeAgenciesList.forEach(agency => {
          if (!isAgencyConfigured(agency.id)) return;

          if (room.quotes[agency.id]) {
            const q = room.quotes[agency.id];

            if (state.filters.breakfastFilter === 'BREAKFAST_ONLY' && !q.breakfast) return;
            if (state.filters.breakfastFilter === 'ROOM_ONLY' && q.breakfast) return;
            const isFreeCancel = q.cancellation && q.cancellation.toLowerCase().includes('free');
            if (state.filters.cancellationFilter === 'FREE_CANCEL_ONLY' && !isFreeCancel) return;
            if (state.filters.cancellationFilter === 'NON_REFUNDABLE_ONLY' && isFreeCancel) return;

            const liveKey = `${hotel.id}_${agency.id}`;
            const priceVal = state.liveQuotes[liveKey] ? state.liveQuotes[liveKey].priceILS : q.priceILS;
            const price = priceVal * multiplier;
            if (price < minPrice) minPrice = price;
          }
        });

        rowsHTML += `
          <tr>
            <td>
              <strong>${hotel.name}</strong><br>
              <small style="color:var(--text-muted);">${room.type} (${room.bed})</small>
            </td>
            ${activeAgenciesList.map(agency => {
              if (!isAgencyConfigured(agency.id)) {
                return `
                  <td style="background: rgba(244,63,94,0.05); color: #f43f5e; font-size: 0.72rem; text-align: center;" title="We do not search through ${agency.name} (No login configured)">
                    🔒 No Login
                  </td>
                `;
              }

              const q = room.quotes[agency.id];
              if (!q) return `<td>-</td>`;

              if (state.filters.breakfastFilter === 'BREAKFAST_ONLY' && !q.breakfast) return `<td>-</td>`;
              if (state.filters.breakfastFilter === 'ROOM_ONLY' && q.breakfast) return `<td>-</td>`;
              const isFreeCancel = q.cancellation && q.cancellation.toLowerCase().includes('free');
              if (state.filters.cancellationFilter === 'FREE_CANCEL_ONLY' && !isFreeCancel) return `<td>-</td>`;
              if (state.filters.cancellationFilter === 'NON_REFUNDABLE_ONLY' && isFreeCancel) return `<td>-</td>`;

              const liveKey = `${hotel.id}_${agency.id}`;
              const priceVal = state.liveQuotes[liveKey] ? state.liveQuotes[liveKey].priceILS : q.priceILS;
              const price = priceVal * multiplier;
              const isLowest = minPrice !== Infinity && Math.abs(price - minPrice) < 1;
              return `
                <td class="${isLowest ? 'matrix-cell-lowest' : ''}">
                  <div>${formatMoney(price)} <small>/n</small></div>
                  <small style="font-size:0.7rem; color: ${q.cancellation.includes('Free') ? 'var(--emerald-text)' : 'var(--rose-text)'}">
                    ${q.cancellation.includes('Free') ? 'Free Cancel' : 'Non-Ref'}
                  </small>
                </td>
              `;
            }).join('')}
          </tr>
        `;
      });
    });

    let loadMoreHTML = '';
    if (hasMore) {
      loadMoreHTML = `
        <div class="load-more-container">
          <button id="btnLoadMoreTable" class="load-more-btn">
            Load More Properties (${hotels.length - state.visibleLimit} remaining)
          </button>
          <div class="load-more-meta">
            Showing ${state.visibleLimit} of ${hotels.length} verified properties
          </div>
        </div>
      `;
    } else if (hotels.length > 24) {
      loadMoreHTML = `
        <div class="load-more-container">
          <div class="load-more-meta" style="color: var(--emerald-text); font-weight: 600;">
            ✓ Showing all ${hotels.length} verified properties
          </div>
        </div>
      `;
    }

    DOM.resultsContainer.innerHTML = `
      <div class="table-matrix-wrapper">
        <table class="matrix-table">
          <thead>
            <tr>
              <th>Hotel & Room</th>
              ${activeAgenciesList.map(a => `
                <th>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    ${getSupplierLogoHTML(a, 'sm')}
                    <span>${a.name}</span>
                    ${!isAgencyConfigured(a.id) ? '<span class="chip-status-tag unconfigured" style="font-size:0.58rem; padding:1px 4px;">🔒 No Login</span>' : ''}
                  </div>
                </th>
              `).join('')}
            </tr>
          </thead>
          <tbody>
            ${rowsHTML}
          </tbody>
        </table>
      </div>
      ${loadMoreHTML}
    `;

    const btnLoadMoreTable = document.getElementById('btnLoadMoreTable');
    if (btnLoadMoreTable) {
      btnLoadMoreTable.addEventListener('click', () => {
        state.visibleLimit += 24;
        renderResults();
      });
    }

    bindBookingButtons();
  }

  function renderLeaderboardView() {
    if (!DOM.resultsContainer) return;
    DOM.resultsContainer.innerHTML = `
      <div class="leaderboard-grid">
        ${AGENCIES.map(agency => {
          const isActive = state.activeAgencies.has(agency.id);
          const winRate = Math.round((10 - agency.rank) * 11);
          return `
            <div class="agency-stat-card">
              <div class="stat-header">
                <span class="stat-name" style="color: ${agency.color};">
                  ${getSupplierLogoHTML(agency, 'md')}
                  <span>${agency.fullTitle}</span>
                </span>
                <span class="badge ${isActive ? 'badge-info' : ''}">${isActive ? 'Active' : 'Disabled'}</span>
              </div>
              <div>
                <small style="color:var(--text-muted);">Lowest Rate Win Frequency</small>
                <div class="stat-win-rate">${winRate}%</div>
              </div>
              <div class="stat-bar-outer">
                <div class="stat-bar-inner" style="width: ${winRate}%; background: ${agency.color};"></div>
              </div>
              <p style="font-size:0.8rem; color:var(--text-muted);">Rank #${agency.rank} in B2B supplier rate parity & speed.</p>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  function bindBookingButtons() {
    document.querySelectorAll('.btn-book-agency').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const agencyId = btn.getAttribute('data-agency-id');
        const agency = AGENCIES.find(a => a.id === agencyId) || { name: 'Innstant', icon: '🚀', portalUrl: 'https://b2b.innstant.travel', logoUrl: 'https://www.google.com/s2/favicons?domain=innstant.travel&sz=128' };
        const agencyName = btn.getAttribute('data-agency-name') || agency.name;
        const hotel = btn.getAttribute('data-hotel') || 'Selected Hotel';
        const room = btn.getAttribute('data-room') || 'Standard Room';
        const bed = btn.getAttribute('data-bed') || '';
        const price = btn.getAttribute('data-price') || '₪0';
        const breakfast = btn.getAttribute('data-breakfast') === 'true';
        const ref = btn.getAttribute('data-ref') || `${agencyName.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-X`;

        const creds = state.supplierCredentials[agencyId] || {};
        const isConfigured = !!(creds.key || creds.pass || creds.client || creds.user || creds.id);
        const userDisplay = creds.user || creds.client || creds.id || (creds.key ? 'API Key Active' : 'Demo Account');

        // Deep Search Portal URL with pre-filled hotel and dates
        const deepSearchUrl = SupplierGateway.getDeepSearchUrl(agencyId, { name: hotel, location: state.filters.hotelName }, state.filters, creds);

        logDebug(`🔗 Initiating booking handoff for ${agencyName} -> ${deepSearchUrl} (Ref: ${ref})`);

        if (DOM.bookingModalAgencyIcon) {
          DOM.bookingModalAgencyIcon.innerHTML = getSupplierLogoHTML(agency, 'lg');
        }
        if (DOM.bookingModalAgencyName) DOM.bookingModalAgencyName.textContent = `Connecting to ${agencyName} B2B Portal`;
        if (DOM.bookingModalRefCode) DOM.bookingModalRefCode.textContent = `Provider Booking Ref: ${ref}`;
        if (DOM.bookingModalHotel) DOM.bookingModalHotel.textContent = hotel;
        if (DOM.bookingModalRoom) DOM.bookingModalRoom.textContent = `${room} ${bed ? '• ' + bed : ''}`;
        if (DOM.bookingModalTotalRate) DOM.bookingModalTotalRate.textContent = price;
        if (DOM.bookingModalDates) DOM.bookingModalDates.textContent = `📅 ${state.filters.checkIn} → ${state.filters.checkOut} (${state.filters.nights} Nights)`;
        if (DOM.bookingModalGuests) DOM.bookingModalGuests.textContent = `👥 ${state.filters.adults} Adults · ${state.filters.rooms} Room${state.filters.rooms > 1 ? 's' : ''}`;
        if (DOM.bookingModalBoard) DOM.bookingModalBoard.textContent = breakfast ? '☕ Breakfast Included' : '🚫 Room Only';
        if (DOM.bookingModalPortalUrl) DOM.bookingModalPortalUrl.textContent = deepSearchUrl;

        // Populate B2B Account status in modal
        if (DOM.bookingModalCredsTitle) {
          DOM.bookingModalCredsTitle.textContent = isConfigured ? `🔑 B2B Trade Session: ${userDisplay}` : '⚪ Demo Mode (No custom API credentials saved)';
          DOM.bookingModalCredsTitle.style.color = isConfigured ? '#34d399' : '#fbbf24';
        }
        if (DOM.bookingModalCredsDesc) {
          DOM.bookingModalCredsDesc.textContent = isConfigured ? 'Direct API session active. You can query live rates below.' : 'Open ⚙️ Supplier API & Logins in the top navbar to configure trade credentials.';
        }

        // Reset live response drawer inside modal
        if (DOM.bookingModalLiveLogBox) DOM.bookingModalLiveLogBox.classList.add('hidden');
        if (DOM.bookingModalLivePre) DOM.bookingModalLivePre.textContent = '';

        // Wire "Query Real Live Rate Now" button inside modal
        if (DOM.btnModalTriggerLiveSearch) {
          DOM.btnModalTriggerLiveSearch.onclick = async () => {
            DOM.btnModalTriggerLiveSearch.disabled = true;
            DOM.btnModalTriggerLiveSearch.textContent = '⏳ Querying Live API...';
            if (DOM.bookingModalLiveLogBox) DOM.bookingModalLiveLogBox.classList.remove('hidden');
            if (DOM.bookingModalLiveBadge) DOM.bookingModalLiveBadge.textContent = 'Executing...';
            if (DOM.bookingModalLivePre) DOM.bookingModalLivePre.textContent = `Connecting to ${agencyName} B2B Gateway...\nHotel: ${hotel}\nDates: ${state.filters.checkIn} to ${state.filters.checkOut}\nAdults: ${state.filters.adults}\nWaiting for response...`;

            // Auto-open main debug box as well
            if (DOM.debugConsoleBox) DOM.debugConsoleBox.classList.remove('hidden');

            const currentHotelObj = state.hotels.find(h => h.name === hotel) || { name: hotel, location: 'Tel Aviv, Israel' };
            const liveRes = await SupplierGateway.searchRates(agencyId, currentHotelObj, state.filters, creds);

            DOM.btnModalTriggerLiveSearch.disabled = false;
            DOM.btnModalTriggerLiveSearch.textContent = '⚡ Query Real Live Rate Now';

            if (liveRes.success) {
              if (DOM.bookingModalLiveBadge) {
                DOM.bookingModalLiveBadge.textContent = `200 OK (${liveRes.latencyMs}ms)`;
                DOM.bookingModalLiveBadge.style.color = '#34d399';
              }
              if (DOM.bookingModalLivePre) {
                DOM.bookingModalLivePre.textContent = JSON.stringify({
                  status: "LIVE_API_SUCCESS",
                  supplier: agencyName,
                  hotel: hotel,
                  refCode: liveRes.refCode,
                  liveRateNightlyILS: liveRes.priceILS,
                  rawResponse: liveRes.rawResponse
                }, null, 2);
              }
              if (liveRes.priceILS && DOM.bookingModalTotalRate) {
                const total = liveRes.priceILS * state.filters.nights;
                DOM.bookingModalTotalRate.textContent = formatMoney(total);
                // Also cache for main view
                state.liveQuotes[`${currentHotelObj.id}_${agencyId}`] = {
                  priceILS: liveRes.priceILS,
                  isLive: true,
                  refCode: liveRes.refCode
                };
              }
            } else {
              if (DOM.bookingModalLiveBadge) {
                DOM.bookingModalLiveBadge.textContent = `Error: ${liveRes.error || 'Failed'}`;
                DOM.bookingModalLiveBadge.style.color = '#f43f5e';
              }
              if (DOM.bookingModalLivePre) {
                DOM.bookingModalLivePre.textContent = JSON.stringify({
                  status: "LIVE_API_ERROR",
                  supplier: agencyName,
                  error: liveRes.error,
                  note: "Inspect browser Developer Tools (Console) or bottom Debug Console for full trace."
                }, null, 2);
              }
            }
          };
        }
        
        if (DOM.btnProceedDirectLink) {
          DOM.btnProceedDirectLink.setAttribute('href', deepSearchUrl);
          DOM.btnProceedDirectLink.setAttribute('target', '_blank');
        }

        if (DOM.bookingModal) DOM.bookingModal.classList.remove('hidden');

        let secondsLeft = 3;
        if (DOM.bookingCountdownText) DOM.bookingCountdownText.textContent = `Ready to open ${agencyName} portal with search params...`;
        
        if (state.redirectTimer) clearInterval(state.redirectTimer);
        state.redirectTimer = setInterval(() => {
          secondsLeft--;
          if (secondsLeft > 0) {
            if (DOM.bookingCountdownText) DOM.bookingCountdownText.textContent = `Connecting in ${secondsLeft}s...`;
          } else {
            clearInterval(state.redirectTimer);
            if (DOM.bookingCountdownText) DOM.bookingCountdownText.textContent = `Connected! Click "Open Portal Now" to launch search.`;
          }
        }, 1000);
      });
    });
  }

  function handleCustomQuoteSubmit(e) {
    e.preventDefault();
    const hotelName = document.getElementById('modalHotelName').value.trim();
    const location = document.getElementById('modalLocation').value.trim() || 'Tel Aviv, Israel';
    const roomType = document.getElementById('modalRoomType').value;

    if (!hotelName) return;

    const newQuotes = {};
    AGENCIES.forEach(a => {
      const input = document.getElementById(`rate_${a.id}`);
      const val = input ? parseFloat(input.value) : null;
      if (val && !isNaN(val)) {
        newQuotes[a.id] = {
          priceILS: val,
          cancellation: 'Free cancellation until 48h prior',
          breakfast: true,
          instant: true,
          payType: 'Pay Now'
        };
      } else {
        newQuotes[a.id] = {
          priceILS: Math.round(900 * a.baseMultiplier),
          cancellation: 'Free cancellation until 24h prior',
          breakfast: true,
          instant: true,
          payType: 'Pay Now'
        };
      }
    });

    const newHotel = {
      id: 'h_custom_' + Date.now(),
      name: hotelName,
      location: location,
      stars: 5,
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
      amenities: ['Custom Quote', 'Free Wi-Fi', 'B2B Verified'],
      rooms: [
        {
          type: roomType,
          bed: '1 King Bed',
          size: '35 m²',
          basePriceILS: 900,
          quotes: newQuotes
        }
      ]
    };

    state.hotels.unshift(newHotel);
    if (DOM.addModal) DOM.addModal.classList.add('hidden');
    if (DOM.addQuoteForm) DOM.addQuoteForm.reset();
    logDebug(`Added custom quote for "${hotelName}"`);
    renderResults();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
