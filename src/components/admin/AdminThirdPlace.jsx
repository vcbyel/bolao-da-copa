import { FiSave, FiInfo } from "react-icons/fi";

const THIRD_PLACE_SLOTS = [
  "r16_1",
  "r16_2",
  "r16_7",
  "r16_8",
  "r16_11",
  "r16_12",
  "r16_15",
  "r16_16",
];

const GROUP_OPTIONS = [
  { value: "A3", label: "Grupo A - 3o" },
  { value: "B3", label: "Grupo B - 3o" },
  { value: "C3", label: "Grupo C - 3o" },
  { value: "D3", label: "Grupo D - 3o" },
  { value: "E3", label: "Grupo E - 3o" },
  { value: "F3", label: "Grupo F - 3o" },
  { value: "G3", label: "Grupo G - 3o" },
  { value: "H3", label: "Grupo H - 3o" },
  { value: "I3", label: "Grupo I - 3o" },
  { value: "J3", label: "Grupo J - 3o" },
  { value: "K3", label: "Grupo K - 3o" },
  { value: "L3", label: "Grupo L - 3o" },
];

export default function AdminThirdPlace({
  thirdPlaceSlots,
  onSlotChange,
  onSave,
  saving,
}) {
  const filledSlots = Object.values(thirdPlaceSlots).filter(Boolean).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">3o Colocados</h1>
        <p className="text-gray-400 mt-1 text-sm">
          Configure quais terceiros colocados avancam para cada partida dos 16
          avos.
        </p>
      </div>

      {/* Info banner */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex items-start gap-3">
        <FiInfo className="text-blue-400 shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-blue-300">
          <p className="font-medium mb-1">Como funciona</p>
          <p className="text-blue-400/80">
            Selecione qual 3o colocado (de qual grupo) ira ocupar a vaga de
            adversario em cada partida dos 16 avos de final. Apos configurar,
            clique em salvar para atualizar o chaveamento.
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center gap-3">
        <div className="flex-1 bg-slate-700 rounded-full h-1.5">
          <div
            className="bg-yellow-400 h-1.5 rounded-full transition-all duration-500"
            style={{
              width: `${(filledSlots / THIRD_PLACE_SLOTS.length) * 100}%`,
            }}
          />
        </div>
        <span className="text-xs text-gray-400 shrink-0">
          {filledSlots}/{THIRD_PLACE_SLOTS.length} configurados
        </span>
      </div>

      {/* Slots grid */}
      <div className="grid md:grid-cols-2 gap-3">
        {THIRD_PLACE_SLOTS.map((slot) => {
          const hasValue = !!thirdPlaceSlots[slot];
          return (
            <div
              key={slot}
              className={`bg-slate-800/50 rounded-xl border p-4 transition ${
                hasValue
                  ? "border-green-500/20"
                  : "border-slate-700/50 border-dashed"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-semibold text-white">
                  Partida{" "}
                  <span className="text-yellow-400 font-mono">{slot}</span>
                </label>
                {hasValue && (
                  <span className="text-xs bg-green-500/15 text-green-400 px-2 py-0.5 rounded-full">
                    Configurado
                  </span>
                )}
              </div>
              <select
                value={thirdPlaceSlots[slot] || ""}
                onChange={(e) => onSlotChange(slot, e.target.value)}
                className="w-full bg-slate-700/80 text-white p-2.5 rounded-lg border border-slate-600 focus:border-yellow-400 focus:outline-none transition text-sm"
              >
                <option value="">Selecione o 3o colocado</option>
                {GROUP_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>

      {/* Save */}
      <button
        onClick={onSave}
        disabled={saving}
        className="bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition"
      >
        <FiSave size={18} />
        {saving ? "Salvando..." : "Salvar Chaveamento"}
      </button>
    </div>
  );
}
