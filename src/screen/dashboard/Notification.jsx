import { FlatList, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { AppColor } from '../../utils/AppColors'
import CustomHeader from '../../components/CustomHeader'

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
        name: 'x',
    },
    {
        id: 3,
        text: 'You shared a file on Whatsapp to Fatima OA.',
        date: '29 June 2022, 7.14 PM',
        name: 'x',
    }
]

const Notification = () => {
    const renderItem = ({ item }) => (
        <View style={styles.Box}>
            <Text>{item.text}</Text>
            <Text>{item.date}</Text>
            <Text>{item.name}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <CustomHeader back={true} title={'Notification'} left={true} />
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
        backgroundColor: 'red',
        height: 100,
        justifyContent: 'space-between',
        padding: 10,
        marginBottom: 10,
    }
});
