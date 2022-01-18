import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { useHistory, useParams } from "react-router-dom";
import useCampaignContract from "../../../hooks/useCampaignContract";
import Web3 from "web3";

const AddRequest = () => {
  const { account, deactivate } = useWeb3React();
  const history = useHistory();
  const { id } = useParams();
  const [description, setDescription] = useState('');
  const [etherValue, setEtherValue] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const campaignContract = useCampaignContract({ address: id });

  const handleCreate = async () =>{
    setIsLoading(true)
    let result = campaignContract.methods
        .createRequest(description, Web3.utils.toWei(etherValue, 'ether'), recipient)
        .send({ from: account }).then(result =>{
        console.log("🚀 ~ file: add.jsx ~ line 23 ~ .send ~ result", result)
            setIsLoading(false);
            setTimeout(() => {
                history.push(`/view/viewrequests/${id}`)
            }, 500);
        })
  }
  return (
    <Container>
      <Row>
        <Col>Create Request</Col>
      </Row>
      <Row>
        <label>Description</label>
        <input
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
        />
        <label>Value in Ether</label>
        <input
          value={etherValue}
          onChange={(e) => setEtherValue(e.target.value)}
        />
        <label>Recipient</label>
        <input
          value={recipient}
          onChange={(event) => setRecipient(event.target.value)}
        />
        {isLoading ? <Spinner animation="border" /> :<Button disable={isLoading} onClick={()=>handleCreate()}> 
         Create
        </Button> }
      </Row>
    </Container>
  );
};

export default AddRequest;
 