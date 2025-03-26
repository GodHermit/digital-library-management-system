// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title DigitalLibrary
/// @notice This contract handles the payment and management of a digital library.
/// It allows users to pay for orders with ETH, sends the received ETH to a treasury wallet,
/// and allows the owner to withdraw any ERC20 tokens or ETH.
contract DigitalLibrary is Ownable {
    /// @notice Address of the treasury wallet where ETH will be sent.
    address public treasuryWallet;

    /// @notice Event emitted when an order is paid.
    /// @param orderId The UUID v4 string of the order.
    /// @param amount The amount of ETH paid.
    event OrderPaid(string orderId, uint256 amount);

    /// @notice Event emitted when the treasury wallet is updated.
    /// @param newTreasuryWallet The address of the new treasury wallet.
    event TreasuryWalletUpdated(address indexed newTreasuryWallet);

    /// @notice Initializes the contract with a treasury wallet address.
    /// @param _treasuryWallet The address of the initial treasury wallet.
    constructor(address _treasuryWallet) Ownable(msg.sender) {
        require(
            _treasuryWallet != address(0),
            "Treasury wallet cannot be the zero address"
        );
        treasuryWallet = _treasuryWallet;
    }

    /// @notice Method to receive ETH with an orderId and send the ETH to the treasury wallet.
    /// @param orderId The UUID v4 string of the order.
    function payOrder(string memory orderId) external payable {
        require(isValidUUID(orderId), "orderId must be a valid UUID v4 string");
        require(msg.value > 0, "ETH value cannot be zero");
        payable(treasuryWallet).transfer(msg.value);
        emit OrderPaid(orderId, msg.value);
    }

    /// @notice Method for the owner of the contract to withdraw any ERC20 token including ETH.
    /// @param tokenAddress The address of the ERC20 token to withdraw. Use address(0) for ETH.
    /// @param amount The amount to withdraw.
    function withdraw(address tokenAddress, uint256 amount) external onlyOwner {
        if (tokenAddress == address(0)) {
            // Withdraw ETH
            payable(owner()).transfer(amount);
        } else {
            // Withdraw ERC20 tokens
            IERC20 token = IERC20(tokenAddress);
            require(token.transfer(owner(), amount), "Token transfer failed");
        }
    }

    /// @notice Method to update the treasury wallet address.
    /// @param newTreasuryWallet The address of the new treasury wallet.
    function setTreasuryWallet(address newTreasuryWallet) external onlyOwner {
        require(
            newTreasuryWallet != address(0),
            "Treasury wallet cannot be the zero address"
        );
        treasuryWallet = newTreasuryWallet;
        emit TreasuryWalletUpdated(newTreasuryWallet);
    }

    /// @notice Fallback function to prevent receiving non-ETH tokens. Only accepts ETH.
    receive() external payable {
        // Only accept ETH
    }

    /// @notice Fallback function to prevent receiving non-ETH tokens. Only accepts ETH.
    fallback() external payable {
        // Only accept ETH
    }

    /// @notice Validates if the given string is a valid UUID v4.
    /// @param uuid The string to validate.
    /// @return A boolean indicating whether the string is a valid UUID v4.
    function isValidUUID(string memory uuid) internal pure returns (bool) {
        bytes memory b = bytes(uuid);
        if (b.length != 36) return false;
        for (uint i = 0; i < 36; i++) {
            if (i == 8 || i == 13 || i == 18 || i == 23) {
                if (b[i] != "-") return false;
            } else {
                if (!isHexChar(b[i])) return false;
            }
        }
        return true;
    }

    /// @notice Checks if a character is a valid hexadecimal character.
    /// @param c The character to check.
    /// @return A boolean indicating whether the character is a valid hexadecimal character.
    function isHexChar(bytes1 c) internal pure returns (bool) {
        return
            (c >= 0x30 && c <= 0x39) || // 0-9
            (c >= 0x61 && c <= 0x66) || // a-f
            (c >= 0x41 && c <= 0x46); // A-F
    }
}
