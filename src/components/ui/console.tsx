import { IconCode, IconX } from "@tabler/icons-react";
import { useState, useEffect, KeyboardEvent, useMemo } from "react";

interface ConsoleProps {
  jsonObjects?: any;
  // Agregamos el Set del useState a los props. 
  // Tipado para que acepte la función de actualización de React.
  setJsonObjects?: React.Dispatch<React.SetStateAction<any>>;
}

export default function Console(props: ConsoleProps) {
  const [isDisplayed, setIsDisplayed] = useState<boolean>(false);
  const [text, setText] = useState<string>("");

  // Formateador original
  const formatObject = (obj: any) =>
    JSON.stringify(obj, null, 2).replace(/"([^"]+)":/g, "$1:");

  // Sincronizar los props iniciales con el estado del texto
  useEffect(() => {
    if (props.jsonObjects) {
      const dataString = props.jsonObjects
        .map((obj: any) => formatObject(obj))
        .join("\n\n");
      setText(dataString);
    }
  }, [props.jsonObjects]);

  // Manejador genérico para cuando se escribe normalmente
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    
    // Si necesitas actualizar el estado en el padre, puedes intentar parsearlo.
    // Nota: El formatObject quita las comillas de las keys, lo cual lo hace JSON inválido 
    // para JSON.parse(). Si planeas guardar los cambios, considera usar JSON.stringify normal.
    /*
    if (props.setJsonObjects) {
      try {
        const parsed = JSON.parse(newValue);
        props.setJsonObjects(parsed);
      } catch (err) {
        // Ignorar errores de parseo mientras el usuario escribe
      }
    }
    */
  }

  // 1. Paleta de colores VSCode Dark Modern
  const colors = {
    bg: "#1e1e1e",
    line: "#2a2d2e",
    text: "#9cdcfe",     // Azul claro (propiedades)
    string: "#ce9178",   // Naranja/Marrón (strings)
    number: "#b5cea8",   // Verde pálido (números/booleans)
    punctuation: "#d4d4d4", // Gris (llaves/comas)
    caret: "#aeafad"
  };

  // 2. Función para resaltar el texto dinámicamente
  const highlightCode = (code: string) => {
    return code
      .replace(/([{}[\]])/g, `<span style="color: ${colors.punctuation}">$1</span>`) // Llaves
      .replace(/"([^"]+)"(?=:)/g, `<span style="color: ${colors.text}">"$1"</span>`) // Keys
      .replace(/(?<=:)\s*"([^"]*)"/g, ` <span style="color: ${colors.string}">"$1"</span>`) // String values
      .replace(/\b(true|false|null|\d+)\b/g, `<span style="color: ${colors.number}">$1</span>`); // Keywords
  };

  const highlightedHTML = useMemo(() => highlightCode(text), [text]);

  // Manejador de teclas (Tab, Enter, Llaves) - Mantén tu lógica anterior aquí
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const target = e.target as HTMLTextAreaElement;
    const { selectionStart, selectionEnd, value } = target;

    if (e.key === "Tab") {
      e.preventDefault();
      const newValue = value.substring(0, selectionStart) + "  " + value.substring(selectionEnd);
      setText(newValue);
      setTimeout(() => { target.selectionStart = target.selectionEnd = selectionStart + 2; }, 0);
    }
  };

  return (
    <div
      className={`fixed z-20 bg-neutral-900 text-white overflow-hidden ${
        isDisplayed
          ? "top-0 left-0 w-screen h-screen rounded-none animate-fade-in-up p-4 bg-black/95 backdrop-blur-md"
          : "top-3 right-3 w-14 h-14 rounded-full p-0 flex items-center justify-center cursor-pointer shadow-lg shadow-purple-500/20"
      }`}
      onClick={() => !isDisplayed && setIsDisplayed(true)}
    >
      {isDisplayed ? (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto font-mono">
          <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
            </div>
            <button onClick={(e) => { e.stopPropagation(); setIsDisplayed(false); }} className="hover:bg-neutral-800 p-1 rounded">
              <IconX size={18} color="#858585" />
            </button>
          </div>

          {/* Contenedor del Editor */}
          <div className="relative flex-grow overflow-auto">
            {/* Capa de Resaltado (Debajo) */}
            <pre
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none whitespace-pre-wrap break-words text-sm leading-relaxed p-0 m-0 border-none"
              style={{ tabSize: 2 }}
              dangerouslySetInnerHTML={{ __html: highlightedHTML + "\n" }}
            />

            {/* Capa de Entrada (Encima) */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck="false"
              className="absolute inset-0 bg-transparent text-transparent caret-[#aeafad] selection:bg-[#264f78]/50 w-full h-full resize-none outline-none text-sm font-mono leading-relaxed p-0 m-0 border-none"
              style={{ tabSize: 2 }}
            />
          </div>
        </div>
      ) : (
        <IconCode size={20} />
      )}
    </div>
  );
}