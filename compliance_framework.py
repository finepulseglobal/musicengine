"""
Copyright Compliance Framework
Handles different jurisdictions and international treaty compliance
"""

from dataclasses import dataclass
from enum import Enum
from typing import Dict, List, Optional, Set
from datetime import date, timedelta


class Treaty(Enum):
    """International copyright treaties"""
    BERNE_CONVENTION = "berne"
    UNIVERSAL_COPYRIGHT = "ucc"
    WIPO_COPYRIGHT = "wct"
    TRIPS_AGREEMENT = "trips"
    ROME_CONVENTION = "rome"


class Jurisdiction(Enum):
    """Legal jurisdictions with specific copyright laws"""
    US = "us"
    EU = "eu"
    UK = "uk"
    CANADA = "ca"
    AUSTRALIA = "au"
    JAPAN = "jp"
    CHINA = "cn"
    INDIA = "in"


@dataclass
class CopyrightTerm:
    """Copyright term rules for different jurisdictions"""
    jurisdiction: Jurisdiction
    individual_term: int  # Years after death
    corporate_term: int   # Years from creation/publication
    anonymous_term: int   # Years for anonymous works
    minimum_term: int     # Minimum protection period
    
    # Special rules
    war_extensions: bool = False  # WWII extensions (EU)
    renewal_required: bool = False  # Pre-1978 US works
    registration_required: bool = False


class ComplianceChecker:
    """Check compliance with international copyright standards"""
    
    # Standard copyright terms by jurisdiction
    TERMS = {
        Jurisdiction.US: CopyrightTerm(
            jurisdiction=Jurisdiction.US,
            individual_term=70,
            corporate_term=95,
            anonymous_term=95,
            minimum_term=25,
            renewal_required=False  # Post-1978
        ),
        Jurisdiction.EU: CopyrightTerm(
            jurisdiction=Jurisdiction.EU,
            individual_term=70,
            corporate_term=70,
            anonymous_term=70,
            minimum_term=25,
            war_extensions=True
        ),
        Jurisdiction.UK: CopyrightTerm(
            jurisdiction=Jurisdiction.UK,
            individual_term=70,
            corporate_term=70,
            anonymous_term=70,
            minimum_term=25
        ),
        Jurisdiction.CANADA: CopyrightTerm(
            jurisdiction=Jurisdiction.CANADA,
            individual_term=50,  # Recently extended to 70
            corporate_term=75,
            anonymous_term=75,
            minimum_term=25
        )
    }
    
    @staticmethod
    def check_berne_compliance(work) -> List[str]:
        """Check compliance with Berne Convention"""
        issues = []
        
        # Berne Convention requirements
        if not work.creators:
            issues.append("Berne: Work must have identifiable author")
        
        if work.creation_date and work.creation_date < date(1886, 9, 9):
            issues.append("Berne: Work predates Berne Convention")
        
        # Minimum 50-year term requirement
        if work.creation_date:
            min_expiry = date(work.creation_date.year + 50, 12, 31)
            if min_expiry < date.today():
                issues.append("Berne: Minimum 50-year term may have expired")
        
        return issues
    
    @staticmethod
    def check_jurisdiction_compliance(work, jurisdiction: Jurisdiction) -> List[str]:
        """Check compliance with specific jurisdiction"""
        issues = []
        
        if jurisdiction not in ComplianceChecker.TERMS:
            issues.append(f"Jurisdiction {jurisdiction.value} not supported")
            return issues
        
        term_rules = ComplianceChecker.TERMS[jurisdiction]
        
        # Check registration requirements
        if term_rules.registration_required and not work.registration_number:
            issues.append(f"{jurisdiction.value}: Registration required but not provided")
        
        # Check if work is still protected
        if work.creation_date:
            corporate_expiry = date(work.creation_date.year + term_rules.corporate_term, 12, 31)
            if corporate_expiry < date.today():
                issues.append(f"{jurisdiction.value}: Copyright may have expired")
        
        return issues
    
    @staticmethod
    def get_applicable_treaties(work, territories: Set[str]) -> Set[Treaty]:
        """Determine which treaties apply to a work"""
        treaties = set()
        
        # Most countries are Berne Convention members
        treaties.add(Treaty.BERNE_CONVENTION)
        
        # WTO members follow TRIPS
        treaties.add(Treaty.TRIPS_AGREEMENT)
        
        # WIPO Copyright Treaty for digital rights
        if any(territory in ["US", "EU", "CA", "AU", "JP"] for territory in territories):
            treaties.add(Treaty.WIPO_COPYRIGHT)
        
        return treaties


class RightsCalculator:
    """Calculate rights and terms across jurisdictions"""
    
    @staticmethod
    def calculate_protection_period(work, jurisdiction: Jurisdiction) -> Optional[date]:
        """Calculate when copyright protection ends"""
        if not work.creation_date:
            return None
        
        if jurisdiction not in ComplianceChecker.TERMS:
            return None
        
        term_rules = ComplianceChecker.TERMS[jurisdiction]
        
        # Simplified calculation for corporate works
        expiry_year = work.creation_date.year + term_rules.corporate_term
        return date(expiry_year, 12, 31)
    
    @staticmethod
    def get_shortest_term(work, jurisdictions: List[Jurisdiction]) -> Optional[date]:
        """Get the shortest protection period across jurisdictions"""
        terms = []
        
        for jurisdiction in jurisdictions:
            term = RightsCalculator.calculate_protection_period(work, jurisdiction)
            if term:
                terms.append(term)
        
        return min(terms) if terms else None
    
    @staticmethod
    def is_protected_in_jurisdiction(work, jurisdiction: Jurisdiction) -> bool:
        """Check if work is still protected in a jurisdiction"""
        expiry = RightsCalculator.calculate_protection_period(work, jurisdiction)
        return expiry is not None and expiry > date.today()


class ComplianceReport:
    """Generate compliance reports for copyright works"""
    
    @staticmethod
    def generate_report(work, target_jurisdictions: List[Jurisdiction]) -> Dict:
        """Generate comprehensive compliance report"""
        report = {
            "work_id": work.id,
            "title": work.title,
            "analysis_date": date.today().isoformat(),
            "jurisdictions": {},
            "treaties": {},
            "recommendations": []
        }
        
        # Analyze each jurisdiction
        for jurisdiction in target_jurisdictions:
            issues = ComplianceChecker.check_jurisdiction_compliance(work, jurisdiction)
            protection_end = RightsCalculator.calculate_protection_period(work, jurisdiction)
            
            report["jurisdictions"][jurisdiction.value] = {
                "compliant": len(issues) == 0,
                "issues": issues,
                "protection_ends": protection_end.isoformat() if protection_end else None,
                "currently_protected": RightsCalculator.is_protected_in_jurisdiction(work, jurisdiction)
            }
        
        # Check treaty compliance
        territories = {jurisdiction.value.upper() for jurisdiction in target_jurisdictions}
        applicable_treaties = ComplianceChecker.get_applicable_treaties(work, territories)
        
        for treaty in applicable_treaties:
            if treaty == Treaty.BERNE_CONVENTION:
                issues = ComplianceChecker.check_berne_compliance(work)
                report["treaties"][treaty.value] = {
                    "compliant": len(issues) == 0,
                    "issues": issues
                }
        
        # Generate recommendations
        if not work.registration_number:
            report["recommendations"].append("Consider registering work for enhanced protection")
        
        if not work.creators:
            report["recommendations"].append("Ensure proper authorship attribution")
        
        return report