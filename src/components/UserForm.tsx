import { useState } from "react"
import { User, Role } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DialogFooter } from "@/components/ui/dialog"

interface UserFormProps {
  user: User | null
  roles: Role[]
  onSubmit: (user: User | Omit<User, "id">) => void
}

export function UserForm({ user, roles, onSubmit }: UserFormProps) {
  const [name, setName] = useState(user?.name || "")
  const [email, setEmail] = useState(user?.email || "")
  const [role, setRole] = useState(user?.role || roles[0].name)
  const [status, setStatus] = useState<"Active" | "Inactive">(user?.status || "Active")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (user) {
      onSubmit({ ...user, name, email, role, status })
    } else {
      onSubmit({ name, email, role, status })
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right text-[#2d2d2d] dark:text-gray-200">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3 border-[#1abc9c] focus:ring-[#1abc9c] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-[#2c7a7b]"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="email" className="text-right text-[#2d2d2d] dark:text-gray-200">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="col-span-3 border-[#1abc9c] focus:ring-[#1abc9c] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-[#2c7a7b]"
            required
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="role" className="text-right text-[#2d2d2d] dark:text-gray-200">
            Role
          </Label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="col-span-3 border-[#1abc9c] focus:ring-[#1abc9c] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
              <SelectValue placeholder={role} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800">
              {roles.map((r) => (
                <SelectItem key={r.id} value={r.name} className="dark:text-gray-100 dark:focus:bg-gray-700">
                  {r.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="status" className="text-right text-[#2d2d2d] dark:text-gray-200">
            Status
          </Label>
          <Select value={status} onValueChange={(value: "Active" | "Inactive") => setStatus(value)}>
            <SelectTrigger className="col-span-3 border-[#1abc9c] focus:ring-[#1abc9c] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
              <SelectValue placeholder={status} />
            </SelectTrigger>
            <SelectContent className="dark:bg-gray-800">
              <SelectItem value="Active" className="dark:text-gray-100 dark:focus:bg-gray-700">Active</SelectItem>
              <SelectItem value="Inactive" className="dark:text-gray-100 dark:focus:bg-gray-700">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          className="bg-[#1abc9c] hover:bg-[#16a085] text-white transition-colors duration-200 dark:bg-[#2c7a7b] dark:hover:bg-[#285e61]"
        >
          {user ? "Update User" : "Create User"}
        </Button>
      </DialogFooter>
    </form>
  )
}

