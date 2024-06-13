import { StyleSheet, ScrollView } from 'react-native'

import React, { useState, useEffect } from 'react'
import Header from '../../components/Header';
import Drive from '../../components/Drive';
import ModalView from '../../components/ModalView';


const Dashboard = () => {
  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [refresh, setRefresh] = useState(false);
  useEffect(() => {
    ////console.log('rnder',active,message)
  }, [active, loading])
  const modalHandler = (status, msg, isError = false) => {
    setActive(!active);
    setIsError(isError);
    setMessage(msg);
  }

  const handleLoader = (status) => {
    console.log('status', status);
    setLoading(status);
  }
  const handleRefresh = () => {
    setRefresh(!refresh)
  }
  return (
    <ScrollView style={styles.mainContainer}>
      <Header handleRefresh={handleRefresh} refresh={refresh} loading={loading} handleLoader={handleLoader} modalHandler={modalHandler} active={active} />
      <ModalView modalHandler={modalHandler} active={active} isError={isError} message={message} />
      <Drive loading={loading} refresh={refresh} active={active} handleLoader={handleLoader} />
    </ScrollView>
  )
}

export default Dashboard

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#F1F1F1'
  }
})