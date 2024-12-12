import { 
    FlatList,
    Image ,
    StyleSheet,
    TouchableOpacity
} from "react-native"

const CarrocelImagens = ({item, atualziarImagem} ) => {

    if(item.imgAdicional && item.imgAdicional.length > 0){
        return (
            <FlatList 
                data={item.imgAdicional }
                renderItem={({item}) => {
                    
                    return (
                        <TouchableOpacity style={{ marginLeft:2.5, marginRight:2.5}} onPress={() => atualziarImagem(item)}>
                            <Image
                                style={styles.imgInfo}
                                source={{ uri: item }}
                            />
                        </TouchableOpacity>
                        
                    )
                }}
                horizontal={true}
            />
        )
    }
    
}

const styles = StyleSheet.create({
    imgInfo:{
        height:80,
        width: 80,
		
        resizeMode: 'stretch',
		borderRadius:10
    },
})

export default CarrocelImagens