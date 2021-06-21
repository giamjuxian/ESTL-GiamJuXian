import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { APIType, fetchAPI } from "../api";
import { Employee } from "./EmployeeTableRow";

interface Props {
  employee: Employee;
  show: boolean;
  onHide: () => unknown;
  onDelete: (id: string) => unknown;
}

/** Modal to allow of deleting of an employee */
export default function DeleteModal(props: Props): JSX.Element {
  const { show, employee, onHide, onDelete } = props;
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

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const options = {
        url: `/users/${id}`,
        type: APIType.delete,
      };

      await fetchAPI<null>(options);
      onDelete(employee.id);

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
          Deleted successfully
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
        <Button variant="danger" onClick={handleDelete}>
          Delete
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
        <Modal.Title>Delete Employee</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3" controlId="formBasicId">
          <Form.Label>ID</Form.Label>
          <Form.Control type="text" value={id} disabled />
          <Form.Label>Login</Form.Label>
          <Form.Control type="text" value={login} disabled />
          <Form.Label>Name</Form.Label>
          <Form.Control type="text" value={name} disabled />
          <Form.Label>Salary</Form.Label>
          <Form.Control type="number" value={salary} disabled />
        </Form.Group>
        {error && <div className="mt-2 error">{error}</div>}
      </Modal.Body>
      <Modal.Footer>{renderButtons()}</Modal.Footer>
    </Modal>
  );
}
