
export function Footer() {
  return (
    <footer className="text-center p-6 bg-slate-200 text-slate-600 text-sm border-t border-slate-300">
      <p>
        &copy; {new Date().getFullYear()} LeetCode Study Helper. Happy Coding!
      </p>
      <p>Built with React, TypeScript & Tailwind CSS. Icons by Lucide.</p>
    </footer>
  );
}