"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { crudService } from "@/lib/crudService";
import { useAuth } from "@/lib/auth-context";
import { useEntityRelationship } from "@/lib/entityRelationshipContext";
import {
  AddCircle,
  Edit,
  Delete,
  Visibility,
  ArrowBack,
} from "@mui/icons-material";
import { Snackbar, Alert, CircularProgress } from "@mui/material";

const ThreeBackground = dynamic(() => import("@/components/three-bg"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10">
      <div className="w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50" />
    </div>
  ),
});

interface ActivityGroup {
  id: number;
  name: string;
  entityId?: number;
  entityName?: string;
  description?: string;
  activities?: Activity[];
}

interface Activity {
  id: number;
  name: string;
  activityGroupId?: number;
  activityGroupName?: string;
  tableid?: string;
  relationshipId?: number;
}

export default function ManageFactorsPage() {
  const { session } = useAuth();
  const { selectedEntityId } = useEntityRelationship();

  // State for activity groups
  const [activityGroups, setActivityGroups] = useState<ActivityGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<ActivityGroup | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Dialog states
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewActivitiesDialogOpen, setViewActivitiesDialogOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState<ActivityGroup | null>(null);
  const [addActivityDialogOpen, setAddActivityDialogOpen] = useState(false);
  const [editActivityDialogOpen, setEditActivityDialogOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [activityFormData, setActivityFormData] = useState({ name: "" });
  const [viewFactorsDialogOpen, setViewFactorsDialogOpen] = useState(false);
  const [factors, setFactors] = useState<any[]>([]);
  const [loadingFactors, setLoadingFactors] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Fetch activity groups on mount
  useEffect(() => {
    if (session?.access_token) {
      fetchActivityGroups();
    }
  }, [session?.access_token]);

  // Fetch activity groups from CRUD API
  const fetchActivityGroups = async () => {
    setLoading(true);
    try {
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "ActvityGroups",
            TableName: "get_entitytypes",
            Action: "procedure",
            Fields: {
              Type: "ActvityGroup",
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      });

      if (response?.Data && response.Data[0]?.JsonData) {
        const jsonData = JSON.parse(response.Data[0].JsonData);
        const tableData = jsonData.ActvityGroups?.TableData || [];

        // Map activity groups from entity data
        const groups: ActivityGroup[] = tableData
          .filter((item: any) => item.entityName && item.entityName !== "NULL")
          .map((item: any) => ({
            id: item.entityId,
            name: item.entityName,
            entityId: item.entityId,
            entityName: item.entityName,
            description: item.entitySurname?.trim() || "",
            activities: [],
          }));

        setActivityGroups(groups);
      }
    } catch (error) {
      console.error("Error fetching activity groups:", error);
      setSnackbar({
        open: true,
        message: "Failed to load activity groups",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch activities for a specific group using entityrelationship
  const fetchActivitiesForGroup = async (groupId: number) => {
    setLoadingActivities(true);
    try {
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "Activities",
            TableName: "entityrelationship",
            Action: "readExact",
            Fields: {
              EntityB: groupId.toString(),
              Relationship: "127",
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      });

      if (response?.Data && response.Data[0]?.JsonData) {
        const jsonData = JSON.parse(response.Data[0].JsonData);
        const tableData = jsonData.Activities?.TableData || [];

        setActivities(
          tableData.map((item: any) => ({
            id: item.entityrelationshipEntity,
            name: item.entityrelationshipEntityName,
            activityGroupId: groupId,
            relationshipId: item.entityrelationshipId,
          }))
        );
      } else {
        setActivities([]);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  };

  // Handle add activity group
  const handleAddGroup = async () => {
    if (!formData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a group name",
        severity: "error",
      });
      return;
    }

    setFormLoading(true);
    try {
      // Create entity of type "Activity Group"
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "ActivityGroup",
            TableName: "entity",
            Action: "create",
            Fields: {
              entityname: formData.name,
              entitydescription: formData.description || "",
              entitytype: "Activity Group",
              entityEntity: selectedEntityId,
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      });

      if (response?.Data) {
        setSnackbar({
          open: true,
          message: "Activity group created successfully",
          severity: "success",
        });
        setAddDialogOpen(false);
        setFormData({ name: "", description: "" });
        fetchActivityGroups();
      }
    } catch (error) {
      console.error("Error creating activity group:", error);
      setSnackbar({
        open: true,
        message: "Failed to create activity group",
        severity: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle edit activity group
  const handleEditGroup = async () => {
    if (!selectedGroup || !formData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a group name",
        severity: "error",
      });
      return;
    }

    setFormLoading(true);
    try {
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "ActivityGroup",
            TableName: "entity",
            Action: "update",
            Fields: {
              entityid: selectedGroup.id,
              entityname: formData.name,
              entitydescription: formData.description || "",
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      });

      if (response?.Data) {
        setSnackbar({
          open: true,
          message: "Activity group updated successfully",
          severity: "success",
        });
        setEditDialogOpen(false);
        setSelectedGroup(null);
        setFormData({ name: "", description: "" });
        fetchActivityGroups();
      }
    } catch (error) {
      console.error("Error updating activity group:", error);
      setSnackbar({
        open: true,
        message: "Failed to update activity group",
        severity: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle delete activity group
  const handleDeleteGroup = async () => {
    if (!groupToDelete) return;

    setFormLoading(true);
    try {
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "ActivityGroup",
            TableName: "entity",
            Action: "delete",
            Fields: {
              entityid: groupToDelete.id,
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      });

      if (response?.Data) {
        setSnackbar({
          open: true,
          message: "Activity group deleted successfully",
          severity: "success",
        });
        setDeleteConfirmOpen(false);
        setGroupToDelete(null);
        fetchActivityGroups();
      }
    } catch (error) {
      console.error("Error deleting activity group:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete activity group",
        severity: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Open edit dialog with group data
  const openEditDialog = (group: ActivityGroup) => {
    setSelectedGroup(group);
    setFormData({
      name: group.name,
      description: group.description || "",
    });
    setEditDialogOpen(true);
  };

  // Open view activities dialog
  const openViewActivitiesDialog = (group: ActivityGroup) => {
    setSelectedGroup(group);
    setActivities([]);
    setViewActivitiesDialogOpen(true);
    fetchActivitiesForGroup(group.entityId || group.id);
  };

  // Handle add activity to group
  const handleAddActivity = async () => {
    if (!activityFormData.name.trim() || !selectedGroup) {
      setSnackbar({
        open: true,
        message: "Please enter an activity name",
        severity: "error",
      });
      return;
    }

    setFormLoading(true);
    try {
      // First create the entity of type "Activity"
      const createResponse = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "Activity",
            TableName: "entity",
            Action: "create",
            Fields: {
              entityname: activityFormData.name,
              entitytype: "Activity",
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      });

      if (createResponse?.Data && createResponse.Data[0]?.JsonData) {
        const jsonData = JSON.parse(createResponse.Data[0].JsonData);
        const newActivityId = jsonData.Activity?.TableData?.[0]?.entityId;

        if (newActivityId) {
          // Create the relationship with the activity group
          await crudService.callCrud({
            data: JSON.stringify([
              {
                RecordSet: "ActivityRelationship",
                TableName: "entityrelationship",
                Action: "create",
                Fields: {
                  entityrelationshipEntity: newActivityId,
                  entityrelationshipEntityB: selectedGroup.entityId || selectedGroup.id,
                  entityrelationshipRelationship: 127,
                },
              },
            ]),
            PageNo: "1",
            NoOfLines: "300",
            CrudMessage: "@CrudMessage",
          });
        }

        setSnackbar({
          open: true,
          message: "Activity added successfully",
          severity: "success",
        });
        setAddActivityDialogOpen(false);
        setActivityFormData({ name: "" });
        fetchActivitiesForGroup(selectedGroup.entityId || selectedGroup.id);
      }
    } catch (error) {
      console.error("Error adding activity:", error);
      setSnackbar({
        open: true,
        message: "Failed to add activity",
        severity: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Handle edit activity
  const handleEditActivity = async () => {
    if (!selectedActivity || !activityFormData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter an activity name",
        severity: "error",
      });
      return;
    }

    setFormLoading(true);
    try {
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "Activity",
            TableName: "entity",
            Action: "update",
            Fields: {
              entityid: selectedActivity.id,
              entityname: activityFormData.name,
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      });

      if (response?.Data) {
        setSnackbar({
          open: true,
          message: "Activity updated successfully",
          severity: "success",
        });
        setEditActivityDialogOpen(false);
        setSelectedActivity(null);
        setActivityFormData({ name: "" });
        if (selectedGroup) {
          fetchActivitiesForGroup(selectedGroup.entityId || selectedGroup.id);
        }
      }
    } catch (error) {
      console.error("Error updating activity:", error);
      setSnackbar({
        open: true,
        message: "Failed to update activity",
        severity: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Open edit activity dialog
  const openEditActivityDialog = (activity: Activity) => {
    setSelectedActivity(activity);
    setActivityFormData({ name: activity.name });
    setEditActivityDialogOpen(true);
  };

  // Fetch factors for a specific activity from diary table
  const fetchFactorsForActivity = async (activityId: number) => {
    setLoadingFactors(true);
    try {
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "Diary",
            TableName: "diary",
            Action: "readExact",
            Fields: {
              entity: activityId.toString(),
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      });

      if (response?.Data && response.Data[0]?.JsonData) {
        const jsonData = JSON.parse(response.Data[0].JsonData);
        const tableData = jsonData.Diary?.TableData || [];
        
        // Filter out "No Data found" message
        const validFactors = tableData.filter((item: any) => !item.Message);
        setFactors(validFactors);
      } else {
        setFactors([]);
      }
    } catch (error) {
      console.error("Error fetching factors:", error);
      setFactors([]);
    } finally {
      setLoadingFactors(false);
    }
  };

  // Open view factors dialog
  const openViewFactorsDialog = (activity: Activity) => {
    setSelectedActivity(activity);
    setFactors([]);
    setViewActivitiesDialogOpen(false);
    setViewFactorsDialogOpen(true);
    fetchFactorsForActivity(activity.id);
  };

  return (
    <div className="min-h-screen">
      <ThreeBackground />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Factors</h1>
              <p className="text-gray-600 mt-1">
                Manage activity groups and their associated activities
              </p>
            </div>
            <Button
              onClick={() => {
                setFormData({ name: "", description: "" });
                setAddDialogOpen(true);
              }}
              className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
            >
              <AddCircle className="h-5 w-5 mr-2" />
              Add Activity Group
            </Button>
          </div>

          {/* Activity Groups Table */}
          <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
            <CardHeader className="bg-gradient-to-r from-green-600/80 to-emerald-600/80 text-white rounded-t-lg">
              <CardTitle>Activity Groups</CardTitle>
              <CardDescription className="text-green-100">
                {activityGroups.length} groups found
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <CircularProgress className="text-green-600" />
                  <span className="ml-3 text-gray-600">Loading activity groups...</span>
                </div>
              ) : activityGroups.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                    <AddCircle className="h-10 w-10 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">No Activity Groups Found</h3>
                  <p className="text-gray-500 mb-4">Get started by creating your first activity group</p>
                  <Button
                    onClick={() => setAddDialogOpen(true)}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Add Activity Group
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 hover:bg-gray-50">
                      <TableHead className="font-semibold text-gray-700">ID</TableHead>
                      <TableHead className="font-semibold text-gray-700">Name</TableHead>
                      <TableHead className="font-semibold text-gray-700">Description</TableHead>
                      <TableHead className="font-semibold text-gray-700">Activities</TableHead>
                      <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activityGroups.map((group, index) => (
                      <motion.tr
                        key={group.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.03 }}
                        className="border-b border-gray-100 hover:bg-green-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-gray-900">
                          #{group.id}
                        </TableCell>
                        <TableCell className="text-gray-900 font-medium">
                          {group.name}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {group.description || "-"}
                        </TableCell>
                        <TableCell>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                            {group.activities?.length || 0} activities
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openViewActivitiesDialog(group)}
                              className="text-gray-500 hover:text-blue-600 hover:bg-blue-50"
                              title="View Activities"
                            >
                              <Visibility className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => openEditDialog(group)}
                              className="text-gray-500 hover:text-amber-600 hover:bg-amber-50"
                              title="Edit Group"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                setGroupToDelete(group);
                                setDeleteConfirmOpen(true);
                              }}
                              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
                              title="Delete Group"
                            >
                              <Delete className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Add Activity Group Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Activity Group</DialogTitle>
            <DialogDescription>
              Create a new activity group to organize your emission factors
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                placeholder="Enter group name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Enter description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddDialogOpen(false)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddGroup}
              disabled={formLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {formLoading ? "Creating..." : "Create Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Activity Group Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Activity Group</DialogTitle>
            <DialogDescription>
              Update the activity group details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Group Name *</Label>
              <Input
                id="edit-name"
                placeholder="Enter group name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input
                id="edit-description"
                placeholder="Enter description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setSelectedGroup(null);
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditGroup}
              disabled={formLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {formLoading ? "Updating..." : "Update Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Activities Dialog */}
      <Dialog open={viewActivitiesDialogOpen} onOpenChange={setViewActivitiesDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedGroup && (
                <>
                  Activities in "{selectedGroup.name}"
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              All activities belonging to this activity group
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="flex justify-end mb-4">
              <Button
                onClick={() => {
                  setActivityFormData({ name: "" });
                  setAddActivityDialogOpen(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <AddCircle className="h-4 w-4 mr-2" />
                Add Activity
              </Button>
            </div>
            {loadingActivities ? (
              <div className="flex items-center justify-center py-8">
                <CircularProgress className="text-green-600" />
                <span className="ml-3 text-gray-600">Loading activities...</span>
              </div>
            ) : activities.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No activities found in this group</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Activity Name</TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activities.map((activity, index) => (
                    <motion.tr
                      key={activity.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-b border-gray-100 hover:bg-green-50/50 cursor-pointer"
                    >
                      <TableCell className="font-medium text-gray-900">
                        #{activity.id}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {activity.name}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEditActivityDialog(activity)}
                            className="text-gray-500 hover:text-amber-600 hover:bg-amber-50"
                            title="Edit Activity"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openViewFactorsDialog(activity)}
                            className="text-gray-500 hover:text-green-600 hover:bg-green-50"
                            title="View Factors"
                          >
                            <Visibility className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setViewActivitiesDialogOpen(false);
                setSelectedGroup(null);
                setActivities([]);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Activity Dialog */}
      <Dialog open={addActivityDialogOpen} onOpenChange={setAddActivityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Activity</DialogTitle>
            <DialogDescription>
              Add a new activity to "{selectedGroup?.name}"
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="activity-name">Activity Name *</Label>
              <Input
                id="activity-name"
                placeholder="Enter activity name"
                value={activityFormData.name}
                onChange={(e) => setActivityFormData({ ...activityFormData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAddActivityDialogOpen(false)}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddActivity}
              disabled={formLoading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {formLoading ? "Adding..." : "Add Activity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Activity Dialog */}
      <Dialog open={editActivityDialogOpen} onOpenChange={setEditActivityDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Activity</DialogTitle>
            <DialogDescription>
              Update the activity name
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-activity-name">Activity Name *</Label>
              <Input
                id="edit-activity-name"
                placeholder="Enter activity name"
                value={activityFormData.name}
                onChange={(e) => setActivityFormData({ ...activityFormData, name: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditActivityDialogOpen(false);
                setSelectedActivity(null);
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditActivity}
              disabled={formLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {formLoading ? "Updating..." : "Update Activity"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Factors Dialog */}
      <Dialog open={viewFactorsDialogOpen} onOpenChange={setViewFactorsDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedActivity && (
                <>
                  Factors for "{selectedActivity.name}"
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              All emission factors for this activity from the diary table
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {loadingFactors ? (
              <div className="flex items-center justify-center py-8">
                <CircularProgress className="text-green-600" />
                <span className="ml-3 text-gray-600">Loading factors...</span>
              </div>
            ) : factors.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <Visibility className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No Factors Found</h3>
                <p className="text-gray-500">No emission factors have been added for this activity yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">ID</TableHead>
                    <TableHead className="font-semibold text-gray-700">Period</TableHead>
                    <TableHead className="font-semibold text-gray-700">Type</TableHead>
                    <TableHead className="font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="font-semibold text-gray-700">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {factors.map((factor, index) => (
                    <motion.tr
                      key={factor.diaryId || index}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: index * 0.02 }}
                      className="border-b border-gray-100 hover:bg-green-50/50"
                    >
                      <TableCell className="font-medium text-gray-900">
                        #{factor.diaryId}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {factor.diaryPeriod || factor.diaryperiod || "-"}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {factor.diaryTypeName || factor.diarytypename || "-"}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                          {factor.diaryStatusName || factor.diarystatusname || "Active"}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {factor.diaryValue || factor.diaryvalue || "-"}
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
          <DialogFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                setViewFactorsDialogOpen(false);
                setSelectedActivity(null);
                setFactors([]);
              }}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setViewFactorsDialogOpen(false);
                setViewActivitiesDialogOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <ArrowBack className="h-4 w-4 mr-2" />
              Back to Activities
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Activity Group</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{groupToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setGroupToDelete(null);
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteGroup}
              disabled={formLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {formLoading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
