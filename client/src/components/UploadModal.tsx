import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { APIType, fetchAPI } from "../api";

interface Props {
  show: boolean;
  onHide: () => unknown;
}

export default function UploadModal(props: Props): JSX.Element {
  const { show, onHide } = props;
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = async () => {
    if (file === null) return;
    setError(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file, file.name);
      await fetchAPI({
        url: "users/upload",
        type: APIType.post,
        body: formData,
      });

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
          Uploaded successfully
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
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={file === null}
        >
          Upload
        </Button>
      );
    }

    return (
      <>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        {button}
      </>
    );
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const targetFile = e.target.files && e.target.files[0];
    setFile(targetFile);
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Upload CSV File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group controlId="formFile">
          <Form.Control
            className="w-100"
            type="file"
            accept=".csv"
            onChange={handleFileSelect}
          />
        </Form.Group>
        {error && <div className="mt-2 error">{error}</div>}
      </Modal.Body>
      <Modal.Footer>{renderButtons()}</Modal.Footer>
    </Modal>
  );
}
