import { 
   
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions

} from 'react-native';

const Botao = ({backgroundColor , label, color = "#fff", callback, width=windowWidth-90, disabled = false}) => {
    return (
        <TouchableOpacity disabled={disabled} style={[styles.btnLogin, {backgroundColor: backgroundColor, width:width}]} onPress={() => callback()}>
            <Text style={{ color:color, fontWeight:"bold" }}>{label}</Text>
        </TouchableOpacity>
    ) 
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    btnLogin:{
        height: 45,
        justifyContent: 'center',
        alignItems:'center',
        borderRadius:5,
        elevation:5
    },
})

export default Botao