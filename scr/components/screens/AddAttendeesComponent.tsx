import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';
import globalStyle from '../../assets/styles/globalStyle';
import SuccessComponent from '../elements/notifications/SuccessComponent';
import FailComponent from '../elements/notifications/FailComponent';
import {useFocusEffect} from '@react-navigation/native'; // import de useFocusEffect
import axios from 'axios';
import {useRoute} from '@react-navigation/native';
import {CheckBox} from 'react-native-elements';
import colors from '../../../colors/colors';
import {useEvent} from '../context/EventContext';
import PhoneInput from '../elements/PhoneNumberInput';
import {BASE_URL} from '../../config';

const AddAttendeesComponent = ({onPress}) => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [numeroTelephone, setNumeroTelephone] = useState('');
  const [societe, setSociete] = useState('');
  const [success, setSuccess] = useState(null);
  const [CheckedIn, setCheckedIn] = useState('1');
  const route = useRoute();
  const [isChecked, setIsChecked] = useState(false);
  const resetFields = () => {
    setNom('');
    setPrenom('');
    setEmail('');
    setNumeroTelephone('');
    setSociete('');
  };
  const {secretCode} = useEvent();
  const {triggerListRefresh} = useEvent();
  console.log(secretCode);

  const handleEnregistrer = async () => {
    // Logique pour traiter les données du formulaire
    const attendeeData = {
      send_confirmation_mail_ems_yn: 0,
      generate_qrcode: 0,
      generate_badge: 0,
      send_badge_yn: 0,
      // Plus d'options...
      ems_secret_code: secretCode,
      salutation: '',
      first_name: prenom,
      last_name: nom,
      email: email,
      phone: numeroTelephone,
      organization: societe,
      designation: '',
      status_id: '2',
      attendee_status: CheckedIn,
      // Définissez d'autres champs requis par votre API...
    };

    try {
      const url = `${BASE_URL}/add_attendee/?ems_secret_code=${attendeeData.ems_secret_code}&salutation=${attendeeData.salutation}&first_name=${attendeeData.first_name}&last_name=${attendeeData.last_name}&email=${attendeeData.email}&phone=33${attendeeData.phone}&organization=${attendeeData.organization}&designation=88&status_id=${attendeeData.status_id}&attendee_status=${attendeeData.attendee_status}`;

      // Make a GET request with Axios to the constructed URL
      const response = await axios.post(url);

      /*       const url = '${BASE_URL}/add_attendee/';
      const response = await axios.post(url, attendeeData); */

      if (response.data.status) {
        console.log('Enregistrement réussi:', response.data);
        setSuccess(true);
        resetFields();
        triggerListRefresh();
      } else {
        console.error('Enregistrement échoué:', response.data.message);
        setSuccess(false);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      setSuccess(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      // Réinitialiser isVisible à false lorsque l'écran est défocus
      return () => setSuccess(null);
    }, []),
  );
  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
    // Toggle between 1 and 2 for CheckedIn
    const newCheckedIn = CheckedIn == 1 ? 0 : 1;
    setCheckedIn(newCheckedIn);
    console.log(newCheckedIn);
  };
  const handlePhoneChange = fullPhoneNumber => {
    console.log(fullPhoneNumber); // Here you can set the full phone number to a state if needed
  };
  return (
    <View
      style={styles.wrapper}
      contentContainerStyle={styles.contentContainer}>
      {success === true && (
        <SuccessComponent
          onClose={() => setSuccess(null)}
          text={'Participant ajouté avec succès'}
        />
      )}
      {success === false && (
        <FailComponent
          onClose={() => setSuccess(null)}
          text={'Participant non ajouté'}
        />
      )}

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/*       <SuccessComponent onClose={undefined} text={'Invité enregisté!'} />
      <FailComponent onClose={undefined} text={'une erreur est produite!'} /> */}
        <TextInput
          style={globalStyle.input}
          placeholder="Nom"
          placeholderTextColor={colors.grey}
          value={nom}
          onChangeText={text => setNom(text)}
        />
        <TextInput
          style={globalStyle.input}
          placeholder="Prénom"
          placeholderTextColor={colors.grey}
          value={prenom}
          onChangeText={text => setPrenom(text)}
        />
        <TextInput
          style={globalStyle.input}
          placeholder="Email"
          placeholderTextColor={colors.grey}
          value={email}
          onChangeText={text => setEmail(text)}
          keyboardType="email-address"
        />
        <PhoneInput
          phoneNumber={numeroTelephone}
          onChangeText={text => setNumeroTelephone(text)}
        />
        <TextInput
          style={globalStyle.input}
          placeholderTextColor={colors.grey}
          placeholder="Société"
          value={societe}
          onChangeText={text => setSociete(text)}
        />
        <CheckBox
          title={'Check-in'}
          checkedIcon={
            <Image
              source={require('../../assets/images/icons/Not-checked.png')}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: colors.darkerGrey,
              }}
            />
          }
          uncheckedIcon={
            <Image
              source={require('../../assets/images/icons/Checked.png')}
              resizeMode="contain"
              style={{
                width: 20,
                height: 20,
                tintColor: colors.darkGrey,
              }}
            />
          }
          checked={isChecked}
          onPress={handleCheckboxPress}
          containerStyle={styles.checkBoxContainer} // Use updated container style
          textStyle={styles.checkBoxText}
        />

        <TouchableOpacity style={styles.button} onPress={handleEnregistrer}>
          <Text style={styles.buttonText}>Enregistrer</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    top: 40,
    flexGrow: 1,
    padding: 20,
    width: '100%',
    height: 800,
    paddingBottom: 120,
  },
  wrapper: {
    top: 25,
  },
  button: {
    backgroundColor: '#77CB8F',
    borderRadius: 10,
    padding: 15,
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
    color: 'black', // Text color
  },
  buttonText: {
    color: 'white', // Text color
    fontSize: 16,
  },
  checkBoxContainer: {
    backgroundColor: 'transparent', // Transparent background
    marginLeft: 0, // Remove left margin
    marginRight: 0, // Remove right margin
    marginTop: 10, // Remove top margin
    marginBottom: 0, // Remove bottom margin
    padding: 0, // Remove padding
    borderWidth: 0, // Remove border
    alignSelf: 'flex-start', // Align left
  },
  checkBoxText: {
    color: 'black', // Text color
    marginLeft: 10, // Margin for text alignment
  },
  contentContainer: {
    paddingBottom: 300, // Adjust this value based on the height of your bottom tab bar
  },
});

export default AddAttendeesComponent;
