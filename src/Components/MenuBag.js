import React from 'react';
import { 
    View,
    Text,
    TouchableOpacity,
    Dimensions,
    Animated,
    StyleSheet,
    TouchableWithoutFeedback
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import Botao from './Botao';

const MenuBag = ({ visivel, callback }) => {
    const slideAnim = React.useRef(new Animated.Value(-200)).current;
    const fadeAnim = React.useRef(new Animated.Value(0)).current;

    React.useEffect(() => {
        if (visivel) {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true
                }),
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 200,
                    useNativeDriver: true
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(slideAnim, {
                    toValue: -200,
                    duration: 250,
                    useNativeDriver: true
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 150,
                    useNativeDriver: true
                })
            ]).start();
        }
    }, [visivel]);

    if (!visivel) return null;

    return (
        <>
            {/* Overlay para fechar ao clicar fora */}
            <TouchableWithoutFeedback onPress={() => callback('fechar')}>
                <Animated.View style={[styles.overlay, { opacity: fadeAnim }]} />
            </TouchableWithoutFeedback>

            <Animated.View style={[
                styles.menuContainer, 
                { 
                    transform: [{ translateY: slideAnim }],
                    opacity: fadeAnim
                }
            ]}>
                <View style={styles.menuHeader}>
                    <Text style={styles.menuTitle}>OPÇÕES DA SACOLA</Text>
                </View>

                <View style={styles.buttonsContainer}>
                    <TouchableOpacity 
                        style={[styles.menuButton, styles.saveButton]}
                        onPress={() => callback("orcamento")}
                        activeOpacity={0.8}
                    >
                        <Icon name="file-invoice-dollar" size={18} color="#fff" />
                        <Text style={styles.buttonText}>SALVAR COMO ORÇAMENTO</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={[styles.menuButton, styles.clearButton]}
                        onPress={() => callback("limparBag")}
                        activeOpacity={0.8}
                    >
                        <Icon name="trash-alt" size={18} color="#fff" />
                        <Text style={styles.buttonText}>LIMPAR SACOLA</Text>
                    </TouchableOpacity>
                </View>
            </Animated.View>
        </>
    );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    menuContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#2a2a2a',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        padding: 20,
        paddingBottom: 30,
        borderTopWidth: 2,
        borderTopColor: '#f0660a',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -5 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
        zIndex: 10
    },
    menuHeader: {
        alignItems: 'center',
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(240, 102, 10, 0.3)',
        paddingBottom: 10
    },
    menuTitle: {
        color: '#f0660a',
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    menuButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderRadius: 8,
        width: (windowWidth - 60) / 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5
    },
    saveButton: {
        backgroundColor: '#4CAF50',
        marginRight: 10
    },
    clearButton: {
        backgroundColor: '#F44336'
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        marginLeft: 10,
        fontSize: 14
    }
});

export default MenuBag;