"use client";

import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

// Sortable column component
function SortableColumn({ 
  id, 
  header, 
  isEditing, 
  editHeader, 
  setEditHeader, 
  onHeaderChange 
}: { 
  id: number; 
  header: string;
  isEditing: boolean;
  editHeader: string;
  setEditHeader: (value: string) => void;
  onHeaderChange: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableHead
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="bg-purple-50 cursor-move hover:bg-purple-100 text-purple-800 font-semibold text-xs min-w-[120px]"
    >
      {isEditing ? (
        <Input
          value={editHeader}
          onChange={(e) => setEditHeader(e.target.value)}
          onBlur={onHeaderChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onHeaderChange();
            }
          }}
          className="h-6 text-xs px-1 border-purple-300 focus:border-purple-500"
          autoFocus
        />
      ) : (
        <span className="truncate block">{header}</span>
      )}
    </TableHead>
  );
}

// Editable cell component
function EditableCell({
  value,
  onChange,
}: {
  value: any;
  onChange: (newValue: any) => void;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(String(value || ""));

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    onChange(editValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur();
    } else if (e.key === "Escape") {
      setEditValue(String(value || ""));
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <Input
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className="h-6 text-xs px-1 border-purple-300 focus:border-purple-500 w-full"
        autoFocus
      />
    );
  }

  return (
    <span
      onDoubleClick={handleDoubleClick}
      className="cursor-pointer hover:bg-purple-50 block truncate"
      title="Double-click to edit"
    >
      {value !== undefined ? String(value) : ""}
    </span>
  );
}

interface ExcelPreviewProps {
  file: File;
  onClose: () => void;
  onSubmit: (data: { headers: string[]; rows: any[]; selectedRows: number[] }) => void;
}

export default function ExcelPreview({ file, onClose, onSubmit }: ExcelPreviewProps) {
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [editableHeaders, setEditableHeaders] = useState<string[]>([]);
  const [editableCellData, setEditableCellData] = useState<any[][]>([]);
  const [columnOrder, setColumnOrder] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [editingHeaderIndex, setEditingHeaderIndex] = useState<number | null>(null);
  const [editHeaderValue, setEditHeaderValue] = useState("");

  useEffect(() => {
    const parseExcel = async () => {
      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length > 0) {
          const headers = jsonData[0].map((h: any) => String(h || ""));
          setExcelHeaders(headers);
          setEditableHeaders([...headers]);
          setExcelData(jsonData.slice(1, 11)); // Show first 10 rows
          setEditableCellData(jsonData.slice(1, 11).map(row => [...row])); // Copy for editing
          setColumnOrder(headers.map((_, index) => index));
        }
      } catch (error) {
        console.error("Error parsing Excel file:", error);
      } finally {
        setIsLoading(false);
      }
    };

    parseExcel();
  }, [file]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setColumnOrder((items) => {
        const oldIndex = items.indexOf(active.id as number);
        const newIndex = items.indexOf(over.id as number);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const toggleRowSelection = (rowIndex: number) => {
    setSelectedRows((prev) =>
      prev.includes(rowIndex)
        ? prev.filter((i) => i !== rowIndex)
        : [...prev, rowIndex]
    );
  };

  const toggleSelectAll = () => {
    if (excelData && selectedRows.length === excelData.length) {
      setSelectedRows([]);
    } else if (excelData) {
      setSelectedRows(excelData.map((_, index) => index));
    }
  };

  const startEditingHeader = (index: number) => {
    setEditingHeaderIndex(index);
    setEditHeaderValue(editableHeaders[index]);
  };

  const saveHeaderChange = () => {
    if (editingHeaderIndex !== null) {
      setEditableHeaders((prev) =>
        prev.map((h, i) => (i === editingHeaderIndex ? editHeaderValue : h))
      );
      setEditingHeaderIndex(null);
    }
  };

  const handleCellChange = (rowIndex: number, colIndex: number, newValue: any) => {
    setEditableCellData((prev) =>
      prev.map((row, i) => (i === rowIndex ? [...row.slice(0, colIndex), newValue, ...row.slice(colIndex + 1)] : row))
    );
  };

  const handleSubmit = () => {
    if (!excelData) return;

    const orderedHeaders = columnOrder.map((i) => editableHeaders[i]);
    const orderedRows = editableCellData.map((row) =>
      columnOrder.map((colIndex) => row[colIndex])
    );

    onSubmit({
      headers: orderedHeaders,
      rows: orderedRows,
      selectedRows: selectedRows,
    });
  };

  if (isLoading) {
    return (
      <div className="mt-4 p-4 text-center text-gray-500">
        Loading preview...
      </div>
    );
  }

  if (!excelData || excelData.length === 0) {
    return (
      <div className="mt-4 p-4 text-center text-gray-500">
        No data found in file
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-2">
        <Label className="text-sm font-medium text-gray-700">
          File Preview (click header to edit, drag to reorder, check to select rows, double-click cells to edit)
        </Label>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="default"
            size="sm"
            onClick={handleSubmit}
            disabled={selectedRows.length === 0}
            className="bg-purple-600 hover:bg-purple-700"
          >
            Submit Selected ({selectedRows.length})
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            Close Preview
          </Button>
        </div>
      </div>
      <div className="border rounded-lg overflow-auto max-h-96 bg-white/50 backdrop-blur-sm">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <Table>
            <TableHeader>
              <SortableContext
                items={columnOrder}
                strategy={horizontalListSortingStrategy}
              >
                <TableRow>
                  {columnOrder.map((colIndex) => (
                    <SortableColumn
                      key={colIndex}
                      id={colIndex}
                      header={editableHeaders[colIndex] || `Col ${colIndex + 1}`}
                      isEditing={editingHeaderIndex === colIndex}
                      editHeader={editHeaderValue}
                      setEditHeader={setEditHeaderValue}
                      onHeaderChange={saveHeaderChange}
                    />
                  ))}
                  <TableHead className="bg-purple-50 w-12">
                    <Checkbox
                      checked={excelData.length > 0 && selectedRows.length === excelData.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </TableHead>
                </TableRow>
              </SortableContext>
            </TableHeader>
            <TableBody>
              {excelData.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  className={selectedRows.includes(rowIndex) ? "bg-purple-50" : ""}
                >
                  {columnOrder.map((colIndex) => (
                    <TableCell
                      key={colIndex}
                      className="text-xs"
                    >
                      <EditableCell
                        value={editableCellData[rowIndex]?.[colIndex] ?? ""}
                        onChange={(newValue) => handleCellChange(rowIndex, colIndex, newValue)}
                      />
                    </TableCell>
                  ))}
                  <TableCell className="w-12">
                    <Checkbox
                      checked={selectedRows.includes(rowIndex)}
                      onCheckedChange={() => toggleRowSelection(rowIndex)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DndContext>
      </div>
      <div className="flex gap-4 mt-2 text-xs text-gray-500">
        <span>💡 Double-click column headers to rename</span>
        <span>💡 Drag headers to reorder columns</span>
        <span>💡 Double-click cells to edit values</span>
        <span>💡 Check boxes on the right to select rows</span>
      </div>
    </div>
  );
}
