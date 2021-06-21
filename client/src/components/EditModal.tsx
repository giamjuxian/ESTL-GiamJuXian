import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { APIType, fetchAPI } from "../api";
import { Employee } from "./EmployeeTableRow";

interface Props {
  employee: Employee;
  show: boolean;
  onHide: () => unknown;
  onEdit: (employee: Employee) => unknown;
}

/** Modal to edit a current employee */
export default function EditModal(props: Props): JSX.Element {
  const { show, employee, onHide, onEdit } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [id, setId] = useState<string>(employee.id);
  const [login, setLogin] = useState<string>(employee.login);
  const [name, setName] = useState<string>(employee.name);
  const [salary, setSalary] = useState<number>(parseFloat(employee.salary));

  useEffect(() => {
    setId(employee.id);
    setLogin(employee.login);
    setName(employee.name);
    setSalary(parseFloat(employee.salary));
  }, [employee]);

  const handleEdit = async () => {
    setLoading(true);
    setError(null);
    try {
      const employee: Employee = {
        id,
        login,
        name,
        salary: salary.toFixed(2),
      };

      const options = {
        url: "/users",
        type: APIType.put,
        body: employee,
      };

      await fetchAPI<null>(options);
      onEdit(employee);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onHide();
      }, 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderButtons = () => {
    let button: JSX.Element;

    if (success) {
      button = (
        <Button variant="success" disabled>
          Edited successfully
        </Button>
      );
    } else if (loading) {
      button = (
        <Button variant="primary" disabled>
          Loading...
        </Button>
      );
    } else {
      button = (
        <Button variant="primary" onClick={handleEdit}>
          Edit
        </Button>
      );
    }

    return (
      <>
        <Button variant="outline-secondary" onClick={onHide}>
          Close
        </Button>
        {button}
      </>
    );
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicId">
          <Form.Label>ID</Form.Label>
          <Form.Control type="text" value={id} disabled />
          <Form.Label>Login</Form.Label>
          <Form.Control
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
          />
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Form.Label>Salary</Form.Label>
          <Form.Control
            type="number"
            value={salary}
            onChange={(e) => setSalary(parseFloat(e.target.value))}
          />
        </Form.Group>
        {error && <div className="mt-2 error">{error}</div>}
      </Modal.Body>
      <Modal.Footer>{renderButtons()}</Modal.Footer>
    </Modal>
  );
}
