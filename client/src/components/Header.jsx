import Logo from '../assets/img/logo-jpc.PNG';
import BotaoHeader from './BotaoHeader';
import { usePessoas } from '../hooks/usePessoas';

export default function Header({ responsavelAtivo, setResponsavelAtivo }) {
  const { pessoas } = usePessoas();

  // Botões: "Geral" + todos os nomes das pessoas
  const nomeBotoes = ["Geral", ...pessoas.map(p => p.nome)];

  const handleClick = (name) => {
    if (name === "Geral") {
      setResponsavelAtivo(null);
    } else {
      // Seleção única: se clicar no mesmo desmarca, senão marca só esse
      setResponsavelAtivo(responsavelAtivo === name ? null : name);
    }
  };

  return (
    <header className="flex max-w-7xl items-center mx-auto py-4 justify-between">
      <img className='w-20 h-auto' src={Logo} alt="logo-jpc" />
      <h1 className="text-5xl font-poppins text-white">Gestão de tarefas</h1>
      <div className='flex gap-4'>
        {nomeBotoes.map((btn) => (
          <BotaoHeader
            key={btn}
            name={btn}
            active={btn === "Geral" ? responsavelAtivo === null : responsavelAtivo === btn}
            setActive={handleClick}
          />
        ))}
      </div>
    </header>
  );
}
