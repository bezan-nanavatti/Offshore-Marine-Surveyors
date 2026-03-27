export interface TeamMember {
  slug: string;
  name: string;
  title: string;
  photo: string;
  bio: string;
  specializations: string[];
  email?: string;
  relatedServices?: string[]; // service slugs from services-data.ts
}

export const teamMembers: TeamMember[] = [
  {
    slug: 'zarir-irani',
    name: 'Capt. Zarir Soli Irani',
    title: 'Regional Director — IIMS, MBA, FICS, AFNI, FIIMS, NAMS-CMS',
    photo: '/images/team/Zarir-Irani.png',
    bio: `Capt. Zarir Irani is a highly experienced Certified Rig Move Master with deep expertise in marine warranty surveys and large-scale energy claim investigations. Based in Dubai, he leads Constellation Marine's Gulf operations and is the first point of contact for complex offshore casualty investigations in the Middle East.

His career spans extensive offshore construction and marine warranty work, large casualty investigations, hull and structural damage surveys, and flag state survey duties. He is a Fellow of the International Institute of Marine Surveying (IIMS), an Associate Fellow of the Nautical Institute, and holds membership of NAMS as a Certified Marine Surveyor.

Capt. Irani has led investigations into many of the region's most significant marine casualties and has represented P&I clubs, hull underwriters, and shipowners in high-value claim proceedings. His practical knowledge of rig move operations, combined with his legal and commercial acumen, makes him a highly sought-after expert witness and marine consultant.`,
    specializations: [
      'Marine Warranty Survey',
      'Rig Move & Positioning',
      'Large Casualty Investigation',
      'Hull & Structural Damage Survey',
      'Flag State Survey',
      'Expert Witness',
      'P&I Club Representation',
    ],
    email: 'capt.irani@constellationms.com',
    relatedServices: ['marine-warranty-survey', 'rig-positioning-moving', 'marine-casualties', 'dispute-litigation'],
  },
  {
    slug: 'john-noble',
    name: 'Capt. John Noble',
    title: 'Director / Mentor — Master Mariner',
    photo: '/images/team/John-Noble.png',
    bio: `Capt. John Noble is a senior maritime expert with a career spanning more than four decades, during which he has attended some 60 major maritime casualties worldwide. His expertise is concentrated in the fields of salvage, wreck removal, marine pollution, and collision/groundings, and he has appeared as an expert witness in numerous high-profile maritime legal proceedings.

Based in London, Capt. Noble serves as Director and Mentor within the Constellation Marine network, providing strategic guidance and expert consultancy on complex cases. He has led investigations into some of the most significant maritime casualties of recent decades, and his testimony has been accepted in courts and arbitration proceedings in multiple jurisdictions.

His specialist expertise in unsafe port cases — advising shipowners on their rights and remedies when vessels are directed to unsafe berths or ports — has been engaged by major shipping companies and P&I clubs worldwide.`,
    specializations: [
      'Salvage & Wreck Removal',
      'Marine Pollution Investigation',
      'Collision Investigation',
      'Expert Witness',
      'Unsafe Port Cases',
      'Major Casualty Investigation',
    ],
    email: 'const.london@constellationms.com',
    relatedServices: ['marine-casualties', 'dispute-litigation', 'offshore-survey'],
  },
  {
    slug: 'vispy-rusi-dadimaster',
    name: 'Capt. Vispy Rusi Dadimaster',
    title: 'Master Mariner — Principal Surveyor',
    photo: '/images/team/Vispy-Dadimaster.png',
    bio: `Capt. Vispy Rusi Dadimaster is a Master Mariner with a maritime career spanning over 22 years in operational and management roles across the shipping and offshore industries. He served 8+ years in Fujairah managing port operations, agency, and logistics, before transitioning to full-time marine surveying.

He has commanded various vessel types including offshore Dynamic Positioning (DP) vessels, and this first-hand operational experience underpins his practical approach to surveying and consultancy. He is a prolific contributor to marine industry knowledge, authoring numerous technical articles on cargo survey, draught surveys, tanker operations, and maritime law topics.

Within Constellation Marine Services, Capt. Dadimaster leads the firm's cargo survey and cargo casualty investigation practice, and has personally supervised thousands of surveys on behalf of P&I clubs, insurers, shipowners, and commodity traders across the Middle East and Indian subcontinent.`,
    specializations: [
      'Cargo Survey',
      'Draft Survey',
      'Marine Warranty Survey',
      'P&I Survey',
      'Tanker Operations',
      'Rig Positioning',
      'Expert Consultancy',
    ],
    relatedServices: ['cargo-damage-survey', 'marine-warranty-survey', 'rig-positioning-moving', 'offshore-survey'],
  },
  {
    slug: 'jos-roy',
    name: 'Mr. Jos Roy',
    title: 'Marine Surveyor — Cargo & Commodity Specialist',
    photo: '/images/team/Jos-Roy.png',
    bio: `Mr. Jos Roy brings over 22 years of survey experience gained with a leading international inspection company in India, where he specialised in commodity and reefer cargo inspection. He has extensive expertise in the survey of minerals, ores, fertilisers, and bulk commodities, and has conducted thousands of pre-loading, condition, and discharge surveys across the Indian subcontinent and Middle East.

He trained as a cargo surveyor from the beginning of his career, with specialist training in commodity inspection, reefer cargo management, and cargo condition assessment. His methodical approach and deep commodity knowledge make him one of the most respected bulk cargo surveyors in the region.`,
    specializations: [
      'Bulk Cargo Survey',
      'Commodity Inspection',
      'Reefer Cargo Inspection',
      'Minerals & Ores Survey',
      'Fertiliser Inspection',
      'Pre-loading Survey',
    ],
    relatedServices: ['cargo-damage-survey'],
  },
  {
    slug: 'kd-shenoy',
    name: 'Lead Auditor K.D. Shenoy',
    title: 'Chartered Engineer — Insurance Surveyor & Loss Assessor',
    photo: '/images/team/Shenoy.png',
    bio: `K.D. Shenoy is a Chartered Engineer and licensed Insurance Surveyor & Loss Assessor, licensed by IRDA (Insurance Regulatory and Development Authority, Government of India) and approved and empanelled by all General Insurance Companies in India.

He is a Member of the Institution of Engineers India and the All India Institute of Surveyors, and brings deep expertise in marine cargo insurance assessment, cargo pre-loading surveys, and loss quantification. His technical background as a Chartered Engineer enables him to assess mechanical damage, structural failures, and technical losses with exceptional rigour.`,
    specializations: [
      'Insurance Survey & Loss Assessment',
      'Pre-loading Survey',
      'Cargo Insurance Assessment',
      'Mechanical Damage Assessment',
      'Loss Quantification',
      'ISM Audit',
    ],
    relatedServices: ['technical-due-diligence', 'cargo-damage-survey'],
  },
  {
    slug: 'alborze-irani',
    name: 'Chief Engr. Alborze Irani',
    title: 'Chief Engineer — Marine Engineer Surveyor',
    photo: '/images/team/Alborze-Irani.png',
    bio: `Chief Engineer Alborze Irani brings 39 years of hands-on marine engineering experience, including 27 years served as Chief Engineer on a wide range of vessel types. His current seafarer fitness certificates remain valid, reflecting his continued active engagement with the maritime engineering profession.

His expertise covers all aspects of marine propulsion and auxiliary machinery, including diesel engines of all types, gearboxes, shafting systems, propellers, steering gear, deck machinery, compressors, refrigeration plants, and HVAC systems. This comprehensive technical background makes him one of the most experienced machinery surveyors in the Constellation Marine network.`,
    specializations: [
      'Machinery Survey',
      'Pre-purchase Survey',
      'Engine Room Inspection',
      'Propulsion Systems',
      'Auxiliary Machinery',
      'Damage Assessment',
      'Condition Survey',
    ],
    relatedServices: ['hull-machinery-survey', 'technical-due-diligence'],
  },
  {
    slug: 'fahad-ansari',
    name: 'Engr. Fahad Ansari',
    title: 'Naval Architect & Marine Engineer',
    photo: '/images/team/Fahad-Ansari.png',
    bio: `Engr. Fahad Ansari is a graduate mechanical engineer who began his career as a marine structural engineer before specialising in naval architecture. With over 6 years of experience in the marine industry, he has developed expertise across marine structures, vessel conversions, new design calculations, and offshore engineering.

His naval architecture capabilities include stability calculations, structural analysis, and Marine Warranty Survey support for offshore structures, heavy lifts, and towage operations. He regularly provides engineering support for the firm's MWS team, conducting bollard pull assessments, lift plan reviews, and structural assessments for offshore projects.`,
    specializations: [
      'Naval Architecture',
      'Structural Analysis',
      'Marine Warranty Survey (Engineering)',
      'Heavy Lift Assessment',
      'Bollard Pull Assessment',
      'Vessel Conversion Design',
      'Offshore Engineering',
    ],
    relatedServices: ['marine-warranty-survey', 'offshore-survey', 'project-management'],
  },
  {
    slug: 'ouseph-joshi',
    name: 'Mr. Ouseph Joshi',
    title: 'Marine Surveyor — Bunker, Draft & Condition',
    photo: '/images/team/Ouseph-Joshi.png',
    bio: `Mr. Ouseph Joshi is an experienced independent marine surveyor specialising in tanker vessels, bulk carriers, and container inspection. His day-to-day surveying practice encompasses bunker surveys at berth and outer anchorage, draft surveys, cargo condition surveys, and on-hire/off-hire condition surveys.

He has built a reputation for meticulous attention to detail and rigorous documentation, qualities that are essential when survey reports form the basis of commercial or legal proceedings. He operates across the UAE ports — Abu Dhabi, Dubai, Fujairah — and is available on a 24/7 basis for urgent survey attendance.`,
    specializations: [
      'Bunker Survey',
      'Draft Survey',
      'Cargo Condition Survey',
      'On-hire / Off-hire Survey',
      'Tanker Inspection',
      'Container Inspection',
    ],
    relatedServices: ['cargo-damage-survey', 'hull-machinery-survey'],
  },
  {
    slug: 'mohammed-tarek',
    name: 'Mr. Mohammed Tarek',
    title: 'Marine Surveyor',
    photo: '/images/team/Mohammed-Tarek.png',
    bio: `Mr. Mohammed Tarek is a marine surveyor with a strong commitment to professional development and technical excellence. He thrives in challenging environments and brings a dedicated approach to every survey assignment.

His survey experience covers cargo inspection, condition surveys, and cargo handling supervision across ports in the UAE. He works closely with senior surveyors within the Constellation Marine team, contributing to the firm's survey operations in the Abu Dhabi and Dubai regions.`,
    specializations: [
      'Cargo Inspection',
      'Condition Survey',
      'Cargo Handling Supervision',
    ],
    relatedServices: ['cargo-damage-survey'],
  },
  {
    slug: 'sumanta-kumar-tarai',
    name: 'Mr. Sumanta Kumar Tarai',
    title: 'Marine Surveyor — 18 Years Experience',
    photo: '/images/team/Sumanta.png',
    bio: `Mr. Sumanta Kumar Tarai is a highly experienced marine surveyor with 18 years of independent surveying practice, primarily based in the Middle East. His specialist areas include bunker surveys, draft surveys, cargo condition surveys, and on-hire/off-hire surveys across all vessel types calling at UAE ports.

His bunker survey expertise covers all aspects of bunker quantity measurement and quality sampling, including surveys at berth and outer anchorage, ROB surveys, bunker supply surveys, and post-delivery quantity dispute investigations. He is empanelled by major P&I clubs and is regularly appointed to attend independent surveys on their behalf.`,
    specializations: [
      'Bunker Survey',
      'Draft Survey',
      'On-hire / Off-hire Survey',
      'ROB Survey',
      'Bunker Supply Survey',
      'P&I Survey',
    ],
    relatedServices: ['cargo-damage-survey'],
  },
  {
    slug: 'ramesh-krishnan',
    name: 'Engr. Ramesh Krishnan',
    title: 'Marine Engineer Surveyor',
    photo: '/images/team/Ramesh.png',
    bio: `Engr. Ramesh Krishnan is a marine engineer with broad surveying expertise spanning machinery inspection, safety officer duties on tankers, pollution prevention oversight, and tug surveys. He is authorised by TRAKHEES and the Dubai Maritime Authority to act as safety officer on non-conventional tankers operating in UAE ports.

His engineering background gives him a strong technical foundation for machinery surveys and damage assessments, while his operational experience in tanker cargo operations enables him to provide practical safety oversight and cargo handling guidance.`,
    specializations: [
      'Machinery Survey',
      'Safety Officer (Tankers)',
      'Pollution Prevention',
      'Tug Survey',
      'TRAKHEES Authorised',
      'Cargo Operations Supervision',
    ],
    relatedServices: ['hull-machinery-survey', 'ecmid-audits', 'cargo-damage-survey'],
  },
  {
    slug: 'george-joseph',
    name: 'Mr. George Joseph',
    title: 'Marine Surveyor',
    photo: '/images/team/George-Joseph.png',
    bio: `Mr. George Joseph is a marine surveyor based in the UAE with experience across a range of survey disciplines including cargo condition surveys, pre-loading inspections, and vessel condition assessments. He works across the UAE port network, providing reliable and professional survey services to Constellation Marine's clients in the region.`,
    specializations: [
      'Cargo Condition Survey',
      'Pre-loading Inspection',
      'Vessel Condition Assessment',
    ],
    relatedServices: ['cargo-damage-survey', 'technical-due-diligence'],
  },
  {
    slug: 'midhun',
    name: 'Mr. Midhun',
    title: 'Marine Surveyor',
    photo: '/images/team/Midhun.png',
    bio: `Mr. Midhun is a marine surveyor with Constellation Marine Services, contributing to the firm's survey operations across the UAE. He is experienced in cargo and vessel inspection work and brings a dedicated and professional approach to every assignment.`,
    specializations: [
      'Cargo Inspection',
      'Vessel Inspection',
    ],
    relatedServices: ['cargo-damage-survey'],
  },
  {
    slug: 'mohammed-farooq',
    name: 'Mr. Mohammed Farooq',
    title: 'Marine Surveyor',
    photo: '/images/team/Mohammed-Farooq.png',
    bio: `Mr. Mohammed Farooq is a marine surveyor based in the UAE with experience in cargo and vessel inspection across the region's major ports. He is a dedicated member of the Constellation Marine survey team, providing professional and reliable survey services to the firm's clients.`,
    specializations: [
      'Cargo Survey',
      'Vessel Inspection',
    ],
    relatedServices: ['cargo-damage-survey'],
  },
  {
    slug: 'vijayaprakash-muthusamy',
    name: 'Mr. Vijayaprakash Muthusamy',
    title: 'Marine Surveyor',
    photo: '/images/team/Vijayaprakash-Muthusamy.png',
    bio: `Mr. Vijayaprakash Muthusamy is a marine surveyor with Constellation Marine Services, providing survey and inspection services across UAE ports. He contributes to the firm's growing survey operations in the Middle East region.`,
    specializations: [
      'Marine Survey',
      'Cargo Inspection',
    ],
    relatedServices: ['cargo-damage-survey'],
  },
  {
    slug: 'lijin-krishna',
    name: 'Mr. Lijin Krishna',
    title: 'Marine Surveyor',
    photo: '/images/team/Lijin-Krishna.png',
    bio: `Mr. Lijin Krishna is a marine surveyor with Constellation Marine Services, supporting the firm's survey operations across the UAE. He brings a professional and thorough approach to all survey assignments.`,
    specializations: [
      'Marine Survey',
      'Cargo Inspection',
    ],
    relatedServices: ['cargo-damage-survey'],
  },
];

export function getTeamMember(slug: string): TeamMember | undefined {
  return teamMembers.find((m) => m.slug === slug);
}
