import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

export function Avatar({ avatarUrl, setAvatarUrl, fileInputRef, onUpload, onDelete }) {
  return (
    <>
      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <img src={avatarUrl} alt="profile" className="profile-picture" onError={() => setAvatarUrl("/assets/default.svg")} />
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content className="dropdown-content">
            <DropdownMenu.Item className="dropdown-item" onClick={() => fileInputRef.current?.click()}>
              Change avatar
            </DropdownMenu.Item>
            <DropdownMenu.Item className="dropdown-item dropdown-item--danger" onClick={onDelete}>
              Delete avatar
            </DropdownMenu.Item>
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>

      <input type="file" accept="image/*" ref={fileInputRef} className="avatar-file-input" onChange={onUpload} />
    </>
  );
}