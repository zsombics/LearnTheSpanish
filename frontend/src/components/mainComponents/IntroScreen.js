import React, { useState } from 'react';
import '../../styles/IntroScreen.css';

const storyPart1 = `Leo, egy kíváncsi és kalandvágyó fiatal, a nagyszülei padlásán kutatva egy poros, bőrkötéses naplóra bukkan. A naplót rég elhunyt dédapja, Mateo írta, aki fiatalkorában vándorolt ki Spanyolországból. A megsárgult lapok tele vannak spanyolországi emlékekkel, rajzokkal, és egy sejtelmes utalással egy "családi kincsre" (un tesoro familiar), ami Madridban várja, hogy valaki a családból újra felfedezze. \n\nAzonban Mateo nem adta könnyen a titkot. A napló utolsó bejegyzése egy rejtvényes üzenet: "A kincs kulcsa Spanyolország lelkében rejlik, annak nyolc ékkövén át vezet az út. Minden város őriz egy szót, egy szikrát a múltból. Csak ha megérted a hangjukat, nyílik meg az út Madrid szívébe."\n\nLeo szíve hevesebben kezd verni. Ez több mint egy régi napló, ez egy küldetés! Elhatározza, hogy követi dédapja nyomait, bejárja Spanyolországot, megtanulja a nyelvet, és megfejti a rejtélyt. Tudja, hogy nem lesz könnyű, de a kalandvágy és a családi örökség iránti tisztelet hajtja.`;
const storyPart2 = `Leónak sorban kell meglátogatnia a nyolc várost Madrid előtt. Minden városban fel kell keresnie egy "őrzőt" - egy híres művészt, aki a dédapja által ráhagyományozott feladat szerint próbára teszi Leo spanyol tudását. Csak ha Leo <strong>10 egymást követő tesztet hibátlanul (100%-ra)</strong> teljesít az adott város nyelvi fókuszára épülve, akkor kapja meg az őrzőtől a titkos jelszót (contraseña), ami egy lépéssel közelebb viszi a madridi kincshez.`;

const IntroScreen = ({ onStartGame }) => {
    const [step, setStep] = useState(1);
    const [isTurning, setIsTurning] = useState(false);

    const handleNext = () => {
        if (isTurning) return;
        setIsTurning(true);
        setTimeout(() => {
            setStep(2);
            requestAnimationFrame(() => {
                setIsTurning(false);
            });
        }, 600);
    };

    // Ez a funkció hívja meg a MapGame-től kapott propot
    const handleFinalStart = () => {
        console.log("Start button clicked in IntroScreen"); // Debug log
        if (isTurning) return; // Prevent click during animation
        onStartGame(); // Meghívja a handleStartGame-et a MapGame-ben
    };

    return (
        <div className="intro-overlay">
            <div className={`book-container ${isTurning ? 'turning' : ''} step-${step}`}>

                <div className="page left-page">
                    <div className="page-content left-page-content">
                        {step === 1 && (
                            <img
                                src="/images/Leo_padlason.png"
                                alt="Leo felfedezi a naplót"
                                className="intro-image full-page-image"
                            />
                        )}
                        {step === 2 && (
                            <img
                                src="/images/Leo_Walk.png"
                                alt="Leo útnak indul"
                                className="intro-image full-page-image"
                            />
                        )}
                    </div>
                </div>

                <div className="page right-page">
                    <div className="page-flipper">

                        {step === 1 && (
                            <div className="page-content front">
                                <h2>A Dédapa Titka</h2>
                                <div className="text-scroll">
                                    {storyPart1.split('\n\n').map((paragraph, index) => (
                                        <p key={`p1-${index}`}>{paragraph}</p>
                                    ))}
                                </div>
                                <button onClick={handleNext} className="intro-button" disabled={isTurning}>
                                    Lapozás →
                                </button>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="page-content front">
                                <h2>A Küldetés</h2>
                                <div className="text-scroll">
                                    <p dangerouslySetInnerHTML={{ __html: storyPart2 }} />
                                </div>
                                <button onClick={handleFinalStart} className="intro-button start-button" disabled={isTurning}>
                                    Kezd el és segíts Leónak!
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default IntroScreen;