export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  priceMonthly: string;
  priceAnnual: string;
  billingPeriod: string;
  description: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
}

export const PRICING_ANNUAL_DISCOUNT_TEXT = 'Annual billing saves 20%.';

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'pilot',
    name: 'Design Partner Pilot',
    description: 'Free pilot access for institutions co-designing assessment workflows for 2027.',
    priceMonthly: '$0',
    priceAnnual: '$0',
    billingPeriod: 'for verified design partners',
    features: [
      'Up to 1,000 candidates included',
      'AI Question Builder & syllabus import',
      'Smart browser proctoring & offline autosave',
      'AI essay rubric grading assistant',
      'Direct Slack / Teams access to founding engineers',
    ],
    ctaLabel: 'Apply for Free Pilot',
    ctaHref: '#demo',
  },
  {
    id: 'growth',
    name: 'Growth Campus',
    badge: 'Most Popular',
    isPopular: true,
    description: 'For growing academic departments, medical faculties, and regional certification boards.',
    priceMonthly: '{{PRICE: $890}}',
    priceAnnual: '{{PRICE: $710}}',
    billingPeriod: '/ month, billed annually',
    features: [
      'Up to 10,000 candidates per month',
      'All Pilot features included',
      'Real-time multi-candidate invigilator dashboard',
      'LTI 1.3 sync for Canvas, Moodle, and Blackboard',
      'Digital certificates and verifiable Open Badges',
      'Standard 99.9% uptime SLA guarantee',
    ],
    ctaLabel: 'Book a Growth Demo',
    ctaHref: '#demo',
  },
  {
    id: 'enterprise',
    name: 'Enterprise Scale',
    description: 'For university-wide rollouts, government exam boards, and national licensure organizations.',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    billingPeriod: 'volume & concurrency based',
    features: [
      'Unlimited candidates and exam blueprints',
      'Dedicated isolated database tenant',
      'Custom single sign-on (SAML / OIDC / Entra ID)',
      'Custom question types & technical coding sandboxes',
      '24/7 dedicated support & psychometric consultant',
      'Custom data residency & SLA contract',
    ],
    ctaLabel: 'Contact Sales',
    ctaHref: '#demo',
  },
];

