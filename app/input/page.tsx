"use client";

import { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input as FormInput } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AddCircle,
  UploadFile,
  History,
  CheckCircle,
  Description,
  Note,
  AttachFile,
  ExpandMore,
} from "@mui/icons-material";
import { Snackbar, Alert, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import {
  InputData,
  CreateInputDataRequest,
  UpdateInputDataRequest,
} from "@/types/inputData";
import AnimatedFormField from "@/components/animated-form-field";
import AnimatedSubmitButton from "@/components/animated-submit-button";
import { crudService } from "@/lib/crudService";
import { useAuth } from "@/lib/auth-context";
import { useEntityRelationship } from "@/lib/entityRelationshipContext";
import { environment } from "@/lib/environment";
import ExcelPreview from "@/components/excel-preview";
const ThreeBackground = dynamic(() => import("@/components/three-bg"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 -z-10">
      <div className="w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50" />
    </div>
  ),
});

export default function Input() {
  const { session } = useAuth();
  const { selectedEntityRelationship, selectedEntityId } =
    useEntityRelationship();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [inputData, setInputData] = useState<any[]>([]);
  const [traceData, setTraceData] = useState<any[]>([]);
  const [startDateHistory, setStartDateHistory] = useState<string>("");
  const [endDateHistory, setEndDateHistory] = useState<string>("");
  const [appliedStartDateHistory, setAppliedStartDateHistory] =
    useState<string>("");
  const [appliedEndDateHistory, setAppliedEndDateHistory] =
    useState<string>("");
  const [startDateTrace, setStartDateTrace] = useState<string>("");
  const [endDateTrace, setEndDateTrace] = useState<string>("");
  const [appliedStartDateTrace, setAppliedStartDateTrace] =
    useState<string>("");
  const [appliedEndDateTrace, setAppliedEndDateTrace] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("enter-data");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [notesDialogOpen, setNotesDialogOpen] = useState(false);
  const [documentsDialogOpen, setDocumentsDialogOpen] = useState(false);
  const [selectedNotes, setSelectedNotes] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Pagination state
  const ITEMS_PER_PAGE = 20;
  const [currentPageHistory, setCurrentPageHistory] = useState(1);
  const [currentPageTrace, setCurrentPageTrace] = useState(1);

  // New state for attachment and notes modals in Enter Data tab
  const [attachmentModalOpen, setAttachmentModalOpen] = useState(false);
  const [notesModalOpen, setNotesModalOpen] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [modalNotes, setModalNotes] = useState<string[]>([]);
  const [currentNoteInput, setCurrentNoteInput] = useState("");

  // Custom alert dialog state
  const [alertDialogOpen, setAlertDialogOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<"success" | "error">("success");

  // Show custom alert
  const showAlert = (message: string, type: "success" | "error") => {
    setAlertMessage(message);
    setAlertType(type);
    setAlertDialogOpen(true);
  };

  // Detail dialog state for Input History
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Attachment dialog state for Input History
  const [historyAttachmentDialogOpen, setHistoryAttachmentDialogOpen] = useState(false);
  const [selectedHistoryAttachmentItem, setSelectedHistoryAttachmentItem] = useState<any>(null);

  // Notes dialog state for Input History
  const [historyNotesDialogOpen, setHistoryNotesDialogOpen] = useState(false);
  const [selectedHistoryNotesItem, setSelectedHistoryNotesItem] = useState<any>(null);
  const [historyEntryNotes, setHistoryEntryNotes] = useState<string[]>([]);

  // Handle opening attachments dialog
  const handleViewHistoryAttachments = (item: any) => {
    setSelectedHistoryAttachmentItem(item);
    setHistoryAttachmentDialogOpen(true);
  };

  // Handle opening notes dialog
  const handleViewHistoryNotes = (item: any) => {
    setSelectedHistoryNotesItem(item);
    setHistoryEntryNotes(item.notes || []);
    setHistoryNotesDialogOpen(true);
  };

  // Handle opening detail dialog and fetching data
  const handleViewDetail = async (item: any) => {
    setSelectedDetailItem(null);
    setDetailDialogOpen(true);
    setDetailLoading(true);

    try {
      const diaryId = item.diaryid || item.diarydetaildiary;
      if (!diaryId) {
        setSelectedDetailItem(item);
        setDetailLoading(false);
        return;
      }

      const requestBody = {
        data: JSON.stringify({
          RecordSet: "TS",
          TableName: "diarydetail",
          Action: "readExact",
          Fields: {
            diary: diaryId.toString()
          }
        }),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage"
      };

      const response = await crudService.create("/crud/diarydetail", requestBody) as any;

      if (response && response.Data && response.Data.length > 0) {
        const jsonData = response.Data[0].JsonData;
        const parsedData = JSON.parse(jsonData);
        
        if (parsedData.TS && parsedData.TS.TableData && parsedData.TS.TableData.length > 0) {
          const detailData = parsedData.TS.TableData[0];
          setSelectedDetailItem({
            ...item,
            ...detailData,
            // Use the fetched data for display
            diarydetailname: detailData.diarydetailname,
            diarydetailtypeName: detailData.diarydetailtypeName,
            diarydetailunitName: detailData.diarydetailunitName,
            diarydetailquantity: detailData.diarydetailquantity,
            diarydetailamount: detailData.diarydetailamount,
            diarydetailstartdate: detailData.diarydetailstartdate,
            diarydetailenddate: detailData.diarydetailenddate,
            diarydetailentityName: detailData.diarydetailentityName,
          });
        } else {
          setSelectedDetailItem(item);
        }
      } else {
        setSelectedDetailItem(item);
      }
    } catch (error) {
      console.error("Error fetching detail data:", error);
      setSelectedDetailItem(item);
    } finally {
      setDetailLoading(false);
    }
  };

  // Activity group state
  const [activityGroups, setActivityGroups] = useState<
    { id: number; name: string; attachmentId?: number; image?: string; activities: { id: number; name: string }[] }[]
  >([]);
  const [selectedActivityGroup, setSelectedActivityGroup] =
    useState<string>("");
  const [selectedAttachmentId, setSelectedAttachmentId] = useState<number | undefined>(undefined);
  const [isLoadingActivityGroups, setIsLoadingActivityGroups] = useState(false);
  
  // Consumption types (activities) state
  const [consumptionTypes, setConsumptionTypes] = useState<
    { id: number; name: string; tableid?: string }[]
  >([]);
  const [selectedConsumptionType, setSelectedConsumptionType] = useState<string>("");
  const [selectedConsumptionTypeTableId, setSelectedConsumptionTypeTableId] = useState<string>("");
  const [isLoadingConsumptionTypes, setIsLoadingConsumptionTypes] = useState(false);

  // Cost centres state
  const [costCentres, setCostCentres] = useState<
    { id: number; name: string }[]
  >([]);
  const [selectedCostCentre, setSelectedCostCentre] = useState<string>("");
  const [isLoadingCostCentres, setIsLoadingCostCentres] = useState(false);

  // Bulk entry dialog state
  const [bulkEntryDialogOpen, setBulkEntryDialogOpen] = useState(false);
  const [bulkEntryActivityGroup, setBulkEntryActivityGroup] = useState<string>("");
  const [bulkEntryActivity, setBulkEntryActivity] = useState<string>("");

  // Unit of measurement state
  const [unitOfMeasurement, setUnitOfMeasurement] = useState<string>("");
  const [isLoadingUnit, setIsLoadingUnit] = useState(false);
  
  // Additional info results (suffixes for input fields)
  const [additionalInfoResults, setAdditionalInfoResults] = useState<{
    result: string;
    process: string;
    value?: string;
  }[]>([]);
  const [validation, setValidation] = useState({
    costCentre: { isValid: false, message: "" },
    startDate: { isValid: false, message: "" },
    endDate: { isValid: false, message: "" },
    consumptionType: { isValid: false, message: "" },
  });


  // Cookie-based authentication - no token setting needed
  // Cookies are automatically sent with requests
  useEffect(() => {
    console.log("DEBUG: Input page mounted with session:", session);
  }, [session]);
  // Set auth token when session changes
  useEffect(() => {
    if (session?.access_token) {
      console.log("DEBUG: Setting auth token in crudService");

      crudService.setAuthToken(session.access_token);
    } else {
      console.log("DEBUG: No access_token in session");
    }
  }, [session]);

  // Fetch activity groups from CRUD API (depends on selected entity relationship from context)
  useEffect(() => {
    const fetchActivityGroups = async () => {
      if (!session?.access_token || !selectedEntityId) return;

      setIsLoadingActivityGroups(true);
      try {
        console.log(
          "📡 Fetching activity groups for entity ID:",
          selectedEntityId,
        );
        const response = await crudService.callCrud({
          data: JSON.stringify([
            {
              RecordSet: "Data",
              TableName: "get_entitytyperelatemember",
              Action: "procedure",
              Fields: {
                Ent: selectedEntityId,
                Type: "Activity",
                Relationship: "uses",
                RelationshipB: "Member",
              },
            },
          ]),
          PageNo: "1",
          NoOfLines: "300",
          CrudMessage: "@CrudMessage",
        });

        console.log("📥 Activity groups response:", response);

        if (response?.Data && response.Data[0]?.JsonData) {
          const jsonData = JSON.parse(response.Data[0].JsonData);
          const tableData = jsonData.Data?.TableData || [];

          console.log("📊 Activity groups table data:", tableData);
          console.log(
            "📊 Activity groups table data length:",
            tableData.length,
          );

          // Extract activity groups from the response using activityGroupName
          // Only include items that have both activityGroupId and activityGroupName
          const groups = tableData
            .filter((item: any) => {
              const hasValidId = item.activityGroupId !== undefined && item.activityGroupId !== null;
              const hasValidName = item.activityGroupName && typeof item.activityGroupName === "string" && item.activityGroupName.trim() !== "";
              console.log(`📊 Filtering activity group - ID: ${item.activityGroupId}, Name: ${item.activityGroupName}, Valid: ${hasValidId && hasValidName}`);
              return hasValidId && hasValidName;
            })
            .map((item: any, index: number) => {
              console.log(`📊 Processing activity group ${index}:`, item);
              // Extract activities from the activity array
              const activities: { id: number; name: string }[] = [];
              if (item.activity && Array.isArray(item.activity)) {
                item.activity.forEach((activity: any) => {
                  if (activity.Id !== undefined && activity.Name && typeof activity.Name === "string" && activity.Name.trim() !== "") {
                    activities.push({
                      id: activity.Id,
                      name: activity.Name,
                    });
                  }
                });
              }
              return {
                id: item.activityGroupId,
                name: item.activityGroupName,
                attachmentId: undefined,
                image: undefined,
                activities: activities,
              };
            });

          console.log("✅ Setting activity groups:", groups);

          // Fetch all activity group images in one call using all activity group IDs
          if (groups.length > 0) {
            const activityGroupIds = groups.map((g: { id: number }) => g.id).join(',');
            console.log("📡 Fetching images for activity groups:", activityGroupIds);

            try {
              const imageResponse = await crudService.callCrud({
                data: JSON.stringify([
                  {
                    RecordSet: "ActivityImg",
                    TableName: "attachment",
                    Action: "readIn",
                    Fields: {
                      RelativeID: `(${activityGroupIds})`,
                    },
                  },
                ]),
                PageNo: "1",
                NoOfLines: "300",
                CrudMessage: "@CrudMessage",
              });

              console.log("📥 Activity images response:", JSON.stringify(imageResponse, null, 2));

              if (imageResponse?.Data && imageResponse.Data[0]?.JsonData) {
                const imageJsonData = JSON.parse(imageResponse.Data[0].JsonData);
                const imageTableData = imageJsonData.ActivityImg?.TableData || [];

                console.log("📊 Activity images table data:", JSON.stringify(imageTableData, null, 2));

                // Create a map of attachmentRelativeID -> image content
                const imageMap: { [key: number]: { attachmentId: number; image: string } } = {};
                imageTableData.forEach((item: any) => {
                  const relativeId = item.attachmentRelativeID;
                  if (relativeId && item.attachmentcontent) {
                    imageMap[relativeId] = {
                      attachmentId: item.attachmentId,
                      image: item.attachmentcontent,
                    };
                    console.log(`📊 Mapped image for activity group ${relativeId}: attachmentId=${item.attachmentId}`);
                  }
                });

                // Align images with activity groups using attachmentRelativeID
                groups.forEach((group: any) => {
                  if (imageMap[group.id]) {
                    group.attachmentId = imageMap[group.id].attachmentId;
                    group.image = imageMap[group.id].image;
                    console.log(`📊 Aligned image with activity group ${group.name}: attachmentId=${group.attachmentId}`);
                  }
                });
              }
            } catch (imageError) {
              console.error("❌ Error fetching activity group images:", imageError);
            }
          }

          setActivityGroups(groups);

          // Extract consumption types (activities) from the response
          // Activities are nested in the activity array within each activity group
          const allActivities: { id: number; name: string; tableid?: string }[] = [];
          tableData.forEach((item: any) => {
            if (item.activity && Array.isArray(item.activity)) {
              item.activity.forEach((activity: any) => {
                if (activity.Id !== undefined && activity.Name && typeof activity.Name === "string" && activity.Name.trim() !== "") {
                  allActivities.push({
                    id: activity.Id,
                    name: activity.Name,
                    tableid: activity.Id ? String(activity.Id) : undefined,
                  });
                }
              });
            }
          });

          console.log("✅ Setting consumption types (activities):", allActivities);
          setConsumptionTypes(allActivities);
        } else {
          console.warn("⚠️ No activity groups data found in response");
          setActivityGroups([]);
        }
      } catch (error) {
        console.error("❌ Error fetching activity groups:", error);
      } finally {
        setIsLoadingActivityGroups(false);
      }
    };

    fetchActivityGroups();
  }, [session?.access_token, selectedEntityId]);

  // Fetch cost centres from CRUD API
  useEffect(() => {
    const fetchCostCentres = async () => {
      if (!session?.access_token || !selectedEntityId) return;

      setIsLoadingCostCentres(true);
      try {
        console.log(
          "📡 Fetching cost centres for entity ID:",
          selectedEntityId,
        );
        const response = await crudService.callCrud({
          data: JSON.stringify([
            {
              RecordSet: "Address",
              TableName: "entityrelationship",
              Action: "readExact",
              Fields: {
                Entity: selectedEntityId,
                Relationship: "59298",
              },
            },
          ]),
          PageNo: "1",
          NoOfLines: "300",
          CrudMessage: "@CrudMessage",
        });

        console.log("📥 Cost centres response:", response);

        if (response?.Data && response.Data[0]?.JsonData) {
          const jsonData = JSON.parse(response.Data[0].JsonData);
          const tableData = jsonData.Address?.TableData || [];

          console.log("📊 Cost centres table data:", tableData);

          // Extract cost centres from the response using entityrelationshipEntityBName
          const centres = tableData
            .filter((item: any) => {
              const hasValidId = item.entityrelationshipId !== undefined && item.entityrelationshipId !== null;
              const hasValidName = item.entityrelationshipEntityBName && typeof item.entityrelationshipEntityBName === "string" && item.entityrelationshipEntityBName.trim() !== "";
              console.log(`📊 Filtering cost centre - ID: ${item.entityrelationshipId}, Name: ${item.entityrelationshipEntityBName}, Valid: ${hasValidId && hasValidName}`);
              return hasValidId && hasValidName;
            })
            .map((item: any, index: number) => {
              console.log(`📊 Processing cost centre ${index}:`, item);
              return {
                id: item.entityrelationshipId,
                name: item.entityrelationshipEntityBName,
              };
            });

          console.log("✅ Setting cost centres:", centres);
          setCostCentres(centres);
        } else {
          console.warn("⚠️ No cost centres data found in response");
          setCostCentres([]);
        }
      } catch (error) {
        console.error("❌ Error fetching cost centres:", error);
      } finally {
        setIsLoadingCostCentres(false);
      }
    };

    fetchCostCentres();
  }, [session?.access_token, selectedEntityId]);

  // Fetch unit of measurement when consumption type changes
  useEffect(() => {
    const fetchUnitOfMeasurement = async () => {
      if (!session?.access_token || !selectedConsumptionType) {
        setUnitOfMeasurement("");
        setAdditionalInfoResults([]);
        return;
      }

      setIsLoadingUnit(true);
      try {
        // Use the tableid from the selected consumption type
        const tableid = selectedConsumptionTypeTableId || "140634262";
        
        console.log(
          "📡 Fetching unit of measurement for consumption type:",
          selectedConsumptionType,
          "with tableid:",
          tableid
        );
        
        const response = await crudService.callCrud({
          data: JSON.stringify([
            {
              RecordSet: "Unit",
              TableName: "additionalinfo",
              Action: "readExact",
              Fields: {
                tableid: tableid,
              },
            },
          ]),
          PageNo: "1",
          NoOfLines: "300",
          CrudMessage: "@CrudMessage",
        });

        console.log("📥 Unit of measurement response:", response);

        if (response?.Data && response.Data[0]?.JsonData) {
          const jsonData = JSON.parse(response.Data[0].JsonData);
          console.log("📊 Parsed JSON data:", jsonData);
          
          const tableData = jsonData.Unit?.TableData || [];
          console.log("📊 Unit table data:", tableData);
          console.log("📊 Table data length:", tableData.length);

          // Find the unit with additionalinfoProcess = "diarydetailunit"
          const unitItem = tableData.find(
            (item: any) =>
              item.additionalinfoProcess === "diarydetailunit" &&
              item.additionalinfoResult &&
              typeof item.additionalinfoResult === "string" &&
              item.additionalinfoResult.trim() !== "",
          );

          console.log("📊 Found unit item:", unitItem);

          // Extract all additional info results for suffixes
          const allResults = tableData
            .filter(
              (item: any) =>
                item.additionalinfoResult &&
                typeof item.additionalinfoResult === "string" &&
                item.additionalinfoResult.trim() !== "",
            )
            .map((item: any) => ({
              result: item.additionalinfoResult,
              process: item.additionalinfoProcess,
              value: item.additionalinforuleactionvalue || undefined,
            }));
          
          console.log("📊 All additional info results:", allResults);
          setAdditionalInfoResults(allResults);

          if (unitItem) {
            console.log("✅ Setting unit of measurement:", unitItem.additionalinfoResult);
            setUnitOfMeasurement(unitItem.additionalinfoResult);
          } else {
            console.warn("⚠️ No unit found in response - checking all items:");
            tableData.forEach((item: any, index: number) => {
              console.log(`  Item ${index}:`, item.additionalinfoProcess, "->", item.additionalinfoResult);
            });
            setUnitOfMeasurement("");
          }
        } else {
          console.warn("⚠️ No unit data found in response - response structure:", response);
          setUnitOfMeasurement("");
          setAdditionalInfoResults([]);
        }
      } catch (error) {
        console.error("❌ Error fetching unit of measurement:", error);
        setUnitOfMeasurement("");
        setAdditionalInfoResults([]);
      } finally {
        setIsLoadingUnit(false);
      }
    };

    fetchUnitOfMeasurement();
  }, [session?.access_token, selectedConsumptionType, selectedEntityId, consumptionTypes, selectedConsumptionTypeTableId]);

  // Load input data when component mounts or tab changes
  useEffect(() => {
    console.log("Tab changed to:", selectedTab);
    if (selectedTab === "input-history") {
      console.log("Calling fetchInputData for input-history tab");
      fetchInputData();
    }
  }, [selectedTab]);

  // Initialize with empty data to prevent undefined errors
  useEffect(() => {
    if (!inputData || inputData.length === 0) {
      setInputData([]);
    }
  }, []);

  // Reset pagination when filters or search term change
  useEffect(() => {
    setCurrentPageHistory(1);
  }, [appliedStartDateHistory, appliedEndDateHistory, searchTerm]);

  useEffect(() => {
    setCurrentPageTrace(1);
  }, [appliedStartDateTrace, appliedEndDateTrace, searchTerm]);

  // Form state
  const [formData, setFormData] = useState({
    costCentre: "",
    startDate: "",
    endDate: "",
    consumptionType: "",
    monetaryValue: "",
    status: "",
    activityGroup: "",
  });

  // Upload tab state
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [excelPreviewFile, setExcelPreviewFile] = useState<File | null>(null);

  // Transform diary data for table display
  const transformedData = inputData.map((item: any) => {
    // Safely parse the diarystartdate
    let editDate = "N/A";
    if (item.diarystartdate) {
      try {
        const date = new Date(item.diarystartdate);
        if (!isNaN(date.getTime())) {
          editDate = date.toISOString().split("T")[0];
        }
      } catch (error) {
        console.warn("Invalid date format:", item.diarystartdate);
      }
    }

    // Parse documents if available
    let documents: string[] = [];
    if (item.diarydocuments) {
      try {
        documents = JSON.parse(item.diarydocuments);
      } catch (error) {
        console.warn("Invalid documents format:", item.diarydocuments);
      }
    }

    return {
      id: item.diaryid,
      name: item.diaryname || `Entry ${item.diaryid}`,
      editDate,
      dataCapturer: item.diaryentityownerName || `User ${item.diaryCreatedBy}`,
      activityType: item.diarytypeName || "Consumption",
      docs: documents.length,
      documents,
      status: item.diarystatusName || "pending",
      userName: item.diaryentityownerName || `User ${item.diaryCreatedBy}`,
      value: "",
      emissions: "",
      costUom: "",
      type: item.diaryentityName || "",
      activity: item.diaryname || "",
      notes: item.diarynotes || "",
      // Store original item for editing
      originalItem: item,
    };
  });

  const filteredData = transformedData
    .filter((row) => {
      // Filter by applied date range
      if (appliedStartDateHistory || appliedEndDateHistory) {
        const item = inputData.find((i: any) => i.diaryid === row.id);
        if (!item || !item.diarystartdate) return false;

        const itemDate = new Date(item.diarystartdate);
        if (isNaN(itemDate.getTime())) return false;

        if (appliedStartDateHistory) {
          const start = new Date(appliedStartDateHistory);
          start.setHours(0, 0, 0, 0); // Start of day
          if (itemDate < start) return false;
        }

        if (appliedEndDateHistory) {
          const end = new Date(appliedEndDateHistory);
          end.setHours(23, 59, 59, 999); // End of day
          if (itemDate > end) return false;
        }
      }
      return true;
    })
    .filter(
      (row) =>
        row.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.dataCapturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.activityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.value.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.emissions.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.costUom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        row.activity.toLowerCase().includes(searchTerm.toLowerCase()),
    );

  const calculateEmissions = (
    activityType: string,
    consumption: number,
    consumptionType: string,
  ): number => {
    // Simplified emission calculations based on activity type
    const emissionFactors: { [key: string]: number } = {
      "Stationary Fuels": 2.31, // kg CO2e per unit
      "Mobile Fuels": 2.68,
      "Fugitive Gas": 0.25,
      Process: 1.85,
      "Waste Water": 0.45,
      "Renewable Electricity": 0.02,
    };

    const factor = emissionFactors[activityType] || 1.0;
    return Math.round(consumption * factor * 100) / 100;
  };

  // Real-time validation
  const validateField = (field: string, value: string) => {
    switch (field) {
      case "activityType":
        const validActivityTypes = [
          "Stationary Fuels",
          "Mobile Fuels",
          "Fugitive Gas",
          "Process",
          "Waste Water",
          "Renewable Electricity",
        ];
        return {
          isValid: value.length > 0 && validActivityTypes.includes(value),
          message:
            value.length > 0 && !validActivityTypes.includes(value)
              ? "Please select a valid activity type"
              : "",
        };
      case "costCentre":
        return {
          isValid: value.length > 0,
          message: value.length === 0 ? "Cost centre is required" : "",
        };
      case "startDate":
        return {
          isValid: value.length > 0,
          message: value.length === 0 ? "Start date is required" : "",
        };
      case "endDate":
        return {
          isValid: value.length > 0 && value >= formData.startDate,
          message:
            value.length === 0
              ? "End date is required"
              : value < formData.startDate
                ? "End date must be after start date"
                : "",
        };
      case "consumptionType":
        return {
          isValid: value.length > 0,
          message: value.length === 0 ? "Consumption type is required" : "",
        };
      case "consumption":
        const numValue = parseFloat(value);
        return {
          isValid: !isNaN(numValue) && numValue > 0,
          message:
            isNaN(numValue) || numValue <= 0
              ? "Please enter a valid consumption value"
              : "",
        };
      default:
        return { isValid: true, message: "" };
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Update validation
    const fieldValidation = validateField(field, value);
    setValidation((prev) => ({
      ...prev,
      [field]: fieldValidation,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if all required fields are valid
    const requiredFields = [
      "costCentre",
      "startDate",
      "endDate",
      "consumptionType",
    ];
    const isFormValid = requiredFields.every(
      (field) => validation[field as keyof typeof validation]?.isValid,
    );

    if (!isFormValid) {
      showAlert("Please fill in all required fields correctly", "error");
      return;
    }

    setLoading(true);
    setSubmitSuccess(false);

    try {
      const payload = {
        costCentre: formData.costCentre,
        startDate: formData.startDate,
        endDate: formData.endDate,
        consumptionType: formData.consumptionType,
        monetaryValue: formData.monetaryValue
          ? parseFloat(formData.monetaryValue)
          : undefined,
        status: formData.status,
        entityRelationship: selectedEntityRelationship,
        activityGroup: selectedActivityGroup,
        notes: modalNotes.join("\n\n"),
        attachments: attachmentFiles.map((file) => file.name),
      };

      // Get current timestamp for capturedate
      const capturedate = new Date().toISOString().replace("T", " ").substring(0, 23);

      // Find the consumption type ID (type: 59279 for Consumption)
      const consumptionTypeId = "59279";
      // Find the status ID (status: 58585 for Submit)
      const statusId = "58585";

      // Payload 1: Create Diary entry
      const diaryRequest = {
        data: JSON.stringify([
          {
            RecordSet: "Diary",
            TableName: "diary",
            Action: "create",
            Fields: {
              entity: selectedEntityId || "140634167",
              startdate: formData.startDate,
              enddate: formData.endDate,
              type: consumptionTypeId,
              name: formData.consumptionType || "Activity",
              entityowner: session?.user?.id || "4",
              status: statusId,
              entitysupplier: selectedEntityRelationship || "140634501",
              capturedate: capturedate,
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      };

      console.log("DEBUG: Creating Diary entry", diaryRequest);
      const diaryResponse = await crudService.callCrud(diaryRequest);
      console.log("DEBUG: Diary created", diaryResponse);

      // Extract the created diary ID
      let diaryId = null;
      if (diaryResponse?.Data && diaryResponse.Data[0]?.JsonData) {
        const parsed = JSON.parse(diaryResponse.Data[0].JsonData);
        diaryId = parsed.Diary?.Id;
      }

      // Payload 2: Create DiaryDetail entry
      if (diaryId) {
        const diaryDetailRequest = {
          data: JSON.stringify([
            {
              RecordSet: "DiaryDetail",
              TableName: "diarydetail",
              Action: "create",
              Fields: {
                entity: selectedEntityId || "140634234",
                startdate: formData.startDate,
                enddate: formData.endDate,
                diary: String(diaryId),
                amount: formData.monetaryValue || "0",
                name: formData.consumptionType || "Activity",
                quantity: formData.monetaryValue || "0",
                unit: "58502",
                entitysupplier: selectedEntityRelationship || "140634503",
                capturedate: capturedate,
              },
            },
          ]),
          PageNo: "1",
          NoOfLines: "300",
          CrudMessage: "@CrudMessage",
        };

        console.log("DEBUG: Creating DiaryDetail entry", diaryDetailRequest);
        const diaryDetailResponse = await crudService.callCrud(diaryDetailRequest);
        console.log("DEBUG: DiaryDetail created", diaryDetailResponse);
      }

      // Payload 3: Fetch Consumption data (to refresh the list)
      const consumptionRequest = {
        data: '[{"RecordSet":"Consumption","TableName":"diary","Action":"readExact","Fields":{"type":"59279"}}]',
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      };
      const consumptionResponse = await crudService.callCrud(consumptionRequest);
      console.log("DEBUG: Consumption data fetched", consumptionResponse);

      // Payload 4: Fetch IH (Intensity Hours) data
      const ihRequest = {
        data: JSON.stringify([
          {
            RecordSet: "IH",
            TableName: "diary",
            Action: "readExact",
            Fields: {
              entitysupplier: selectedEntityRelationship || "140634501",
              type: consumptionTypeId,
            },
          },
        ]),
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      };
      const ihResponse = await crudService.callCrud(ihRequest);
      console.log("DEBUG: IH data fetched", ihResponse);

      // Payload 5: Fetch Unit data
      const unitRequest = {
        data: '[{"RecordSet":"Unit","TableName":"additionalinfo","Action":"readExact","Fields":{"tableid":"null"}}]',
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      };
      const unitResponse = await crudService.callCrud(unitRequest);
      console.log("DEBUG: Unit data fetched", unitResponse);

      // Refresh the input data list
      fetchInputData();

      setSubmitSuccess(true);
      showAlert("Data submitted successfully!", "success");
      setTimeout(() => setSubmitSuccess(false), 3000);

      // Reset form
      setFormData({
        costCentre: "",
        startDate: "",
        endDate: "",
        consumptionType: "",
        monetaryValue: "",
        status: "",
        activityGroup: "",
      });
      setSelectedActivityGroup("");
      setSelectedConsumptionType("");
      setSelectedConsumptionTypeTableId("");
      setSelectedCostCentre("");
      setUnitOfMeasurement("");
      setValidation({
        costCentre: { isValid: false, message: "" },
        startDate: { isValid: false, message: "" },
        endDate: { isValid: false, message: "" },
        consumptionType: { isValid: false, message: "" },
      });
      setEditingId(null);
      setModalNotes([]);
      setCurrentNoteInput("");
      setAttachmentFiles([]);
      // Refresh the input data list
      fetchInputData();
    } catch (error) {
      console.error("Submit error:", error);
      showAlert("Error: Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchInputData = async () => {
    console.log("DEBUG: fetchInputData called");
    try {
      console.log(
        "DEBUG: About to call crudService.callCrud for diary consumption data",
      );
      const crudRequest = {
        data: '[{"RecordSet":"Consumption","TableName":"diary","Action":"readExact","Fields":{"type":"59279"}}]',
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      };
      const response = await crudService.callCrud(crudRequest);
      console.log(
        "DEBUG: crudService.callCrud successful, response:",
        response,
      );

      // Parse the response
      if (
        response &&
        response.Data &&
        response.Data[0] &&
        response.Data[0].JsonData
      ) {
        const parsedData = JSON.parse(response.Data[0].JsonData);
        const consumptionData = parsedData.Consumption?.TableData || [];
        console.log("DEBUG: Parsed consumption data:", consumptionData);
        setInputData(consumptionData);
      } else {
        console.warn("DEBUG: Unexpected response format");
        setInputData([]);
      }
    } catch (error) {
      console.error("DEBUG: Fetch error:", error);
      setInputData([]); // Set empty array on error
    }
  };

  const fetchTraceData = async () => {
    console.log("DEBUG: fetchTraceData called");
    try {
      console.log(
        "DEBUG: About to call crudService.callCrud for diary consumption data (trace source)",
      );
      const crudRequest = {
        data: '[{"RecordSet":"Consumption","TableName":"diary","Action":"readExact","Fields":{"type":"59279"}}]',
        PageNo: "1",
        NoOfLines: "300",
        CrudMessage: "@CrudMessage",
      };
      const response = await crudService.callCrud(crudRequest);
      console.log(
        "DEBUG: crudService.callCrud successful for trace, response:",
        response,
      );

      // Parse the response
      if (
        response &&
        response.Data &&
        response.Data[0] &&
        response.Data[0].JsonData
      ) {
        const parsedData = JSON.parse(response.Data[0].JsonData);
        const consumptionData = parsedData.Consumption?.TableData || [];
        console.log(
          "DEBUG: Parsed consumption data for trace:",
          consumptionData,
        );
        setTraceData(consumptionData);
      } else {
        console.warn("DEBUG: Unexpected response format for trace");
        setTraceData([]);
      }
    } catch (error) {
      console.error("DEBUG: Trace fetch error:", error);
      setTraceData([]); // Set empty array on error
    }
  };

  const handleEdit = (item: any) => {
    // Populate the Enter Data form with the selected item's data
    setFormData({
      costCentre: item.diaryentityName || "",
      startDate: item.diarystartdate
        ? new Date(item.diarystartdate).toISOString().split("T")[0]
        : "",
      endDate: item.diaryenddate
        ? new Date(item.diaryenddate).toISOString().split("T")[0]
        : "",
      consumptionType: item.diarytypeName || "",
      monetaryValue: item.diarymonetaryvalue?.toString() || "",
      status: item.diarystatusName || "",
      activityGroup: item.activityGroupName || "",
    });
    setSelectedActivityGroup(item.activityGroupName || "");
    setSelectedConsumptionType(item.diarytypeName || "");
    // Set tableid if available in consumption types
    const selectedType1 = consumptionTypes.find(t => t.name === item.diarytypeName);
    if (selectedType1?.tableid) {
      setSelectedConsumptionTypeTableId(selectedType1.tableid);
    }
    setSelectedCostCentre(item.diaryentityName || "");
    setEditingId(item.diaryid);
    setSelectedTab("enter-data");
  };

  const handleEditForm = (item: InputData) => {
    setFormData({
      costCentre: item.costCentre,
      startDate: item.startDate,
      endDate: item.endDate,
      consumptionType: item.consumptionType,
      monetaryValue: item.monetaryValue?.toString() || "",
      status: item.status || "",
      activityGroup: (item as any).activityGroup || "",
    });
    setSelectedActivityGroup((item as any).activityGroup || "");
    setSelectedConsumptionType(item.consumptionType || "");
    // Set tableid if available in consumption types
    const selectedType2 = consumptionTypes.find(t => t.name === item.consumptionType);
    if (selectedType2?.tableid) {
      setSelectedConsumptionTypeTableId(selectedType2.tableid);
    }
    setSelectedCostCentre(item.costCentre || "");
    setEditingId(item.id);
    setSelectedTab("enter-data");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this diary entry?")) {
      console.log(
        "DEBUG: About to call crudService.callCrud for deleting diary entry",
        id,
      );
      try {
        const crudRequest = {
          data: `[{"RecordSet":"Consumption","TableName":"diary","Action":"delete","Fields":{"diaryid":"${id}"}}]`,
          PageNo: "1",
          NoOfLines: "1",
          CrudMessage: "@CrudMessage",
        };
        await crudService.callCrud(crudRequest);
        console.log("DEBUG: crudService.callCrud delete successful");
        fetchInputData(); // Refresh the list
      } catch (error) {
        console.error("DEBUG: Delete error:", error);
        alert("Error deleting diary entry");
      }
    }
  };

  const handleDownloadDocument = (documentName: string) => {
    // For now, show an alert with the document name
    // In a real implementation, this would download the file from the server
    alert(
      `Downloading document: ${documentName}\n\nNote: Document download functionality would be implemented here.`,
    );
  };

  const handleViewNotes = (notes: string) => {
    setSelectedNotes(notes);
    setNotesDialogOpen(true);
  };

  const handleViewDocuments = (documents: string[]) => {
    setSelectedDocuments(documents);
    setDocumentsDialogOpen(true);
  };

  const handleFilterHistory = () => {
    setAppliedStartDateHistory(startDateHistory);
    setAppliedEndDateHistory(endDateHistory);
  };

  const handleFilterTrace = () => {
    setAppliedStartDateTrace(startDateTrace);
    setAppliedEndDateTrace(endDateTrace);
  };

  const handleUploadFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter((file) => {
      const allowedTypes = [
        "application/pdf",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/json",
      ];
      return allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
    });

    if (validFiles.length !== files.length) {
      alert("Some files were skipped due to invalid type or size (max 10MB)");
    }

    setUploadFiles((prev) => [...prev, ...validFiles]);

    // Set Excel file for preview
    const excelFile = validFiles.find(f => 
      f.type === "application/vnd.ms-excel" || 
      f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    if (excelFile) {
      setExcelPreviewFile(excelFile);
    }
  };

  const handleFileDrop = (e: React.DragEvent<HTMLDivElement>) => {
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter((file) => {
      const allowedTypes = [
        "application/pdf",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/json",
      ];
      return allowedTypes.includes(file.type) && file.size <= 10 * 1024 * 1024;
    });

    if (validFiles.length !== files.length) {
      alert("Some files were skipped due to invalid type or size (max 10MB)");
    }

    setUploadFiles((prev) => [...prev, ...validFiles]);

    // Set Excel file for preview
    const excelFile = validFiles.find(f => 
      f.type === "application/vnd.ms-excel" || 
      f.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    if (excelFile) {
      setExcelPreviewFile(excelFile);
    }
  };

  // Handle attachment file drops in the Attachment Modal
  const handleAttachmentDrop = (files: File[]) => {
    const validFiles = files.filter((file) => {
      // Accept any file type, limit size to 10MB
      return file.size <= 10 * 1024 * 1024;
    });

    if (validFiles.length !== files.length) {
      alert("Some files were skipped due to size limit (max 10MB)");
    }

    setAttachmentFiles((prev) => [...prev, ...validFiles]);
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("DEBUG: handleUploadSubmit called, uploadFiles:", uploadFiles);
    if (uploadFiles.length === 0) {
      console.log("DEBUG: No files to upload, returning early");
      return;
    }

    setLoading(true);
    const uploadedFiles: string[] = [];

    try {
      console.log("DEBUG: Starting upload loop for", uploadFiles.length, "files");
      for (const file of uploadFiles) {
        console.log("DEBUG: Processing file:", file.name);
        try {
          // Read file content
          const fileContent = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsText(file);
          });

          // Parse CSV/Excel/JSON data (simplified - in real app would need proper parsing)
          let parsedData: any[] = [];
          if (file.type === "application/json") {
            parsedData = JSON.parse(fileContent);
          } else if (file.type === "text/csv") {
            // Simple CSV parsing - split by lines and commas
            const lines = fileContent.split("\n").filter((line) => line.trim());
            if (lines.length > 1) {
              const headers = lines[0].split(",").map((h) => h.trim());
              parsedData = lines.slice(1).map((line) => {
                const values = line.split(",").map((v) => v.trim());
                const obj: any = {};
                headers.forEach((header, i) => {
                  obj[header] = values[i] || "";
                });
                return obj;
              });
            }
          }

          // Format data for the procedure call using ~0~ ~1~ placeholders
          // The backend expects a specific format where each column gets a ~n~ placeholder
          console.log("Parsed data:", parsedData);

          const formattedRows = parsedData.map((row) => {
            const formattedRow: any = {};
            Object.keys(row).forEach((key, index) => {
              formattedRow[`~${index}~`] = row[key];
            });
            return formattedRow;
          });

          console.log("Formatted rows:", formattedRows);
          const inDataString = JSON.stringify(formattedRows);
          console.log("InData string:", inDataString);

          // Call the upload procedure
          const result = await crudService.callProcedure("sp_loadcarbon", {
            InData: inDataString,
            InEntity: "140634500", // This should probably be dynamic based on user/company
          });

          console.log("Upload procedure result:", result);
          uploadedFiles.push(`${file.name} (uploaded)`);
        } catch (apiError) {
          console.error("API upload failed for", file.name, apiError);

          // Fallback to localStorage for static export
          console.log("Using localStorage for file upload in static export");

          // Convert file to base64 for storage
          const fileData = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          // Store file info in localStorage
          const existingFiles = JSON.parse(
            localStorage.getItem("ecometrics_uploads") || "[]",
          );
          existingFiles.push({
            name: file.name,
            type: file.type,
            size: file.size,
            data: fileData,
            uploadedAt: new Date().toISOString(),
          });
          localStorage.setItem(
            "ecometrics_uploads",
            JSON.stringify(existingFiles),
          );

          uploadedFiles.push(`${file.name} (stored locally)`);
        }
      }

      if (uploadedFiles.length > 0) {
        console.log("DEBUG: Upload successful, showing alert for:", uploadedFiles);
        showAlert(`Upload successful:\n${uploadedFiles.join("\n")}`, "success");
        // Reset form
        setUploadFiles([]);
        setExcelPreviewFile(null);
      } else {
        console.log("DEBUG: No files uploaded successfully");
      }
    } catch (error) {
      console.error("Upload submit error:", error);
      showAlert("Upload failed. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Handle Excel preview data submission (selected rows from preview)
  const handleExcelPreviewSubmit = async (data: {
    headers: string[];
    rows: any[];
    selectedRows: number[];
  }) => {
    console.log("DEBUG: handleExcelPreviewSubmit called with data:", data);

    if (data.selectedRows.length === 0) {
      showAlert("Please select at least one row to submit", "error");
      return;
    }

    setLoading(true);

    try {
      // Get the selected rows data
      const selectedRowsData = data.selectedRows.map((rowIndex) => data.rows[rowIndex]);

      console.log("DEBUG: Selected rows data:", selectedRowsData);

      // Format data for the procedure call using ~n~ placeholders
      const formattedRows = selectedRowsData.map((row) => {
        const formattedRow: any = {};
        row.forEach((value: any, index: number) => {
          formattedRow[`~${index}~`] = value;
        });
        return formattedRow;
      });

      const inDataString = JSON.stringify(formattedRows);
      console.log("DEBUG: InData string:", inDataString);

      // Call the upload procedure
      const result = await crudService.callProcedure("sp_loadcarbon", {
        InData: inDataString,
        InEntity: "140634500", // This should probably be dynamic based on user/company
      });

      console.log("DEBUG: Upload procedure result:", result);
      showAlert(`Successfully submitted ${data.selectedRows} row(s)`, "success");

      // Reset form
      setUploadFiles([]);
      setExcelPreviewFile(null);
    } catch (error) {
      console.error("DEBUG: Excel preview submit error:", error);
      showAlert("Failed to submit data. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Close Excel preview
  const handleCloseExcelPreview = () => {
    setExcelPreviewFile(null);
  };

  return (
    <div className="min-h-screen relative">
      {/* 3D Background */}
      <Suspense
        fallback={
          <div className="fixed inset-0 -z-10">
            <div className="w-full h-full bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50" />
          </div>
        }
      >
        <ThreeBackground />
      </Suspense>

      {/* Main Content */}
      <div className="relative z-10 p-4 sm:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Input Management
            </h1>
            <p className="text-lg text-gray-600">
              Enter, upload, and track your emissions data
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <Tabs
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-4 mb-6 justify-center backdrop-blur-md bg-white/20 border border-white/30">
                <TabsTrigger
                  value="enter-data"
                  className="flex flex-row items-center gap-2 px-4 data-[state=active]:bg-white/30 data-[state=active]:text-emerald-700"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold">1</span>
                  Capture Activity
                </TabsTrigger>
                <TabsTrigger
                  value="capture-bulk"
                  className="flex flex-row items-center gap-2 px-4 data-[state=active]:bg-white/30 data-[state=active]:text-blue-700"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold">2</span>
                  Capture Bulk
                </TabsTrigger>
                <TabsTrigger
                  value="capture-file"
                  className="flex flex-row items-center gap-2 px-4 data-[state=active]:bg-white/30 data-[state=active]:text-purple-700"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white text-xs font-bold">3</span>
                  Capture File
                </TabsTrigger>
                <TabsTrigger
                  value="input-history"
                  className="flex flex-row items-center gap-2 px-4 data-[state=active]:bg-white/30 data-[state=active]:text-amber-700"
                >
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600 text-white text-xs font-bold">4</span>
                  Input History
                </TabsTrigger>
              </TabsList>

              {/* MUI Snackbar Alert - Bottom, Upper Most Layer */}
              <Snackbar
                open={alertDialogOpen}
                autoHideDuration={5000}
                onClose={() => setAlertDialogOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                sx={{
                  "& .MuiSnackbarContent-root": {
                    zIndex: 99999,
                  },
                }}
              >
                <Alert
                  onClose={() => setAlertDialogOpen(false)}
                  severity={alertType}
                  variant="filled"
                  sx={{
                    width: "100%",
                    minWidth: 300,
                    zIndex: 99999,
                  }}
                >
                  {alertType === "success" ? "✓ " : "✕ "}
                  {alertMessage}
                </Alert>
              </Snackbar>

              <AnimatePresence mode="wait">
                <TabsContent
                  value="enter-data"
                  key="enter-data"
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="backdrop-blur-md bg-white/20 border border-white/30 shadow-xl">
                      <CardHeader className="bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 text-white rounded-t-lg p-3 backdrop-blur-sm">
                        <CardTitle>
                          {editingId ? "Edit Data" : "Enter Data"}
                        </CardTitle>
                        <CardDescription className="text-emerald-100">
                          {editingId
                            ? "Update your emissions data here."
                            : "Manually enter your emissions data here."}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="backdrop-blur-sm">
                        <form
                          onSubmit={handleFormSubmit}
                          className="space-y-4 max-w-md mx-auto"
                        >
                          <div className="flex flex-col gap-4">
                            {/* Activity Group Widgets */}
                            <div className="w-full">
                              <div className="flex flex-wrap gap-3">
                                {isLoadingActivityGroups ? (
                                  <span className="text-sm text-gray-500">
                                    Loading activity groups...
                                  </span>
                                ) : activityGroups.length === 0 ? (
                                  <span className="text-sm text-gray-500">
                                    no data found
                                  </span>
                                ) : (
                                  activityGroups.map((group) => {
                                    const isSelected = selectedActivityGroup === group.name;
                                    return (
                                      <div
                                        key={group.id}
                                        onClick={() => {
                                          setSelectedActivityGroup(group.name);
                                          handleInputChange(
                                            "activityGroup",
                                            group.name,
                                          );
                                        }}
                                        className={`
                                          flex flex-col items-center justify-center
                                          w-20 h-24 p-1 rounded-lg cursor-pointer
                                          transition-all duration-200 border-2
                                          ${isSelected
                                            ? "border-emerald-600 bg-emerald-50 shadow-md"
                                            : "border-gray-200 bg-white hover:border-emerald-300 hover:shadow-sm"
                                          }
                                        `}
                                      >
                                        {/* Image area - always shows image if available */}
                                        <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
                                          {group.image ? (
                                            <img
                                              src={`data:image/png;base64,${group.image}`}
                                              alt={`${group.name} diagram`}
                                              className="w-full h-full object-contain"
                                            />
                                          ) : (
                                            <span className="text-gray-400 text-xs">
                                              No image
                                            </span>
                                          )}
                                        </div>
                                        {/* Activity group name below image */}
                                        <span className="text-xs font-medium text-center line-clamp-1 mt-1">
                                          {group.name}
                                        </span>
                                      </div>
                                    );
                                  })
                                )}
                              </div>
                            </div>
                            {/* Show form fields only after activity group is selected */}
                            {selectedActivityGroup ? (
                              <>
                                <div className="flex gap-4">
                                  <div className="flex-1">
                                    <AnimatedFormField
                                      id="start-date"
                                      label="Start"
                                      type="date"
                                      placeholder="Start"
                                      value={formData.startDate}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "startDate",
                                          e.target.value,
                                        )
                                      }
                                      required
                                      validation={validation.startDate}
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <AnimatedFormField
                                      id="end-date"
                                      label="End"
                                      type="date"
                                      placeholder="End"
                                      value={formData.endDate}
                                      onChange={(e) =>
                                        handleInputChange("endDate", e.target.value)
                                      }
                                      required
                                      validation={validation.endDate}
                                    />
                                  </div>
                                </div>
                                <div className="w-full">
                                  <Label htmlFor="cost-centre" className="block text-sm font-medium text-gray-700 mb-1">
                                    Cost Centre
                                  </Label>
                                  <Select
                                    value={selectedCostCentre}
                                    onValueChange={(value) => {
                                      setSelectedCostCentre(value);
                                      handleInputChange("costCentre", value);
                                    }}
                                  >
                                    <SelectTrigger className={validation.costCentre.message ? "border-red-500" : ""}>
                                      <SelectValue placeholder="Select cost centre" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {isLoadingCostCentres ? (
                                        <SelectItem value="loading" disabled>
                                          Loading...
                                        </SelectItem>
                                      ) : costCentres.length === 0 ? (
                                        <SelectItem value="no-data" disabled>
                                          No data found
                                        </SelectItem>
                                      ) : (
                                        costCentres.map((centre) => (
                                          <SelectItem key={centre.id} value={centre.name}>
                                            {centre.name}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                  {validation.costCentre.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {validation.costCentre.message}
                                    </p>
                                  )}
                                </div>
                                <div className="w-full">
                                  <Label htmlFor="consumption-type" className="block text-sm font-medium text-gray-700 mb-1">
                                    Consumption Type
                                  </Label>
                                  <Select
                                    value={selectedConsumptionType}
                                    onValueChange={(value) => {
                                      setSelectedConsumptionType(value);
                                      // Clear the tableid when selection changes to ensure fresh fetch
                                      setSelectedConsumptionTypeTableId("");
                                      // Also set the tableid for the selected consumption type
                                      const selectedType = consumptionTypes.find(t => t.name === value);
                                      if (selectedType?.tableid) {
                                        setSelectedConsumptionTypeTableId(selectedType.tableid);
                                      }
                                      handleInputChange("consumptionType", value);
                                    }}
                                  >
                                    <SelectTrigger className={validation.consumptionType.message ? "border-red-500" : ""}>
                                      <SelectValue placeholder="Select consumption type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {isLoadingConsumptionTypes ? (
                                        <SelectItem value="loading" disabled>
                                          Loading...
                                        </SelectItem>
                                      ) : consumptionTypes.length === 0 ? (
                                        <SelectItem value="no-data" disabled>
                                          No data found
                                        </SelectItem>
                                      ) : (
                                        consumptionTypes.map((type) => (
                                          <SelectItem key={type.id} value={type.name}>
                                            {type.name}
                                          </SelectItem>
                                        ))
                                      )}
                                    </SelectContent>
                                  </Select>
                                  {validation.consumptionType.message && (
                                    <p className="text-red-500 text-xs mt-1">
                                      {validation.consumptionType.message}
                                    </p>
                                  )}
                                </div>
                                <div className="w-full">
                                  <label htmlFor="monetary-value" className="block text-sm font-medium text-gray-700 mb-1">
                                    Value
                                  </label>
                                  <div className="relative">
                                    <input
                                      id="monetary-value"
                                      type="number"
                                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 pr-20"
                                      placeholder="Enter value"
                                      value={formData.monetaryValue}
                                      onChange={(e) =>
                                        handleInputChange(
                                          "monetaryValue",
                                          e.target.value,
                                        )
                                      }
                                      step="1"
                                    />
                                    {unitOfMeasurement ? (
                                      <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">
                                        {unitOfMeasurement}
                                      </span>
                                    ) : null}
                                  </div>
                                </div>
                                <div className="w-full">
                                  <Label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                  </Label>
                                  <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleInputChange("status", value)}
                                  >
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Not-started">Not-started</SelectItem>
                                      <SelectItem value="In-Progress">In-Progress</SelectItem>
                                      <SelectItem value="Completed">Completed</SelectItem>
                                      <SelectItem value="open">Open</SelectItem>
                                      <SelectItem value="closed">Closed</SelectItem>
                                      <SelectItem value="submit">Submit</SelectItem>
                                      <SelectItem value="approved">Approved</SelectItem>
                                      <SelectItem value="rejected">Rejected</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex gap-2 justify-center">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setAttachmentModalOpen(true)}
                                    className="backdrop-blur-md bg-white/20 border-white/30 hover:bg-white/30"
                                    title="Add attachments"
                                  >
                                    <AttachFile className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="icon"
                                    onClick={() => setNotesModalOpen(true)}
                                    className="backdrop-blur-md bg-white/20 border-white/30 hover:bg-white/30"
                                    title="Add notes"
                                  >
                                    <Note className="h-4 w-4" />
                                  </Button>
                                </div>
                                <div className="w-full flex justify-center">
                                  <AnimatedSubmitButton
                                    type="submit"
                                    disabled={loading}
                                    loading={loading}
                                    success={submitSuccess}
                                    onClick={() => {}}
                                  >
                                    {editingId ? "Update" : "Submit"}
                                  </AnimatedSubmitButton>
                                </div>
                              </>
                            ) : (
                              <div className="w-full py-8 text-center">
                                <p className="text-gray-500 text-sm">
                                  Select an activity group above to enter data
                                </p>
                              </div>
                            )}
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Capture Bulk Tab */}
                <TabsContent value="capture-bulk" key="capture-bulk">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="backdrop-blur-md bg-white/20 border-white/30 shadow-xl">
                      <CardHeader className="bg-gradient-to-r from-blue-500/80 to-blue-600/80 text-white rounded-t-lg p-3 backdrop-blur-sm">
                        <CardTitle>Capture Bulk</CardTitle>
                        <CardDescription className="text-blue-100">
                          Enter multiple emissions data entries at once.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="backdrop-blur-sm">
                        {/* MUI Accordions for Activity Groups */}
                        {isLoadingActivityGroups ? (
                          <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                            <span className="ml-3 text-gray-600">Loading activity groups...</span>
                          </div>
                        ) : activityGroups.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <p>No activity groups found</p>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {activityGroups.map((group) => (
                              <Accordion 
                                key={group.id}
                                className="backdrop-blur-sm bg-white/50 border border-white/30 shadow-sm"
                              >
                                <AccordionSummary
                                  expandIcon={<ExpandMore className="text-blue-600" />}
                                  className="hover:bg-white/30 transition-colors rounded-t-lg"
                                >
                                  <div className="flex items-center gap-3">
                                    {group.image && (
                                      <img
                                        src={`data:image/png;base64,${group.image}`}
                                        alt={`${group.name} diagram`}
                                        className="w-8 h-8 object-contain"
                                      />
                                    )}
                                    <span className="font-medium text-gray-800">
                                      {group.name}
                                    </span>
                                  </div>
                                </AccordionSummary>
                                <AccordionDetails className="bg-white/30 rounded-b-lg">
                                  <div className="p-4">
                                    <p className="text-sm font-medium text-gray-700 mb-3">
                                      Activities:
                                    </p>
                                    {group.activities && group.activities.length > 0 ? (
                                      <div className="space-y-2">
                                        {group.activities.map((activity) => (
                                          <div
                                            key={activity.id}
                                            className="flex items-center justify-between p-3 bg-white/50 rounded-lg cursor-pointer hover:bg-white/70 transition-colors border border-gray-200"
                                            onClick={() => {
                                              setBulkEntryActivityGroup(group.name);
                                              setBulkEntryActivity(activity.name);
                                              setBulkEntryDialogOpen(true);
                                            }}
                                          >
                                            <span className="text-sm text-gray-800">
                                              {activity.name}
                                            </span>
                                            <span className="text-xs text-blue-600">
                                              Select →
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500">
                                        No activities available
                                      </p>
                                    )}
                                  </div>
                                </AccordionDetails>
                              </Accordion>
                            ))}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Capture File Tab */}
                <TabsContent value="capture-file" key="capture-file">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="backdrop-blur-md bg-white/20 border-white/30 shadow-xl">
                      <CardHeader className="bg-gradient-to-r from-purple-500/80 to-purple-600/80 text-white rounded-t-lg p-3 backdrop-blur-sm">
                        <CardTitle>Capture File</CardTitle>
                        <CardDescription className="text-purple-100">
                          Upload and process file data for emissions tracking.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="backdrop-blur-sm">
                        <form onSubmit={handleUploadSubmit} className="space-y-4">
                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">
                              Excel Files
                            </Label>
                            <motion.div
                              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                                isDragging
                                  ? "border-purple-400 bg-purple-50/30"
                                  : "border-gray-300 bg-gray-50 hover:border-gray-400 hover:bg-gray-100"
                              }`}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onDragOver={(e) => {
                                e.preventDefault();
                                setIsDragging(true);
                              }}
                              onDragLeave={() => setIsDragging(false)}
                              onDrop={(e) => {
                                e.preventDefault();
                                setIsDragging(false);
                                handleFileDrop(e);
                              }}
                            >
                              <div>
                                <UploadFile className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                                <p className="text-sm text-gray-700 mb-4 font-medium">
                                  Drag and drop files here, or click to select
                                </p>
                                <FormInput
                                  id="capture-file-input"
                                  type="file"
                                  accept=".xlsx,.xls,.csv"
                                  multiple
                                  onChange={handleUploadFileSelect}
                                  className="hidden"
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() =>
                                    document
                                      .getElementById("capture-file-input")
                                      ?.click()
                                  }
                                  className="backdrop-blur-md bg-white/20 border-gray-300"
                                >
                                  Choose Files
                                </Button>
                              </div>
                            </motion.div>
                            <p className="text-sm text-gray-600">
                              Supported: Excel and CSV files (max 10MB each)
                            </p>

                            {/* Selected Files List */}
                            {uploadFiles.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-sm font-medium text-gray-700">
                                  Selected Files ({uploadFiles.length}):
                                </p>
                                <div className="space-y-2 max-h-40 overflow-y-auto">
                                  {uploadFiles.map((file, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                    >
                                      <div className="flex items-center gap-2">
                                        <UploadFile className="h-4 w-4 text-purple-600" />
                                        <span className="text-sm text-gray-700">{file.name}</span>
                                        <span className="text-xs text-gray-500">
                                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                        </span>
                                      </div>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          setUploadFiles((prev) =>
                                            prev.filter((_, i) => i !== index)
                                          )
                                        }
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        Remove
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Excel Preview Component */}
                            {excelPreviewFile && (
                              <div className="mt-4">
                                <ExcelPreview
                                  file={excelPreviewFile}
                                  onClose={handleCloseExcelPreview}
                                  onSubmit={handleExcelPreviewSubmit}
                                />
                              </div>
                            )}
                          </div>
                             {/* Action Buttons - hide when Excel preview is shown */}
                             {!excelPreviewFile && (
                               <div className="flex justify-end gap-2">
                                 <Button
                                   type="button"
                                   variant="outline"
                                   onClick={() => setUploadFiles([])}
                                   disabled={uploadFiles.length === 0}
                                 >
                                   Clear All
                                 </Button>
                                 <Button
                                   type="submit"
                                   disabled={uploadFiles.length === 0 || loading}
                                   className="bg-purple-600 hover:bg-purple-700"
                                 >
                                   {loading ? "Uploading..." : "Upload Files"}
                                 </Button>
                               </div>
                             )}
                         </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Notes Modal for Enter Data tab */}
                <Dialog open={notesModalOpen} onOpenChange={setNotesModalOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add Notes</DialogTitle>
                      <DialogDescription>
                        Add multiple notes for this entry
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        <textarea
                          value={currentNoteInput}
                          onChange={(e) => setCurrentNoteInput(e.target.value)}
                          placeholder="Enter a note..."
                          className="flex-1 min-h-[80px] p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 resize-y"
                        />
                        <Button
                          type="button"
                          onClick={() => {
                            if (currentNoteInput.trim()) {
                              setModalNotes((prev) => [
                                ...prev,
                                currentNoteInput.trim(),
                              ]);
                              setCurrentNoteInput("");
                            }
                          }}
                          disabled={!currentNoteInput.trim()}
                          className="self-end"
                        >
                          Add
                        </Button>
                      </div>
                      {modalNotes.length > 0 && (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          <p className="text-sm font-medium text-gray-700">
                            Notes ({modalNotes.length}):
                          </p>
                          {modalNotes.map((note, index) => (
                            <div
                              key={index}
                              className="flex items-start justify-between p-3 bg-gray-50 rounded"
                            >
                              <p className="text-sm text-gray-700 flex-1 pr-2">
                                {note}
                              </p>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() =>
                                  setModalNotes((prev) =>
                                    prev.filter((_, i) => i !== index),
                                  )
                                }
                                className="text-red-600 hover:text-red-800 shrink-0"
                              >
                                Remove
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setNotesModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setNotesModalOpen(false)}
                      >
                        Done
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Attachment Modal for Enter Data tab */}
                <Dialog open={attachmentModalOpen} onOpenChange={setAttachmentModalOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AttachFile className="h-5 w-5" />
                        Add Attachments
                      </DialogTitle>
                      <DialogDescription>
                        Upload files for this entry (no preview)
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* File Upload Area */}
                      <div
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                          isDragging
                            ? "border-purple-400 bg-purple-50"
                            : "border-gray-300 hover:border-gray-400"
                        }`}
                        onDragOver={(e) => {
                          e.preventDefault();
                          setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={(e) => {
                          e.preventDefault();
                          setIsDragging(false);
                          const files = Array.from(e.dataTransfer.files);
                          handleAttachmentDrop(files);
                        }}
                      >
                        <AttachFile className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                        <p className="text-sm text-gray-700 mb-2">
                          Drag and drop files here, or click to select
                        </p>
                        <input
                          type="file"
                          id="attachment-input"
                          multiple
                          className="hidden"
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            handleAttachmentDrop(files);
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            document.getElementById("attachment-input")?.click()
                          }
                        >
                          Choose Files
                        </Button>
                      </div>

                      {/* Selected Files List */}
                      {attachmentFiles.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">
                            Selected Files ({attachmentFiles.length}):
                          </p>
                          <div className="space-y-2 max-h-60 overflow-y-auto">
                            {attachmentFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded"
                              >
                                <div className="flex items-center gap-2">
                                  <AttachFile className="h-4 w-4 text-purple-600" />
                                  <span className="text-sm text-gray-700">{file.name}</span>
                                  <span className="text-xs text-gray-500">
                                    ({(file.size / 1024 / 1024).toFixed(2)} MB)
                                  </span>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    setAttachmentFiles((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    )
                                  }
                                  className="text-red-600 hover:text-red-800"
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setAttachmentModalOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setAttachmentModalOpen(false)}
                      >
                        Done
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Detail Dialog for Input History */}
                <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
                  <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Entry Details</DialogTitle>
                      <DialogDescription>
                        View all details for this entry
                      </DialogDescription>
                    </DialogHeader>
                    {selectedDetailItem && (
                      <div className="space-y-4">
                        {detailLoading ? (
                          <div className="flex justify-center items-center gap-2 py-8">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                            <span className="text-emerald-600 font-medium">
                              Loading details...
                            </span>
                          </div>
                        ) : (
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-emerald-50">
                                <TableHead className="w-1/3">Field</TableHead>
                                <TableHead>Value</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">Activity Group</TableCell>
                                <TableCell>{selectedDetailItem.diarydetailname || selectedDetailItem.diaryname || "N/A"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Activity Type</TableCell>
                                <TableCell>{selectedDetailItem.diarydetailtypeName || "N/A"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Date Captured</TableCell>
                                <TableCell>{selectedDetailItem.editDate || "N/A"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Capturer Name</TableCell>
                                <TableCell>{selectedDetailItem.diaryentityownerName || "N/A"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Status</TableCell>
                                <TableCell>
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      selectedDetailItem.diarystatusName === "Approved"
                                        ? "bg-green-100 text-green-800"
                                        : selectedDetailItem.diarystatusName === "Rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-yellow-100 text-yellow-800"
                                    }`}
                                  >
                                    {selectedDetailItem.diarystatusName || "Pending"}
                                  </span>
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Quantity</TableCell>
                                <TableCell>{selectedDetailItem.diarydetailquantity || selectedDetailItem.quantity || "N/A"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Amount</TableCell>
                                <TableCell>{selectedDetailItem.diarydetailamount || selectedDetailItem.amount || "N/A"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">UOM</TableCell>
                                <TableCell>{selectedDetailItem.diarydetailunitName || selectedDetailItem.uomname || "N/A"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Cost Centre</TableCell>
                                <TableCell>{selectedDetailItem.diarydetailentityName || selectedDetailItem.diaryentityName || "N/A"}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">Start Date</TableCell>
                                <TableCell>
                                  {selectedDetailItem.diarydetailstartdate
                                    ? new Date(selectedDetailItem.diarydetailstartdate).toLocaleDateString()
                                    : "N/A"}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell className="font-medium">End Date</TableCell>
                                <TableCell>
                                  {selectedDetailItem.diarydetailenddate
                                    ? new Date(selectedDetailItem.diarydetailenddate).toLocaleDateString()
                                    : "N/A"}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        )}
                      </div>
                    )}
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setDetailDialogOpen(false)}
                      >
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Attachments Dialog for Input History */}
                <Dialog open={historyAttachmentDialogOpen} onOpenChange={setHistoryAttachmentDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <AttachFile className="h-5 w-5" />
                        Attachments
                      </DialogTitle>
                      <DialogDescription>
                        View attachments for this entry
                      </DialogDescription>
                    </DialogHeader>
                    {selectedHistoryAttachmentItem && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                          <div className="flex flex-col items-center justify-center">
                            <AttachFile className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              No attachments available
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setHistoryAttachmentDialogOpen(false)}
                      >
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Notes Dialog for Input History */}
                <Dialog open={historyNotesDialogOpen} onOpenChange={setHistoryNotesDialogOpen}>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2">
                        <Note className="h-5 w-5" />
                        Notes
                      </DialogTitle>
                      <DialogDescription>
                        View notes for this entry
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      {historyEntryNotes.length > 0 ? (
                        <div className="space-y-2 max-h-60 overflow-y-auto">
                          {historyEntryNotes.map((note, index) => (
                            <div
                              key={index}
                              className="p-3 bg-gray-50 rounded"
                            >
                              <p className="text-sm text-gray-700">{note}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50">
                          <div className="flex flex-col items-center justify-center">
                            <Note className="w-8 h-8 mb-3 text-gray-400" />
                            <p className="text-sm text-gray-500">
                              No notes available
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    <DialogFooter>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setHistoryNotesDialogOpen(false)}
                      >
                        Close
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>

                {/* Bulk Entry Dialog */}
                <Dialog open={bulkEntryDialogOpen} onOpenChange={setBulkEntryDialogOpen}>
                  <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Enter Data</DialogTitle>
                      <DialogDescription>
                        Enter emissions data for {bulkEntryActivity}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleFormSubmit} className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <AnimatedFormField
                            id="bulk-start-date"
                            label="Start"
                            type="date"
                            placeholder="Start"
                            value={formData.startDate}
                            onChange={(e) =>
                              handleInputChange("startDate", e.target.value)
                            }
                            required
                            validation={validation.startDate}
                          />
                        </div>
                        <div className="flex-1">
                          <AnimatedFormField
                            id="bulk-end-date"
                            label="End"
                            type="date"
                            placeholder="End"
                            value={formData.endDate}
                            onChange={(e) =>
                              handleInputChange("endDate", e.target.value)
                            }
                            required
                            validation={validation.endDate}
                          />
                        </div>
                      </div>
                      <div className="w-full">
                        <Label htmlFor="bulk-cost-centre" className="block text-sm font-medium text-gray-700 mb-1">
                          Cost Centre
                        </Label>
                        <Select
                          value={selectedCostCentre}
                          onValueChange={(value) => {
                            setSelectedCostCentre(value);
                            handleInputChange("costCentre", value);
                          }}
                        >
                          <SelectTrigger className={validation.costCentre.message ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select cost centre" />
                          </SelectTrigger>
                          <SelectContent>
                            {isLoadingCostCentres ? (
                              <SelectItem value="loading" disabled>
                                Loading...
                              </SelectItem>
                            ) : costCentres.length === 0 ? (
                              <SelectItem value="no-data" disabled>
                                No data found
                              </SelectItem>
                            ) : (
                              costCentres.map((centre) => (
                                <SelectItem key={centre.id} value={centre.name}>
                                  {centre.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        {validation.costCentre.message && (
                          <p className="text-red-500 text-xs mt-1">
                            {validation.costCentre.message}
                          </p>
                        )}
                      </div>
                      <div className="w-full">
                        <Label htmlFor="bulk-consumption-type" className="block text-sm font-medium text-gray-700 mb-1">
                          Consumption Type
                        </Label>
                        <Select
                          value={bulkEntryActivity}
                          onValueChange={(value) => {
                            setBulkEntryActivity(value);
                            setSelectedConsumptionType(value);
                            // Clear the tableid when selection changes to ensure fresh fetch
                            setSelectedConsumptionTypeTableId("");
                            // Also set the tableid for the selected consumption type
                            const selectedTypeBulk = consumptionTypes.find(t => t.name === value);
                            if (selectedTypeBulk?.tableid) {
                              setSelectedConsumptionTypeTableId(selectedTypeBulk.tableid);
                            }
                            handleInputChange("consumptionType", value);
                          }}
                        >
                          <SelectTrigger className={validation.consumptionType.message ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select consumption type" />
                          </SelectTrigger>
                          <SelectContent>
                            {consumptionTypes.map((type) => (
                              <SelectItem key={type.id} value={type.name}>
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {validation.consumptionType.message && (
                          <p className="text-red-500 text-xs mt-1">
                            {validation.consumptionType.message}
                          </p>
                        )}
                      </div>
                      <div className="w-full">
                        <label htmlFor="bulk-monetary-value" className="block text-sm font-medium text-gray-700 mb-1">
                          Value
                        </label>
                        <div className="relative">
                          <input
                            id="bulk-monetary-value"
                            type="number"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 pr-12"
                            placeholder="Enter value"
                            value={formData.monetaryValue}
                            onChange={(e) =>
                              handleInputChange(
                                "monetaryValue",
                                e.target.value,
                              )
                            }
                            step="0.01"
                          />
                          {unitOfMeasurement && (
                            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm text-gray-500">
                              {unitOfMeasurement}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="w-full">
                        <Label htmlFor="bulk-status" className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </Label>
                        <Select
                          value={formData.status}
                          onValueChange={(value) => handleInputChange("status", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Not-started">Not-started</SelectItem>
                            <SelectItem value="In-Progress">In-Progress</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                            <SelectItem value="open">Open</SelectItem>
                            <SelectItem value="closed">Closed</SelectItem>
                            <SelectItem value="submit">Submit</SelectItem>
                            <SelectItem value="approved">Approved</SelectItem>
                            <SelectItem value="rejected">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <DialogFooter>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setBulkEntryDialogOpen(false);
                            // Reset form fields
                            setFormData((prev) => ({
                              ...prev,
                              startDate: "",
                              endDate: "",
                              monetaryValue: "",
                              status: "",
                            }));
                            setSelectedCostCentre("");
                            setValidation({
                              costCentre: { isValid: false, message: "" },
                              startDate: { isValid: false, message: "" },
                              endDate: { isValid: false, message: "" },
                              consumptionType: { isValid: false, message: "" },
                            });
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
                          {loading ? "Saving..." : "Save"}
                        </Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>

                <TabsContent value="input-history" key="input-history">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="backdrop-blur-md bg-white/20 border border-white/30 shadow-xl">
                      <CardHeader className="bg-gradient-to-r from-amber-500/80 to-amber-600/80 text-white rounded-t-lg p-3 backdrop-blur-sm">
                        <CardTitle>Input History</CardTitle>
                        <CardDescription className="text-amber-100">
                          View and manage your previously entered emissions data.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="backdrop-blur-sm">
                        <div className="space-y-4">
                          {/* Filters */}
                          <div className="flex flex-wrap gap-3 items-end">
                            <div className="w-40">
                              <FormInput
                                id="start-date-history"
                                type="date"
                                placeholder="Start Date"
                                value={startDateHistory}
                                onChange={(e) =>
                                  setStartDateHistory(e.target.value)
                                }
                                className="backdrop-blur-sm bg-white/50 border-white/30"
                              />
                            </div>
                            <div className="w-40">
                              <FormInput
                                id="end-date-history"
                                type="date"
                                value={endDateHistory}
                                onChange={(e) =>
                                  setEndDateHistory(e.target.value)
                                }
                                className="backdrop-blur-sm bg-white/50 border-white/30"
                              />
                            </div>
                            <AnimatedSubmitButton
                              onClick={handleFilterHistory}
                            >
                              Filter
                            </AnimatedSubmitButton>
                          </div>
                          <div className="flex space-x-4">
                            <FormInput
                              id="search"
                              placeholder="Search table..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="max-w-xs backdrop-blur-sm bg-white/50 border-white/30"
                            />
                          </div>

                          {/* Table */}
                          <div className="border rounded-lg overflow-hidden">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-emerald-50/50 backdrop-blur-sm">
                                  <TableHead className="text-emerald-700 font-semibold">
                                    Activity Group
                                  </TableHead>
                                  <TableHead className="text-emerald-700 font-semibold">
                                    Date Captured
                                  </TableHead>
                                  <TableHead className="text-emerald-700 font-semibold">
                                    Capturer Name
                                  </TableHead>
                                  <TableHead className="text-emerald-700 font-semibold">
                                    Status
                                  </TableHead>
                                  <TableHead className="text-emerald-700 font-semibold text-center">
                                    Attachments
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {loading ? (
                                  <TableRow>
                                    <TableCell
                                      colSpan={5}
                                      className="text-center py-8"
                                    >
                                      <div className="flex justify-center items-center gap-2">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
                                        <span className="text-emerald-600 font-medium">
                                          Loading...
                                        </span>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ) : filteredData.length === 0 ? (
                                  <TableRow>
                                    <TableCell
                                      colSpan={5}
                                      className="text-center py-8"
                                    >
                                      <div className="text-gray-500">
                                        <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                                        <p>No data found</p>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ) : (
                                  filteredData
                                    .slice(
                                      (currentPageHistory - 1) * ITEMS_PER_PAGE,
                                      currentPageHistory * ITEMS_PER_PAGE
                                    )
                                    .map((item: any, index: number) => (
                                      <TableRow
                                        key={index}
                                        className="hover:bg-emerald-50/30 backdrop-blur-sm"
                                      >
                                        <TableCell 
                                          className="text-gray-800 cursor-pointer"
                                          onClick={() => handleViewDetail(item)}
                                        >
                                          {item.diaryname || "N/A"}
                                        </TableCell>
                                        <TableCell 
                                          className="text-gray-800 cursor-pointer"
                                          onClick={() => handleViewDetail(item)}
                                        >
                                          {item.editDate || "N/A"}
                                        </TableCell>
                                        <TableCell 
                                          className="text-gray-800 cursor-pointer"
                                          onClick={() => handleViewDetail(item)}
                                        >
                                          {item.diaryentityownerName || "N/A"}
                                        </TableCell>
                                        <TableCell onClick={() => handleViewDetail(item)}>
                                          <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                              item.diarystatusName === "Approved"
                                                ? "bg-green-100 text-green-800"
                                                : item.diarystatusName ===
                                                  "Rejected"
                                                ? "bg-red-100 text-red-800"
                                                : "bg-yellow-100 text-yellow-800"
                                            }`}
                                          >
                                            {item.diarystatusName || "Pending"}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-center">
                                          <div className="flex justify-center gap-2">
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewHistoryAttachments(item);
                                              }}
                                              title="View Attachments"
                                            >
                                              <AttachFile className="h-4 w-4 text-emerald-600" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="icon"
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleViewHistoryNotes(item);
                                              }}
                                              title="View Notes"
                                            >
                                              <Note className="h-4 w-4 text-emerald-600" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))
                                )}
                              </TableBody>
                            </Table>
                          </div>

                          {/* Pagination */}
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">
                              Showing{" "}
                              {Math.min(
                                (currentPageHistory - 1) * ITEMS_PER_PAGE + 1,
                                filteredData.length
                              )}{" "}
                              to{" "}
                              {Math.min(
                                currentPageHistory * ITEMS_PER_PAGE,
                                filteredData.length
                              )}{" "}
                              of {filteredData.length} entries
                            </span>
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPageHistory((prev) =>
                                    Math.max(prev - 1, 1)
                                  )
                                }
                                disabled={currentPageHistory === 1}
                                className="border-emerald-200 hover:bg-emerald-50"
                              >
                                Previous
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setCurrentPageHistory((prev) =>
                                    Math.min(
                                      prev + 1,
                                      Math.ceil(
                                        filteredData.length / ITEMS_PER_PAGE
                                      )
                                    )
                                  )
                                }
                                disabled={
                                  currentPageHistory >=
                                  Math.ceil(filteredData.length / ITEMS_PER_PAGE)
                                }
                                className="border-emerald-200 hover:bg-emerald-50"
                              >
                                Next
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>


              </AnimatePresence>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
