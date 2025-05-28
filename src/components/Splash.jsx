import {Spinner ,Center} from "@chakra-ui/react"

const Splash = () => {
    return (
      <>
      <Center mt="40%">
        <Spinner
    color="red.500"
    size="lg"
    css={{ "--spinner-track-color": "colors.gray.200" }} 

  />
      </Center>
      </>
    );
}

export default Splash;
