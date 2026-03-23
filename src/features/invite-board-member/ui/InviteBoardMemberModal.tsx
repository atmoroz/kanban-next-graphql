"use client";

import { useCallback, useMemo, useState } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "@/shared/ui/modal";
import { Label } from "@/shared/ui/label";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import type { BoardRole, InviteStatus } from "@/graphql/generated/graphql";
import { BoardRole as BoardRoleEnum } from "@/graphql/generated/graphql";
import { useInviteBoardMember } from "@/features/invite-board-member/model/useInviteBoardMember";
import { useUpdateBoardMemberRole } from "@/features/invite-board-member/model/useUpdateBoardMemberRole";

type InviteBoardMemberModalProps = {
  open: boolean;
  onClose: () => void;
  boardId: string;
  mode?: "create" | "edit";
  editTarget?:
    | {
        kind: "pending";
        email: string;
        role: BoardRole;
        status: InviteStatus;
        inviteId: string;
      }
    | {
        kind: "member";
        email: string;
        role: BoardRole;
        userId: string;
      };
};

export function InviteBoardMemberModal({
  open,
  onClose,
  boardId,
  mode = "create",
  editTarget,
}: InviteBoardMemberModalProps) {
  const { inviteByEmail, loading } = useInviteBoardMember({ boardId });
  const { updateBoardMemberRole, loading: updateLoading } = useUpdateBoardMemberRole({
    boardId,
  });

  const initialState = useMemo(() => {
    if (mode === "edit" && editTarget) {
      return { email: editTarget.email, role: editTarget.role };
    }
    return { email: "", role: BoardRoleEnum.Member };
  }, [editTarget, mode]);

  const [email, setEmail] = useState(initialState.email);
  const [role, setRole] = useState<BoardRole>(initialState.role);

  const effectiveLoading = loading || updateLoading;

  const handleClose = useCallback(() => {
    setEmail("");
    setRole(BoardRoleEnum.Member);
    onClose();
  }, [onClose]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const trimmedEmail = email.trim();
      if (!trimmedEmail) return;

      try {
        if (mode === "create") {
          await inviteByEmail({ email: trimmedEmail, role });
        } else {
          if (!editTarget) return;
          if (editTarget.kind === "pending") {
            await inviteByEmail({ email: trimmedEmail, role });
          } else {
            await updateBoardMemberRole({
              userId: editTarget.userId,
              role,
            });
          }
        }
        handleClose();
      } catch {
        // errorLink already shows toast; keep modal open.
      }
    },
    [email, editTarget, handleClose, inviteByEmail, mode, role, updateBoardMemberRole],
  );

  return (
    <Modal open={open} onClose={handleClose} size="sm">
      <ModalHeader
        title={mode === "create" ? "Add member" : "Edit member"}
        onClose={handleClose}
      />
      <ModalBody>
        <form id="invite-board-member-form" onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="member-email">Email</Label>
            <Input
              id="member-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              disabled={mode === "edit"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="member-role">Role</Label>
            <Select
              id="member-role"
              value={role}
              onChange={(e) => setRole(e.target.value as BoardRole)}
              disabled={effectiveLoading}
            >
              <option value={BoardRoleEnum.Admin}>ADMIN</option>
              <option value={BoardRoleEnum.Member}>MEMBER</option>
              <option value={BoardRoleEnum.Viewer}>VIEWER</option>
            </Select>
          </div>
        </form>
      </ModalBody>

      <ModalFooter
        isLoading={effectiveLoading}
        onOk={() => {
          const form = document.getElementById(
            "invite-board-member-form",
          ) as HTMLFormElement | null;
          form?.requestSubmit();
        }}
        onCancel={handleClose}
        okText={mode === "create" ? "Invite" : "Update"}
        showCancel
      />
    </Modal>
  );
}
