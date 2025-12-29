"""
Copyright Tool - Example Usage and API Interface
Demonstrates how to use the copyright management system
"""

from datetime import date, datetime
from copyright_core import (
    CopyrightWork, CopyrightHolder, CopyrightLicense, CopyrightRegistry,
    RightType, Territory, CopyrightCalculator
)
from metadata_standards import MetadataConverter, MetadataExporter
from compliance_framework import ComplianceChecker, ComplianceReport, Jurisdiction


class CopyrightAPI:
    """Main API interface for the copyright tool"""
    
    def __init__(self):
        self.registry = CopyrightRegistry()
    
    def create_work(self, title: str, creator_name: str, work_type: str = "literary") -> str:
        """Create a new copyright work"""
        # Create copyright holder
        creator = CopyrightHolder(name=creator_name, entity_type="individual")
        creator_id = self.registry.register_holder(creator)
        
        # Create work
        work = CopyrightWork(
            title=title,
            creators=[creator],
            creation_date=date.today(),
            work_type=work_type,
            country_of_origin="US"
        )
        
        # Validate work
        errors = self.registry.validate_work(work)
        if errors:
            raise ValueError(f"Work validation failed: {', '.join(errors)}")
        
        return self.registry.register_work(work)
    
    def license_work(self, work_id: str, licensee_name: str, rights: list, territories: list) -> str:
        """Create a license for a work"""
        if work_id not in self.registry.works:
            raise ValueError("Work not found")
        
        work = self.registry.works[work_id]
        licensee = CopyrightHolder(name=licensee_name, entity_type="corporation")
        self.registry.register_holder(licensee)
        
        license_obj = CopyrightLicense(
            work_id=work_id,
            licensor=work.creators[0],
            licensee=licensee,
            rights_granted={RightType(right) for right in rights},
            territories={Territory(territory) for territory in territories},
            start_date=datetime.now()
        )
        
        return self.registry.create_license(license_obj)
    
    def get_compliance_report(self, work_id: str, jurisdictions: list) -> dict:
        """Generate compliance report for a work"""
        if work_id not in self.registry.works:
            raise ValueError("Work not found")
        
        work = self.registry.works[work_id]
        target_jurisdictions = [Jurisdiction(j) for j in jurisdictions]
        
        return ComplianceReport.generate_report(work, target_jurisdictions)
    
    def export_metadata(self, work_id: str, format_type: str = "json_ld") -> dict:
        """Export work metadata in specified format"""
        if work_id not in self.registry.works:
            raise ValueError("Work not found")
        
        work = self.registry.works[work_id]
        
        if format_type == "json_ld":
            return MetadataExporter.to_json_ld(work)
        elif format_type == "dublin_core":
            return MetadataConverter.work_to_dublin_core(work).__dict__
        elif format_type == "ddex":
            return MetadataConverter.work_to_ddex(work).__dict__
        else:
            raise ValueError("Unsupported format type")


def demo_usage():
    """Demonstrate the copyright tool functionality"""
    print("=== Copyright Tool Demo ===\n")
    
    # Initialize API
    api = CopyrightAPI()
    
    # Create a work
    print("1. Creating a new work...")
    work_id = api.create_work(
        title="My Original Song",
        creator_name="John Composer",
        work_type="musical"
    )
    print(f"Created work with ID: {work_id}\n")
    
    # License the work
    print("2. Creating a license...")
    license_id = api.license_work(
        work_id=work_id,
        licensee_name="Music Publisher Inc",
        rights=["reproduction", "distribution", "public_performance"],
        territories=["US", "CA", "GB"]
    )
    print(f"Created license with ID: {license_id}\n")
    
    # Generate compliance report
    print("3. Generating compliance report...")
    report = api.get_compliance_report(
        work_id=work_id,
        jurisdictions=["us", "eu", "uk"]
    )
    print("Compliance Report:")
    print(f"  Work: {report['title']}")
    print(f"  Analysis Date: {report['analysis_date']}")
    
    for jurisdiction, data in report['jurisdictions'].items():
        print(f"  {jurisdiction.upper()}: {'✓' if data['compliant'] else '✗'} Compliant")
        if data['issues']:
            for issue in data['issues']:
                print(f"    - {issue}")
    print()
    
    # Export metadata
    print("4. Exporting metadata...")
    metadata = api.export_metadata(work_id, "json_ld")
    print("JSON-LD Metadata:")
    import json
    print(json.dumps(metadata, indent=2))
    print()
    
    # Check copyright expiry
    print("5. Checking copyright terms...")
    work = api.registry.works[work_id]
    us_expiry = CopyrightCalculator.calculate_expiry(work, Territory.US)
    eu_expiry = CopyrightCalculator.calculate_expiry(work, Territory.GB)
    
    print(f"Copyright expires in US: {us_expiry}")
    print(f"Copyright expires in UK: {eu_expiry}")
    print(f"Currently in public domain (US): {CopyrightCalculator.is_public_domain(work, Territory.US)}")


if __name__ == "__main__":
    demo_usage()