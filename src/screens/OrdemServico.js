import { useState } from "react"
import { 
    View,
    Dimensions,
    StyleSheet,
    TextInput,
    Text
} from "react-native"

const OrdemServico = ({route}) => {

    const [ placa, setPlaca ] = useState("") 
    const [ marca, setMarca ] = useState("")
    const [ modelo, setModelo ] = useState("")
    const infos = route.params
    
    const formatarInput = (event) => {
        event = event.toUpperCase()
        if(event.length < placa.length){
            setPlaca(event);
            return
        }
        
        let cleanValue = event.replace(/[^A-Za-z0-9-]/g, '');
        cleanValue = cleanValue.replace(/-/g, '');
      
        let part1 = cleanValue.substring(0, 3).replace(/[^A-Za-z]/g, ''); // AAA
        let part2 = cleanValue.substring(3, 4).replace(/[^0-9]/g, '');    // 0
        let part3 = cleanValue.substring(4, 5).replace(/[^A-Za-z0-9]/g, ''); // B
        let part4 = cleanValue.substring(5, 7).replace(/[^0-9]/g, '');    // 00
        let maskedValue = `${part1}-${part2}${part3}${part4}`;
        maskedValue.substring(0, 8);
        // Atualiza o campo
        setPlaca(maskedValue);
    }
      

    return(
        <View style={styles.container}>
            <View style={{ marginTop:10}}>
                <Text style={{color:"#FFF"}}>Placa</Text>
                <TextInput
                    style={ styles.input}
                    value={placa}
                    onChangeText={ (e) => formatarInput(e) }
                    placeholderTextColor="rgba(0, 0, 0, 0.6)"
                    autoCapitalize="none"
                    editable={true}
                />
            </View>
            <View style={{ marginTop:10}}>
                <Text style={{color:"#FFF"}}>Marca</Text>
                <TextInput
                    style={ styles.input}
                    value={marca}
                    onChangeText={ (e) => setMarca(e) }
                    placeholderTextColor="rgba(0, 0, 0, 0.6)"
                    autoCapitalize="none"
                    editable={true}
                />
            </View>
            <View style={{ marginTop:10}}>
                <Text style={{color:"#FFF"}}>Modelo</Text>
                <TextInput
                    style={ styles.input}
                    value={modelo}
                    onChangeText={ (e) => setModelo(e) }
                    placeholderTextColor="rgba(0, 0, 0, 0.6)"
                    autoCapitalize="none"
                    editable={true}
                />
            </View>
            <View style={{ marginTop:10}}>
                <Text style={{color:"#FFF"}}>Modelo</Text>
                <TextInput
                    style={ styles.input}
                    value={modelo}
                    onChangeText={ (e) => setModelo(e) }
                    placeholderTextColor="rgba(0, 0, 0, 0.6)"
                    autoCapitalize="none"
                    editable={true}
                />
            </View>

        </View>
    )
}
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    container:{
        flex:1,
        //justifyContent: 'center',
        alignItems:'center',
        width: windowWidth,
        backgroundColor:"#4a4a4a"
        
    },
    input:{ 
        backgroundColor: '#4a4a4a', 
        color: '#fff', // Cor do texto
        width: windowWidth-90,
        borderRadius:5,
        paddingLeft:5,
        height:45,
        borderWidth: 1,
        borderColor: '#707070', 
        elevation:5,
        
    },
})
export default OrdemServico