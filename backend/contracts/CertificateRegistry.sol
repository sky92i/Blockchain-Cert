// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CertificateRegistry {

    // Define a structure to store the details of a certificate
    struct Certificate {
        address issuer; // the address of the school that issued the certificate
        bytes32 hash; // the hash of the certificate data
        bool revoked; // whether the certificate has been revoked or not
    }

    // Define a mapping to store the certificates
    mapping(bytes32 => Certificate) public certificates;

    // Define an event to emit when a certificate is revoked
    event CertificateRevoked(bytes32 indexed hash);

    // Define a function to issue a certificate
    function issueCertificate(bytes32 hash) public {
        // Verify that the certificate has not already been issued
        require(certificates[hash].issuer == address(0), "Certificate already issued");

        // Store the certificate details in the mapping
        certificates[hash] = Certificate({
            issuer: msg.sender,
            hash: hash,
            revoked: false
        });
    }

    function getCertificate(bytes32 hash) public view returns (address issuer, bytes32 certificateHash, bool revoked) {
        // Verify that the certificate exists
        require(certificates[hash].issuer != address(0), "Certificate does not exist");

        // Retrieve the certificate details from the mapping
        issuer = certificates[hash].issuer;
        certificateHash = certificates[hash].hash;
        revoked = certificates[hash].revoked;
    }

    // Define a function to revoke a certificate
    function revokeCertificate(bytes32 hash) public {
        // Verify that the certificate exists and has not already been revoked
        require(certificates[hash].issuer != address(0), "Certificate does not exist");
        require(!certificates[hash].revoked, "Certificate already revoked");

        // Mark the certificate as revoked
        certificates[hash].revoked = true;

        // Emit an event to notify listeners that the certificate has been revoked
        emit CertificateRevoked(hash);
    }

    // Define a function to check if a certificate is revoked
    function isCertificateRevoked(bytes32 hash) public view returns (bool) {
        return certificates[hash].revoked;
    }
}