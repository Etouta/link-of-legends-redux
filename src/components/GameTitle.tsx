
import React from 'react';
import { useLocale } from '../context/LocaleContext';

interface GameTitleProps {
  onStartGame: () => void;
}

const GameTitle: React.FC<GameTitleProps> = ({ onStartGame }) => {
  const { t, lang, setLang } = useLocale();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
      <div className="flex w-full justify-end mb-6">
        <label htmlFor="lang" className="text-white mr-2">{t("language")}</label>
        <select
          id="lang"
          value={lang}
          onChange={e => setLang(e.target.value as "en" | "fr")}
          className="rounded bg-yellow-200 px-2 py-1 text-black"
        >
          <option value="en">English</option>
          <option value="fr">Français</option>
        </select>
      </div>
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-8 text-yellow-500 animate-pulse">
          {t("title")}
        </h1>
        
        <div className="w-80 h-80 mx-auto mb-8 border-4 border-yellow-600 bg-green-800 overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute w-12 h-12 bg-green-700" style={{ top: '20%', left: '20%' }}></div>
          <div className="absolute w-12 h-12 bg-blue-700" style={{ top: '30%', right: '20%' }}></div>
          <div className="absolute w-12 h-12 bg-red-700" style={{ bottom: '20%', left: '40%' }}></div>
          
          {/* Triforce symbol */}
          <div className="absolute" style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
            <div className="relative w-48 h-48">
              {/* Bottom left triangle */}
              <div 
                className="absolute bg-yellow-400" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  bottom: '0',
                  left: '33%',
                  transform: 'translateX(-50%)',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
                }}
              ></div>
              
              {/* Bottom right triangle */}
              <div 
                className="absolute bg-yellow-400" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  bottom: '0',
                  right: '33%',
                  transform: 'translateX(50%)',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
                }}
              ></div>
              
              {/* Top triangle */}
              <div 
                className="absolute bg-yellow-400" 
                style={{ 
                  width: '32px', 
                  height: '32px',
                  top: '0',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)'
                }}
              ></div>
            </div>
          </div>
        </div>
        
        <button 
          onClick={onStartGame}
          className="px-8 py-3 bg-yellow-600 text-white font-bold rounded-md hover:bg-yellow-500 transition-colors text-xl"
        >
          {t("start")}
        </button>
        <div className="mt-8 text-white">
          <p className="mb-2">{t("controls")}</p>
          <p>{t("move")}</p>
          <p>{t("attack")}</p>
        </div>
      </div>
    </div>
  );
};

export default GameTitle;

