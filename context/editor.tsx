import { Web3Provider } from "@ethersproject/providers";
import { files } from "@slimesunday/utils";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

type State = {
  provider: Web3Provider;
  signer: any;
  account: string | undefined;
  name: string | undefined;
  active: boolean;
  connect: () => void;
  layers: any[];
  activeLayers: any[];
  inactiveLayers: any[];
  activateLayer: (layer: any) => void;
  deactivateLayer: (layer: any) => void;
  incrementLayer: (layer: any) => void;
  decrementLayer: (layer: any) => void;
};

type EditorContextType = State | undefined;
type EditorProviderProps = { children: ReactNode };

const EditorContext = createContext<EditorContextType>(undefined);

export const EditorProvider = ({ children }: EditorProviderProps) => {
  const [provider, setProvider] = useState<any>();
  const [account, setAccount] = useState<string>();
  const [name, setName] = useState<string | undefined>();
  const [activeLayers, setActiveLayers] = useState<any[]>([]);

  const layers = files.map((file) => ({
    name: file,
    image: `/layers/${file}`,
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
    setActiveLayers([...activeLayers, layer]);
  };

  const deactivateLayer = (layer: any) => {
    setActiveLayers(activeLayers.filter((l) => l !== layer));
  };

  const decrementLayer = (layer: any) => {
    const index = activeLayers.indexOf(layer);
    const newIndex = index + 1;

    const newActiveLayers = [...activeLayers];
    newActiveLayers[index] = activeLayers[newIndex];
    newActiveLayers[newIndex] = layer;
    setActiveLayers(newActiveLayers);
  };

  const incrementLayer = (layer: any) => {
    const index = activeLayers.indexOf(layer);
    const newIndex = index - 1;

    const newActiveLayers = [...activeLayers];
    newActiveLayers[index] = activeLayers[newIndex];
    newActiveLayers[newIndex] = layer;
    setActiveLayers(newActiveLayers);
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
        layers,
        activeLayers,
        inactiveLayers: layers.filter(
          (layer: any) => !activeLayers.includes(layer)
        ),
        activateLayer,
        deactivateLayer,
        incrementLayer,
        decrementLayer,
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
