import React, { useEffect, useState } from "react";
import { Button, Col, Container, Row, Spinner, Table } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { useHistory, useParams } from "react-router-dom";
import useCampaignContract from "../../../hooks/useCampaignContract";
import Web3 from "web3";

const ViewRequest = () => {
  const { account } = useWeb3React();
  const history = useHistory();
  const { id } = useParams();
  const campaignContract = useCampaignContract({ address: id });
  const [requestCounts, setRequestCount] = useState(null);
  const [approvesCount, setApprovesCount] = useState(null);
  const [requestDetails, setRequestDetails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getRequestDetails = async () => {
    const requestCount = await campaignContract.methods
      .getRequestsCount()
      .call();
    const approversCount = await campaignContract.methods.approvesCount().call();
    setRequestCount(Number(requestCount));
    setApprovesCount(Number(approversCount));

    const requestList = await Promise.all(
      Array(parseInt(requestCount))
        .fill()
        .map((item, index) => {
          return campaignContract.methods.requests(index).call();
        })
    );
    console.log("🚀 ~ file: index.jsx ~ line 32 ~ getRequestDetails ~ requestList", requestList)
    setRequestDetails(requestList);
  };

  useEffect(() => {
    console.log(
      "🚀 ~ file: index.jsx ~ line 32 ~ View ~ campaignContract",
      campaignContract
    );
    if (campaignContract != null) {
      getRequestDetails();
    }
  }, [campaignContract]);


  const onApproveClick = async (index) => {
    setIsLoading(true);
    await campaignContract.methods.approveRequest(index).send({
      from: account
    });
    getRequestDetails();
    setIsLoading(false);
  };

  const onFinalizeClick = async (index) => {
    setIsLoading(true);

    await campaignContract.methods.finalizeRequest(index).send({
      from: account
    });
    getRequestDetails();
    setIsLoading(false);

  };


  return (
    <Container>
      <Row style={{marginTop: '3vh'}}>
        <Col><h3>Requests </h3></Col>
        <Col>
          <Button onClick={() => history.push(`/view/viewrequests/new/${id}`)}>
            Add Request{" "}
          </Button>
        </Col>
        <Col>
         {isLoading ? <Spinner animation="border" />: <p></p>}
        </Col>
      </Row>
      <Row style={{marginTop: '2vh'}} >
        <Table striped bordered hover>
          <thead>
            <th>ID</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Recipient</th>
            <th>Approval Count</th>
            <th>Approve</th>
            <th>Finalize</th>
          </thead>
          <tbody>
            {requestDetails.map((item, index) => {
              return (
                <tr>
                  <td>{index + 1}</td>
                  <td>{item.description}</td>
                  <td>{Web3.utils.fromWei(item.value, 'ether')}</td>
                  <td>{item.recipient}</td>
                  <td>{Number(item.approvalCount) / approvesCount}</td>
                  <td>{item.complete ? null : <Button  disable={ (Number(item.approvalCount) > (approvesCount / 2 )) || isLoading} onClick={()=> onApproveClick(index)}>Approve</Button> } </td>
                  <td>{item.complete ? null : <Button  disable={ (Number(item.approvalCount) > (approvesCount / 2 )) || isLoading} onClick={()=> onFinalizeClick(index)} >Finalize</Button> }</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </Row>
    </Container>
  );
};

export default ViewRequest;
