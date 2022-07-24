import {
  ABI,
  CONTRACT_ADDRESS,
  METADATA_CONTRACT_ADDRESS,
} from "@slimesunday/utils";
import { BigNumber } from "ethers";
import { hexZeroPad } from "ethers/lib/utils";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useContract, useProvider } from "wagmi";

export enum LayerType {
  Background = "Background",
  Portrait = "Portrait",
  Layer = "Layer",
}

export type Layer = {
  tokenId: number;
  layerId: number;
  name: string;
  image?: string;
  layerType: LayerType;
  isDisabled?: boolean;
  isBound?: boolean;
};

export type BoundLayer = {
  tokenId?: number;
  background?: Layer;
  portrait?: Layer;
  layers: Layer[];
};

export enum EditorMode {
  Background,
  Portrait,
  Layers,
  Mintable,
}

type State = {
  backgrounds: Layer[];
  portraits: Layer[];
  layers: Layer[];

  active: BoundLayer;
  boundLayers: BoundLayer[];

  randomize: () => void;
  importLayers: (tokenIds: string[]) => Promise<any>;

  addBackground: (layer: Layer) => void;
  addPortrait: (layer: Layer) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layer: Layer) => void;
  setLayers: (layers: Layer[]) => void;
  setActive: (boundLayer: BoundLayer) => void;

  isBackgroundsEnabled: boolean;
  isPortraitsEnabled: boolean;
  isLayersEnabled: boolean;
  isBindingEnabled: boolean;
  isExistingEnabled: boolean;
};

type EditorContextType = State | undefined;
type EditorProviderProps = { children: ReactNode };

const EditorContext = createContext<EditorContextType>(undefined);

export const EditorProvider = ({ children }: EditorProviderProps) => {
  const { address, isConnected } = useAccount();
  const provider = useProvider();
  const contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: provider,
  });
  // HACK: temporary
  const metadataContract = useContract({
    addressOrName: METADATA_CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: provider,
  });

  const [layers, setLayers] = useState<Layer[]>([]);
  const [active, setActive] = useState<BoundLayer>({ layers: [] });
  const [boundLayers, setBoundLayers] = useState<BoundLayer[]>([]);

  const layersForType = (layerType: LayerType, disableTokenIds?: number[]) => {
    let filteredLayers = layers.filter(
      (layer) => layer.layerType === layerType
    );
    if (disableTokenIds) {
      filteredLayers = filteredLayers.map((layer) =>
        disableTokenIds.includes(layer.tokenId)
          ? { ...layer, isDisabled: true }
          : layer
      );
    }
    return filteredLayers;
  };

  const processMetadata = async (metadata: any) => {
    const { tokenId, layerId, jsonString, isBound } = metadata;
    const { attributes } = JSON.parse(
      Buffer.from(
        jsonString.replace("data:application/json;base64,", ""),
        "base64"
      ).toString("utf-8")
    );

    const { value: layerTypeValue } = attributes.find(
      ({ trait_type }: any) => trait_type === "Layer Type"
    );
    const { value: nameValue } = attributes.find(
      ({ trait_type }: any) => trait_type === layerTypeValue
    );

    const layerType = [LayerType.Background, LayerType.Portrait].includes(
      layerTypeValue
    )
      ? (layerTypeValue as LayerType)
      : LayerType.Layer;

    return {
      tokenId,
      layerId,
      name: nameValue,
      layerType,
      isBound,
      image: `https://opensea-slimesunday.s3.amazonaws.com/${layerType}/${nameValue}.png`,
    };
  };

  const importLayers = async (tokenIds: string[]) => {
    const layers = await Promise.all(
      tokenIds.map(async (tokenId: string) => ({
        tokenId: parseInt(tokenId),
        layerId: (await contract.getLayerId(tokenId)).toNumber(),
        jsonString: await contract.tokenURI(tokenId),
      }))
    );
    setLayers(await Promise.all(layers.map(processMetadata)));
  };

  const importBoundLayers = async (tokenIds: string[]) => {
    setBoundLayers(
      await Promise.all(
        tokenIds.map(async (tokenId: string) => {
          const layerIds = await contract.getActiveLayers(tokenId);
          const layers = await Promise.all(
            layerIds.map(async (layerId: BigNumber) => ({
              tokenId: tokenId,
              layerId: layerId.toNumber(),
              isBound: true,
              jsonString: await metadataContract.getTokenURI(
                layerId.toNumber(),
                0,
                [],
                // @ts-ignore
                hexZeroPad(1, 32)
              ),
            }))
          );
          const processedLayers = await Promise.all(
            layers.map(processMetadata)
          );

          return {
            tokenId: parseInt(tokenId),
            background: processedLayers?.find(
              ({ layerType }) => layerType === LayerType.Background
            ),
            portrait: processedLayers?.find(
              ({ layerType }) => layerType === LayerType.Portrait
            ),
            layers: processedLayers?.filter(
              ({ layerType }) =>
                layerType === LayerType.Layer ||
                layerType === LayerType.Portrait
            ),
          };
        })
      )
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
      const ownedTokenIds = await getOwnedTokenIds();
      // TODO: Fix once james adds layer_count
      importLayers(
        ownedTokenIds.filter((tokenId: string) => tokenId !== "910")
      );
      importBoundLayers(["910"]);
    };
    if (address && contract) {
      fetchLayers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract]);

  const randomize = async () => {
    const r = (arr: Layer[], n: number) =>
      arr.sort(() => 0.5 - Math.random()).slice(0, n);

    const background = r(layersForType(LayerType.Background), 1)[0];
    const portrait = r(layersForType(LayerType.Portrait), 1)[0];
    const layers = r(layersForType(LayerType.Layer), 5);
    const portraitIndex = Math.floor(Math.random() * layers.length);

    setActive({
      background,
      portrait,
      layers: [
        ...layers.slice(0, portraitIndex),
        portrait,
        ...layers.slice(portraitIndex + 1),
      ],
    });
  };

  const addLayer = (layer: any) =>
    setActive({ ...active, layers: [layer, ...active.layers] });

  const removeLayer = (layer: any) =>
    setActive({ ...active, layers: active.layers.filter((l) => l !== layer) });

  const addPortrait = (layer: any) => {
    setActive({
      ...active,
      portrait: layer,
      layers: [layer, ...active.layers],
    });
  };

  const isBindingEnabled = () => {
    if (!active.background || !active.portrait || active.layers.length < 4) {
      return false;
    }

    return !boundLayers.find(({ background, portrait, layers }) => {
      return (
        background?.layerId === active.background?.layerId &&
        portrait?.layerId === active.portrait?.layerId &&
        layers.every((layer, i) => layer.layerId === active.layers[i].layerId)
      );
    });
  };

  return (
    <EditorContext.Provider
      value={{
        backgrounds: layersForType(
          LayerType.Background,
          active.background && [active.background.tokenId]
        ),
        portraits: layersForType(
          LayerType.Portrait,
          active.portrait && [active.portrait.tokenId]
        ),
        layers: layersForType(
          LayerType.Layer,
          active.layers.map((l) => l.tokenId)
        ),

        active,
        boundLayers,

        randomize,
        importLayers,

        addBackground: (layer: any) =>
          setActive({ ...active, background: layer }),
        addPortrait,
        addLayer,
        removeLayer,
        setLayers: (layers: any) => setActive({ ...active, layers }),
        setActive,

        isBackgroundsEnabled:
          isConnected && !!layersForType(LayerType.Background)?.length,
        isPortraitsEnabled: isConnected && !!active.background,
        isLayersEnabled:
          isConnected && !!active.background && !!active.portrait,
        isBindingEnabled: isConnected && isBindingEnabled(),
        isExistingEnabled: isConnected && !!boundLayers?.length,
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
