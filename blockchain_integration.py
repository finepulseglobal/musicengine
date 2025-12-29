"""
Smart Contract Integration for Copyright System
Provides Python interface to interact with copyright smart contracts
"""

from dataclasses import dataclass
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import json


@dataclass
class ContractWork:
    """Represents a work on the blockchain"""
    work_id: int
    title: str
    iswc: str
    creation_date: datetime
    creators: List[str]
    creator_shares: List[int]  # Basis points
    metadata_uri: str
    is_active: bool


@dataclass
class ContractLicense:
    """Represents a license on the blockchain"""
    license_id: int
    work_id: int
    licensee: str
    rights: List[int]
    start_date: datetime
    end_date: datetime
    royalty_rate: int  # Basis points
    exclusive: bool
    is_active: bool


class SmartContractInterface:
    """Interface for interacting with copyright smart contracts"""
    
    def __init__(self, contract_address: str = None, web3_provider: str = None):
        self.contract_address = contract_address
        self.web3_provider = web3_provider
        self.contract_abi = self._load_contract_abi()
    
    def register_work(
        self,
        title: str,
        iswc: str,
        creators: List[str],
        shares: List[int],
        metadata_uri: str
    ) -> Dict[str, Any]:
        """Register a copyright work on blockchain"""
        # Validate shares sum to 10000 (100%)
        if sum(shares) != 10000:
            raise ValueError("Shares must sum to 100% (10000 basis points)")
        
        # Simulate contract call
        transaction_data = {
            "function": "registerWork",
            "parameters": {
                "title": title,
                "iswc": iswc,
                "creators": creators,
                "shares": shares,
                "metadataURI": metadata_uri
            },
            "estimated_gas": 150000,
            "estimated_cost": "0.005 ETH"
        }
        
        return {
            "success": True,
            "transaction_hash": f"0x{'a' * 64}",  # Mock hash
            "work_id": 1,
            "transaction_data": transaction_data
        }
    
    def create_license(
        self,
        work_id: int,
        licensee: str,
        rights: List[int],
        duration_days: int,
        royalty_rate: int,
        exclusive: bool = False
    ) -> Dict[str, Any]:
        """Create a license for a work"""
        duration_seconds = duration_days * 24 * 60 * 60
        
        transaction_data = {
            "function": "createLicense",
            "parameters": {
                "workId": work_id,
                "licensee": licensee,
                "rights": rights,
                "duration": duration_seconds,
                "royaltyRate": royalty_rate,
                "exclusive": exclusive
            },
            "estimated_gas": 100000,
            "estimated_cost": "0.003 ETH"
        }
        
        return {
            "success": True,
            "transaction_hash": f"0x{'b' * 64}",
            "license_id": 1,
            "transaction_data": transaction_data
        }
    
    def pay_royalty(self, work_id: int, amount_wei: int) -> Dict[str, Any]:
        """Pay royalty to work creators"""
        transaction_data = {
            "function": "payRoyalty",
            "parameters": {
                "workId": work_id
            },
            "value": amount_wei,
            "estimated_gas": 80000,
            "estimated_cost": f"{amount_wei / 10**18} ETH"
        }
        
        return {
            "success": True,
            "transaction_hash": f"0x{'c' * 64}",
            "transaction_data": transaction_data
        }
    
    def get_work(self, work_id: int) -> Optional[ContractWork]:
        """Retrieve work information from blockchain"""
        # Mock data - in real implementation, this would call the contract
        return ContractWork(
            work_id=work_id,
            title="Sample Work",
            iswc="T-123456789-0",
            creation_date=datetime.now(),
            creators=["0x1234567890123456789012345678901234567890"],
            creator_shares=[10000],
            metadata_uri="ipfs://QmHash",
            is_active=True
        )
    
    def get_license(self, license_id: int) -> Optional[ContractLicense]:
        """Retrieve license information from blockchain"""
        return ContractLicense(
            license_id=license_id,
            work_id=1,
            licensee="0x0987654321098765432109876543210987654321",
            rights=[1, 2, 4],  # reproduction, distribution, performance
            start_date=datetime.now(),
            end_date=datetime.now() + timedelta(days=365),
            royalty_rate=1000,  # 10%
            exclusive=False,
            is_active=True
        )
    
    def get_creator_works(self, creator_address: str) -> List[int]:
        """Get all works created by an address"""
        return [1, 2, 3]  # Mock work IDs
    
    def is_license_valid(self, license_id: int) -> bool:
        """Check if a license is still valid"""
        license_info = self.get_license(license_id)
        if not license_info:
            return False
        return license_info.is_active and license_info.end_date > datetime.now()
    
    def _load_contract_abi(self) -> List[Dict]:
        """Load contract ABI"""
        return [
            {
                "inputs": [
                    {"name": "title", "type": "string"},
                    {"name": "iswc", "type": "string"},
                    {"name": "creators", "type": "address[]"},
                    {"name": "shares", "type": "uint256[]"},
                    {"name": "metadataURI", "type": "string"}
                ],
                "name": "registerWork",
                "outputs": [{"name": "", "type": "uint256"}],
                "type": "function"
            },
            {
                "inputs": [
                    {"name": "workId", "type": "uint256"},
                    {"name": "licensee", "type": "address"},
                    {"name": "rights", "type": "uint256[]"},
                    {"name": "duration", "type": "uint256"},
                    {"name": "royaltyRate", "type": "uint256"},
                    {"name": "exclusive", "type": "bool"}
                ],
                "name": "createLicense",
                "outputs": [{"name": "", "type": "uint256"}],
                "type": "function"
            }
        ]


class BlockchainCopyrightAPI:
    """High-level API for blockchain copyright operations"""
    
    def __init__(self):
        self.contract = SmartContractInterface()
    
    def register_work_on_blockchain(self, work_data: Dict) -> Dict[str, Any]:
        """Register a copyright work on blockchain"""
        return self.contract.register_work(
            title=work_data["title"],
            iswc=work_data.get("iswc", ""),
            creators=work_data["creators"],
            shares=work_data["shares"],
            metadata_uri=work_data.get("metadata_uri", "")
        )
    
    def create_blockchain_license(self, license_data: Dict) -> Dict[str, Any]:
        """Create a license on blockchain"""
        return self.contract.create_license(
            work_id=license_data["work_id"],
            licensee=license_data["licensee"],
            rights=license_data["rights"],
            duration_days=license_data["duration_days"],
            royalty_rate=license_data["royalty_rate"],
            exclusive=license_data.get("exclusive", False)
        )
    
    def distribute_royalty(self, work_id: int, amount_eth: float) -> Dict[str, Any]:
        """Distribute royalty payment"""
        amount_wei = int(amount_eth * 10**18)
        return self.contract.pay_royalty(work_id, amount_wei)
    
    def get_work_info(self, work_id: int) -> Optional[Dict]:
        """Get work information"""
        work = self.contract.get_work(work_id)
        if not work:
            return None
        
        return {
            "work_id": work.work_id,
            "title": work.title,
            "iswc": work.iswc,
            "creation_date": work.creation_date.isoformat(),
            "creators": work.creators,
            "creator_shares": work.creator_shares,
            "is_active": work.is_active
        }


def demo_smart_contract():
    """Demonstrate smart contract functionality"""
    print("=== Smart Contract Demo ===\n")
    
    api = BlockchainCopyrightAPI()
    
    # Register a work
    print("1. Registering work on blockchain...")
    work_data = {
        "title": "Blockchain Song",
        "iswc": "T-987654321-0",
        "creators": ["0x1234567890123456789012345678901234567890"],
        "shares": [10000],  # 100% to single creator
        "metadata_uri": "ipfs://QmSampleHash"
    }
    
    result = api.register_work_on_blockchain(work_data)
    print(f"Work registered: {result['success']}")
    print(f"Transaction hash: {result['transaction_hash']}")
    print(f"Work ID: {result['work_id']}")
    print()
    
    # Create a license
    print("2. Creating license...")
    license_data = {
        "work_id": result["work_id"],
        "licensee": "0x0987654321098765432109876543210987654321",
        "rights": [1, 2],  # reproduction, distribution
        "duration_days": 365,
        "royalty_rate": 1500,  # 15%
        "exclusive": False
    }
    
    license_result = api.create_blockchain_license(license_data)
    print(f"License created: {license_result['success']}")
    print(f"License ID: {license_result['license_id']}")
    print()
    
    # Pay royalty
    print("3. Distributing royalty...")
    royalty_result = api.distribute_royalty(result["work_id"], 0.1)  # 0.1 ETH
    print(f"Royalty distributed: {royalty_result['success']}")
    print(f"Amount: 0.1 ETH")
    print()
    
    # Get work info
    print("4. Retrieving work info...")
    work_info = api.get_work_info(result["work_id"])
    if work_info:
        print(f"Title: {work_info['title']}")
        print(f"ISWC: {work_info['iswc']}")
        print(f"Creators: {len(work_info['creators'])}")


if __name__ == "__main__":
    demo_smart_contract()