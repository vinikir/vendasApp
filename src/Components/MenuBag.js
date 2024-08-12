import { 
    View,
    Text,
    TouchableOpacity,
    Dimensions
} from 'react-native';

const MenuBag = ({visivel, callback}) => {
    if(visivel == true){
        return(
            <View style={{flex:1, height:50, width:(windowWidth/3)*2, backgroundColor:"#757575", elevation:5, position:"absolute", zIndex:2, alignItems:"center", justifyContent:"center"}} >
                <TouchableOpacity onPress={() => callback("orcamento")} style={{ backgroundColor:"blue", height:40, width:(windowWidth/2), borderRadius:5, alignItems:"center", justifyContent:"center", elevation:5}}>
                    <Text style={{ color:"#ffff", fontWeight:"bold"}}>salvar como orçamento</Text>
                </TouchableOpacity>
            </View>
        )
    }
    

}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

export default MenuBag