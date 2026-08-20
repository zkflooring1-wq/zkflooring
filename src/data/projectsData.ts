export interface FlooringProject {
  id?: string;
  slug: string;
  title: string;
  category: string;
  image: string;
  location: string;
  shortDesc: string;
  description: string[];
  highlights: string[];
  client: string;
  duration: string;
  area: string;
}

export const defaultProjects: FlooringProject[] = [
  {
    slug: 'luxury-herringbone-lvt-solihull',
    title: 'Luxury Herringbone LVT Installation',
    category: 'Luxury Vinyl Tile',
    image: '/services/Vinyl, Vinyl Tile.webp',
    location: 'Solihull, West Midlands',
    shortDesc: 'Complete subfloor latex leveling and precision herringbone Amtico LVT installation with feature perimeter border in an open-plan kitchen and dining area.',
    description: [
      'This comprehensive project in Solihull involved transforming an expansive open-plan kitchen, dining, and living zone with premium herringbone Luxury Vinyl Tiles.',
      'Our certified installers began by mechanically abrading the existing concrete subfloor, applying an epoxy damp-proof membrane (DPM), followed by a 4mm polymer-modified self-levelling latex screed to achieve a laser-flat foundation.',
      'We precision-installed Amtico herringbone planks with an intricate double-plank perimeter border and contrasting design strip, delivering a timeless and 100% waterproof finish.'
    ],
    highlights: [
      'Amtico Spacia Herringbone Pattern',
      'Laser-Level Latex Screed Foundation',
      'Feature Inlay Perimeter Border',
      '100% Waterproof & Stain Resistant',
      'Acoustic Sound-Dampening Underlay',
      'Lifetime Domestic Durability'
    ],
    client: 'Private Residence',
    duration: '3 Days',
    area: '68 sq metres'
  },
  {
    slug: 'commercial-carpet-tiles-birmingham-city-centre',
    title: 'Executive Office Carpet Tile Fitting',
    category: 'Carpet & Carpet Tile',
    image: '/services/Carpet, Carpet Tile.webp',
    location: 'Colmore Row, Birmingham City Centre',
    shortDesc: 'Heavy contract grade sound-dampening carpet tile installation across corporate office suites and boardroom facilities in Birmingham city centre.',
    description: [
      'ZK Flooring was commissioned to complete a full flooring refurbishment for a leading corporate headquarters located on Colmore Row in Birmingham City Centre.',
      'Working around the client’s operational schedule, our team stripped out worn carpet and fitted heavy-duty Interface modular carpet tiles across open-plan workspaces, executive boardrooms, and meeting pods.',
      'The project utilized low-VOC tackifier adhesive allowing future modular tile replacement, combined with enhanced acoustic backing to reduce footfall echo across the corporate floor.'
    ],
    highlights: [
      'Interface Class 33 Heavy Contract Tiles',
      'Enhanced Acoustic Sound Dampening',
      'Low-VOC Environmental Tackifier Fitting',
      'Precision Cut Around Raised Floor Outlets',
      'Out-of-Hours Commercial Turnaround',
      'Heavy Castor Chair Resistant'
    ],
    client: 'Corporate Legal Firm',
    duration: '4 Days',
    area: '340 sq metres'
  },
  {
    slug: 'subfloor-latex-screed-edgbaston',
    title: 'Precision Subfloor Levelling & DPM',
    category: 'Subfloor Preparation',
    image: '/services/Self Levelling.webp',
    location: 'Edgbaston, Birmingham',
    shortDesc: 'Extensive subfloor moisture testing, epoxy damp-proof membrane (DPM) barrier application, and ultra-flat polymer latex screed across uneven ground floors.',
    description: [
      'Prior to the installation of high-end wood flooring, this heritage Edgbaston property required comprehensive subfloor remediation due to uneven screeds and high residual subfloor moisture.',
      'We conducted hygrometer moisture tests, diamond-ground high spots, and applied two coats of liquid epoxy damp-proof membrane to create a permanent moisture barrier.',
      'We then poured high-performance fibre-reinforced self-levelling compound, achieving a SR1 standard flat floor ready for glue-down timber flooring.'
    ],
    highlights: [
      'Digital Subfloor Hygrometer Moisture Testing',
      'Two-Coat Epoxy Damp-Proof Membrane (DPM)',
      'Fibre-Reinforced Self-Levelling Compound',
      'Achieved SR1 Flatness Tolerance',
      'Crack Bridging & Subfloor Priming',
      'Guaranteed Subfloor Longevity'
    ],
    client: 'Residential Renovation',
    duration: '2 Days',
    area: '115 sq metres'
  },
  {
    slug: 'engineered-oak-hardwood-sutton-coldfield',
    title: 'Engineered Natural Oak Timber Flooring',
    category: 'Hardwood Flooring',
    image: '/about page/1.webp',
    location: 'Four Oaks, Sutton Coldfield',
    shortDesc: 'Premium brushed & oiled engineered European oak plank installation with acoustic underlayment and matching solid oak scotia and thresholds.',
    description: [
      'A prestigious residential project in Four Oaks, Sutton Coldfield, featuring 190mm wide-plank brushed and UV-oiled engineered European oak.',
      'Our team installed high-density gold vapour acoustic underlayment to absorb sound and fitted the real timber planks with staggered joint layouts across the grand hallway and lounge.',
      'Finished with bespoke color-matched solid oak scotia beading and flush architectural door transition profiles for a seamless luxury aesthetic.'
    ],
    highlights: [
      '190mm Wide Brushed European Oak',
      'Gold Vapour Barrier Acoustic Underlay',
      'Colour-Matched Solid Oak Scotia',
      'Architectural Flush Threshold Bars',
      'UV Oiled Low-Maintenance Finish',
      'Compatible with Underfloor Heating'
    ],
    client: 'Private Client',
    duration: '3 Days',
    area: '85 sq metres'
  },
  {
    slug: 'commercial-safety-vinyl-harborne',
    title: 'Clinical Safety Vinyl & Cap-and-Cove',
    category: 'Commercial Vinyl',
    image: '/about page/2.webp',
    location: 'Harborne Medical Centre, Birmingham',
    shortDesc: 'Hygienic, slip-resistant Altro safety vinyl with hot-welded impervious seams and 100mm cap-and-cove skirting up the walls for clinical healthcare compliance.',
    description: [
      'Commissioned to install hygienic healthcare-grade safety flooring for clinical consultation rooms, treatment areas, and corridors at Harborne Medical Centre.',
      'The project demanded strict adherence to NHS infection control protocols and BS 8203 safety standards. We formed 100mm cove formers up the walls with capping strips to eliminate dirt traps.',
      'Altro Walkway 20 slip-resistant vinyl was installed with precision hot-welded seams using matching vinyl weld rod, delivering an impervious, easily sanitised surface.'
    ],
    highlights: [
      'Altro Walkway 20 Non-Slip Safety Vinyl',
      '100mm Cap & Cove Vertical Wall Skirting',
      'Hot-Gas Welded Impervious Seams',
      'R10 Slip Resistance Wet & Dry',
      'NHS Infection Control & BS 8203 Compliant',
      'Heavy Clinical Chemical Resistance'
    ],
    client: 'NHS Healthcare Trust',
    duration: '2 Days',
    area: '92 sq metres'
  },
  {
    slug: 'luxury-deep-pile-carpet-moseley',
    title: 'Deep-Pile Luxury Domestic Carpet',
    category: 'Carpet & Carpet Tile',
    image: '/services/Carpet, Carpet Tile.webp',
    location: 'Moseley, Birmingham',
    shortDesc: 'Plush deep-pile Saxony carpet installation across 4 bedrooms, landing, and winding staircase with 11mm high-density PU underlay and satin brass rods.',
    description: [
      'A classic Victorian residence in Moseley requiring a warm, luxurious flooring upgrade across the upper floors and staircase.',
      'We installed 11mm ultra-dense Cloud 9 underlayment paired with heavy-duty dual-gripper perimeter installation to maximize underfoot cushioning and carpet lifespan.',
      'The winding staircase was fitted with meticulous pattern alignment, tensioned stretching, and finished with solid satin brass stair rods and matching threshold door plates.'
    ],
    highlights: [
      'Stain-Resistant Saxony Deep-Pile Carpet',
      '11mm Cloud 9 High-Density Underlay',
      'Precision Winding Stair Fitting',
      'Dual-Gripper Heavy Tensioning',
      'Solid Satin Brass Stair Rods',
      '15-Year Wear & Stain Warranty'
    ],
    client: 'Private Residence',
    duration: '2 Days',
    area: '145 sq metres'
  }
];
