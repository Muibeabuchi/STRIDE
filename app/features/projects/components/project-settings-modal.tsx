import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Settings,
  Upload,
  Trash2,
  Plus,
  GripVertical,
  MoreHorizontal,
  UserPlus,
  Search,
} from "lucide-react";

interface ProjectSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProjectSettingsModal({
  open,
  onOpenChange,
}: ProjectSettingsModalProps) {
  const [activeTab, setActiveTab] = useState("general");
  const [projectName, setProjectName] = useState("mvp-1");
  const [projectDescription, setProjectDescription] = useState("");
  const [isPublic, setIsPublic] = useState(false);

  // Status management state
  const [statuses, setStatuses] = useState([
    { id: "1", name: "Backlog", color: "#6b7280" },
    { id: "2", name: "Todo", color: "#8b5cf6" },
    { id: "3", name: "In Progress", color: "#f59e0b" },
    { id: "4", name: "In Review", color: "#3b82f6" },
    { id: "5", name: "Done", color: "#10b981" },
  ]);
  const [newStatusName, setNewStatusName] = useState("");
  const [newStatusColor, setNewStatusColor] = useState("#6b7280");

  // Members management state
  const [members, setMembers] = useState([
    {
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      role: "owner",
      initials: "JD",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane.smith@example.com",
      role: "admin",
      initials: "JS",
    },
    {
      id: "3",
      name: "Robert Johnson",
      email: "robert.johnson@example.com",
      role: "member",
      initials: "RJ",
    },
    {
      id: "4",
      name: "Emily Davis",
      email: "emily.davis@example.com",
      role: "viewer",
      initials: "ED",
    },
  ]);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("member");

  const predefinedColors = [
    "#6b7280",
    "#8b5cf6",
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#06b6d4",
    "#ec4899",
    "#84cc16",
    "#f97316",
  ];

  const handleAddStatus = () => {
    if (newStatusName.trim()) {
      setStatuses([
        ...statuses,
        {
          id: Date.now().toString(),
          name: newStatusName.trim(),
          color: newStatusColor,
        },
      ]);
      setNewStatusName("");
      setNewStatusColor("#6b7280");
    }
  };

  const handleDeleteStatus = (id: string) => {
    setStatuses(statuses.filter((status) => status.id !== id));
  };

  const handleInviteMember = () => {
    if (newMemberEmail.trim()) {
      const name = newMemberEmail.split("@")[0].replace(".", " ");
      const initials = name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);

      setMembers([
        ...members,
        {
          id: Date.now().toString(),
          name,
          email: newMemberEmail.trim(),
          role: newMemberRole as any,
          initials,
        },
      ]);
      setNewMemberEmail("");
      setNewMemberRole("member");
    }
  };

  const filteredMembers = members.filter(
    (member) =>
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "owner":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "admin":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "member":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "viewer":
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.2,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
    exit: {
      opacity: 0,
      scale: 0.95,
      transition: { duration: 0.15 },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.1,
        duration: 0.3,
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent
            className="max-w-4xl w-[95vw] max-h-[90vh] p-0 bg-[#0d1117] border-[#21262d] text-white overflow-hidden"
            onInteractOutside={(e) => e.preventDefault()}
          >
            <motion.div
              className="flex flex-col max-h-[90vh]"
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {/* Header */}
              <DialogHeader className="flex flex-row items-center justify-between p-4 border-b border-[#21262d] bg-[#161b22] flex-shrink-0"></DialogHeader>

              {/* Content */}
              <div className="flex-1 overflow-hidden min-h-0">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="h-full flex flex-col"
                >
                  {/* Tab Navigation */}
                  <div className="border-b border-[#21262d] bg-[#0d1117] flex-shrink-0">
                    <TabsList className="h-12 w-full justify-start bg-transparent p-0 rounded-none">
                      <TabsTrigger
                        value="general"
                        className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#238636] data-[state=active]:bg-transparent data-[state=active]:text-white bg-transparent text-gray-400"
                      >
                        General
                      </TabsTrigger>
                      <TabsTrigger
                        value="status"
                        className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#238636] data-[state=active]:bg-transparent data-[state=active]:text-white bg-transparent text-gray-400"
                      >
                        Status
                      </TabsTrigger>
                      <TabsTrigger
                        value="members"
                        className="h-12 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-[#238636] data-[state=active]:bg-transparent data-[state=active]:text-white bg-transparent text-gray-400"
                      >
                        Members
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  {/* Tab Content - Scrollable */}
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <motion.div
                      variants={contentVariants}
                      initial="hidden"
                      animate="visible"
                      className="p-6"
                    >
                      <TabsContent value="general" className="mt-0 space-y-6">
                        {/* Project Details */}
                        <motion.div
                          variants={itemVariants}
                          className="space-y-4"
                        >
                          <h3 className="text-sm font-medium text-white">
                            Project Details
                          </h3>
                          <div className="space-y-4 p-4 bg-[#161b22] rounded-lg border border-[#21262d]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label
                                  htmlFor="project-name"
                                  className="text-sm text-gray-300"
                                >
                                  Project Name
                                </Label>
                                <Input
                                  id="project-name"
                                  value={projectName}
                                  onChange={(e) =>
                                    setProjectName(e.target.value)
                                  }
                                  className="bg-[#0d1117] border-[#21262d] text-white focus:border-[#238636]"
                                />
                              </div>
                              <div className="space-y-2">
                                <Label className="text-sm text-gray-300">
                                  Project Icon
                                </Label>
                                <div className="flex items-center space-x-3">
                                  <Avatar className="h-10 w-10 bg-gradient-to-br from-[#238636] to-[#2ea043] rounded-lg">
                                    <span className="text-sm font-medium text-white">
                                      MP
                                    </span>
                                  </Avatar>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 bg-[#21262d] border-[#30363d] text-gray-300 hover:bg-[#30363d] hover:text-white"
                                  >
                                    <Upload className="w-3 h-3 mr-1" />
                                    Change
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label
                                htmlFor="project-description"
                                className="text-sm text-gray-300"
                              >
                                Description
                              </Label>
                              <textarea
                                id="project-description"
                                value={projectDescription}
                                onChange={(e) =>
                                  setProjectDescription(e.target.value)
                                }
                                placeholder="Describe your project..."
                                className="w-full h-20 px-3 py-2 bg-[#0d1117] border border-[#21262d] rounded-md text-white placeholder:text-gray-500 focus:outline-none focus:border-[#238636] resize-none text-sm"
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <Label className="text-sm text-gray-300">
                                  Public Project
                                </Label>
                                <p className="text-xs text-gray-500">
                                  Make this project visible to all team members
                                </p>
                              </div>
                              <Switch
                                checked={isPublic}
                                onCheckedChange={setIsPublic}
                              />
                            </div>
                          </div>
                        </motion.div>

                        {/* Danger Zone */}
                        <motion.div
                          variants={itemVariants}
                          className="space-y-4"
                        >
                          <h3 className="text-sm font-medium text-white">
                            Danger Zone
                          </h3>
                          <div className="p-4 bg-[#161b22] rounded-lg border border-[#f85149]/20">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="text-sm font-medium text-white">
                                  Delete Project
                                </h4>
                                <p className="text-xs text-gray-400 mt-1">
                                  Permanently delete this project and all data
                                </p>
                              </div>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    className="bg-[#f85149] hover:bg-[#da3633] text-white"
                                  >
                                    Delete
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-[#161b22] border-[#21262d]">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-white">
                                      Delete Project
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-400">
                                      This action cannot be undone. This will
                                      permanently delete the project and all
                                      associated data.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel className="bg-[#21262d] border-[#30363d] text-gray-300 hover:bg-[#30363d]">
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction className="bg-[#f85149] hover:bg-[#da3633] text-white">
                                      Delete Project
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="status" className="mt-0 space-y-6">
                        {/* Add New Status */}
                        <motion.div
                          variants={itemVariants}
                          className="space-y-4"
                        >
                          <h3 className="text-sm font-medium text-white">
                            Project Statuses
                          </h3>
                          <div className="p-4 bg-[#161b22] rounded-lg border border-[#21262d]">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Input
                                placeholder="Status name"
                                value={newStatusName}
                                onChange={(e) =>
                                  setNewStatusName(e.target.value)
                                }
                                className="bg-[#0d1117] border-[#21262d] text-white focus:border-[#238636] flex-1"
                              />
                              <div className="flex gap-2">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="bg-[#21262d] border-[#30363d] text-gray-300 hover:bg-[#30363d]"
                                    >
                                      <div
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{
                                          backgroundColor: newStatusColor,
                                        }}
                                      />
                                      Color
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="bg-[#161b22] border-[#21262d]">
                                    <div className="grid grid-cols-5 gap-2 p-2">
                                      {predefinedColors.map((color) => (
                                        <button
                                          key={color}
                                          className="w-6 h-6 rounded-full hover:scale-110 transition-transform"
                                          style={{ backgroundColor: color }}
                                          onClick={() =>
                                            setNewStatusColor(color)
                                          }
                                        />
                                      ))}
                                    </div>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                                <Button
                                  onClick={handleAddStatus}
                                  size="sm"
                                  className="bg-[#238636] hover:bg-[#2ea043] text-white"
                                >
                                  <Plus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Status List */}
                        <motion.div
                          variants={itemVariants}
                          className="space-y-3"
                        >
                          {statuses.map((status, index) => (
                            <motion.div
                              key={status.id}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center justify-between p-3 bg-[#161b22] rounded-lg border border-[#21262d] hover:border-[#30363d] transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <GripVertical className="w-4 h-4 text-gray-500 cursor-move" />
                                <div
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: status.color }}
                                />
                                <span className="text-sm text-white">
                                  {status.name}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteStatus(status.id)}
                                className="h-8 w-8 text-gray-400 hover:text-[#f85149] hover:bg-[#f85149]/10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </motion.div>
                      </TabsContent>

                      <TabsContent value="members" className="mt-0 space-y-6">
                        {/* Add Member */}
                        <motion.div
                          variants={itemVariants}
                          className="space-y-4"
                        >
                          <h3 className="text-sm font-medium text-white">
                            Team Members
                          </h3>
                          <div className="p-4 bg-[#161b22] rounded-lg border border-[#21262d]">
                            <div className="flex flex-col sm:flex-row gap-3">
                              <Input
                                placeholder="Email address"
                                type="email"
                                value={newMemberEmail}
                                onChange={(e) =>
                                  setNewMemberEmail(e.target.value)
                                }
                                className="bg-[#0d1117] border-[#21262d] text-white focus:border-[#238636] flex-1"
                              />
                              <div className="flex gap-2">
                                <Select
                                  value={newMemberRole}
                                  onValueChange={setNewMemberRole}
                                >
                                  <SelectTrigger className="w-32 bg-[#21262d] border-[#30363d] text-gray-300">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-[#161b22] border-[#21262d]">
                                    <SelectItem
                                      value="admin"
                                      className="text-gray-300"
                                    >
                                      Admin
                                    </SelectItem>
                                    <SelectItem
                                      value="member"
                                      className="text-gray-300"
                                    >
                                      Member
                                    </SelectItem>
                                    <SelectItem
                                      value="viewer"
                                      className="text-gray-300"
                                    >
                                      Viewer
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Button
                                  onClick={handleInviteMember}
                                  size="sm"
                                  className="bg-[#238636] hover:bg-[#2ea043] text-white"
                                >
                                  <UserPlus className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>

                        {/* Search */}
                        <motion.div
                          variants={itemVariants}
                          className="relative"
                        >
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <Input
                            placeholder="Search members..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10 bg-[#0d1117] border-[#21262d] text-white focus:border-[#238636]"
                          />
                        </motion.div>

                        {/* Members List */}
                        <motion.div
                          variants={itemVariants}
                          className="space-y-2"
                        >
                          {filteredMembers.map((member, index) => (
                            <motion.div
                              key={member.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="flex items-center justify-between p-3 bg-[#161b22] rounded-lg border border-[#21262d] hover:border-[#30363d] transition-colors"
                            >
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-8 w-8">
                                  <AvatarFallback className="bg-gradient-to-br from-[#238636] to-[#2ea043] text-white text-xs">
                                    {member.initials}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-medium text-white">
                                    {member.name}
                                  </p>
                                  <p className="text-xs text-gray-400">
                                    {member.email}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className={getRoleBadgeColor(member.role)}
                                >
                                  {member.role.charAt(0).toUpperCase() +
                                    member.role.slice(1)}
                                </Badge>
                                {member.role !== "owner" && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-white hover:bg-[#21262d]"
                                      >
                                        <MoreHorizontal className="w-4 h-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-[#161b22] border-[#21262d]">
                                      <DropdownMenuItem className="text-gray-300 hover:bg-[#21262d]">
                                        Change Role
                                      </DropdownMenuItem>
                                      <DropdownMenuItem className="text-[#f85149] hover:bg-[#f85149]/10">
                                        Remove
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                              </div>
                            </motion.div>
                          ))}
                        </motion.div>
                      </TabsContent>
                    </motion.div>
                  </div>
                </Tabs>
              </div>

              {/* Footer */}
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
