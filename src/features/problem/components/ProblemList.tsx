import type { LeetCodeProblem } from "@/shared/types";

import { Edit, ExternalLink, Star } from "lucide-react";
import { Link } from "react-router-dom";

const ProblemListItem: React.FC<{
  problem: LeetCodeProblem;
}> = ({ problem }) => {
  const difficultyColor = {
    Easy: "text-green-400",
    Medium: "text-yellow-400",
    Hard: "text-red-400",
  };

  console.log("ProblemId:", problem.id);

  return (
    <div className="flex justify-between items-center p-3 bg-slate-700 hover:bg-slate-600 rounded-md transition-colors duration-150 my-1.5">
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          {/* Use Link component here for navigation */}
          <Link
            to={`/problem/${problem.id}`}
            className="text-sm font-medium text-sky-400 hover:text-sky-300 truncate mr-2"
            title={`Solve ${problem.name}`}
          >
            {problem.name}
          </Link>
          {problem.isPriority && (
            <Star size={14} className="text-yellow-400 fill-yellow-500 ml-1" />
          )}
        </div>
        <p
          className={`text-xs ${
            difficultyColor[
              problem.difficulty as keyof typeof difficultyColor
            ] || "text-slate-400"
          }`}
        >
          {problem.difficulty}
        </p>
        {problem.tags && problem.tags.length > 0 && (
          <div className="mt-1 flex flex-wrap gap-1">
            {problem.tags.slice(0, 3).map(
              (
                tag // Show a few tags
              ) => (
                <span
                  key={tag}
                  className="px-1.5 py-0.5 text-xs bg-slate-600 text-slate-300 rounded-full"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <a
          href={problem.url}
          target="_blank"
          rel="noopener noreferrer"
          title="View on LeetCode"
          className="p-1.5 text-slate-400 hover:text-sky-400 rounded-md hover:bg-slate-500 transition-colors"
          onClick={(e) => e.stopPropagation()} // Prevent link click from triggering outer navigation if any
        >
          <ExternalLink size={16} />
        </a>
        <Link
          to={`/problem/${problem.id}`}
          className="p-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md transition-colors"
          title={`Open editor for ${problem.name}`}
        >
          <Edit size={16} /> {/* Or a "Solve" or "Open" icon/text */}
        </Link>
      </div>
    </div>
  );
};

export default ProblemListItem;
