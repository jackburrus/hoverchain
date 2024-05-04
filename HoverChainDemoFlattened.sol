// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract HoverChainDemo {
    uint256 public totalUsers;
    mapping(address => uint256) public balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    // Deposit function to add value to balances
    function deposit() public payable {
        require(msg.value > 0, "Deposit amount must be greater than zero.");
        balances[msg.sender] += msg.value;
        totalUsers += 1;
        emit Deposit(msg.sender, msg.value);
    }

    // Withdraw function to reduce value in balances
    function withdraw(uint256 amount) public {
        require(balances[msg.sender] >= amount, "Insufficient balance.");
        payable(msg.sender).transfer(amount);
        balances[msg.sender] -= amount;
        emit Withdraw(msg.sender, amount);
    }

    // Read method to check the balance of a specific address
    function checkBalance(address user) public view returns (uint256) {
        return balances[user];
    }

    // Additional read method to get the total number of users
    function getTotalUsers() public view returns (uint256) {
        return totalUsers;
    }
}
