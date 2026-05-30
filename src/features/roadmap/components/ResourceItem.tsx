// src/features/Roadmap/components/ResourceItem.tsx
import React from "react";
import { BookOpen } from "lucide-react";
import type { Resource } from "@/shared/types"; // Adjusted path

interface ResourceItemProps {
  resource: Resource;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ resource }) => (
  <li className="flex items-center p-2 hover:bg-slate-950/40 rounded-md transition-all duration-150">
    <BookOpen size={15} className="mr-2.5 text-indigo-400 flex-shrink-0" />
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sky-400 hover:text-sky-350 hover:underline transition-colors duration-150 text-xs sm:text-sm break-words font-semibold"
    >
      {resource.name}
    </a>
  </li>
);

export default ResourceItem;
