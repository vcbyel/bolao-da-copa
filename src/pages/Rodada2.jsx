import { grupos } from '../data/grupos';
import GroupCard2 from '../components/GroupCard2';

export default function Rodada2() {
  const letraGrupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  return (
    <div className="w-full">
      <h1 className="text-4xl font-bold mb-8 text-center">Rodada 2 - Fase de Grupos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
        {letraGrupos.map((letra) => (
          <GroupCard2
          key={letra} 
          grupo={grupos[letra]} 
          letra={letra}
          />
        ))}
      </div>
    </div>
  );
}
