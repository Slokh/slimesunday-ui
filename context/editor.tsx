import { metadata } from "@slimesunday/utils";
import { createContext, ReactNode, useContext, useState } from "react";

export type Layer = {
  name: string;
  image?: string;
  isDisabled?: boolean;
};

export enum EditorMode {
  Background,
  Portrait,
  Layers,
  Mintable,
}

type State = {
  available: {
    backgrounds: Layer[];
    portraits: Layer[];
    layers: Layer[];
  };

  active: {
    background?: Layer;
    portrait?: Layer;
    layers: Layer[];
  };

  randomize: () => void;
  setBackground: (layer: Layer) => void;
  setPortrait: (layer: Layer) => void;
  setLayers: (layers: Layer[]) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layer: Layer) => void;

  isPortraitsEnabled: boolean;
  isLayersEnabled: boolean;
};

type EditorContextType = State | undefined;
type EditorProviderProps = { children: ReactNode };

const EditorContext = createContext<EditorContextType>(undefined);

export const EditorProvider = ({ children }: EditorProviderProps) => {
  const [activeBackground, setBackground] = useState<Layer>();
  const [activePortrait, setPortrait] = useState<Layer>();
  const [activeLayers, setLayers] = useState<any[]>([]);

  const loadAvailable = (key: string) =>
    metadata[key]?.map((file) => ({
      name: file,
      image: `https://opensea-slimesunday.s3.amazonaws.com/${key}/${file}`,
    }));

  const backgrounds = loadAvailable("backgrounds");
  const portraits = loadAvailable("portraits");
  const layers = loadAvailable("layers");

  const randomize = () => {
    const getRandomElements = (arr: Layer[], n: number) =>
      arr.sort(() => 0.5 - Math.random()).slice(0, n);

    setBackground(getRandomElements(backgrounds, 1)[0]);
    setPortrait(getRandomElements(portraits, 1)[0]);
    setLayers(getRandomElements(layers, 5));
  };

  return (
    <EditorContext.Provider
      value={{
        available: {
          backgrounds: backgrounds.map((item) =>
            activeBackground?.name == item.name
              ? { ...item, isDisabled: true }
              : item
          ),
          portraits: portraits.map((item) =>
            activePortrait?.name == item.name
              ? { ...item, isDisabled: true }
              : item
          ),
          layers: layers.map((item) =>
            activeLayers
              .map((activeItem) => activeItem.name)
              .includes(item.name)
              ? { ...item, isDisabled: true }
              : item
          ),
        },

        active: {
          background: activeBackground,
          portrait: activePortrait,
          layers: activeLayers,
        },

        randomize,
        setBackground,
        setPortrait,
        setLayers,
        addLayer: (layer: any) => setLayers([layer, ...activeLayers]),
        removeLayer: (layer: any) =>
          setLayers(activeLayers.filter((l) => l !== layer)),

        isPortraitsEnabled: !!activeBackground,
        isLayersEnabled: !!activeBackground && !!activePortrait,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(EditorContext);

  if (context === undefined) {
    throw new Error("useEditor must be used within a EditorProvider");
  }

  return context;
};
