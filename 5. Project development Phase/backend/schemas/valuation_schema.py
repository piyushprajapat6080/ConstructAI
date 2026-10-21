from typing import List, Optional
from pydantic import BaseModel, Field

class ValuationRequest(BaseModel):
    location: str = Field(..., description="City and neighborhood (e.g. Whitefield, Bengaluru or Sector 62, Noida)")
    area_sqft: float = Field(..., gt=0, description="Total built-up/super area in square feet")
    age_years: int = Field(0, ge=0, description="Age of structure in years")
    type: str = Field("Residential Apartment", description="Residential Apartment, Commercial Office, Villa/Independent House, Plot/Land")
    amenities: List[str] = Field(default_factory=list, description="Selected amenities (e.g. Gated Security, Clubhouse, Power Backup, Metro Connectivity)")

class MarketDriver(BaseModel):
    factor: str = Field(..., description="Driver factor name")
    impact: str = Field(..., description="Impact: HIGH, POSITIVE, or MODERATE")
    detail: str = Field(..., description="Analysis note on how it affects asset price")

class ComparableBenchmark(BaseModel):
    area_name: str = Field(..., description="Nearby micro-market or society")
    avg_rate_sqft: float = Field(..., description="Average rate per sq.ft in INR")
    appreciation_rate: str = Field(..., description="Historical 3-year CAGR appreciation (e.g. +8.5% YoY)")

class ValuationResponse(BaseModel):
    location: str
    property_type: str
    area_sqft: float
    age_years: int
    estimated_value_inr: float = Field(..., description="Fair market value in INR")
    value_range_min_inr: float = Field(..., description="Conservative lower estimate")
    value_range_max_inr: float = Field(..., description="Optimistic upper estimate")
    formatted_value: str = Field(..., description="Formatted string e.g. ₹88.50 L or ₹2.40 Cr")
    price_per_sqft_inr: float = Field(..., description="Calculated rate per sqft")
    expected_monthly_rent_inr: float = Field(..., description="Estimated fair monthly rental income in INR")
    rental_yield_percentage: float = Field(..., description="Gross rental yield percentage")
    roi_percentage: float = Field(..., description="Projected 5-year annualized ROI percentage")
    market_drivers: List[MarketDriver] = Field(default_factory=list, description="Key micro-market value influencers")
    comparable_benchmarks: List[ComparableBenchmark] = Field(default_factory=list, description="Local market pricing comparisons")
    valuation_summary: str = Field(..., description="Executive appraisal narrative")
    timestamp: str
