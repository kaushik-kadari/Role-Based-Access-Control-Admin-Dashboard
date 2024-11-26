import { useState, useCallback } from "react"
import { AuditLog } from "@/types"

export function useAuditLogs() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: 1, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "User Created", description: "Initial user John Doe created", performedBy: "Admin" },
    { id: 2, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "Role Created", description: "Initial role Admin created", performedBy: "Admin" },
    { id: 3, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "User Updated", description: "User Jane Doe updated", performedBy: "Admin" },
    { id: 4, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "Role Updated", description: "Role User updated", performedBy: "Admin" },
    { id: 5, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "User Deleted", description: "User Mark Smith deleted", performedBy: "Admin" },
    { id: 6, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "Role Deleted", description: "Role Guest deleted", performedBy: "Admin" },
    { id: 7, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "Permission Deleted", description: "Permission view_reports deleted", performedBy: "Admin" },
    { id: 8, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "User Created", description: "User Alice Johnson created", performedBy: "Admin" },
    { id: 9, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "Role Created", description: "Role Moderator created", performedBy: "Admin" },
    { id: 10, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "Permission Added", description: "Permission edit_profile added", performedBy: "Admin" },
    { id: 11, timestamp: new Date(Date.now() - 86400000).toISOString(), activityType: "User Updated", description: "User Bob Brown updated", performedBy: "Admin" },
  ])

  const addAuditLog = useCallback((activityType: string, description: string) => {
    const newLog: AuditLog = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      activityType,
      description,
      performedBy: "Admin",
    }
    setAuditLogs(prevLogs => [newLog, ...prevLogs])
  }, [])

  return { auditLogs, addAuditLog }
}

