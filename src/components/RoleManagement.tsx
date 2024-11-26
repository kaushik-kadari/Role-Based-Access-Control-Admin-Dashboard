import { useState } from "react"
import { Role } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { RoleForm } from "@/components/RoleForm"
import { ConfirmationDialog } from "@/components/ConfirmationDialog"
import { motion, AnimatePresence } from "framer-motion"
import { Trash2 } from 'lucide-react'
import { Pencil } from 'lucide-react'

interface RoleManagementProps {
  roles: Role[]
  permissions: string[]
  onCreateRole: (role: Omit<Role, "id">) => Promise<void>
  onUpdateRole: (role: Role) => Promise<void>
  onDeleteRole: (id: number) => Promise<void>
  darkMode: boolean
}

export function RoleManagement({ roles, permissions, onCreateRole, onUpdateRole, onDeleteRole, darkMode }: RoleManagementProps) {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isRoleDialogOpen, setIsRoleDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => {})
  const [confirmDialogProps, setConfirmDialogProps] = useState({
    title: "",
    description: "",
    actionType: "create" as "create" | "update" | "delete"
  })

  const handleCreateRole = async (role: Omit<Role, "id">) => {
    setConfirmDialogProps({
      title: "Create Role",
      description: "Are you sure you want to create this role?",
      actionType: "create"
    })
    setConfirmAction(() => async () => {
      await onCreateRole(role)
      setIsRoleDialogOpen(false)
    })
    setIsConfirmDialogOpen(true)
  }

  const handleUpdateRole = async (role: Role) => {
    setConfirmDialogProps({
      title: "Update Role",
      description: "Are you sure you want to update this role?",
      actionType: "update"
    })
    setConfirmAction(() => async () => {
      await onUpdateRole(role)
      setIsRoleDialogOpen(false)
    })
    setIsConfirmDialogOpen(true)
  }

  const handleDeleteRole = async (id: number) => {
    setConfirmDialogProps({
      title: "Delete Role",
      description: "Are you sure you want to delete this role? This action cannot be undone.",
      actionType: "delete"
    })
    setConfirmAction(() => async () => {
      await onDeleteRole(id)
    })
    setIsConfirmDialogOpen(true)
  }

  return (
    <Card className={`${!darkMode ? "bg-primary-gradient" : "dark:bg-gray-800"} shadow-lg hover:shadow-xl transition-shadow duration-300`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold text-[#2d2d2d] dark:text-white">Role Management</CardTitle>
        <Dialog open={isRoleDialogOpen} onOpenChange={setIsRoleDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => setSelectedRole(null)}
              className="bg-[#1abc9c] hover:bg-[#16a085] text-white transition-colors duration-100 dark:bg-[#2c7a7b] dark:hover:bg-[#285e61]"
            >
              Add Role
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <DialogHeader>
                <DialogTitle className="text-[#2d2d2d] dark:text-white">{selectedRole ? "Edit Role" : "Add Role"}</DialogTitle>
                <DialogDescription className="text-[#7f8c8d] dark:text-gray-400">
                  {selectedRole ? "Edit role details below." : "Enter new role details below."}
                </DialogDescription>
              </DialogHeader>
              <RoleForm
                role={selectedRole}
                permissions={permissions}
                onSubmit={async (role) => {
                  if (selectedRole) {
                    await handleUpdateRole(role as Role)
                  } else {
                    await handleCreateRole(role as Omit<Role, "id">)
                  }
                }}
              />
            </motion.div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#2d2d2d] dark:text-gray-300">Name</TableHead>
                <TableHead className="text-[#2d2d2d] dark:text-gray-300">Permissions</TableHead>
                <TableHead className="text-[#2d2d2d] dark:text-gray-300">Actions</TableHead>
              </TableRow>
            </TableHeader>
            </Table>
            <div className="overflow-y-auto max-h-[400px]">
            <Table>
            <TableBody>
              <AnimatePresence>
                {roles.map((role) => (
                  <motion.tr
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0, transition: { duration: 0.1 } }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.1 }}
                    className="hover:bg-[#e2d7cc5f] dark:hover:bg-gray-700 transition-colors duration-100"
                  >
                    <TableCell className="font-medium text-[#2d2d2d] dark:text-white">{role.name}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(role.permissions)
                          .filter(([_, permission]) => permission.level !== null && permission.level !== undefined)
                          .map(([permissionName, permission]) => (
                            <Badge
                              key={permissionName}
                              variant="outline"
                              className="bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900 dark:text-blue-100 dark:border-blue-700"
                            >
                              {permissionName}{permission.level ? ` (${permission.level})` : ''}
                            </Badge>
                          ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto border-[#1abc9c] text-[#1abc9c] hover:bg-[#1abc9c] hover:text-white transition-colors duration-100 dark:border-[#ffffff] dark:text-[#4bd5d7] dark:hover:bg-[#2c7a7b] dark:hover:text-white"
                          onClick={() => {
                            setSelectedRole(role)
                            setIsRoleDialogOpen(true)
                          }}
                        >
                          <Pencil size={16} />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto border-[#e74c3c] text-[#e74c3c] hover:bg-[#e74c3c] hover:text-white transition-colors duration-100 dark:border-[#ffffff] dark:text-[#ff4c4c] dark:hover:bg-[#9b2c2c] dark:hover:text-white"
                          onClick={() => handleDeleteRole(role.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          </div>
      </CardContent>
      <ConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={confirmAction}
        title={confirmDialogProps.title}
        description={confirmDialogProps.description}
        actionType={confirmDialogProps.actionType}
      />
    </Card>
  )
}

