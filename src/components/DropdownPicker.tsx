import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Modal from 'react-native-modal'; // Importer le modal de react-native-modal

// Définir le type des éléments de la liste
interface PickerItem<T> {
  label: string;
  value: T;
}

// Définir les props du composant
interface DropdownPickerProps<T> {
  items: PickerItem<T>[]; // Liste des éléments à afficher
  onSelect: (item: PickerItem<T>) => void; // Callback pour gérer la sélection
  buttonText?: string; // Texte personnalisé pour le bouton (optionnel)
  buttonStyle?: ViewStyle; // Style personnalisé du bouton (optionnel)
  textStyle?: TextStyle; // Style personnalisé du bouton (optionnel)
}

const DropdownPicker = <T,>({
  items,
  onSelect,
  buttonText = "Select an Option",  // Texte par défaut
  buttonStyle = {},  // Style par défaut
  textStyle = {},  // Style par défaut
}: DropdownPickerProps<T>) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <View style={{flex:1, justifyContent:"center", alignSelf:"center", alignItems:"center"}}>
      {/* Bouton pour ouvrir le modal */}
      <TouchableOpacity onPress={() => setModalVisible(true)} style={[styles.button, buttonStyle]}>
        <Text style={[styles.buttonText,textStyle]}>{buttonText}</Text>
      </TouchableOpacity>

      {/* Modal contenant la liste déroulante */}
      <Modal
        isVisible={modalVisible}
        onBackdropPress={() => setModalVisible(false)} // Ferme le modal lorsque l'on clique en dehors
        onBackButtonPress={() => setModalVisible(false)} // Ferme le modal avec le bouton retour (Android)
        animationIn="fadeIn" // Animation d'entrée
        animationOut="fadeOut" // Animation de sortie
        backdropColor="black" // Couleur de fond du modal
        backdropOpacity={0.5} // Opacité du fond du modal
        useNativeDriver={true} // Optimisation des animations pour de meilleures performances
        style={{width:"90%"}}
      >
        <View style={styles.modalContent}>
          <FlatList
            data={items}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.option}
                onPress={() => {
                  onSelect(item); // Appel de la fonction de sélection
                  setModalVisible(false); // Fermeture du modal après sélection
                }}
              >
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item,index) => index.toString()} // Assurez-vous que la clé soit unique
            style={{ maxHeight: 300 }} // Limite la hauteur de la liste pour éviter le débordement
          />
        </View>
      </Modal>
    </View>
  );
};

// Styles du composant
const styles = StyleSheet.create({
  button: {
    padding: 10,
    backgroundColor: 'blue',
    borderRadius: 5,
    width: "100%", // Le bouton prend toute la largeur
  } as ViewStyle,
  buttonText: {
    color: 'white',
    fontSize: 16,
  } as TextStyle,
  modalContent: {
    alignSelf:"center",
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: "90%", // Largeur fixe du modal
  } as ViewStyle,
  option: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  } as TextStyle,
});

export default DropdownPicker;
