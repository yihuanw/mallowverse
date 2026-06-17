import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Dialog from "@radix-ui/react-dialog";
import * as AlertDialog from "@radix-ui/react-alert-dialog";

const COMPANION_OPTIONS = ["calico", "samoyed"];

export function CompanionCard({ companion, onChangeCompanion, onChangeName, onChangeField, onDeleteCompanion }) {
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [fieldDialogOpen, setFieldDialogOpen] = useState(false);
  const [nameInput, setNameInput] = useState(companion.name);
  const [fieldInput, setFieldInput] = useState(companion.field);

  function openNameDialog() {
    setNameInput(companion.name);
    setNameDialogOpen(true);
  }

  function openFieldDialog() {
    setFieldInput(companion.field);
    setFieldDialogOpen(true);
  }

  function submitName() {
    onChangeName(companion, nameInput);
    setNameDialogOpen(false);
  }

  function submitField() {
    onChangeField(companion, fieldInput);
    setFieldDialogOpen(false);
  }

  return (
    <div className="companion-card">
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <img src={`/assets/${companion.companion}.gif`} alt={companion.companion} width="120px" height="120px" />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="dropdown-content">
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger className="dropdown-item">Change companion</DropdownMenu.SubTrigger>
              <DropdownMenu.Portal>
                <DropdownMenu.SubContent className="dropdown-content">
                  {COMPANION_OPTIONS.map((option) => (
                    <DropdownMenu.Item key={option} className="dropdown-item" onClick={() => onChangeCompanion(companion, option)}>
                      {option}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.SubContent>
              </DropdownMenu.Portal>
            </DropdownMenu.Sub>

            <DropdownMenu.Item className="dropdown-item" onClick={openNameDialog}>
              Change name
            </DropdownMenu.Item>

            <DropdownMenu.Item className="dropdown-item" onClick={openFieldDialog}>
              Change field
            </DropdownMenu.Item>

            <AlertDialog.Root>
              <AlertDialog.Trigger asChild>
                <DropdownMenu.Item className="dropdown-item dropdown-item--danger" onSelect={(e) => e.preventDefault()}>
                  Delete companion
                </DropdownMenu.Item>
              </AlertDialog.Trigger>

              <AlertDialog.Portal>
                <AlertDialog.Overlay className="dialog-overlay" />
                <AlertDialog.Content className="dialog-content">
                  <AlertDialog.Title className="dialog-title">Delete companion</AlertDialog.Title>
                  <AlertDialog.Description className="dialog-description">
                    Are you sure you want to delete {companion.name}? This can't be undone.
                  </AlertDialog.Description>
                  <div className="dialog-actions">
                    <AlertDialog.Cancel asChild>
                      <button type="button">Cancel</button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                      <button type="button" className="dialog-button--danger" onClick={() => onDeleteCompanion(companion)}>
                        Delete
                      </button>
                    </AlertDialog.Action>
                  </div>
                </AlertDialog.Content>
              </AlertDialog.Portal>
            </AlertDialog.Root>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <label className="companion-card-text">
        {companion.name}
        <br />
        lvl {companion.level}
        <br />
        {companion.field}
      </label>

      <Dialog.Root open={nameDialogOpen} onOpenChange={setNameDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">Change name</Dialog.Title>
            <input className="dialog-input" value={nameInput} onChange={(e) => setNameInput(e.target.value)} autoFocus />
            <div className="dialog-actions">
              <Dialog.Close asChild>
                <button type="button">Cancel</button>
              </Dialog.Close>
              <button type="button" onClick={submitName}>
                Save
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={fieldDialogOpen} onOpenChange={setFieldDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="dialog-overlay" />
          <Dialog.Content className="dialog-content">
            <Dialog.Title className="dialog-title">Change field</Dialog.Title>
            <input className="dialog-input" value={fieldInput} onChange={(e) => setFieldInput(e.target.value)} autoFocus />
            <div className="dialog-actions">
              <Dialog.Close asChild>
                <button type="button">Cancel</button>
              </Dialog.Close>
              <button type="button" onClick={submitField}>
                Save
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}