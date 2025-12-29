"""
Copyright Tool - Core Foundation
Implements global copyright standards and rights management
"""

from dataclasses import dataclass, field
from datetime import datetime, date
from enum import Enum
from typing import List, Dict, Optional, Set
import uuid


class RightType(Enum):
    """Standard copyright right types based on international law"""
    REPRODUCTION = "reproduction"
    DISTRIBUTION = "distribution"
    PUBLIC_PERFORMANCE = "public_performance"
    PUBLIC_DISPLAY = "public_display"
    DERIVATIVE_WORKS = "derivative_works"
    DIGITAL_TRANSMISSION = "digital_transmission"
    SYNCHRONIZATION = "synchronization"
    MECHANICAL = "mechanical"


class Territory(Enum):
    """ISO 3166-1 alpha-2 country codes for territorial rights"""
    WORLDWIDE = "WW"
    US = "US"
    CA = "CA"
    GB = "GB"
    DE = "DE"
    FR = "FR"
    JP = "JP"
    AU = "AU"
    # Add more as needed


@dataclass
class CopyrightHolder:
    """Represents a copyright holder entity"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    name: str = ""
    entity_type: str = "individual"  # individual, corporation, organization
    contact_info: Dict[str, str] = field(default_factory=dict)
    ipi_number: Optional[str] = None  # Interested Party Information
    isni: Optional[str] = None  # International Standard Name Identifier


@dataclass
class CopyrightWork:
    """Core copyright work representation following international standards"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    title: str = ""
    creators: List[CopyrightHolder] = field(default_factory=list)
    creation_date: Optional[date] = None
    publication_date: Optional[date] = None
    registration_number: Optional[str] = None
    work_type: str = "literary"  # literary, musical, artistic, dramatic, etc.
    
    # International identifiers
    iswc: Optional[str] = None  # International Standard Musical Work Code
    isbn: Optional[str] = None  # International Standard Book Number
    issn: Optional[str] = None  # International Standard Serial Number
    
    # Metadata
    description: str = ""
    language: str = "en"
    country_of_origin: str = "US"


@dataclass
class CopyrightLicense:
    """Represents a copyright license agreement"""
    id: str = field(default_factory=lambda: str(uuid.uuid4()))
    work_id: str = ""
    licensor: CopyrightHolder = field(default_factory=CopyrightHolder)
    licensee: CopyrightHolder = field(default_factory=CopyrightHolder)
    rights_granted: Set[RightType] = field(default_factory=set)
    territories: Set[Territory] = field(default_factory=set)
    start_date: datetime = field(default_factory=datetime.now)
    end_date: Optional[datetime] = None
    exclusive: bool = False
    royalty_rate: Optional[float] = None
    terms: str = ""


class CopyrightRegistry:
    """Central registry for managing copyright works and licenses"""
    
    def __init__(self):
        self.works: Dict[str, CopyrightWork] = {}
        self.holders: Dict[str, CopyrightHolder] = {}
        self.licenses: Dict[str, CopyrightLicense] = {}
    
    def register_work(self, work: CopyrightWork) -> str:
        """Register a new copyright work"""
        self.works[work.id] = work
        return work.id
    
    def register_holder(self, holder: CopyrightHolder) -> str:
        """Register a copyright holder"""
        self.holders[holder.id] = holder
        return holder.id
    
    def create_license(self, license_data: CopyrightLicense) -> str:
        """Create a new license agreement"""
        if license_data.work_id not in self.works:
            raise ValueError("Work not found in registry")
        
        self.licenses[license_data.id] = license_data
        return license_data.id
    
    def get_work_rights(self, work_id: str, territory: Territory = Territory.WORLDWIDE) -> List[CopyrightLicense]:
        """Get all active licenses for a work in a territory"""
        return [
            license for license in self.licenses.values()
            if license.work_id == work_id 
            and (territory in license.territories or Territory.WORLDWIDE in license.territories)
            and (license.end_date is None or license.end_date > datetime.now())
        ]
    
    def validate_work(self, work: CopyrightWork) -> List[str]:
        """Validate work against international standards"""
        errors = []
        
        if not work.title.strip():
            errors.append("Title is required")
        
        if not work.creators:
            errors.append("At least one creator is required")
        
        if work.creation_date and work.creation_date > date.today():
            errors.append("Creation date cannot be in the future")
        
        return errors


class CopyrightCalculator:
    """Calculate copyright terms based on international standards"""
    
    @staticmethod
    def calculate_expiry(work: CopyrightWork, territory: Territory = Territory.US) -> Optional[date]:
        """Calculate copyright expiry date based on territory laws"""
        if not work.creation_date:
            return None
        
        # Simplified calculation - actual implementation would need comprehensive legal rules
        if territory == Territory.US:
            # US: Life + 70 years for individual works, 95 years for corporate works
            return date(work.creation_date.year + 95, 12, 31)
        elif territory in [Territory.GB, Territory.DE, Territory.FR]:
            # EU: Life + 70 years
            return date(work.creation_date.year + 70, 12, 31)
        else:
            # Default: Berne Convention minimum (Life + 50)
            return date(work.creation_date.year + 50, 12, 31)
    
    @staticmethod
    def is_public_domain(work: CopyrightWork, territory: Territory = Territory.US) -> bool:
        """Check if work is in public domain"""
        expiry = CopyrightCalculator.calculate_expiry(work, territory)
        return expiry is not None and expiry < date.today()