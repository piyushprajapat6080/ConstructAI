from datetime import datetime
import math

def get_current_timestamp() -> str:
    return datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def get_mock_safety_analysis(observation_log: str = "", has_doc: bool = False) -> dict:
    log_lower = observation_log.lower()
    is_critical = any(k in log_lower for k in ["fall", "electric", "collapse", "deep", "edge", "scaffold"])
    
    risk_level = "CRITICAL" if is_critical else "HIGH"
    score = 82 if is_critical else 68

    hazards = [
        {
            "id": "HAZ-001",
            "title": "Unprotected Floor Opening & Slab Edge",
            "description": "Perimeter slab edge on 4th floor lacks standard double guardrail and toe boards, posing immediate fatal fall risk for workers.",
            "severity": "CRITICAL",
            "location": "Grid B-4 to D-4, Level 4 West Wing",
            "recommendation": "Install rigid steel edge protection (1.15m height with mid-rail and 150mm toe-board) and secure static lifeline immediately before work resumes."
        },
        {
            "id": "HAZ-002",
            "title": "Substandard Bamboo/Steel Hybrid Scaffolding",
            "description": "Scaffolding lacks base plates on soft ground, with loose coupler connections and missing diagonal bracing beyond 3 lifts.",
            "severity": "CRITICAL",
            "location": "North Elevation Façade Scaffolding",
            "recommendation": "Red-tag scaffolding, condemn unsafe tiers, install sole plates on compacted ground, and re-certify under competent supervisor per IS 3696."
        },
        {
            "id": "HAZ-003",
            "title": "Tangled Overhead Temporary Power Cables",
            "description": "415V 3-phase cables running across wet transit corridors without armored insulation, creating acute electrocution & trip hazards.",
            "severity": "MODERATE",
            "location": "Main Material Hoist Ingress Point",
            "recommendation": "Elevate all temporary cabling on non-conductive cable hangers (minimum 2.5m clearance) and install 30mA residual current circuit breakers (RCCB)."
        },
        {
            "id": "HAZ-004",
            "title": "Rebar Impalement Exposure",
            "description": "Vertical starter bars protruding without high-visibility safety mushroom caps.",
            "severity": "MODERATE",
            "location": "Retaining Wall Starter Zone, Bay 2",
            "recommendation": "Cap all exposed starter bars with steel-reinforced OSHA/IS compliant mushroom caps."
        }
    ]

    ppe_compliance = [
        {"item": "Industrial Safety Hard Hat (IS 2925)", "status": "PARTIAL", "notes": "8 of 12 workers wearing compliant helmets; 4 observed with chin straps unbuckled or missing."},
        {"item": "High-Visibility Safety Vests (EN 471 / Class 2)", "status": "COMPLIANT", "notes": "All site personnel and subcontractors equipped with retro-reflective vests."},
        {"item": "Full Body Fall Arrest Harness (IS 3521)", "status": "MISSING", "notes": "Workers on edge shuttering observed without anchored double-lanyard harnesses."},
        {"item": "Steel-Toe Puncture Resistant Boots (IS 15298)", "status": "COMPLIANT", "notes": "Workforce equipped with standard S3 grade safety footwear."},
        {"item": "Impact-Resistant Eye Protection", "status": "PARTIAL", "notes": "Rebar tying crew lacking safety goggles during angle-grinder operations."}
    ]

    regulatory_actions = [
        {
            "code": "BOCW Act 1996 - Sec 40",
            "title": "Building and Other Construction Workers Regulations",
            "action": "Immediate stoppage of work at unguarded slab perimeter until fall arrest lifeline and netting installed.",
            "timeline": "Immediate (Within 2 Hours)"
        },
        {
            "code": "IS 3696 (Part 1):1987",
            "title": "Safety Code for Scaffolds and Ladders",
            "action": "Comprehensive structural audit and tagging (Green/Red) of external facade scaffolding.",
            "timeline": "Prior to Next Shift (12 Hours)"
        },
        {
            "code": "IS 5216 (Part 1)",
            "title": "Recommendations on Safety in Electrical Work",
            "action": "Mandatory installation of 30mA ELCB/RCCB on all distribution boards servicing pump and vibrators.",
            "timeline": "Within 24 Hours"
        }
    ]

    summary = (
        f"Multimodal site safety analysis detected {len(hazards)} primary hazards resulting in an overall {risk_level} "
        f"rating (Risk Score: {score}/100). The most urgent intervention is securing the 4th-floor perimeter slab edge "
        f"and retrofitting the external scaffolding with base plates and diagonal bracings."
    )

    return {
        "overall_risk": risk_level,
        "risk_score": score,
        "summary": summary,
        "hazards": hazards,
        "ppe_compliance": ppe_compliance,
        "regulatory_actions": regulatory_actions,
        "timestamp": get_current_timestamp()
    }


def get_mock_crack_analysis(description: str = "", structure_type: str = "RCC Beam") -> dict:
    desc_lower = description.lower()
    is_hairline = "hairline" in desc_lower or "shrinkage" in desc_lower or "plaster" in desc_lower
    is_settlement = "settlement" in desc_lower or "foundation" in desc_lower or "stepped" in desc_lower

    if is_hairline:
        crack_type = "Non-Structural Drying Shrinkage Crack"
        classification = "Non-Structural"
        severity = "LOW"
        severity_pct = 28
        width = "0.3 - 0.6 mm"
        impact = "Negligible structural load compromise; primarily aesthetic with minor long-term risk of moisture ingress."
        causes = [
            "Rapid evaporation of moisture during early hydration cycle (improper curing)",
            "Thermal differential between core concrete and surface during diurnal temperature cycling",
            "High water-cement ratio in the plaster finish layer"
        ]
        repairs = [
            {
                "step": 1,
                "action": "V-groove routing along crack line to 6mm depth",
                "materials": "Diamond-blade crack grooving tool, compressed air jet",
                "urgency": "Routine Maintenance",
                "estimated_cost_inr": 3500.0
            },
            {
                "step": 2,
                "action": "Pressure cleaning and primer coat application",
                "materials": "Elastomeric primer, acrylic bonding agent",
                "urgency": "Routine Maintenance",
                "estimated_cost_inr": 2200.0
            },
            {
                "step": 3,
                "action": "Elastomeric polyurea sealant injection and skim coat refinishing",
                "materials": "Flexible polyurethane sealant (IS 1838) + fiber mesh",
                "urgency": "Routine Maintenance",
                "estimated_cost_inr": 6800.0
            }
        ]
    elif is_settlement:
        crack_type = "Diagonal Differential Settlement Crack"
        classification = "Settlement"
        severity = "HIGH"
        severity_pct = 75
        width = "3.2 - 5.0 mm"
        impact = "Moderate to severe foundation subsidence causing diagonal shear distortion in adjacent masonry and frame joints."
        causes = [
            "Non-uniform compaction or high water table softening subgrade soil beneath southwest footing",
            "Inadequate footing contact area for localized bearing capacity",
            "Recent deep excavation in adjoining plot inducing lateral soil movement"
        ]
        repairs = [
            {
                "step": 1,
                "action": "Subgrade soil stabilization via polyurethane or micro-cement permeation grouting",
                "materials": "High-expansion geopolymer resin / Microfine cement grout",
                "urgency": "Urgent (1-2 weeks)",
                "estimated_cost_inr": 65000.0
            },
            {
                "step": 2,
                "action": "Install mechanical tell-tale gauges to measure continuous crack displacement",
                "materials": "Optical Avongard displacement crack monitoring plates",
                "urgency": "Immediate (24-48 hrs)",
                "estimated_cost_inr": 8500.0
            },
            {
                "step": 3,
                "action": "Structural underpinning or reinforced helical micro-piles if movement exceeds 1mm/month",
                "materials": "Micro-pile steel casings, high-strength structural concrete",
                "urgency": "Urgent (1-2 weeks)",
                "estimated_cost_inr": 125000.0
            }
        ]
    else:
        crack_type = "Structural Shear & Diagonal Tension Crack"
        classification = "Structural"
        severity = "CRITICAL"
        severity_pct = 86
        width = "2.8 - 4.2 mm"
        impact = "Significant reduction in ultimate shear capacity of the structural member. Requires immediate propping and load relief."
        causes = [
            "Excessive dead + live loading exceeding design limit states per IS 456:2000",
            "Inadequate shear stirrup spacing or premature curtailment of longitudinal tensile reinforcement",
            "High diagonal tension stresses concentrated near support zone"
        ]
        repairs = [
            {
                "step": 1,
                "action": "Immediate temporary structural shoring/propping directly beneath beam midspan and supports",
                "materials": "Heavy-duty Acrow props / adjustable steel jacks (IS 2750)",
                "urgency": "Immediate (24-48 hrs)",
                "estimated_cost_inr": 18000.0
            },
            {
                "step": 2,
                "action": "Low-viscosity high-modulus epoxy resin pressure injection to restore monolithic shear transfer",
                "materials": "Epoxy injection resin (ASTM C881 Type I/IV, IS 9162)",
                "urgency": "Immediate (24-48 hrs)",
                "estimated_cost_inr": 42000.0
            },
            {
                "step": 3,
                "action": "External shear strengthening with Carbon Fiber Reinforced Polymer (CFRP) wrapping or steel jacketing",
                "materials": "Bi-directional 300gsm Carbon Fiber Laminates + Structural Saturant Resin",
                "urgency": "Urgent (1-2 weeks)",
                "estimated_cost_inr": 88000.0
            }
        ]

    return {
        "crack_type": crack_type,
        "classification": classification,
        "severity": severity,
        "severity_percentage": severity_pct,
        "width_estimate_mm": width,
        "probable_causes": causes,
        "structural_integrity_impact": impact,
        "repair_recommendations": repairs,
        "monitoring_protocol": "Mount optical tell-tale crack gauges at both extremes. Log displacement weekly under varying thermal and structural live loads for 60 days.",
        "structure_type": structure_type,
        "timestamp": get_current_timestamp()
    }


def format_inr_crores_lakhs(val: float) -> str:
    if val >= 10000000:
        cr = val / 10000000.0
        return f"₹{cr:.2f} Cr"
    elif val >= 100000:
        lakh = val / 100000.0
        return f"₹{lakh:.2f} L"
    else:
        return f"₹{val:,.0f}"

def get_mock_valuation(location: str, area_sqft: float, age_years: int, prop_type: str, amenities: list) -> dict:
    # Base rate heuristics depending on city/keyword
    loc_lower = location.lower()
    base_rate = 6800.0
    if any(c in loc_lower for c in ["mumbai", "bandra", "south bombay", "worli", "bkc"]):
        base_rate = 26000.0
    elif any(c in loc_lower for c in ["bengaluru", "bangalore", "whitefield", "indiranagar", "koramangala"]):
        base_rate = 9500.0
    elif any(c in loc_lower for c in ["gurgaon", "gurugram", "noida", "delhi", "dwarka"]):
        base_rate = 11000.0
    elif any(c in loc_lower for c in ["hyderabad", "gachibowli", "hitec"]):
        base_rate = 8200.0
    elif any(c in loc_lower for c in ["pune", "hinjewadi", "wakad"]):
        base_rate = 7400.0

    # Type multiplier
    if "Commercial" in prop_type:
        base_rate *= 1.35
    elif "Villa" in prop_type:
        base_rate *= 1.25
    elif "Plot" in prop_type:
        base_rate *= 0.90

    # Age depreciation (approx 1.2% per year, max 35%)
    depreciation = min(age_years * 0.012, 0.35)
    effective_rate = base_rate * (1.0 - depreciation)

    # Amenities bonus
    amenities_count = len(amenities)
    amenity_multiplier = 1.0 + min(amenities_count * 0.03, 0.20)
    final_sqft_rate = round(effective_rate * amenity_multiplier, 0)

    estimated_val = round(final_sqft_rate * area_sqft, 0)
    range_min = round(estimated_val * 0.93, 0)
    range_max = round(estimated_val * 1.08, 0)

    # Rental calculation (approx 3.2% - 4.5% annual yield for residential, 7% for commercial)
    yield_pct = 7.2 if "Commercial" in prop_type else 3.8
    monthly_rent = round((estimated_val * (yield_pct / 100.0)) / 12.0, 0)
    roi_5yr = round(8.4 + (amenities_count * 0.5) - (age_years * 0.2), 1)
    if roi_5yr < 5.0:
        roi_5yr = 5.8

    market_drivers = [
        {
            "factor": "Transit & Metro Connectivity",
            "impact": "HIGH",
            "detail": "Upcoming metro line extension within 1.2 km corridor expected to accelerate capital appreciation by 14-18% over 36 months."
        },
        {
            "factor": "Employment Hub Proximity",
            "impact": "POSITIVE",
            "detail": "Strong IT/Enterprise office parks within 5 km radius sustaining continuous high rental occupancy and negligible vacancy rate."
        },
        {
            "factor": f"Building Age Depreciation ({age_years} yrs)",
            "impact": "MODERATE" if age_years < 10 else "HIGH",
            "detail": f"Structure is {age_years} years old; well-maintained facade and common areas offset standard structural aging depreciation."
        },
        {
            "factor": "Lifestyle Amenities Index",
            "impact": "POSITIVE",
            "detail": f"Inclusion of {amenities_count} premium amenities provides a ~{round(amenity_multiplier * 100 - 100)}% valuation premium over baseline market inventory."
        }
    ]

    comparable_benchmarks = [
        {"area_name": f"{location} - Grade A High-Rise", "avg_rate_sqft": round(final_sqft_rate * 1.06, 0), "appreciation_rate": "+9.8% YoY"},
        {"area_name": f"{location} - Mid-Segment Gated Society", "avg_rate_sqft": round(final_sqft_rate * 0.95, 0), "appreciation_rate": "+7.5% YoY"},
        {"area_name": f"{location} - Independent Resale Inventory", "avg_rate_sqft": round(final_sqft_rate * 0.88, 0), "appreciation_rate": "+5.2% YoY"}
    ]

    summary = (
        f"Valuation appraisal for {area_sqft:,.0f} sq.ft {prop_type} in {location} indicates an estimated fair market value "
        f"of {format_inr_crores_lakhs(estimated_val)} (₹{final_sqft_rate:,.0f}/sq.ft). The asset demonstrates solid investor appeal "
        f"with an anticipated monthly rental income of ₹{monthly_rent:,.0f} and projected 5-year annualized ROI of {roi_5yr}%."
    )

    return {
        "location": location,
        "property_type": prop_type,
        "area_sqft": area_sqft,
        "age_years": age_years,
        "estimated_value_inr": estimated_val,
        "value_range_min_inr": range_min,
        "value_range_max_inr": range_max,
        "formatted_value": format_inr_crores_lakhs(estimated_val),
        "price_per_sqft_inr": final_sqft_rate,
        "expected_monthly_rent_inr": monthly_rent,
        "rental_yield_percentage": yield_pct,
        "roi_percentage": roi_5yr,
        "market_drivers": market_drivers,
        "comparable_benchmarks": comparable_benchmarks,
        "valuation_summary": summary,
        "timestamp": get_current_timestamp()
    }


def get_mock_planner(project_brief: str) -> dict:
    brief_lower = project_brief.lower()
    
    # Calculate approximate area and volume
    slab_area = 600.0  # default 20x30
    if "20x30" in brief_lower or "600" in brief_lower:
        slab_area = 600.0
    elif "30x40" in brief_lower or "1200" in brief_lower:
        slab_area = 1200.0
    elif "40x60" in brief_lower or "2400" in brief_lower:
        slab_area = 2400.0

    # 125mm (5 inches) slab + beams volume approx = area * 0.16m
    concrete_vol = round(slab_area * 0.0929 * 0.165, 1)  # in cubic meters (cum)
    if concrete_vol < 8.0:
        concrete_vol = 9.2

    # M20/M25 mix estimation for concrete_vol
    cement_bags = round(concrete_vol * 7.8, 0)
    sand_cft = round(concrete_vol * 15.5 * 35.3147 / 35.3147 * 15.2, 0)
    coarse_agg_cft = round(concrete_vol * 28.5, 0)
    steel_kg = round(concrete_vol * 85.0, 0)  # ~85 kg/cum for slab+beam

    materials = [
        {
            "item": "OPC 53 Grade Cement (UltraTech / Ambuja)",
            "quantity": float(cement_bags),
            "unit": "Bags (50 kg)",
            "unit_rate_inr": 385.0,
            "total_cost_inr": round(cement_bags * 385.0, 0),
            "icon": "package"
        },
        {
            "item": "Fe 550D TMT Rebar (Tata Tiscon / JSW)",
            "quantity": float(steel_kg),
            "unit": "Kg",
            "unit_rate_inr": 68.0,
            "total_cost_inr": round(steel_kg * 68.0, 0),
            "icon": "layers"
        },
        {
            "item": "Manufactured Sand (M-Sand Zone II)",
            "quantity": float(sand_cft),
            "unit": "Cu.Ft",
            "unit_rate_inr": 58.0,
            "total_cost_inr": round(sand_cft * 58.0, 0),
            "icon": "box"
        },
        {
            "item": "Graded Coarse Aggregate (20mm & 10mm)",
            "quantity": float(coarse_agg_cft),
            "unit": "Cu.Ft",
            "unit_rate_inr": 46.0,
            "total_cost_inr": round(coarse_agg_cft * 46.0, 0),
            "icon": "grid"
        },
        {
            "item": "Binding Wire & Cover Blocks (20mm/25mm)",
            "quantity": 1.0,
            "unit": "Lump-sum Lot",
            "unit_rate_inr": 4500.0,
            "total_cost_inr": 4500.0,
            "icon": "disc"
        },
        {
            "item": "Concrete Plasticizer Admixture (IS 9103)",
            "quantity": round(concrete_vol * 2.5, 1),
            "unit": "Litres",
            "unit_rate_inr": 180.0,
            "total_cost_inr": round(concrete_vol * 2.5 * 180.0, 0),
            "icon": "droplet"
        }
    ]

    mat_cost = sum(m["total_cost_inr"] for m in materials)
    labour_cost = round(mat_cost * 0.42, 0)
    finishing_cost = round(mat_cost * 0.18, 0)
    contingency_cost = round((mat_cost + labour_cost + finishing_cost) * 0.07, 0)
    total_cost = mat_cost + labour_cost + finishing_cost + contingency_cost

    mat_pct = round((mat_cost / total_cost) * 100.0, 1)
    lab_pct = round((labour_cost / total_cost) * 100.0, 1)
    fin_pct = round(((finishing_cost + contingency_cost) / total_cost) * 100.0, 1)

    costs = {
        "materials_cost_inr": mat_cost,
        "labour_cost_inr": labour_cost,
        "finishing_cost_inr": finishing_cost,
        "contingency_cost_inr": contingency_cost,
        "total_cost_inr": total_cost,
        "materials_percentage": mat_pct,
        "labour_percentage": lab_pct,
        "finishing_percentage": fin_pct
    }

    timeline = [
        {
            "phase": "Phase 1: Shuttering & Scaffolding Erection",
            "duration": "Day 1 - Day 3",
            "milestones": [
                "Erect Acrow steel staging and secondary runners",
                "Fix waterproof film-faced shuttering plywood sheets",
                "Survey level check with auto-level and apply shuttering oil"
            ],
            "status": "Ready"
        },
        {
            "phase": "Phase 2: Reinforcement Fabrication & Bar Bending",
            "duration": "Day 4 - Day 6",
            "milestones": [
                "Cut and bend main tensile rebar according to BBS schedule",
                "Place beam cages, crank bars, and top extra distribution mesh",
                "Fix 25mm PVC cover blocks at 1m grid intervals"
            ],
            "status": "Pending"
        },
        {
            "phase": "Phase 3: MEP Conduits & Pre-Pour Inspection",
            "duration": "Day 7",
            "milestones": [
                "Route electrical PVC conduit fan boxes and plumbing sleeve inserts",
                "Final structural engineer sign-off on lap lengths and stirrup hooks"
            ],
            "status": "Milestone"
        },
        {
            "phase": "Phase 4: Concreting (M25 Ready Mix / Site Mix)",
            "duration": "Day 8",
            "milestones": [
                "Continuous concrete placement with needle vibration (40mm needle)",
                "Surface screeding, bull floating, and bull float broom finishing",
                "Cast 6 concrete test cubes for 7-day and 28-day compressive test"
            ],
            "status": "Pending"
        },
        {
            "phase": "Phase 5: Pond Curing & De-shuttering",
            "duration": "Day 9 - Day 22",
            "milestones": [
                "Construct clay/mortar bunds for water pond curing for minimum 14 days",
                "Beam side de-shuttering at 48 hours; slab soffit props retained for 14-21 days"
            ],
            "status": "Pending"
        }
    ]

    assumptions = [
        "Concrete Mix Design: M25 Grade (1 : 1.5 : 3 nominal or design mix with slump 100-120mm)",
        "Rebar Detailing conforming strictly to IS 13920:2016 ductile detailing standards",
        "Water-cement ratio capped at 0.45 with superplasticizer",
        "Clear cover for slab: 20mm, Beam: 25mm",
        "Rates based on current Q4 Indian infrastructure price index"
    ]

    return {
        "project_name": f"Comprehensive Construction Plan: {project_brief[:48]}",
        "scope_summary": f"Engineered schedule & bill of quantities for {project_brief}. Calculated total concrete volume of {concrete_vol} m³ with high-ductility rebar and phase-wise quality checkpoints.",
        "estimated_duration_days": 22,
        "concrete_volume_cum": concrete_vol,
        "materials": materials,
        "costs": costs,
        "timeline": timeline,
        "engineering_assumptions": assumptions,
        "timestamp": get_current_timestamp()
    }


def get_mock_knowledge(category: str, query: str) -> dict:
    cat_upper = category.upper()
    
    if cat_upper == "SAFETY":
        title = f"Safety Compliance Protocol: {query}"
        summary = "Standard operating safety procedures aligned with National Building Code (NBC 2016) Part 7 and Indian Standards for construction safety."
        is_codes = [
            {"code": "IS 3696 (Part 1):1987", "title": "Safety Code for Scaffolds", "clause": "Clause 6.2 - Guardrails", "excerpt": "Every scaffolding platform from which a person is liable to fall more than 2 meters shall be provided with guardrails at minimum 1.0m height with mid-rail and toe-board."},
            {"code": "IS 4014 (Part 2):1967", "title": "Code of Practice for Steel Tubular Scaffolding", "clause": "Clause 8.4 - Bracing", "excerpt": "Diagonal braces must be installed continuously at an angle between 35° and 55° along the full length of the facade structure."},
            {"code": "IS 3764:1992", "title": "Excavation Work - Code of Safety", "clause": "Clause 5.1 - Trench Shoring", "excerpt": "Trenches deeper than 1.5m in loose or cohesive soils must be properly timbered or sloped to prevent sudden bank collapse."}
        ]
        guidelines = [
            {"step_number": 1, "title": "Toolbox Talk & Hazard Assessment", "instruction": "Conduct daily mandatory 15-minute briefing covering specific shift risks, PPE checks, and anchor points.", "critical_check": "100% attendance sign-off and breathalyzer/alertness check."},
            {"step_number": 2, "title": "Structural Tagging & Load Validation", "instruction": "Verify scaffolding green tag signed by authorized safety officer within the last 7 days.", "critical_check": "Reject any scaffold bearing a Red Tag or missing base jacks."},
            {"step_number": 3, "title": "Fall Arrest & Lifeline Rigging", "instruction": "Rig minimum 16mm synthetic or 8mm galvanized wire rope lifeline rated to 22.2 kN (5,000 lbs) per worker.", "critical_check": "Ensure twin lanyards with energy absorbers are attached above shoulder level."}
        ]
        tips = [
            "Never allow working on wet scaffolds during high winds (>40 km/h).",
            "Maintain 3.5m minimum clearance from live overhead electrical distribution lines.",
            "Inspect safety harnesses every month for webbing fraying, buckle deformation, and stitching failure."
        ]
        doc_template = None

    elif cat_upper == "DOC_GEN":
        title = f"Official Construction Document Template: {query}"
        summary = "Legally compliant construction handover / inspection document drafted per CPWD and FIDIC contract provisions."
        is_codes = [
            {"code": "NBC 2016 Part 2", "title": "Administration and Building Permits", "clause": "Appendix A - Completion Form", "excerpt": "Notice of completion and permission for occupancy must be certified by registered Architect and Structural Engineer."},
            {"code": "IS 456:2000", "title": "Plain and Reinforced Concrete", "clause": "Clause 15.2 - Quality Records", "excerpt": "The contractor shall maintain a daily concrete pouring log and 28-day cube strength compliance register."}
        ]
        guidelines = [
            {"step_number": 1, "title": "Data Field Population", "instruction": "Fill project reference number, RFI index, contractor registration ID, and exact grid locations.", "critical_check": "Verify all structural signatures are stamped with council registration numbers."},
            {"step_number": 2, "title": "Test Certificate Attachments", "instruction": "Attach certified laboratory test reports (7-day/28-day cube tests, mill test certificates for rebar).", "critical_check": "Concrete cube strength must meet or exceed target fck + 1.65 sigma."},
            {"step_number": 3, "title": "Sign-off & Archival", "instruction": "Obtain tri-party signatures (Contractor PM, PMC Resident Engineer, Client Structural Consultant).", "critical_check": "Issue stamped copies to municipal building authority within 14 calendar days."}
        ]
        tips = [
            "Include geo-tagged and timestamped photographs of the completed pour or milestone.",
            "Record batching plant mix ticket numbers for every transit mixer delivery.",
            "Maintain digital ledger alongside physical stamped hard copies."
        ]
        doc_template = (
            "========================================================================\n"
            "             CONSTRUCTAI OFFICIAL SITE INSPECTION & CLEARANCE CERTIFICATE\n"
            "========================================================================\n"
            f"PROJECT NAME   : Project Alpha Commercial Tower\n"
            f"DOCUMENT REF   : CAI/RFI/2026/0892\n"
            f"SUBJECT        : {query.upper()}\n"
            f"DATE OF AUDIT  : {get_current_timestamp()}\n"
            "CONTRACTOR     : Apex Infrastructure Consortium Ltd.\n"
            "PMC CONSULTANT : Bureau Veritas Quality Audits\n"
            "------------------------------------------------------------------------\n"
            "1. SCOPE OF INSPECTION:\n"
            "   Verification of structural reinforcement, formwork rigidity, MEP inserts,\n"
            "   and clear covers prior to concrete casting.\n\n"
            "2. IS CODE CONFORMANCE:\n"
            "   - IS 456:2000 (Plain and Reinforced Concrete)\n"
            "   - IS 13920:2016 (Ductile Detailing of Reinforced Concrete)\n"
            "   - NBC 2016 Part 7 (Construction Practices and Safety)\n\n"
            "3. CHECKLIST VERIFICATION:\n"
            "   [X] Rebar Diameter, Spacing & Lap Lengths checked against Drawing Rev 4\n"
            "   [X] Cover blocks (25mm) placed at 1000mm c/c on bottom and beam sides\n"
            "   [X] Shuttering joints sealed with high-density EVA foam tape\n"
            "   [X] Shuttering props braced horizontally in two orthogonal directions\n"
            "   [X] Electrical conduits pressure tested and tied securely to top rebar\n\n"
            "4. CLEARANCE DECISION: APPROVED FOR CONCRETING\n"
            "   Concrete grade specified: M25 (100-120mm slump at point of discharge)\n\n"
            "AUTHORIZED SIGNATURES:\n"
            "Site QC Engineer         Resident Project Manager         Structural Consultant\n"
            "_________________        ________________________         _____________________\n"
            "========================================================================"
        )

    else:  # TECHNIQUE
        title = f"Engineering Technique & Method Statement: {query}"
        summary = "Technical standard execution procedure detailing material proportions, equipment, tolerances, and quality testing."
        is_codes = [
            {"code": "IS 456:2000", "title": "Plain and Reinforced Concrete - Code of Practice", "clause": "Clause 9 & Table 2", "excerpt": "M25 mix requires characteristic compressive strength of 25 N/mm² at 28 days with maximum water-cement ratio of 0.45."},
            {"code": "IS 10262:2019", "title": "Concrete Mix Proportioning - Guidelines", "clause": "Clause 5.3 - Target Strength", "excerpt": "Target mean strength f'ck = fck + 1.65s, where standard deviation s = 4.0 N/mm² for M25."},
            {"code": "IS 1199 (Part 2):2018", "title": "Fresh Concrete Testing - Workability", "clause": "Clause 4 - Slump Test", "excerpt": "True slump measurement using standard slump cone (100mm top, 200mm base, 300mm height) tamped in 3 equal layers."}
        ]
        guidelines = [
            {"step_number": 1, "title": "Raw Material Quality Testing", "instruction": "Verify silt content in sand is <4% by volume; aggregate impact value is <30%; cement freshness within 60 days of manufacture.", "critical_check": "Conduct field sieve analysis and moisture compensation correction."},
            {"step_number": 2, "title": "Weigh-Batching & Water-Cement Calibration", "instruction": "Batch aggregates by weight, not volume. Strictly meter mixing water and add superplasticizer after 30 seconds of dry mixing.", "critical_check": "Never add extra site water to restore slump; use PCE admixture instead."},
            {"step_number": 3, "title": "Placement & Compaction", "instruction": "Discharge concrete within 90 minutes of batching. Insert needle vibrator vertically at 450mm intervals; withdraw slowly without dragging.", "critical_check": "Avoid over-vibration exceeding 15 seconds per spot to prevent bleeding and segregation."}
        ]
        tips = [
            "Perform slump test on every transit mixer before allowing pump hopper discharge.",
            "Maintain continuous wet curing for minimum 14 days for OPC cement (21 days for PPC/fly-ash blends).",
            "Keep concrete temperature below 32°C during placement; use chilled water in hot weather."
        ]
        doc_template = None

    return {
        "category": cat_upper,
        "query": query,
        "title": title,
        "summary": summary,
        "is_codes_cited": is_codes,
        "technical_guidelines": guidelines,
        "doc_template": doc_template,
        "practical_tips": tips,
        "timestamp": get_current_timestamp()
    }


def get_mock_chatbot_reply(message: str, history: list = None) -> dict:
    msg_lower = message.lower()
    
    if any(k in msg_lower for k in ["m25", "mix", "concrete", "ratio"]):
        reply = (
            "### 🏗️ M25 Concrete Mix Engineering Blueprint\n\n"
            "Per **IS 456:2000** and **IS 10262:2019**, M25 grade concrete represents a characteristic 28-day compressive "
            "strength of **25 N/mm²**.\n\n"
            "#### Standard Design Proportions (per 1 m³ of concrete):\n"
            "- **Cement (OPC 53 Grade):** 380 - 410 kg (~8 bags)\n"
            "- **Fine Aggregate (Zone II M-Sand):** 680 - 720 kg\n"
            "- **Coarse Aggregate (20mm down):** 670 kg (60%)\n"
            "- **Coarse Aggregate (10mm down):** 450 kg (40%)\n"
            "- **Water-Cement Ratio:** 0.42 - 0.45 (Max 175 Litres/m³)\n"
            "- **Polycarboxylate Ether (PCE) Admixture:** 0.8% - 1.2% by weight of cement\n\n"
            "#### Nominal Field Ratio Equivalent:\n"
            "**1 : 1.5 : 3** *(1 part Cement : 1.5 parts Sand : 3 parts Coarse Aggregate by volume)*.\n\n"
            "> **⚠️ Critical Quality Note:** Nominal volumetric batching is prohibited on major structural elements under IS 456 Clause 9. Weigh-batching with moisture adjustment is strictly mandatory."
        )
        suggestions = [
            "What is the curing duration for M25 slab?",
            "How to calculate Bar Bending Schedule (BBS)?",
            "Safety checklist for RMC pump placement"
        ]
    elif any(k in msg_lower for k in ["safety", "ppe", "hazard", "osha", "accident"]):
        reply = (
            "### 🛡️ Site Safety & Hazard Mitigation Protocol\n\n"
            "Construction safety in India is governed by the **BOCW Act 1996**, **IS 3696**, and **NBC 2016 Part 7**.\n\n"
            "#### Five Cardinal Rules for High-Rise Safety:\n"
            "1. **100% Fall Protection above 1.8m:** Fixed perimeter guardrails (top-rail at 1.15m, mid-rail at 0.6m, 150mm toe-board) and continuous horizontal lifeline rated to 22.2 kN.\n"
            "2. **Scaffold Certification:** Green/Red tagging by certified safety engineer. Diagonal bracing on all faces; base jacks on compacted mud sills.\n"
            "3. **Electrical Isolation:** 30mA RCCB/ELCB protection on all temporary distribution panels. No jointed cables across walkways.\n"
            "4. **Rebar Impalement Protection:** High-impact mushroom caps on all exposed column/wall starter bars.\n"
            "5. **Overhead Hazard Netting:** Heavy-duty debris catch nets extending 3m beyond building perimeter."
        )
        suggestions = [
            "Scaffolding inspection checklist",
            "What are mandatory PPE for concrete pouring?",
            "IS code for electrical safety on site"
        ]
    elif any(k in msg_lower for k in ["cost", "estimate", "rate", "budget", "price"]):
        reply = (
            "### 💰 Indian Construction Cost Index (Q4 2026)\n\n"
            "Current average construction costs for residential and commercial structures across Tier 1 Indian cities:\n\n"
            "| Specification Level | Rate per Sq.Ft (Built-up) | Key Inclusions |\n"
            "| :--- | :--- | :--- |\n"
            "| **Basic / Affordable** | ₹1,550 - ₹1,850 | RCC Frame, Fly-ash bricks, Vitrified tiles, Standard sanitary |\n"
            "| **Standard / Premium** | ₹1,950 - ₹2,450 | Fe550D TMT, AAC blocks, 800x800 GVT tiles, Modular switches |\n"
            "| **Luxury / Ultra-Modern** | ₹2,800 - ₹3,800+ | Italian marble, VRV HVAC, Double-glazed facade, Home automation |\n\n"
            "#### Typical Cost Distribution:\n"
            "- **Civil & Structural Core:** ~52% (Cement, Steel, Aggregates, Masonry)\n"
            "- **Finishing & Flooring:** ~24% (Plastering, Painting, Tiling, False Ceiling)\n"
            "- **MEP (Mechanical, Electrical, Plumbing):** ~16%\n"
            "- **Statutory Approvals & Overheads:** ~8%"
        )
        suggestions = [
            "Estimate 1500 sqft residential house cost",
            "Current market rate of Fe550D steel",
            "Labour rate per square foot for brickwork"
        ]
    else:
        reply = (
            f"### 👷 CONSTRUCTAI Intelligence Report\n\n"
            f"Analyzing query: *\"{message}\"*\n\n"
            "Based on the **National Building Code of India (NBC 2016)** and **Indian Standards (IS Codes)**, here are key engineering recommendations:\n\n"
            "1. **Structural Verification:** Ensure all structural detailing conforms to **IS 13920** for ductile seismic resistance.\n"
            "2. **Quality Assurance:** Maintain slump test logs and cast mandatory 150mm test cubes (minimum 3 specimens per 50 m³ of pour).\n"
            "3. **Safety Execution:** Establish clear exclusion zones beneath active lifting operations and enforce Class 2 high-vis apparel.\n\n"
            "How would you like to proceed? I can generate a complete bill of quantities, structural method statement, or safety inspection form."
        )
        suggestions = [
            "Generate Bill of Quantities (BOQ)",
            "Check weather feasibility for casting",
            "Diagnose structural cracks on site"
        ]

    return {
        "reply": reply,
        "followup_suggestions": suggestions,
        "timestamp": get_current_timestamp()
    }


def get_mock_daily_assistant(planned_activity: str, labour_count: int, site_condition: str) -> dict:
    tasks = [
        {"priority": "High", "task": f"Pre-pour formwork alignment and level check for {planned_activity}", "assignee_role": "Surveyor & Senior Site Engineer", "time_slot": "08:00 - 09:30 AM"},
        {"priority": "High", "task": "Verify rebar tying, lap lengths, and 25mm concrete cover blocks", "assignee_role": "Bar Bending Foreman", "time_slot": "09:30 - 11:30 AM"},
        {"priority": "Medium", "task": "Conduct pre-start test runs on needle vibrators, diesel generators, and concrete pumps", "assignee_role": "Plant & Machinery In-charge", "time_slot": "11:30 - 12:30 PM"},
        {"priority": "High", "task": f"Deploy {labour_count} workers across designated zones; execute concrete placement", "assignee_role": "General Site Supervisor", "time_slot": "01:30 - 05:30 PM"},
        {"priority": "Medium", "task": "Cast 6 test cubes and apply initial curing burlap covers", "assignee_role": "Quality Control Lab Technician", "time_slot": "05:30 - 06:30 PM"}
    ]

    checks = [
        {"check": "Ensure safe egress and stair towers have handrails and anti-slip treads", "mandatory": True, "notes": "No ladder climbing with heavy tools."},
        {"check": "Inspect electrical distribution box ELCB trip test under load", "mandatory": True, "notes": "30mA sensitivity verified."},
        {"check": f"Assess ground stability under current condition: '{site_condition}'", "mandatory": True, "notes": "Ensure transit mixer outriggers have steel spreader pads."},
        {"check": "Provide adequate potable hydration points and electrolyte packs for workers", "mandatory": False, "notes": "Hydration break scheduled every 90 minutes."}
    ]

    gear = [
        "Industrial Safety Helmets (IS 2925)",
        "Reflective High-Visibility Vests",
        "Steel-Toe Safety Boots",
        "Rubber Heavy-Duty Concreting Gloves",
        "Impact-Resistant Safety Goggles",
        "Ear Protection near Diesel Generators"
    ]

    equip = [
        {"equipment": "High-Frequency Needle Vibrators (40mm & 60mm)", "quantity": "3 Units (2 Active + 1 Standby)", "check_item": "Check flexible drive shaft oil and engine spark"},
        {"equipment": "Diesel Generator Set (62.5 kVA)", "quantity": "1 Unit", "check_item": "Fuel level >80% and earth pit resistance <2 Ohms"},
        {"equipment": "Automatic Level / Total Station", "quantity": "1 Unit", "check_item": "Collimation error calibration verified this week"},
        {"equipment": "Concrete Test Cube Moulds (150mm)", "quantity": "6 Moulds + Tamping Bar", "check_item": "Cleaned and oiled with mould-release agent"}
    ]

    alerts = [
        {
            "level": "WARNING" if "mud" in site_condition.lower() or "rain" in site_condition.lower() else "HIGH",
            "title": "Ground Bearing Capacity Caution",
            "mitigation": f"Site condition is recorded as '{site_condition}'. Concrete transit mixers weighing 32 tonnes must stay on compacted gravel access roads."
        },
        {
            "level": "CRITICAL",
            "title": "Overhead Hoist & Boom Exclusion Zone",
            "mitigation": "Erect barrier tape 5m around concrete pump boom radius. No personnel allowed directly under active delivery pipes."
        }
    ]

    summary = (
        f"Daily Site Operational Directive prepared for {planned_activity} with {labour_count} deployed workers. "
        f"Site ground status: '{site_condition}'. 5 sequential milestones scheduled with mandatory QC cube testing and high-voltage ELCB safety audit."
    )

    return {
        "date": datetime.now().strftime("%A, %d %B %Y"),
        "planned_activity": planned_activity,
        "summary": summary,
        "prioritized_tasks": tasks,
        "required_safety_checks": checks,
        "safety_gear_required": gear,
        "equipment_list": equip,
        "risk_alerts": alerts,
        "supervisor_signoff_notes": "All checks must be verified by the Resident Engineer prior to commencing 01:30 PM concrete pour.",
        "timestamp": get_current_timestamp()
    }


def get_mock_weather_advisor(planned_activity: str, forecast_weather: str) -> dict:
    w_lower = forecast_weather.lower()
    act_lower = planned_activity.lower()

    is_rain = any(k in w_lower for k in ["rain", "monsoon", "shower", "thunder", "storm", "wet", "downpour"])
    is_wind = any(k in w_lower for k in ["wind", "gust", "storm", "cyclone", "40 km", "50 km"])
    is_hot = any(k in w_lower for k in ["heat", "38°c", "40°c", "42°c", "hot", "sun"])

    if is_rain and any(k in act_lower for k in ["concrete", "pour", "casting", "plaster", "paint", "roof"]):
        decision = "NO-GO"
        confidence = 94
        hazards = [
            {"hazard": "Cement Wash-out & Surface Dilution", "severity": "HIGH", "reason": "Rainwater directly enters fresh unhardened concrete, raising water-cement ratio and causing severe loss of compressive strength (>35% reduction)."},
            {"hazard": "Plaster & Paint Blistering/Peeling", "severity": "HIGH", "reason": "Excess substrate humidity prevents capillary adhesion, leading to early delamination."},
            {"hazard": "Electrical Short Circuits in Wet Areas", "severity": "HIGH", "reason": "Vibrator switchboards and extension boxes exposed to water ingress present lethal electrocution risks."}
        ]
        precautions = [
            "Postpone non-urgent concrete casting until dry weather window.",
            "If casting is underway, immediately erect heavy-duty waterproof tarpaulins and prepare plastic sheet covers.",
            "Create slope runoffs and ensure de-watering pumps are primed in basement footing pits.",
            "Install protective water-stops at construction joints if pour must be halted prematurely."
        ]
        advisory = "CRITICAL WEATHER STOPPAGE: Concreting or exterior plastering during active rainfall violates IS 456 Clause 14. Postpone activity to next clear forecast window."
        windows = ["Delayed Window: Tomorrow 07:00 AM - 12:00 PM (Low rain probability <15%)", "Alternative: Postpone 24 Hours"]

    elif is_wind and any(k in act_lower for k in ["crane", "lift", "scaffold", "roofing", "cladding"]):
        decision = "PROCEED WITH CAUTION" if "30" in w_lower else "NO-GO"
        confidence = 88
        hazards = [
            {"hazard": "Tower Crane Load Pendulum Swing", "severity": "HIGH", "reason": "Wind gusts exceeding 35 km/h induce uncontrollable sway in large surface-area loads (formwork panels, glass panes)."},
            {"hazard": "Scaffold Structural Overturning", "severity": "HIGH", "reason": "Wind sail effect on sheeted scaffolding can overload facade tie anchors."}
        ]
        precautions = [
            "Halt all crane operations if sustained wind speed exceeds 38 km/h (10.5 m/s) per IS 4573.",
            "Secure all loose plywood sheets, rebar bundles, and corrugated roofing sheets.",
            "Ensure crane slewing brake is released at end of shift into free weather-vane mode."
        ]
        advisory = "High wind advisory in effect. Rig loads with taglines; restrict crane lifting to lower tiers (<15m) only."
        windows = ["Early Morning Calm: 06:00 AM - 10:00 AM (Wind speed <18 km/h)"]

    elif is_hot:
        decision = "PROCEED WITH CAUTION"
        confidence = 90
        hazards = [
            {"hazard": "Rapid Slump Loss & Cold Joints", "severity": "HIGH", "reason": "High ambient temperature accelerates early hydration, causing transit concrete to stiffen prematurely."},
            {"hazard": "Plastic Shrinkage Surface Cracking", "severity": "HIGH", "reason": "Evaporation rate exceeding 1.0 kg/m²/hour induces severe tensile stress on slab surfaces."},
            {"hazard": "Worker Heat Stroke & Exhaustion", "severity": "MEDIUM", "reason": "Continuous manual labour above 38°C risks worker dehydration and fainting."}
        ]
        precautions = [
            "Use chilled mixing water or flake ice to keep fresh concrete temperature below 30°C.",
            "Apply aliphatic alcohol evaporation retardant or fog mist immediately behind screeding.",
            "Begin curing within 2 hours using wet hessian cloth; shift heavy pours to evening/night shift.",
            "Provide mandatory 15-minute shaded cooling break every hour with ORS solution."
        ]
        advisory = "Hot weather concreting protocol activated per IS 7861 (Part 1). Night pouring (07:00 PM - 02:00 AM) strongly recommended."
        windows = ["Night Window: 07:00 PM - 03:00 AM (Ambient temp drops to 27°C)", "Early Morning: 05:30 AM - 09:30 AM"]

    else:
        decision = "GO"
        confidence = 95
        hazards = [
            {"hazard": "Minor Dust Suspension", "severity": "LOW", "reason": "Dry breeze may lift fine particles during material handling."}
        ]
        precautions = [
            "Perform standard morning plant and equipment inspection.",
            "Keep water sprinkle bowser active for site haul road dust suppression.",
            "Follow standard curing and compaction schedules."
        ]
        advisory = "OPTIMAL SITE CONDITIONS: Current weather parameters are fully compliant with Indian Standards for structural concrete, steel erection, and exterior finishes."
        windows = ["Full Shift Operational Window: 07:00 AM - 06:00 PM"]

    return {
        "planned_activity": planned_activity,
        "forecast_weather": forecast_weather,
        "feasibility_decision": decision,
        "confidence_score": confidence,
        "hazards": hazards,
        "precautions": precautions,
        "operational_advisory": advisory,
        "optimal_windows": windows,
        "timestamp": get_current_timestamp()
    }
