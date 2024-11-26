import { useState, useMemo } from "react"
import { User, Role, SortBy, SortOrder } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { UserForm } from "@/components/UserForm"
import { ConfirmationDialog } from "@/components/ConfirmationDialog"
import { motion, AnimatePresence } from "framer-motion"
import { UserPen, Trash2, Users } from 'lucide-react'

interface UserManagementProps {
  users: User[]
  roles: Role[]
  onCreateUser: (user: Omit<User, "id">) => Promise<void>
  onUpdateUser: (user: User) => Promise<void>
  onDeleteUser: (id: number | number[]) => Promise<void>
  darkMode: boolean
}

export function UserManagement({ users, roles, onCreateUser, onUpdateUser, onDeleteUser, darkMode }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState<SortBy>("name")
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [selectedUserIds, setSelectedUserIds] = useState<Set<number>>(new Set())
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false)
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => {})
  const [confirmDialogProps, setConfirmDialogProps] = useState({
    title: "",
    description: "",
    actionType: "create" as "create" | "update" | "delete"
  })

  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(
        (user) =>
          user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          user.role.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .sort((a, b) => {
        const aValue = a[sortBy].toLowerCase()
        const bValue = b[sortBy].toLowerCase()
        if (aValue < bValue) return sortOrder === "asc" ? -1 : 1
        if (aValue > bValue) return sortOrder === "asc" ? 1 : -1
        return 0
      })
  }, [users, searchQuery, sortBy, sortOrder])

  const handleCreateUser = async (user: Omit<User, "id">) => {
    setConfirmDialogProps({
      title: "Create User",
      description: "Are you sure you want to create this user?",
      actionType: "create"
    })
    setConfirmAction(() => async () => {
      await onCreateUser(user)
      setIsUserDialogOpen(false)
    })
    setIsConfirmDialogOpen(true)
  }

  const handleUpdateUser = async (user: User) => {
    setConfirmDialogProps({
      title: "Update User",
      description: "Are you sure you want to update this user?",
      actionType: "update"
    })
    setConfirmAction(() => async () => {
      await onUpdateUser(user)
      setIsUserDialogOpen(false)
    })
    setIsConfirmDialogOpen(true)
  }

  const handleDeleteUsers = async (ids: number | number[]) => {
    const isMultiple = Array.isArray(ids) && ids.length > 1
    setConfirmDialogProps({
      title: `Delete User${isMultiple ? 's' : ''}`,
      description: `Are you sure you want to delete ${isMultiple ? 'these users' : 'this user'}? This action cannot be undone.`,
      actionType: "delete"
    })
    setConfirmAction(() => async () => {
      await onDeleteUser(ids)
      setSelectedUserIds(new Set())
    })
    setIsConfirmDialogOpen(true)
  }

  const toggleSelectAll = () => {
    if (selectedUserIds.size === filteredAndSortedUsers.length) {
      setSelectedUserIds(new Set())
    } else {
      setSelectedUserIds(new Set(filteredAndSortedUsers.map(user => user.id)))
    }
  }

  const toggleSelectUser = (id: number) => {
    const newSelectedIds = new Set(selectedUserIds)
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id)
    } else {
      newSelectedIds.add(id)
    }
    setSelectedUserIds(newSelectedIds)
  }

  return (
    <Card className={`${!darkMode ? "bg-primary-gradient" : "dark:bg-gray-800"} shadow-lg hover:shadow-xl transition-shadow duration-300 `}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="flex items-center space-x-4">
          <CardTitle className="text-2xl font-bold text-[#2d2d2d] dark:text-white transition-colors duration-100">User Management</CardTitle>
          {selectedUserIds.size > 0 && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
              {selectedUserIds.size} selected
            </Badge>
          )}
        </div>
        <div className="flex space-x-2">
          {selectedUserIds.size > 0 && (
            <Button
              variant="outline"
              onClick={() => handleDeleteUsers(Array.from(selectedUserIds)) }
              className="bg-[#e74c3c] hover:bg-[#c0392b] text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Selected
            </Button>
          )}
          <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                onClick={() => setSelectedUser(null)}
                className="bg-[#1abc9c] hover:bg-[#16a085] text-white transition-colors duration-200 dark:bg-[#2c7a7b] dark:hover:bg-[#285e61]"
              >
                <Users className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.1 }}
              >
                <DialogHeader>
                  <DialogTitle className="text-[#2d2d2d] dark:text-white transition-colors duration-100">
                    {selectedUser ? "Edit User" : "Add User"}
                  </DialogTitle>
                  <DialogDescription className="text-[#7f8c8d] dark:text-gray-400 transition-colors duration-100">
                    {selectedUser ? "Edit user details below." : "Enter new user details below."}
                  </DialogDescription>
                </DialogHeader>
                <UserForm
                  user={selectedUser}
                  roles={roles}
                  onSubmit={async (user) => {
                    if (selectedUser) {
                      await handleUpdateUser(user as User)
                    } else {
                      await handleCreateUser(user)
                    }
                  }}
                />
              </motion.div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 space-y-4 md:space-y-0">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:max-w-sm border border-gray-400 dark:border-white text-black dark:bg-gray-900 dark:text-white"
          />
          <div className="flex items-center space-x-2 w-full md:w-auto transition-colors duration-100">
            <Select value={sortBy} onValueChange={(value: SortBy) => setSortBy(value)}>
              <SelectTrigger className="w-full md:w-[180px] border-gray-400 dark:outline outline-1">
                <SelectValue placeholder="Sort by"/>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name" className="hover:bg-[#e2d7cc5f]">Name</SelectItem>
                <SelectItem value="email" className="hover:bg-[#e2d7cc5f]">Email</SelectItem>
                <SelectItem value="role" className="hover:bg-[#e2d7cc5f]">Role</SelectItem>
                <SelectItem value="status" className="hover:bg-[#e2d7cc5f]">Status</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="bg-[#1abc9c] hover:bg-[#16a085] text-white transition-colors duration-200 dark:bg-[#2b8f91] dark:hover:bg-[#285e61]"
            >
              {sortOrder === "asc" ? "↑" : "↓"}
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="">
              <TableRow>
                <TableHead className="w-[50px]">
                  <Checkbox
                    checked={selectedUserIds.size === filteredAndSortedUsers.length && filteredAndSortedUsers.length > 0}
                    onCheckedChange={toggleSelectAll}
                    aria-label="Select all"
                    className="border-black dark:border-white "
                  />
                </TableHead>
                <TableHead className="text-[#2d2d2d] dark:text-gray-300 transition-colors duration-100">Name</TableHead>
                <TableHead className="text-[#2d2d2d] dark:text-gray-300 transition-colors duration-100">Email</TableHead>
                <TableHead className="text-[#2d2d2d] dark:text-gray-300 transition-colors duration-100">Role</TableHead>
                <TableHead className="text-[#2d2d2d] dark:text-gray-300 transition-colors duration-100">Status</TableHead>
                <TableHead className="text-[#2d2d2d] dark:text-gray-300 transition-colors duration-100">Actions</TableHead>
              </TableRow>
            </TableHeader>
            </Table>
             <div className="overflow-y-auto max-h-[400px]">
            <Table>
            <TableBody>
              <AnimatePresence>
                {filteredAndSortedUsers.map((user) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.15 }}
                    className={`hover:bg-[#e2d7cc5f] dark:hover:bg-gray-700/50 transition-colors duration-150 ${
                      selectedUserIds.has(user.id) ? 'bg-[#e2d7cc5f] dark:bg-gray-700/50' : ''
                    }`}
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedUserIds.has(user.id)}
                        onCheckedChange={() => toggleSelectUser(user.id)}
                        aria-label={`Select ${user.name}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-[#2d2d2d] dark:text-white transition-colors duration-100">
                      {user.name}
                    </TableCell>
                    <TableCell className="text-[#615a5a] dark:text-gray-400 transition-colors duration-100">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-[#635c5c] dark:text-gray-400 transition-colors duration-100">
                      {user.role}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={user.status === "Active" ? "default" : "secondary"}
                        className={user.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 transition-colors duration-100 border-[#1abc9c]" : "bg-gray-100 text-gray-800 dark:bg-gray-600 border-gray-500 dark:text-gray-100 transition-colors duration-100"}
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto border-[#1abc9c] text-[#1abc9c] hover:bg-[#1abc9c] hover:text-white transition-colors duration-100 dark:border-[#ffffff] dark:text-[#4bd5d7] dark:hover:bg-[#2c7a7b] dark:hover:text-white"
                          onClick={() => {
                            setSelectedUser(user)
                            setIsUserDialogOpen(true)
                          }}
                        >
                          <UserPen />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full sm:w-auto border-[#e74c3c] text-[#e74c3c] hover:bg-[#e74c3c] hover:text-white transition-colors duration-100 dark:border-[#ffffff] dark:text-[#ff4b4b] dark:hover:bg-[#9b2c2c] dark:hover:text-white"
                          onClick={() => handleDeleteUsers(user.id)}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
          </div>
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