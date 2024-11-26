import { useState, useEffect, useCallback } from "react"
import { User } from "@/types"
import { mockApi } from "@/lib/api"
import { toast } from "@/hooks/use-toast"

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])

  const fetchUsers = useCallback(async () => {
    const fetchedUsers = await mockApi.getUsers()
    setUsers(fetchedUsers)
  }, [])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const createUser = async (user: Omit<User, "id">) => {
    const newUser = await mockApi.createUser(user)
    setUsers([...users, newUser])
    toast({
      title: "User created",
      description: `${newUser.name} has been added to the system.`,
      className: "bg-green-100 border-green-400 text-green-800",
    })
  }

  const updateUser = async (user: User) => {
    const updatedUser = await mockApi.updateUser(user)
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
    toast({
      title: "User updated",
      description: `${updatedUser.name}'s information has been updated.`,
      className: "bg-blue-100 border-blue-400 text-blue-800",
    })
  }

  const deleteUser = async (ids: number | number[]) => {
    const idsArray = Array.isArray(ids) ? ids : [ids]
    await Promise.all(idsArray.map(id => mockApi.deleteUser(id)))
    setUsers(users.filter((u) => !idsArray.includes(u.id)))
    toast({
      title: idsArray.length === 1 ? "User deleted" : "Users deleted",
      description: `${idsArray.length === 1 ? "User" : "Users"} have been removed from the system.`,
      className: "bg-red-100 border-red-400 text-red-800",
    })
  }

  return { users, createUser, updateUser, deleteUser }
}

