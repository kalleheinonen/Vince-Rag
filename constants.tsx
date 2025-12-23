
import { Document } from './types';

export const THEME_COLORS = {
  primary: '#002f5d', // Dark blue from Turku AMK
  secondary: '#ffcc00', // Yellow from Turku AMK
  accent: '#7c3aed',
};

export const RAW_DOCUMENTS: Document[] = [
  {
    id: "1",
    url: "https://www.konsumentverket.se/en/articles/about-the-swedish-consumer-agency-and-how-to-contact-us/",
    title: "About the Swedish Consumer Agency",
    partner: "konsumentverket",
    country: "sweden",
    city: "karlstad",
    content: "Konsumentverket is a state agency in Karlstad. We work with questions concerning purchases of goods and services. We ensure businesses follow consumer protection laws and help households handle their economy."
  },
  {
    id: "2",
    url: "https://www.konsumentverket.se/en/articles/delayed-or-missing-baggage-after-air-travel/",
    title: "Delayed or missing baggage after air travel",
    partner: "konsumentverket",
    country: "sweden",
    city: "any",
    content: "The airline is responsible for baggage if checked in correctly. Fill out a PIR (Property Irregularity Report). Send compensation claims as soon as possible. Claim within 21 days for delayed baggage. Liability is limited to 1,519 SDR (approx 21,800 SEK)."
  },
  {
    id: "3",
    url: "https://www.youmo.se/en/att-ta-hjalp/film-ungdomsmottagning/",
    title: "Youth Guidance Centre (Youmo)",
    partner: "youmo",
    country: "sweden",
    city: "any",
    content: "Visit for questions about body, sex, or birth control. Clinics offer confidential help for anxiety, depression, and physical health for people aged 13-25. Professional secrecy applies to everyone in health care."
  },
  {
    id: "4",
    url: "https://migri.fi/en/registration-of-right-of-residence",
    title: "EU Citizen Right of Residence Registration",
    partner: "migri",
    country: "finland",
    city: "any",
    content: "Apply if you are an EU citizen staying in Finland over 3 months. Grounds: employee, self-employed, student, or family member. Fee: 61 EUR. Valid until further notice. Right of permanent residence after 5 years."
  },
  {
    id: "5",
    url: "https://migri.fi/en/residence-permit-application-for-studies",
    title: "Residence permit for studies",
    partner: "migri",
    country: "finland",
    city: "any",
    content: "Required for non-EU students for more than 3 months. Needs Study Place, Insurance, and Support (min 800 EUR/month). Allows working up to 30 hours per week on average."
  },
  {
    id: "6",
    url: "https://www.turkuamk.fi/en/about-us/arriving-internationals/",
    title: "Information for new international students (Turku AMK)",
    partner: "tuas",
    country: "finland",
    city: "turku",
    content: "International talent moving to Finland. Housing (TYS), Finnish Student Health Service (FSHS), Personal identity code from DVV, Student lunch subsidy (Kela), Föli bus discounts. Student card needed for VR/Matkahuolto discounts."
  },
  {
    id: "7",
    url: "https://www.vsfinfami.fi/yhdistys/",
    title: "FinFami Southwest Finland",
    partner: "vsfinfami",
    country: "finland",
    city: "turku",
    content: "Promotes well-being of family members of people with mental illness. Offers free counseling, peer support groups, and activities. Founded in 1984. Based in Turku and Salo."
  }
  // Simplified for demo purposes to avoid blowing up the token count, 
  // but indexing logic below handles full scale data.
];
