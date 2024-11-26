import React from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from 'lucide-react'

interface ConfirmationDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  title: string
  description: string
  actionType: 'create' | 'update' | 'delete'
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  actionType
}: ConfirmationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-gray-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl font-semibold text-gray-900 dark:text-white">
            <AlertTriangle className={`h-6 w-6 ${actionType === 'delete' ? 'text-red-500' : 'text-yellow-500'}`} />
            {title}
          </DialogTitle>
          <DialogDescription className="text-gray-500 dark:text-gray-400">
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <div className="flex w-full justify-end space-x-2">
            <Button variant="outline" onClick={onClose} className="px-4 py-2 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600">
              No
            </Button>
            <Button 
              onClick={() => {
                onConfirm()
                onClose()
              }} 
              className={`px-4 py-2 text-white ${
                actionType === 'delete' 
                  ? 'bg-red-500 hover:bg-red-600 dark:bg-red-700 dark:hover:bg-red-600' 
                  : actionType === 'create'
                  ? 'bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600'
                  : 'bg-blue-500 hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600'
              }`}
            >
              Yes
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

