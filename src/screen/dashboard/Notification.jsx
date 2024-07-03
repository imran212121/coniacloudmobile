import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { AppColor } from '../../utils/AppColors'
import CustomHeader from '../../components/CustomHeader'
import { useNavigation } from '@react-navigation/native'
import { fileColorCode } from '../../constant/settings'

const data = [
    {
        id: 1,
        text: 'You shared a file on Whatsapp to Fatima OA.',
        date: '29 June 2022, 7.14 PM',
        name: 'x',
    },
    {
        id: 2,
        text: 'You shared a file on Whatsapp to Fatima OA.',
        date: '29 June 2022, 7.14 PM',
        name: 'y',
    },
    {
        id: 3,
        text: 'You shared a file on Whatsapp to Fatima OA.',
        date: '29 June 2022, 7.14 PM',
        name: 'z',
    }
]

const Notification = () => {
    const navigation=useNavigation()
    const renderItem = ({ item }) => (
        <TouchableOpacity style={styles.Box}>
            <View>
                
                <Text style={{marginBottom:8}}>{item.date}</Text>
                <Text>{item.text}</Text>
            </View>
            <View style={[styles.circle,{ backgroundColor: fileColorCode[Math.floor(Math.random() * 4)]}]}>
            <Text style={{fontSize:22}}>{item.name}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <CustomHeader back={true} title={'Notification'} left={true} OnPress={()=>navigation.goBack()} />
            <FlatList
                data={data}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()} 
            />
        </View>
    );
}

export default Notification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 15,
        backgroundColor: AppColor.bgcolor
    },
    Box: {
        width: '100%',
        backgroundColor: AppColor.white,
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 10,
        borderRadius:15,
        flexDirection:'row',
        paddingVertical:20
    },
    circle:{
        height:32,width:32,backgroundColor:'pink',
        alignItems:'center',
        justifyContent:'center',
        borderRadius:30
    }
});
