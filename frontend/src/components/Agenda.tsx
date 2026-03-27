import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock types
interface Appointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  client: string;
  location?: string;
  description?: string;
  color?: string;
}

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({ title: '', client: '', time: '09:00', duration: 60 });

  // Load from local storage initially
  useEffect(() => {
    const saved = localStorage.getItem('@woloczyn:agenda');
    if (saved) {
      setAppointments(JSON.parse(saved));
    } else {
      // Mock data
      setAppointments([
        { id: '1', title: 'Reunião Inicial', client: 'João Silva', date: new Date().toISOString().split('T')[0], time: '10:00', duration: 60, color: 'bg-blue-500/20 border-blue-500/30 text-blue-300' },
        { id: '2', title: 'Assinatura', client: 'Maria Souza', date: new Date().toISOString().split('T')[0], time: '14:30', duration: 30, color: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' },
      ]);
    }
  }, []);

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday (Monday as start)
    return new Date(d.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);

  const weekDays = Array.from({ length: 5 }).map((_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(d.getDate() + i);
    return d;
  });

  const hours = Array.from({ length: 11 }).map((_, i) => i + 8); // 8:00 to 18:00

  const handlePrevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const handleNextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const openSlot = (date: Date, hour: number) => {
    setSelectedSlot({
      date: date.toISOString().split('T')[0],
      time: `${hour.toString().padStart(2, '0')}:00`
    });
    setFormData({ ...formData, time: `${hour.toString().padStart(2, '0')}:00` });
    setIsModalOpen(true);
  };

  const saveAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const newAppt: Appointment = {
      id: Math.random().toString(36).substr(2, 9),
      title: formData.title || 'Compromisso',
      client: formData.client,
      date: selectedSlot.date,
      time: formData.time,
      duration: Number(formData.duration),
      color: 'bg-brand-silver/10 border-brand-silver/20 text-brand-accent'
    };

    const updated = [...appointments, newAppt];
    setAppointments(updated);
    localStorage.setItem('@woloczyn:agenda', JSON.stringify(updated));
    setIsModalOpen(false);
    setFormData({ title: '', client: '', time: '09:00', duration: 60 });
  };

  const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-light text-brand-accent tracking-wide flex items-center gap-3">
            Agenda Jurídica
          </h2>
          <p className="text-brand-silver/50 text-sm mt-2 tracking-wide font-medium">
            Gerencie seus compromissos, audiências e reuniões.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={handleToday} className="px-4 py-2 text-xs font-bold uppercase tracking-widest text-brand-silver hover:text-white bg-white/5 border border-white/10 rounded-xl transition-all hover:bg-white/10">
            Hoje
          </button>
          <div className="flex items-center bg-white/5 border border-white/10 rounded-xl overflow-hidden p-1">
            <button onClick={handlePrevWeek} className="p-1.5 text-brand-silver/60 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Semana anterior">
              <ChevronLeft size={18} />
            </button>
            <span className="px-3 text-sm font-medium text-brand-silver min-w-[120px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <button onClick={handleNextWeek} className="p-1.5 text-brand-silver/60 hover:text-white hover:bg-white/10 rounded-lg transition-all" title="Próxima semana">
              <ChevronRight size={18} />
            </button>
          </div>
          <button onClick={() => { setSelectedSlot({ date: new Date().toISOString().split('T')[0], time: '09:00' }); setIsModalOpen(true); }} className="p-2.5 bg-brand-silver/10 hover:bg-brand-silver/20 border border-brand-silver/20 text-brand-accent rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-panel overflow-hidden flex-1 flex flex-col min-h-[600px] border border-white/5 shadow-2xl relative z-10">
        {/* Days Header */}
        <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr] border-b border-white/5 bg-black/20">
          <div className="p-3 border-r border-white/5"></div>
          {weekDays.map((date, i) => {
            const isToday = new Date().toDateString() === date.toDateString();
            return (
              <div key={i} className={`p-3 text-center border-r border-white/5 last:border-r-0 ${isToday ? 'bg-white/5' : ''}`}>
                <div className={`text-[10px] font-bold uppercase tracking-widest ${isToday ? 'text-brand-accent' : 'text-brand-silver/40'}`}>
                  {dayNames[date.getDay()]}
                </div>
                <div className={`text-xl mt-1 font-light ${isToday ? 'text-white' : 'text-brand-silver'}`}>
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time Grid */}
        <div className="flex-1 overflow-y-auto no-scrollbar relative min-h-[500px]">
          <div className="absolute inset-0 grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr]">
            {/* Hours Column */}
            <div className="border-r border-white/5 flex flex-col bg-brand-surface/30">
              {hours.map(hour => (
                <div key={hour} className="h-24 border-b border-white/5 relative flex items-start justify-center pt-2 shrink-0">
                  <span className="text-[10px] font-bold text-brand-silver/30">{hour}:00</span>
                </div>
              ))}
            </div>
            
            {/* Day Columns */}
            {weekDays.map((date, dayIdx) => (
              <div key={dayIdx} className="border-r border-white/5 last:border-r-0 relative pt-0">
                {hours.map(hour => (
                  <div
                    key={hour}
                    className="h-24 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group shrink-0"
                    onClick={() => openSlot(date, hour)}
                  >
                    {/* Hover indicator */}
                    <div className="opacity-0 group-hover:opacity-100 flex items-center justify-center h-full w-full">
                      <Plus size={16} className="text-brand-silver/20" />
                    </div>
                  </div>
                ))}

                {/* Render Appointments */}
                {appointments.filter(a => a.date === date.toISOString().split('T')[0]).map(appt => {
                  const hourParts = appt.time.split(':');
                  const startHour = parseInt(hourParts[0]);
                  const startMin = parseInt(hourParts[1] || '0');
                  
                  if (startHour < 8 || startHour > 18) return null; // Outside visible range

                  // Height of each hour cell is 96px (h-24)
                  const topOffset = ((startHour - 8) * 96) + ((startMin / 60) * 96);
                  const height = (appt.duration / 60) * 96;

                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={appt.id}
                      className={`absolute left-1 right-1 rounded-lg border p-2 text-xs overflow-hidden cursor-pointer hover:brightness-110 shadow-lg backdrop-blur-md z-10 ${appt.color || 'bg-white/10 border-white/20 text-white'}`}
                      style={{ top: `${topOffset}px`, height: `${Math.max(height, 30)}px` }}
                      onClick={(e) => { e.stopPropagation(); /* could open detail modal here */ }}
                    >
                      <div className="font-semibold truncate text-[10px] uppercase tracking-wide leading-tight">{appt.title}</div>
                      {height > 40 && (
                        <div className="opacity-70 truncate font-medium text-[10px] mt-0.5">{appt.time} • {appt.client}</div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-brand-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-brand-background">
                <h3 className="text-sm font-bold text-brand-accent tracking-widest uppercase">Novo Compromisso</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-brand-silver/50 hover:text-white transition-colors">
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={saveAppointment} className="p-6 space-y-5">
                <div>
                  <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Título do Compromisso</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm glass-input"
                    placeholder="Ex: Audiência Trabalhista"
                  />
                </div>
                
                <div>
                  <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Cliente / Processo</label>
                  <input
                    type="text"
                    value={formData.client}
                    onChange={e => setFormData({...formData, client: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm glass-input"
                    placeholder="Nome do cliente"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Horário</label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={e => setFormData({...formData, time: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm glass-input"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Duração (min)</label>
                    <select
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm appearance-none glass-input"
                    >
                      <option value="30">30 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="90">1h 30m</option>
                      <option value="120">2 horas</option>
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl py-3.5 text-sm font-bold tracking-widest uppercase transition-all mt-4 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  Confirmar Agendamento
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
