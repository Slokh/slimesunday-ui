import { Web3Provider } from "@ethersproject/providers";
import { backgroundFiles, layerFiles } from "@slimesunday/utils";
import { createContext, ReactNode, useContext, useState } from "react";

export type Layer = {
  name: string;
  image: string;
};

type State = {
  provider: Web3Provider;
  signer: any;
  account: string | undefined;
  name: string | undefined;
  active: boolean;
  connect: () => void;

  backgrounds: Layer[];
  activeBackground?: Layer;
  setBackground: (layer: Layer) => void;

  layers: Layer[];
  activeLayers: Layer[];
  inactiveLayers: Layer[];

  activateLayer: (layer: Layer) => void;
  deactivateLayer: (layer: Layer) => void;
  setActiveLayers: any;
};

type EditorContextType = State | undefined;
type EditorProviderProps = { children: ReactNode };

const EditorContext = createContext<EditorContextType>(undefined);

export const EditorProvider = ({ children }: EditorProviderProps) => {
  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<string>();
  const [name, setName] = useState<string | undefined>();
  const [activeBackground, setBackground] = useState<Layer>();
  const [activeLayers, setActiveLayers] = useState<any[]>([]);

  const layers = layerFiles.map((file) => ({
    name: file,
    image: `/layers/${file}`,
  }));

  const backgrounds = backgroundFiles.map((file) => ({
    name: file,
    image: `/backgrounds/${file}`,
  }));

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

  const activateLayer = (layer: any) => {
    setActiveLayers([layer, ...activeLayers]);
  };

  const deactivateLayer = (layer: any) => {
    setActiveLayers(activeLayers.filter((l) => l !== layer));
  };

  return (
    <EditorContext.Provider
      value={{
        provider: provider?.provider,
        signer: provider,
        account,
        name,
        active: !!account,
        connect,
        backgrounds,
        activeBackground,
        setBackground,
        layers,
        activeLayers,
        inactiveLayers: layers.filter(
          (layer: any) => !activeLayers.includes(layer)
        ),
        activateLayer,
        deactivateLayer,
        setActiveLayers,
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
