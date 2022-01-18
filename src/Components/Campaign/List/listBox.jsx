import React from "react";
import { Button, Card } from "react-bootstrap";
import { useHistory } from "react-router";

function ListBox({campaign, KEY}) {
  const history = useHistory();

  return (
    <Card style={{ width: "18rem" }} key={KEY}>
      <Card.Body>
        <Card.Title>{campaign}</Card.Title>
        <Button variant="primary" onClick={() => history.push(`/view/${campaign}`)}>View</Button>
      </Card.Body>
    </Card>
  );
}

export default ListBox;
