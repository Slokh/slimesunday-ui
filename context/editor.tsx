import { Web3Provider } from "@ethersproject/providers";
import { metadata } from "@slimesunday/utils";
import { createContext, ReactNode, useContext, useState } from "react";

export type Layer = {
  name: string;
  image: string;
};

type State = {
  wallet: {
    provider: Web3Provider;
    signer: any;
    account: string | undefined;
    name: string | undefined;
    active: boolean;
    connect: () => void;
  };

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

  setBackground: (layer: Layer) => void;
  setPortrait: (layer: Layer) => void;
  setLayers: (layers: Layer[]) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layer: Layer) => void;
};

type EditorContextType = State | undefined;
type EditorProviderProps = { children: ReactNode };

const EditorContext = createContext<EditorContextType>(undefined);

export const EditorProvider = ({ children }: EditorProviderProps) => {
  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<string>();
  const [name, setName] = useState<string | undefined>();
  const [activeBackground, setBackground] = useState<Layer>();
  const [activePortrait, setPortrait] = useState<Layer>();
  const [activeLayers, setLayers] = useState<any[]>([]);

  const loadAvailable = (key: string) =>
    metadata[key]?.map((file) => ({
      name: file,
      image: `/${key}/${file}`,
    }));

  const backgrounds = loadAvailable("backgrounds");
  const portraits = loadAvailable("portraits");
  const layers = loadAvailable("layers");

  const connect = async () => {
    // @ts-ignore
    const provider = new Web3Provider(window.ethereum, "any");
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const account = await signer.getAddress();
    setProvider(signer);
    setAccount(account);
    setName((await signer.provider.lookupAddress(account)) || undefined);
  };

  return (
    <EditorContext.Provider
      value={{
        wallet: {
          provider: provider?.provider,
          signer: provider,
          account,
          name,
          active: !!account,
          connect,
        },
        available: {
          backgrounds,
          portraits,
          layers,
        },
        active: {
          background: activeBackground,
          portrait: activePortrait,
          layers: activeLayers,
        },
        setBackground,
        setPortrait,
        setLayers,
        addLayer: (layer: any) => setLayers([layer, ...activeLayers]),
        removeLayer: (layer: any) =>
          setLayers(activeLayers.filter((l) => l !== layer)),
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
