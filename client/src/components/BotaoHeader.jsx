export default function BotaoHeader({ name, active, setActive }) {
  const activeClasses = "bg-blue-600 shadow-lg shadow-blue-500/50 scale-105";
  const inactiveClasses = "bg-blue-500 hover:bg-blue-600 shadow-md shadow-blue-500/30";

  return (
    <button
      className={`${active ? activeClasses : inactiveClasses} py-3 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform text-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
      onClick={() => setActive(name)}
    >
      {name}
    </button>
  );
}
