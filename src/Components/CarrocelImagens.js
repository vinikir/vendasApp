import { 
    FlatList,
    Image,
    StyleSheet,
    TouchableOpacity,
    View,
    Dimensions
} from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const CarrocelImagens = ({ item, atualziarImagem }) => {
    if(!item.imgAdicional || item.imgAdicional.length === 0) return null;

    return (
        <View style={styles.container}>
            <FlatList 
                data={item.imgAdicional}
                renderItem={({ item: imageUrl, index }) => (
                    <TouchableOpacity 
                        style={styles.imageContainer}
                        onPress={() => atualziarImagem(imageUrl)}
                        activeOpacity={0.7}
                    >
                        <Image
                            style={styles.image}
                            source={{ uri: imageUrl }}
                        />
                        <View style={styles.overlay}>
                            <Icon name="zoom-in" size={20} color="#fff" />
                        </View>
                    </TouchableOpacity>
                )}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        marginVertical: 15,
        paddingHorizontal: 5,
    },
    listContent: {
        paddingHorizontal: 10,
    },
    imageContainer: {
        marginHorizontal: 5,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    image: {
        height: 80,
        width: 80,
        resizeMode: 'cover',
        backgroundColor: '#f0f0f0',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0,
    },
    imageContainerPressed: {
        opacity: 1,
    },
});

export default CarrocelImagens;