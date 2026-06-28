import {
  FiTarget,
  FiAward,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { FaCircleXmark } from "react-icons/fa6";
import { FaCheckCircle } from "react-icons/fa";

export default function BetStats({
  totalPoints,
  totalBets,
  exactBets,
  acertouGanhador,
  errou,
  pendingBets,
}) {
  const cards = [
    {
      title: "Pontos",
      value: totalPoints,
      icon: <FiAward size={28} />,
      color:
        "from-yellow-500/20 to-yellow-700/20 border-yellow-500",
    },
    {
      title: "Apostas",
      value: totalBets,
      icon: <FiTarget size={28} />,
      color:
        "from-blue-500/20 to-blue-700/20 border-blue-500",
    },
    {
      title: "Placar Exato",
      value: exactBets,
      icon: <FiCheckCircle size={28} />,
      color:
        "from-green-500/20 to-green-700/20 border-green-500",
    },
    {
      title: "Acertou Ganhador",
      value: acertouGanhador,
      icon: <FaCheckCircle size={28} />,
      color:
        "from-yellow-700 to-yellow-900 border-yellow-300",
    },
    {
      title: "Errou",
      value: errou,
      icon: <FaCircleXmark size={28} />,
      color:
        "from-red-500/20 to-red-700/20 border-red-500",
    },
    {
      title: "Pendentes",
      value: pendingBets,
      icon: <FiClock size={28} />,
      color:
        "from-orange-500/20 to-orange-700/20 border-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`
            rounded-2xl
            border
            ${card.color}
            bg-gradient-to-br
            p-5
            shadow-lg
            hover:scale-[1.03]
            transition-all
            duration-300
          `}
        >
          <div className="flex justify-between items-center mb-4">
            <span className="text-slate-300">
              {card.title}
            </span>

            {card.icon}
          </div>

          <h2 className="text-4xl font-bold text-white">
            {card.value}
          </h2>
        </div>
      ))}
    </div>
  );
}