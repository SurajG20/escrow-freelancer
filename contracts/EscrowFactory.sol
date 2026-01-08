// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./Escrow.sol";

/**
 * @title EscrowFactory
 * @dev Factory contract for creating escrow instances
 */
contract EscrowFactory {
    address public usdtToken;
    address[] public escrows;
    mapping(address => address[]) public userEscrows; // user => escrow addresses

    event EscrowCreated(address indexed escrow, address indexed client, address indexed freelancer);

    constructor(address _usdtToken) {
        usdtToken = _usdtToken;
    }

    /**
     * @dev Create a new escrow contract
     */
    function createEscrow(
        address _client,
        address _freelancer,
        uint256[] memory _milestoneAmounts,
        bool[] memory _milestoneIsNative
    ) external returns (address) {
        Escrow escrow = new Escrow(
            _client,
            _freelancer,
            usdtToken,
            _milestoneAmounts,
            _milestoneIsNative
        );

        address escrowAddress = address(escrow);
        escrows.push(escrowAddress);
        userEscrows[_client].push(escrowAddress);
        userEscrows[_freelancer].push(escrowAddress);

        emit EscrowCreated(escrowAddress, _client, _freelancer);

        return escrowAddress;
    }

    /**
     * @dev Get total number of escrows created
     */
    function getEscrowCount() external view returns (uint256) {
        return escrows.length;
    }

    /**
     * @dev Get escrows for a user
     */
    function getUserEscrows(address user) external view returns (address[] memory) {
        return userEscrows[user];
    }

    /**
     * @dev Get all escrows
     */
    function getAllEscrows() external view returns (address[] memory) {
        return escrows;
    }
}

