"""
CWR 2.0 Integration Example
Shows how to integrate CWR forms with the copyright system
"""

from datetime import date
from cwr_forms import (
    CWRWorkForm, CWRInterestedParty, CWRWorkCredit, CWRFormValidator, CWRFormBuilder,
    CWRWorkType, CWRRoleCode, CWRTerritoryCode
)
from copyright_core import CopyrightWork, CopyrightHolder, CopyrightRegistry


class CWRIntegration:
    """Integration between CWR forms and copyright system"""
    
    def __init__(self, registry: CopyrightRegistry):
        self.registry = registry
    
    def process_cwr_form(self, cwr_form: CWRWorkForm) -> str:
        """Process CWR form and create copyright work"""
        # Validate form first
        validation = CWRFormValidator.validate_form(cwr_form)
        if not validation.is_valid:
            raise ValueError(f"CWR form validation failed: {', '.join(validation.errors)}")
        
        # Convert CWR interested parties to copyright holders
        creators = []
        for party in cwr_form.interested_parties:
            holder = CopyrightHolder(
                name=party.ip_name or f"{party.ip_writer_first_name} {party.ip_writer_last_name}",
                entity_type="individual",
                contact_info={
                    "email": party.email,
                    "country": party.country,
                    "phone": party.telephone
                },
                ipi_number=party.ipi_name_number
            )
            creators.append(holder)
            self.registry.register_holder(holder)
        
        # Create copyright work from CWR data
        work = CopyrightWork(
            title=cwr_form.work_title,
            creators=creators,
            creation_date=cwr_form.creation_date,
            publication_date=cwr_form.publication_date,
            work_type=cwr_form.work_type.value.lower(),
            iswc=cwr_form.iswc,
            description=cwr_form.work_comment,
            language=cwr_form.language_code.lower(),
            country_of_origin=creators[0].contact_info.get("country", "US") if creators else "US"
        )
        
        return self.registry.register_work(work)


def demo_cwr_form():
    """Demonstrate CWR form usage"""
    print("=== CWR 2.0 Form Demo ===\n")
    
    # Example frontend JSON data
    frontend_data = {
        "work_title": "My New Song",
        "work_type": "MUS",
        "iswc": "T-123456789-0",
        "duration": "032500",  # 3:25:00
        "language_code": "EN",
        "creation_date": "2024-01-15",
        "interested_parties": [
            {
                "name": "John Composer",
                "first_name": "John",
                "last_name": "Composer",
                "ipi_number": "12345678901",
                "email": "john@example.com",
                "country": "US"
            },
            {
                "name": "Music Publisher Inc",
                "first_name": "",
                "last_name": "",
                "ipi_number": "98765432109",
                "email": "contact@publisher.com",
                "country": "US"
            }
        ],
        "work_credits": [
            {
                "ip_number": "1",
                "role_code": "C",
                "writer_share": 50.0,
                "publisher_share": 0.0
            },
            {
                "ip_number": "2",
                "role_code": "E",
                "writer_share": 0.0,
                "publisher_share": 50.0
            }
        ]
    }
    
    # Build CWR form from frontend data
    print("1. Building CWR form from frontend data...")
    cwr_form = CWRFormBuilder.from_dict(frontend_data)
    print(f"Created form for work: {cwr_form.work_title}")
    print(f"Interested parties: {len(cwr_form.interested_parties)}")
    print(f"Work credits: {len(cwr_form.work_credits)}")
    print()
    
    # Validate the form
    print("2. Validating CWR form...")
    validation = CWRFormValidator.validate_form(cwr_form)
    print(f"Form valid: {validation.is_valid}")
    if validation.errors:
        print("Errors:")
        for error in validation.errors:
            print(f"  - {error}")
    if validation.warnings:
        print("Warnings:")
        for warning in validation.warnings:
            print(f"  - {warning}")
    print()
    
    # Integrate with copyright system
    print("3. Integrating with copyright system...")
    from copyright_core import CopyrightRegistry
    registry = CopyrightRegistry()
    integration = CWRIntegration(registry)
    
    try:
        work_id = integration.process_cwr_form(cwr_form)
        print(f"Successfully created copyright work: {work_id}")
        
        # Show the created work
        work = registry.works[work_id]
        print(f"Work title: {work.title}")
        print(f"Creators: {[c.name for c in work.creators]}")
        print(f"ISWC: {work.iswc}")
        print()
        
    except ValueError as e:
        print(f"Error processing form: {e}")
    
    # Convert back to dict for frontend
    print("4. Converting back to frontend format...")
    form_dict = CWRFormBuilder.to_dict(cwr_form)
    print("Form data ready for frontend:")
    import json
    print(json.dumps(form_dict, indent=2, default=str))


def create_sample_form() -> CWRWorkForm:
    """Create a sample CWR form for testing"""
    form = CWRWorkForm()
    form.work_title = "Sample Musical Work"
    form.work_type = CWRWorkType.MUSICAL
    form.creation_date = date.today()
    form.duration = "032000"  # 3:20:00
    form.language_code = "EN"
    
    # Add interested party
    party = CWRInterestedParty()
    party.ip_name = "Sample Composer"
    party.ip_writer_first_name = "Sample"
    party.ip_writer_last_name = "Composer"
    party.email = "composer@example.com"
    party.country = "US"
    form.interested_parties.append(party)
    
    # Add work credit
    credit = CWRWorkCredit()
    credit.ip_number = "1"
    credit.role_code = CWRRoleCode.COMPOSER
    credit.writer_share = 100.0
    credit.publisher_share = 0.0
    form.work_credits.append(credit)
    
    return form


if __name__ == "__main__":
    demo_cwr_form()