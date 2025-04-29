// import DeviceInfo, { getVersion } from 'react-native-device-info';

// export const getVersaoApp = async () => {

    
//     const versionBundle = getVersion()

//     return "V " + versionBundle + ".1"

    
// }

export const formatMoney = (value) => {
    // Remove caracteres não numéricos
    const cleanedValue = value.replace(/[^0-9]/g, '');

    // Adiciona a vírgula se a quantidade de dígitos for maior que 2
    let formattedValue = cleanedValue;
    
    if (cleanedValue.length > 2) {
        formattedValue = `${cleanedValue.slice(0, -2)},${cleanedValue.slice(-2)}`;
    }

    // Retorna o valor formatado
    return formattedValue;
};