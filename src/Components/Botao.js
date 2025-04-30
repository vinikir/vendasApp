import { 
    StyleSheet,
    Text,
    TouchableOpacity,
    Dimensions,
    ActivityIndicator,
    View
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Botao = ({
    backgroundColor = '#f0660a', 
    label, 
    color = "#fff", 
    callback, 
    width = windowWidth - 90, 
    disabled = false,
    loading = false,
    iconName = null,
    iconPosition = 'left',
    style = {}
}) => {
    const ButtonContent = () => (
        <View style={styles.contentContainer}>
            {iconName && iconPosition === 'left' && !loading && (
                <Icon name={iconName} size={20} color={color} style={styles.iconLeft} />
            )}
            
            {loading ? (
                <ActivityIndicator size="small" color={color} />
            ) : (
                <Text style={[styles.text, {color}]}>{label}</Text>
            )}
            
            {iconName && iconPosition === 'right' && !loading && (
                <Icon name={iconName} size={20} color={color} style={styles.iconRight} />
            )}
        </View>
    );

    return (
        <TouchableOpacity 
            disabled={disabled || loading}
            onPress={callback}
            activeOpacity={0.7}
            style={[styles.container, {width}, style]}
        >
            {backgroundColor === 'gradient' ? (
                <LinearGradient
                    colors={['#f0660a', '#e55b00']}
                    style={styles.gradient}
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 0}}
                >
                    <ButtonContent />
                </LinearGradient>
            ) : (
                <View style={[styles.background, {backgroundColor: disabled ? '#cccccc' : backgroundColor}]}>
                    <ButtonContent />
                </View>
            )}
        </TouchableOpacity>
    ) 
}

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    container: {
        height: 50,
        borderRadius: 8,
        overflow: 'hidden',
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    contentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    iconLeft: {
        marginRight: 10,
    },
    iconRight: {
        marginLeft: 10,
    },
});

export default Botao;