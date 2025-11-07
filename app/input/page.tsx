"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
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
} from "@mui/icons-material";
import { InputData, CreateInputDataRequest } from "@/types/inputData";

export default function Input() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputData, setInputData] = useState<InputData[]>([]);
  const [selectedTab, setSelectedTab] = useState("enter-data");
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    activityType: "",
    status: "",
  });

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
      status: "Approved",
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
      status: "Rejected",
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
  });

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate required fields
      if (
        !formData.activityType ||
        !formData.costCentre ||
        !formData.startDate ||
        !formData.endDate ||
        !formData.consumptionType ||
        !formData.consumption
      ) {
        alert("Please fill in all required fields");
        setLoading(false);
        return;
      }

      const payload: CreateInputDataRequest = {
        activityType: formData.activityType,
        costCentre: formData.costCentre,
        startDate: formData.startDate,
        endDate: formData.endDate,
        consumptionType: formData.consumptionType,
        consumption: parseFloat(formData.consumption),
        monetaryValue: formData.monetaryValue
          ? parseFloat(formData.monetaryValue)
          : undefined,
        notes: formData.notes,
      };

      // Try API first, fallback to localStorage for static export
      try {
        const response = await fetch("/api/emissions-input", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (response.ok) {
          alert("Input data created successfully!");
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
          });
          // Refresh the input data list
          fetchInputData();
        } else {
          throw new Error("API call failed");
        }
      } catch (apiError) {
        // API not available (static export), use localStorage
        console.log("Using localStorage for static export");

        const existingData = JSON.parse(
          localStorage.getItem("ecometrics_emissions-input") || "[]"
        );
        const newItem = {
          id: Date.now().toString(),
          userId: "1",
          companyId: "1",
          ...payload,
          emissions: calculateEmissions(
            payload.activityType,
            payload.consumption,
            payload.consumptionType
          ),
          status: "pending" as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        existingData.push(newItem);
        localStorage.setItem(
          "ecometrics_emissions-input",
          JSON.stringify(existingData)
        );

        alert("Input data saved successfully!");
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
        });
        // Refresh the input data list
        fetchInputData();
      }
    } catch (error) {
      console.error("Submit error:", error);
      alert("Error: Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchInputData = async () => {
    try {
      // Try API first, fallback to localStorage for static export
      try {
        const response = await fetch("/api/emissions-input");
        const result = await response.json();

        if (response.ok && result) {
          // Ensure we always have an array, even if result.Data is undefined
          const data = Array.isArray(result.Data) ? result.Data : [];
          setInputData(data);
        } else {
          throw new Error("API call failed");
        }
      } catch (apiError) {
        // API not available (static export), use localStorage
        console.log("Using localStorage for data fetch in static export");

        const localData = JSON.parse(
          localStorage.getItem("ecometrics_emissions-input") || "[]"
        );
        setInputData(Array.isArray(localData) ? localData : []);
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setInputData([]); // Set empty array on error
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/emissions-input/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert(`File uploaded successfully: ${result.data.fileName}`);
      } else {
        alert(`Upload error: ${result.error}`);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-sky-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Input Management
          </h1>
          <p className="text-lg text-gray-600">
            Enter, upload, and track your emissions data
          </p>
        </div>
        <div className="space-y-6">
          <Tabs
            value={selectedTab}
            onValueChange={setSelectedTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 mb-6">
              <TabsTrigger
                value="enter-data"
                className="flex flex-col items-center gap-1"
              >
                <AddCircle className="h-4 w-4" />
                Enter Data
              </TabsTrigger>
              <TabsTrigger
                value="upload-file"
                className="flex flex-col items-center gap-1"
              >
                <UploadFile className="h-4 w-4" />
                Upload File
              </TabsTrigger>
              <TabsTrigger
                value="input-history"
                className="flex flex-col items-center gap-1"
              >
                <History className="h-4 w-4" />
                Input History
              </TabsTrigger>
              <TabsTrigger
                value="trace-source"
                className="flex flex-col items-center gap-1"
              >
                <TrackChanges className="h-4 w-4" />
                Trace Source
              </TabsTrigger>
            </TabsList>

            <TabsContent value="enter-data" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg p-3">
                  <CardTitle>Enter Data</CardTitle>
                  <CardDescription className="text-green-100">
                    Manually enter your emissions data here.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleFormSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="activity-type">
                          Step 1: Select Activity Type *
                        </Label>
                        <FormInput
                          id="activity-type"
                          placeholder="Select activity type..."
                          list="activity-types"
                          value={formData.activityType}
                          onChange={(e) =>
                            handleInputChange("activityType", e.target.value)
                          }
                          required
                        />
                        <datalist id="activity-types">
                          <option value="Stationary Fuels" />
                          <option value="Mobile Fuels" />
                          <option value="Fugitive Gas" />
                          <option value="Process" />
                          <option value="Waste Water" />
                          <option value="Renewable Electricity" />
                        </datalist>
                      </div>
                      <div>
                        <Label htmlFor="cost-centre">
                          Step 3: Cost Centre *
                        </Label>
                        <FormInput
                          id="cost-centre"
                          placeholder="e.g., FIN"
                          value={formData.costCentre}
                          onChange={(e) =>
                            handleInputChange("costCentre", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-date">Step 2: Start Date *</Label>
                        <FormInput
                          id="start-date"
                          type="date"
                          value={formData.startDate}
                          onChange={(e) =>
                            handleInputChange("startDate", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="end-date">End Date *</Label>
                        <FormInput
                          id="end-date"
                          type="date"
                          value={formData.endDate}
                          onChange={(e) =>
                            handleInputChange("endDate", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="consumption-type">
                          Step 4: Consumption Type *
                        </Label>
                        <FormInput
                          id="consumption-type"
                          placeholder="e.g., Coal Industrial"
                          value={formData.consumptionType}
                          onChange={(e) =>
                            handleInputChange("consumptionType", e.target.value)
                          }
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="consumption">
                          Step 5: Consumption *
                        </Label>
                        <FormInput
                          id="consumption"
                          placeholder="Enter consumption value"
                          type="number"
                          step="0.01"
                          value={formData.consumption}
                          onChange={(e) =>
                            handleInputChange("consumption", e.target.value)
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="monetary-value">
                          Step 6: Monetary Value
                        </Label>
                        <FormInput
                          id="monetary-value"
                          placeholder="Enter monetary value"
                          type="number"
                          step="0.01"
                          value={formData.monetaryValue}
                          onChange={(e) =>
                            handleInputChange("monetaryValue", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <Label htmlFor="notes">Step 7: Notes</Label>
                        <FormInput
                          id="notes"
                          placeholder="Additional notes"
                          value={formData.notes}
                          onChange={(e) =>
                            handleInputChange("notes", e.target.value)
                          }
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="documents">Step 8: Documents</Label>
                      <FormInput
                        id="documents"
                        type="file"
                        disabled={true} // Disabled for static export
                        onChange={handleFileUpload}
                        accept=".pdf,.csv,.xlsx,.xls,.json"
                      />
                      <p className="text-sm text-muted-foreground">
                        File upload available in dynamic mode only
                      </p>
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button type="button" variant="outline">
                        Actions
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? "Submitting..." : "Submit"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="upload-file" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg p-3">
                  <CardTitle>Upload File</CardTitle>
                  <CardDescription className="text-green-100">
                    Upload a file to import data.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <Label htmlFor="upload-type">
                        Please select upload type
                      </Label>
                      <FormInput
                        id="upload-type"
                        placeholder="Select upload type..."
                        list="upload-types"
                      />
                      <datalist id="upload-types">
                        <option value="Emissions Data" />
                        <option value="Fuel Consumption" />
                        <option value="Other" />
                      </datalist>
                    </div>
                    <div>
                      <Label htmlFor="notes">Notes</Label>
                      <FormInput id="notes" placeholder="Add notes here" />
                    </div>
                    <div>
                      <Label>Drag and Drop Files</Label>
                      <div
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-muted-foreground transition-colors"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => {
                          e.preventDefault();
                          // Handle drop logic here
                        }}
                      >
                        <p className="text-sm text-muted-foreground">
                          Drag and drop your files here, or click to select
                          files.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          className="mt-4"
                        >
                          Choose Files
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <Button type="submit">Upload</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="input-history" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg p-3">
                  <CardTitle>Reporting Period</CardTitle>
                  <CardDescription className="text-green-100">
                    View and manage your input history.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex space-x-4">
                        <div>
                          <FormInput id="start-date-history" type="date" />
                        </div>
                        <div>
                          <FormInput id="end-date-history" type="date" />
                        </div>
                        <div className="flex items-end">
                          <Button>Filter</Button>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <FormInput
                          id="search"
                          placeholder="Search table..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Edit Date</TableHead>
                          <TableHead>Data Capturer</TableHead>
                          <TableHead>Activity Type</TableHead>
                          <TableHead>Docs</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredData.map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.editDate}</TableCell>
                            <TableCell>{row.dataCapturer}</TableCell>
                            <TableCell>{row.activityType}</TableCell>
                            <TableCell>{row.docs}</TableCell>
                            <TableCell>{row.status}</TableCell>
                            <TableCell>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="trace-source" className="space-y-6">
              <Card className="bg-white border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg p-3">
                  <CardTitle>Trace Source</CardTitle>
                  <CardDescription className="text-green-100">
                    Trace the source of your emissions.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div className="flex space-x-4">
                        <div>
                          <FormInput id="start-date-trace" type="date" />
                        </div>
                        <div>
                          <FormInput id="end-date-trace" type="date" />
                        </div>
                        <div className="flex items-end">
                          <Button>Filter</Button>
                        </div>
                      </div>
                      <div className="flex items-end">
                        <FormInput
                          id="search-trace"
                          placeholder="Search table..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
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
                          <TableRow key={index}>
                            <TableCell>{row.name}</TableCell>
                            <TableCell>{row.editDate}</TableCell>
                            <TableCell>{row.userName}</TableCell>
                            <TableCell>{row.value}</TableCell>
                            <TableCell>{row.emissions}</TableCell>
                            <TableCell>{row.costUom}</TableCell>
                            <TableCell>{row.type}</TableCell>
                            <TableCell>{row.activity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
