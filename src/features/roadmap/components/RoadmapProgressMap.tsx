// src/features/roadmap/components/RoadmapProgressMap.tsx
import React from "react";
import type { Topic } from "@/shared/types";
import { CheckCircle2, Circle, Play, MapPin, Compass } from "lucide-react";

interface RoadmapProgressMapProps {
  topics: Topic[];
  activeTopicId: string | null;
  onSelectTopic: (topicId: string | null) => void;
}

const RoadmapProgressMap: React.FC<RoadmapProgressMapProps> = ({
  topics,
  activeTopicId,
  onSelectTopic,
}) => {
  return (
    <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 backdrop-blur-md shadow-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-2">
        <div className="flex items-center gap-2">
          <Compass className="text-sky-400" size={18} />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
            Mapa de Aprendizaje
          </span>
        </div>
        <button
          onClick={() => onSelectTopic(null)}
          className={`px-2 py-1 text-[10px] font-bold rounded transition-all uppercase tracking-wide border ${
            activeTopicId === null
              ? "bg-sky-950/60 border-sky-800/50 text-sky-400"
              : "bg-slate-950/40 border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-slate-200"
          }`}
        >
          Ver Todos
        </button>
      </div>

      {/* Desktop Vertical Path Timeline */}
      <div className="hidden md:flex flex-col gap-5 relative pl-2 pr-1">
        {topics.map((topic, index) => {
          const completedCount = topic.subTopics.filter((st) => st.completed).length;
          const totalCount = topic.subTopics.length;
          const isCompleted = totalCount > 0 && completedCount === totalCount;
          const isInProgress = totalCount > 0 && completedCount > 0 && completedCount < totalCount;
          const isActive = activeTopicId === topic.id;

          // Determine line styling to the next node
          const hasNext = index < topics.length - 1;
          const nextTopic = hasNext ? topics[index + 1] : null;
          const nextCompletedCount = nextTopic ? nextTopic.subTopics.filter((st) => st.completed).length : 0;
          const isLineActive = isCompleted && nextCompletedCount > 0;

          return (
            <div key={topic.id} className="relative flex items-start gap-4 group">
              {/* Connecting line */}
              {hasNext && (
                <div
                  className={`absolute left-[17px] top-[34px] bottom-[-24px] w-0.5 transition-all duration-300 ${
                    isLineActive
                      ? "bg-gradient-to-b from-green-500 to-sky-500"
                      : isCompleted
                      ? "bg-green-500/30"
                      : "bg-slate-800"
                  }`}
                />
              )}

              {/* Node Indicator Indicator */}
              <button
                onClick={() => onSelectTopic(topic.id)}
                className={`relative z-10 w-9 h-9 rounded-full border-2 flex items-center justify-center transition-all duration-300 shrink-0 ${
                  isActive
                    ? "bg-sky-950 border-sky-400 text-sky-300 shadow-md shadow-sky-500/10 scale-110"
                    : isCompleted
                    ? "bg-green-950/60 border-green-500 text-green-300 hover:border-green-400"
                    : isInProgress
                    ? "bg-indigo-950/40 border-indigo-500/80 text-indigo-300 hover:border-indigo-400"
                    : "bg-slate-950 border-slate-800 text-slate-500 hover:border-slate-700"
                }`}
                title={`Ver detalles de ${topic.title}`}
              >
                {isActive ? (
                  <MapPin size={16} className="animate-pulse" />
                ) : isCompleted ? (
                  <CheckCircle2 size={16} />
                ) : isInProgress ? (
                  <Play size={12} className="ml-0.5" />
                ) : (
                  <Circle size={10} />
                )}
              </button>

              {/* Text label details */}
              <button
                onClick={() => onSelectTopic(topic.id)}
                className="flex flex-col text-left group-hover:translate-x-0.5 transition-transform duration-200"
              >
                <span
                  className={`text-xs font-bold transition-colors ${
                    isActive
                      ? "text-sky-400"
                      : "text-slate-350 group-hover:text-slate-100"
                  }`}
                >
                  {topic.title}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider font-mono">
                  {completedCount} / {totalCount} sub-temas
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Mobile Horizontal Scrolling track */}
      <div className="flex md:hidden items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
        {topics.map((topic) => {
          const completedCount = topic.subTopics.filter((st) => st.completed).length;
          const totalCount = topic.subTopics.length;
          const isCompleted = totalCount > 0 && completedCount === totalCount;
          const isInProgress = totalCount > 0 && completedCount > 0 && completedCount < totalCount;
          const isActive = activeTopicId === topic.id;

          return (
            <button
              key={topic.id}
              onClick={() => onSelectTopic(topic.id)}
              className={`flex items-center gap-2 p-2 px-3 rounded-lg border-2 transition-all duration-300 shrink-0 text-left ${
                isActive
                  ? "bg-sky-950/60 border-sky-400 text-sky-200"
                  : isCompleted
                  ? "bg-green-950/30 border-green-500/40 text-green-300"
                  : isInProgress
                  ? "bg-indigo-950/20 border-indigo-500/40 text-indigo-300"
                  : "bg-slate-950/40 border-slate-850 text-slate-400"
              }`}
            >
              <div className="shrink-0">
                {isActive ? (
                  <MapPin size={12} className="text-sky-400" />
                ) : isCompleted ? (
                  <CheckCircle2 size={12} className="text-green-500" />
                ) : isInProgress ? (
                  <Play size={10} className="text-indigo-400 ml-0.5" />
                ) : (
                  <Circle size={8} className="text-slate-600" />
                )}
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-bold whitespace-nowrap">{topic.title}</span>
                <span className="text-[8px] font-mono text-slate-500">
                  {completedCount}/{totalCount}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapProgressMap;
