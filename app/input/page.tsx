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
  TrackChanges,
  CheckCircle,
} from "@mui/icons-material";
import {
  InputData,
  CreateInputDataRequest,
  UpdateInputDataRequest,
} from "@/types/inputData";
import AnimatedFormField from "@/components/animated-form-field";
import AnimatedSubmitButton from "@/components/animated-submit-button";
import { crudService } from "@/lib/crudService";
import { useAuth } from "@/lib/auth-context";
import { environment } from "@/lib/environment";

// Dynamic import for 3D background
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
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [inputData, setInputData] = useState<InputData[]>([]);
  const [selectedTab, setSelectedTab] = useState("enter-data");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [validation, setValidation] = useState({
    activityType: { isValid: false, message: "" },
    costCentre: { isValid: false, message: "" },
    startDate: { isValid: false, message: "" },
    endDate: { isValid: false, message: "" },
    consumptionType: { isValid: false, message: "" },
    consumption: { isValid: false, message: "" },
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

  // Load input data when component mounts or tab changes
  useEffect(() => {
    if (selectedTab === "input-history" || selectedTab === "trace-source") {
      fetchInputData();
    }
  }, [selectedTab]);

  // Initialize with empty data to prevent undefined errors
  useEffect(() => {
    if (!inputData || inputData.length === 0) {
      setInputData([]);
    }
  }, []);

  const mockData = [
    {
      name: "Sample Entry 1",
      editDate: "2023-05-15",
      dataCapturer: "John Doe",
      activityType: "Stationary Fuels",
      docs: 2,
      status: "approved",
      userName: "John Doe",
      value: "100",
      emissions: "50 kg CO2e",
      costUom: "USD",
      type: "Fuel",
      activity: "Stationary",
    },
    {
      name: "Sample Entry 2",
      editDate: "2023-05-20",
      dataCapturer: "Jane Smith",
      activityType: "Mobile Fuels",
      docs: 1,
      status: "Pending",
      userName: "Jane Smith",
      value: "200",
      emissions: "75 kg CO2e",
      costUom: "USD",
      type: "Fuel",
      activity: "Mobile",
    },
    {
      name: "Sample Entry 3",
      editDate: "2023-05-25",
      dataCapturer: "Bob Johnson",
      activityType: "Process",
      docs: 0,
      status: "rejected",
      userName: "Bob Johnson",
      value: "150",
      emissions: "60 kg CO2e",
      costUom: "USD",
      type: "Process",
      activity: "Industrial",
    },
  ];

  // Form state
  const [formData, setFormData] = useState({
    activityType: "",
    costCentre: "",
    startDate: "",
    endDate: "",
    consumptionType: "",
    consumption: "",
    monetaryValue: "",
    notes: "",
    documents: [] as string[],
  });

  // Upload tab state
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadType, setUploadType] = useState("");
  const [uploadNotes, setUploadNotes] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  // Transform InputData for table display
  const transformedData = inputData.map((item) => {
    // Safely parse the createdAt date
    let editDate = "N/A";
    if (item.createdAt) {
      try {
        const date = new Date(item.createdAt);
        if (!isNaN(date.getTime())) {
          editDate = date.toISOString().split("T")[0];
        }
      } catch (error) {
        console.warn("Invalid date format:", item.createdAt);
      }
    }

    return {
      name: `Entry ${item.id}`,
      editDate,
      dataCapturer: `User ${item.userId}`,
      activityType: item.activityType || "Unknown",
      docs: item.documents?.length || 0,
      status: item.status || "pending",
      userName: `User ${item.userId}`,
      value: (item.consumption || 0).toString(),
      emissions: `${item.emissions || 0} kg CO2e`,
      costUom: "USD",
      type: item.activityType ? item.activityType.split(" ")[0] : "Unknown",
      activity: item.consumptionType || "Unknown",
    };
  });

  const filteredData = transformedData.filter(
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
      row.activity.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const calculateEmissions = (
    activityType: string,
    consumption: number,
    consumptionType: string
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
      "activityType",
      "costCentre",
      "startDate",
      "endDate",
      "consumptionType",
      "consumption",
    ];
    const isFormValid = requiredFields.every(
      (field) => validation[field as keyof typeof validation]?.isValid
    );

    if (!isFormValid) {
      alert("Please fill in all required fields correctly");
      return;
    }

    setLoading(true);
    setSubmitSuccess(false);

    try {
      const payload = {
        activityType: formData.activityType,
        costCentre: formData.costCentre,
        startDate: formData.startDate,
        endDate: formData.endDate,
        consumptionType: formData.consumptionType,
        consumption: formData.consumption, // Send as string
        monetaryValue: formData.monetaryValue || undefined,
        notes: formData.notes || undefined,
      };

      if (editingId) {
        // Update existing record
        const updatePayload: UpdateInputDataRequest = {
          id: editingId,
          ...payload,
        };
        console.log(
          "DEBUG: About to call crudService.update for emissions-input",
          editingId,
          updatePayload
        );
        await crudService.update("emissions-input", editingId, updatePayload);
        console.log("DEBUG: crudService.update successful");
      } else {
        // Create new record
        console.log(
          "DEBUG: About to call crudService.create for emissions-input",
          payload
        );
        await crudService.create("emissions-input", payload);
        console.log("DEBUG: crudService.create successful");
      }

      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);

      // Reset form
      setFormData({
        activityType: "",
        costCentre: "",
        startDate: "",
        endDate: "",
        consumptionType: "",
        consumption: "",
        monetaryValue: "",
        notes: "",
        documents: [],
      });
      setValidation({
        activityType: { isValid: false, message: "" },
        costCentre: { isValid: false, message: "" },
        startDate: { isValid: false, message: "" },
        endDate: { isValid: false, message: "" },
        consumptionType: { isValid: false, message: "" },
        consumption: { isValid: false, message: "" },
      });
      setEditingId(null);
      // Refresh the input data list
      fetchInputData();
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error: Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInputData = async () => {
    console.log("DEBUG: fetchInputData called");
    try {
      console.log("DEBUG: About to call crudService.list for emissions-input");
      const data = await crudService.list<InputData>("emissions-input");
      console.log("DEBUG: crudService.list successful, data:", data);
      setInputData(data);
    } catch (error) {
      console.error("DEBUG: Fetch error:", error);
      setInputData([]); // Set empty array on error
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const validFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/json",
      ];

      if (!allowedTypes.includes(file.type)) {
        alert(
          `Invalid file type: ${file.name}. Please upload PDF, CSV, Excel, or JSON files.`
        );
        continue;
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        alert(`File too large: ${file.name}. Maximum size is 10MB.`);
        continue;
      }

      try {
        // Try API first, fallback to localStorage for static export
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);

        try {
          const response = await fetch(
            `${environment.apiUrl}/emissions-input/upload`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${session?.access_token}`,
              },
              body: uploadFormData,
            }
          );

          const result = await response.json();

          if (response.ok) {
            validFiles.push(`${file.name} (uploaded)`);
          } else {
            throw new Error("API upload failed");
          }
        } catch (apiError) {
          // API not available (static export), use localStorage
          console.log("Using localStorage for file upload in static export");

          // Convert file to base64 for storage
          const fileData = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.readAsDataURL(file);
          });

          // Store file info in localStorage
          const existingFiles = JSON.parse(
            localStorage.getItem("ecometrics_uploads") || "[]"
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
            JSON.stringify(existingFiles)
          );

          validFiles.push(`${file.name} (stored locally)`);
        }
      } catch (error) {
        console.error("Upload error for file:", file.name, error);
        alert(`Failed to upload: ${file.name}`);
      }
    }

    if (validFiles.length > 0) {
      // Add to form documents
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, ...validFiles],
      }));
      alert(`Files processed successfully:\n${validFiles.join("\n")}`);
    }
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
  };

  const handleEdit = (item: InputData) => {
    setFormData({
      activityType: item.activityType,
      costCentre: item.costCentre,
      startDate: item.startDate,
      endDate: item.endDate,
      consumptionType: item.consumptionType,
      consumption: item.consumption.toString(),
      monetaryValue: item.monetaryValue?.toString() || "",
      notes: item.notes || "",
      documents: item.documents || [],
    });
    setEditingId(item.id);
    setSelectedTab("enter-data");
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this input?")) {
      console.log(
        "DEBUG: About to call crudService.delete for emissions-input",
        id
      );
      try {
        await crudService.delete("emissions-input", id);
        console.log("DEBUG: crudService.delete successful");
        fetchInputData(); // Refresh the list
      } catch (error) {
        console.error("DEBUG: Delete error:", error);
        alert("Error deleting input");
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (uploadFiles.length === 0 || !uploadType) return;

    setLoading(true);
    const uploadedFiles: string[] = [];

    try {
      for (const file of uploadFiles) {
        try {
          // Try API first, fallback to localStorage for static export
          const uploadFormData = new FormData();
          uploadFormData.append("file", file);

          try {
            const response = await fetch(
              `${environment.apiUrl}/emissions-input/upload`,
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${session?.access_token}`,
                },
                body: uploadFormData,
              }
            );

            const result = await response.json();

            if (response.ok) {
              uploadedFiles.push(`${file.name} (uploaded)`);
            } else {
              throw new Error("API upload failed");
            }
          } catch (apiError) {
            // API not available (static export), use localStorage
            console.log("Using localStorage for file upload in static export");

            // Convert file to base64 for storage
            const fileData = await new Promise<string>((resolve) => {
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result as string);
              reader.readAsDataURL(file);
            });

            // Store file info in localStorage
            const existingFiles = JSON.parse(
              localStorage.getItem("ecometrics_uploads") || "[]"
            );
            existingFiles.push({
              name: file.name,
              type: file.type,
              size: file.size,
              data: fileData,
              uploadType,
              notes: uploadNotes,
              uploadedAt: new Date().toISOString(),
            });
            localStorage.setItem(
              "ecometrics_uploads",
              JSON.stringify(existingFiles)
            );

            uploadedFiles.push(`${file.name} (stored locally)`);
          }
        } catch (error) {
          console.error("Upload error for file:", file.name, error);
          alert(`Failed to upload: ${file.name}`);
        }
      }

      if (uploadedFiles.length > 0) {
        alert(`Upload successful:\n${uploadedFiles.join("\n")}`);
        // Reset form
        setUploadFiles([]);
        setUploadType("");
        setUploadNotes("");
      }
    } catch (error) {
      console.error("Upload submit error:", error);
      alert("Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
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
              <TabsList className="grid w-full grid-cols-4 mb-6 backdrop-blur-md bg-white/20 border border-white/30">
                <TabsTrigger
                  value="enter-data"
                  className="flex flex-col items-center gap-1 data-[state=active]:bg-white/30 data-[state=active]:text-emerald-700"
                >
                  <AddCircle className="h-4 w-4" />
                  Enter Data
                </TabsTrigger>
                <TabsTrigger
                  value="upload-file"
                  className="flex flex-col items-center gap-1 data-[state=active]:bg-white/30 data-[state=active]:text-emerald-700"
                >
                  <UploadFile className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
                <TabsTrigger
                  value="input-history"
                  className="flex flex-col items-center gap-1 data-[state=active]:bg-white/30 data-[state=active]:text-emerald-700"
                >
                  <History className="h-4 w-4" />
                  Input History
                </TabsTrigger>
                <TabsTrigger
                  value="trace-source"
                  className="flex flex-col items-center gap-1 data-[state=active]:bg-white/30 data-[state=active]:text-emerald-700"
                >
                  <TrackChanges className="h-4 w-4" />
                  Trace Source
                </TabsTrigger>
              </TabsList>

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
                        <form onSubmit={handleFormSubmit} className="space-y-6">
                          <div className="grid grid-cols-2 gap-6">
                            <AnimatedFormField
                              id="activity-type"
                              label="Step 1: Select Activity Type"
                              type="text"
                              placeholder="Select activity type..."
                              value={formData.activityType}
                              onChange={(e) =>
                                handleInputChange(
                                  "activityType",
                                  e.target.value
                                )
                              }
                              required
                              validation={validation.activityType}
                              list="activity-types"
                            />
                            <AnimatedFormField
                              id="cost-centre"
                              label="Step 3: Cost Centre"
                              type="text"
                              placeholder="e.g., FIN"
                              value={formData.costCentre}
                              onChange={(e) =>
                                handleInputChange("costCentre", e.target.value)
                              }
                              required
                              validation={validation.costCentre}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <AnimatedFormField
                              id="start-date"
                              label="Step 2: Start Date"
                              type="date"
                              placeholder=""
                              value={formData.startDate}
                              onChange={(e) =>
                                handleInputChange("startDate", e.target.value)
                              }
                              required
                              validation={validation.startDate}
                            />
                            <AnimatedFormField
                              id="end-date"
                              label="End Date"
                              type="date"
                              placeholder=""
                              value={formData.endDate}
                              onChange={(e) =>
                                handleInputChange("endDate", e.target.value)
                              }
                              required
                              validation={validation.endDate}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <AnimatedFormField
                              id="consumption-type"
                              label="Step 4: Consumption Type"
                              type="text"
                              placeholder="e.g., Coal Industrial"
                              value={formData.consumptionType}
                              onChange={(e) =>
                                handleInputChange(
                                  "consumptionType",
                                  e.target.value
                                )
                              }
                              required
                              validation={validation.consumptionType}
                            />
                            <AnimatedFormField
                              id="consumption"
                              label="Step 5: Consumption"
                              type="number"
                              placeholder="Enter consumption value"
                              value={formData.consumption}
                              onChange={(e) =>
                                handleInputChange("consumption", e.target.value)
                              }
                              required
                              validation={validation.consumption}
                              step="0.01"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-6">
                            <AnimatedFormField
                              id="monetary-value"
                              label="Step 6: Monetary Value"
                              type="number"
                              placeholder="Enter monetary value"
                              value={formData.monetaryValue}
                              onChange={(e) =>
                                handleInputChange(
                                  "monetaryValue",
                                  e.target.value
                                )
                              }
                              step="0.01"
                            />
                            <AnimatedFormField
                              id="notes"
                              label="Step 7: Notes"
                              type="text"
                              placeholder="Additional notes"
                              value={formData.notes}
                              onChange={(e) =>
                                handleInputChange("notes", e.target.value)
                              }
                            />
                          </div>

                          <datalist id="activity-types">
                            <option value="Stationary Fuels" />
                            <option value="Mobile Fuels" />
                            <option value="Fugitive Gas" />
                            <option value="Process" />
                            <option value="Waste Water" />
                            <option value="Renewable Electricity" />
                          </datalist>

                          <div className="space-y-3">
                            <Label
                              htmlFor="documents"
                              className="text-sm font-medium text-gray-700"
                            >
                              Step 8: Documents
                            </Label>
                            <FormInput
                              id="documents"
                              type="file"
                              multiple
                              onChange={handleFileUpload}
                              accept=".pdf,.csv,.xlsx,.xls,.json"
                              className="backdrop-blur-sm bg-white/50 border-white/30 focus:bg-white/70 transition-all"
                            />
                            {formData.documents.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="text-sm text-emerald-700 bg-emerald-50/50 p-3 rounded-lg backdrop-blur-sm"
                              >
                                <p className="font-medium mb-2">
                                  Selected files:
                                </p>
                                <ul className="list-disc list-inside space-y-1">
                                  {formData.documents.map((doc, index) => (
                                    <li
                                      key={index}
                                      className="flex items-center gap-2"
                                    >
                                      <CheckCircle className="h-3 w-3 text-emerald-600" />
                                      {doc}
                                    </li>
                                  ))}
                                </ul>
                              </motion.div>
                            )}
                            <p className="text-sm text-gray-600">
                              Upload supported files: PDF, CSV, Excel, JSON (max
                              10MB each)
                            </p>
                          </div>

                          <div className="flex justify-end space-x-3 pt-6">
                            {editingId && (
                              <AnimatedSubmitButton
                                type="button"
                                variant="outline"
                                className="backdrop-blur-md bg-white/20 border-white/30"
                                onClick={() => {
                                  setEditingId(null);
                                  setFormData({
                                    activityType: "",
                                    costCentre: "",
                                    startDate: "",
                                    endDate: "",
                                    consumptionType: "",
                                    consumption: "",
                                    monetaryValue: "",
                                    notes: "",
                                    documents: [],
                                  });
                                  setValidation({
                                    activityType: {
                                      isValid: false,
                                      message: "",
                                    },
                                    costCentre: { isValid: false, message: "" },
                                    startDate: { isValid: false, message: "" },
                                    endDate: { isValid: false, message: "" },
                                    consumptionType: {
                                      isValid: false,
                                      message: "",
                                    },
                                    consumption: {
                                      isValid: false,
                                      message: "",
                                    },
                                  });
                                }}
                              >
                                Cancel
                              </AnimatedSubmitButton>
                            )}
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
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="upload-file" key="upload-file">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="backdrop-blur-md bg-white/20 border border-white/30 shadow-xl">
                      <CardHeader className="bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 text-white rounded-t-lg p-3 backdrop-blur-sm">
                        <CardTitle>Upload File</CardTitle>
                        <CardDescription className="text-emerald-100">
                          Upload a file to import emissions data.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="backdrop-blur-sm">
                        <form
                          onSubmit={handleUploadSubmit}
                          className="space-y-4"
                        >
                          <AnimatedFormField
                            id="upload-type"
                            label="Upload Type"
                            type="text"
                            placeholder="Select upload type..."
                            value={uploadType}
                            onChange={(e) => setUploadType(e.target.value)}
                            required
                            list="upload-types"
                          />
                          <datalist id="upload-types">
                            <option value="Emissions Data" />
                            <option value="Fuel Consumption" />
                            <option value="Waste Data" />
                            <option value="Energy Usage" />
                            <option value="Other" />
                          </datalist>

                          <AnimatedFormField
                            id="upload-notes"
                            label="Notes"
                            type="text"
                            placeholder="Add notes about this upload..."
                            value={uploadNotes}
                            onChange={(e) => setUploadNotes(e.target.value)}
                          />

                          <div className="space-y-3">
                            <Label className="text-sm font-medium text-gray-700">
                              Files to Upload
                            </Label>
                            <motion.div
                              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all backdrop-blur-sm ${
                                isDragging
                                  ? "border-emerald-400 bg-emerald-50/30"
                                  : "border-white/40 bg-white/10 hover:border-white/60 hover:bg-white/20"
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
                              {uploadFiles.length > 0 ? (
                                <div className="space-y-3">
                                  <p className="text-sm text-emerald-700 font-medium">
                                    {uploadFiles.length} file(s) selected:
                                  </p>
                                  <ul className="text-sm text-left max-h-32 overflow-y-auto space-y-1">
                                    {uploadFiles.map((file, index) => (
                                      <li
                                        key={index}
                                        className="flex justify-between items-center bg-white/30 rounded p-2"
                                      >
                                        <span className="text-gray-800">
                                          {file.name}
                                        </span>
                                        <span className="text-emerald-600 font-medium">
                                          (
                                          {(file.size / 1024 / 1024).toFixed(2)}{" "}
                                          MB)
                                        </span>
                                      </li>
                                    ))}
                                  </ul>
                                  <AnimatedSubmitButton
                                    type="button"
                                    onClick={() => setUploadFiles([])}
                                    variant="outline"
                                    className="backdrop-blur-md bg-white/20 border-white/30"
                                  >
                                    Clear Files
                                  </AnimatedSubmitButton>
                                </div>
                              ) : (
                                <div>
                                  <UploadFile className="h-12 w-12 mx-auto text-emerald-600 mb-4" />
                                  <p className="text-sm text-gray-700 mb-4 font-medium">
                                    Drag and drop your files here, or click to
                                    select
                                  </p>
                                  <FormInput
                                    id="upload-file-input"
                                    type="file"
                                    multiple
                                    accept=".pdf,.csv,.xlsx,.xls,.json"
                                    onChange={handleUploadFileSelect}
                                    className="hidden"
                                  />
                                  <AnimatedSubmitButton
                                    type="button"
                                    onClick={() =>
                                      document
                                        .getElementById("upload-file-input")
                                        ?.click()
                                    }
                                    variant="outline"
                                    className="backdrop-blur-md bg-white/20 border-white/30"
                                  >
                                    Choose Files
                                  </AnimatedSubmitButton>
                                </div>
                              )}
                            </motion.div>
                            <p className="text-sm text-gray-600">
                              Supported: PDF, CSV, Excel, JSON files (max 10MB
                              each)
                            </p>
                          </div>
                          <div className="flex justify-end space-x-3">
                            <AnimatedSubmitButton
                              type="button"
                              onClick={() => {
                                setUploadFiles([]);
                                setUploadType("");
                                setUploadNotes("");
                              }}
                              variant="outline"
                              className="backdrop-blur-md bg-white/20 border-white/30"
                            >
                              Clear Form
                            </AnimatedSubmitButton>
                            <AnimatedSubmitButton
                              type="submit"
                              disabled={uploadFiles.length === 0 || !uploadType}
                              loading={loading}
                            >
                              Upload{" "}
                              {uploadFiles.length > 0
                                ? `(${uploadFiles.length})`
                                : ""}
                            </AnimatedSubmitButton>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="input-history" key="input-history">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="backdrop-blur-md bg-white/20 border border-white/30 shadow-xl">
                      <CardHeader className="bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 text-white rounded-t-lg p-3 backdrop-blur-sm">
                        <CardTitle>Reporting Period</CardTitle>
                        <CardDescription className="text-emerald-100">
                          View and manage your input history.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="backdrop-blur-sm">
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <div className="flex space-x-4">
                              <FormInput
                                id="start-date-history"
                                type="date"
                                className="backdrop-blur-sm bg-white/50 border-white/30"
                              />
                              <FormInput
                                id="end-date-history"
                                type="date"
                                className="backdrop-blur-sm bg-white/50 border-white/30"
                              />
                              <AnimatedSubmitButton>
                                Filter
                              </AnimatedSubmitButton>
                            </div>
                            <FormInput
                              id="search"
                              placeholder="Search table..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="backdrop-blur-sm bg-white/50 border-white/30"
                            />
                          </div>
                          <div className="rounded-lg overflow-hidden backdrop-blur-sm">
                            <Table>
                              <TableHeader>
                                <TableRow className="backdrop-blur-sm bg-white/20">
                                  <TableHead>Name</TableHead>
                                  <TableHead>Edit Date</TableHead>
                                  <TableHead>Data Capturer</TableHead>
                                  <TableHead>Activity Type</TableHead>
                                  <TableHead>Docs</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredData.map((row, index) => (
                                  <motion.tr
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="backdrop-blur-sm bg-white/10 hover:bg-white/20"
                                  >
                                    <TableCell className="font-medium">
                                      {row.name}
                                    </TableCell>
                                    <TableCell>{row.editDate}</TableCell>
                                    <TableCell>{row.dataCapturer}</TableCell>
                                    <TableCell>{row.activityType}</TableCell>
                                    <TableCell>{row.docs}</TableCell>
                                    <TableCell>
                                      <span
                                        className={`px-2 py-1 rounded-full text-xs ${
                                          row.status === "approved"
                                            ? "bg-emerald-100 text-emerald-800"
                                            : row.status === "rejected"
                                              ? "bg-red-100 text-red-800"
                                              : "bg-yellow-100 text-yellow-800"
                                        }`}
                                      >
                                        {row.status}
                                      </span>
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex space-x-2">
                                        <AnimatedSubmitButton
                                          type="button"
                                          variant="outline"
                                          className="backdrop-blur-sm bg-white/20 border-white/30"
                                          onClick={() => {
                                            const itemId = row.name.replace(
                                              "Entry ",
                                              ""
                                            );
                                            const item = inputData.find(
                                              (i) => i.id === itemId
                                            );
                                            if (item) handleEdit(item);
                                          }}
                                        >
                                          Edit
                                        </AnimatedSubmitButton>
                                        <AnimatedSubmitButton
                                          type="button"
                                          variant="outline"
                                          className="backdrop-blur-sm bg-red-500/20 border-red-300 text-red-700 hover:bg-red-500/30"
                                          onClick={() => {
                                            const itemId = row.name.replace(
                                              "Entry ",
                                              ""
                                            );
                                            handleDelete(itemId);
                                          }}
                                        >
                                          Delete
                                        </AnimatedSubmitButton>
                                      </div>
                                    </TableCell>
                                  </motion.tr>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent value="trace-source" key="trace-source">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                  >
                    <Card className="backdrop-blur-md bg-white/20 border border-white/30 shadow-xl">
                      <CardHeader className="bg-gradient-to-r from-emerald-500/80 to-emerald-600/80 text-white rounded-t-lg p-3 backdrop-blur-sm">
                        <CardTitle>Trace Source</CardTitle>
                        <CardDescription className="text-emerald-100">
                          Trace the source of your emissions.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="backdrop-blur-sm">
                        <div className="space-y-4">
                          <div className="flex justify-between items-end">
                            <div className="flex space-x-4">
                              <FormInput
                                id="start-date-trace"
                                type="date"
                                className="backdrop-blur-sm bg-white/50 border-white/30"
                              />
                              <FormInput
                                id="end-date-trace"
                                type="date"
                                className="backdrop-blur-sm bg-white/50 border-white/30"
                              />
                              <AnimatedSubmitButton>
                                Filter
                              </AnimatedSubmitButton>
                            </div>
                            <FormInput
                              id="search-trace"
                              placeholder="Search table..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="backdrop-blur-sm bg-white/50 border-white/30"
                            />
                          </div>
                          <div className="rounded-lg overflow-hidden backdrop-blur-sm">
                            <Table>
                              <TableHeader>
                                <TableRow className="backdrop-blur-sm bg-white/20">
                                  <TableHead>Name</TableHead>
                                  <TableHead>Edit Date</TableHead>
                                  <TableHead>User Name</TableHead>
                                  <TableHead>Value</TableHead>
                                  <TableHead>Emissions</TableHead>
                                  <TableHead>Cost UOM</TableHead>
                                  <TableHead>Type</TableHead>
                                  <TableHead>Activity</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {filteredData.map((row, index) => (
                                  <motion.tr
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="backdrop-blur-sm bg-white/10 hover:bg-white/20"
                                  >
                                    <TableCell className="font-medium">
                                      {row.name}
                                    </TableCell>
                                    <TableCell>{row.editDate}</TableCell>
                                    <TableCell>{row.userName}</TableCell>
                                    <TableCell>{row.value}</TableCell>
                                    <TableCell>
                                      <span className="text-emerald-600 font-medium">
                                        {row.emissions}
                                      </span>
                                    </TableCell>
                                    <TableCell>{row.costUom}</TableCell>
                                    <TableCell>{row.type}</TableCell>
                                    <TableCell>{row.activity}</TableCell>
                                  </motion.tr>
                                ))}
                              </TableBody>
                            </Table>
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
