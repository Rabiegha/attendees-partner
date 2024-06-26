// Filename: AuthenticationService.js
import axios from 'axios';
import {Buffer} from 'buffer';
import {useEffect} from 'react';
import {MMKV} from 'react-native-mmkv';
import {BASE_URL} from '../../config';

const storage = new MMKV();

// Function to encode userName and password to Base64
const encodeBase64 = value => Buffer.from(value).toString('base64');

// Login Function
// Example loginUser function adjustment for error handling
export const loginUser = async (userName, password, loginCallback) => {
  const encUserName = encodeURIComponent(encodeBase64(userName));
  const encPassword = encodeURIComponent(encodeBase64(password));
  try {
    const url = `${BASE_URL}/ajax_user_login/?enc_email=${encUserName}&enc_password=${encPassword}`;
    const response = await axios.get(url);
    if (response.data.status) {
      // Connexion réussie
      storage.set('user_id', response.data.user_details.user_id.toString());
      storage.set(
        'current_user_login_details_id',
        response.data.user_details.current_user_login_details_id.toString(),
      );
      storage.set(
        'first_name',
        response.data.user_details.first_name.toString(),
      );
      storage.set('full_name', response.data.user_details.full_name.toString());
      storage.set('email', response.data.user_details.email.toString());
      storage.set('last_name', response.data.user_details.last_name.toString());
      storage.set('login_status', true);
      console.log(
        'Connexion réussie:',
        response.data.user_details.current_user_login_details_id,
        response.data.user_details.user_id,
        'status:',
        storage.getBoolean('login_status'),
      );
      // Vous pouvez maintenant stocker les informations de l'utilisateur comme nécessaire
      return response.data.status;
    } else {
      // Échec de la connexion
      console.log('Échec de la connexion');
      return response.data.status;
    }
  } catch (error) {
    console.error('Erreur de connexion:', error);
  }
};

// Logout Function
export const logoutUser = async () => {
  try {
    // Récupérer l'ID utilisateur depuis MMKV
    const currentUserId = storage.getString('current_user_login_details_id');
    console.log(currentUserId);

    if (!currentUserId) {
      console.log('Aucun utilisateur connecté trouvé.');
      return;
    }

    const response = await axios.post(
      `${BASE_URL}/ajax_user_logout/?current_user_login_details_id=9253`,
    );
    console.log(response.data);
    storage.set('login_status', false);
    storage.set('user_id', '');
    storage.set('current_user_login_details_id', '');

    if (response.data.status) {
      // Déconnexion réussie
      console.log('Déconnexion réussie');
      // Optionnellement, supprimez l'ID utilisateur du stockage après la déconnexion
    } else {
      // Échec de la déconnexion
      console.log('Échec de la déconnexion');
    }
  } catch (error) {
    console.error('Erreur de déconnexion:', error);
  }
};
