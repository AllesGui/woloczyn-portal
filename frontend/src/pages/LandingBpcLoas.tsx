import { useEffect } from 'react';
import { CheckCircle2, Lock, FileText, User } from 'lucide-react';

export default function LandingBpcLoas() {
    useEffect(() => {
        document.title = "Direito ao BPC LOAS";
    }, []);

    const whatsappLink = "https://wa.me/5551991860933?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20uma%20an%C3%A1lise%20sobre%20o%20direito%20ao%20BPC%20LOAS.";

    return (
        <div className="min-h-screen bg-[#F6F6F6] font-serif flex flex-col">
            {/* Header Section with Fake Background Fade. We use a dark color as base and the image overlay. */}
            <div className="relative w-full overflow-hidden bg-[#162332]">
                <div
                    className="absolute inset-0 z-0 opacity-80 mix-blend-luminosity bg-center md:bg-right"
                    style={{
                        backgroundImage: "url('/landingpagefilha.jpeg')",
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat"
                    }}
                >
                </div>
                {/* The actual color fade that overlays the image on the left side so text is readable */}
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-[#162332] via-[#162332]/50 to-transparent hidden md:block"></div>
                <div className="absolute inset-0 z-0 bg-[#162332]/20 md:hidden"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 flex flex-col items-start text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif text-white mb-4 drop-shadow-md leading-snug">
                        Descubra se você tem <br className="hidden md:block" /> direito ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#EED789] to-[#D3AD5D] font-bold">BPC LOAS</span>
                    </h1>
                    <p className="text-base md:text-lg text-slate-300 mb-8 max-w-xl leading-relaxed drop-shadow-sm font-light">
                        Famílias com crianças ou adolescentes com <strong className="text-white font-medium">TEA ou TOD</strong> podem solicitar o benefício de até <strong className="text-white font-medium">um salário mínimo mensal.</strong>
                    </p>

                    {/* Top CTA */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex flex-col items-center justify-center self-center md:self-start bg-gradient-to-r from-[#EED789] via-[#D3AD5D] to-[#BE923C] hover:brightness-110 text-[#2D210F] font-bold px-10 py-5 w-auto rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] border border-[#F3E5AB]/60 text-center"
                    >
                        <div className="flex flex-col items-center justify-center">
                            <div className="flex items-center justify-center gap-2">
                                <span className="text-2xl">👉</span>
                                <span className="text-xl md:text-2xl leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                                    Fale conosco pelo WhatsApp
                                </span>
                                <span className="text-2xl invisible">👉</span>
                            </div>
                            <span className="text-xs font-medium opacity-80 mt-2 uppercase tracking-wider block">
                                Clique no botão abaixo
                            </span>
                        </div>
                    </a>
                </div>
            </div>

            {/* Main Content Card Wrapper */}
            <div className="w-full bg-[#F6F6F6] text-slate-900 pt-10 pb-4 md:pb-6 z-10 px-4 md:px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-serif text-center text-[#1A2534] mb-8 font-bold">
                        Veja se sua família pode se enquadrar:
                    </h2>

                    {/* The Card */}
                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-lg mb-8 border border-white">
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4">
                                <div className="bg-[#468266] rounded-full p-1 mt-1 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg md:text-xl text-[#3A4556] font-medium leading-relaxed">
                                    Criança ou adolescente com diagnóstico de <strong>Transtorno do Espectro Autista (TEA)</strong> ou <strong>Transtorno Opositivo Desafiador (TOD)</strong>;
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-[#468266] rounded-full p-1 mt-1 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg md:text-xl text-[#3A4556] font-medium leading-relaxed">
                                    Renda familiar por pessoa dentro dos critérios legais;
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-[#468266] rounded-full p-1 mt-1 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg md:text-xl text-[#3A4556] font-medium leading-relaxed">
                                    Dificuldades no dia a dia (comunicação, socialização, autonomia).
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center mb-2 mt-8">
                        <p className="text-lg md:text-xl text-[#3A4556] font-medium leading-relaxed mb-8">
                            Se identificou com esses pontos? <strong className="text-[#1A2534]">Vale a pena analisar seu caso.</strong> <br className="hidden md:block" />
                            Saiba que mesmo com requerimento anterior negado, é possível reavaliarmos o seu pedido.
                        </p>

                        <p className="text-lg md:text-xl text-[#3A4556] font-medium leading-relaxed mb-10">
                            Nosso escritório é especializado em <strong>direito previdenciário</strong>, e estamos prontos para te ajudar.
                        </p>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex flex-col items-center justify-center bg-gradient-to-r from-[#EED789] via-[#D3AD5D] to-[#BE923C] hover:brightness-110 text-[#2D210F] font-bold px-10 py-4 w-full md:w-auto min-w-[340px] rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-transform transform hover:scale-[1.02] active:scale-[0.98] border border-[#F3E5AB]/60"
                        >
                            <span className="text-xl md:text-xl flex items-center gap-2 drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)] text-center">
                                <span className="text-2xl">👉</span> Receba uma orientação rápida sobre o seu caso
                            </span>
                            <span className="text-sm font-medium opacity-80 mt-1">Fale agora no WhatsApp</span>
                        </a>
                    </div>
                </div>
            </div>

            {/* Objections / Beneficios */}
            <div className="w-full bg-[#F6F6F6] pt-8 pb-16 px-6 relative">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 z-0 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="flex flex-col items-center text-center">
                            <Lock className="w-12 h-12 text-[#3A4556] mb-4" strokeWidth={1} />
                            <h3 className="text-lg text-[#1A2534] font-bold mb-2">Total sigilo nas informações</h3>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <FileText className="w-12 h-12 text-[#3A4556] mb-4" strokeWidth={1} />
                            <h3 className="text-lg text-[#1A2534] font-bold mb-2">Explicação clara</h3>
                            <p className="text-sm text-slate-500 max-w-[200px]">sobre critérios e próximos passos</p>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <User className="w-12 h-12 text-[#3A4556] mb-4" strokeWidth={1} />
                            <h3 className="text-lg text-[#1A2534] font-bold mb-2">Análise individual do seu caso</h3>
                        </div>
                    </div>

                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <p className="text-lg md:text-xl text-[#3A4556] mb-4 leading-relaxed font-light">
                            Muitas famílias que têm direito ao benefício não solicitam por falta de informação ou orientação correta.
                        </p>
                        <p className="text-xl md:text-2xl text-[#1A2534] font-serif font-medium leading-relaxed">
                            Uma verificação simples pode esclarecer sua situação.
                        </p>
                    </div>

                    <div className="text-center">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex flex-col items-center justify-center bg-gradient-to-r from-[#EED789] via-[#D3AD5D] to-[#BE923C] hover:brightness-110 text-[#2D210F] font-bold px-10 py-5 w-auto rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)] transition-transform transform hover:scale-[1.02] active:scale-[0.98] border border-[#F3E5AB]/60 text-center"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-2xl">👉</span>
                                    <span className="text-xl md:text-2xl drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                                        Faça sua análise agora
                                    </span>
                                    <span className="text-2xl invisible">👉</span>
                                </div>
                                <span className="text-sm font-medium opacity-80 mt-1">Fale Conosco pelo WhatsApp</span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
