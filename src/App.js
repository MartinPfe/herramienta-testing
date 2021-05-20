import {
  Box,
  Button,
  ChakraProvider,
  Grid,
  HStack,
  Select,
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
  const [lineasEnBlanco, setLineasEnBlanco] = useState(0);
  const [recomendacionModular, setRecomendacionModular] = useState('');
  // eslint-disable-next-line
  const [fanIn, setFanIn] = useState(0);
  const [fanOut, setFanOut] = useState(0);
  // eslint-disable-next-line
  const [metodoFanIn, setMetodoFanIn] = useState(null);
  // eslint-disable-next-line
  const [metodosEnCodigo, setMetodosEnCodigo] = useState([]);

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

  // const [operadoresHalsted, setOperadoresHalsted] = useState(
  //   'if, for, while, else, {, }, new, switch,(,),do,class,extends,return, finally, throw, throws, =, ==, +=, -=, *=, /=, >, <, >>, <<, >>>, >=, <=, +, /, *, -, ++, --, int, double, float, &&, ||'
  // );

  // const [operadoresHalsted, setOperadoresHalsted] = useState(
  //   '+,-,/,*,:,&&,||,<=,>=,<,>,=,==,!=,{},system.out.println,public,static,void,int,double,float,string,if,else,elseif'
  // );
  // eslint-disable-next-line
  const handleSetMethod = event => {
    setMetodoFanIn(event.target.value);
  };

  const handleChange = event => {
    setCodigo(event.target.value);
  };

  const handleChangeOperadores = event => {
    setOperadoresHalsted(event.target.value);
  };

  const mostrarError = mensaje => {
    alert(mensaje);
  };

  useEffect(() => {
    if ((metodoFanIn || '').length > 0) {
      setFanOut(codigo.split(metodoFanIn).length - 2);
    } else {
      setFanOut(0);
    }
  }, [metodoFanIn, codigo]);

  const calcular = () => {
    if (operadoresHalsted.length === 0) {
      mostrarError('Debe ingresar operadores halstead');
      return;
    }

    if (codigo.length === 0) {
      mostrarError('Debe ingresar el código a analizar');
      return;
    }

    setLineasTotales(codigo.split('\n').length);

    setLineasEnBlanco(codigo.split('\n').filter(l => l.trim() === '').length);

    var cantComentarios = 0;
    var enComentario = false;
    var regexFunciones = new RegExp(
      '((public|private|protected|static|final|native|synchronized|abstract|transient)+\\s)+[\\$_\\w\\<\\>\\[\\]]*\\s+[\\$_\\w]+\\([^\\)]*\\)?\\s*\\{?[^\\}]*\\}?'
    );

    setMetodosEnCodigo([]);

    var regexNombre = new RegExp(/([a-zA-Z_{1}][a-zA-Z0-9_]+)(?=\()/g);

    if (codigo.length > 0) {
      codigo.split('\n').forEach(linea => {
        if (linea.includes('//')) cantComentarios++;
        else if (linea.includes('/*')) {
          cantComentarios++;
          enComentario = true;
        } else if (enComentario) {
          if (linea.includes('*/')) {
            enComentario = false;
          }
          cantComentarios++;
        }

        if (regexFunciones.test(linea)) {
          setMetodosEnCodigo(metodosEnCodigo => [
            ...metodosEnCodigo,
            linea.match(regexNombre)[0],
          ]);
        }
      });
    }

    setLineasDeCodigoComentadas(cantComentarios);

    calcularComplejidadCiclomatica();
    calcularHalsteadMetodo();
    setFanIn(0);
    setFanOut(0);
    //setFanOut(codigo.split(/.*\(.*\);/gm).length - 1);
  };

  useEffect(() => {
    // Aca me parece que a las lineas de codigo comentadas habria que sumarle las en blanco ya que no serian parte de las lineas de codigo, sino de las totales.
    /// setLineasDeCodigo(parseInt(lineasTotales - lineasDeCodigoComentadas);
    setLineasDeCodigo(
      parseInt(lineasTotales - (lineasDeCodigoComentadas + lineasEnBlanco))
    );
    let porcentajeComentadas =
      lineasDeCodigoComentadas === 0
        ? 0
        : parseFloat(
            (parseInt(lineasDeCodigoComentadas) / parseInt(lineasTotales)) * 100
          ).toFixed(2);

    setPorcentajeLineasDeCodigoComentadas(porcentajeComentadas);
  }, [lineasTotales, lineasDeCodigoComentadas, lineasEnBlanco]);

  const calcularComplejidadCiclomatica = () => {
    var c = 0;
    c += codigo.split('if').length - 1;
    //console.log('Tiene en cuenta if:', c);

    // Entiendo que el else no se deberia contar xq no generan un nodo predicado, solo el que deriva dos condiciones,
    // es decir con un IF tengo implicitamente el verdadero y el falso.., y los else if se cuentan implicitamente al contar el if.
    // c += codigo.split('else').length - 1;

    // console.log('else:', c);
    c += codigo.split('for').length - 1;
    //console.log('Tiene en cuenta for:', c);
    c += codigo.split('while').length - 1;
    //console.log('Tiene en cuenta while:', c);
    c += codigo.split('||').length - 1;
    //console.log('Tiene en cuenta ||:', c);
    c += codigo.split('&&').length - 1;
    //console.log("Tiene en cuenta '&&':", c);
    //console.log('Nodos predicados:' + c);
    c++;
    setComplejidadCiclomatica(c);
    setRecomendacionModular(
      c > 11
        ? 'Se recomienda modularizar el código'
        : 'No es necesario modularizar el código'
    );
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
    var operadores = operadoresHalsted.split(',');
    var operandosUnicos = [];
    var i;
    //OPERADORES UNICOS Y TOTALES.
    /// Este metodo no esta dando bien, lo quise arreglar pero se me hizo imposible
    /// Lo dejo como estaba por ahora.
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
      // Tecnicamente si no es un operador, es un operando.
      //Si no es un operador y todavia no esta en el array de operandos unicos.
      if (
        operadores.indexOf(aAnalizar[j]) === -1 &&
        operandosUnicos.indexOf(aAnalizar[j]) === -1
      ) {
        operandosUnicos.push(aAnalizar[j]);
        cantidadOperandosUnicos++;
      }

      //Si no es un operador.
      if (!operadores.includes(aAnalizar[j])) {
        cantidadOperandosTotales++;
      }
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
  };
  // (?:(?:public)|(?:private)|(?:static)|(?:protected)\s+)*
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={2}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Text style={{ textAlign: 'left' }}>Ingrese el código</Text>
          <Textarea
            value={codigo}
            onChange={handleChange}
            size="md"
            resize={'vertical'}
            style={{ height: 250 }}
          />
          <Box>
            <Text
              style={{
                marginTop: 10,
                marginBottom: 10,
                color: complejidadCiclomatica > 11 ? 'red' : 'green',
              }}
            >
              {recomendacionModular}
            </Text>
          </Box>
          <Box>
            <Button colorScheme="blue" width="50" onClick={calcular}>
              Calcular
            </Button>
          </Box>

          <HStack spacing={8} justifyContent="center">
            <Box>
              <Text style={{ fontWeight: 'bolder' }}>Lineas totales</Text>
              <Text>{lineasTotales}</Text>
            </Box>
            <Box>
              <Text style={{ fontWeight: 'bolder' }}>
                Lineas de solo código
              </Text>
              <Text>{lineasDeCodigo}</Text>
            </Box>
            <Box>
              <Text style={{ fontWeight: 'bolder' }}>Lineas Comentadas</Text>
              <Text>{lineasDeCodigoComentadas}</Text>
            </Box>
            <Box>
              <Text style={{ fontWeight: 'bolder' }}>Lineas en blanco</Text>
              <Text>{lineasEnBlanco}</Text>
            </Box>
            <Box>
              <Text style={{ fontWeight: 'bolder' }}>
                Porcentaje de comentarios
              </Text>
              <Text>{porcentajeLineasDeCodigoComentadas} %</Text>
            </Box>
          </HStack>
          <HStack spacing={8} justifyContent="center">
            <Box>
              <Text style={{ fontWeight: 'bolder' }}>
                Complejidad Ciclomatica
              </Text>
              <Text>{complejidadCiclomatica}</Text>
            </Box>
            <Box>
              <Text style={{ fontWeight: 'bolder' }}>Halstead Longitud </Text>
              <Text>{halsteadLongitud}</Text>
            </Box>
            <Box>
              <Text style={{ fontWeight: 'bolder' }}>Halstead Volumen</Text>
              <Text>{halsteadVolumen}</Text>
            </Box>
          </HStack>
          <HStack spacing={8} justifyContent="center">
            <Box>
              <Select
                placeholder="Metodo a medir"
                onChange={e => {
                  handleSetMethod(e);
                }}
              >
                {metodosEnCodigo.length > 0 ? (
                  metodosEnCodigo.map(method => (
                    <>
                      {' '}
                      <option key={method} value={method}>
                        {method}
                      </option>{' '}
                    </>
                  ))
                ) : (
                  <option key="" value="">
                    No hay metodos
                  </option>
                )}
              </Select>
            </Box>
            <Box>
              <Text style={{ fontWeight: 'bolder' }}>Fan In </Text>
              <Text>{fanIn}</Text>
            </Box>
            <Box>
              <Text style={{ fontWeight: 'bolder' }}>Fan Out</Text>
              <Text>{fanOut}</Text>
            </Box>

            <Box minW="300" maxW="300">
              <Text style={{ fontWeight: 'bolder' }}>Operadores Halstead</Text>
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
