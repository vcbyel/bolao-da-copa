import {
  FiHome,
  FiList,
  FiAward,
  FiGitBranch,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { useState } from "react";

const sections = [
  { id: "dashboard", label: "Dashboard", icon: FiHome },
  { id: "matches", label: "Partidas", icon: FiList },
  { id: "thirdPlace", label: "3o Colocados", icon: FiAward },
  { id: "bracket", label: "Chaveamento", icon: FiGitBranch },
];

export default function AdminSidebar({ activeSection, onSectionChange }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col ${
          collapsed ? "w-16" : "w-56"
        } bg-slate-900/80 backdrop-blur border-r border-slate-700/50 shrink-0 transition-all duration-300`}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          {!collapsed && (
            <h2 className="text-sm font-bold text-yellow-400 uppercase tracking-wider">
              Painel Admin
            </h2>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-gray-400 hover:text-white transition"
          >
            {collapsed ? (
              <FiChevronRight size={16} />
            ) : (
              <FiChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 p-2 space-y-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                title={collapsed ? section.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all ${
                  isActive
                    ? "bg-yellow-500/15 text-yellow-400 font-semibold border border-yellow-500/20"
                    : "text-gray-400 hover:bg-slate-800 hover:text-white border border-transparent"
                } ${collapsed ? "justify-center" : ""}`}
              >
                <Icon size={18} className="shrink-0" />
                {!collapsed && (
                  <span className="text-sm">{section.label}</span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Mobile horizontal tabs */}
      <div className="lg:hidden flex overflow-x-auto gap-1 p-2 bg-slate-900/80 backdrop-blur border-b border-slate-700/50 sticky top-0 z-10">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => onSectionChange(section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap text-sm transition ${
                isActive
                  ? "bg-yellow-500/15 text-yellow-400 font-semibold"
                  : "text-gray-400 hover:bg-slate-800"
              }`}
            >
              <Icon size={16} />
              {section.label}
            </button>
          );
        })}
      </div>
    </>
  );
}
