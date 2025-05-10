// src/features/Roadmap/components/ResourceItem.tsx
import React from "react";
import { BookOpen } from "lucide-react";
import type { Resource } from "@/shared/types"; // Adjusted path

interface ResourceItemProps {
  resource: Resource;
}

const ResourceItem: React.FC<ResourceItemProps> = ({ resource }) => (
  <li className="flex items-center p-3 hover:bg-slate-100 rounded-md transition-colors duration-150">
    <BookOpen size={18} className="mr-3 text-indigo-500 flex-shrink-0" />
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-indigo-600 hover:text-indigo-800 hover:underline transition-colors duration-150 text-sm sm:text-base break-words"
    >
      {resource.name}
    </a>
  </li>
);

export default ResourceItem;
