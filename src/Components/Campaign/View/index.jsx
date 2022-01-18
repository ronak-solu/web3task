import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { useHistory, useParams } from "react-router-dom";
import useCampaignContract from "../../../hooks/useCampaignContract";
import Web3 from "web3";

const View = () => {
  const { account, deactivate } = useWeb3React();
  const history = useHistory();
  const { id } = useParams();
  console.log("🚀 ~ file: index.jsx ~ line 12 ~ View ~ id", id);
  const campaignContract = useCampaignContract({ address: id });
  const [campaignDetails, setCampaignDetails] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amountToContribute, setAmountToContribute] = useState(0);

  const getCampaigns = async () => {
    console.log(
      "🚀 ~ file: index.jsx ~ line 26 ~ getCampaigns ~ campaignContract",
      campaignContract
    );
    let result = campaignContract.methods
      .getSummary()
      .call()
      .then((result) => {
        console.log("🚀 ~ file: index.jsx ~ line 23 ~ .then ~ result", result);
        setCampaignDetails(result);
      });
  };

  useEffect(() => {
    console.log(
      "🚀 ~ file: index.jsx ~ line 32 ~ View ~ campaignContract",
      campaignContract
    );
    if (campaignContract != null) {
      getCampaigns();
    }
  }, [campaignContract]);

  useEffect(() => {
    console.log("🚀 ~ file: index.jsx ~ line 35 ~ View ~ account", account);
  }, [account]);

  const handleContribute = async () => {
    setIsLoading(true);
    let result = campaignContract.methods
      .contribute()
      .send({
        from: account,
        value: Web3.utils.toWei(amountToContribute, "ether"),
      })
      .then((result) => {
        console.log(
          "🚀 ~ file: index.jsx ~ line 51 ~ handleContribute ~ result",
          result
        );
        setIsLoading(false);
        setAmountToContribute(0);
      });
  };
  return (
    <Container fluid>
      <Row>
        <Col xl={8} sm={8}>
          <h3>Campaign Show</h3>
        </Col>
        <Col xl={4} sm={4}></Col>
      </Row>
      <Row style={{marginTop: '2vh'}}>
        <Col sm={6} xl={6}>
        {campaignDetails && (
            <Row>
              <Col xl={12} sm={12} style={{border: '1px solid black'}}>
                <h3>{campaignDetails[4]}</h3>
                <h6>Address of Manager</h6>
                <p>
                  The Manager Created this campagin and can create requests to
                  withdraw money
                </p>
              </Col>
              <Col xl={12} sm={12} style={{border: '1px solid black'}}>
                <h3>{campaignDetails[0]}</h3>
                <h6>Minimum Contribution(wei)</h6>
                <p>
                  You must contribute at least this much wei to become an approver
                </p>
              </Col>
              <Col xl={12} sm={12} style={{border: '1px solid black'}}>
                <h3>{campaignDetails[2]}</h3>
                <h6>Number of Request</h6>
                <p>
                  A request tries to withdraw money from the contract. Requests must
                  be approved by approvers
                </p>
              </Col>
              <Col xl={12} sm={12} style={{border: '1px solid black'}}>
                <h3>{campaignDetails[3]}</h3>
                <h6>Number of approvers</h6>
                <p>approver</p>
              </Col>
              <Col xl={12} sm={12} style={{border: '1px solid black'}}>
                <h3>{campaignDetails[1]}</h3>
                <h6>Campaign Balance</h6>
                <p>the balnce of campaign</p>
              </Col>
            </Row>
          )}
        
        </Col>
        <Col sm={6} xl={6} >
          <label>Amount to contribute</label>
          <input
            value={amountToContribute}
            onChange={(e) => setAmountToContribute(e.target.value)}
            style={{marginLeft: '5px'}}
          />
          {isLoading ? <Spinner animation="border" /> : 
          <Button onClick={handleContribute} disabled={isLoading} style={{marginLeft: '5px'}}>
           Contribute !!
          </Button> }
        </Col>
      </Row>
      
      <Row style={{marginTop: '2vh'}}>
      <Col xl={6} sm={6}>
        <Button onClick={() => history.push(`/view/viewrequests/${id}`)}>
          View Request
        </Button>
        </Col>
        <Col xl={6} sm={6} />
      </Row>
    </Container>
  );
};

export default View;
