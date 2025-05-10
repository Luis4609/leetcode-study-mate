interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => (
  <div className="w-full bg-slate-300 rounded-full h-2.5 dark:bg-slate-700 mt-2 mb-1">
    <div
      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full transition-all duration-500 ease-out"
      style={{ width: `${percentage}%` }}
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    ></div>
  </div>
);

export default ProgressBar;
