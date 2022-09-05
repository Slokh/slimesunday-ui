import {
  ABI,
  CONTRACT_ADDRESS,
  METADATA_CONTRACT_ADDRESS,
} from "@slimesunday/utils";
import { BigNumber, ethers } from "ethers";
import { hexZeroPad } from "ethers/lib/utils";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { useAccount, useContract, useNetwork, useProvider } from "wagmi";

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
  isHidden?: boolean;
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

  clear: () => void;
  shuffle: (all: boolean) => void;
  fetchLayers: () => Promise<any>;

  addBackground: (layer: Layer) => void;
  addPortrait: (layer: Layer) => void;
  addLayer: (layer: Layer) => void;
  removeLayer: (layer: Layer) => void;
  toggleLayer: (layer: Layer) => void;
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
  const contract: ethers.Contract = useContract({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: provider,
  });
  const metadataContract = useContract({
    addressOrName: METADATA_CONTRACT_ADDRESS,
    contractInterface: ABI,
    signerOrProvider: provider,
  });

  const [layers, setLayers] = useState<Layer[]>([]);
  const [active, setActive] = useState<BoundLayer>({ layers: [] });
  const [boundLayers, setBoundLayers] = useState<BoundLayer[]>([]);

  const layersForType = (
    availableLayers: Layer[],
    layerType: LayerType,
    disableTokenIds?: number[]
  ) => {
    let filteredLayers = availableLayers.filter(
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
    const { tokenId, layerId, jsonString, isBound, isHidden } = metadata;
    const { attributes } = JSON.parse(
      Buffer.from(
        jsonString.replace("data:application/json;base64,", ""),
        "base64"
      ).toString("utf-8")
    );

    const { value: layerTypeValue } = attributes.find(
      ({ trait_type }: any) => trait_type === "Layer Type"
    ) || {
      value: "",
    };
    const { value: nameValue } = attributes.find(
      ({ trait_type }: any) => trait_type === layerTypeValue
    ) || {
      value: "",
    };

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
      isHidden: isHidden && layerType != LayerType.Portrait,
      image: `https://opensea-slimesunday.s3.amazonaws.com/${layerType}/${nameValue.replace(
        " ",
        "+"
      )}.png`,
    };
  };

  const importLayers = async (tokenIds: number[]) => {
    const layers = await Promise.all(
      tokenIds.map(async (tokenId: number) => ({
        tokenId,
        layerId: (await contract.getLayerId(tokenId)).toNumber(),
        jsonString: await contract.tokenURI(tokenId),
      }))
    );
    setLayers(await Promise.all(layers.map(processMetadata)));
  };

  const importBoundLayers = async (tokenIds: number[]) => {
    setBoundLayers(
      await Promise.all(
        tokenIds.map(async (tokenId: number) => {
          const boundLayerIds = (await contract.getBoundLayers(tokenId)).map(
            (id: BigNumber) => id.toNumber()
          );
          const activeLayerIds = (await contract.getActiveLayers(tokenId)).map(
            (id: BigNumber) => id.toNumber()
          );
          const inactiveLayerIds = boundLayerIds.filter(
            (id: number) => !activeLayerIds.includes(id)
          );

          const handleLayerIds = async (
            layerIds: number[],
            isHidden: boolean
          ) => {
            let layers = [];
            for (const layerId of layerIds) {
              const jsonString = await metadataContract.getTokenURI(
                layerId,
                0,
                [],
                hexZeroPad("0x1", 32)
              );
              layers.push(
                await processMetadata({
                  tokenId,
                  jsonString,
                  layerId,
                  isHidden,
                  isBound: true,
                })
              );
            }
            return layers;
          };

          const layers = [
            ...(await handleLayerIds(activeLayerIds, false)),
            ...(await handleLayerIds(inactiveLayerIds, true)),
          ];

          return {
            tokenId,
            background: layers?.find(
              ({ layerType }) => layerType === LayerType.Background
            ),
            portrait: layers?.find(
              ({ layerType }) => layerType === LayerType.Portrait
            ),
            layers: layers?.filter(
              ({ layerType }) =>
                layerType === LayerType.Layer ||
                layerType === LayerType.Portrait
            ),
          };
        })
      )
    );
  };

  const fetchLayers = async () => {
    const transfersIn = await contract.queryFilter(
      contract.filters.Transfer(null, address)
    );
    const tokenIdsIn = transfersIn.map(({ topics }) => parseInt(topics[3]));

    const transfersOut = await contract.queryFilter(
      contract.filters.Transfer(address, null)
    );
    const tokenIdsOut = transfersOut.map(({ topics }) => parseInt(topics[3]));

    const bindEvents = await contract.queryFilter(
      contract.filters.LayersBoundToToken()
    );
    const boundTokenIds = bindEvents.map(({ topics }) => parseInt(topics[1]));

    const ownedTokenIds = tokenIdsIn.filter((id) => !tokenIdsOut.includes(id));
    const ownedBoundTokenIds = boundTokenIds.filter(
      (id) => tokenIdsIn.includes(id) && !tokenIdsOut.includes(id)
    );

    importLayers(ownedTokenIds);
    importBoundLayers(ownedBoundTokenIds);
  };

  useEffect(() => {
    if (address && contract) {
      fetchLayers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, contract]);

  const shuffle = async (all: boolean) => {
    const r = (arr: Layer[], n: number) =>
      arr.sort(() => 0.5 - Math.random()).slice(0, n);

    let activeLayers = active.layers;
    if (active.background) {
      activeLayers.push(active.background);
    }

    const availableLayers = all ? layers : activeLayers;

    const background = r(
      layersForType(availableLayers, LayerType.Background),
      1
    )[0];
    const portrait = r(
      layersForType(availableLayers, LayerType.Portrait),
      1
    )[0];
    const newLayers = r(layersForType(availableLayers, LayerType.Layer), 5);
    const portraitIndex = Math.floor(Math.random() * newLayers.length);

    setActive({
      background,
      portrait,
      layers: portrait
        ? [
            ...newLayers.slice(0, portraitIndex),
            portrait,
            ...newLayers.slice(portraitIndex),
          ]
        : newLayers,
    });
  };

  const clear = async () => {
    setActive({ layers: [] });
  };

  const addLayer = (layer: any) =>
    setActive({ ...active, layers: [layer, ...active.layers] });

  const removeLayer = (layer: any) =>
    setActive({ ...active, layers: active.layers.filter((l) => l !== layer) });

  const toggleLayer = (layer: any) =>
    setActive({
      ...active,
      layers: active.layers.map((l) =>
        l === layer ? { ...l, isHidden: !l.isHidden } : l
      ),
    });

  const addPortrait = (layer: any) => {
    setActive({
      ...active,
      portrait: layer,
      layers: [
        layer,
        ...active.layers.filter(
          ({ layerType }) => layerType !== LayerType.Portrait
        ),
      ],
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
        layers.every(
          (layer, i) =>
            layer.layerId === active.layers[i].layerId &&
            layer.isHidden === active.layers[i].isHidden
        )
      );
    });
  };

  return (
    <EditorContext.Provider
      value={{
        backgrounds: layersForType(
          layers,
          LayerType.Background,
          active.background && [active.background.tokenId]
        ),
        portraits: layersForType(
          layers,
          LayerType.Portrait,
          active.portrait && [active.portrait.tokenId]
        ),
        layers: layersForType(
          layers,
          LayerType.Layer,
          active.layers.map((l) => l.tokenId)
        ),

        active,
        boundLayers,

        clear,
        shuffle,
        fetchLayers,

        addBackground: (layer: any) =>
          setActive({ ...active, background: layer }),
        addPortrait,
        addLayer,
        removeLayer,
        toggleLayer,
        setLayers: (layers: any) => setActive({ ...active, layers }),
        setActive,

        isBackgroundsEnabled:
          isConnected && !!layersForType(layers, LayerType.Background)?.length,
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
