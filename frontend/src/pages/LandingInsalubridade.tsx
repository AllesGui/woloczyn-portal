import { useEffect, useState, useRef } from 'react';
import { CheckCircle2, Lock, FastForward, User } from 'lucide-react';

export default function LandingInsalubridade() {
    const [showVideo, setShowVideo] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        document.title = "Direito ao Adicional de Insalubridade 40%";
    }, []);

    useEffect(() => {
        let timer: any;
        if (!showVideo) {
            // Show image for 10 seconds, then switch to video
            timer = setTimeout(() => {
                setShowVideo(true);
            }, 10000);
        }
        return () => clearTimeout(timer);
    }, [showVideo]);

    useEffect(() => {
        if (showVideo && videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play().catch(err => console.log("Video play interrupted:", err));
        }
    }, [showVideo]);

    const handleVideoEnded = () => {
        setShowVideo(false);
    };

    const whatsappLink = "https://wa.me/5551991860933?text=Ol%C3%A1%2C%20gostaria%20de%20fazer%20uma%20an%C3%A1lise%20sobre%20o%20adicional%20de%20insalubridade%20de%2040%25.";

    return (
        <div className="min-h-screen bg-[#111827] font-serif flex flex-col">
            {/* Header Section (White theme) */}
            <div className="relative w-full overflow-hidden bg-white">
                <div
                    className={`absolute inset-0 z-0 opacity-20 mix-blend-multiply transition-opacity duration-1000 ${showVideo ? 'opacity-0' : 'opacity-60'}`}
                    style={{
                        backgroundImage: "url('/landingpagelimpeza.jpg')",
                        backgroundSize: "cover",
                        backgroundPosition: "center 15%",
                        backgroundRepeat: "no-repeat"
                    }}
                >
                </div>

                <video
                    ref={videoRef}
                    className={`absolute inset-0 z-0 w-full h-full object-cover mix-blend-multiply transition-opacity duration-1000 ${showVideo ? 'opacity-60' : 'opacity-0'}`}
                    src="/videolimpeza.mp4"
                    muted
                    playsInline
                    autoPlay={showVideo}
                    onEnded={handleVideoEnded}
                />
                {/* Vignette/Fade effect around the image to blend with white background */}
                <div className="absolute inset-0 z-0 bg-[radial-gradient(circle,transparent_40%,white_100%)]"></div>

                {/* Light gradient fade over the image on the left side */}
                <div className="absolute inset-0 z-0 bg-gradient-to-r from-white via-white/80 to-transparent hidden md:block"></div>
                <div className="absolute inset-0 z-0 bg-white/70 md:hidden"></div>

                <div className="relative z-10 max-w-4xl mx-auto px-6 pt-16 pb-12 md:pt-24 md:pb-16 flex flex-col items-start text-left">
                    <h1 className="text-4xl md:text-5xl lg:text-5xl font-serif text-[#111827] mb-4 drop-shadow-sm leading-snug">
                        Você está deixando <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#1E3A8A] to-[#1E40AF] font-bold">dinheiro na mesa</span> todos os meses!
                    </h1>
                    <p className="text-base md:text-lg text-slate-700 mb-8 max-w-xl leading-relaxed font-medium drop-shadow-sm bg-white/40 md:bg-transparent p-2 md:p-0 rounded-lg">
                        Quem trabalha com <strong className="text-slate-900 font-bold">limpeza de banheiros ou coleta de lixo</strong> têm direito a receber o adicional de <strong className="text-slate-900 font-bold">40% de insalubridade.</strong>
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

            {/* Main Content Card Wrapper (Dark theme) */}
            <div className="w-full bg-[#111827] text-white pt-10 pb-4 md:pb-6 z-10 px-4 md:px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-serif text-center text-white mb-8 font-bold">
                        Verifique agora se você se encaixa:
                    </h2>

                    {/* The Card (White card in dark section) */}
                    <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl mb-8 border border-white">
                        <ul className="space-y-5">
                            <li className="flex items-start gap-4">
                                <div className="bg-[#1E3A8A] rounded-full p-1 mt-1 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg md:text-xl text-slate-800 font-medium leading-relaxed">
                                    Limpa banheiros de uso coletivo (empresas, escolas, clínicas, hotéis, etc.);
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-[#1E3A8A] rounded-full p-1 mt-1 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg md:text-xl text-slate-800 font-medium leading-relaxed">
                                    Faz recolhimento de lixo urbano ou interno;
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-[#1E3A8A] rounded-full p-1 mt-1 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg md:text-xl text-slate-800 font-medium leading-relaxed">
                                    Tem contato com agentes biológicos (bactérias, vírus, resíduos);
                                </span>
                            </li>
                            <li className="flex items-start gap-4">
                                <div className="bg-[#1E3A8A] rounded-full p-1 mt-1 shrink-0">
                                    <CheckCircle2 className="w-5 h-5 text-white" strokeWidth={2.5} />
                                </div>
                                <span className="text-lg md:text-xl text-slate-800 font-medium leading-relaxed">
                                    Não recebe insalubridade ou recebe abaixo de 40%.
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="text-center mb-2 mt-8">
                        <p className="text-lg md:text-xl text-slate-300 font-medium leading-relaxed mb-8">
                            Se marcou 1 ou mais itens, <strong className="text-white font-bold">vale a pena analisar seu caso.</strong> <br className="hidden md:block" />
                            <span className="text-[#EED789] block mt-6 text-xl md:text-2xl font-bold">
                                Esse adicional pode representar um aumento significativo de até R$648,50 no seu salário. Além, de valores retroativos de até 5 anos.
                            </span>
                        </p>

                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex flex-col items-center justify-center bg-gradient-to-r from-[#EED789] via-[#D3AD5D] to-[#BE923C] hover:brightness-110 text-[#2D210F] font-bold px-10 py-5 w-auto rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.3)] transition-transform transform hover:scale-[1.02] active:scale-[0.98] border border-[#F3E5AB]/60 text-center"
                        >
                            <div className="flex flex-col items-center justify-center">
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-2xl">👉</span>
                                    <span className="text-xl md:text-2xl leading-tight drop-shadow-[0_1px_1px_rgba(255,255,255,0.4)]">
                                        Faça sua análise agora
                                    </span>
                                    <span className="text-2xl invisible">👉</span>
                                </div>
                                <span className="text-xs font-medium opacity-80 mt-2 uppercase tracking-wider block">
                                    Clique no botão abaixo e fale no WhatsApp
                                </span>
                                <span className="text-[10px] font-normal opacity-70 mt-1 uppercase tracking-tighter block">
                                    Descubra em minutos se você tem direito ao adicional de 40%
                                </span>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Objections / Beneficios (Dark Section) */}
            <div className="w-full bg-[#111827] pt-8 pb-16 px-6 relative border-t border-slate-800">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0 pointer-events-none"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                        <div className="flex flex-col items-center text-center">
                            <FastForward className="w-12 h-12 text-slate-400 mb-4" strokeWidth={1} />
                            <h3 className="text-lg text-white font-bold mb-2">Atendimento rápido e direto</h3>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <User className="w-12 h-12 text-slate-400 mb-4" strokeWidth={1} />
                            <h3 className="text-lg text-white font-bold mb-2">Análise individual do seu caso</h3>
                        </div>
                        <div className="flex flex-col items-center text-center">
                            <Lock className="w-12 h-12 text-slate-400 mb-4" strokeWidth={1} />
                            <h3 className="text-lg text-white font-bold mb-2">Total sigilo nas informações</h3>
                        </div>
                    </div>

                    <div className="text-center max-w-2xl mx-auto mb-10">
                        <p className="text-lg md:text-xl text-slate-400 mb-4 leading-relaxed font-light">
                            Muitos trabalhadores exercem essa função por anos sem receber o que é devido.
                        </p>
                        <p className="text-xl md:text-2xl text-white font-serif font-medium leading-relaxed">
                            Você pode estar perdendo dinheiro todos os meses e nem sabe. <br className="hidden md:block" />
                            Faça uma verificação agora.
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
