import {
  Box,
  Button,
  ChakraProvider,
  Grid,
  HStack,
  Text,
  Textarea,
  theme,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
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

  const [codigo, setCodigo] = useState('');
  const [operadoresHalsted, setOperadoresHalsted] = useState(
    '+, -, /, *, int, double, float, ;, :, public, static, void, &&, ||, <=, >=, <, >'
  );

  const handleChange = event => {
    setCodigo(event.target.value);
  };

  const handleChangeOperadores = event => {
    setOperadoresHalsted(event.target.value);
  };

  const mostrarError = mensaje => {
    alert(mensaje);
  };

  const calcular = () => {
    if (operadoresHalsted.length === 0) {
      mostrarError('Debe completar los operadores halsted');
      return;
    }

    if (codigo.length === 0) {
      mostrarError('Debe completar el código');
      return;
    }

    setLineasTotales(codigo.split('\n').length - 1);

    setLineasDeCodigoComentadas(codigo.split('//').length - 1);

    console.log('lineasTotales:', lineasTotales);
    console.log('lineasDeCodigoComentadas:', lineasDeCodigoComentadas);

    calcularComplejidadCiclomatica();
    calcularHalsteadMetodo();
  };

  useEffect(() => {
    setLineasDeCodigo(parseInt(lineasTotales - lineasDeCodigoComentadas));

    let porcentajeComentadas =
      lineasDeCodigoComentadas === 0
        ? 0
        : parseFloat(
            (parseInt(lineasDeCodigoComentadas) / parseInt(lineasTotales)) * 100
          ).toFixed(2);

    setPorcentajeLineasDeCodigoComentadas(porcentajeComentadas);
  }, [lineasTotales, lineasDeCodigoComentadas]);

  const calcularComplejidadCiclomatica = () => {
    var c = 0;
    c += codigo.split('if').length - 1;
    console.log('if:', c);
    c += codigo.split('else').length - 1;
    console.log('else:', c);
    c += codigo.split('for').length - 1;
    console.log('for:', c);
    c += codigo.split('while').length - 1;
    console.log('while:', c);
    c += codigo.split('||').length - 1;
    console.log('||:', c);
    c += codigo.split('&&').length - 1;
    console.log("('&&').:", c);
    c++;
    setComplejidadCiclomatica(c);
  };

  const calcularHalsteadMetodo = () => {
    var texto = codigo;

    var textosSinComentarios = texto.replace(
      /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm,
      ''
    );
    var cantidadOperadoresTotales = 0;
    var cantidadOperandosTotales = 0;
    var cantidadOperadoresUnicos = 0;
    var cantidadOperandosUnicos = 0;

    var operadores = operadoresHalsted;
    var operandosUnicos = [];
    var i;
    //OPERADORES UNICOS Y TOTALES.
    for (i = 0; i < operadores.length; i++) {
      if (textosSinComentarios.indexOf(operadores[i]) !== -1)
        cantidadOperadoresUnicos++;
      cantidadOperadoresTotales += texto.split(operadores[i]).length - 1;
    }

    //OPERADORES TOTALES

    //OPERANDOS UNICOS Y TOTALES.
    var aAnalizar = textosSinComentarios.split(' ');
    var hasta = textosSinComentarios.split(' ').length;
    for (let j = 0; j < hasta; j++) {
      //Si no es un operador y todavia no esta en el array de operandos unicos.
      if (
        operadores.indexOf(aAnalizar[j]) === -1 &&
        operandosUnicos.indexOf(aAnalizar[j]) === -1
      ) {
        operandosUnicos.push(aAnalizar[j]);
        cantidadOperandosUnicos++;
      }
      //Si no es un operador.
      if (operadores.indexOf(aAnalizar[j]) === -1) cantidadOperandosTotales++;
    }
    var longitudHalstead = parseInt(
      cantidadOperadoresUnicos * Math.log2(cantidadOperadoresUnicos) +
        cantidadOperandosUnicos * Math.log2(cantidadOperandosUnicos)
    );
    var volumenHalstead = parseFloat(
      (cantidadOperadoresTotales + cantidadOperandosTotales) *
        Math.log2(cantidadOperadoresUnicos + cantidadOperandosUnicos)
    ).toFixed(2);

    setHalsteadLongitud(longitudHalstead);
    setHalsteadVolumen(volumenHalstead);

    return [longitudHalstead, volumenHalstead];
  };

  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Text>Ingrese el código</Text>
          <Textarea value={codigo} onChange={handleChange} />

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
              <Textarea
                value={operadoresHalsted}
                onChange={handleChangeOperadores}
              />
            </Box>
          </HStack>
        </Grid>
      </Box>
    </ChakraProvider>
  );
};

export default App;
