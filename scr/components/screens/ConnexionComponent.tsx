import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import colors from '../../../colors/colors';
import globalStyle from '../../assets/styles/globalStyle';

// Importez l'image que vous souhaitez utiliser comme bouton
import showPasswordIcon from '../../assets/images/icons/Vu.png';
import hidePasswordIcon from '../../assets/images/icons/Pas-vu.png';
import FailComponent from '../elements/notifications/FailComponent';
import LargeButton from '../elements/buttons/LargeButton';

const ConnexionComponent = ({
  userName,
  password,
  setUserName,
  setPassword,
  handleLogin,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(null);

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {success === false && (
        <FailComponent
          onClose={() => setSuccess(null)}
          text={"Mot de passe ou nom d'utilisateur incorrect"}
        />
      )}
      <TextInput
        style={globalStyle.input}
        placeholder="Nom d'utilisateur"
        value={userName}
        onChangeText={setUserName}
        placeholderTextColor={colors.grey}
      />
      <View style={styles.passwordInputContainer}>
        <TextInput
          style={[globalStyle.input, styles.passwordInput]}
          placeholder="Mot de passe"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor={colors.grey}
        />
        {/* Utilisez une image comme bouton pour afficher ou masquer le mot de passe */}
        <TouchableOpacity
          style={styles.togglePasswordButton}
          onPress={() => setShowPassword(!showPassword)}>
          <Image
            source={showPassword ? hidePasswordIcon : showPasswordIcon}
            style={styles.togglePasswordIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={{alignItems: 'center', width: '100%'}}>
        <LargeButton
          title="Connexion"
          onPress={handleLogin}
          backgroundColor={colors.green}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    width: '100%',
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40, // Ajoutez un padding pour laisser de la place à l'image
  },
  togglePasswordButton: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  togglePasswordIcon: {
    width: 20,
    height: 20,
    tintColor: colors.green,
  },
});

export default ConnexionComponent;
