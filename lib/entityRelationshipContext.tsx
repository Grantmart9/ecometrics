"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface EntityRelationship {
  id: string;
  name: string;
}

interface EntityRelationshipContextType {
  selectedEntityRelationship: string;
  selectedEntityId: string;
  setSelectedEntityRelationship: (name: string, id: string) => void;
}

const EntityRelationshipContext = createContext<EntityRelationshipContextType | undefined>(undefined);

export function EntityRelationshipProvider({ children }: { children: ReactNode }) {
  const [selectedEntityRelationship, setSelectedEntityRelationship] = useState<string>("");
  const [selectedEntityId, setSelectedEntityId] = useState<string>("");

  const handleSetEntityRelationship = (name: string, id: string) => {
    setSelectedEntityRelationship(name);
    setSelectedEntityId(id);
  };

  return (
    <EntityRelationshipContext.Provider value={{
      selectedEntityRelationship,
      selectedEntityId,
      setSelectedEntityRelationship: handleSetEntityRelationship
    }}>
      {children}
    </EntityRelationshipContext.Provider>
  );
}

export function useEntityRelationship() {
  const context = useContext(EntityRelationshipContext);
  if (context === undefined) {
    throw new Error("useEntityRelationship must be used within an EntityRelationshipProvider");
  }
  return context;
}