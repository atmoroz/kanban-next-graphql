"use client";

import type { ReactNode } from "react";
import { useMemo, useRef, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type {
  BoardMembersQuery,
  PendingInvitesQuery,
  BoardRole,
  InviteStatus,
} from "@/graphql/generated/graphql";
import { InviteStatus as InviteStatusEnum } from "@/graphql/generated/graphql";
import { useBoardInvites } from "@/features/invite-board-member/model/useBoardInvites";
import { InviteBoardMemberModal } from "@/features/invite-board-member/ui/InviteBoardMemberModal";
import { DeleteBoardMemberConfirmModal } from "@/features/invite-board-member/ui/DeleteBoardMemberConfirmModal";
import { toInitials } from "@/shared/lib/toInitials";
import { useUser } from "@/shared/providers/auth-provider";

type InviteItem = NonNullable<PendingInvitesQuery["pendingInvites"]>[number];
type MemberItem = NonNullable<BoardMembersQuery["boardMembers"]>[number];

const ROLE_ORDER: Record<BoardRole, number> = {
  OWNER: 0,
  ADMIN: 1,
  MEMBER: 2,
  VIEWER: 3,
};

function roleClasses(role: MemberItem["role"]) {
  switch (role) {
    case "OWNER":
      return {
        bg: "bg-emerald-500/20",
        text: "text-emerald-700",
        border: "border-emerald-500/30",
      };
    case "ADMIN":
      return {
        bg: "bg-blue-500/20",
        text: "text-blue-700",
        border: "border-blue-500/30",
      };
    case "MEMBER":
      return {
        bg: "bg-orange-500/20",
        text: "text-orange-700",
        border: "border-orange-500/30",
      };
    case "VIEWER":
      return {
        bg: "bg-zinc-500/20",
        text: "text-zinc-700",
        border: "border-zinc-500/30",
      };
    default:
      return {
        bg: "bg-muted",
        text: "text-foreground",
        border: "border-background/70",
      };
  }
}

function AvatarWithTooltip({
  label,
  tooltip,
  className,
  onClick,
  hoverAction,
  onHoverActionClick,
}: {
  label: string;
  tooltip: ReactNode;
  className: string;
  onClick?: () => void;
  hoverAction?: boolean;
  onHoverActionClick?: () => void;
}) {
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ left: number; top: number } | null>(null);

  const tooltipStyle: CSSProperties | undefined = useMemo(() => {
    if (!coords) return undefined;
    return {
      position: "fixed",
      left: coords.left,
      top: coords.top,
      transform: "translateX(-50%)",
    };
  }, [coords]);

  const handleOpen = () => {
    if (!anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    setCoords({
      left: rect.left + rect.width / 2,
      top: rect.bottom + 8,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <span
      ref={anchorRef}
      className="relative inline-flex cursor-pointer group"
      onMouseEnter={handleOpen}
      onMouseLeave={handleClose}
      onClick={() => {
        setOpen(false);
        onClick?.();
      }}
      tabIndex={-1}
    >
      {hoverAction && (
        <button
          type="button"
          className="absolute -top-1 -right-1 z-10 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white border border-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove member"
          onClick={(event) => {
            event.stopPropagation();
            event.preventDefault();
            setOpen(false);
            onHoverActionClick?.();
          }}
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      )}
      <span
        className={[
          "inline-flex h-7 w-7 items-center justify-center rounded-full",
          "text-[10px] font-semibold border",
          className,
          "transition-colors group-hover:border-primary/80 group-hover:ring-1 group-hover:ring-primary/30",
        ].join(" ")}
      >
        {label}
      </span>

      {open &&
        coords &&
        createPortal(
          <span
            role="tooltip"
            style={tooltipStyle}
            className="pointer-events-none whitespace-nowrap rounded-md bg-background px-2 py-1 text-[11px] text-foreground shadow-lg ring-1 ring-border z-1000"
          >
            {tooltip}
          </span>,
          document.body,
        )}
    </span>
  );
}

export function BoardMembersAvatars({
  boardId,
  canManageBoardMembers,
}: {
  boardId: string | null;
  canManageBoardMembers: boolean;
}) {
  const user = useUser();
  const { pendingInvites, boardMembers, isLoading } = useBoardInvites({ boardId });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<
    | {
        kind: "pending";
        inviteId: string;
        email: string;
        status: InviteStatus;
        role: BoardRole;
      }
    | {
        kind: "member";
        userId: string;
        email: string;
        role: BoardRole;
      }
    | null
  >(null);

  const [removeTarget, setRemoveTarget] = useState<{
    userId: string;
    email: string;
  } | null>(null);

  if (!boardId) return null;
  if (isLoading && pendingInvites.length === 0 && boardMembers.length === 0) return null;

  if (pendingInvites.length === 0 && boardMembers.length === 0) return null;

  const handleCloseEdit = () => {
    setEditModalOpen(false);
    setEditTarget(null);
  };

  const handleCloseRemove = () => {
    setRemoveTarget(null);
  };

  const pendingOnly = pendingInvites.filter(
    (invite) => invite.status === InviteStatusEnum.Pending,
  );
  const sortedBoardMembers = [...boardMembers].sort((a, b) => {
    const roleOrderDiff = ROLE_ORDER[a.role] - ROLE_ORDER[b.role];
    if (roleOrderDiff !== 0) return roleOrderDiff;
    return a.user.email.localeCompare(b.user.email);
  });

  return (
    <>
      <div className="flex items-center -space-x-2">
        {pendingOnly.map((invite: InviteItem) => (
          <AvatarWithTooltip
            key={`pending-${invite.id}`}
            label="P"
            className="bg-muted text-foreground border-background/70"
            tooltip={
              <span className="flex flex-col gap-0.5">
                <span>Status: {invite.status}</span>
                <span>
                  Email: <span className="text-primary">{invite.email}</span>
                </span>
              </span>
            }
            onClick={
              canManageBoardMembers
                ? () => {
                    setEditTarget({
                      kind: "pending",
                      inviteId: invite.id,
                      email: invite.email,
                      status: invite.status,
                      role: invite.role,
                    });
                    setEditModalOpen(true);
                  }
                : undefined
            }
          />
        ))}
        {sortedBoardMembers.map((m: MemberItem) => {
          const canRemoveThisMember = canManageBoardMembers && user?.id !== m.user.id;
          const classes = roleClasses(m.role);
          return (
            <AvatarWithTooltip
              key={`member-${m.user.id}`}
              label={toInitials(m.user.name ?? undefined, m.user.email)}
              className={[classes.bg, classes.text, classes.border].join(" ")}
              hoverAction={canRemoveThisMember}
              onHoverActionClick={
                canRemoveThisMember
                  ? () => {
                      setRemoveTarget({ userId: m.user.id, email: m.user.email });
                    }
                  : undefined
              }
              tooltip={
                <span className="flex flex-col gap-0.5">
                  <span>Role: {m.role}</span>
                  <span>
                    Email: <span className={classes.text}>{m.user.email}</span>
                  </span>
                </span>
              }
              onClick={
                canManageBoardMembers
                  ? () => {
                      setEditTarget({
                        kind: "member",
                        userId: m.user.id,
                        email: m.user.email,
                        role: m.role,
                      });
                      setEditModalOpen(true);
                    }
                  : undefined
              }
            />
          );
        })}
      </div>

      {editTarget && (
        <InviteBoardMemberModal
          key={`edit-${editTarget.kind}-${
            editTarget.kind === "pending" ? editTarget.inviteId : editTarget.userId
          }`}
          open={editModalOpen}
          onClose={handleCloseEdit}
          boardId={boardId}
          mode="edit"
          editTarget={editTarget}
        />
      )}

      {removeTarget && (
        <DeleteBoardMemberConfirmModal
          open={true}
          onClose={handleCloseRemove}
          boardId={boardId}
          userId={removeTarget.userId}
          email={removeTarget.email}
        />
      )}
    </>
  );
}
