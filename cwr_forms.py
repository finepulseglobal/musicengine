"""
CWR 2.0 Form Data Structures
Common Works Registration standard for collecting musical work information
"""

from dataclasses import dataclass, field
from typing import List, Optional, Dict, Any
from enum import Enum
from datetime import date


class CWRWorkType(Enum):
    """CWR work types"""
    MUSICAL = "MUS"
    DRAMATIC_MUSICAL = "DMU"
    COMPOSITE = "COM"
    MEDLEY = "MED"
    POTPOURRI = "POT"


class CWRRoleCode(Enum):
    """CWR interested party role codes"""
    ADAPTER = "AD"
    AUTHOR = "A"
    COMPOSER = "C"
    LYRICIST = "CA"
    ARRANGER = "AR"
    TRANSLATOR = "TR"
    SUB_AUTHOR = "SA"
    SUB_COMPOSER = "SC"
    SUB_PUBLISHER = "SE"
    ORIGINAL_PUBLISHER = "E"
    ADMINISTRATOR = "AM"


class CWRTerritoryCode(Enum):
    """CWR territory codes (ISO 3166-1)"""
    WORLDWIDE = "2136"
    UNITED_STATES = "2840"
    CANADA = "124"
    UNITED_KINGDOM = "826"
    GERMANY = "276"
    FRANCE = "250"
    JAPAN = "392"
    AUSTRALIA = "036"


@dataclass
class CWRInterestedParty:
    """CWR Interested Party Information"""
    # Required fields
    ip_name: str = ""
    ip_writer_first_name: str = ""
    ip_writer_last_name: str = ""
    
    # Optional identification
    ip_number: Optional[str] = None  # Internal IP number
    ipi_name_number: Optional[str] = None  # IPI name number
    ipi_base_number: Optional[str] = None  # IPI base number
    
    # Contact information
    ip_writer_first_name_2: str = ""
    ip_writer_last_name_2: str = ""
    birth_date: Optional[date] = None
    death_date: Optional[date] = None
    
    # Address
    address_line_1: str = ""
    address_line_2: str = ""
    address_line_3: str = ""
    city: str = ""
    postal_code: str = ""
    country: str = ""
    
    # Contact details
    telephone: str = ""
    fax: str = ""
    email: str = ""


@dataclass
class CWRWorkCredit:
    """CWR Work Credit (Writer/Publisher share)"""
    ip_number: str = ""
    role_code: CWRRoleCode = CWRRoleCode.COMPOSER
    
    # Share percentages (0-100)
    writer_share: float = 0.0
    publisher_share: float = 0.0
    
    # Territory
    territory_code: CWRTerritoryCode = CWRTerritoryCode.WORLDWIDE
    
    # Optional
    pseudonym: str = ""
    writer_unknown_indicator: bool = False


@dataclass
class CWRWorkIdentifier:
    """CWR Work Identifier"""
    identifier_type: str = ""  # ISWC, WI, etc.
    identifier_value: str = ""
    validity: str = "Y"  # Y/N


@dataclass
class CWRWorkForm:
    """CWR 2.0 Work Registration Form"""
    
    # Work Header Information
    work_title: str = ""
    work_id: str = ""  # Internal work ID
    work_type: CWRWorkType = CWRWorkType.MUSICAL
    
    # Work identifiers
    iswc: str = ""
    work_identifiers: List[CWRWorkIdentifier] = field(default_factory=list)
    
    # Dates
    creation_date: Optional[date] = None
    publication_date: Optional[date] = None
    registration_date: Optional[date] = None
    
    # Work details
    duration: str = ""  # HHMMSS format
    recorded_indicator: str = "Y"  # Y/N/U
    text_music_relationship: str = "MTX"  # MTX, MUS, TXT
    composite_type: str = ""
    version_type: str = "ORI"  # ORI, MOD, etc.
    excerpt_type: str = ""
    music_arrangement: str = ""
    lyric_adaptation: str = ""
    
    # Language and territory
    language_code: str = "EN"
    copyright_date: Optional[date] = None
    copyright_number: str = ""
    
    # Interested parties and credits
    interested_parties: List[CWRInterestedParty] = field(default_factory=list)
    work_credits: List[CWRWorkCredit] = field(default_factory=list)
    
    # Additional information
    contact_name: str = ""
    contact_id: str = ""
    work_comment: str = ""
    
    # Submitter information
    submitter_name: str = ""
    submitter_ipi: str = ""


@dataclass
class CWRFormValidation:
    """CWR form validation results"""
    is_valid: bool = True
    errors: List[str] = field(default_factory=list)
    warnings: List[str] = field(default_factory=list)


class CWRFormValidator:
    """Validate CWR form data"""
    
    @staticmethod
    def validate_form(form: CWRWorkForm) -> CWRFormValidation:
        """Validate complete CWR form"""
        validation = CWRFormValidation()
        
        # Required field validation
        if not form.work_title.strip():
            validation.errors.append("Work title is required")
        
        if not form.interested_parties:
            validation.errors.append("At least one interested party is required")
        
        if not form.work_credits:
            validation.errors.append("At least one work credit is required")
        
        # Validate interested parties
        for i, party in enumerate(form.interested_parties):
            party_errors = CWRFormValidator._validate_interested_party(party, i)
            validation.errors.extend(party_errors)
        
        # Validate work credits
        credit_errors = CWRFormValidator._validate_work_credits(form.work_credits)
        validation.errors.extend(credit_errors)
        
        # ISWC format validation
        if form.iswc and not CWRFormValidator._validate_iswc(form.iswc):
            validation.errors.append("Invalid ISWC format")
        
        # Duration format validation
        if form.duration and not CWRFormValidator._validate_duration(form.duration):
            validation.errors.append("Duration must be in HHMMSS format")
        
        validation.is_valid = len(validation.errors) == 0
        return validation
    
    @staticmethod
    def _validate_interested_party(party: CWRInterestedParty, index: int) -> List[str]:
        """Validate individual interested party"""
        errors = []
        prefix = f"Interested Party {index + 1}: "
        
        if not party.ip_name.strip() and not (party.ip_writer_first_name.strip() and party.ip_writer_last_name.strip()):
            errors.append(f"{prefix}Name or first/last name is required")
        
        if party.ipi_name_number and len(party.ipi_name_number) != 11:
            errors.append(f"{prefix}IPI name number must be 11 digits")
        
        if party.email and "@" not in party.email:
            errors.append(f"{prefix}Invalid email format")
        
        return errors
    
    @staticmethod
    def _validate_work_credits(credits: List[CWRWorkCredit]) -> List[str]:
        """Validate work credits and shares"""
        errors = []
        
        # Check total shares don't exceed 100%
        total_writer_share = sum(credit.writer_share for credit in credits)
        total_publisher_share = sum(credit.publisher_share for credit in credits)
        
        if total_writer_share > 100:
            errors.append(f"Total writer share ({total_writer_share}%) exceeds 100%")
        
        if total_publisher_share > 100:
            errors.append(f"Total publisher share ({total_publisher_share}%) exceeds 100%")
        
        # Validate individual credits
        for i, credit in enumerate(credits):
            if not credit.ip_number.strip():
                errors.append(f"Credit {i + 1}: IP number is required")
            
            if credit.writer_share < 0 or credit.writer_share > 100:
                errors.append(f"Credit {i + 1}: Writer share must be 0-100%")
            
            if credit.publisher_share < 0 or credit.publisher_share > 100:
                errors.append(f"Credit {i + 1}: Publisher share must be 0-100%")
        
        return errors
    
    @staticmethod
    def _validate_iswc(iswc: str) -> bool:
        """Validate ISWC format (T-123456789-C)"""
        import re
        pattern = r'^T-\d{9}-\d$'
        return bool(re.match(pattern, iswc))
    
    @staticmethod
    def _validate_duration(duration: str) -> bool:
        """Validate duration format (HHMMSS)"""
        import re
        pattern = r'^\d{6}$'
        if not re.match(pattern, duration):
            return False
        
        # Check valid time values
        hours = int(duration[:2])
        minutes = int(duration[2:4])
        seconds = int(duration[4:6])
        
        return minutes < 60 and seconds < 60


class CWRFormBuilder:
    """Helper to build CWR forms from frontend data"""
    
    @staticmethod
    def from_dict(data: Dict[str, Any]) -> CWRWorkForm:
        """Create CWR form from dictionary (e.g., JSON from frontend)"""
        form = CWRWorkForm()
        
        # Basic work information
        form.work_title = data.get('work_title', '')
        form.work_id = data.get('work_id', '')
        form.work_type = CWRWorkType(data.get('work_type', 'MUS'))
        form.iswc = data.get('iswc', '')
        form.duration = data.get('duration', '')
        form.language_code = data.get('language_code', 'EN')
        
        # Dates
        if data.get('creation_date'):
            form.creation_date = date.fromisoformat(data['creation_date'])
        if data.get('publication_date'):
            form.publication_date = date.fromisoformat(data['publication_date'])
        
        # Interested parties
        for party_data in data.get('interested_parties', []):
            party = CWRInterestedParty()
            party.ip_name = party_data.get('name', '')
            party.ip_writer_first_name = party_data.get('first_name', '')
            party.ip_writer_last_name = party_data.get('last_name', '')
            party.ipi_name_number = party_data.get('ipi_number', '')
            party.email = party_data.get('email', '')
            party.country = party_data.get('country', '')
            form.interested_parties.append(party)
        
        # Work credits
        for credit_data in data.get('work_credits', []):
            credit = CWRWorkCredit()
            credit.ip_number = credit_data.get('ip_number', '')
            credit.role_code = CWRRoleCode(credit_data.get('role_code', 'C'))
            credit.writer_share = float(credit_data.get('writer_share', 0))
            credit.publisher_share = float(credit_data.get('publisher_share', 0))
            form.work_credits.append(credit)
        
        return form
    
    @staticmethod
    def to_dict(form: CWRWorkForm) -> Dict[str, Any]:
        """Convert CWR form to dictionary for frontend"""
        return {
            'work_title': form.work_title,
            'work_id': form.work_id,
            'work_type': form.work_type.value,
            'iswc': form.iswc,
            'duration': form.duration,
            'language_code': form.language_code,
            'creation_date': form.creation_date.isoformat() if form.creation_date else None,
            'publication_date': form.publication_date.isoformat() if form.publication_date else None,
            'interested_parties': [
                {
                    'name': party.ip_name,
                    'first_name': party.ip_writer_first_name,
                    'last_name': party.ip_writer_last_name,
                    'ipi_number': party.ipi_name_number,
                    'email': party.email,
                    'country': party.country
                }
                for party in form.interested_parties
            ],
            'work_credits': [
                {
                    'ip_number': credit.ip_number,
                    'role_code': credit.role_code.value,
                    'writer_share': credit.writer_share,
                    'publisher_share': credit.publisher_share
                }
                for credit in form.work_credits
            ]
        }