"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Calendar, User, BookOpen, Clock, CheckCircle, AlertCircle, Hourglass } from "lucide-react"

const assignments = [
  {
    id: 1,
    script: "Hamlet",
    scene: "Act III, Scene 1",
    student: "John Doe",
    deadline: "Mar 15, 2024",
    status: "completed",
  },
  {
    id: 2,
    script: "Romeo and Juliet",
    scene: "Act II, Scene 2",
    student: "Sarah Mitchell",
    deadline: "Mar 18, 2024",
    status: "in-progress",
  },
  {
    id: 3,
    script: "Macbeth",
    scene: "Act I, Scene 7",
    student: "Michael Chen",
    deadline: "Mar 20, 2024",
    status: "pending",
  },
  {
    id: 4,
    script: "A Streetcar Named Desire",
    scene: "Scene 4",
    student: "Emily Rodriguez",
    deadline: "Mar 22, 2024",
    status: "overdue",
  },
  {
    id: 5,
    script: "The Glass Menagerie",
    scene: "Scene 7",
    student: "James Lee",
    deadline: "Mar 25, 2024",
    status: "pending",
  },
]

const statusConfig = {
  completed: {
    label: "Completed",
    icon: CheckCircle,
    className: "bg-green-500/10 text-green-600 border-green-500/20",
  },
  "in-progress": {
    label: "In Progress",
    icon: Hourglass,
    className: "bg-primary/10 text-primary border-primary/20",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    className: "bg-muted text-muted-foreground border-border",
  },
  overdue: {
    label: "Overdue",
    icon: AlertCircle,
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
}

export default function AssignmentsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assignments</h1>
          <p className="text-muted-foreground">Manage and track your practice assignments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Assign Scene
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Assignment</DialogTitle>
              <DialogDescription>
                Assign a scene to a student for practice
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="script">Script</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a script" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hamlet">Hamlet</SelectItem>
                    <SelectItem value="romeo">Romeo and Juliet</SelectItem>
                    <SelectItem value="macbeth">Macbeth</SelectItem>
                    <SelectItem value="streetcar">A Streetcar Named Desire</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="scene">Scene</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a scene" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scene1">Act I, Scene 1</SelectItem>
                    <SelectItem value="scene2">Act I, Scene 2</SelectItem>
                    <SelectItem value="scene3">Act II, Scene 1</SelectItem>
                    <SelectItem value="scene4">Act II, Scene 2</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="student">Student</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a student" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="john">John Doe</SelectItem>
                    <SelectItem value="sarah">Sarah Mitchell</SelectItem>
                    <SelectItem value="michael">Michael Chen</SelectItem>
                    <SelectItem value="emily">Emily Rodriguez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input type="date" id="deadline" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>
                Create Assignment
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary/10">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Assignments</p>
                <p className="text-2xl font-bold text-foreground">{assignments.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold text-foreground">
                  {assignments.filter((a) => a.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-accent/10">
                <Hourglass className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-foreground">
                  {assignments.filter((a) => a.status === "in-progress").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertCircle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overdue</p>
                <p className="text-2xl font-bold text-foreground">
                  {assignments.filter((a) => a.status === "overdue").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Assignments Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Assignments</CardTitle>
          <CardDescription>View and manage all practice assignments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4" />
                      Script
                    </div>
                  </TableHead>
                  <TableHead>Scene</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Student
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Deadline
                    </div>
                  </TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {assignments.map((assignment) => {
                  const status = statusConfig[assignment.status as keyof typeof statusConfig]
                  const StatusIcon = status.icon
                  return (
                    <TableRow key={assignment.id}>
                      <TableCell className="font-medium">{assignment.script}</TableCell>
                      <TableCell>{assignment.scene}</TableCell>
                      <TableCell>{assignment.student}</TableCell>
                      <TableCell>{assignment.deadline}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={status.className}>
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
