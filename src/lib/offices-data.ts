/**
 * Shared office directory — single source of truth.
 * Consumed by: ContactPageClient, AboutPageClient, GlobalOperations.
 */

export interface Office {
  city: string;
  country: string;
  hq: boolean;
  contact?: string;
  address: string;
  phones: string[];
  fax?: string;
  email: string;
}

export const offices: Office[] = [
  {
    city: 'Abu Dhabi',
    country: 'UAE',
    hq: true,
    address: 'Dar Al Salam Building, Cornish Street, Abu Dhabi — PO Box 27818',
    phones: ['+971 2671 3320'],
    fax: '+971 2671 3325',
    email: 'info@offshoremarinesurveyors.com',
  },
  {
    city: 'Dubai',
    country: 'UAE',
    hq: false,
    contact: 'Capt. Zarir Soli Irani',
    address: 'The Citadel #806, Business Bay, Dubai, UAE',
    phones: ['+971 4423 2884', '+971 5018 89614'],
    email: 'capt.irani@constellationms.com',
  },
  {
    city: 'Fujairah',
    country: 'UAE',
    hq: false,
    address: 'Al Maha Tower, Opp. Port of Fujairah, UAE — PO Box 9071',
    phones: ['+971 9223 6344', '+971 5014 05188'],
    email: 'const24x7@constellationms.com',
  },
  {
    city: 'London',
    country: 'United Kingdom',
    hq: false,
    contact: 'Mr. Julien Gressier / Capt. John Noble',
    address: '2 Austin Street (off Shoreditch High Street), London E2 7NB',
    phones: ['+44 2077 396510', '+44 7876 211489'],
    email: 'const.london@constellationms.com',
  },
  {
    city: 'Singapore',
    country: 'Singapore',
    hq: false,
    address: '10 Anson Road, No. 14-01, International Plaza, Singapore',
    phones: ['+65 6223 3071'],
    email: 'const.sgp@constellationms.com',
  },
  {
    city: 'Muscat',
    country: 'Oman',
    hq: false,
    contact: 'Mr. Faisal AL Balushi',
    address: '17, Postal Code 324, Sohar, Oman',
    phones: ['+968 9988 4415'],
    email: 'const.oman@constellationms.com',
  },
  {
    city: 'Rotterdam',
    country: 'Netherlands',
    hq: false,
    contact: 'Mr. Gijs Van Nieuwkoop',
    address: 'Operetteweg 4, 1323 VA Almere-Stad, Netherlands',
    phones: ['+310 3654 64775', '+310 6543 62581'],
    email: 'const.europe@constellationms.com',
  },
  {
    city: 'Shanghai',
    country: 'China',
    hq: false,
    address: '1-309, Yufeng International Apartment, Haigang District, Qinhuangdao City, China',
    phones: ['+861 3933 509251'],
    email: 'const.china@constellationms.com',
  },
  {
    city: 'Cairo',
    country: 'Egypt',
    hq: false,
    contact: 'Engr. Hamdy Gaber',
    address: 'Victor Bassily-Bab, Alexandria, Egypt',
    phones: ['+2 0100 1600261'],
    email: 'const.egypt@constellationms.com',
  },
];
