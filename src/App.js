import React, { useState } from 'react';
import {
  ChakraProvider,
  Box,
  Text,
  Grid,
  theme,
  Textarea,
  Button,
  HStack,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

const App = () => {
  const [lineasTotales, setLineasTotales] = useState(0);
  const [lineasDeCodigo, setLineasDeCodigo] = useState(0);
  const [lineasDeCodigoComentadas, setLineasDeCodigoComentadas] = useState(0);
  const [
    porcentajeLineasDeCodigoComentadas,
    setPorcentajeLineasDeCodigoComentadas,
  ] = useState(0);

  const [complejidadCiclomatica, setComplejidadCiclomatica] = useState(0);

  const [halsteadLongitud, setHalsteadLongitud] = useState(0);

  const [halsteadVolumen, setHalsteadVolumen] = useState(0);

  const calcular = () => {
    setLineasTotales(10);
    setLineasDeCodigo(10);
    setLineasDeCodigoComentadas(10);
    setPorcentajeLineasDeCodigoComentadas(10);
    setComplejidadCiclomatica(10);
    setHalsteadLongitud(10);
    setHalsteadVolumen(10);
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Text>Ingrese el código</Text>
          <Textarea></Textarea>

          <Box>
            <Button colorScheme="blue" width="50" onClick={calcular}>
              Calcular
            </Button>
          </Box>

          <HStack spacing={8} justifyContent="center">
            <Box>
              <Text>Lineas totales</Text>
              <Text>{lineasTotales}</Text>
            </Box>
            <Box>
              <Text>Lineas de código</Text>
              <Text>{lineasDeCodigo}</Text>
            </Box>
            <Box>
              <Text>Lineas de Codigo Comentadas</Text>
              <Text>{lineasDeCodigoComentadas}</Text>
            </Box>
            <Box>
              <Text>Porcentaje Lineas Comentadas</Text>
              <Text>{porcentajeLineasDeCodigoComentadas} %</Text>
            </Box>
          </HStack>
          <HStack spacing={8} justifyContent="center">
            <Box>
              <Text>Complejidad Ciclomatica</Text>
              <Text>{complejidadCiclomatica}</Text>
            </Box>
            <Box>
              <Text>Halstead Longitud </Text>
              <Text>{halsteadLongitud}</Text>
            </Box>
            <Box>
              <Text>Halstead Volumen</Text>
              <Text>{halsteadVolumen}</Text>
            </Box>
          </HStack>

          <HStack justifyContent="center">
            <Box maxW="200">
              <Text>Operadores Halstead</Text>
              <Textarea></Textarea>
            </Box>
          </HStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};

export default App;
