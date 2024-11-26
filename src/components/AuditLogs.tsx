import { useState, useMemo } from "react"
import { AuditLog } from "@/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"

interface AuditLogsProps {
  auditLogs: AuditLog[]
  darkMode: boolean
}

export function AuditLogs({ auditLogs, darkMode }: AuditLogsProps) {
  const [startDate, setStartDate] = useState<string>("")
  const [endDate, setEndDate] = useState<string>("")
  const [activityTypeFilter, setActivityTypeFilter] = useState<string>("")

  const filteredAuditLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const logDate = new Date(log.timestamp)
      const start = startDate ? new Date(startDate) : null
      const end = endDate ? new Date(endDate) : null
      
      return (
        (!start || logDate >= start) &&
        (!end || logDate <= end) &&
        (activityTypeFilter === "all" || !activityTypeFilter || log.activityType === activityTypeFilter)
      )
    })
  }, [auditLogs, startDate, endDate, activityTypeFilter])

  return (
    // <Card
    //   className={`${!darkMode ? "bg-primary-gradient" : "dark:bg-gray-800"} shadow-lg hover:shadow-xl transition-shadow duration-300 sticky`}
    // >
    //   <CardHeader>
    //     <CardTitle className="text-2xl font-bold text-[#2d2d2d] dark:text-white">Audit Logs</CardTitle>
    //   </CardHeader>
    //   <CardContent>
    //     <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
    //       <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
    //         <Input
    //           type="date"
    //           value={startDate}
    //           onChange={(e) => setStartDate(e.target.value)}
    //           className="w-full md:w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
    //         />
    //         <span className="text-gray-500 dark:text-gray-400">to</span>
    //         <Input
    //           type="date"
    //           value={endDate}
    //           onChange={(e) => setEndDate(e.target.value)}
    //           className="w-full md:w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
    //         />
    //       </div>
    //       <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
    //         <SelectTrigger className="w-full md:w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
    //           <SelectValue placeholder="Filter by activity type" />
    //         </SelectTrigger>
    //         <SelectContent className="dark:bg-gray-800">
    //           <SelectItem value="all" className="dark:text-gray-100 dark:focus:bg-gray-700">All Activities</SelectItem>
    //           <SelectItem value="User Created" className="dark:text-gray-100 dark:focus:bg-gray-700">User Created</SelectItem>
    //           <SelectItem value="User Updated" className="dark:text-gray-100 dark:focus:bg-gray-700">User Updated</SelectItem>
    //           <SelectItem value="User Deleted" className="dark:text-gray-100 dark:focus:bg-gray-700">User Deleted</SelectItem>
    //           <SelectItem value="Role Created" className="dark:text-gray-100 dark:focus:bg-gray-700">Role Created</SelectItem>
    //           <SelectItem value="Role Updated" className="dark:text-gray-100 dark:focus:bg-gray-700">Role Updated</SelectItem>
    //           <SelectItem value="Role Deleted" className="dark:text-gray-100 dark:focus:bg-gray-700">Role Deleted</SelectItem>
    //           <SelectItem value="Permission Added" className="dark:text-gray-100 dark:focus:bg-gray-700">Permission Added</SelectItem>
    //           <SelectItem value="Permission Deleted" className="dark:text-gray-100 dark:focus:bg-gray-700">Permission Deleted</SelectItem>
    //         </SelectContent>
    //       </Select>
    //     </div>
    //     <div className="overflow-x-auto">
    //       <Table>
    //         <TableHeader>
    //           <TableRow className="bg-[#1abc9c] dark:bg-gray-700">
    //             <TableHead className="text-white font-bold">Timestamp</TableHead>
    //             <TableHead className="text-white font-bold">Activity Type</TableHead>
    //             <TableHead className="text-white font-bold">Description</TableHead>
    //             <TableHead className="text-white font-bold">Performed By</TableHead>
    //           </TableRow>
    //         </TableHeader>
    //         <TableBody >
    //           <AnimatePresence>
    //             {filteredAuditLogs.map((log) => (
    //               <motion.tr
    //                 key={log.id}
    //                 initial={{ opacity: 0, y: 20 }}
    //                 animate={{ opacity: 1, y: 0 }}
    //                 exit={{ opacity: 0, y: -20 }}
    //                 transition={{ duration: 0.3 }}
    //                 className="hover:bg-[#e2d7cc5f] dark:hover:bg-gray-700/50 transition-colors duration-150"
    //               >
    //                 <TableCell className="text-[#484949] dark:text-gray-300 whitespace-nowrap">
    //                   {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
    //                 </TableCell>
    //                 <TableCell className="font-medium text-[#2d2d2d] dark:text-white whitespace-nowrap">
    //                   <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getActivityTypeStyle(log.activityType)}`} >
    //                     {log.activityType}
    //                   </span>
    //                 </TableCell>
    //                 <TableCell className="text-[#484949] dark:text-gray-300">{log.description}</TableCell>
    //                 <TableCell className="text-[#484949] dark:text-gray-300">{log.performedBy}</TableCell>
    //               </motion.tr>
    //             ))}
    //           </AnimatePresence>
    //         </TableBody>
    //       </Table>
    //     </div>
    //   </CardContent>
    // </Card>
    <Card
  className={`${
    !darkMode ? "bg-primary-gradient" : "dark:bg-gray-800"
  } shadow-lg hover:shadow-xl transition-shadow duration-300`}
>
  <CardHeader>
    <CardTitle className="text-2xl font-bold text-[#2d2d2d] dark:text-white">
      Audit Logs
    </CardTitle>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0 md:space-x-4">
      <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full md:w-auto">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full md:w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
        <span className="text-gray-500 dark:text-gray-400">to</span>
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full md:w-40 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
        />
      </div>
      <Select value={activityTypeFilter} onValueChange={setActivityTypeFilter}>
        <SelectTrigger className="w-full md:w-[200px] dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100">
          <SelectValue placeholder="Filter by activity type" />
        </SelectTrigger>
        <SelectContent className="dark:bg-gray-800">
          <SelectItem
            value="all"
            className="dark:text-gray-100 dark:focus:bg-gray-700"
          >
            All Activities
          </SelectItem>
          <SelectItem
            value="User Created"
            className="dark:text-gray-100 dark:focus:bg-gray-700"
          >
            User Created
          </SelectItem>
          <SelectItem
            value="User Updated"
            className="dark:text-gray-100 dark:focus:bg-gray-700"
          >
            User Updated
          </SelectItem>
          <SelectItem
            value="User Deleted"
            className="dark:text-gray-100 dark:focus:bg-gray-700"
          >
            User Deleted
          </SelectItem>
          <SelectItem
            value="Role Created"
            className="dark:text-gray-100 dark:focus:bg-gray-700"
          >
            Role Created
          </SelectItem>
          <SelectItem
            value="Role Updated"
            className="dark:text-gray-100 dark:focus:bg-gray-700"
          >
            Role Updated
          </SelectItem>
          <SelectItem
            value="Role Deleted"
            className="dark:text-gray-100 dark:focus:bg-gray-700"
          >
            Role Deleted
          </SelectItem>
          <SelectItem
            value="Permission Added"
            className="dark:text-gray-100 dark:focus:bg-gray-700"
          >
            Permission Added
          </SelectItem>
          <SelectItem
            value="Permission Deleted"
            className="dark:text-gray-100 dark:focus:bg-gray-700"
          >
            Permission Deleted
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
    {/* Set a max height and enable scrolling for the table body */}
    <Table>
        <TableHeader>
          <TableRow className="bg-[#1abc9c] dark:bg-gray-700">
            <TableHead className="text-white font-bold">Timestamp</TableHead>
            <TableHead className="text-white font-bold">Activity Type</TableHead>
            <TableHead className="text-white font-bold">Description</TableHead>
            <TableHead className="text-white font-bold">Performed By</TableHead>
          </TableRow>
        </TableHeader>
    </Table>
    <div className="overflow-y-auto max-h-[400px]">
      <Table>
        <TableBody>
          <AnimatePresence>
            {filteredAuditLogs.map((log) => (
              <motion.tr
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="hover:bg-[#e2d7cc5f] dark:hover:bg-gray-700/50 transition-colors duration-150"
              >
                <TableCell className="text-[#484949] dark:text-gray-300 whitespace-nowrap">
                  {format(new Date(log.timestamp), "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
                <TableCell className="font-medium text-[#2d2d2d] dark:text-white whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${getActivityTypeStyle(
                      log.activityType
                    )}`}
                  >
                    {log.activityType}
                  </span>
                </TableCell>
                <TableCell className="text-[#484949] dark:text-gray-300">
                  {log.description}
                </TableCell>
                <TableCell className="text-[#484949] dark:text-gray-300">
                  {log.performedBy}
                </TableCell>
              </motion.tr>
            ))}
          </AnimatePresence>
        </TableBody>
      </Table>
    </div>
  </CardContent>
</Card>

  )
}

function getActivityTypeStyle(activityType: string) {
  switch (activityType) {
    case "User Created":
      return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 border border-green-500";
    case "User Updated":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 border border-yellow-500";
    case "User Deleted":
      return "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100 border border-red-500";
    case "Role Created":
      return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 border border-green-500";
    case "Role Updated":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-700 dark:text-yellow-100 border border-yellow-500";
    case "Role Deleted":
      return "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100 border border-red-500";
    case "Permission Added":
      return "bg-green-100 text-green-800 dark:bg-green-700 dark:text-green-100 border border-green-500";
    case "Permission Deleted":
      return "bg-red-100 text-red-800 dark:bg-red-700 dark:text-red-100 border border-red-500";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 border border-gray-500";
  }
}

