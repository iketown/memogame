import React, { createContext, useContext } from "react"
import { useInvitations } from "../hooks/Invitations/useInvitations"

const InvitationCtx = createContext()

export const InvitationCtxProvider = props => {
  const { sentInvites = [], receivedInvites } = useInvitations()

  return (
    <InvitationCtx.Provider
      value={{
        sentInvites,
        receivedInvites
      }}
      {...props}
    />
  )
}

export const useInvitationCtx = () => {
  const ctx = useContext(InvitationCtx)
  if (!ctx)
    throw new Error(
      "useInvitationCtx must be a descendant of InvitationCtxProvider 😕"
    )
  const { sentInvites, receivedInvites } = ctx
  return {
    sentInvites,
    receivedInvites
  }
}
