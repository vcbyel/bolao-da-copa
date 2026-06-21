import { grupos } from '../data/grupos';

import GroupCard from '../components/GroupCard';

export default function Rodada1() {
  const letraGrupos = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

  return (
    <div className="w-full ">
      <h1 className="text-4xl font-bold mb-8 text-center">Rodada 1 - Fase de Grupos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-32">
        {letraGrupos.map((letra) => (
          <GroupCard 
            key={letra} 
            grupo={grupos[letra]} 
            letra={letra}
          />
        ))}
      </div>
    </div>
  );
}
