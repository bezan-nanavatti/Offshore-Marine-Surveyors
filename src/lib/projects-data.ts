export type ProjectCategory =
  | 'mws'
  | 'rig-move'
  | 'casualty'
  | 'cargo'
  | 'offshore'
  | 'due-diligence';

export interface KeyFact {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  category: ProjectCategory;
  categoryLabel: string;
  region: string;
  year: number;
  asset: string;
  client: string;
  summary: string;
  image: string;
  body: string;
  keyFacts: KeyFact[];
  relatedService: string;
}

export const projectCategoryLabels: Record<ProjectCategory, string> = {
  mws: 'Marine Warranty Survey',
  'rig-move': 'Rig Positioning & Moving',
  casualty: 'Marine Casualties',
  cargo: 'Cargo & Damage Survey',
  offshore: 'Offshore Survey',
  'due-diligence': 'Technical Due Diligence',
};

export const projects: Project[] = [
  {
    slug: 'jackup-rig-relocation-arabian-gulf-2023',
    title: 'Jack-up Rig Relocation — Arabian Gulf',
    category: 'rig-move',
    categoryLabel: projectCategoryLabels['rig-move'],
    region: 'Arabian Gulf',
    year: 2023,
    asset: 'Self-elevating jack-up drilling unit',
    client: 'Major UAE Operator (Confidential)',
    summary:
      'Full Certified Rig Move Master services for the relocation of a self-elevating jack-up drilling unit between two shallow-water locations in the Arabian Gulf, including pre-tow inspection, towage supervision, and jack-down verification at the new location.',
    image: '/images/marine-operations.jpg',
    keyFacts: [
      { label: 'Asset Type', value: 'Jack-up MODU' },
      { label: 'Water Depth', value: '32 m' },
      { label: 'Tow Distance', value: 'Approx. 85 nm' },
      { label: 'Region', value: 'Arabian Gulf' },
      { label: 'Year', value: '2023' },
      { label: 'Scope', value: 'Full Rig Move Master attendance' },
    ],
    body: `Constellation Marine Services was appointed by a major UAE offshore operator to provide full Certified Rig Move Master (RMM) services for the relocation of a self-elevating jack-up drilling unit in the Arabian Gulf. The operation involved moving the unit approximately 85 nautical miles between two shallow-water drilling locations.

The pre-move phase commenced with a comprehensive pre-tow inspection of the jack-up unit, reviewing the structural condition of the legs, jacking system, hull, and all towing points. The towage equipment — including tow lines, shackles, and bridles — was inspected and certified to be in satisfactory condition for the planned operation. The rig move procedure documentation, including the Marine Operations Manual (MOM), emergency response plan, and weather criteria, were reviewed and approved by our RMM prior to commencement.

Towage was conducted using two anchor handling tugs, with our RMM embarked on the lead tug throughout the operation. Metocean conditions were monitored in real time against the approved weather window criteria. The tow was completed without incident within the approved environmental parameters.

On arrival at the new location, our RMM supervised the pre-load operations, verifying leg penetration against the approved pre-load plan and confirming adequate foundation conditions prior to declaring the unit safe to drill. A comprehensive post-move survey was completed and a full report issued to the operator and their insurers.`,
    relatedService: 'rig-positioning-moving',
  },
  {
    slug: 'collision-investigation-strait-of-hormuz-2022',
    title: 'Vessel Collision Investigation — Strait of Hormuz',
    category: 'casualty',
    categoryLabel: projectCategoryLabels.casualty,
    region: 'Strait of Hormuz',
    year: 2022,
    asset: 'Chemical tanker and product tanker',
    client: 'International P&I Club (Confidential)',
    summary:
      'Rapid-response collision investigation for a P&I club following a contact between a chemical tanker and a laden product tanker in the Traffic Separation Scheme at the Strait of Hormuz, involving VDR analysis, hull damage survey, and causation assessment.',
    image: '/images/marine-casualties.jpg',
    keyFacts: [
      { label: 'Vessel Types', value: 'Chemical tanker / Product tanker' },
      { label: 'Location', value: 'Strait of Hormuz TSS' },
      { label: 'Response Time', value: 'On-site within 4 hours' },
      { label: 'Year', value: '2022' },
      { label: 'Scope', value: 'Causation, damage, VDR analysis' },
      { label: 'Client', value: 'P&I Club (Confidential)' },
    ],
    body: `Constellation Marine Services was instructed by an international P&I club on a 24-hour emergency basis following a collision between a chemical tanker and a laden product tanker in the Traffic Separation Scheme at the Strait of Hormuz. Both vessels sustained hull damage and the product tanker reported ingress in a void space. Our Dubai-based surveyor was on-site within four hours of the initial call.

The immediate priorities were to assess the structural integrity of both vessels, document the damage, and preserve evidence before any repairs were commenced. Our surveyor conducted a thorough inspection of the contact damage on both hulls, recording the location, nature, and extent of the damage with detailed photographic and written documentation.

Working in conjunction with the vessel's masters and officers, our surveyor reviewed bridge records, ARPA recordings, VHF communications logs, and the voyage data recorder (VDR) data from both vessels. This analysis formed the basis of a preliminary causation assessment identifying the sequence of events leading to the collision.

The investigation report prepared by Constellation Marine was used by the P&I club's legal advisers in pre-arbitration settlement negotiations. Our surveyor was available to provide expert evidence in any subsequent legal proceedings, though the matter was resolved without the need for formal arbitration.`,
    relatedService: 'marine-casualties',
  },
  {
    slug: 'heavy-lift-mws-offshore-module-abu-dhabi-2023',
    title: 'Offshore Module Heavy Lift MWS — Abu Dhabi',
    category: 'mws',
    categoryLabel: projectCategoryLabels.mws,
    region: 'Abu Dhabi, UAE',
    year: 2023,
    asset: 'Process module — 1,850 MT gross',
    client: 'EPC Contractor / Marine Insurer (Confidential)',
    summary:
      'Marine Warranty Survey for the load-out and installation of a 1,850 MT offshore process module at an Abu Dhabi offshore platform, covering engineering review, lift plan approval, and on-site attendance during the lift and installation operations.',
    image: '/images/survey-inspections.jpg',
    keyFacts: [
      { label: 'Lift Weight', value: '1,850 MT (gross)' },
      { label: 'Asset', value: 'Offshore process module' },
      { label: 'Location', value: 'Abu Dhabi, UAE' },
      { label: 'Year', value: '2023' },
      { label: 'Scope', value: 'Engineering review, approval & on-site MWS' },
      { label: 'Crane Vessel', value: 'Semi-submersible crane vessel (SSCV)' },
    ],
    body: `Constellation Marine Services was appointed by the marine insurer to provide Marine Warranty Survey services for the load-out, transport, and offshore installation of a 1,850 MT gross process module at an Abu Dhabi offshore platform. The module was fabricated at an onshore yard and installed onto the platform topside using a semi-submersible crane vessel (SSCV).

The pre-operation engineering review phase involved a detailed examination of all lift engineering documentation, including the rigging arrangement, lifting sling calculations, CoG and stability analysis, and the crane vessel's load charts. Our naval architect reviewed the transport vessel's stowage plan, sea-fastening calculations, and weather routing criteria. Where gaps or inconsistencies were identified in the engineering documentation, our team issued technical queries (TQs) and reviewed the contractor's responses before issuing conditional approval.

On-site attendance was provided throughout the load-out at the fabrication yard, with our surveyor witnessing the attachment of rigging gear, confirming sling and shackle SWLs, and verifying that all lifting points were fabricated in accordance with the approved drawings. A pre-lift safety briefing was attended and all pre-lift checks recorded.

The offshore installation was completed within the approved weather window. Our surveyor attended on the SSCV throughout the lift and installation operation, confirming that the operation was conducted in compliance with the approved Marine Operations Manual and within the metocean limits specified in the insurance approval. A post-installation report was issued to the insurer confirming satisfactory completion of the warranted operation.`,
    relatedService: 'marine-warranty-survey',
  },
  {
    slug: 'fpso-prepurchase-survey-2022',
    title: 'FPSO Pre-purchase Technical Survey',
    category: 'due-diligence',
    categoryLabel: projectCategoryLabels['due-diligence'],
    region: 'West Africa / UAE',
    year: 2022,
    asset: 'Floating Production, Storage and Offloading vessel',
    client: 'Regional Energy Investor (Confidential)',
    summary:
      'Comprehensive technical due diligence survey of an FPSO vessel on behalf of a regional energy investor considering acquisition, covering marine condition, topside process systems, class records, flag state certificates, and structural integrity.',
    image: '/images/third-party.jpg',
    keyFacts: [
      { label: 'Asset Type', value: 'FPSO — 250,000 DWT' },
      { label: 'Build Year', value: '2004' },
      { label: 'Inspection Location', value: 'West Africa' },
      { label: 'Year', value: '2022' },
      { label: 'Team', value: 'Marine surveyor + process engineer' },
      { label: 'Scope', value: 'Full technical due diligence' },
    ],
    body: `Constellation Marine Services was engaged by a regional energy investor to conduct a comprehensive technical due diligence assessment of a 250,000 DWT FPSO vessel prior to a potential acquisition. The vessel had been operating on a West African deepwater field since 2004. The assessment was required to give the investor an independent view of the technical condition, regulatory status, and remaining service life of the asset.

A multi-disciplinary team comprising a senior marine surveyor and a topside process engineer was deployed to the vessel's location in West Africa. The marine survey team conducted a thorough inspection of the hull, mooring system, living quarters, marine systems, propulsion, anchoring equipment, and safety systems. The process engineering team assessed the oil and gas processing systems, utility systems, chemical injection facilities, and flare and gas compression equipment.

In parallel, our team conducted a comprehensive review of all class and flag state documentation, including the vessel's class record, survey status report, outstanding class conditions, and the currency of all statutory certificates. The vessel's maintenance management system (MMS) records were reviewed for evidence of deferred maintenance and outstanding work orders that might affect the asset's value or operability.

The resulting due diligence report provided our client with a clear, independent assessment of the FPSO's physical condition and regulatory status, a prioritised list of remedial items requiring attention prior to or immediately after acquisition, and an independent opinion on the vessel's fitness for continued service in its intended role.`,
    relatedService: 'technical-due-diligence',
  },
  {
    slug: 'bulk-cargo-claim-investigation-fujairah-2023',
    title: 'Bulk Cargo Damage Claim — Port of Fujairah',
    category: 'cargo',
    categoryLabel: projectCategoryLabels.cargo,
    region: 'Fujairah, UAE',
    year: 2023,
    asset: 'Bulk carrier — iron ore cargo',
    client: 'Cargo Insurer (Confidential)',
    summary:
      'Investigation of a cargo damage claim involving wetting and contamination of an iron ore cargo carried on a Handymax bulk carrier, including pre-discharge survey, sample collection, quantity determination, and cause investigation.',
    image: '/images/damage-containers.jpg',
    keyFacts: [
      { label: 'Cargo', value: 'Iron ore — 38,500 MT' },
      { label: 'Vessel Type', value: 'Handymax bulk carrier' },
      { label: 'Port', value: 'Port of Fujairah, UAE' },
      { label: 'Year', value: '2023' },
      { label: 'Scope', value: 'Damage survey, sampling, quantity determination' },
      { label: 'Client', value: 'Cargo Insurer (Confidential)' },
    ],
    body: `Constellation Marine Services was appointed by a cargo insurer to attend Port of Fujairah and investigate a cargo damage claim arising from the discharge of an iron ore cargo from a Handymax bulk carrier. The receiver had reported wetting and contamination across multiple cargo holds on a shipment of approximately 38,500 MT of iron ore loaded at an Indian port.

Our surveyors attended the vessel immediately on arrival and conducted a comprehensive pre-discharge inspection. Each cargo hold was entered and inspected, with the distribution and extent of wetted and contaminated cargo mapped and photographed systematically. Samples of the affected cargo were collected for laboratory analysis, alongside control samples of apparently sound cargo for comparison.

A draft survey was conducted at arrival to establish the vessel's actual displacement and provide an independent quantity determination for the total cargo on board. This was compared against the bill of lading quantity and the shipper's weight certificates. Hold condition — bilge systems, hatch covers, and weather-tightness — was also assessed as part of the causation investigation.

The investigation identified that hatch cover seal deterioration on two cargo holds had allowed seawater ingress during a period of adverse weather encountered during the voyage. Our detailed report, supported by laboratory analysis of the cargo samples and meteorological records for the voyage, provided the cargo insurer with a clear basis for assessing the claim and determining carrier liability. The total affected quantity was independently established at 4,200 MT.`,
    relatedService: 'cargo-damage-survey',
  },
  {
    slug: 'offshore-platform-towage-mws-arabian-gulf-2021',
    title: 'Offshore Platform Tow & Installation MWS — Arabian Gulf',
    category: 'mws',
    categoryLabel: projectCategoryLabels.mws,
    region: 'Arabian Gulf',
    year: 2021,
    asset: 'Unmanned wellhead platform — jacket and topsides',
    client: 'National Oil Company / Marine Insurer (Confidential)',
    summary:
      'Marine Warranty Survey services for the fabrication yard load-out, wet tow, and offshore installation of an unmanned wellhead platform jacket and integrated topsides in the Arabian Gulf, including full engineering review and on-site attendance.',
    image: '/images/img_1.jpg',
    keyFacts: [
      { label: 'Asset', value: 'Wellhead platform jacket + topsides' },
      { label: 'Jacket Weight', value: '3,200 MT' },
      { label: 'Tow Distance', value: 'Approx. 140 nm' },
      { label: 'Water Depth', value: '28 m' },
      { label: 'Year', value: '2021' },
      { label: 'Scope', value: 'Load-out, tow, installation MWS' },
    ],
    body: `Constellation Marine Services was engaged by the marine insurer to provide Marine Warranty Survey services for the complete offshore installation scope of an unmanned wellhead platform in the Arabian Gulf. The scope covered the load-out of the jacket structure from a UAE fabrication yard, wet tow to the offshore location approximately 140 nautical miles distant, and offshore installation using a derrick barge, followed by topside installation and hook-up.

The engineering review phase covered the full suite of offshore installation engineering documentation, including structural load-out analyses, towage stability calculations, tow approval documentation, and installation analyses for jacket upending and pile driving. The quality and completeness of the engineering documentation was assessed, and technical queries were issued to the EPCI contractor to address identified deficiencies before approval was granted.

Our surveyor witnessed load-out at the fabrication yard, confirming the structural condition of the jacket, the integrity of the sea-fastening arrangements, and satisfactory completion of all pre-tow checks. Towage was approved following a final meteorological assessment confirming conditions within the approved weather window.

At the offshore installation site, our surveyor attended on the derrick barge throughout the jacket upending, set-down, and pile-driving operations, verifying that each phase of the installation was conducted in accordance with the approved Marine Operations Manual. On completion of all pile driving and grouting, a satisfactory installation certificate was issued to the insurer and the operator.`,
    relatedService: 'marine-warranty-survey',
  },
  {
    slug: 'container-vessel-grounding-red-sea-2022',
    title: 'Container Vessel Grounding Investigation — Red Sea',
    category: 'casualty',
    categoryLabel: projectCategoryLabels.casualty,
    region: 'Red Sea',
    year: 2022,
    asset: '2,500 TEU container vessel',
    client: 'Hull Underwriter (Confidential)',
    summary:
      'Investigation of a grounding casualty involving a 2,500 TEU container vessel in the Red Sea, covering hull damage survey, navigation record review, passage planning assessment, and quantification of bottom damage for underwriting purposes.',
    image: '/images/marine-casualties.jpg',
    keyFacts: [
      { label: 'Vessel Type', value: '2,500 TEU container vessel' },
      { label: 'Location', value: 'Red Sea' },
      { label: 'Year', value: '2022' },
      { label: 'Damage', value: 'Bottom damage — multiple tank penetrations' },
      { label: 'Scope', value: 'Damage survey, navigation investigation' },
      { label: 'Client', value: 'Hull Underwriter (Confidential)' },
    ],
    body: `Following the grounding of a 2,500 TEU container vessel on a shoal in the Red Sea, Constellation Marine Services was appointed by the vessel's hull underwriter to conduct an independent investigation and damage survey. The vessel had refloated under her own power after approximately six hours aground and proceeded to the nearest port under pilotage for inspection and emergency repairs.

Our surveyor boarded the vessel at the port of refuge and conducted an immediate inspection of the damage. The grounding had caused penetration of the outer bottom shell plating in four locations, with consequential flooding of two double-bottom fuel tanks and one ballast tank. The extent and location of all damage was recorded with detailed measurements and photographic documentation, and an underwater survey was arranged to supplement the internal inspection.

The navigation investigation involved a detailed review of the vessel's passage planning documentation, ECDIS records, watch records, and automatic identification system (AIS) data. A reconstruction of the vessel's movements in the hours prior to the grounding was prepared, and the passage planning and execution was evaluated against the requirements of the relevant ISM procedures and industry standards.

The investigation identified that the grounding had resulted from an uncorrected chart datum error in the vessel's ECDIS database that caused the displayed safety contour to be inaccurate in the area of the shoal. The hull underwriter's claim assessment was supported by our detailed repair cost analysis, which drew on competitive quotations obtained from UAE and regional ship repair facilities.`,
    relatedService: 'marine-casualties',
  },
  {
    slug: 'semisubmersible-ocean-tow-mws-2023',
    title: 'Semi-submersible Ocean Tow MWS — Indian Ocean',
    category: 'mws',
    categoryLabel: projectCategoryLabels.mws,
    region: 'Indian Ocean',
    year: 2023,
    asset: 'Semi-submersible drilling unit',
    client: 'Marine Insurer / Rig Owner (Confidential)',
    summary:
      'Marine Warranty Survey for an ocean tow of a semi-submersible drilling unit from the Arabian Gulf to Southeast Asia, covering full engineering review, meteorological assessment, pre-tow inspection, and continuous voyage monitoring throughout a 22-day transit.',
    image: '/images/marine-operations.jpg',
    keyFacts: [
      { label: 'Asset', value: 'Semi-submersible drilling unit' },
      { label: 'Tow Route', value: 'Arabian Gulf to SE Asia' },
      { label: 'Tow Duration', value: '22 days' },
      { label: 'Tow Distance', value: 'Approx. 3,800 nm' },
      { label: 'Year', value: '2023' },
      { label: 'Scope', value: 'Full MWS — engineering, pre-tow, voyage monitoring' },
    ],
    body: `Constellation Marine Services was appointed by the marine insurer to provide full Marine Warranty Survey services for the ocean tow of a semi-submersible drilling unit from the Arabian Gulf to Southeast Asia — a transit of approximately 3,800 nautical miles across the Indian Ocean. The operation was one of the largest towage operations undertaken in the region during 2023.

The engineering review phase was extensive, covering the oceangoing towage approval submission prepared by the towing contractor's naval architects. Our team reviewed the stability calculations for the tow, the tow force analysis including bollard pull requirements for the specified weather criteria, the emergency towing system, and the metocean criteria for the entire transit route including the Strait of Malacca approach. All sea-fastening arrangements for equipment and hull appendages were reviewed and approved subject to technical queries.

A comprehensive pre-tow inspection was conducted at the departure port, attended by our MWS surveyor and naval architect. The inspection covered the structural condition of the unit's hull, columns, and pontoons, the towing attachments and tow connection points, all sea-fastening installations, and the operation of the emergency towing system. Satisfactory completion of the pre-tow inspection was recorded in the departure approval certificate.

Voyage monitoring was conducted throughout the 22-day transit, with our operations centre tracking the tow's progress against the metocean forecast windows. Two periods of adverse weather were encountered during the Indian Ocean crossing; on both occasions our team provided a weather window assessment and confirmed that the tow was operating within the approved criteria. The unit was delivered to the arrival port in Southeast Asia without incident, and a post-tow condition report was issued to the insurer.`,
    relatedService: 'marine-warranty-survey',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getRelatedProjects(slug: string, count = 3): Project[] {
  const current = getProject(slug);
  if (!current) return [];
  return projects
    .filter((p) => p.slug !== slug && p.category === current.category)
    .slice(0, count)
    .concat(
      projects
        .filter((p) => p.slug !== slug && p.category !== current.category)
        .slice(0, Math.max(0, count - projects.filter((p) => p.slug !== slug && p.category === current.category).length))
    )
    .slice(0, count);
}
