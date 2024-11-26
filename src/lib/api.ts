import { User, Role, Permission } from "@/types"

// Mock API functions
export const mockApi = {
  getUsers: (): Promise<User[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: "John Doe", email: "john@example.com", role: "Admin", status: "Active" },
          { id: 2, name: "Jane Smith", email: "jane@example.com", role: "Editor", status: "Active" },
          { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "Viewer", status: "Active" },
          { id: 4, name: "Alice Brown", email: "alice@example.com", role: "Admin", status: "Active" },
          { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "Editor", status: "Inactive" },
          { id: 6, name: "Eve Wilson", email: "eve@example.com", role: "Viewer", status: "Active" },
          { id: 7, name: "Frank Thomas", email: "frank@example.com", role: "Admin", status: "Inactive" },
          { id: 8, name: "Grace Martinez", email: "grace@example.com", role: "Editor", status: "Active" },
          { id: 9, name: "Hank Jackson", email: "hank@example.com", role: "Viewer", status: "Inactive" },
          { id: 10, name: "Ivy Clark", email: "ivy@example.com", role: "Admin", status: "Active" },
        ])
      }, 500)
    })
  },
  getRoles: (): Promise<Role[] | any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, name: "Admin", permissions: ["read", "write", "delete"] },
          { id: 2, name: "Editor", permissions: ["read", "write"] },
          { id: 3, name: "Viewer", permissions: ["read"] },
        ])
      }, 500)
    })
  },
  getPermissions: (): Promise<Permission[] | any> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(["read", "write", "delete"])
      }, 500)
    })
  },
  createUser: (user: Omit<User, "id">): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...user, id: Math.floor(Math.random() * 1000) })
      }, 500)
    })
  },
  updateUser: (user: User): Promise<User> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(user)
      }, 500)
    })
  },
  deleteUser: (id: number): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(id)
      }, 500)
    })
  },
  createRole: (role: Omit<Role, "id">): Promise<Role> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ ...role, id: Math.floor(Math.random() * 1000) })
      }, 500)
    })
  },
  updateRole: (role: Role): Promise<Role> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(role)
      }, 500)
    })
  },
  deleteRole: (id: number): Promise<number> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(id)
      }, 500)
    })
  },
}

