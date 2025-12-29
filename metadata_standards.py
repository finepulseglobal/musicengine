"""
Copyright Metadata Standards
Supports DDEX, Dublin Core, and other international metadata standards
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from datetime import datetime
import json


@dataclass
class DublinCoreMetadata:
    """Dublin Core metadata standard for copyright works"""
    title: str = ""
    creator: List[str] = field(default_factory=list)
    subject: List[str] = field(default_factory=list)
    description: str = ""
    publisher: str = ""
    contributor: List[str] = field(default_factory=list)
    date: Optional[str] = None
    type: str = ""
    format: str = ""
    identifier: str = ""
    source: str = ""
    language: str = "en"
    relation: List[str] = field(default_factory=list)
    coverage: str = ""
    rights: str = ""


@dataclass
class DDEXMetadata:
    """DDEX (Digital Data Exchange) metadata for music industry"""
    release_id: str = ""
    title: str = ""
    artists: List[Dict[str, str]] = field(default_factory=list)
    label: str = ""
    genre: List[str] = field(default_factory=list)
    release_date: Optional[str] = None
    p_line: str = ""  # Phonogram copyright
    c_line: str = ""  # Copyright line
    territory_codes: List[str] = field(default_factory=list)
    usage_rights: List[str] = field(default_factory=list)


class MetadataConverter:
    """Convert between different metadata standards"""
    
    @staticmethod
    def work_to_dublin_core(work) -> DublinCoreMetadata:
        """Convert CopyrightWork to Dublin Core metadata"""
        return DublinCoreMetadata(
            title=work.title,
            creator=[creator.name for creator in work.creators],
            description=work.description,
            date=work.creation_date.isoformat() if work.creation_date else None,
            type=work.work_type,
            identifier=work.id,
            language=work.language,
            rights=f"Copyright {work.creation_date.year if work.creation_date else 'Unknown'}"
        )
    
    @staticmethod
    def work_to_ddex(work) -> DDEXMetadata:
        """Convert CopyrightWork to DDEX metadata"""
        return DDEXMetadata(
            release_id=work.id,
            title=work.title,
            artists=[{"name": creator.name, "role": "MainArtist"} for creator in work.creators],
            release_date=work.publication_date.isoformat() if work.publication_date else None,
            c_line=f"© {work.creation_date.year if work.creation_date else 'Unknown'} {work.creators[0].name if work.creators else 'Unknown'}",
            territory_codes=[work.country_of_origin]
        )


class MetadataValidator:
    """Validate metadata against international standards"""
    
    @staticmethod
    def validate_dublin_core(metadata: DublinCoreMetadata) -> List[str]:
        """Validate Dublin Core metadata"""
        errors = []
        
        if not metadata.title:
            errors.append("Dublin Core: Title is required")
        
        if not metadata.creator:
            errors.append("Dublin Core: At least one creator is required")
        
        if not metadata.identifier:
            errors.append("Dublin Core: Identifier is required")
        
        return errors
    
    @staticmethod
    def validate_ddex(metadata: DDEXMetadata) -> List[str]:
        """Validate DDEX metadata"""
        errors = []
        
        if not metadata.title:
            errors.append("DDEX: Title is required")
        
        if not metadata.artists:
            errors.append("DDEX: At least one artist is required")
        
        if not metadata.release_id:
            errors.append("DDEX: Release ID is required")
        
        return errors


class MetadataExporter:
    """Export metadata in various standard formats"""
    
    @staticmethod
    def to_json_ld(work) -> Dict[str, Any]:
        """Export as JSON-LD with schema.org vocabulary"""
        return {
            "@context": "https://schema.org/",
            "@type": "CreativeWork",
            "name": work.title,
            "creator": [{"@type": "Person", "name": creator.name} for creator in work.creators],
            "dateCreated": work.creation_date.isoformat() if work.creation_date else None,
            "datePublished": work.publication_date.isoformat() if work.publication_date else None,
            "description": work.description,
            "inLanguage": work.language,
            "copyrightYear": work.creation_date.year if work.creation_date else None,
            "identifier": work.id
        }
    
    @staticmethod
    def to_rdf_xml(work) -> str:
        """Export as RDF/XML"""
        # Simplified RDF/XML generation
        rdf_template = """<?xml version="1.0" encoding="UTF-8"?>
<rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
         xmlns:dc="http://purl.org/dc/elements/1.1/">
  <rdf:Description rdf:about="{id}">
    <dc:title>{title}</dc:title>
    <dc:creator>{creator}</dc:creator>
    <dc:date>{date}</dc:date>
    <dc:description>{description}</dc:description>
    <dc:language>{language}</dc:language>
    <dc:rights>Copyright {year}</dc:rights>
  </rdf:Description>
</rdf:RDF>"""
        
        return rdf_template.format(
            id=work.id,
            title=work.title,
            creator=work.creators[0].name if work.creators else "Unknown",
            date=work.creation_date.isoformat() if work.creation_date else "",
            description=work.description,
            language=work.language,
            year=work.creation_date.year if work.creation_date else "Unknown"
        )