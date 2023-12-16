import React from 'react';
import { Button, Input, Modal } from 'react-daisyui';

export interface CreateGroupModalProps {
  showModal: boolean;
  loading: boolean;
  error?: string;
  onClose: () => void;
  submitHandler: (e: React.FormEvent<HTMLFormElement>) => void;
}

const CreateGroupModal: React.FC<CreateGroupModalProps> = (props) => {
  const { showModal, loading, error, onClose, submitHandler } = props;

  return (
    <Modal className="z-50" open={showModal}>
      <form onSubmit={submitHandler}>
        <Modal.Header className="font-bold">Create new chat group</Modal.Header>
        <Modal.Body>
          <Input
            required
            className="w-full"
            bordered
            placeholder="Chat group name"
            name="name"
          />
          {error && (
            <p className="pt-2 text-center text-red-400">{`⚠️ ${error}`}</p>
          )}
        </Modal.Body>
        <Modal.Actions>
          <Button color="primary" type="submit" loading={loading}>
            Create
          </Button>
          <Button
            color="secondary"
            variant="outline"
            type="button"
            onClick={onClose}
          >
            Cancel
          </Button>
        </Modal.Actions>
      </form>
    </Modal>
  );
};

export default CreateGroupModal;
