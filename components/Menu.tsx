import {
  AspectRatio,
  Box,
  Flex,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useEditor } from "@slimesunday/context/editor";
import { faqs } from "@slimesunday/utils/faq";
import { useEffect, useState } from "react";

export const MacButtons = (props: any) => (
  <Stack direction="row" spacing={2} {...props}>
    <Box w={3} h={3} borderRadius={64} bgColor="#FF3B5E" />
    <Box w={3} h={3} borderRadius={64} bgColor="#3C3FFF" />
    <Box w={3} h={3} borderRadius={64} bgColor="#9F3BFF" />
  </Stack>
);

export const OpenSeaLogo = (props: any) => {
  const { boxSize, ...rest } = props;

  return (
    <Flex {...rest}>
      <Image
        src="https://opensea.io/static/images/logos/opensea.svg"
        alt="opensea"
        w={boxSize}
        h={boxSize}
      />
    </Flex>
  );
};

export const getStatus = (endTime: number) => {
  let difference = +new Date(endTime * 1000) - +new Date();

  if (difference > 0) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return `${days}:${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }:${seconds < 10 ? `0${seconds}` : seconds}`;
  }

  return "";
};

export const FAQ = ({ isOpen, onClose }: any) => (
  <Modal isOpen={isOpen} onClose={onClose} isCentered>
    <ModalOverlay />
    <ModalContent bgColor="transparent" maxW="3xl">
      <ModalBody p={0} m={0}>
        <Flex cursor="default" userSelect="none">
          <Flex w="full" direction="column">
            <Stack
              direction="row"
              bgColor="primary"
              w="full"
              align="center"
              borderTopRightRadius={8}
              borderTopLeftRadius={8}
              borderBottomColor="secondary"
              borderBottomWidth={1}
              p={4}
            >
              <MacButtons onClick={onClose} />
              <Spacer />
              <OpenSeaLogo boxSize={6} />
            </Stack>
            <Flex
              bgColor="primary"
              w="full"
              pl={4}
              pr={4}
              justify="center"
              align="center"
              textAlign="center"
              borderBottomRightRadius={8}
              borderBottomLeftRadius={8}
            >
              <Stack overflowY="scroll" maxH="md" spacing={8} pt={8} pb={8}>
                <AspectRatio maxH="400px">
                  <iframe
                    src="https://www.youtube.com/embed/1X074c0qGR0"
                    title="YouTube video player"
                    frameborder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowfullscreen
                  />
                </AspectRatio>
                {faqs.map(([question, answer]) => (
                  <Flex key={question} direction="column">
                    <Text fontWeight="bold" fontSize="lg">
                      {question}
                    </Text>
                    <Text fontSize="lg">{answer}</Text>
                  </Flex>
                ))}
              </Stack>
            </Flex>
          </Flex>
        </Flex>
      </ModalBody>
    </ModalContent>
  </Modal>
);

export const Menu = () => {
  const { chainConfig } = useEditor();
  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(getStatus(chainConfig.signatureEndTimestamp));
    }, 1000);

    return () => clearTimeout(timer);
  });

  return (
    <Flex
      h={8}
      w="full"
      justify="center"
      align="center"
      borderBottomWidth={1}
      borderColor="secondary"
      fontWeight="semibold"
      justifyContent="space-between"
      pl={4}
      pr={4}
    >
      <MacButtons />
      <Text fontWeight="bold">SLIMESHOP</Text>
      <Flex align="center">
        <Text fontWeight="bold" textAlign="end" whiteSpace="nowrap">
          {`${status}`}
        </Text>
      </Flex>
    </Flex>
  );
};
