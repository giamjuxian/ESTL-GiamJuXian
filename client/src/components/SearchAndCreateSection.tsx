import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";

interface Props {
  onCreate: () => unknown;
  onSearch: (id: string) => unknown;
}

/** Section which includes functionalities to search and or create new employees */
export default function SearchAndCreateSection(props: Props) {
  const { onCreate, onSearch } = props;
  const [searchId, setSearchId] = useState<string>("");

  return (
    <div className="d-flex flex-column mb-3">
      <div className="d-flex flex-column">
        <Form.Group controlId="formBasicSalary">
          <Form.Label>Search</Form.Label>
          <div className="d-flex flex-row">
            <Form.Control
              type="text"
              placeholder="Employee ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
            <Button
              className="mx-2"
              onClick={() => onSearch(searchId)}
              variant="outline-secondary"
            >
              Search
            </Button>
          </div>
        </Form.Group>
      </div>
      <div className="mt-4">
        <Button onClick={onCreate} variant="primary">
          Create
        </Button>
      </div>
    </div>
  );
}
