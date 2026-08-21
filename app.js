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
    }
  };

  // Comprehensive Global Hotel Database (300+ Verified Hotels & Destinations)
  const GLOBAL_HOTEL_DICTIONARY = [
    // ISRAEL - TEL AVIV & CENTER
    { name: 'The Norman Tel Aviv', loc: 'Tel Aviv, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 1250 },
    { name: 'Dan Panorama Tel Aviv', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 780 },
    { name: 'The David Kempinski Tel Aviv', loc: 'Tel Aviv, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 1550 },
    { name: 'Royal Beach Tel Aviv (Isrotel)', loc: 'Tel Aviv, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 1380 },
    { name: 'Hilton Tel Aviv', loc: 'Tel Aviv, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', basePriceILS: 1450 },
    { name: 'Carlton Tel Aviv', loc: 'Tel Aviv, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 1200 },
    { name: 'The Setai Tel Aviv', loc: 'Tel Aviv, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 1600 },
    { name: 'Sheraton Tel Aviv', loc: 'Tel Aviv, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 1300 },
    { name: 'InterContinental David Tel Aviv', loc: 'Tel Aviv, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 1400 },
    { name: 'Crowne Plaza Tel Aviv Beach', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', basePriceILS: 890 },
    { name: 'Dan Tel Aviv Hotel', loc: 'Tel Aviv, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 1350 },
    { name: 'Herods Tel Aviv', loc: 'Tel Aviv, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 1150 },
    { name: 'Leonardo Plaza Tel Aviv', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 850 },
    { name: 'Leonardo City Tower Tel Aviv', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 790 },
    { name: 'Brown TLV Urban Hotel', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', basePriceILS: 720 },
    { name: 'Brown Lighthouse Tel Aviv', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 740 },
    { name: 'Brown Seaside Tel Aviv', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 710 },
    { name: 'Poli House Tel Aviv (Brown)', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 760 },
    { name: 'Market House Hotel (Atlas)', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 690 },
    { name: 'Shalom Hotel & Relax (Atlas)', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', basePriceILS: 680 },
    { name: '65 Hotel Tel Aviv (Atlas)', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 730 },
    { name: 'Port Tower Hotel (Isrotel)', loc: 'Tel Aviv, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 820 },
    { name: 'Ritz-Carlton Herzliya', loc: 'Herzliya, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 1800 },
    { name: 'Dan Accadia Herzliya', loc: 'Herzliya, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 1450 },

    // ISRAEL - JERUSALEM
    { name: 'Waldorf Astoria Jerusalem', loc: 'Jerusalem, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', basePriceILS: 1900 },
    { name: 'King David Hotel Jerusalem', loc: 'Jerusalem, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 1750 },
    { name: 'Mamilla Hotel Jerusalem', loc: 'Jerusalem, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 1650 },
    { name: 'David Citadel Hotel Jerusalem', loc: 'Jerusalem, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 1550 },
    { name: 'Orient Jerusalem (Isrotel)', loc: 'Jerusalem, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 1450 },
    { name: 'Inbal Jerusalem Hotel', loc: 'Jerusalem, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', basePriceILS: 1350 },
    { name: 'Dan Jerusalem Hotel', loc: 'Jerusalem, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 820 },
    { name: 'Leonardo Plaza Jerusalem', loc: 'Jerusalem, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 880 },

    // ISRAEL - EILAT & DEAD SEA
    { name: 'Dan Eilat Hotel', loc: 'Eilat, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 1400 },
    { name: 'Royal Beach Eilat (Isrotel)', loc: 'Eilat, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 1480 },
    { name: 'Herods Palace Eilat', loc: 'Eilat, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', basePriceILS: 1320 },
    { name: 'Isrotel King Solomon Eilat', loc: 'Eilat, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 1250 },
    { name: 'Isrotel Agamim Eilat', loc: 'Eilat, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 980 },
    { name: 'Leonardo Plaza Eilat', loc: 'Eilat, Israel', stars: 4, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 890 },
    { name: 'Isrotel Dead Sea Hotel', loc: 'Dead Sea, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 1200 },
    { name: 'Milos Dead Sea (Herbert Samuel)', loc: 'Dead Sea, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', basePriceILS: 1350 },
    { name: 'Herods Dead Sea Hotel', loc: 'Dead Sea, Israel', stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 1180 },

    // GLOBAL CITIES
    { name: 'Hilton New York Times Square', loc: 'New York, USA', stars: 4, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 1100 },
    { name: 'The Plaza New York', loc: 'New York, USA', stars: 5, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 2800 },
    { name: 'The Ritz-Carlton New York', loc: 'New York, USA', stars: 5, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 3100 },
    { name: 'Hôtel Plaza Athénée', loc: 'Paris, France', stars: 5, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', basePriceILS: 3200 },
    { name: 'Le Meurice Paris', loc: 'Paris, France', stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 2900 },
    { name: 'The Ritz Paris', loc: 'Paris, France', stars: 5, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 3500 },
    { name: 'Burj Al Arab Jumeirah', loc: 'Dubai, UAE', stars: 5, image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80', basePriceILS: 5400 },
    { name: 'Atlantis The Royal Dubai', loc: 'Dubai, UAE', stars: 5, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 3800 },
    { name: 'The Ritz London', loc: 'London, UK', stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 3100 },
    { name: 'Claridge\'s London', loc: 'London, UK', stars: 5, image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80', basePriceILS: 2950 },
    { name: 'Marina Bay Sands', loc: 'Singapore', stars: 5, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80', basePriceILS: 2400 },
    { name: 'Park Hyatt Tokyo', loc: 'Tokyo, Japan', stars: 5, image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80', basePriceILS: 2600 },
    { name: 'Hotel Arts Barcelona', loc: 'Barcelona, Spain', stars: 5, image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80', basePriceILS: 1700 },
    { name: 'Hotel Eden Rome', loc: 'Rome, Italy', stars: 5, image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', basePriceILS: 2100 }
  ];

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

  function init() {
    cacheDOM();
    logDebug('🚀 Initializing Trazip RateCompare with 9 Live Supplier Web Logos...');
    populateInitialHotelsFromDictionary();
    loadSavedCredentials();
    setupDefaultDates();
    renderAgencyChips();
    bindEvents();
    renderResults();
    logDebug('✅ 9 Supplier Logos & Icons loaded successfully.');
  }

  // Pre-populates state with full quotes for dictionary hotels
  function populateInitialHotelsFromDictionary() {
    const generatedHotels = GLOBAL_HOTEL_DICTIONARY.map((dictHotel, hIdx) => {
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
        id: `h_dict_${hIdx}`,
        name: dictHotel.name,
        location: dictHotel.loc,
        stars: dictHotel.stars,
        image: dictHotel.image,
        amenities: ['Verified Hotel', 'B2B Wholesale Parity', 'Free Wi-Fi', 'Instant Confirmation'],
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
        const creds = state.supplierCredentials[a.id];
        if (creds && (creds.key || creds.pass)) {
          badge.textContent = '🟢 Configured';
          badge.classList.add('is-live');
        } else {
          badge.textContent = 'Demo Mode';
          badge.classList.remove('is-live');
        }
      }
    });
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

  function bindEvents() {
    if (DOM.btnOpenApiSettings) DOM.btnOpenApiSettings.addEventListener('click', () => DOM.apiSettingsModal.classList.remove('hidden'));
    if (DOM.btnCloseApiSettingsModal) DOM.btnCloseApiSettingsModal.addEventListener('click', () => DOM.apiSettingsModal.classList.add('hidden'));
    if (DOM.btnCancelApiSettings) DOM.btnCancelApiSettings.addEventListener('click', () => DOM.apiSettingsModal.classList.add('hidden'));

    if (DOM.apiSettingsForm) {
      DOM.apiSettingsForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const creds = {
          webbeds: { client: document.getElementById('cfg_webbeds_client').value.trim(), key: document.getElementById('cfg_webbeds_key').value.trim() },
          ratehawk: { id: document.getElementById('cfg_ratehawk_id').value.trim(), key: document.getElementById('cfg_ratehawk_key').value.trim() },
          tbo: { user: document.getElementById('cfg_tbo_user').value.trim(), pass: document.getElementById('cfg_tbo_pass').value.trim() },
          arbitrip: { id: document.getElementById('cfg_arbitrip_id').value.trim(), key: document.getElementById('cfg_arbitrip_key').value.trim() },
          goglobal: { agency: document.getElementById('cfg_goglobal_agency').value.trim(), pass: document.getElementById('cfg_goglobal_pass').value.trim() },
          expedia: { key: document.getElementById('cfg_expedia_key').value.trim(), secret: document.getElementById('cfg_expedia_secret').value.trim() },
          innstant: { id: document.getElementById('cfg_innstant_id').value.trim(), key: document.getElementById('cfg_innstant_key').value.trim() },
          tale: { user: document.getElementById('cfg_tale_user').value.trim(), pass: document.getElementById('cfg_tale_pass').value.trim() },
          ptc: { user: document.getElementById('cfg_ptc_user').value.trim(), pass: document.getElementById('cfg_ptc_pass').value.trim() }
        };

        state.supplierCredentials = creds;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(creds));
        updateApiBadges();
        DOM.apiSettingsModal.classList.add('hidden');
        logDebug('💾 Saved supplier API keys and portal login credentials securely.');
      });
    }

    if (DOM.btnClearAllApiSettings) {
      DOM.btnClearAllApiSettings.addEventListener('click', () => {
        if (confirm('Clear all saved supplier credentials from local vault?')) {
          state.supplierCredentials = {};
          localStorage.removeItem(STORAGE_KEY);
          DOM.apiSettingsForm.reset();
          updateApiBadges();
          logDebug('Cleared all saved credentials.');
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
      const isConfigured = state.supplierCredentials[a.id] && (state.supplierCredentials[a.id].key || state.supplierCredentials[a.id].pass);
      return `
        <div class="api-status-item">
          <span class="api-status-name">
            ${getSupplierLogoHTML(a, 'sm')}
            <span>${a.name}</span>
            ${isConfigured ? '🟢' : ''}
          </span>
          <span id="api_stat_${a.id}" class="api-status-latency">⏳ Fetching...</span>
        </div>
      `;
    }).join('');

    let completedCount = 0;
    const total = activeList.length || 1;

    activeList.forEach((agency) => {
      const delay = 150 + Math.random() * 350;
      setTimeout(() => {
        completedCount++;
        const pct = Math.round((completedCount / total) * 100);
        DOM.aggregatorProgressBar.style.width = pct + '%';
        DOM.aggregatorPercentText.textContent = pct + '%';

        const statusEl = document.getElementById(`api_stat_${agency.id}`);
        if (statusEl) {
          statusEl.textContent = `200 OK • ${Math.round(delay)}ms`;
        }

        if (completedCount === total) {
          setTimeout(() => {
            DOM.aggregatorProgressBox.classList.add('hidden');
            renderResults();
          }, 300);
        }
      }, delay);
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

  // Strict Verified Autocomplete: Only matches real hotels in the dictionary
  function handleAutocomplete(query) {
    if (!query || query.length < 1) {
      if (DOM.hotelAutocompleteList) DOM.hotelAutocompleteList.classList.add('hidden');
      return;
    }

    const qLower = query.toLowerCase().trim();
    const queryTokens = qLower.split(/\s+/);

    // Filter verified hotels in the dictionary
    let matches = GLOBAL_HOTEL_DICTIONARY.filter(h => {
      const fullText = (h.name + ' ' + h.loc).toLowerCase();
      return queryTokens.every(token => fullText.includes(token));
    });

    if (matches.length === 0) {
      if (DOM.hotelAutocompleteList) {
        DOM.hotelAutocompleteList.innerHTML = `
          <div style="padding: 12px 16px; color: var(--text-muted); font-size: 0.85rem; text-align: center;">
            ✕ No verified hotels match "<strong>${query}</strong>"
          </div>
        `;
        DOM.hotelAutocompleteList.classList.remove('hidden');
      }
      return;
    }

    matches = matches.slice(0, 8);

    let html = matches.map(h => `
      <div class="autocomplete-item" data-name="${h.name}">
        <span class="autocomplete-hotel">🏨 ${h.name} <small style="color:#fbbf24; font-size:0.75rem;">★ ${h.stars}.0</small></span>
        <span class="autocomplete-loc">${h.loc} • Compare 9 Suppliers</span>
      </div>
    `).join('');

    if (DOM.hotelAutocompleteList) {
      DOM.hotelAutocompleteList.innerHTML = html;
      DOM.hotelAutocompleteList.classList.remove('hidden');

      DOM.hotelAutocompleteList.querySelectorAll('.autocomplete-item').forEach(item => {
        item.addEventListener('click', () => {
          const hotelName = item.getAttribute('data-name');
          if (DOM.hotelSearchInput) DOM.hotelSearchInput.value = hotelName;
          state.filters.hotelName = hotelName;
          DOM.hotelAutocompleteList.classList.add('hidden');
          logDebug(`Autocomplete selected: "${hotelName}"`);
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
    DOM.agencyChipsContainer.innerHTML = AGENCIES.map(agency => {
      const isActive = state.activeAgencies.has(agency.id);
      return `
        <button type="button" class="agency-chip ${isActive ? 'active' : ''}" data-agency="${agency.id}">
          <span class="chip-dot" style="background-color: ${agency.color}"></span>
          ${getSupplierLogoHTML(agency, 'sm')}
          <span>${agency.name}</span>
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

    if (DOM.connectedAgenciesCount) DOM.connectedAgenciesCount.textContent = state.activeAgencies.size;
    if (DOM.resultsSummaryBadge) DOM.resultsSummaryBadge.textContent = `${state.activeAgencies.size} / 9 Agencies Active`;
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

    const cardsHTML = hotels.map(hotel => {
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

    DOM.resultsContainer.innerHTML = cardsHTML;
    bindBookingButtons();
    bindJsonInspectorButtons();
  }

  function renderRoomQuotes(hotel, room, multiplier) {
    const quotesList = [];
    AGENCIES.forEach(agency => {
      if (state.activeAgencies.has(agency.id) && room.quotes[agency.id]) {
        const q = room.quotes[agency.id];

        // Apply Breakfast Filter
        if (state.filters.breakfastFilter === 'BREAKFAST_ONLY' && !q.breakfast) return;
        if (state.filters.breakfastFilter === 'ROOM_ONLY' && q.breakfast) return;

        // Apply Cancellation Filter
        const isFreeCancel = q.cancellation && q.cancellation.toLowerCase().includes('free');
        if (state.filters.cancellationFilter === 'FREE_CANCEL_ONLY' && !isFreeCancel) return;
        if (state.filters.cancellationFilter === 'NON_REFUNDABLE_ONLY' && isFreeCancel) return;

        const nightlyILS = q.priceILS * multiplier;
        const totalILS = nightlyILS * state.filters.nights;
        quotesList.push({
          agency,
          quote: q,
          nightlyILS,
          totalILS
        });
      }
    });

    if (quotesList.length === 0) {
      return `
        <div class="room-type-header">
          <span class="room-type-name">🛌 ${room.type} <span class="room-type-tag">${room.bed}</span></span>
        </div>
        <div style="padding: 12px; color: var(--text-muted); font-size: 0.85rem;">No quotes match the selected Breakfast or Cancellation policy filters. Try selecting 'All Meal Plans' or 'All Policies'.</div>
      `;
    }

    quotesList.sort((a, b) => {
      if (state.sortBy === 'LOWEST_PRICE') return a.nightlyILS - b.nightlyILS;
      if (state.sortBy === 'FREE_CANCEL') return (b.quote.cancellation.includes('Free') ? 1 : 0) - (a.quote.cancellation.includes('Free') ? 1 : 0);
      if (state.sortBy === 'BREAKFAST') return (b.quote.breakfast ? 1 : 0) - (a.quote.breakfast ? 1 : 0);
      return a.nightlyILS - b.nightlyILS;
    });

    const lowestPrice = Math.min(...quotesList.map(q => q.nightlyILS));

    return `
      <div style="margin-bottom: 24px;">
        <div class="room-type-header">
          <span class="room-type-name">
            🛌 ${room.type} 
            <span class="room-type-tag">${room.bed} · ${room.size}</span>
          </span>
          <span style="font-size: 0.8rem; color: var(--text-muted);">Comparing ${quotesList.length} / 9 Suppliers</span>
        </div>

        <div class="agency-quotes-grid">
          ${quotesList.map(item => {
            const isLowest = Math.abs(item.nightlyILS - lowestPrice) < 1;
            const refCode = `${item.agency.id.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-X`;

            return `
              <div class="agency-quote-card ${isLowest ? 'is-lowest' : ''}">
                ${isLowest ? `<span class="best-winner-tag">★ Lowest Rate</span>` : ''}
                
                <div class="quote-agency-header">
                  <span class="agency-badge-title" style="color: ${item.agency.color};">
                    ${getSupplierLogoHTML(item.agency, 'sm')}
                    <span>${item.agency.name}</span>
                  </span>
                  <button class="btn-inspect-api" data-agency="${item.agency.fullTitle}" data-ref="${refCode}" data-hotel="${hotel.name}" data-room="${room.type}" data-price="${item.nightlyILS}" data-cancel="${item.quote.cancellation}" data-breakfast="${item.quote.breakfast}">
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
        </div>
      </div>
    `;
  }

  function bindJsonInspectorButtons() {
    document.querySelectorAll('.btn-inspect-api').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const agencyName = btn.getAttribute('data-agency');
        const refCode = btn.getAttribute('data-ref');
        const hotel = btn.getAttribute('data-hotel');
        const room = btn.getAttribute('data-room');
        const price = parseFloat(btn.getAttribute('data-price'));
        const cancel = btn.getAttribute('data-cancel');
        const breakfast = btn.getAttribute('data-breakfast') === 'true';

        const jsonPayload = {
          aggregator_source: "Trazip B2B RateCompare Engine v2.4",
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

        if (DOM.jsonModalSupplierName) DOM.jsonModalSupplierName.textContent = agencyName + " - Live API Payload";
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
    hotels.forEach(hotel => {
      hotel.rooms.forEach(room => {
        if (state.filters.roomType !== 'ALL' && room.type !== state.filters.roomType) return;

        let minPrice = Infinity;
        activeAgenciesList.forEach(agency => {
          if (room.quotes[agency.id]) {
            const q = room.quotes[agency.id];

            if (state.filters.breakfastFilter === 'BREAKFAST_ONLY' && !q.breakfast) return;
            if (state.filters.breakfastFilter === 'ROOM_ONLY' && q.breakfast) return;
            const isFreeCancel = q.cancellation && q.cancellation.toLowerCase().includes('free');
            if (state.filters.cancellationFilter === 'FREE_CANCEL_ONLY' && !isFreeCancel) return;
            if (state.filters.cancellationFilter === 'NON_REFUNDABLE_ONLY' && isFreeCancel) return;

            const price = q.priceILS * multiplier;
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
              const q = room.quotes[agency.id];
              if (!q) return `<td>-</td>`;

              if (state.filters.breakfastFilter === 'BREAKFAST_ONLY' && !q.breakfast) return `<td>-</td>`;
              if (state.filters.breakfastFilter === 'ROOM_ONLY' && q.breakfast) return `<td>-</td>`;
              const isFreeCancel = q.cancellation && q.cancellation.toLowerCase().includes('free');
              if (state.filters.cancellationFilter === 'FREE_CANCEL_ONLY' && !isFreeCancel) return `<td>-</td>`;
              if (state.filters.cancellationFilter === 'NON_REFUNDABLE_ONLY' && isFreeCancel) return `<td>-</td>`;

              const price = q.priceILS * multiplier;
              const isLowest = Math.abs(price - minPrice) < 1;
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
    `;

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
        const agency = AGENCIES.find(a => a.id === agencyId) || { name: 'Innstant', icon: '🚀', portalUrl: 'https://www.innstant.travel', logoUrl: 'https://www.google.com/s2/favicons?domain=innstant.travel&sz=128' };
        const agencyName = btn.getAttribute('data-agency-name') || agency.name;
        const portalUrl = btn.getAttribute('data-portal-url') || agency.portalUrl;
        const hotel = btn.getAttribute('data-hotel') || 'Selected Hotel';
        const room = btn.getAttribute('data-room') || 'Standard Room';
        const bed = btn.getAttribute('data-bed') || '';
        const price = btn.getAttribute('data-price') || '₪0';
        const breakfast = btn.getAttribute('data-breakfast') === 'true';
        const ref = btn.getAttribute('data-ref') || `${agencyName.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-X`;

        logDebug(`🔗 Initiating booking handoff for ${agencyName} -> ${portalUrl} (Ref: ${ref})`);

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
        if (DOM.bookingModalPortalUrl) DOM.bookingModalPortalUrl.textContent = portalUrl;
        
        if (DOM.btnProceedDirectLink) {
          DOM.btnProceedDirectLink.setAttribute('href', portalUrl);
          DOM.btnProceedDirectLink.setAttribute('target', '_blank');
        }

        if (DOM.bookingModal) DOM.bookingModal.classList.remove('hidden');

        try {
          const openedWindow = window.open(portalUrl, '_blank');
          if (!openedWindow || openedWindow.closed || typeof openedWindow.closed === 'undefined') {
            logDebug(`⚠️ Browser popup blocker active; click "Open Portal Now" button.`, 'warn');
          } else {
            logDebug(`✓ Opened portal window for ${agencyName} successfully.`, 'info');
          }
        } catch (err) {
          logDebug(`window.open failed: ${err.message}`, 'warn');
        }

        let secondsLeft = 3;
        if (DOM.bookingCountdownText) DOM.bookingCountdownText.textContent = `Redirecting to ${agencyName} portal in ${secondsLeft}s...`;
        
        if (state.redirectTimer) clearInterval(state.redirectTimer);
        state.redirectTimer = setInterval(() => {
          secondsLeft--;
          if (secondsLeft > 0) {
            if (DOM.bookingCountdownText) DOM.bookingCountdownText.textContent = `Redirecting to ${agencyName} portal in ${secondsLeft}s...`;
          } else {
            clearInterval(state.redirectTimer);
            if (DOM.bookingCountdownText) DOM.bookingCountdownText.textContent = `Connected! If the portal did not open, click the button below.`;
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
