"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Mail,
  UserPlus,
  Save,
  Trash2,
  Edit,
  CheckCircle,
  X,
  User,
  Building2,
  Shield,
} from "lucide-react";

// Mock data for recipients
const initialRecipients = [
  {
    id: 1,
    name: "Sarah Johnson",
    email: "sarah.johnson@company.com",
    role: "Sustainability Manager",
    department: "Environmental",
    reports: ["Monthly ESG", "Quarterly Sustainability"],
    frequency: "monthly",
    active: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    email: "michael.chen@company.com",
    role: "Operations Director",
    department: "Operations",
    reports: ["Daily Carbon", "Weekly Performance"],
    frequency: "weekly",
    active: true,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    email: "emily.rodriguez@company.com",
    role: "Compliance Officer",
    department: "Legal",
    reports: ["Monthly ESG", "Quarterly Sustainability", "Annual ESG"],
    frequency: "monthly",
    active: true,
  },
  {
    id: 4,
    name: "David Kim",
    email: "david.kim@company.com",
    role: "Finance Director",
    department: "Finance",
    reports: ["Monthly Carbon"],
    frequency: "monthly",
    active: false,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    email: "lisa.thompson@company.com",
    role: "CEO",
    department: "Executive",
    reports: ["Monthly ESG", "Quarterly Sustainability"],
    frequency: "quarterly",
    active: true,
  },
];

const departments = [
  "Environmental",
  "Operations",
  "Legal",
  "Finance",
  "Executive",
  "HR",
  "Marketing",
  "R&D",
];

const reportTypes = [
  "Daily Carbon Report",
  "Weekly Performance Summary",
  "Monthly ESG Report",
  "Quarterly Sustainability Report",
  "Annual ESG Report",
];

const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "yearly", label: "Yearly" },
];

interface RecipientsManagementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function RecipientsManagementDialog({
  open,
  onOpenChange,
}: RecipientsManagementDialogProps) {
  const [recipients, setRecipients] = useState(initialRecipients);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newRecipient, setNewRecipient] = useState({
    name: "",
    email: "",
    role: "",
    department: "Environmental",
    reports: [] as string[],
    frequency: "monthly",
    active: true,
  });

  const handleSaveRecipient = () => {
    const id = Math.max(...recipients.map((r) => r.id)) + 1;
    setRecipients([...recipients, { ...newRecipient, id }]);
    setIsCreating(false);
    setNewRecipient({
      name: "",
      email: "",
      role: "",
      department: "Environmental",
      reports: [],
      frequency: "monthly",
      active: true,
    });
  };

  const handleUpdateRecipient = (id: number, updatedData: any) => {
    setRecipients(
      recipients.map((recipient) =>
        recipient.id === id ? { ...recipient, ...updatedData } : recipient
      )
    );
    setEditingId(null);
  };

  const handleDeleteRecipient = (id: number) => {
    setRecipients(recipients.filter((recipient) => recipient.id !== id));
  };

  const handleToggleActive = (id: number) => {
    setRecipients(
      recipients.map((recipient) =>
        recipient.id === id
          ? { ...recipient, active: !recipient.active }
          : recipient
      )
    );
  };

  const handleReportToggle = (recipientId: string, report: string) => {
    setRecipients(
      recipients.map((recipient) => {
        if (recipient.id.toString() === recipientId) {
          const reports = recipient.reports.includes(report)
            ? recipient.reports.filter((r) => r !== report)
            : [...recipient.reports, report];
          return { ...recipient, reports };
        }
        return recipient;
      })
    );
  };

  const getRoleIcon = (role: string) => {
    if (
      role.toLowerCase().includes("ceo") ||
      role.toLowerCase().includes("director")
    ) {
      return <Shield className="h-4 w-4 text-purple-600" />;
    }
    if (
      role.toLowerCase().includes("manager") ||
      role.toLowerCase().includes("officer")
    ) {
      return <User className="h-4 w-4 text-blue-600" />;
    }
    return <Building2 className="h-4 w-4 text-gray-600" />;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-green-600" />
            <span>Manage Report Recipients</span>
          </DialogTitle>
          <DialogDescription>
            Add, edit, and manage recipients for automated sustainability
            reports.
          </DialogDescription>
        </DialogHeader>

        <div className="overflow-y-auto max-h-[70vh] space-y-4">
          {/* Recipients List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Current Recipients</h3>
              <Button
                onClick={() => setIsCreating(true)}
                size="sm"
                className="bg-green-600 hover:bg-green-700"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                Add Recipient
              </Button>
            </div>

            <div className="space-y-3">
              {recipients.map((recipient) => (
                <Card
                  key={recipient.id}
                  className={`border-l-4 ${
                    recipient.active
                      ? "border-l-green-500"
                      : "border-l-gray-300"
                  }`}
                >
                  <CardContent className="p-4">
                    {editingId === recipient.id ? (
                      // Edit Mode
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Name
                            </label>
                            <Input
                              defaultValue={recipient.name}
                              onChange={(e) => {
                                const updated = {
                                  ...recipient,
                                  name: e.target.value,
                                };
                                handleUpdateRecipient(recipient.id, updated);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <Input
                              defaultValue={recipient.email}
                              onChange={(e) => {
                                const updated = {
                                  ...recipient,
                                  email: e.target.value,
                                };
                                handleUpdateRecipient(recipient.id, updated);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Role
                            </label>
                            <Input
                              defaultValue={recipient.role}
                              onChange={(e) => {
                                const updated = {
                                  ...recipient,
                                  role: e.target.value,
                                };
                                handleUpdateRecipient(recipient.id, updated);
                              }}
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Department
                            </label>
                            <select
                              defaultValue={recipient.department}
                              onChange={(e) => {
                                const updated = {
                                  ...recipient,
                                  department: e.target.value,
                                };
                                handleUpdateRecipient(recipient.id, updated);
                              }}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            >
                              {departments.map((dept) => (
                                <option key={dept} value={dept}>
                                  {dept}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div className="flex items-center justify-end space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingId(null)}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      // View Mode
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            {getRoleIcon(recipient.role)}
                            <h4 className="font-medium text-gray-900">
                              {recipient.name}
                            </h4>
                            <div
                              className={`w-2 h-2 rounded-full ${
                                recipient.active
                                  ? "bg-green-500"
                                  : "bg-gray-300"
                              }`}
                            />
                          </div>
                          <p className="text-sm text-gray-600 mb-1">
                            {recipient.role} • {recipient.department}
                          </p>
                          <p className="text-xs text-gray-500 mb-2 flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {recipient.email}
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {recipient.reports.slice(0, 3).map((report) => (
                              <span
                                key={report}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                              >
                                {report}
                              </span>
                            ))}
                            {recipient.reports.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{recipient.reports.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingId(recipient.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleToggleActive(recipient.id)}
                            className={
                              recipient.active
                                ? "text-green-600"
                                : "text-gray-500"
                            }
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteRecipient(recipient.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Create New Recipient */}
          <AnimatePresence>
            {isCreating && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border border-green-200 bg-green-50">
                  <CardHeader>
                    <CardTitle className="text-lg">Add New Recipient</CardTitle>
                    <CardDescription>
                      Add a new recipient for automated sustainability reports.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <Input
                          value={newRecipient.name}
                          onChange={(e) =>
                            setNewRecipient({
                              ...newRecipient,
                              name: e.target.value,
                            })
                          }
                          placeholder="Full name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <Input
                          type="email"
                          value={newRecipient.email}
                          onChange={(e) =>
                            setNewRecipient({
                              ...newRecipient,
                              email: e.target.value,
                            })
                          }
                          placeholder="email@company.com"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Role
                        </label>
                        <Input
                          value={newRecipient.role}
                          onChange={(e) =>
                            setNewRecipient({
                              ...newRecipient,
                              role: e.target.value,
                            })
                          }
                          placeholder="e.g., Sustainability Manager"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Department
                        </label>
                        <select
                          value={newRecipient.department}
                          onChange={(e) =>
                            setNewRecipient({
                              ...newRecipient,
                              department: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          {departments.map((dept) => (
                            <option key={dept} value={dept}>
                              {dept}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Types
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {reportTypes.map((report) => (
                          <label
                            key={report}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={newRecipient.reports.includes(report)}
                              onChange={() => {
                                const reports = newRecipient.reports.includes(
                                  report
                                )
                                  ? newRecipient.reports.filter(
                                      (r) => r !== report
                                    )
                                  : [...newRecipient.reports, report];
                                setNewRecipient({ ...newRecipient, reports });
                              }}
                              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                            />
                            <span className="text-sm text-gray-700">
                              {report}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="active"
                        checked={newRecipient.active}
                        onChange={(e) =>
                          setNewRecipient({
                            ...newRecipient,
                            active: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                      />
                      <label htmlFor="active" className="text-sm text-gray-700">
                        Active recipient
                      </label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Button
                        onClick={handleSaveRecipient}
                        className="bg-green-600 hover:bg-green-700"
                        disabled={!newRecipient.name || !newRecipient.email}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        Add Recipient
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => setIsCreating(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
