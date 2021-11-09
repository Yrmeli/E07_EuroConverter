/*
	http://api.exchangeratesapi.io/v1/latest?access_key=33c5cc4eca9cc4b269ac8596c3328a4a

*/


// Import
	import React, { useEffect, useState } from 'react';
	import { StatusBar } from 'expo-status-bar';
	import { StyleSheet, Text, View, Button, TextInput, Image, TouchableWithoutFeedback, Keyboard } from 'react-native';
	import { Picker } from '@react-native-picker/picker';

// Main

export default function App() {

	const [summa, setSumma] = useState('');
	const [valuutta, setValuutta] = useState('');
	const [arvot, setArvot] = useState([]);
	const [conversion, setConversion] = useState(0);

	const getArvot = () => {
		fetch('http://api.exchangeratesapi.io/v1/latest?access_key=33c5cc4eca9cc4b269ac8596c3328a4a&format=1')
		.then(response => response.json())
		.then(responseJson => setArvot(responseJson.rates))
		.catch(error => { 
			Alert.alert('Error', error); 
		});    
	}

	// arvot[valuutta]
	const convert = () => {
		if (summa != 0) {
			let conv = summa / arvot[valuutta];		
			setConversion(conv.toFixed(2));
		}
	}

	// Fetch-haulla valuutta-arvot pickeriin kun sovellus käynnistetään
	useEffect(() =>{
		getArvot();
	},[]);

	return (
		// TouchableWithoutFeedback piilottaa mobiilissa keyboard:in
		<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
		<View style={styles.container}>

			<View style={{margin:10}}>
				<Image style={styles.image} source={{uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/Euro-dynamic-color.png/512px-Euro-dynamic-color.png'}} />
				<Text style={{fontSize:24, textAlign:'center'}}>{conversion} €</Text>
			</View>
			<View style={{margin:10}}>
				<TextInput 
				style = {styles.input}
				keyboardType = "numeric"
				onChangeText = {summa => setSumma(summa)} 
				value = {summa}
				/>

				{/* IOS käyttää pickerinä automaattisesti rullaa, korvaa ActionSheet:lla */}
				<Picker
				style={{width:200}}
				selectedValue = {valuutta}
				onValueChange={(itemValue, itemIndex) => {
					if (itemIndex != 0) {
						setValuutta(itemValue)
					}
				}}
				>
				{/* 
					Object.keys() - Lista property-nimistä
					Toisinkuin opettajan mallissa, tämä mappaus-tapa vaatii return:in, miksi?
				*/}	
				<Picker.Item label = "Valitse valuutta" value = "" />
					{
					Object.keys(arvot).map((key) => {
						return (
						<Picker.Item 
						label = {key} 
						value = {key} 
						key = {key}
						/>
						);
					})
					}
				</Picker>
			</View>
			<View style={{margin:10}}>
				<Button onPress = { () => convert() } title="Convert"/>
			</View>
			<StatusBar hidden={true} />
		</View>
		</TouchableWithoutFeedback>
	);
}

// Tyylit

const styles = StyleSheet.create({
	container: {
		flex:1,
        backgroundColor: '#fff',
        alignItems:'center',
        justifyContent: 'center',
		maxWidth:600, 
		margin:'auto'
    },
	input:{
		padding:5,
		width:200,
		borderColor:'gray', 
		borderWidth:1
	},
	image : {
		height:100,
        minWidth: 100,
    },
});
