Create a reusable Modal component for a Next.js + React + Tailwind project following FSD architecture.

The Modal must be placed in:

src/shared/ui/modal

File structure:

shared/ui/modal/
Modal.tsx
ModalHeader.tsx
ModalBody.tsx
ModalFooter.tsx
index.ts

Requirements:

The Modal must be a controlled component.

Props:

Modal

- open: boolean
- onClose: () => void
- children: ReactNode
- size?: "sm" | "md" | "lg"

ModalHeader

- title: string
- onClose?: () => void

ModalBody

- children: ReactNode

ModalFooter

- onOk?: () => void
- onCancel?: () => void
- okText?: string (default "OK")
- cancelText?: string (default "Cancel")
- showCancel?: boolean

Layout structure:

Modal
Overlay
Centered container
Header
Body
Footer

UI rules:

Overlay:

- fixed
- inset-0
- bg-black/50
- backdrop-blur-sm

Modal container:

- centered
- rounded-xl
- shadow-lg
- bg-background
- max-width depends on size prop

Header:

- flex
- justify-between
- title left
- close button right

Body:

- padding
- renders children

Footer:

- buttons aligned right
- Cancel (optional)
- OK primary button

Accessibility:

- role="dialog"
- aria-modal="true"
- close on ESC
- close on overlay click
- focus trap inside modal

Animations:

Use simple fade + scale transition.

Usage example:

<Modal open={open} onClose={closeModal}>
  <ModalHeader title="Create board" />
  <ModalBody>
    <CreateBoardForm />
  </ModalBody>
  <ModalFooter
    onOk={handleCreate}
    onCancel={closeModal}
  />
</Modal>

The modal must be fully reusable across the project.
