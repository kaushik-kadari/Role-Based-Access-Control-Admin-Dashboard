import { useState } from "react"
import { Role, PermissionLevel } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, Trash2 } from 'lucide-react'
import { ConfirmationDialog } from "@/components/ConfirmationDialog"

interface PermissionsMatrixProps {
  roles: Role[]
  permissions: string[]
  onUpdateRole: (role: Role) => Promise<void>
  onAddPermission: (permission: string) => void
  onDeletePermission: (permission: string) => void
  darkMode: boolean
}

const levelToValue: Record<PermissionLevel, number> = {
  low: 1,
  medium: 2,
  high: 3,
}

const valueToLevel: Record<number, PermissionLevel> = {
  1: "low",
  2: "medium",
  3: "high",
}

export function PermissionsMatrix({ roles, permissions, onUpdateRole, onAddPermission, onDeletePermission, darkMode }: PermissionsMatrixProps) {
  const [newPermission, setNewPermission] = useState("")
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({})
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [pendingPermissionChange, setPendingPermissionChange] = useState<{
    role: Role;
    permissionName: string;
    checked: boolean;
    value?: number;
  } | null>(null)
  const [permissionToDelete, setPermissionToDelete] = useState<string | null>(null)
  const [confirmDialogProps, setConfirmDialogProps] = useState({
    title: "",
    description: "",
    actionType: "create" as "create" | "update" | "delete"
  })

  const handlePermissionChange = (role: Role, permissionName: string, checked: boolean, value?: number) => {
    setPendingPermissionChange({ role, permissionName, checked, value })
    setConfirmDialogProps({
      title: "Update Permission",
      description: `Are you sure you want to update the ${permissionName} permission for ${role.name}?`,
      actionType: "update"
    })
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmPermissionChange = async () => {
    if (pendingPermissionChange) {
      const { role, permissionName, checked, value } = pendingPermissionChange
      const updatedRole = {
        ...role,
        permissions: {
          ...role.permissions,
          [permissionName]: {
            name: permissionName,
            level: checked ? (value ? valueToLevel[value] : "low") : null,
          },
        },
      }
      await onUpdateRole(updatedRole)
      
      // Only update the slider value if the permission change was confirmed
      if (value) {
        setSliderValues(prev => ({ ...prev, [`${role.id}-${permissionName}`]: value }))
      }
    }
    setPendingPermissionChange(null)
    setIsConfirmDialogOpen(false)
  }

  const handleCancelPermissionChange = () => {
    // Reset the slider value to the original value if the change was cancelled
    if (pendingPermissionChange) {
      const { role, permissionName } = pendingPermissionChange
      const originalValue = levelToValue[role.permissions[permissionName]?.level || "low"]
      setSliderValues(prev => ({ ...prev, [`${role.id}-${permissionName}`]: originalValue }))
    }
    setPendingPermissionChange(null)
    setPermissionToDelete(null)
    setIsConfirmDialogOpen(false)
  }

  const handleAddPermission = () => {
    if (newPermission && !permissions.includes(newPermission)) {
      setConfirmDialogProps({
        title: "Add Permission",
        description: `Are you sure you want to add the ${newPermission} permission?`,
        actionType: "create"
      })
      setIsConfirmDialogOpen(true)
    }
  }

  const handleConfirmAddPermission = () => {
    if (newPermission && !permissions.includes(newPermission)) {
      onAddPermission(newPermission)
      setNewPermission("")
    }
    setIsConfirmDialogOpen(false)
  }

  const handleDeletePermission = (permission: string) => {
    setPermissionToDelete(permission)
    setConfirmDialogProps({
      title: "Delete Permission",
      description: `Are you sure you want to delete the ${permission} permission? This action cannot be undone.`,
      actionType: "delete"
    })
    setIsConfirmDialogOpen(true)
  }

  const handleConfirmDeletePermission = () => {
    if (permissionToDelete) {
      onDeletePermission(permissionToDelete)
      setPermissionToDelete(null)
    }
    setIsConfirmDialogOpen(false)
  }

  const handleConfirmAction = () => {
    switch (confirmDialogProps.actionType) {
      case "update":
        handleConfirmPermissionChange()
        break
      case "create":
        handleConfirmAddPermission()
        break
      case "delete":
        handleConfirmDeletePermission()
        break
    }
  }

  return (
    <Card className={`${!darkMode ? "bg-primary-gradient" : "dark:bg-gray-800"} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-[#2d2d2d] dark:text-white">Permissions Matrix</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mb-4">
          <Input
            placeholder="New permission name"
            value={newPermission}
            onChange={(e) => setNewPermission(e.target.value)}
            className="w-full sm:max-w-xs border border-gray-400 text-black dark:bg-gray-900 dark:text-white"
          />
          <Button onClick={handleAddPermission} className="w-full text-white sm:w-auto bg-[#1abc9c] hover:bg-[#16a085] dark:bg-[#2c7a7b] dark:hover:bg-[#285e61]">
            <Plus className="mr-2 h-4 w-4" /> Add Permission
          </Button>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#2d2d2d] dark:text-gray-300">Role</TableHead>
                {permissions.map((permission) => (
                  <TableHead key={permission} className="text-[#2d2d2d] dark:text-gray-300">
                    <div className="flex items-center justify-between">
                      <span>{permission}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePermission(permission)}
                        className="ml-2 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id} className="hover:bg-[#e2d7cc5f] dark:hover:bg-gray-700 transition-colors duration-150">
                  <TableCell className="font-medium text-[#2d2d2d] dark:text-white">{role.name}</TableCell>
                  {permissions.map((permissionName) => (
                    <TableCell key={`${role.id}-${permissionName}`}>
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            checked={role.permissions[permissionName]?.level !== null}
                            onCheckedChange={(checked) => handlePermissionChange(role, permissionName, checked as boolean)}
                            className="mr-2"
                          />
                          <span className="text-sm text-[#2d2d2d] dark:text-gray-300">{permissionName}</span>
                        </div>
                        {role.permissions[permissionName]?.level !== null && (
                          <div className="flex items-center space-x-2">
                            <Slider
                              value={[sliderValues[`${role.id}-${permissionName}`] || levelToValue[role.permissions[permissionName]?.level || "low"]]}
                              min={1}
                              max={3}
                              step={1}
                              onValueChange={([value]) => setSliderValues(prev => ({ ...prev, [`${role.id}-${permissionName}`]: value }))}
                              onValueCommit={([value]) => handlePermissionChange(role, permissionName, true, value)}
                              className="w-32"
                            />
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              {valueToLevel[sliderValues[`${role.id}-${permissionName}`]] || role.permissions[permissionName]?.level || ""}
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={handleCancelPermissionChange}
        onConfirm={handleConfirmAction}
        title={confirmDialogProps.title}
        description={confirmDialogProps.description}
        actionType={confirmDialogProps.actionType}
      />
    </Card>
  )
}