import React, { useEffect } from 'react';
import { 
    View, 
    Dimensions, 
    Text, 
    TouchableOpacity, 
    StyleSheet,
    Image,
    SafeAreaView
} from 'react-native';
import Animated, { 
    useSharedValue, 
    useAnimatedStyle, 
    withTiming,
    Easing,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/dist/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

const SideMenuComponent = ({ abreSideMenu }) => {
    const navigation = useNavigation();
    const width = useSharedValue(0);
    const opacity = useSharedValue(0);
    const overlayOpacity = useSharedValue(0);

    // Configurações de animação
    const menuAnimation = useAnimatedStyle(() => {
        return {
            width: width.value,
            opacity: opacity.value,
            transform: [{
                translateX: interpolate(
                    width.value,
                    [0, (windowWidth/3)*2],
                    [-300, 0],
                    Extrapolate.CLAMP
                )
            }]
        };
    });

    const overlayAnimation = useAnimatedStyle(() => {
        return {
            opacity: overlayOpacity.value
        };
    });

    useEffect(() => {
        if(abreSideMenu) {
            width.value = withTiming((windowWidth/3)*2, {
                duration: 400,
                easing: Easing.out(Easing.exp)
            });
            opacity.value = withTiming(1, { duration: 300 });
            overlayOpacity.value = withTiming(0.5, { duration: 300 });
        } else {
            width.value = withTiming(0, {
                duration: 300,
                easing: Easing.in(Easing.exp)
            });
            opacity.value = withTiming(0, { duration: 200 });
            overlayOpacity.value = withTiming(0, { duration: 200 });
        }
    }, [abreSideMenu]);

    const navigateTo = (screen) => {
        // Fechar menu antes de navegar
        width.value = withTiming(0, { duration: 300 });
        opacity.value = withTiming(0, { duration: 200 });
        overlayOpacity.value = withTiming(0, { duration: 200 });
        
        setTimeout(() => {
            navigation.navigate(screen);
        }, 300);
    };

    return (
        <>
            {/* Overlay escuro */}
            {abreSideMenu && (
                <Animated.View style={[styles.overlay, overlayAnimation]}>
                    <TouchableOpacity 
                        style={styles.overlayTouchable}
                        activeOpacity={1}
                        onPress={() => {
                            width.value = withTiming(0, { duration: 300 });
                            opacity.value = withTiming(0, { duration: 200 });
                            overlayOpacity.value = withTiming(0, { duration: 200 });
                        }}
                    />
                </Animated.View>
            )}
            
            {/* Menu lateral */}
            <Animated.View style={[styles.menuContainer, menuAnimation]}>
                <LinearGradient
                    colors={['#2a2a2a', '#1a1a1a']}
                    style={styles.gradientBackground}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                >
                    <SafeAreaView style={styles.safeArea}>
                        {/* Cabeçalho do menu */}
                        <View style={styles.menuHeader}>
                            <Image
                                source={require('../../assets/logoGem.png')}
                                style={styles.logo}
                                resizeMode="contain"
                            />
                            <Text style={styles.menuTitle}>MENU</Text>
                        </View>

                        {/* Itens do menu */}
                        <View style={styles.menuItems}>
                            <TouchableOpacity 
                                style={styles.menuItem}
                                onPress={() => navigateTo('Orcamentos')}
                            >
                                <LinearGradient
                                    colors={['rgba(240, 102, 10, 0.2)', 'transparent']}
                                    style={styles.menuItemBackground}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                >
                                    <Icon name="file-invoice-dollar" size={18} color="#f0660a" />
                                    <Text style={styles.menuItemText}>Orçamentos</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.menuItem}
                                onPress={() => navigateTo('TrocarSenha')}
                            >
                                <LinearGradient
                                    colors={['rgba(240, 102, 10, 0.2)', 'transparent']}
                                    style={styles.menuItemBackground}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                >
                                    <Icon name="key" size={18} color="#f0660a" />
                                    <Text style={styles.menuItemText}>Trocar Senha</Text>
                                </LinearGradient>
                            </TouchableOpacity>

                            <TouchableOpacity 
                                style={styles.menuItem}
                                onPress={() => navigateTo('Login')}
                            >
                                <LinearGradient
                                    colors={['rgba(240, 102, 10, 0.2)', 'transparent']}
                                    style={styles.menuItemBackground}
                                    start={{ x: 0, y: 0.5 }}
                                    end={{ x: 1, y: 0.5 }}
                                >
                                    <Icon name="sign-out-alt" size={18} color="#f0660a" />
                                    <Text style={styles.menuItemText}>Sair</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* Rodapé do menu */}
                        <View style={styles.menuFooter}>
                            <Text style={styles.footerText}>v2.0.0</Text>
                        </View>
                    </SafeAreaView>
                </LinearGradient>
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
        backgroundColor: '#000',
        zIndex: 2
    },
    overlayTouchable: {
        flex: 1
    },
    menuContainer: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        zIndex: 3,
        shadowColor: '#f0660a',
        shadowOffset: { width: 5, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 20
    },
    gradientBackground: {
        flex: 1
    },
    safeArea: {
        flex: 1
    },
    menuHeader: {
        padding: 25,
        borderBottomWidth: 1,
        borderBottomColor: 'rgba(240, 102, 10, 0.3)',
        alignItems: 'center'
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 15
    },
    menuTitle: {
        color: '#f0660a',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 2
    },
    menuItems: {
        flex: 1,
        paddingTop: 20
    },
    menuItem: {
        marginHorizontal: 15,
        marginVertical: 8,
        borderRadius: 8,
        overflow: 'hidden'
    },
    menuItemBackground: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20
    },
    menuItemText: {
        color: '#fff',
        fontSize: 16,
        marginLeft: 15,
        fontWeight: '500'
    },
    menuFooter: {
        padding: 20,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: 'rgba(240, 102, 10, 0.3)'
    },
    footerText: {
        color: '#666',
        fontSize: 12
    }
});

export default SideMenuComponent;