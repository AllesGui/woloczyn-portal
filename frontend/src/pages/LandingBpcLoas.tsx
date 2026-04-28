import React, { useEffect } from 'react';
import { CheckCircle2, Lock, FileText, User } from 'lucide-react';

export default function LandingBpcLoas() {
    useEffect(() => {
        document.title = "Direito ao BPC LOAS";
    }, []);

    const whatsappLink = "https://wa.me/5551991860933?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20uma%20an%C3%A1lise%20sobre%20o%20direito%20ao%20BPC%20LOAS.";

    return (
        <div className="min-h-screen bg-[#F6F6F6] font-sans flex flex-col">
            {/* Header Section with Fake Background Fade. We use a dark color as base and the image overlay. */}
            <div className="relative w-full overflow-hidden bg-[#162332]">
                <div
                    className="absolute inset-0 z-0 opacity-80 mix-blend-luminosity"
                    style={{
                        backgroundImage: "url('/landingpagefilha.jpeg')",
                        backgroundPosition: "center right",
                        backgroundSize: "cover", /* Clean image, just cover the space */
                        backgroundRepeat: "no-repeat"
                    }}
                >
                </div>
                {/* The actual color fade that overlays the image on the left side so text is readable */}
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#162332] via-[#162332]/90 to-transparent w-full md:w-[70%]"></div>
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#162332] via-[#162332]/80 to-transparent md:hidden"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 flex flex-col items-start text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif text-white mb-4 drop-shadow-md leading-snug">
                        Descubra se seu filho pode ter <br className="hidden md:block" /> direito a um benefício <br className="hidden md:block" /> mensal do INSS 🧩
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed drop-shadow-sm font-light">
                        Famílias com crianças ou adolescentes com <strong className="text-white font-medium">TEA ou TOD</strong> têm direito a solicitar um <strong className="text-white font-medium">benefício de até 1 salário mínimo</strong>, mesmo nunca tendo contribuído para o INSS.
                    </p>

                    {/* Top CTA */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-col items-center justify-center bg-gradient-to-r from-[#EED789] via-[#D3AD5D] to-[#BE923C] hover:brightness-110 text-[#2D210F] font-bold px-10 py-3 w-full md:w-auto min-w-[340px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-[#F3E5AB]/60"
                    >
                        <span className="text-xl md:text-2xl flex items-center gap-2 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                            <span className="text-2xl">👉</span> Verificar meu direito agora
                        </span>
                        <span className="text-xs font-medium opacity-80 mt-1 uppercase tracking-wider">Atendimento rápido e sigiloso</span>
                    </a>
                </div>
            </div>

            {/* Main Content Card Wrapper */}
            <div className="w-full bg-[#F6F6F6] text-slate-900 py-10 z-10 px-4 md:px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-serif text-center text-[#1A2534] mb-8 font-bold">
                        Veja se você se encaixa nos critérios:
                    </h2>

                    {/* The Card */}
                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg mb-8 border border-white">
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4">
                                <div className="bg-[#468266] rounded-full p-1 mt-1">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg md:text-xl text-[#3A4556] font-medium">
                                    <strong>Diagnóstico</strong> de TEA ou TOD
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-[#468266] rounded-full p-1 mt-1">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg md:text-xl text-[#3A4556] font-medium">
                                    <strong>Renda familiar</strong> dentro dos critérios legais
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-[#468266] rounded-full p-1 mt-1">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-lg md:text-xl text-[#3A4556] font-medium">
                                        <strong>Dificuldades no dia a dia</strong>
                                    </span>
                                    <span className="text-[#64748B] text-base mt-1">
                                        (comunicação, autonomia, socialização)
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-lg md:text-xl text-[#3A4556] font-medium">
                            Mesmo quando o pedido já tenha sido <strong className="text-[#1A2534]">negado</strong>, é possível reavaliar.
                        </p>
                    </div>
                </div>
            </div>

            {/* Dark middle section */}
            <div className="w-full bg-[#162332] text-white py-12 px-6 shadow-inner text-center">
                <div className="max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-serif text-[#F2FAFF] mb-2 font-medium tracking-wide">
                        Escritório especializado em Direito Previdenciário
                    </h2>
                    <p className="text-slate-400 mb-8 font-light text-lg">
                        Atendimento focado em benefícios assistenciais (BPC/LOAS)
                    </p>

                    <div className="flex flex-col md:flex-row justify-center gap-6 mb-10">
                        <div className="flex items-center justify-center gap-2 text-[#D3AD5D]">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="text-white font-medium">+1.200 <span className="font-light">casos atendidos</span></span>
                        </div>
                        <div className="flex items-center justify-center gap-2 text-[#D3AD5D]">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="text-white font-medium">+10 anos <span className="font-light">de experiência</span></span>
                        </div>
                    </div>

                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center bg-gradient-to-r from-[#EED789] via-[#D3AD5D] to-[#BE923C] hover:brightness-110 text-[#2D210F] font-bold px-10 py-4 w-full md:w-auto min-w-[340px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-transform transform hover:scale-[1.02] active:scale-[0.98] border border-[#F3E5AB]/60"
                    >
                        <span className="text-xl md:text-2xl flex items-center gap-3 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                            <span className="text-2xl">👉</span> Falar no WhatsApp agora
                        </span>
                    </a>
                </div>
            </div>

            {/* Objections / Beneficios */}
            <div className="w-full bg-[#F6F6F6] py-16 px-6 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <h3 className="text-center text-xl text-[#1A2534] font-medium mb-10">
                        Tire suas dúvidas com <strong>especialistas</strong> no direito previdenciário
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        <div className="flex flex-col items-center text-center">
                            <Lock className="w-10 h-10 text-[#3A4556] mb-4" strokeWidth={1} />
                            <h3 className="text-[#1A2534] font-bold mb-2">Sigilo total</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">Discrição e segurança total das informações</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <FileText className="w-10 h-10 text-[#3A4556] mb-4" strokeWidth={1} />
                            <h3 className="text-[#1A2534] font-bold mb-2">Explicação clara</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">Critérios e próximos passos explicados de forma simples</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <User className="w-10 h-10 text-[#3A4556] mb-4" strokeWidth={1} />
                            <h3 className="text-[#1A2534] font-bold mb-2">Análise individual</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">Seu caso avaliado de forma individual por um advogado</p>
                        </div>
                    </div>

                    <div className="text-center">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center bg-gradient-to-r from-[#EED789] via-[#D3AD5D] to-[#BE923C] hover:brightness-110 text-[#2D210F] font-bold px-10 py-4 w-full md:w-auto min-w-[340px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-transform transform hover:scale-[1.02] active:scale-[0.98] border border-[#F3E5AB]/60"
                        >
                            <span className="text-xl md:text-2xl flex items-center gap-3 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                                <span className="text-2xl">👉</span> Quero analisar meu caso agora
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
