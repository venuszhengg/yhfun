import { caseStudiesZh } from './chineseContent.js'

export const caseStudyImages = {
  clothing: {
    src: '/images/case-studies/pexels-ron-lach-8311880%201.png',
    alt: 'Two people working among clothing racks in a boutique',
  },
  hotel: {
    src: '/images/case-studies/hhotel%201.png',
    alt: 'A hotel bedroom with a double bed',
  },
  restaurant: {
    src: '/images/case-studies/restaurant%201.png',
    alt: 'A restaurant dining room with tables by the windows',
  },
}

export const caseStudies = [
  {
    id: 'clothing',
    label: 'Owner-run fashion boutique',
    cardTitle: 'Clothing Studio',
    cardDescription: 'Make the first step easy.',
    icon: 'clothing-rack 1.svg',
    location: 'China',
    title: 'Make the first step easy',
    image: caseStudyImages.clothing,
    challenge: 'The owner wanted to attract new customers through social media while running the shop alone, but wasn’t sure where to start or how to keep it manageable.',
    approach: 'We clarified the audience and content focus, then designed a small publishing trial with practical guidance on filming, posting, handling enquiries and recording feedback.',
    reason: 'The aim was to make the first steps manageable without creating an ongoing burden. Tracking enquiries and purchases, rather than just views, would help the owner decide where to invest their time and resources.',
  },
  {
    id: 'hotel',
    label: 'Newly opened hotel',
    cardTitle: 'Small Hotel',
    cardDescription: 'Guiding investment with cost-effective pilots.',
    icon: 'concierge-bell 1.svg',
    location: 'China',
    title: 'Guiding investment with cost-effective pilots',
    image: caseStudyImages.hotel,
    challenge: 'The newly opened hotel had limited room capacity and wanted to attract international guests. It needed to understand costs, potential returns and the preparations required, without disrupting its existing business.',
    approach: 'A short pilot was designed based on pricing benchmarks for comparable hotels and room types on international booking platforms, taking into account the hotel’s room types, platform terms and financial model. The plan covered costs, room allocation and a preparation checklist for bookings, payments, guest reception and post-stay support.',
    reason: 'A small-scale pilot allows the hotel to validate the entire process with limited investment, gather feedback based on actual operating conditions, and then decide whether a larger-scale rollout is warranted.',
  },
  {
    id: 'restaurant',
    label: 'Neighbourhood restaurant',
    cardTitle: 'Neighbourhood Restaurant',
    cardDescription: 'From campaign planning to delivery.',
    icon: 'plate-utensils 1.svg',
    location: 'Ireland',
    title: 'From campaign planning to delivery',
    image: caseStudyImages.restaurant,
    challenge: 'The restaurant wanted to celebrate its anniversary, thank its regular customers and attract new guests. New to campaign planning, the team needed a suitable campaign plan and practical support with delivery.',
    approach: 'Research into customer groups in the local community informed the campaign design. Our support covered implementation and coordination, including promotion, budgeting, staffing, materials, supplier coordination and on-the-day delivery.',
    reason: 'A reliable partner handling both campaign planning and delivery would reduce the restaurant team’s workload in coordinating suppliers, managing preparations and following up on details.',
  },
]

export const featuredCaseStudies = caseStudies.map(({ cardTitle, cardDescription, image }) => ({
  title: cardTitle,
  description: cardDescription,
  image,
}))

export const featuredCaseStudiesZh = featuredCaseStudies.map((study, index) => ({
  title: caseStudiesZh[index].label,
  description: `${caseStudiesZh[index].title}。`,
  image: { ...study.image, alt: caseStudiesZh[index].imageAlt },
}))
