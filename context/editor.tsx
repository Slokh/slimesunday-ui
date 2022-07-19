import { ABI, CONTRACT_ADDRESS } from "@slimesunday/utils";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useContract, useProvider } from "wagmi";

enum LayerType {
  Background = "background",
  Portrait = "portrait",
  Layer = "layer",
}

export type Layer = {
  id: string;
  name: string;
  image?: string;
  layerType: LayerType;
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
  importLayers: (tokenIds: string[]) => Promise<any>;

  setBackground: (layer: Layer) => void;
  setPortrait: (layer: Layer) => void;
  setLayers: (layers: Layer[]) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layer: Layer) => void;

  isBackgroundsEnabled: boolean;
  isPortraitsEnabled: boolean;
  isLayersEnabled: boolean;
};

type EditorContextType = State | undefined;
type EditorProviderProps = { children: ReactNode };

const EditorContext = createContext<EditorContextType>(undefined);

export const EditorProvider = ({ children }: EditorProviderProps) => {
  const { address } = useAccount();
  const provider = useProvider();
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: provider,
  });

  const [availableBackgrounds, setAvailableBackgrounds] = useState<Layer[]>([]);
  const [availablePortraits, setAvailablePortraits] = useState<Layer[]>([]);
  const [availableLayers, setAvailableLayers] = useState<Layer[]>([]);
  const [activeBackground, setBackground] = useState<Layer>();
  const [activePortrait, setPortrait] = useState<Layer>();
  const [activeLayers, setLayers] = useState<any[]>([]);

  const fetchTokenMetadata = async (token_id: string) => {
    const { image, attributes } = JSON.parse(await contract.tokenURI(token_id));
    const { trait_type, value } = attributes?.[0];

    const layerType =
      trait_type === "Background"
        ? LayerType.Background
        : trait_type === "Portrait"
        ? LayerType.Portrait
        : LayerType.Layer;

    const imagePrefix =
      layerType === LayerType.Background
        ? "backgrounds"
        : layerType === LayerType.Portrait
        ? "portraits"
        : "layers";

    return {
      id: token_id,
      name: value,
      layerType,
      image: `https://opensea-slimesunday.s3.amazonaws.com/${imagePrefix}/${
        image.split("/")[3]
      }`,
    };
  };

  const importLayers = async (tokenIds: string[]) => {
    const layers = await Promise.all(tokenIds.map(fetchTokenMetadata));

    setAvailableBackgrounds(
      layers?.filter(({ layerType }) => layerType === LayerType.Background)
    );
    setAvailablePortraits(
      layers?.filter(({ layerType }) => layerType === LayerType.Portrait)
    );
    setAvailableLayers(
      layers?.filter(({ layerType }) => layerType === LayerType.Layer)
    );
  };

  const getOwnedTokenIds = async () => {
    const response = await fetch(
      `https://testnets-api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=${CONTRACT_ADDRESS}&limit=50`
    );
    const data = await response.json();
    return data?.assets.map(({ token_id }: { token_id: string }) => token_id);
  };

  useEffect(() => {
    const fetchLayers = async () => {
      await importLayers(await getOwnedTokenIds());
    };
    if (address && contract) {
      fetchLayers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract]);

  const randomize = async () => {
    const getRandomElements = (arr: Layer[], n: number) =>
      arr.sort(() => 0.5 - Math.random()).slice(0, n);

    setBackground(getRandomElements(availableBackgrounds, 1)[0]);
    setPortrait(getRandomElements(availablePortraits, 1)[0]);
    setLayers(getRandomElements(availableLayers, 5));
  };

  return (
    <EditorContext.Provider
      value={{
        available: {
          backgrounds: availableBackgrounds.map((item) =>
            activeBackground?.id == item.id
              ? { ...item, isDisabled: true }
              : item
          ),
          portraits: availablePortraits.map((item) =>
            activePortrait?.id == item.id ? { ...item, isDisabled: true } : item
          ),
          layers: availableLayers.map((item) =>
            activeLayers.map((activeItem) => activeItem.id).includes(item.id)
              ? { ...item, isDisabled: true }
              : item
          ),
        },

        active: {
          background: activeBackground && {
            ...activeBackground,
            isDisabled: true,
          },
          portrait: activePortrait && { ...activePortrait, isDisabled: true },
          layers: activeLayers.map((layer) => ({ ...layer, isDisabled: true })),
        },

        randomize,
        importLayers,

        setBackground,
        setPortrait,
        setLayers,
        addLayer: (layer: any) => setLayers([layer, ...activeLayers]),
        removeLayer: (layer: any) =>
          setLayers(activeLayers.filter(({ id }) => id !== layer.id)),

        isBackgroundsEnabled: !!(
          availableBackgrounds?.length ||
          availablePortraits?.length ||
          availableLayers?.length
        ),
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
