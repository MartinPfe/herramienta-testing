import {
  Box,
  Button,
  ChakraProvider,
  Grid,
  HStack,
  Text,
  Textarea,
  theme,
  Select,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { ColorModeSwitcher } from './ColorModeSwitcher';

const App = () => {
  const [lineasTotales, setLineasTotales] = useState(0);
  const [lineasDeCodigo, setLineasDeCodigo] = useState(0);
  const [lineasDeCodigoComentadas, setLineasDeCodigoComentadas] = useState(0);
  const [lineasEnBlanco, setLineasEnBlanco] = useState(0);
  const [recomendacionModular,setRecomendacionModular] = useState('');

  const [fanIn, setFanIn] = useState(0);
  const [fanOut, setFanOut] = useState(0);
  const [metodoFanIn, setMetodoFanIn] = useState(null);
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
  //   '+,-,/,*,:,&&,||,<=,>=,<,>,=,==,!=,{},system.out.println,public,static,void,int,double,float,string,if,else,elseif'
  // );

  const handleSetMethod = event =>  {
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

  const calcular = () => {
    if (operadoresHalsted.length === 0) {
      mostrarError('Debe ingresar operadores halstead');
      return;
    }

    if (codigo.length === 0) {
      mostrarError('Debe ingresar el código a analizar');
      return;
    }

    setLineasTotales(codigo.split('\n').length - 1);

    setLineasEnBlanco(codigo.split('\n').filter(l => l.trim() === '').length);

    setLineasDeCodigoComentadas(codigo.split('//').length - 1);
    setFanOut(codigo.split(/.*\(.*\);/gm).length-1);
    let array = ['metodo1','metodo2','metodo3'];

    // La idea es que metodos tenga todos los nombres de los metodos que hay en el codigo obtenidos mediante regex pero no lo logre todavia.
    // const metodos = codigo.split(/(public|protected|private|static|\s) +[\w\<\>\[\]]+\s+(\w+) *\([^\)]*\)/gm);
    // Y mandarlos en setMetodosEnCodigo.
    //   let i=0;
    //   console.log('aca'+metodos)
    // for(i=0;i<metodos.length;i++){
    //   console.log('Elemento '+metodos[i]);
    // }

    setMetodosEnCodigo(array);
    calcularComplejidadCiclomatica();
    calcularHalsteadMetodo();
    setFanIn(0);
  };

  useEffect(() => {
    // Aca me parece que a las lineas de codigo comentadas habria que sumarle las en blanco ya que no serian parte de las lineas de codigo, sino de las totales.
    /// setLineasDeCodigo(parseInt(lineasTotales - lineasDeCodigoComentadas);
    setLineasDeCodigo(parseInt(lineasTotales - (lineasDeCodigoComentadas+lineasEnBlanco)));
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
    console.log('Nodos predicados:'+ c);
    c++;
    setComplejidadCiclomatica(c);
    setRecomendacionModular(c>11?'Se recomienda modularizar el código':'No es necesario modularizar el código');
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
// (?:(?:public)|(?:private)|(?:static)|(?:protected)\s+)*
  return (
    <ChakraProvider theme={theme}>
      <Box textAlign="center" fontSize="xl">
        <Grid minH="100vh" p={2}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Text style={{textAlign:'left'}}>Ingrese el código</Text>
          <Textarea 
            value={codigo}
            onChange={handleChange} 
            size="md"
            resize={'vertical'}
            style={{height: 250}}
            />
          <Box>
          <Text style={{marginTop:10,marginBottom:10, color:complejidadCiclomatica>11?'red':'green'}}>{recomendacionModular}</Text>
          </Box>
          <Box>
            <Button colorScheme="blue" width="50" onClick={calcular}>
              Calcular
            </Button>
          </Box>

          <HStack spacing={8} justifyContent="center">
            <Box>
              <Text style={{fontWeight:'bolder'}}>Lineas totales</Text>
              <Text>{lineasTotales}</Text>
            </Box>
            <Box>
              <Text style={{fontWeight:'bolder'}}>Lineas de solo código</Text>
              <Text>{lineasDeCodigo}</Text>
            </Box>
            <Box>
              <Text style={{fontWeight:'bolder'}}>Lineas Comentadas</Text>
              <Text>{lineasDeCodigoComentadas}</Text>
            </Box>
            <Box>
              <Text style={{fontWeight:'bolder'}}>Lineas en blanco</Text>
              <Text>{lineasEnBlanco}</Text>
            </Box>
            <Box>
              <Text style={{fontWeight:'bolder'}}>Porcentaje de comentarios</Text>
              <Text>{porcentajeLineasDeCodigoComentadas} %</Text>
            </Box>
          </HStack>
          <HStack spacing={8} justifyContent="center">
            <Box>
              <Text style={{fontWeight:'bolder'}}>Complejidad Ciclomatica</Text>
              <Text>{complejidadCiclomatica}</Text>
            </Box>
            <Box>
              <Text style={{fontWeight:'bolder'}}>Halstead Longitud </Text>
              <Text>{halsteadLongitud}</Text>
            </Box>
            <Box>
              <Text style={{fontWeight:'bolder'}}>Halstead Volumen</Text>
              <Text>{halsteadVolumen}</Text>
            </Box>
            </HStack>
          <HStack spacing={8} justifyContent="center">
            <Box>
              <Text style={{fontWeight:'bolder'}}>Fan In </Text>
              
              {metodoFanIn?
              <>
                <Text style={{fontSize:10, backgroundColor:'black',color:'white', fontWeight:'bolder', borderRadius:5, padding:5}}>Método: {metodoFanIn}</Text>
                <Text style={{fontWeight:'bolder'}}>{fanIn}</Text> 
              </> :
              <Select placeholder="Metodo a medir" onChange={e => {handleSetMethod(e)}}>
                {/* <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option> */}
                {metodosEnCodigo.map(method=>
                <> <option value={method}>{method}</option> </>)
                }
              </Select>
              }
              
            </Box>
            <Box>
              <Text style={{fontWeight:'bolder'}}>Fan Out</Text>
              <Text>{fanOut}</Text>
            </Box>

            <Box minW="300" maxW="300">
              <Text style={{fontWeight:'bolder'}}>Operadores Halstead</Text>
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
