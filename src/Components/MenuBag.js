import { 
    View,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';
import Botao from './Botao';
const MenuBag = ({visivel, callback}) => {

    if(visivel == true){
        return(
            <View style={{flex:1,  height:110, width:(windowWidth/3)*2, borderTopWidth:1,borderTopColor:"#4a4a4a", backgroundColor:"#707070", elevation:5, position:"absolute", zIndex:2, alignItems:"center", justifyContent:"space-around"}} >
                <View>
                    <Botao 
                        width={windowWidth/2}
                        label="Salvar como orçamento"
                        callback={() => { callback("orcamento") }}
                        backgroundColor="blue"
                    />
                    
                </View>
                <View>

                    <Botao 
                        width={windowWidth/2}
                        label="Limpar Bag"
                        callback={() => { callback("limparBag") }}
                        backgroundColor="blue"
                    />

                </View>
                
                
            </View>
        )
    }
    

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default MenuBag