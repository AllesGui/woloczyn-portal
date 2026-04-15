import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, X, Trash2, Loader2, RefreshCcw, User } from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../services/api';

// Types matched with DB
interface Appointment {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  duration: number; // minutes
  client: string;
  urgency?: string;
  description?: string;
  responsible_lawyer?: string;
  color?: string;
}

export default function Agenda() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({ 
    title: '', 
    client: '', 
    time: '09:00', 
    duration: 60, 
    urgency: 'Média', 
    description: '',
    responsible_lawyer: 'Natália' 
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/agenda');
      
      const processed = data.map((appt: any) => ({
        ...appt,
        date: new Date(appt.date).toISOString().split('T')[0],
        color: getUrgencyColor(appt.urgency)
      }));
      
      setAppointments(processed);
    } catch (err) {
      console.error("Erro ao carregar agenda:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const getStartOfWeek = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start
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
    setEditingId(null);
    setSelectedSlot({
      date: date.toISOString().split('T')[0],
      time: `${hour.toString().padStart(2, '0')}:00`
    });
    setFormData({ 
      title: '', 
      client: '', 
      time: `${hour.toString().padStart(2, '0')}:00`, 
      duration: 60, 
      urgency: 'Média', 
      description: '',
      responsible_lawyer: 'Natália'
    });
    setIsModalOpen(true);
  };

  const openEditModal = (appt: Appointment) => {
    setEditingId(appt.id);
    setSelectedSlot({ date: appt.date, time: appt.time });
    setFormData({
      title: appt.title,
      client: appt.client,
      time: appt.time,
      duration: appt.duration,
      urgency: appt.urgency || 'Média',
      description: appt.description || '',
      responsible_lawyer: appt.responsible_lawyer || 'Natália'
    });
    setIsModalOpen(true);
  };

  const deleteAppointment = async () => {
    if (!editingId) return;
    try {
      await api.delete(`/agenda/${editingId}`);
      setAppointments(prev => prev.filter(a => a.id !== editingId));
      setIsModalOpen(false);
    } catch (err) {
      alert("Erro ao excluir.");
    }
  };

  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'Alta') return 'bg-red-500/20 border-red-500/30 text-red-300';
    if (urgency === 'Média') return 'bg-brand-silver/10 border-brand-silver/20 text-brand-accent';
    return 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300';
  };

  const getLawyerBadge = (lawyer: string) => {
    if (lawyer === 'Natália') return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
  };

  const saveAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlot) return;

    const payload = {
      ...formData,
      date: selectedSlot.date,
      duration: Number(formData.duration)
    };

    try {
      if (editingId) {
        const { data } = await api.put(`/agenda/${editingId}`, payload);
        const updatedAppt = {
            ...data,
            date: new Date(data.date).toISOString().split('T')[0],
            color: getUrgencyColor(data.urgency)
        };
        setAppointments(prev => prev.map(a => a.id === editingId ? updatedAppt : a));
      } else {
        const { data } = await api.post('/agenda', payload);
        const newAppt = {
            ...data,
            date: new Date(data.date).toISOString().split('T')[0],
            color: getUrgencyColor(data.urgency)
        };
        setAppointments(prev => [...prev, newAppt]);
      }
      setIsModalOpen(false);
    } catch (err) {
      alert("Erro ao salvar.");
    }
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
            Gerencie compromissos e atribua advogados responsáveis.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={fetchEvents} className={`p-2 text-brand-silver/40 hover:text-white transition-all ${loading ? 'animate-spin-slow' : ''}`} title="Sincronizar">
            <RefreshCcw size={18} />
          </button>
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
          <button onClick={() => { 
            setEditingId(null);
            setSelectedSlot({ date: new Date().toISOString().split('T')[0], time: '09:00' }); 
            setFormData({ 
              title: '', 
              client: '', 
              time: '09:00', 
              duration: 60, 
              urgency: 'Média', 
              description: '',
              responsible_lawyer: 'Natália' 
            });
            setIsModalOpen(true); 
          }} className="p-2.5 bg-brand-silver/10 hover:bg-brand-silver/20 border border-brand-silver/20 text-brand-accent rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Plus size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="glass-panel overflow-hidden flex-1 flex flex-col min-h-[600px] border border-white/5 shadow-2xl relative z-10">
        
        {loading && appointments.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center bg-black/20">
            <Loader2 size={40} className="text-brand-accent animate-spin mb-4 opacity-50" />
            <p className="text-brand-silver/30 text-xs font-bold uppercase tracking-widest">Sincronizando Banco de Dados...</p>
          </div>
        ) : (
          <>
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
                      
                      if (startHour < 8 || startHour > 18) return null;

                      const topOffset = ((startHour - 8) * 96) + ((startMin / 60) * 96);
                      const height = (appt.duration / 60) * 96;

                      return (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          key={appt.id}
                          className={`absolute left-1.5 right-1.5 rounded-xl border p-2.5 text-xs overflow-hidden cursor-pointer hover:brightness-110 shadow-lg backdrop-blur-xl z-10 transition-all hover:scale-[1.02] flex flex-col justify-between ${appt.color || 'bg-brand-silver/10 border-brand-silver/20 text-brand-accent'}`}
                          style={{ top: `${topOffset}px`, height: `${Math.max(height, 46)}px` }}
                          onClick={(e) => { e.stopPropagation(); openEditModal(appt); }}
                        >
                          <div className="flex flex-col gap-1">
                            <div className="font-bold truncate text-[10px] uppercase tracking-wider leading-tight text-white/90">{appt.title}</div>
                            {height > 60 && (
                                <div className="opacity-60 truncate font-medium text-[9px] uppercase tracking-tighter">{appt.client}</div>
                            )}
                          </div>
                          
                          {/* Lawyer Badge */}
                          <div className={`mt-auto self-start px-2 py-0.5 rounded-md text-[8px] font-bold uppercase tracking-widest border ${getLawyerBadge(appt.responsible_lawyer || 'Natália')}`}>
                            {appt.responsible_lawyer || 'Natália'}
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Appointment Modal */}
      {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-md bg-brand-surface border border-white/10 rounded-2xl shadow-2xl overflow-hidden glass-panel"
            >
              <div className="flex items-center justify-between p-6 border-b border-white/5 bg-brand-background">
                <h3 className="text-sm font-bold text-brand-accent tracking-widest uppercase">
                  {editingId ? 'Editar Compromisso' : 'Novo Compromisso'}
                </h3>
                <div className="flex items-center gap-2">
                  {editingId && (
                    <button onClick={deleteAppointment} className="text-red-400 hover:text-red-300 transition-colors p-1" title="Excluir">
                      <Trash2 size={18} />
                    </button>
                  )}
                  <button onClick={() => setIsModalOpen(false)} className="text-brand-silver/50 hover:text-white transition-colors p-1">
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={saveAppointment} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                {/* Lawyer Selector */}
                <div>
                  <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Advogado Responsável</label>
                  <div className="grid grid-cols-2 gap-3">
                    {['Natália', 'Denis'].map(lawyer => (
                        <button
                            key={lawyer}
                            type="button"
                            onClick={() => setFormData({...formData, responsible_lawyer: lawyer})}
                            className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${formData.responsible_lawyer === lawyer ? 'bg-white/10 border-brand-accent text-brand-accent shadow-lg' : 'bg-black/20 border-white/5 text-brand-silver/40 hover:bg-white/5'}`}
                        >
                            <User size={14} />
                            {lawyer}
                        </button>
                    ))}
                  </div>
                </div>

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
                  <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Cliente / Entidade</label>
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
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm glass-input cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Duração (min)</label>
                    <select
                      value={formData.duration}
                      onChange={e => setFormData({...formData, duration: Number(e.target.value)})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm appearance-none glass-input cursor-pointer"
                    >
                      <option value="30" className="bg-[#172229] text-white">30 minutos</option>
                      <option value="60" className="bg-[#172229] text-white">1 hora</option>
                      <option value="90" className="bg-[#172229] text-white">1h 30m</option>
                      <option value="120" className="bg-[#172229] text-white">2 horas</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Prioridade / Urgência</label>
                    <select
                      value={formData.urgency}
                      onChange={e => setFormData({...formData, urgency: e.target.value})}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm appearance-none glass-input cursor-pointer"
                    >
                      <option value="Baixa" className="bg-[#172229] text-white">Baixa</option>
                      <option value="Média" className="bg-[#172229] text-white">Média</option>
                      <option value="Alta" className="bg-[#172229] text-white">Alta</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-brand-silver/50 uppercase tracking-widest mb-2">Descrição / Notas</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-brand-silver focus:border-brand-silver focus:ring-1 focus:ring-brand-silver outline-none text-sm glass-input resize-none"
                    placeholder="Detalhes do compromisso, links de reunião, etc..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white/10 hover:bg-white/15 border border-white/20 text-white rounded-xl py-3.5 text-sm font-bold tracking-widest uppercase transition-all mt-6 shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                >
                  {editingId ? 'Salvar Alterações' : 'Confirmar Agendamento'}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
    </motion.div>
  );
}
