# Global Copyright Management Tool

A robust foundation for managing copyright works, licenses, and compliance with international standards.

## Features

### Core Functionality
- **Copyright Work Registration** - Register and manage creative works
- **Rights Management** - Handle different types of copyright rights and territories
- **License Management** - Create and track licensing agreements
- **Global Compliance** - Support for international copyright laws and treaties

### Standards Support
- **Berne Convention** - International copyright treaty compliance
- **WIPO Standards** - World Intellectual Property Organization guidelines
- **DDEX** - Digital Data Exchange for music industry
- **Dublin Core** - Metadata standard for digital resources
- **JSON-LD/RDF** - Semantic web metadata formats

### Jurisdictions Supported
- United States (US)
- European Union (EU)
- United Kingdom (UK)
- Canada (CA)
- Australia (AU)
- Japan (JP)
- And more...

## Quick Start

```python
from copyright_api import CopyrightAPI

# Initialize the API
api = CopyrightAPI()

# Create a new work
work_id = api.create_work(
    title="My Creative Work",
    creator_name="Author Name",
    work_type="literary"
)

# License the work
license_id = api.license_work(
    work_id=work_id,
    licensee_name="Publisher Inc",
    rights=["reproduction", "distribution"],
    territories=["US", "CA"]
)

# Generate compliance report
report = api.get_compliance_report(
    work_id=work_id,
    jurisdictions=["us", "eu"]
)

# Export metadata
metadata = api.export_metadata(work_id, "json_ld")
```

## Architecture

### Core Components

1. **copyright_core.py** - Core data models and registry
   - `CopyrightWork` - Represents creative works
   - `CopyrightHolder` - Rights holders and creators
   - `CopyrightLicense` - License agreements
   - `CopyrightRegistry` - Central management system

2. **metadata_standards.py** - International metadata support
   - Dublin Core metadata
   - DDEX music industry standard
   - JSON-LD and RDF export

3. **compliance_framework.py** - Legal compliance checking
   - Multi-jurisdiction support
   - Treaty compliance (Berne, WIPO, TRIPS)
   - Copyright term calculations

4. **copyright_api.py** - High-level API interface
   - Simplified work creation
   - License management
   - Compliance reporting

## Data Models

### CopyrightWork
- Unique identification
- Creator information
- International identifiers (ISWC, ISBN, etc.)
- Creation and publication dates
- Work classification

### CopyrightLicense
- Rights granted (reproduction, distribution, etc.)
- Territorial scope
- Duration and terms
- Exclusivity settings

### Compliance Checking
- Automatic validation against international standards
- Multi-jurisdiction copyright term calculation
- Treaty compliance verification

## Usage Examples

### Basic Work Registration
```python
work = CopyrightWork(
    title="Example Work",
    creators=[CopyrightHolder(name="Creator Name")],
    creation_date=date.today(),
    work_type="musical"
)
```

### License Creation
```python
license = CopyrightLicense(
    work_id=work.id,
    rights_granted={RightType.REPRODUCTION, RightType.DISTRIBUTION},
    territories={Territory.US, Territory.CA},
    exclusive=False
)
```

### Compliance Report
```python
report = ComplianceReport.generate_report(
    work, 
    [Jurisdiction.US, Jurisdiction.EU]
)
```

## International Standards

### Supported Treaties
- **Berne Convention** - Minimum 50-year protection
- **WIPO Copyright Treaty** - Digital rights protection
- **TRIPS Agreement** - Trade-related intellectual property

### Metadata Standards
- **Dublin Core** - 15 core metadata elements
- **DDEX** - Music industry data exchange
- **Schema.org** - Structured data vocabulary

## Legal Compliance

The tool provides guidance for:
- Copyright term calculations
- Registration requirements
- International treaty obligations
- Public domain determination

**Note**: This tool provides technical infrastructure. Always consult qualified legal counsel for specific copyright matters.

## Extension Points

The architecture supports easy extension for:
- Additional jurisdictions
- New metadata standards
- Custom rights types
- Integration with copyright offices
- Database persistence
- Web API deployment

## Demo

Run the demo to see the tool in action:

```bash
python copyright_api.py
```

This will demonstrate:
1. Work creation
2. License generation
3. Compliance checking
4. Metadata export
5. Copyright term calculation