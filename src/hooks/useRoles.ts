import { useState, useEffect, useCallback } from "react"
import { Role } from "@/types"
import { mockApi } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export function useRoles() {
  const [roles, setRoles] = useState<Role[] | any>([])
  const [permissions, setPermissions] = useState<string[] | any>([])

  const fetchRoles = useCallback(async () => {
    const fetchedRoles = [
      {
        id: 1,
        name: "Admin",
        permissions: {
          read: { name: "read", level: "high" },
          write: { name: "write", level: "high" },
          delete: { name: "delete", level: "high" },
        },
      },
      {
        id: 2,
        name: "Editor",
        permissions: {
          read: { name: "read", level: "high" },
          write: { name: "write", level: "medium" },
          delete: { name: "delete", level: "low" },
        },
      },
      {
        id: 3,
        name: "Viewer",
        permissions: {
          read: { name: "read", level: "high" },
          write: { name: "write", level: null },
          delete: { name: "delete", level: null },
        },
      },
    ];
    setRoles(fetchedRoles);
  }, [])

  const fetchPermissions = useCallback(async () => {
    const fetchedPermissions = await mockApi.getPermissions()
    setPermissions(fetchedPermissions)
  }, [])

  useEffect(() => {
    fetchRoles()
    fetchPermissions()
  }, [fetchRoles, fetchPermissions])

  const createRole = async (role: Omit<Role, "id">) => {
    const newRole = await mockApi.createRole(role)
    setRoles([...roles, newRole])
    toast({
      title: "Role created",
      description: `${newRole.name} role has been added to the system.`,
      className: "bg-green-100 border-green-400 text-green-800",
    })
  }

  const updateRole = async (role: Role) => {
    const oldRole = roles.find(r => r.id === role.id)
    const updatedRole = await mockApi.updateRole(role)
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)))
    
    // Check if permissions have changed
    const hasPermissionsChanged = JSON.stringify(oldRole?.permissions) !== JSON.stringify(role.permissions)
    
    if (hasPermissionsChanged) {
      toast({
        title: "Role updated",
        description: `${updatedRole.name} role's permissions have been updated.`,
        className: "bg-blue-100 border-blue-400 text-blue-800",
      })
    }
    
    return hasPermissionsChanged
  }

  const deleteRole = async (id: number) => {
    await mockApi.deleteRole(id)
    setRoles(roles.filter((r: { id: number }) => r.id !== id))
    toast({
      title: "Role deleted",
      description: "The role has been removed from the system.",
      className: "bg-red-100 border-red-400 text-red-800",
    })
  }

  const addPermission = (permission: string) => {
    setPermissions([...permissions, permission])
    setRoles(roles.map(role => ({
      ...role,
      permissions: {
        ...role.permissions,
        [permission]: { name: permission, level: null },
      }
    })))
    toast({
      title: "Permission added",
      description: `${permission} permission has been added to the system.`,
      className: "bg-green-100 border-green-400 text-green-800",
    })
  }

  const deletePermission = (permissionToDelete: string) => {
    setPermissions(permissions.filter(permission => permission !== permissionToDelete))
    setRoles(roles.map(role => ({
      ...role,
      permissions: Object.fromEntries(
        Object.entries(role.permissions).filter(([key]) => key !== permissionToDelete)
      )
    })))
    toast({
      title: "Permission deleted",
      description: `${permissionToDelete} permission has been removed from the system.`,
      className: "bg-red-100 border-red-400 text-red-800",
    })
  }

  return { roles, permissions, createRole, updateRole, deleteRole, addPermission, deletePermission }
}

