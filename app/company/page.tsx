"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { crudService } from "@/lib/crudService";
import { useAuth } from "@/lib/auth-context";
import {
  Edit,
  Business,
  Settings,
  LocationOn,
  Phone,
  Email,
  AccountTree,
  Group,
  ArrowBack,
  AttachFile,
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

interface Company {
  id: number;
  name: string;
  surname: string;
  identity: string;
  entityId: number;
  status: string | null;
  startDate: string | null;
  endDate: string | null;
  relationshipId: number;
  address?: {
    streetNo?: string;
    street?: string;
    suburb?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    province?: string;
    type?: string;
  };
  contact?: {
    phone?: string;
    type?: string;
  };
  email?: {
    address?: string;
    type?: string;
    preferred?: boolean;
  };
  costCentre?: {
    name?: string;
  };
  managers?: {
    id: number;
    entityId?: number;
    name: string;
    surname?: string;
    email?: string;
    active: boolean;
  }[];
  activities?: {
    primary?: string;
    secondary?: string;
    industry?: string;
  };
}

type DetailViewType =
  | "details"
  | "address"
  | "contact"
  | "email"
  | "cost-centre"
  | "managers"
  | "activities"
  | null;

export default function CompanyPage() {
  const { session } = useAuth();

  // State for companies
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [selectedDetailView, setSelectedDetailView] =
    useState<DetailViewType>(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [showCostCentreForm, setShowCostCentreForm] = useState(false);
  const [showManagersForm, setShowManagersForm] = useState(false);
  const [showActivitiesForm, setShowActivitiesForm] = useState(false);
  const [newManager, setNewManager] = useState({
    name: "",
    surname: "",
    email: "",
  });
  const [deleteManagerDialog, setDeleteManagerDialog] = useState<{
    open: boolean;
    manager: {
      id: number;
      entityId?: number;
      name: string;
      surname?: string;
      email?: string;
      active: boolean;
    } | null;
  }>({ open: false, manager: null });

  // Form state
  const [formData, setFormData] = useState({
    name: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });

  // Fetch companies on mount
  useEffect(() => {
    if (session?.access_token) {
      fetchCompanies();
    }
  }, [session?.access_token]);

  // Fetch companies from CRUD API
  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "Company",
            TableName: "entityrelationship",
            Action: "readExact",
            Fields: {
              Entity: "4",
              Relationship: "58287",
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      });

      if (response?.Data && response.Data[0]?.JsonData) {
        const jsonData = JSON.parse(response.Data[0].JsonData);
        const tableData = jsonData.Company?.TableData || [];

        // Map companies from entity relationship data
        const companyList: Company[] = tableData
          .filter(
            (item: any) =>
              item.entityrelationshipEntityBName &&
              item.entityrelationshipEntityBName.trim() !== "",
          )
          .map((item: any) => ({
            id: item.entityrelationshipId,
            name: item.entityrelationshipEntityBName,
            surname: item.entityrelationshipEntityBSurname || "",
            identity: item.entityrelationshipEntityBExternalNo || "",
            entityId: item.entityrelationshipEntityB,
            status: item.entityrelationshipStatusName,
            startDate: item.entityrelationshipStartDate,
            endDate: item.entityrelationshipEndDate,
            relationshipId: item.entityrelationshipId,
            address: {},
            contact: {},
            email: {},
            costCentre: {},
            managers: [],
            activities: {},
          }));

        setCompanies(companyList);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
      setSnackbar({
        open: true,
        message: "Failed to load companies",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch managers for a company (reverse lookup: who manages this company)
  const fetchManagersForCompany = async (
    companyEntityId: number,
  ): Promise<Company["managers"]> => {
    try {
      // First, fetch the manager relationships
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "Manages",
            TableName: "entityrelationship",
            Action: "readExact",
            Fields: {
              EntityB: companyEntityId.toString(),
              Relationship: "58287", // "Manages" relationship ID
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "100",
        CrudMessage: "@CrudMessage",
      });

      if (response?.Data && response.Data[0]?.JsonData) {
        const jsonData = JSON.parse(response.Data[0].JsonData);
        const tableData = jsonData.Manages?.TableData || [];

        // Get unique manager entity IDs
        const managerEntityIds = tableData
          .filter((item: any) => item.entityrelationshipEntity)
          .map((item: any) => item.entityrelationshipEntity);

        if (managerEntityIds.length === 0) {
          return [];
        }

        // Fetch system user info for emails
        const systemUserResponse = await crudService.callCrud({
          data: JSON.stringify([
            {
              RecordSet: "SU",
              TableName: "systemuser",
              Action: "readIn",
              Fields: {
                Entity: `(${managerEntityIds.join(",")})`,
              },
            },
          ]),
          PageNo: "1",
          NoOfLines: "100",
          CrudMessage: "@CrudMessage",
        });

        // Build a map of entity ID to email
        const emailMap: Record<number, string> = {};
        if (systemUserResponse?.Data && systemUserResponse.Data[0]?.JsonData) {
          const suData = JSON.parse(systemUserResponse.Data[0].JsonData);
          const suTableData = suData.SU?.TableData || [];
          suTableData.forEach((item: any) => {
            if (item.systemuserEntity && item.systemuserEmail) {
              emailMap[item.systemuserEntity] = item.systemuserEmail;
            }
          });
        }

        // Map managers from entity relationship data
        const managers: Company["managers"] = tableData
          .filter(
            (item: any) =>
              item.entityrelationshipEntityName &&
              item.entityrelationshipEntityName.trim() !== "",
          )
          .map((item: any) => ({
            id: item.entityrelationshipId,
            entityId: item.entityrelationshipEntity,
            name: item.entityrelationshipEntityName || "",
            surname: item.entityrelationshipEntitySurname || "",
            email: emailMap[item.entityrelationshipEntity] || "",
            active: item.entityrelationshipStatusName === "Active",
          }));

        return managers;
      }
      return [];
    } catch (error) {
      console.error("Error fetching managers:", error);
      return [];
    }
  };

  // Handle company selection (row click)
  const handleSelectCompany = async (company: Company) => {
    setSelectedCompany(company);
    setSelectedDetailView("details");

    try {
      // Fetch all company details in a single batch request (based on Payload_5 structure)
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "Address",
            TableName: "address",
            Action: "readExact",
            Fields: {
              Person: company.entityId.toString(),
            },
          },
          {
            RecordSet: "Contact",
            TableName: "contactnumber",
            Action: "readExact",
            Fields: {
              Person: company.entityId.toString(),
            },
          },
          {
            RecordSet: "Email",
            TableName: "email",
            Action: "readExact",
            Fields: {
              Person: company.entityId.toString(),
            },
          },
          {
            RecordSet: "Relationship",
            TableName: "entityrelationship",
            Action: "readExact",
            Fields: {
              Entity: company.entityId.toString(),
              Relationship: "59298", // "Owns" relationship
            },
          },
          {
            RecordSet: "Act",
            TableName: "entityrelationship",
            Action: "readExact",
            Fields: {
              Entity: company.entityId.toString(),
              Relationship: "59296", // "uses" relationship
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      });

      if (response?.Data && response.Data[0]?.JsonData) {
        const jsonData = JSON.parse(response.Data[0].JsonData);

        // Parse address data
        const addressData = jsonData.Address?.TableData?.[0];
        const address =
          addressData && !addressData.Message
            ? {
                streetNo: addressData.addressStreetNo || "",
                street: addressData.addressStreet || "",
                suburb: addressData.addressSuburb || "",
                city: addressData.addressCity || "",
                postalCode: addressData.addressPostalCode || "",
                country: addressData.addressCountry || "",
                province: addressData.addressProvince || "",
                type: addressData.addressType || "",
              }
            : {};

        // Parse contact data
        const contactData = jsonData.Contact?.TableData?.[0];
        const contact =
          contactData && !contactData.Message
            ? {
                phone: contactData.contactnumberNumber || "",
                type: contactData.contactnumberType || "",
              }
            : {};

        // Parse email data
        const emailData = jsonData.Email?.TableData?.[0];
        const email =
          emailData && !emailData.Message
            ? {
                address: emailData.emailAddress || "",
                type: emailData.emailType || "",
                preferred: emailData.emailPreferred === "1",
              }
            : {};

        // Parse activities (uses relationship)
        const actData = jsonData.Act?.TableData || [];
        const activities =
          actData.length > 0 && !actData[0].Message
            ? {
                primary: actData[0]?.entityrelationshipEntityBName || "",
                secondary: actData[1]?.entityrelationshipEntityBName || "",
              }
            : {};

        // Update company with fetched data
        setSelectedCompany((prev) =>
          prev
            ? {
                ...prev,
                address,
                contact,
                email,
                activities,
              }
            : null,
        );
      }

      // Fetch managers separately (requires different query structure)
      const managers = await fetchManagersForCompany(company.entityId);
      if (managers && managers.length > 0) {
        setSelectedCompany((prev) => (prev ? { ...prev, managers } : null));
      }
    } catch (error) {
      console.error("Error fetching company details:", error);
    }
  };

  // Handle delete manager
  const handleDeleteManager = async () => {
    if (!deleteManagerDialog.manager || !selectedCompany) return;

    setFormLoading(true);
    try {
      // Delete the entity relationship from the API
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "Relationship",
            TableName: "entityrelationship",
            Action: "delete",
            Fields: {
              Id: deleteManagerDialog.manager.id,
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "100",
        CrudMessage: "@CrudMessage",
      });

      // Remove manager from local state
      const updatedManagers = (selectedCompany.managers || []).filter(
        (m) => m.id !== deleteManagerDialog.manager?.id,
      );
      setSelectedCompany({
        ...selectedCompany,
        managers: updatedManagers,
      });

      setSnackbar({
        open: true,
        message: "Manager deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Error deleting manager:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete manager",
        severity: "error",
      });
    } finally {
      setFormLoading(false);
      setDeleteManagerDialog({ open: false, manager: null });
    }
  };

  // Open edit dialog with company data
  const openEditDialog = (company: Company) => {
    setEditingCompany(company);
    setFormData({
      name: company.name,
    });
    setEditDialogOpen(true);
  };

  // Handle edit company
  const handleEditCompany = async () => {
    if (!editingCompany || !formData.name.trim()) {
      setSnackbar({
        open: true,
        message: "Please enter a company name",
        severity: "error",
      });
      return;
    }

    setFormLoading(true);
    try {
      // Update the entity name
      const response = await crudService.callCrud({
        data: JSON.stringify([
          {
            RecordSet: "Company",
            TableName: "entity",
            Action: "update",
            Fields: {
              entityid: editingCompany.entityId,
              entityname: formData.name,
              entitysurname: " ",
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
          message: "Company updated successfully",
          severity: "success",
        });
        setEditDialogOpen(false);
        setEditingCompany(null);
        setFormData({ name: "" });
        fetchCompanies();
      }
    } catch (error) {
      console.error("Error updating company:", error);
      setSnackbar({
        open: true,
        message: "Failed to update company",
        severity: "error",
      });
    } finally {
      setFormLoading(false);
    }
  };

  // Detail view options
  const detailOptions = [
    {
      id: "details" as DetailViewType,
      label: "Details",
      icon: Settings,
      color: "bg-blue-500 hover:bg-blue-600",
    },
    {
      id: "address" as DetailViewType,
      label: "Address",
      icon: LocationOn,
      color: "bg-green-500 hover:bg-green-600",
    },
    {
      id: "contact" as DetailViewType,
      label: "Contact",
      icon: Phone,
      color: "bg-purple-500 hover:bg-purple-600",
    },
    {
      id: "email" as DetailViewType,
      label: "Email",
      icon: Email,
      color: "bg-amber-500 hover:bg-amber-600",
    },
    {
      id: "cost-centre" as DetailViewType,
      label: "Cost Centre",
      icon: AccountTree,
      color: "bg-teal-500 hover:bg-teal-600",
    },
    {
      id: "managers" as DetailViewType,
      label: "Managers",
      icon: Group,
      color: "bg-indigo-500 hover:bg-indigo-600",
    },
    {
      id: "activities" as DetailViewType,
      label: "Activities",
      icon: Business,
      color: "bg-rose-500 hover:bg-rose-600",
    },
  ];

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Companies
              </h1>
              <p className="text-gray-600 mt-1">
                Manage companies and their details
              </p>
            </div>
          </div>

          {/* Company Selection View */}
          {!selectedCompany ? (
            <div className="flex justify-center">
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl max-w-2xl w-full">
                <CardHeader className="bg-gradient-to-r from-green-600/80 to-green-600/80 text-white rounded-t-lg py-4">
                  <CardTitle>Company List</CardTitle>
                  <CardDescription className="text-green-100">
                    {companies.length} companies found - Click a company to
                    select
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  {loading ? (
                    <div className="flex items-center justify-center py-16">
                      <CircularProgress className="text-green-600" />
                      <span className="ml-3 text-gray-600">
                        Loading companies...
                      </span>
                    </div>
                  ) : companies.length === 0 ? (
                    <div className="text-center py-16">
                      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                        <Business className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        No Companies Found
                      </h3>
                      <p className="text-gray-500">
                        No companies have been added yet
                      </p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto max-h-[60vh]">
                      <Table>
                        <TableHeader className="sticky top-0 bg-white z-10">
                          <TableRow className="bg-gray-50 hover:bg-gray-50">
                            <TableHead className="font-semibold text-gray-700">
                              Company Name
                            </TableHead>
                            <TableHead className="font-semibold text-gray-700 text-right w-24">
                              Actions
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {companies.map((company, index) => (
                            <motion.tr
                              key={company.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.2,
                                delay: index * 0.03,
                              }}
                              onClick={() => handleSelectCompany(company)}
                              className="border-b border-gray-100 hover:bg-green-50/50 transition-colors cursor-pointer"
                            >
                              <TableCell className="text-gray-900 font-medium py-4">
                                {company.name}
                              </TableCell>
                              <TableCell className="text-right py-4">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditDialog(company);
                                  }}
                                  className="text-gray-500 hover:text-amber-600 hover:bg-amber-50 h-8 w-8 p-0"
                                  title="Edit Company"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          ) : (
            /* Detail View Selection - Only shown when company is selected */
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="backdrop-blur-md bg-white/80 border border-white/30 shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-600/80 to-green-600/80 text-white rounded-t-lg py-4">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedCompany(null);
                        setSelectedDetailView(null);
                      }}
                      className="text-white hover:bg-white/20 h-8 w-8 p-0"
                    >
                      <ArrowBack className="h-5 w-5" />
                    </Button>
                    <div>
                      <CardTitle className="text-lg">
                        Selected: {selectedCompany.name}
                      </CardTitle>
                      <CardDescription className="text-blue-100">
                        Choose what you would like to view or edit
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {detailOptions.map((option) => {
                      const Icon = option.icon;
                      const isSelected = selectedDetailView === option.id;
                      return (
                        <Button
                          key={option.id}
                          size="sm"
                          onClick={() => setSelectedDetailView(option.id)}
                          className={`flex items-center gap-2 px-3 py-2 h-auto ${option.color} text-white transition-all ${
                            isSelected
                              ? "ring-2 ring-offset-1 ring-green-400"
                              : ""
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          <span className="text-xs font-medium">
                            {option.label}
                          </span>
                        </Button>
                      );
                    })}
                  </div>

                  {/* Detail View Content */}
                  {selectedDetailView && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 pt-6 border-t border-gray-200"
                    >
                      {selectedDetailView === "details" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Company Details
                          </h3>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <Label className="text-gray-500 text-sm">
                                Name
                              </Label>
                              <Input
                                value={selectedCompany.name}
                                onChange={(e) => {
                                  const updatedCompany = {
                                    ...selectedCompany,
                                    name: e.target.value,
                                  };
                                  setSelectedCompany(updatedCompany);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-500 text-sm">
                                Surname
                              </Label>
                              <Input
                                value={selectedCompany.surname || ""}
                                onChange={(e) => {
                                  const updatedCompany = {
                                    ...selectedCompany,
                                    surname: e.target.value,
                                  };
                                  setSelectedCompany(updatedCompany);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-500 text-sm">
                                Identity
                              </Label>
                              <Input
                                value={selectedCompany.identity || ""}
                                onChange={(e) => {
                                  const updatedCompany = {
                                    ...selectedCompany,
                                    identity: e.target.value,
                                  };
                                  setSelectedCompany(updatedCompany);
                                }}
                                className="mt-1"
                              />
                            </div>
                            <div>
                              <Label className="text-gray-500 text-sm">
                                Status
                              </Label>
                              <Input
                                value={selectedCompany.status || ""}
                                onChange={(e) => {
                                  const updatedCompany = {
                                    ...selectedCompany,
                                    status: e.target.value,
                                  };
                                  setSelectedCompany(updatedCompany);
                                }}
                                className="mt-1"
                              />
                            </div>
                          </div>
                          <div className="flex justify-center items-center gap-2 mt-4">
                            <Button
                              onClick={async () => {
                                if (!selectedCompany.name.trim()) {
                                  setSnackbar({
                                    open: true,
                                    message: "Please enter a company name",
                                    severity: "error",
                                  });
                                  return;
                                }

                                setFormLoading(true);
                                try {
                                  const response = await crudService.callCrud({
                                    data: JSON.stringify([
                                      {
                                        RecordSet: "Company",
                                        TableName: "entity",
                                        Action: "update",
                                        Fields: {
                                          entityid: selectedCompany.entityId,
                                          entityname: selectedCompany.name,
                                          entitysurname:
                                            selectedCompany.surname || " ",
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
                                      message: "Company updated successfully",
                                      severity: "success",
                                    });
                                    fetchCompanies();
                                  }
                                } catch (error) {
                                  console.error(
                                    "Error updating company:",
                                    error,
                                  );
                                  setSnackbar({
                                    open: true,
                                    message: "Failed to update company",
                                    severity: "error",
                                  });
                                } finally {
                                  setFormLoading(false);
                                }
                              }}
                              disabled={formLoading}
                              className="bg-amber-500 hover:bg-amber-600 text-white"
                            >
                              {formLoading ? "Updating..." : "Update Company"}
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="border-gray-300 hover:bg-gray-100"
                              title="Attachments"
                            >
                              <AttachFile className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}

                      {selectedDetailView === "address" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Address
                          </h3>
                          {!showAddressForm &&
                          !selectedCompany.address?.street &&
                          !selectedCompany.address?.city ? (
                            <div className="text-center py-8">
                              <LocationOn className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 mb-4">
                                No address configured
                              </p>
                              <Button
                                onClick={() => setShowAddressForm(true)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Add Address
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Street No
                                  </Label>
                                  <Input
                                    value={
                                      selectedCompany.address?.streetNo || ""
                                    }
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        address: {
                                          ...selectedCompany.address,
                                          streetNo: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter street number"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Street
                                  </Label>
                                  <Input
                                    value={
                                      selectedCompany.address?.street || ""
                                    }
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        address: {
                                          ...selectedCompany.address,
                                          street: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter street name"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Suburb
                                  </Label>
                                  <Input
                                    value={
                                      selectedCompany.address?.suburb || ""
                                    }
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        address: {
                                          ...selectedCompany.address,
                                          suburb: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter suburb"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    City
                                  </Label>
                                  <Input
                                    value={selectedCompany.address?.city || ""}
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        address: {
                                          ...selectedCompany.address,
                                          city: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter city"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Postal Code
                                  </Label>
                                  <Input
                                    value={
                                      selectedCompany.address?.postalCode || ""
                                    }
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        address: {
                                          ...selectedCompany.address,
                                          postalCode: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter postal code"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Country
                                  </Label>
                                  <Input
                                    value={
                                      selectedCompany.address?.country || ""
                                    }
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        address: {
                                          ...selectedCompany.address,
                                          country: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter country"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Province
                                  </Label>
                                  <Input
                                    value={
                                      selectedCompany.address?.province || ""
                                    }
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        address: {
                                          ...selectedCompany.address,
                                          province: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter province"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Type
                                  </Label>
                                  <Input
                                    value={selectedCompany.address?.type || ""}
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        address: {
                                          ...selectedCompany.address,
                                          type: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter address type"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-center mt-4">
                                <Button
                                  onClick={async () => {
                                    setFormLoading(true);
                                    try {
                                      setSnackbar({
                                        open: true,
                                        message: "Address updated successfully",
                                        severity: "success",
                                      });
                                      setShowAddressForm(false);
                                    } catch (error) {
                                      setSnackbar({
                                        open: true,
                                        message: "Failed to update address",
                                        severity: "error",
                                      });
                                    } finally {
                                      setFormLoading(false);
                                    }
                                  }}
                                  disabled={formLoading}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  {formLoading
                                    ? "Updating..."
                                    : "Update Address"}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {selectedDetailView === "contact" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Contact
                          </h3>
                          {!showContactForm &&
                          !selectedCompany.contact?.phone ? (
                            <div className="text-center py-8">
                              <Phone className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 mb-4">
                                No contact information available
                              </p>
                              <Button
                                onClick={() => setShowContactForm(true)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Add Contact
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Phone Number
                                  </Label>
                                  <Input
                                    value={selectedCompany.contact?.phone || ""}
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        contact: {
                                          ...selectedCompany.contact,
                                          phone: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter phone number"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Number Type
                                  </Label>
                                  <Select
                                    value={selectedCompany.contact?.type || ""}
                                    onValueChange={(value) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        contact: {
                                          ...selectedCompany.contact,
                                          type: value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="cell">Cell</SelectItem>
                                      <SelectItem value="phone">
                                        Phone
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex justify-center mt-4">
                                <Button
                                  onClick={async () => {
                                    setFormLoading(true);
                                    try {
                                      setSnackbar({
                                        open: true,
                                        message: "Contact updated successfully",
                                        severity: "success",
                                      });
                                      setShowContactForm(false);
                                    } catch (error) {
                                      setSnackbar({
                                        open: true,
                                        message: "Failed to update contact",
                                        severity: "error",
                                      });
                                    } finally {
                                      setFormLoading(false);
                                    }
                                  }}
                                  disabled={formLoading}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  {formLoading
                                    ? "Updating..."
                                    : "Update Contact"}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {selectedDetailView === "email" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Email
                          </h3>
                          {!showEmailForm && !selectedCompany.email?.address ? (
                            <div className="text-center py-8">
                              <Email className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 mb-4">
                                No email addresses configured
                              </p>
                              <Button
                                onClick={() => setShowEmailForm(true)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Add Email
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Email Address
                                  </Label>
                                  <Input
                                    type="email"
                                    value={selectedCompany.email?.address || ""}
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        email: {
                                          ...selectedCompany.email,
                                          address: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter email address"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Email Type
                                  </Label>
                                  <Select
                                    value={selectedCompany.email?.type || ""}
                                    onValueChange={(value) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        email: {
                                          ...selectedCompany.email,
                                          type: value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                  >
                                    <SelectTrigger className="mt-1">
                                      <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="personal">
                                        Personal
                                      </SelectItem>
                                      <SelectItem value="work">Work</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="sm:col-span-2 flex items-center space-x-2">
                                  <Checkbox
                                    id="preferred"
                                    checked={
                                      selectedCompany.email?.preferred || false
                                    }
                                    onCheckedChange={(checked) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        email: {
                                          ...selectedCompany.email,
                                          preferred: checked === true,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                  />
                                  <label
                                    htmlFor="preferred"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                  >
                                    Preferred communication method
                                  </label>
                                </div>
                              </div>
                              <div className="flex justify-center mt-4">
                                <Button
                                  onClick={async () => {
                                    setFormLoading(true);
                                    try {
                                      setSnackbar({
                                        open: true,
                                        message: "Email updated successfully",
                                        severity: "success",
                                      });
                                      setShowEmailForm(false);
                                    } catch (error) {
                                      setSnackbar({
                                        open: true,
                                        message: "Failed to update email",
                                        severity: "error",
                                      });
                                    } finally {
                                      setFormLoading(false);
                                    }
                                  }}
                                  disabled={formLoading}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  {formLoading ? "Updating..." : "Update Email"}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {selectedDetailView === "cost-centre" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Cost Centre
                          </h3>
                          {!showCostCentreForm &&
                          !selectedCompany.costCentre?.name ? (
                            <div className="text-center py-8">
                              <AccountTree className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 mb-4">
                                No cost centres configured
                              </p>
                              <Button
                                onClick={() => setShowCostCentreForm(true)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Add Cost Centre
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Name
                                  </Label>
                                  <Input
                                    value={
                                      selectedCompany.costCentre?.name || ""
                                    }
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        costCentre: {
                                          ...selectedCompany.costCentre,
                                          name: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter cost centre name"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-center mt-4">
                                <Button
                                  onClick={async () => {
                                    setFormLoading(true);
                                    try {
                                      setSnackbar({
                                        open: true,
                                        message:
                                          "Cost centre updated successfully",
                                        severity: "success",
                                      });
                                      setShowCostCentreForm(false);
                                    } catch (error) {
                                      setSnackbar({
                                        open: true,
                                        message: "Failed to update cost centre",
                                        severity: "error",
                                      });
                                    } finally {
                                      setFormLoading(false);
                                    }
                                  }}
                                  disabled={formLoading}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  {formLoading
                                    ? "Updating..."
                                    : "Update Cost Centre"}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {selectedDetailView === "managers" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Managers
                          </h3>

                          {/* Add Manager Form */}
                          {showManagersForm && (
                            <div className="bg-gray-50 p-4 rounded-lg space-y-4 mb-4">
                              <h4 className="text-sm font-medium text-gray-700">
                                Add New Manager
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Name
                                  </Label>
                                  <Input
                                    value={newManager.name}
                                    onChange={(e) =>
                                      setNewManager({
                                        ...newManager,
                                        name: e.target.value,
                                      })
                                    }
                                    className="mt-1"
                                    placeholder="Enter name"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Surname
                                  </Label>
                                  <Input
                                    value={newManager.surname}
                                    onChange={(e) =>
                                      setNewManager({
                                        ...newManager,
                                        surname: e.target.value,
                                      })
                                    }
                                    className="mt-1"
                                    placeholder="Enter surname"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Email
                                  </Label>
                                  <Input
                                    type="email"
                                    value={newManager.email}
                                    onChange={(e) =>
                                      setNewManager({
                                        ...newManager,
                                        email: e.target.value,
                                      })
                                    }
                                    className="mt-1"
                                    placeholder="Enter email"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-center gap-2">
                                <Button
                                  onClick={async () => {
                                    if (!newManager.name.trim()) {
                                      setSnackbar({
                                        open: true,
                                        message: "Please enter a name",
                                        severity: "error",
                                      });
                                      return;
                                    }
                                    if (!newManager.email.trim()) {
                                      setSnackbar({
                                        open: true,
                                        message: "Please enter an email",
                                        severity: "error",
                                      });
                                      return;
                                    }

                                    setFormLoading(true);
                                    try {
                                      // Step 1: Create entity record for the manager
                                      const entityResponse =
                                        await crudService.callCrud({
                                          data: JSON.stringify([
                                            {
                                              RecordSet: "Manager",
                                              TableName: "entity",
                                              Action: "create",
                                              Fields: {
                                                Name: newManager.name,
                                                Surname: newManager.surname,
                                                Status: "63", // Active status
                                              },
                                            },
                                          ]),
                                          PageNo: "1",
                                          NoOfLines: "300",
                                          CrudMessage: "@CrudMessage",
                                        });

                                      let managerEntityId: number | null = null;
                                      if (
                                        entityResponse?.Data &&
                                        entityResponse.Data[0]?.JsonData
                                      ) {
                                        const jsonData = JSON.parse(
                                          entityResponse.Data[0].JsonData,
                                        );
                                        managerEntityId = jsonData.Manager?.Id;
                                      }

                                      if (!managerEntityId) {
                                        throw new Error(
                                          "Failed to create manager entity",
                                        );
                                      }

                                      // Step 2: Create additional info record
                                      await crudService.callCrud({
                                        data: JSON.stringify([
                                          {
                                            RecordSet: "ManagerAI",
                                            TableName: "additionalinfo",
                                            Action: "create",
                                            Fields: {
                                              tableid:
                                                managerEntityId.toString(),
                                              tablename: "entity",
                                              ruleactionid: "138",
                                            },
                                          },
                                        ]),
                                        PageNo: "1",
                                        NoOfLines: "300",
                                        CrudMessage: "@CrudMessage",
                                      });

                                      // Step 3: Create relationship (manager manages company)
                                      const relationshipResponse =
                                        await crudService.callCrud({
                                          data: JSON.stringify([
                                            {
                                              RecordSet: "Relationship",
                                              TableName: "entityrelationship",
                                              Action: "create",
                                              Fields: {
                                                Entity:
                                                  managerEntityId.toString(),
                                                EntityB:
                                                  selectedCompany.entityId.toString(),
                                                Relationship: "58287", // "Manages" relationship
                                              },
                                            },
                                          ]),
                                          PageNo: "1",
                                          NoOfLines: "300",
                                          CrudMessage: "@CrudMessage",
                                        });

                                      let relationshipId: number | null = null;
                                      if (
                                        relationshipResponse?.Data &&
                                        relationshipResponse.Data[0]?.JsonData
                                      ) {
                                        const jsonData = JSON.parse(
                                          relationshipResponse.Data[0].JsonData,
                                        );
                                        relationshipId =
                                          jsonData.Relationship?.Id;
                                      }

                                      // Step 4: Create system user
                                      await crudService.callCrud({
                                        data: JSON.stringify([
                                          {
                                            RecordSet: "SystemUser",
                                            TableName: "systemuser",
                                            Action: "create",
                                            Fields: {
                                              Entity:
                                                managerEntityId.toString(),
                                              Username: newManager.email,
                                              Email: newManager.email,
                                              Active: "1",
                                            },
                                          },
                                        ]),
                                        PageNo: "1",
                                        NoOfLines: "300",
                                        CrudMessage: "@CrudMessage",
                                      });

                                      // Add the new manager to local state
                                      const newManagerEntry = {
                                        id: relationshipId || Date.now(),
                                        entityId: managerEntityId,
                                        name: `${newManager.name} ${newManager.surname}`.trim(),
                                        surname: newManager.surname,
                                        email: newManager.email,
                                        active: true,
                                      };
                                      setSelectedCompany({
                                        ...selectedCompany,
                                        managers: [
                                          ...(selectedCompany.managers || []),
                                          newManagerEntry,
                                        ],
                                      });
                                      setNewManager({
                                        name: "",
                                        surname: "",
                                        email: "",
                                      });
                                      setShowManagersForm(false);
                                      setSnackbar({
                                        open: true,
                                        message: "Manager added successfully",
                                        severity: "success",
                                      });
                                    } catch (error) {
                                      console.error(
                                        "Error adding manager:",
                                        error,
                                      );
                                      setSnackbar({
                                        open: true,
                                        message: "Failed to add manager",
                                        severity: "error",
                                      });
                                    } finally {
                                      setFormLoading(false);
                                    }
                                  }}
                                  disabled={formLoading}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  {formLoading ? "Saving..." : "Save"}
                                </Button>
                                <Button
                                  variant="outline"
                                  onClick={() => {
                                    setShowManagersForm(false);
                                    setNewManager({
                                      name: "",
                                      surname: "",
                                      email: "",
                                    });
                                  }}
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Managers List */}
                          {!selectedCompany.managers ||
                          selectedCompany.managers.length === 0 ? (
                            !showManagersForm && (
                              <div className="text-center py-8">
                                <Group className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 mb-4">
                                  No managers assigned
                                </p>
                                <Button
                                  onClick={() => setShowManagersForm(true)}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  Add Manager
                                </Button>
                              </div>
                            )
                          ) : (
                            <>
                              <div className="space-y-2">
                                {selectedCompany.managers.map(
                                  (manager, index) => (
                                    <div
                                      key={manager.id || index}
                                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                                    >
                                      <div>
                                        <span className="text-gray-900 font-medium">
                                          {manager.name}
                                        </span>
                                        {manager.email && (
                                          <span className="text-gray-500 text-sm ml-2">
                                            ({manager.email})
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() => {
                                            const updatedManagers = [
                                              ...(selectedCompany.managers ||
                                                []),
                                            ];
                                            updatedManagers[index] = {
                                              ...manager,
                                              active: !manager.active,
                                            };
                                            setSelectedCompany({
                                              ...selectedCompany,
                                              managers: updatedManagers,
                                            });
                                          }}
                                          className={
                                            manager.active
                                              ? "bg-amber-500 hover:bg-amber-600 text-white"
                                              : "bg-green-500 hover:bg-green-600 text-white"
                                          }
                                        >
                                          {manager.active
                                            ? "Deactivate"
                                            : "Activate"}
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="destructive"
                                          onClick={() =>
                                            setDeleteManagerDialog({
                                              open: true,
                                              manager,
                                            })
                                          }
                                          className="bg-red-500 hover:bg-red-600 text-white"
                                        >
                                          Delete
                                        </Button>
                                      </div>
                                    </div>
                                  ),
                                )}
                              </div>
                              <div className="flex justify-center mt-4">
                                <Button
                                  onClick={() => setShowManagersForm(true)}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  Add Manager
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {selectedDetailView === "activities" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-800">
                            Activities
                          </h3>
                          {!showActivitiesForm &&
                          !selectedCompany.activities?.primary &&
                          !selectedCompany.activities?.secondary ? (
                            <div className="text-center py-8">
                              <Business className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                              <p className="text-gray-500 mb-4">
                                No activities configured
                              </p>
                              <Button
                                onClick={() => setShowActivitiesForm(true)}
                                className="bg-green-500 hover:bg-green-600 text-white"
                              >
                                Add Activities
                              </Button>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-4">
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Primary Activity
                                  </Label>
                                  <Input
                                    value={
                                      selectedCompany.activities?.primary || ""
                                    }
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        activities: {
                                          ...selectedCompany.activities,
                                          primary: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter primary activity"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Secondary Activity
                                  </Label>
                                  <Input
                                    value={
                                      selectedCompany.activities?.secondary ||
                                      ""
                                    }
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        activities: {
                                          ...selectedCompany.activities,
                                          secondary: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter secondary activity"
                                  />
                                </div>
                                <div>
                                  <Label className="text-gray-500 text-sm">
                                    Industry Sector
                                  </Label>
                                  <Input
                                    value={
                                      selectedCompany.activities?.industry || ""
                                    }
                                    onChange={(e) => {
                                      const updatedCompany = {
                                        ...selectedCompany,
                                        activities: {
                                          ...selectedCompany.activities,
                                          industry: e.target.value,
                                        },
                                      };
                                      setSelectedCompany(updatedCompany);
                                    }}
                                    className="mt-1"
                                    placeholder="Enter industry sector"
                                  />
                                </div>
                              </div>
                              <div className="flex justify-center mt-4">
                                <Button
                                  onClick={async () => {
                                    setFormLoading(true);
                                    try {
                                      setSnackbar({
                                        open: true,
                                        message:
                                          "Activities updated successfully",
                                        severity: "success",
                                      });
                                      setShowActivitiesForm(false);
                                    } catch (error) {
                                      setSnackbar({
                                        open: true,
                                        message: "Failed to update activities",
                                        severity: "error",
                                      });
                                    } finally {
                                      setFormLoading(false);
                                    }
                                  }}
                                  disabled={formLoading}
                                  className="bg-green-500 hover:bg-green-600 text-white"
                                >
                                  {formLoading
                                    ? "Updating..."
                                    : "Update Activities"}
                                </Button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>

      {/* Edit Company Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Company</DialogTitle>
            <DialogDescription>Update the company name</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="company-name">Name *</Label>
              <Input
                id="company-name"
                placeholder="Enter company name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setEditDialogOpen(false);
                setEditingCompany(null);
              }}
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditCompany}
              disabled={formLoading}
              className="bg-amber-600 hover:bg-amber-700 text-white"
            >
              {formLoading ? "Updating..." : "Update Company"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Manager Confirmation Dialog */}
      <Dialog
        open={deleteManagerDialog.open}
        onOpenChange={(open) =>
          setDeleteManagerDialog({
            open,
            manager: open ? deleteManagerDialog.manager : null,
          })
        }
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-red-600">Delete Manager</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <strong>{deleteManagerDialog.manager?.name}</strong>?
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm font-medium">⚠️ Warning</p>
              <p className="text-red-700 text-sm mt-1">
                This action cannot be undone. The manager profile will be
                permanently deleted from the system.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteManagerDialog({ open: false, manager: null })
              }
              disabled={formLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteManager}
              disabled={formLoading}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {formLoading ? "Deleting..." : "Delete Manager"}
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
