"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  Title,
  Text,
  Metric,
  AreaChart,
  BarChart,
  DonutChart,
  BadgeDelta,
  Flex,
  Grid,
  Button as TremorButton,
  TabGroup,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Callout,
} from "@tremor/react";
import { Button } from "@/components/ui/button";
import {
  Card as UICard,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import {
  Leaf,
  Users,
  UserPlus,
  Mail,
  Share2,
  MessageSquare,
  Settings,
  Crown,
  Shield,
  Eye,
  Edit,
  Trash2,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  UserCheck,
  UserX,
  Calendar,
  TrendingUp,
  BarChart3,
  Target,
  Download,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

// Mock data for team collaboration
const teamMembers = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah@company.com",
    role: "Sustainability Manager",
    status: "active",
    lastActive: "2 min ago",
    permissions: ["view", "edit", "share"],
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael@company.com",
    role: "Data Analyst",
    status: "active",
    lastActive: "15 min ago",
    permissions: ["view", "edit"],
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily@company.com",
    role: "Operations Director",
    status: "active",
    lastActive: "1 hour ago",
    permissions: ["view", "edit", "share", "admin"],
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 4,
    name: "David Kim",
    email: "david@company.com",
    role: "Environmental Engineer",
    status: "pending",
    lastActive: "3 days ago",
    permissions: ["view"],
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
  },
  {
    id: 5,
    name: "Lisa Wang",
    email: "lisa@company.com",
    role: "Compliance Officer",
    status: "inactive",
    lastActive: "1 week ago",
    permissions: ["view"],
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
  },
];

const sharedDashboards = [
  {
    id: 1,
    name: "Executive Summary",
    owner: "Emily Rodriguez",
    sharedWith: 4,
    lastModified: "2 hours ago",
    status: "active",
    views: 127,
    access: "view-edit",
  },
  {
    id: 2,
    name: "Monthly Reports",
    owner: "Sarah Johnson",
    sharedWith: 2,
    lastModified: "1 day ago",
    status: "active",
    views: 89,
    access: "view-only",
  },
  {
    id: 3,
    name: "Real-time Monitoring",
    owner: "Michael Chen",
    sharedWith: 3,
    lastModified: "3 days ago",
    status: "active",
    views: 156,
    access: "view-edit",
  },
  {
    id: 4,
    name: "Compliance Dashboard",
    owner: "Emily Rodriguez",
    sharedWith: 1,
    lastModified: "1 week ago",
    status: "archived",
    views: 34,
    access: "view-only",
  },
];

const collaborationActivity = [
  {
    id: 1,
    user: "Sarah Johnson",
    action: "shared dashboard",
    target: "Executive Summary",
    time: "2 hours ago",
    type: "share",
  },
  {
    id: 2,
    user: "Michael Chen",
    action: "updated data source",
    target: "Real-time Monitoring",
    time: "4 hours ago",
    type: "edit",
  },
  {
    id: 3,
    user: "Emily Rodriguez",
    action: "added comment",
    target: "Monthly Reports",
    time: "6 hours ago",
    type: "comment",
  },
  {
    id: 4,
    user: "David Kim",
    action: "joined team",
    target: "EcoMetrics Team",
    time: "1 day ago",
    type: "join",
  },
  {
    id: 5,
    user: "Lisa Wang",
    action: "exported report",
    target: "Compliance Dashboard",
    time: "2 days ago",
    type: "export",
  },
];

const teamMetrics = [
  {
    metric: "Active Users",
    value: 4,
    change: "+1 this week",
    trend: "up",
    icon: <Users className="h-5 w-5" />,
  },
  {
    metric: "Shared Dashboards",
    value: 12,
    change: "+3 this month",
    trend: "up",
    icon: <Share2 className="h-5 w-5" />,
  },
  {
    metric: "Team Activity",
    value: 87,
    change: "+12% this week",
    trend: "up",
    icon: <TrendingUp className="h-5 w-5" />,
  },
  {
    metric: "Avg Response Time",
    value: "2.3h",
    change: "-15% improvement",
    trend: "down",
    icon: <Clock className="h-5 w-5" />,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "text-green-600 bg-green-100";
    case "pending":
      return "text-yellow-600 bg-yellow-100";
    case "inactive":
      return "text-gray-600 bg-gray-100";
    case "archived":
      return "text-gray-600 bg-gray-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <Clock className="h-4 w-4" />;
    case "inactive":
      return <UserX className="h-4 w-4" />;
    case "archived":
      return <Trash2 className="h-4 w-4" />;
    default:
      return <Clock className="h-4 w-4" />;
  }
};

const getActionIcon = (type: string) => {
  switch (type) {
    case "share":
      return <Share2 className="h-4 w-4" />;
    case "edit":
      return <Edit className="h-4 w-4" />;
    case "comment":
      return <MessageSquare className="h-4 w-4" />;
    case "join":
      return <UserPlus className="h-4 w-4" />;
    case "export":
      return <Download className="h-4 w-4" />;
    default:
      return <Eye className="h-4 w-4" />;
  }
};

const getPermissionBadge = (permission: string) => {
  const badges = {
    view: { color: "bg-blue-100 text-blue-800", label: "View" },
    edit: { color: "bg-green-100 text-green-800", label: "Edit" },
    share: { color: "bg-purple-100 text-purple-800", label: "Share" },
    admin: { color: "bg-orange-100 text-orange-800", label: "Admin" },
  };

  const badge = badges[permission as keyof typeof badges] || badges.view;
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${badge.color}`}
    >
      {badge.label}
    </span>
  );
};

export default function TeamCollaborationPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isCalculateDropdownOpen, setIsCalculateDropdownOpen] = useState(false);
  const { user } = useAuth();

  const fadeIn = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
  };

  const staggerChildren = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const activeUsers = teamMembers.filter(
    (member) => member.status === "active"
  ).length;
  const totalUsers = teamMembers.length;
  const sharedCount = sharedDashboards.filter(
    (dashboard) => dashboard.status === "active"
  ).length;

  const calculateMenuItems = [
    {
      label: "Real-Time Carbon Tracking",
      href: "/real-time-carbon-tracking",
      description: "Live emissions monitoring",
    },
    {
      label: "Automated Reports",
      href: "/automated-reports",
      description: "Generate comprehensive reports",
    },
    {
      label: "Custom Dashboards",
      href: "/custom-dashboards",
      description: "Personalized dashboard views",
    },
    {
      label: "Emission Source Breakdown",
      href: "/emission-source-breakdown",
      description: "Detailed source analysis",
    },
    {
      label: "Cloud Integration",
      href: "/cloud-integration",
      description: "Connect with cloud providers",
    },
    {
      label: "Team Collaboration",
      href: "/team-collaboration",
      description: "Collaborate with your team",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50">
      {/* Dashboard Header */}
      <section className="py-8 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="mb-8"
          >
            <motion.div
              variants={fadeIn}
              className="flex flex-col lg:flex-row lg:items-center lg:justify-between"
            >
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Team Collaboration
                </h1>
                <p className="text-lg text-gray-600">
                  Collaborate with your team and share insights across
                  departments
                </p>
              </div>
              <div className="flex items-center space-x-4 mt-4 lg:mt-0">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-green-200 text-green-700 hover:bg-green-50"
                  onClick={() => setShowInviteModal(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Invite Member
                </Button>
                <Button
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Dashboard
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* Team Metrics */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerChildren}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {teamMetrics.map((metric, index) => (
              <motion.div key={index} variants={fadeIn}>
                <Card className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-0">
                  <Flex alignItems="start">
                    <div className="truncate">
                      <Text className="text-blue-100">{metric.metric}</Text>
                      <Metric className="text-white">{metric.value}</Metric>
                    </div>
                    <div className="text-blue-200">{metric.icon}</div>
                  </Flex>
                  <BadgeDelta
                    deltaType={
                      metric.trend === "up"
                        ? "moderateIncrease"
                        : "moderateDecrease"
                    }
                    className="mt-2 bg-white/20 text-white border-white/30"
                  >
                    {metric.change}
                  </BadgeDelta>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Quick Invite Modal */}
          <AnimatePresence>
            {showInviteModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={() => setShowInviteModal(false)}
              >
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.9, opacity: 0 }}
                  className="bg-white rounded-lg p-6 max-w-md w-full"
                  onClick={(e) => e.stopPropagation()}
                >
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Invite Team Member
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={inviteEmail}
                        onChange={(e) => setInviteEmail(e.target.value)}
                        placeholder="colleague@company.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role
                      </label>
                      <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent">
                        <option>Viewer</option>
                        <option>Editor</option>
                        <option>Admin</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 mt-6">
                    <Button
                      variant="outline"
                      onClick={() => setShowInviteModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={() => {
                        // Handle invite logic here
                        setShowInviteModal(false);
                        setInviteEmail("");
                      }}
                    >
                      Send Invite
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TabGroup index={selectedTab} onIndexChange={setSelectedTab}>
            <TabList className="mb-8">
              <Tab>Team Overview</Tab>
              <Tab>Shared Dashboards</Tab>
              <Tab>Activity Feed</Tab>
              <Tab>Permissions</Tab>
            </TabList>

            <TabPanels>
              {/* Team Overview Tab */}
              <TabPanel>
                <Grid numItems={1} numItemsLg={2} className="gap-6 mb-8">
                  {/* Team Members */}
                  <Card>
                    <div className="flex items-center justify-between mb-6">
                      <Title>Team Members</Title>
                      <Button
                        size="sm"
                        onClick={() => setShowInviteModal(true)}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Invite
                      </Button>
                    </div>
                    <div className="space-y-4">
                      {teamMembers.map((member, index) => (
                        <motion.div
                          key={member.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="relative">
                              <img
                                src={member.avatar}
                                alt={member.name}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                              <div
                                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                                  member.status === "active"
                                    ? "bg-green-500"
                                    : member.status === "pending"
                                      ? "bg-yellow-500"
                                      : "bg-gray-400"
                                }`}
                              ></div>
                            </div>
                            <div>
                              <h3 className="font-semibold text-gray-900">
                                {member.name}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {member.role}
                              </p>
                              <p className="text-xs text-gray-500">
                                Last active: {member.lastActive}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                member.status
                              )}`}
                            >
                              {getStatusIcon(member.status)}
                              <span className="ml-1 capitalize">
                                {member.status}
                              </span>
                            </div>
                            {member.permissions.includes("admin") && (
                              <Crown className="h-4 w-4 text-orange-500" />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <Title>Quick Actions</Title>
                    <Text>Common collaboration tasks</Text>
                    <div className="mt-6 space-y-4">
                      {[
                        {
                          action: "Share Dashboard",
                          description: "Share a dashboard with team members",
                          icon: <Share2 className="h-5 w-5" />,
                          color: "bg-blue-100 text-blue-600",
                        },
                        {
                          action: "Create Team Report",
                          description: "Generate a report for the entire team",
                          icon: <BarChart3 className="h-5 w-5" />,
                          color: "bg-green-100 text-green-600",
                        },
                        {
                          action: "Schedule Review",
                          description:
                            "Set up a team meeting to review metrics",
                          icon: <Calendar className="h-5 w-5" />,
                          color: "bg-purple-100 text-purple-600",
                        },
                        {
                          action: "Export Data",
                          description: "Export team data for external sharing",
                          icon: <Download className="h-5 w-5" />,
                          color: "bg-orange-100 text-orange-600",
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <div className={`p-2 rounded-lg ${item.color}`}>
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {item.action}
                            </h3>
                            <p className="text-sm text-gray-600">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Grid>
              </TabPanel>

              {/* Shared Dashboards Tab */}
              <TabPanel>
                <Card>
                  <div className="flex items-center justify-between mb-6">
                    <Title>Shared Dashboards</Title>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      New Dashboard
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {sharedDashboards.map((dashboard, index) => (
                      <motion.div
                        key={dashboard.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {dashboard.name}
                            </h3>
                            <p className="text-sm text-gray-600">
                              by {dashboard.owner}
                            </p>
                          </div>
                          <div
                            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              dashboard.status
                            )}`}
                          >
                            {getStatusIcon(dashboard.status)}
                            <span className="ml-1 capitalize">
                              {dashboard.status}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Shared with:</span>
                            <span className="font-medium">
                              {dashboard.sharedWith} members
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Views:</span>
                            <span className="font-medium">
                              {dashboard.views}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Access:</span>
                            <span className="font-medium">
                              {dashboard.access.replace("-", " ")}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              Last modified:
                            </span>
                            <span className="font-medium">
                              {dashboard.lastModified}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1"
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Edit
                          </Button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabPanel>

              {/* Activity Feed Tab */}
              <TabPanel>
                <Card>
                  <Title>Recent Activity</Title>
                  <Text>Latest team collaboration activities</Text>
                  <div className="mt-6 space-y-4">
                    {collaborationActivity.map((activity, index) => (
                      <motion.div
                        key={activity.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-shrink-0 p-2 bg-white rounded-full border">
                          {getActionIcon(activity.type)}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-gray-900">
                            <span className="font-semibold">
                              {activity.user}
                            </span>{" "}
                            {activity.action}
                            <span className="font-medium">
                              {" "}
                              {activity.target}
                            </span>
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {activity.time}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TabPanel>

              {/* Permissions Tab */}
              <TabPanel>
                <Grid numItems={1} numItemsLg={2} className="gap-6 mb-8">
                  {/* Permission Levels */}
                  <Card>
                    <Title>Permission Levels</Title>
                    <Text>Define access levels for team members</Text>
                    <div className="mt-6 space-y-6">
                      {[
                        {
                          role: "Admin",
                          description:
                            "Full access to all features and settings",
                          permissions: ["view", "edit", "share", "admin"],
                          color: "bg-red-100 text-red-800",
                        },
                        {
                          role: "Editor",
                          description: "Can edit and share dashboards",
                          permissions: ["view", "edit", "share"],
                          color: "bg-green-100 text-green-800",
                        },
                        {
                          role: "Viewer",
                          description: "Read-only access to dashboards",
                          permissions: ["view"],
                          color: "bg-blue-100 text-blue-800",
                        },
                      ].map((role, index) => (
                        <div key={index} className="p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900">
                              {role.role}
                            </h3>
                            <span
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${role.color}`}
                            >
                              {role.permissions.length} permissions
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {role.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {role.permissions.map((permission, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Team Member Permissions */}
                  <Card>
                    <Title>Member Permissions</Title>
                    <Text>Current permission assignments</Text>
                    <div className="mt-6 space-y-4">
                      {teamMembers.map((member, index) => (
                        <div
                          key={member.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium text-gray-900">
                                {member.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {member.role}
                              </p>
                            </div>
                          </div>
                          <div className="flex space-x-1">
                            {member.permissions.map((permission, idx) => (
                              <span
                                key={idx}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-200 text-gray-800"
                              >
                                {permission}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </Grid>
              </TabPanel>
            </TabPanels>
          </TabGroup>
        </div>
      </section>

      {/* Action Buttons */}
      <section className="py-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-4"
            >
              <Share2 className="h-5 w-5 mr-2" />
              Share Dashboard
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <Settings className="h-5 w-5 mr-2" />
              Team Settings
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-green-200 text-green-700 hover:bg-green-50 px-8 py-4"
            >
              <UserPlus className="h-5 w-5 mr-2" />
              Invite Members
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
