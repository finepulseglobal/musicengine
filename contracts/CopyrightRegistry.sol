// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CopyrightRegistry {
    
    struct CopyrightWork {
        string title;
        string iswc;
        uint256 creationDate;
        address[] creators;
        uint256[] creatorShares; // Basis points (10000 = 100%)
        string metadataURI;
        bool isActive;
    }
    
    struct License {
        uint256 workId;
        address licensee;
        uint256[] rights; // 1=reproduction, 2=distribution, 4=performance
        uint256 startDate;
        uint256 endDate;
        uint256 royaltyRate; // Basis points
        bool exclusive;
        bool isActive;
    }
    
    uint256 private _workIdCounter;
    uint256 private _licenseIdCounter;
    
    mapping(uint256 => CopyrightWork) public works;
    mapping(uint256 => License) public licenses;
    mapping(string => uint256) public iswcToWorkId;
    mapping(uint256 => uint256[]) public workLicenses;
    mapping(address => uint256[]) public creatorWorks;
    
    event WorkRegistered(uint256 indexed workId, string title, address indexed creator);
    event LicenseCreated(uint256 indexed licenseId, uint256 indexed workId, address indexed licensee);
    event RoyaltyPaid(uint256 indexed workId, uint256 amount, address indexed payer);
    
    function registerWork(
        string memory title,
        string memory iswc,
        address[] memory creators,
        uint256[] memory shares,
        string memory metadataURI
    ) external returns (uint256) {
        require(bytes(title).length > 0, "Title required");
        require(creators.length > 0, "At least one creator required");
        require(creators.length == shares.length, "Creators and shares length mismatch");
        require(_validateShares(shares), "Invalid shares");
        
        if (bytes(iswc).length > 0) {
            require(iswcToWorkId[iswc] == 0, "ISWC already registered");
        }
        
        uint256 workId = ++_workIdCounter;
        
        works[workId] = CopyrightWork({
            title: title,
            iswc: iswc,
            creationDate: block.timestamp,
            creators: creators,
            creatorShares: shares,
            metadataURI: metadataURI,
            isActive: true
        });
        
        if (bytes(iswc).length > 0) {
            iswcToWorkId[iswc] = workId;
        }
        
        for (uint i = 0; i < creators.length; i++) {
            creatorWorks[creators[i]].push(workId);
        }
        
        emit WorkRegistered(workId, title, creators[0]);
        return workId;
    }
    
    function createLicense(
        uint256 workId,
        address licensee,
        uint256[] memory rights,
        uint256 duration,
        uint256 royaltyRate,
        bool exclusive
    ) external returns (uint256) {
        require(workId <= _workIdCounter && workId > 0, "Work does not exist");
        require(_isCreator(workId, msg.sender), "Only creators can license");
        require(licensee != address(0), "Invalid licensee");
        
        uint256 licenseId = ++_licenseIdCounter;
        
        licenses[licenseId] = License({
            workId: workId,
            licensee: licensee,
            rights: rights,
            startDate: block.timestamp,
            endDate: block.timestamp + duration,
            royaltyRate: royaltyRate,
            exclusive: exclusive,
            isActive: true
        });
        
        workLicenses[workId].push(licenseId);
        
        emit LicenseCreated(licenseId, workId, licensee);
        return licenseId;
    }
    
    function payRoyalty(uint256 workId) external payable {
        require(workId <= _workIdCounter && workId > 0, "Work does not exist");
        require(msg.value > 0, "Payment required");
        
        CopyrightWork memory work = works[workId];
        
        for (uint i = 0; i < work.creators.length; i++) {
            uint256 creatorPayment = (msg.value * work.creatorShares[i]) / 10000;
            if (creatorPayment > 0) {
                payable(work.creators[i]).transfer(creatorPayment);
            }
        }
        
        emit RoyaltyPaid(workId, msg.value, msg.sender);
    }
    
    function getWork(uint256 workId) external view returns (CopyrightWork memory) {
        require(workId <= _workIdCounter && workId > 0, "Work does not exist");
        return works[workId];
    }
    
    function getLicense(uint256 licenseId) external view returns (License memory) {
        require(licenseId <= _licenseIdCounter && licenseId > 0, "License does not exist");
        return licenses[licenseId];
    }
    
    function getWorkLicenses(uint256 workId) external view returns (uint256[] memory) {
        return workLicenses[workId];
    }
    
    function getCreatorWorks(address creator) external view returns (uint256[] memory) {
        return creatorWorks[creator];
    }
    
    function isLicenseValid(uint256 licenseId) external view returns (bool) {
        if (licenseId > _licenseIdCounter || licenseId == 0) return false;
        License memory license = licenses[licenseId];
        return license.isActive && block.timestamp <= license.endDate;
    }
    
    function _validateShares(uint256[] memory shares) private pure returns (bool) {
        uint256 total = 0;
        for (uint i = 0; i < shares.length; i++) {
            total += shares[i];
        }
        return total == 10000; // Must equal 100%
    }
    
    function _isCreator(uint256 workId, address account) private view returns (bool) {
        CopyrightWork memory work = works[workId];
        for (uint i = 0; i < work.creators.length; i++) {
            if (work.creators[i] == account) return true;
        }
        return false;
    }
}