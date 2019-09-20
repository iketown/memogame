import React, { createContext, useContext } from "react"
import { useInvitations } from "../hooks/Invitations/useInvitations"
import { useFriendProfiles } from "../hooks/Invitations/useFriendProfiles"

const InvitationCtx = createContext()

export const InvitationCtxProvider = props => {
  const { sentInvites = [], receivedInvites } = useInvitations()
  const { friendProfiles } = useFriendProfiles(
    sentInvites.map(inv => inv.invited)
  )
  return (
    <InvitationCtx.Provider
      value={{
        sentInvites,
        receivedInvites,
        friendProfiles
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
  const { sentInvites, receivedInvites, friendProfiles } = ctx
  return {
    sentInvites,
    receivedInvites,
    friendProfiles
  }
}
