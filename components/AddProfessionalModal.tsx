import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import { X, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (professional: {
    name: string;
    specialty: string;
    commission: string;
    value: string;
    image?: string;
  }) => void;
};

export function AddProfessionalModal({ visible, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [commission, setCommission] = useState('');
  const [value, setValue] = useState('');
  const [image, setImage] = useState('');

  const handleAdd = () => {
    if (!name || !specialty || !commission || !value) return;
    onAdd({ 
      name, 
      specialty, 
      commission, 
      value,
      image: image || undefined 
    });
    setName('');
    setSpecialty('');
    setCommission('');
    setValue('');
    setImage('');
    onClose();
  };

  const handleImagePicker = async () => {
    try {
      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        alert('Precisamos de permissão para acessar suas fotos');
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets[0].uri) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Não foi possível selecionar a imagem');
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.overlay}>
            <View style={styles.modal}>
              <View style={styles.header}>
                <Text style={styles.title}>Novo Profissional</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#000000" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.imageContainer}>
                  <Image
                    source={{ 
                      uri: image || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&auto=format&fit=crop'
                    }}
                    style={styles.profileImage}
                  />
                  <TouchableOpacity 
                    style={styles.changeImageButton}
                    onPress={handleImagePicker}
                  >
                    <Camera size={20} color="#FFFFFF" />
                    <Text style={styles.changeImageText}>Escolher Foto</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Nome do profissional"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Especialidade</Text>
                  <TextInput
                    style={styles.input}
                    value={specialty}
                    onChangeText={setSpecialty}
                    placeholder="Especialidade"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Valor do Atendimento (R$)</Text>
                  <TextInput
                    style={styles.input}
                    value={value}
                    onChangeText={setValue}
                    placeholder="130"
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Comissão (%)</Text>
                  <TextInput
                    style={styles.input}
                    value={commission}
                    onChangeText={setCommission}
                    placeholder="20"
                    keyboardType="numeric"
                    returnKeyType="done"
                  />
                </View>

                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                  <Text style={styles.addButtonText}>Adicionar Profissional</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 12,
  },
  changeImageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 8,
  },
  changeImageText: {
    color: '#FFFFFF',
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  input: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    padding: 12,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    color: '#000000',
  },
  addButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  addButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});