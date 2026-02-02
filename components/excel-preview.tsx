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

// Sortable column component
function SortableColumn({ id, header }: { id: number; header: string }) {
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
      className="bg-emerald-50 cursor-move hover:bg-emerald-100 text-emerald-800 font-semibold text-xs"
    >
      {header}
    </TableHead>
  );
}

interface ExcelPreviewProps {
  file: File;
  onClose: () => void;
}

export default function ExcelPreview({ file, onClose }: ExcelPreviewProps) {
  const [excelData, setExcelData] = useState<any[][] | null>(null);
  const [excelHeaders, setExcelHeaders] = useState<string[]>([]);
  const [columnOrder, setColumnOrder] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const parseExcel = async () => {
      try {
        const buffer = await file.arrayBuffer();
        const workbook = XLSX.read(buffer, { type: "array" });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

        if (jsonData.length > 0) {
          setExcelHeaders(jsonData[0].map((h: any) => String(h || "")));
          setExcelData(jsonData.slice(1, 11)); // Show first 10 rows
          setColumnOrder(jsonData[0].map((_, index) => index));
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
          File Preview (drag columns to reorder)
        </Label>
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
      <div className="border rounded-lg overflow-auto max-h-64 bg-white/50 backdrop-blur-sm">
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
                      header={excelHeaders[colIndex] || `Col ${colIndex + 1}`}
                    />
                  ))}
                </TableRow>
              </SortableContext>
            </TableHeader>
            <TableBody>
              {excelData.map((row, rowIndex) => (
                <TableRow key={rowIndex}>
                  {columnOrder.map((colIndex) => (
                    <TableCell key={colIndex} className="text-xs">
                      {row[colIndex] !== undefined ? String(row[colIndex]) : ""}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DndContext>
      </div>
    </div>
  );
}
