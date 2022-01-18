// SPDX-License-Identifier: MIT
pragma solidity ^0.8.11;

contract CampaignFactory {
    address[] private deployedCampaigens;

    function createCampaign(uint minimum) public {
        address newCampaign = address(new Campaign(minimum,msg.sender));
        deployedCampaigens.push(newCampaign);
    }

    function getDeployedCampaigens() public view returns (address[] memory){
        return deployedCampaigens;
    }
}

contract Campaign {
    struct Request {
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
    }

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    uint public approvesCount;

    constructor (uint minimum,address creator) {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable{
        require(msg.value > minimumContribution);
        approvers[msg.sender] = true;
        approvesCount++;
    }

    modifier restricted() {
        require(msg.sender == manager);
        _;
    }

    function createRequest(string memory description,uint value,address recipient) public restricted {
        // require(approvers[msg.sender]);
        // Request memory newRequest = Request({
        //     description:description,
        //     value:value,
        //     recipient:recipient,
        //     complete:false,
        //     approvalCount:0
        // });
        // requests.push(newRequest);
        Request storage r = requests.push();
        r.description = description;
        r.value = value;
        r.recipient = recipient;
        r.complete = false;
        r.approvalCount = 0;
    }

    function approveRequest(uint index) public{
        Request storage request = requests[index];
        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalCount++;
    }

    function finalizeRequest(uint index) public restricted{
        Request storage request = requests[index];
        require(request.approvalCount > (approvesCount / 2));
        require(!request.complete);
        payable(request.recipient).transfer(request.value);
        request.complete = true;
    }

    function getSummary() public view returns (uint,uint,uint,uint,address) {
        return (minimumContribution,address(this).balance,requests.length,approvesCount,manager);
    }

    function getRequestsCount() public view returns (uint) {
        return requests.length;
    }
}