import {
  Box,
  Flex,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ALLOWLIST_START_TIME } from "@slimesunday/utils/allowlist";
import { faqs } from "@slimesunday/utils/faq";
import { useEffect, useState } from "react";
import { FaQuestionCircle } from "react-icons/fa";

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

export const getStatus = () => {
  let difference = +ALLOWLIST_START_TIME - +new Date();

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
const FAQ = ({ isOpen, onClose }: any) => {
  return (
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
                <Stack overflowY="scroll" maxH="2xl" spacing={8} pt={8} pb={8}>
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
};

export const Menu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [status, setStatus] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setStatus(getStatus());
    }, 1000);

    return () => clearTimeout(timer);
  });

  useEffect(() => {
    if (!localStorage.getItem("visited")) {
      onOpen();
      localStorage.setItem("visited", "true");
    }
  }, [onOpen]);

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
          {`PRIVATE SALE - ${status}`}
        </Text>
        <Icon ml={2} as={FaQuestionCircle} onClick={onOpen} cursor="pointer" />
      </Flex>
      <FAQ isOpen={isOpen} onClose={onClose} />
    </Flex>
  );
};
