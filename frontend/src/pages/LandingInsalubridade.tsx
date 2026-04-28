import { useEffect } from 'react';
import { CheckCircle2, Lock, FastForward, User } from 'lucide-react';

export default function LandingInsalubridade() {
    useEffect(() => {
        document.title = "Direito ao Adicional de Insalubridade 40%";
    }, []);

    const whatsappLink = "https://wa.me/5551991860933?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20uma%20an%C3%A1lise%20sobre%20o%20adicional%20de%20insalubridade%20de%2040%25.";

    return (
        <div className="min-h-screen bg-[#F3F4F6] font-serif text-slate-800 flex flex-col">
            {/* Header Section (Inverted: Light Background with Image Fade) */}
            <div className="relative w-full overflow-hidden bg-white border-b border-slate-200">
                {/* Background Image */}
                <div 
                    className="absolute inset-0 z-0 opacity-60 mix-blend-multiply bg-center md:bg-right"
                    style={{
                        backgroundImage: "url('/landingpagefilha.jpeg')",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat"
                    }}
                >
                </div>
                {/* Light gradient fade over the image on the left side */}
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/90 to-transparent hidden md:block"></div>
                <div className="absolute inset-0 z-0 bg-white/20 md:hidden"></div>
                
                <div className="relative z-10 max-w-4xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif text-[#111827] leading-tight mb-6 drop-shadow-sm">
                        Você pode ter direito a 40% de <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] font-bold">Adicional de Insalubridade</span> <br className="hidden md:block"/> e está deixando dinheiro na mesa.
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-10 max-w-xl leading-relaxed">
                        Quem trabalha com <strong className="text-slate-900 font-medium">limpeza de banheiros ou coleta de lixo</strong> têm direito a receber o adicional de <strong>40% de insalubridade.</strong>
                    </p>

                    {/* Top CTA */}
                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-col items-center justify-center self-center md:self-start bg-gradient-to-r from-[#EED789] via-[#D3AD5D] to-[#BE923C] hover:brightness-110 text-[#2D210F] font-bold px-10 py-5 w-auto rounded-full shadow-[0_4px_15px_rgba(212,175,55,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-[#FFD700]/30 text-center"
                    >
                        <div className="flex flex-col items-center justify-center">
                            <span className="text-3xl mb-1">👉</span>
                            <span className="text-xl md:text-2xl leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                                Fale conosco pelo WhatsApp
                            </span>
                            <span className="text-xs font-medium opacity-80 mt-2 uppercase tracking-wider block">
                                Clique no botão abaixo
                            </span>
                        </div>
                    </a>
                </div>
            </div>

            {/* Main Content Card Wrapper (Inverted: Dark Background) */}
            <div className="w-full bg-[#111827] text-slate-100 py-16 shadow-[0_-10px_30px_rgba(0,0,0,0.6)] z-10 px-4 md:px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-serif text-center text-white mb-8 tracking-wide font-bold">
                        Verifique agora se você se encaixa:
                    </h2>
                    
                    <div className="bg-[#1F2937] rounded-3xl p-6 md:p-10 shadow-2xl mb-12 border border-slate-700">
                        <ul className="space-y-6">
                            <li className="flex items-start gap-4">
                                <CheckCircle2 className="w-8 h-8 text-[#98D8C1] shrink-0 mt-0.5 fill-[#064E3B]" strokeWidth={1.5} />
                                <span className="text-lg md:text-xl leading-relaxed text-slate-200">
                                    Limpa banheiros de uso coletivo (empresas, escolas, clínicas, hotéis, etc.);
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle2 className="w-8 h-8 text-[#98D8C1] shrink-0 mt-0.5 fill-[#064E3B]" strokeWidth={1.5} />
                                <span className="text-lg md:text-xl leading-relaxed text-slate-200">
                                    Faz recolhimento de lixo urbano ou interno;
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle2 className="w-8 h-8 text-[#98D8C1] shrink-0 mt-0.5 fill-[#064E3B]" strokeWidth={1.5} />
                                <span className="text-lg md:text-xl leading-relaxed text-slate-200">
                                    Tem contato com agentes biológicos (bactérias, vírus, resíduos);
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <CheckCircle2 className="w-8 h-8 text-[#98D8C1] shrink-0 mt-0.5 fill-[#064E3B]" strokeWidth={1.5} />
                                <span className="text-lg md:text-xl leading-relaxed text-slate-200">
                                    Não recebe insalubridade ou recebe abaixo de 40%.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-[#1E3A8A]/40 border-l-4 border-[#D4AF37] p-6 rounded-r-lg mb-12 shadow-sm">
                        <p className="text-lg text-slate-200 mb-2 leading-relaxed">
                            Se marcou 1 ou mais itens, <strong className="text-[#F3E5AB]">vale a pena analisar seu caso.</strong>
                        </p>
                        <p className="text-lg text-white font-bold leading-relaxed">
                            Esse adicional pode representar um aumento significativo de até R$648,50 no seu salário. Além de valores retroativos de até 5 anos.
                        </p>
                    </div>

                    <div className="text-center mb-16">
                        <a 
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#C5A017] hover:to-[#E3D59B] text-slate-900 font-bold px-8 py-4 w-full md:w-auto min-w-[320px] rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.2)] transition-transform transform hover:scale-[1.02] active:scale-[0.98] border border-[#FFD700]/30"
                        >
                            <span className="text-xl flex items-center"><span className="text-2xl mr-2">👉</span> Faça sua análise agora</span>
                            <span className="text-sm font-normal text-slate-800 opacity-90 mt-1">Descubra em minutos se tem direito</span>
                        </a>
                    </div>

                    {/* Objections / Beneficios (Inverted colors inside dark section) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="flex flex-col items-center text-center p-4 bg-[#1F2937] rounded-2xl border border-slate-700 shadow-sm">
                            <FastForward className="w-12 h-12 text-slate-400 mb-4 opacity-80" strokeWidth={1.5} />
                            <h3 className="text-lg font-bold text-white mb-2">Rápido e direto</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Atendimento sem burocracia</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-[#1F2937] rounded-2xl border border-slate-700 shadow-sm">
                            <User className="w-12 h-12 text-slate-400 mb-4 opacity-80" strokeWidth={1.5} />
                            <h3 className="text-lg font-bold text-white mb-2">Análise individual</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Consulta específica para você</p>
                        </div>
                        <div className="flex flex-col items-center text-center p-4 bg-[#1F2937] rounded-2xl border border-slate-700 shadow-sm">
                            <Lock className="w-12 h-12 text-slate-400 mb-4 opacity-80" strokeWidth={1.5} />
                            <h3 className="text-lg font-bold text-white mb-2">Total sigilo</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">Privacidade das suas informações</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Fechamento (Inverted: Light Background) */}
            <div className="w-full bg-[#E5E7EB] border-t border-slate-300 py-16 px-6 flex-grow flex flex-col justify-center items-center text-center shadow-[inset_0_10px_30px_rgba(0,0,0,0.05)]">
                <div className="max-w-2xl mx-auto">
                    <p className="text-lg md:text-xl text-slate-700 mb-4 font-light leading-relaxed">
                        Muitos trabalhadores exercem essa função por anos <strong>sem receber o que é devido.</strong>
                    </p>
                    <p className="text-xl md:text-2xl text-[#111827] font-serif mb-10 leading-relaxed">
                        Você pode estar perdendo dinheiro todos os meses e nem sabe. <br className="hidden md:block"/>
                        <span className="font-bold text-[#1E3A8A]">Faça uma verificação agora.</span>
                    </p>

                    <a 
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-col items-center justify-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] hover:from-[#C5A017] hover:to-[#E3D59B] text-slate-900 font-bold px-8 py-4 w-full md:w-auto min-w-[320px] rounded-full shadow-[0_4px_20px_rgba(212,175,55,0.4)] transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-[#FFD700]/30"
                    >
                        <span className="text-xl flex items-center"><span className="text-2xl mr-2">👉</span> Faça sua análise agora</span>
                        <span className="text-sm font-normal text-slate-800 opacity-90 mt-1">Clique aqui e fale conosco pelo WhatsApp</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
