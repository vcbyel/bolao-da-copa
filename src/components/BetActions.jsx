import { FiCheck, FiTrash2 } from 'react-icons/fi';
import { useBets } from '../contexts/BetContext';

export default function BetActions() {
  const { getTotalBets, clearAllBets, getAllBets } = useBets();
  const totalBets = getTotalBets();
  const bets = getAllBets();

  const handleFinishBet = () => {
    if (totalBets === 0) {
      alert('Você não fez nenhuma aposta ainda!');
      return;
    }

    const confirmation = window.confirm(
      `Você tem ${totalBets} apostas. Deseja finalizar?`
    );

    if (confirmation) {
      console.log('Apostas finalizadas:', bets);
      alert('✅ Suas apostas foram registradas com sucesso!');
      // Aqui você poderia enviar as apostas para um servidor
      // ou salvá-las no localStorage
    }
  };

  const handleClearAll = () => {
    if (totalBets === 0) {
      alert('Não há apostas para limpar');
      return;
    }

    const confirmation = window.confirm(
      'Deseja realmente limpar todas as apostas?'
    );

    if (confirmation) {
      clearAllBets();
      alert('✨ Todas as apostas foram limpas');
    }
  };

  return (
    <div className="fixed bottom-8 right-8 flex gap-4 items-center">
      {/* Badge de apostas */}
      <div className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-bold text-lg shadow-lg">
        {totalBets} apostas
      </div>

      {/* Botão Limpar */}
      <button
        onClick={handleClearAll}
        disabled={totalBets === 0}
        className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
      >
        <FiTrash2 size={20} />
        Limpar
      </button>

      {/* Botão Finalizar Aposta */}
      <button
        onClick={handleFinishBet}
        disabled={totalBets === 0}
        className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
      >
        <FiCheck size={20} />
        Finalizar Aposta
      </button>
    </div>
  );
}
