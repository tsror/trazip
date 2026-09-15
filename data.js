/* ==========================================================================
   Trazip RateCompare - Mock Travel Dataset & 9 B2B Supplier Definitions
   ========================================================================== */

const AGENCIES = [
  {
    id: 'webbeds',
    name: 'Webbeds',
    fullTitle: 'Webbeds B2B Platform',
    domain: 'webbeds.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=webbeds.com&sz=128',
    portalUrl: 'https://www.webbeds.com',
    color: '#0284c7',
    icon: '🛌',
    rank: 1,
    baseMultiplier: 0.94
  },
  {
    id: 'tale',
    name: 'Tale Travel',
    fullTitle: 'Tale Travel Ltd',
    domain: 'taletravel.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=taletravel.com&sz=128',
    portalUrl: 'https://www.taletravel.com',
    color: '#d97706',
    icon: '✈️',
    rank: 2,
    baseMultiplier: 1.01
  },
  {
    id: 'ratehawk',
    name: 'RateHawk',
    fullTitle: 'RateHawk B2B Engine',
    domain: 'ratehawk.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=ratehawk.com&sz=128',
    portalUrl: 'https://www.ratehawk.com',
    color: '#dc2626',
    icon: '🦅',
    rank: 3,
    baseMultiplier: 0.93
  },
  {
    id: 'tbo',
    name: 'TBO',
    fullTitle: 'TBO Holidays',
    domain: 'tboholidays.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=tboholidays.com&sz=128',
    portalUrl: 'https://www.tboholidays.com',
    color: '#059669',
    icon: '🌐',
    rank: 4,
    baseMultiplier: 0.97
  },
  {
    id: 'ptc',
    name: 'PTC',
    fullTitle: 'PTC Travel',
    domain: 'ptc.co.il',
    logoUrl: 'https://www.google.com/s2/favicons?domain=ptc.co.il&sz=128',
    portalUrl: 'https://www.ptc.co.il',
    color: '#e11d48',
    icon: '🏢',
    rank: 5,
    baseMultiplier: 0.99
  },
  {
    id: 'goglobal',
    name: 'Go Global',
    fullTitle: 'Go Global Travel',
    domain: 'goglobal.travel',
    logoUrl: 'https://www.google.com/s2/favicons?domain=goglobal.travel&sz=128',
    portalUrl: 'https://www.goglobal.travel',
    color: '#8b5cf6',
    icon: '🌍',
    rank: 6,
    baseMultiplier: 0.96
  },
  {
    id: 'arbitrip',
    name: 'Arbitrip',
    fullTitle: 'Arbitrip Smart B2B',
    domain: 'arbitrip.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=arbitrip.com&sz=128',
    portalUrl: 'https://www.arbitrip.com',
    color: '#3b82f6',
    icon: '⚡',
    rank: 7,
    baseMultiplier: 0.95
  },
  {
    id: 'expedia',
    name: 'Expedia TAAP',
    fullTitle: 'Expedia TAAP B2B Portal',
    domain: 'expedia.com',
    logoUrl: 'https://www.google.com/s2/favicons?domain=expedia.com&sz=128',
    portalUrl: 'https://www.expediapartnersolutions.com/products/expedia-taap',
    color: '#f59e0b',
    icon: '🛎️',
    rank: 8,
    baseMultiplier: 1.03
  },
  {
    id: 'innstant',
    name: 'Innstant',
    fullTitle: 'Innstant Travel B2B',
    domain: 'innstant.travel',
    logoUrl: 'https://www.google.com/s2/favicons?domain=innstant.travel&sz=128',
    portalUrl: 'https://b2b.innstant.travel',
    color: '#10b981',
    icon: '🚀',
    rank: 9,
    baseMultiplier: 0.92
  }
];

const CURRENCY_RATES = {
  ILS: { symbol: '₪', rate: 1.0, decimals: 0 },
  USD: { symbol: '$', rate: 0.27, decimals: 0 },
  EUR: { symbol: '€', rate: 0.25, decimals: 0 },
  GBP: { symbol: '£', rate: 0.21, decimals: 0 }
};

const INITIAL_HOTELS = [
  {
    id: 'h1',
    name: 'The Norman Tel Aviv',
    location: 'Tel Aviv, Israel',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    amenities: ['Boutique Pool', 'Rooftop Lounge', 'Free Wi-Fi', 'Spa', 'Prime Location'],
    rooms: [
      {
        type: 'Deluxe Room',
        bed: '1 King Bed',
        size: '38 m²',
        basePriceILS: 1250,
        quotes: {
          webbeds: { priceILS: 1120, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tale: { priceILS: 1220, cancellation: 'Non-Refundable', breakfast: true, instant: false, payType: 'Pay Now' },
          ratehawk: { priceILS: 1090, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tbo: { priceILS: 1190, cancellation: 'Non-Refundable', breakfast: false, instant: true, payType: 'Pay at Hotel' },
          ptc: { priceILS: 1250, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          goglobal: { priceILS: 1175, cancellation: 'Free cancellation until 72h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          arbitrip: { priceILS: 1140, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          expedia: { priceILS: 1290, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          innstant: { priceILS: 1080, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay at Hotel' }
        }
      },
      {
        type: 'Executive Suite',
        bed: '1 King Bed + Living Room',
        size: '65 m²',
        basePriceILS: 2400,
        quotes: {
          webbeds: { priceILS: 2210, cancellation: 'Free cancellation until 72h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tale: { priceILS: 2390, cancellation: 'Non-Refundable', breakfast: false, instant: false, payType: 'Pay at Hotel' },
          ratehawk: { priceILS: 2180, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tbo: { priceILS: 2320, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          ptc: { priceILS: 2450, cancellation: 'Free cancellation until 72h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          goglobal: { priceILS: 2290, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          arbitrip: { priceILS: 2280, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          expedia: { priceILS: 2510, cancellation: 'Free cancellation until 72h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          innstant: { priceILS: 2150, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' }
        }
      }
    ]
  },
  {
    id: 'h2',
    name: 'Dan Panorama Tel Aviv',
    location: 'Tel Aviv, Israel',
    stars: 4,
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
    amenities: ['Sea View', 'Outdoor Pool', 'Family Friendly', 'Executive Lounge'],
    rooms: [
      {
        type: 'Standard Room',
        bed: '2 Twin Beds or 1 Double',
        size: '28 m²',
        basePriceILS: 780,
        quotes: {
          webbeds: { priceILS: 705, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tale: { priceILS: 765, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          ratehawk: { priceILS: 685, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tbo: { priceILS: 695, cancellation: 'Non-Refundable', breakfast: false, instant: true, payType: 'Pay Now' },
          ptc: { priceILS: 780, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          goglobal: { priceILS: 740, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay at Hotel' },
          arbitrip: { priceILS: 710, cancellation: 'Free cancellation until 24h prior', breakfast: false, instant: true, payType: 'Pay Now' },
          expedia: { priceILS: 799, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          innstant: { priceILS: 670, cancellation: 'Free cancellation until 12h prior', breakfast: true, instant: true, payType: 'Pay Now' }
        }
      }
    ]
  },
  {
    id: 'h3',
    name: 'Hilton New York Times Square',
    location: 'New York, USA',
    stars: 4,
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80',
    amenities: ['Skyline Views', 'Fitness Center', 'Central Manhattan', 'Business Center'],
    rooms: [
      {
        type: 'Standard Room',
        bed: '1 Queen Bed',
        size: '30 m²',
        basePriceILS: 1100,
        quotes: {
          webbeds: { priceILS: 980, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tale: { priceILS: 1085, cancellation: 'Non-Refundable', breakfast: false, instant: false, payType: 'Pay Now' },
          ratehawk: { priceILS: 960, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tbo: { priceILS: 1040, cancellation: 'Free cancellation until 24h prior', breakfast: false, instant: true, payType: 'Pay at Hotel' },
          ptc: { priceILS: 1120, cancellation: 'Free cancellation until 24h prior', breakfast: false, instant: true, payType: 'Pay Now' },
          goglobal: { priceILS: 1010, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          arbitrip: { priceILS: 990, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          expedia: { priceILS: 975, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          innstant: { priceILS: 940, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' }
        }
      }
    ]
  },
  {
    id: 'h4',
    name: 'Hôtel Plaza Athénée',
    location: 'Paris, France',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80',
    amenities: ['Eiffel Tower View', 'Dior Spa', 'Michelin Dining', 'Concierge Service'],
    rooms: [
      {
        type: 'Superior Room',
        bed: '1 King Bed',
        size: '35 m²',
        basePriceILS: 3200,
        quotes: {
          webbeds: { priceILS: 2890, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tale: { priceILS: 3190, cancellation: 'Non-Refundable', breakfast: false, instant: false, payType: 'Pay Now' },
          ratehawk: { priceILS: 2820, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tbo: { priceILS: 3100, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay at Hotel' },
          ptc: { priceILS: 3250, cancellation: 'Free cancellation until 72h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          goglobal: { priceILS: 3050, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          arbitrip: { priceILS: 2980, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          expedia: { priceILS: 3310, cancellation: 'Free cancellation until 72h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          innstant: { priceILS: 2790, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' }
        }
      }
    ]
  },
  {
    id: 'h5',
    name: 'Burj Al Arab Jumeirah',
    location: 'Dubai, UAE',
    stars: 5,
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=800&q=80',
    amenities: ['Private Beach', 'Helipad', 'Personal Butler', 'Infinity Pool'],
    rooms: [
      {
        type: 'Deluxe Suite',
        bed: '1 Super King Bed',
        size: '170 m²',
        basePriceILS: 5400,
        quotes: {
          webbeds: { priceILS: 4850, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tale: { priceILS: 5290, cancellation: 'Non-Refundable', breakfast: true, instant: false, payType: 'Pay Now' },
          ratehawk: { priceILS: 4790, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          tbo: { priceILS: 5120, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay at Hotel' },
          ptc: { priceILS: 5450, cancellation: 'Free cancellation until 72h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          goglobal: { priceILS: 5080, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          arbitrip: { priceILS: 4950, cancellation: 'Free cancellation until 48h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          expedia: { priceILS: 5580, cancellation: 'Free cancellation until 72h prior', breakfast: true, instant: true, payType: 'Pay Now' },
          innstant: { priceILS: 4720, cancellation: 'Free cancellation until 24h prior', breakfast: true, instant: true, payType: 'Pay Now' }
        }
      }
    ]
  }
];
