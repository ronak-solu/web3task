import React, { useEffect, useState } from "react";
import CampaignList from "../Campaign/List";
import { Button, Col, Container, Row, Spinner } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { useHistory } from "react-router-dom";
import { useCampaignFactoryContract } from "../../hooks";

const Home = () => {
  const { account, deactivate } = useWeb3React();
  const history = useHistory();
  const campaignFactoryContract = useCampaignFactoryContract();
  const [campaigns,setCampaigns] = useState([]);
  const [isCreatingNew,setIsCreatingNew] = useState(false);
  const [isLoading,setIsLoading] = useState(false);
  const [miniumumContribution,setMinimumContribution] = useState(0);
  const onCreateClick = async () => {
    setIsCreatingNew(true);
  };

  const createCampaign = async () => {
    console.log("🚀 ~ file: index.jsx ~ line 21 ~ createCampaign ~ miniumumContribution", miniumumContribution)
    if(miniumumContribution <= 0) return;
    setIsLoading(true);
    let result = campaignFactoryContract.methods.createCampaign(miniumumContribution).send({from:account}).then(result => {
      console.log("🚀 ~ file: index.jsx ~ line 15 ~ onMintClick ~ result", result)
      setIsCreatingNew(false);
      setMinimumContribution(0)
      setIsLoading(false);
      getCampaigns();
    })
  }
  const getCampaigns = async () => {
    console.log("🚀 ~ file: index.jsx ~ line 14 ~ onMintClick ~ campaignFactoryContract",campaignFactoryContract
    );
    let result = campaignFactoryContract.methods
      .getDeployedCampaigens()
      .call()
      .then((result) =>{
        console.log( "🚀 ~ file: index.jsx ~ line 15 ~ onMintClick ~ result",result)
        setCampaigns(result)
      }
      );
  };

  useEffect(() => {
    console.log("🚀 ~ file: index.jsx ~ line 47 ~ Home ~ campaignFactoryContract", campaignFactoryContract)
    if(campaignFactoryContract != null){
      getCampaigns()
    }
  }, [campaignFactoryContract]);

  useEffect(() => {
    console.log("🚀 ~ file: index.jsx ~ line 21 ~ Home ~ account", account);
  }, [account]);


  return (
    <Container>
      <Row>
        <Col>
          <h3 onClick={()=> {
            history.push("/");
            setIsCreatingNew(false);
          }}>Campaigns</h3>
        </Col>
      </Row>
      {!isCreatingNew ?<Row>
        <Col xl={6} sm={6}>
          <CampaignList campaigns={campaigns} />
        </Col>
        <Col xl={6} sm={6}>
          <Button onClick={onCreateClick}> Create New</Button>
        </Col>
      </Row> :
        <Row>
        <Col> <label>Miniumum Contribution</label><input type="number" onChange={(e)=> setMinimumContribution(e.target.value)}/></Col>
        <Col> {isLoading ? <Spinner animation="border" /> :  <Button onClick={(e)=> createCampaign()} disable={isLoading} >Create</Button> } </Col>
        </Row>
    }
    </Container>
  );
};

export default Home;
