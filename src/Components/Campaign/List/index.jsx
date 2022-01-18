import React from "react";
import ListBox from "./listBox";

function CampaignList({campaigns}) {
  return (
    <React.Fragment>
    {campaigns && campaigns.map((item,index) => <ListBox campaign={item} KEY={index * 12.22}/>)}
    </React.Fragment>
  );
}

export default CampaignList;
