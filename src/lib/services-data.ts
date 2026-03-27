export interface ServicePage {
  slug: string;
  name: string;
  shortName: string;
  icon: string; // lucide-react icon name
  tagline: string;
  description: string;
  image: string;
  keyPoints: string[];
  details: string;
  relatedServices: string[]; // slugs
}

export const services: ServicePage[] = [
  {
    slug: 'marine-warranty-survey',
    name: 'Marine Warranty Survey',
    shortName: 'Marine Warranty Survey',
    icon: 'ShieldCheck',
    tagline: 'Independent warranty surveys for offshore operations, towage, and heavy transport',
    description: 'Marine Warranty Survey (MWS) is an independent review and approval service provided to marine insurers and their assured. Our MWS engineers and surveyors review engineering documentation, assess operational procedures, and provide on-site attendance to ensure that high-risk marine operations are conducted safely and in compliance with the insurer\'s requirements.',
    image: '/images/survey-inspections.jpg',
    keyPoints: [
      'Offshore structure load-out, tow, and installation approval',
      'Heavy lift plan review and on-site attendance',
      'Towage approval — short sea, coastal, and ocean tows',
      'Rig move documentation review and on-site MWS',
      'Subsea pipeline and cable laying approval',
      'Marine operations manual (MOM) review',
      'Metocean and weather window assessment',
      'FPSO and FSO installation warranty',
    ],
    details: `Marine Warranty Survey is one of Constellation Marine's core competencies. Since our establishment in 2007, we have provided MWS services for some of the most complex offshore operations in the Middle East, including major rig moves in the Arabian Gulf, heavy transport operations across the UAE and wider region, and offshore installation projects for major energy companies.

Our MWS team includes Certified Rig Move Masters, naval architects, and offshore engineers with first-hand experience in the operations they survey. This operational background gives our warranty surveyors the practical knowledge to identify genuine risks, as distinct from theoretical concerns, and to provide approval conditions that are workable in the field.

We are recognised by the major London and international marine insurance markets, including Lloyd's, and our MWS approvals are accepted by all major marine warranty insurance underwriters.

Constellation Marine's MWS services cover the full spectrum of offshore operations, from single-vessel towage to multi-vessel offshore construction campaigns. Our surveyors are available 24/7 and can mobilise rapidly to any location within our global network.`,
    relatedServices: ['rig-positioning-moving', 'project-management', 'technical-due-diligence'],
  },
  {
    slug: 'rig-positioning-moving',
    name: 'Rig Positioning & Moving',
    shortName: 'Rig Positioning & Moving',
    icon: 'Anchor',
    tagline: 'Expert rig move masters and positioning surveyors for safe, efficient rig relocations',
    description: 'Constellation Marine Services provides experienced and certified Rig Move Masters and rig positioning surveyors for mobile drilling unit (MODU) relocations worldwide. Our rig move specialists bring decades of first-hand operational experience, combined with the independent oversight required by rig move insurers and operators.',
    image: '/images/marine-operations.jpg',
    keyPoints: [
      'Certified Rig Move Masters for MODU relocations',
      'Jack-up rig positioning and pre-load supervision',
      'Semi-submersible anchoring and positioning',
      'Rig move procedure development and review',
      'Pre-tow inspection and approval',
      'On-site attendance throughout rig move operations',
      'Post-move survey and documentation',
      'Emergency rig move support',
    ],
    details: `Mobile offshore drilling units (MODUs) — including jack-up rigs, semi-submersibles, and drillships — are among the most complex and valuable assets in the offshore industry. Their relocation is a high-risk operation that requires meticulous planning, experienced supervision, and independent oversight.

Constellation Marine's rig move team is led by Capt. Zarir Irani, a Certified Rig Move Master with extensive experience in major rig moves throughout the Middle East, including operations in the Arabian Gulf, Red Sea, and Indian Ocean.

Our rig move services encompass the full scope of a MODU relocation — from pre-move planning and documentation review through to post-move survey at the new location. We work closely with rig operators, towing companies, and insurers to ensure that every rig move is conducted safely, efficiently, and in full compliance with the applicable procedures and insurance requirements.

For jack-up rigs, our positioning specialists supervise the leg-lowering and pre-loading operations at the new location, verifying soil penetration against the approved pre-load plan and confirming the rig's foundation condition.`,
    relatedServices: ['marine-warranty-survey', 'project-management', 'technical-due-diligence'],
  },
  {
    slug: 'cargo-damage-survey',
    name: 'Cargo & Damage Survey',
    shortName: 'Cargo & Damage Survey',
    icon: 'Package',
    tagline: 'Independent cargo condition surveys, pre-loading inspections, and damage assessments',
    description: 'Constellation Marine provides a comprehensive range of cargo survey services for cargo owners, carriers, P&I clubs, and insurers. From pre-loading condition surveys through to discharge surveys and cargo damage assessments, our surveyors provide independent, accurate, and thoroughly documented survey reports.',
    image: '/images/damage-containers.jpg',
    keyPoints: [
      'Pre-loading condition surveys',
      'Draft surveys for bulk cargo',
      'On-hire and off-hire cargo surveys',
      'Cargo damage assessment and cause investigation',
      'Reefer cargo inspection and temperature monitoring',
      'Container surveys — dry, reefer, and tank',
      'Bunker surveys — quantity and quality',
      'Dangerous goods inspection and compliance',
    ],
    details: `Cargo survey is one of the most important risk management tools available to cargo owners, carriers, and their insurers. An independent, professionally conducted cargo survey provides an accurate record of the cargo's condition at a specific point in time, which is essential for preventing and resolving cargo claims.

Constellation Marine's cargo survey team has conducted thousands of surveys on behalf of all 1,316 P&I club groups and many of the world's leading cargo insurers. Our surveyors have deep experience across all types of cargo — from bulk commodities such as minerals and grains, through to high-value general cargo, project cargo, and dangerous goods.

Our bulk cargo survey capability is particularly strong. We regularly conduct draft surveys for major commodity traders and ship operators in the Arabian Gulf, providing accurate and reliable cargo quantity determinations that are accepted by all parties.

For cargo damage cases, our surveyors attend promptly — 24/7 — to inspect and document damaged cargo before evidence is lost or compromised. Our damage survey reports provide a sound basis for claims assessment and, where appropriate, for claims defence.`,
    relatedServices: ['marine-casualties', 'project-management', 'marine-warranty-survey'],
  },
  {
    slug: 'marine-casualties',
    name: 'Marine Casualties',
    shortName: 'Marine Casualties',
    icon: 'AlertTriangle',
    tagline: 'Rapid response casualty investigation for collisions, groundings, fires and structural failures',
    description: 'When a maritime casualty occurs — a collision, grounding, fire, explosion, structural failure, or environmental incident — rapid, professional response is essential. Constellation Marine Services provides an immediate casualty investigation and survey service, available 24/7, with surveyors ready to mobilise to any location within our global network.',
    image: '/images/marine-casualties.jpg',
    keyPoints: [
      '24/7 casualty response across all office locations',
      'Collision and allision investigation',
      'Grounding and stranding investigation',
      'Fire and explosion investigation',
      'Hull and machinery damage survey',
      'Structural failure investigation',
      'Evidence preservation and documentation',
      'P&I club, hull underwriter, and shipowner representation',
    ],
    details: `Marine casualties are, by their nature, unexpected and time-critical. The quality of the evidence collected in the immediate aftermath of a casualty can be the decisive factor in determining liability and in the efficient resolution of claims. This is why Constellation Marine Services maintains a 24/7 rapid response capability, with surveyors available at all our offices ready to mobilise at short notice.

Our casualty investigation team is led by Capt. John Noble, who has attended more than 60 major maritime casualties during his career, and Capt. Zarir Irani, whose extensive experience includes major energy claim investigations in the Middle East.

For collision and allision cases, our surveyors attend both vessels immediately, conducting a thorough inspection of hull damage, reviewing bridge records and voyage data recorder (VDR) data, and interviewing officers and crew before recollections fade. For grounding cases, we assess hull damage, review navigational records, and evaluate the adequacy of passage planning and watchkeeping.

Our casualty investigation reports are of the standard required for use in arbitration and court proceedings, and our surveyors have extensive experience in providing expert witness evidence in maritime legal proceedings.`,
    relatedServices: ['cargo-damage-survey', 'technical-due-diligence', 'dispute-litigation'],
  },
  {
    slug: 'project-management',
    name: 'Project Management',
    shortName: 'Project Management',
    icon: 'Settings',
    tagline: 'Offshore and marine project management from planning through to delivery',
    description: 'Constellation Marine Services provides experienced project management support for offshore and marine construction projects, including load-out and installation projects, offshore pipeline and cable laying, decommissioning, and complex cargo logistics. Our project managers bring first-hand operational experience to every project.',
    image: '/images/img_1.jpg',
    keyPoints: [
      'Offshore installation project management',
      'Load-out planning and supervision',
      'FPSO / FSO conversion project management',
      'Decommissioning project management',
      'Marine operations planning',
      'Contractor selection and management',
      'HSEQ management and audit',
      'Regulatory compliance and documentation',
    ],
    details: `Effective project management in the offshore and marine industries requires a unique combination of technical expertise, operational experience, and commercial acumen. Constellation Marine's project managers bring decades of first-hand experience in the operations they manage, enabling them to anticipate and address challenges proactively rather than reactively.

Our project management services cover the full project lifecycle, from initial feasibility assessment and scope definition through to execution management and post-project review. We have managed projects across the full spectrum of offshore and marine operations, including offshore platform installation, pipeline laying, FPSO conversion and hook-up, and offshore decommissioning.

A key strength of Constellation Marine's project management offering is our integrated approach to HSE (Health, Safety, and Environment) management. Our project managers are deeply experienced in offshore HSE requirements, and bring a rigorous safety culture to every project they manage.

We work closely with operators, contractors, and regulatory authorities to ensure that every project is delivered safely, on time, and within budget, while fully complying with all applicable regulatory requirements.`,
    relatedServices: ['marine-warranty-survey', 'rig-positioning-moving', 'technical-due-diligence'],
  },
  {
    slug: 'technical-due-diligence',
    name: 'Technical Due Diligence',
    shortName: 'Technical Due Diligence',
    icon: 'ClipboardCheck',
    tagline: 'Independent technical assessment of vessels, offshore assets and marine businesses',
    description: 'Constellation Marine provides independent technical due diligence services for vessel acquisitions, asset sales, mergers and acquisitions involving shipping and offshore companies, and the financing of marine assets. Our assessments provide buyers, lenders, and investors with an accurate, independent picture of the technical condition and regulatory status of the assets they are considering.',
    image: '/images/third-party.jpg',
    keyPoints: [
      'Pre-purchase vessel survey',
      'Asset condition assessment',
      'Regulatory compliance review',
      'Flag state certificate verification',
      'Class record review',
      'Operational and maintenance record review',
      'Offshore facility assessment',
      'Marine business technical assessment',
    ],
    details: `Technical due diligence is an essential component of any significant marine asset transaction. Whether buying a vessel, investing in a shipping company, or financing a fleet, an accurate and independent assessment of the technical condition and regulatory compliance of the assets involved is fundamental to sound commercial decision-making.

Constellation Marine's technical due diligence team brings together a multi-disciplinary group of surveyors, engineers, and marine consultants who can assess all aspects of a vessel or offshore facility — from hull and machinery condition through to safety management system compliance and environmental performance.

For pre-purchase vessel surveys, we conduct a thorough physical inspection of the vessel, review the class record and survey history, verify the currency of all certificates and documents, and assess the vessel's maintenance condition. Our survey reports provide a clear and objective assessment of the vessel's condition, highlighting any areas of concern that may affect the purchase price or require early attention after acquisition.

For offshore facility assessments, we draw on the specialist expertise within our team — including MODU specialists, pipeline engineers, and offshore structural engineers — to provide a comprehensive technical assessment of the facility's condition and remaining life.`,
    relatedServices: ['marine-warranty-survey', 'project-management', 'marine-casualties'],
  },
  {
    slug: 'ecmid-audits',
    name: 'eCMID Audits',
    shortName: 'eCMID Audits',
    icon: 'FileText',
    tagline: 'Electronic Chemical Marine Investigation Diagnostics audits for chemical tankers',
    description: 'The electronic Chemical Marine Investigation Diagnostics (eCMID) system is the standard inspection tool for chemical tankers, used by chemical companies worldwide to assess and record the condition of chemical tankers before chartering them. Constellation Marine provides eCMID audit services conducted by accredited inspectors with extensive chemical tanker experience.',
    image: '/images/survey-inspections.jpg',
    keyPoints: [
      'Full eCMID vessel inspections by accredited inspectors',
      'Pre-vetting inspection preparation',
      'Chemical tanker condition assessment',
      'Cargo handling system inspection',
      'Inert gas and vapour control system verification',
      'Safety management system review',
      'Tank cleaning procedure assessment',
      'Crew competency and training verification',
    ],
    details: `The eCMID (electronic Chemical Marine Investigation Diagnostics) system was developed by the Chemical Distribution Institute (CDI) and is used by the chemical industry's major shippers and traders to assess chemical tankers before they are chartered for the carriage of chemicals.

An eCMID inspection covers all aspects of chemical tanker management, from the physical condition of cargo tanks and piping systems through to crew training, safety management, and emergency preparedness. The inspection results are uploaded to the CDI database, where they are accessible to subscribing chemical companies for use in their tanker vetting process.

Constellation Marine's eCMID auditors are accredited by CDI and have extensive experience in chemical tanker operations. Our auditors approach every inspection with rigour and objectivity, providing an honest assessment of the vessel's condition that serves the interests of both the vessel operator and the chemical shippers who rely on the eCMID database.

We also provide pre-vetting services to help chemical tanker operators prepare for eCMID inspections, identifying and addressing deficiencies before the formal inspection so that the vessel presents its best possible picture to the CDI inspector.`,
    relatedServices: ['marine-warranty-survey', 'technical-due-diligence', 'marine-casualties'],
  },
  {
    slug: 'dispute-litigation',
    name: 'Dispute & Litigation Support',
    shortName: 'Dispute & Litigation',
    icon: 'Scale',
    tagline: 'Expert technical support for maritime disputes, arbitration and legal proceedings',
    description: 'Constellation Marine Services provides expert technical support and expert witness services for maritime disputes and legal proceedings, including P&I claims, hull and machinery disputes, cargo claims, charter party disputes, and casualty investigations. Our expert witnesses combine deep technical knowledge with extensive experience in presenting complex technical evidence.',
    image: '/images/dispute-litigation.jpg',
    keyPoints: [
      'Expert witness services in maritime arbitration',
      'P&I claim investigation and support',
      'Hull and machinery dispute assessment',
      'Cargo claim technical investigation',
      'Charter party dispute technical advice',
      'Bunker quality and quantity dispute assessment',
      'Collision and grounding reconstruction',
      'Technical report preparation for legal proceedings',
    ],
    details: `Maritime disputes involve complex technical issues that require expert evidence presented clearly and persuasively. Constellation Marine's expert witnesses have appeared in London arbitration, the English High Court, and other jurisdictions worldwide, providing technical evidence on a wide range of maritime subjects.

Our expert witnesses maintain strict independence, providing their honest expert opinion irrespective of which party has retained them. This commitment to independence is essential for credibility in legal and arbitration proceedings, and our experts are widely recognised for their objectivity and the quality of their reports.

Capt. John Noble, Capt. Zarir Irani, and Capt. Vispy Rusi Dadimaster each have extensive experience in maritime legal and arbitration proceedings. They have provided expert evidence in high-value disputes involving major P&I clubs, hull underwriters, and cargo insurers, and their reports have been accepted in proceedings in multiple jurisdictions.

Our dispute support services extend beyond expert witness testimony to include pre-proceedings technical assessment and advice, evidence collection and preservation, and technical advisory support to legal counsel throughout the proceedings.`,
    relatedServices: ['marine-casualties', 'cargo-damage-survey', 'technical-due-diligence'],
  },
  {
    slug: 'offshore-survey',
    name: 'Offshore Survey',
    shortName: 'Offshore Survey',
    icon: 'Waves',
    tagline: 'Comprehensive offshore inspection services for FPSOs, platforms, and subsea assets',
    description: 'Constellation Marine provides specialist offshore survey services for floating production, storage, and offloading (FPSO) vessels, fixed and floating offshore platforms, subsea structures, and offshore mooring systems. Our offshore surveyors combine marine surveying expertise with specific offshore industry knowledge.',
    image: '/images/marine-operations.jpg',
    keyPoints: [
      'FPSO and FSO survey and inspection',
      'Offshore platform structural survey',
      'Mooring system inspection',
      'Subsea inspection support',
      'Marine riser inspection',
      'Topside module survey',
      'Offshore construction survey',
      'Decommissioning survey',
    ],
    details: `The offshore oil and gas industry operates some of the world's most complex and valuable assets — from giant FPSO vessels carrying processing facilities that would fill a small refinery, to fixed platforms standing in hundreds of metres of water, to subsea manifolds lying on the seabed kilometres below the surface.

Surveying these assets requires specialist knowledge and experience that goes beyond the competence of a general marine surveyor. Constellation Marine's offshore survey team has accumulated this specialist knowledge through years of direct involvement in offshore construction, installation, and operations projects in the Middle East and worldwide.

Our offshore survey services cover the full lifecycle of offshore assets — from initial design review and pre-installation surveys, through regular in-service inspections, to decommissioning assessment. We work with offshore operators, engineering contractors, and insurers to provide the independent technical oversight that is essential for the safe and efficient operation of offshore assets.

For FPSO and FSO vessels — which combine the characteristics of a ship with the complexity of a production facility — our survey teams include both marine surveyors and process engineers, enabling us to assess both the marine and process aspects of the facility in a single integrated survey.`,
    relatedServices: ['marine-warranty-survey', 'project-management', 'technical-due-diligence'],
  },
  {
    slug: 'hull-machinery-survey',
    name: 'Hull & Machinery Survey',
    shortName: 'Hull & Machinery',
    icon: 'Wrench',
    tagline: 'Comprehensive hull and machinery surveys for all vessel types',
    description: 'Constellation Marine provides independent hull and machinery surveys for all types of merchant ships, offshore vessels, and specialised craft. Whether for pre-purchase assessment, condition survey, damage assessment, or class survey support, our surveyors provide thorough and accurate survey reports.',
    image: '/images/img_1.jpg',
    keyPoints: [
      'Pre-purchase hull and machinery survey',
      'Annual and special survey support',
      'Hull damage assessment and repair supervision',
      'Dry-dock survey attendance',
      'Underwater hull inspection',
      'Engine room condition survey',
      'Propulsion and steering system assessment',
      'Seaworthiness certification',
    ],
    details: `Hull and machinery surveys are fundamental to safe vessel operations, regulatory compliance, and sound commercial decision-making. An accurate, independent assessment of a vessel's hull condition and machinery status is essential whether the survey is for pre-purchase assessment, insurance renewal, charter party compliance, or flag state certification.

Constellation Marine's hull and machinery surveyors bring extensive sea-going and surveying experience to every assignment. Our team includes former merchant navy officers and marine engineers who understand vessel operations from the inside out, enabling them to identify conditions that might not be apparent from a purely technical perspective.

Our hull and machinery survey services are available across all our office locations, giving our clients access to experienced local surveyors at short notice. For major surveys — such as pre-purchase surveys of high-value vessels or complex offshore units — we can deploy multi-disciplinary teams combining marine surveyors, engineers, and specialist inspectors.

All our survey reports are prepared to a consistent high standard, with clear and concise descriptions of findings, photographic documentation of any defects, and practical recommendations for remedial action where required.`,
    relatedServices: ['technical-due-diligence', 'marine-casualties', 'cargo-damage-survey'],
  },
];

export function getService(slug: string): ServicePage | undefined {
  return services.find((s) => s.slug === slug);
}

export function getRelatedServices(slug: string): ServicePage[] {
  const service = getService(slug);
  if (!service) return [];
  return service.relatedServices
    .map((s) => getService(s))
    .filter(Boolean) as ServicePage[];
}
