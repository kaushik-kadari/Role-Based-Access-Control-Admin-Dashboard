import { useState } from "react"
import { Role, Permission, PermissionLevel } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { DialogFooter } from "@/components/ui/dialog"

interface RoleFormProps {
  role: Role | null
  permissions: string[]
  onSubmit: (role: Role | Omit<Role, "id">) => void
}

export function RoleForm({ role, permissions, onSubmit }: RoleFormProps) {
  const [name, setName] = useState(role?.name || "")
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, Permission>>({})

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (role) {
      onSubmit({ ...role, name, permissions: selectedPermissions })
    } else {
      onSubmit({ name, permissions: selectedPermissions })
    }
  }

  const handlePermissionChange = (permissionName: string, checked: boolean, level?: PermissionLevel) => {
    setSelectedPermissions((prev) => ({
      ...prev,
      [permissionName]: checked
        ? { name: permissionName, level: level || "low" }
        : undefined,
    }))
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right text-[#2d2d2d]">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3 border-[#1abc9c] focus:ring-[#1abc9c] text-black dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-[#2c7a7b]"
            required={!role}
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label className="text-right text-[#2d2d2d]">Permissions</Label>
          <div className="col-span-3 space-y-2">
            {permissions.map((permissionName) => (
              <div key={permissionName} className="flex items-center space-x-2">
                <Checkbox
                  id={`permission-${permissionName}`}
                  checked={selectedPermissions[permissionName] !== undefined}
                  onCheckedChange={(checked) => handlePermissionChange(permissionName, checked as boolean)}
                />
                <Label htmlFor={`permission-${permissionName}`} className="w-24">{permissionName}</Label>
                {selectedPermissions[permissionName] && (
                  <Select
                    value={selectedPermissions[permissionName]?.level || "low"}
                    onValueChange={(value: PermissionLevel) => handlePermissionChange(permissionName, true, value)}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <DialogFooter>
        <Button
          type="submit"
          className="bg-[#1abc9c] hover:bg-[#16a085] text-white transition-colors duration-200"
        >
          {role ? "Update Role" : "Create Role"}
        </Button>
      </DialogFooter>
    </form>
  )
}

