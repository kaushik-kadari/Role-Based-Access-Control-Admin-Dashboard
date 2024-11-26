"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence, LayoutGroup } from "framer-motion"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, ShieldCheck, Key, ClipboardList, Menu, Sun, Moon } from 'lucide-react'
import { UserManagement } from "@/components/UserManagement"
import { RoleManagement } from "@/components/RoleManagement"
import { PermissionsMatrix } from "@/components/PermissionsMatrix"
import { AuditLogs } from "@/components/AuditLogs"
import { useUsers } from "@/hooks/useUsers"
import { useRoles } from "@/hooks/useRoles"
import { useAuditLogs } from "@/hooks/useAuditLogs"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Role, User } from "@/types"

const DarkModeToggle = ({ darkMode, toggleDarkMode }: { darkMode: boolean; toggleDarkMode: () => void }) => (
  <Button
    variant="outline"
    size="icon"
    onClick={toggleDarkMode}
    className="ml-2 rounded-full border-2 text-gray-600 dark:text-white border-gray-500 hover:bg-gray-800 hover:text-white hover:border-white  dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-white"
  >
    {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
  </Button>
)

export default function AdminDashboard() {
  const { users, createUser, updateUser, deleteUser } = useUsers()
  const { roles, permissions, createRole, updateRole, deleteRole, addPermission, deletePermission } = useRoles()
  const { auditLogs, addAuditLog } = useAuditLogs()
  const [activeTab, setActiveTab] = useState("users")
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDarkMode = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDarkMode)
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
    localStorage.setItem('darkMode', (!darkMode).toString())
  }

  const handleCreateUser = async (user: Omit<User, "id">) => {
    await createUser(user)
    addAuditLog("User Created", `${user.name} has been added to the system.`)
  }

  const handleUpdateUser = async (user: User) => {
    await updateUser(user)
    addAuditLog("User Updated", `${user.name}'s information has been updated.`)
  }

  const handleDeleteUser = async (ids: number | number[]) => {
    const usersToDelete = users.filter(u => (Array.isArray(ids) ? ids.includes(u.id) : u.id === ids))
    await deleteUser(ids)
    addAuditLog("User Deleted", `${usersToDelete.map(u => u.name).join(', ')} have been removed from the system.`)
  }

  const handleCreateRole = async (role: Omit<Role, "id">) => {
    await createRole(role)
    addAuditLog("Role Created", `${role.name} role has been added to the system.`)
  }

  const handleUpdateRole = async (role: Role) => {
    const hasPermissionsChanged = await updateRole(role)
    if (hasPermissionsChanged) {
      addAuditLog("Role Updated", `${role.name} role's permissions have been updated.`)
    }
  }

  const handleDeleteRole = async (id: number) => {
    const roleToDelete = roles.find(r => r.id === id)
    await deleteRole(id)
    addAuditLog("Role Deleted", `${roleToDelete?.name} role has been removed from the system.`)
  }

  const handleDeletePermission = async (permission: string) => {
    deletePermission(permission)
    addAuditLog("Permission Deleted", `${permission} permission has been removed from the system.`)
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    setIsSheetOpen(false)
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-[#1A202C]' : 'bg-[#F7F7F7]'}`}>
      <header className={`sticky top-0 z-10 ${darkMode ? 'dark bg-gray-800 border-b' : 'bg-primary-gradient'} shadow-md`}>
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex-1 flex justify-center">
            <h1 className="text-2xl font-bold text-[#2d2d2d] dark:text-white">Admin Dashboard</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="md:hidden border-2 dark:bg-gray-700 dark:hover:bg-gray-600 border-black dark:border-white hover:bg-gray-800 hover:text-white">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[250px] bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
                <nav className="flex flex-col space-y-2 mt-4">
                  {["users", "roles", "permissions", "audit-logs"].map((tab) => (
                    <Button
                      key={tab}
                      variant={activeTab === tab ? "default" : "ghost"}
                      className="justify-start"
                      onClick={() => handleTabChange(tab)}
                    >
                      {tab === "users" && <Users className="mr-2 h-5 w-5" />}
                      {tab === "roles" && <ShieldCheck className="mr-2 h-5 w-5" />}
                      {tab === "permissions" && <Key className="mr-2 h-5 w-5" />}
                      {tab === "audit-logs" && <ClipboardList className="mr-2 h-5 w-5" />}
                      <span className="capitalize">{tab.replace("-", " ")}</span>
                    </Button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
            <DarkModeToggle darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
          </div>
        </div>
      </header>
      <main className="container mx-auto p-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} defaultValue="users" className="space-y-4">
          <TabsList className={`sticky top-20 z-10 hidden md:grid w-full border shadow-md grid-cols-4 mb-8 ${!darkMode ? 'bg-primary-gradient' :  'dark bg-gray-800 border'}`}>
            <LayoutGroup>
              {["users", "roles", "permissions", "audit-logs"].map((tab) => (
                <TabsTrigger key={tab} value={tab} className="relative">
                  <motion.div
                    className={`absolute inset-0 rounded-md border transition-colors duration-300 ${!darkMode ? 'bg-secondary-gradient border-gray-300' : 'bg-gray-700 border-gray-600'}`}
                    animate={{ opacity: activeTab === tab ? 1 : 0 }}
                    transition={{ opacity: { duration: 0.3 } }}
                    />
                  <motion.div className="relative z-10 flex items-center justify-center space-x-2">
                    {tab === "users" && <Users className="w-5 h-5" />}
                    {tab === "roles" && <ShieldCheck className="w-5 h-5" />}
                    {tab === "permissions" && <Key className="w-5 h-5" />}
                    {tab === "audit-logs" && <ClipboardList className="w-5 h-5" />}
                    <span className="capitalize">{tab.replace("-", " ")}</span>
                  </motion.div>
                </TabsTrigger>
              ))}
            </LayoutGroup>
          </TabsList>
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === "users" && (
                <UserManagement
                  users={users}
                  roles={roles}
                  onCreateUser={handleCreateUser}
                  onUpdateUser={handleUpdateUser}
                  onDeleteUser={handleDeleteUser}
                  darkMode={darkMode}
                />
              )}
              {activeTab === "roles" && (
                <RoleManagement
                  roles={roles}
                  permissions={permissions}
                  onCreateRole={handleCreateRole}
                  onUpdateRole={handleUpdateRole}
                  onDeleteRole={handleDeleteRole}
                  darkMode={darkMode}
                />
              )}
              {activeTab === "permissions" && (
                <PermissionsMatrix
                  roles={roles}
                  permissions={permissions}
                  onUpdateRole={handleUpdateRole}
                  onAddPermission={(permission) => {
                    addPermission(permission)
                    addAuditLog("Permission Added", `${permission} permission has been added to the system.`)
                  }}
                  onDeletePermission={handleDeletePermission}
                  darkMode={darkMode}
                />
              )}
              {activeTab === "audit-logs" && (
                <AuditLogs auditLogs={auditLogs} darkMode={darkMode} />
              )}
            </motion.div>
          </AnimatePresence>
        </Tabs>
      </main>
    </div>
  )
}


