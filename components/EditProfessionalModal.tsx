import React, { useState, useEffect } from 'react';
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
  Image,
} from 'react-native';
import { X, Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

type Professional = {
  id: string;
  name: string;
  specialty: string;
  patients: number;
  revenue: number;
  commission: number;
  commissionPercentage: number;
  value: number;
  image: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onUpdate: (professional: {
    id: string;
    name: string;
    specialty: string;
    patients: number;
    commission: number;
    value: number;
    image: string;
  }) => void;
  professional: Professional | null;
};

export function EditProfessionalModal({ visible, onClose, onUpdate, professional }: Props) {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [patients, setPatients] = useState('');
  const [commission, setCommission] = useState('');
  const [value, setValue] = useState('');
  const [image, setImage] = useState('');

  useEffect(() => {
    if (professional) {
      setName(professional.name);
      setSpecialty(professional.specialty);
      setPatients(String(professional.patients));
      setCommission(String(professional.commissionPercentage));
      setValue(String(professional.value));
      setImage(professional.image);
    }
  }, [professional]);

  const handleUpdate = () => {
    if (!professional || !name || !specialty || !patients || !commission || !value) return;

    onUpdate({
      id: professional.id,
      name,
      specialty,
      patients: Number(patients),
      commission: Number(commission),
      value: Number(value),
      image: image || professional.image,
    });
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

  if (!professional) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.header}>
              <Text style={styles.title}>Editar Profissional</Text>
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
                  source={{ uri: image || professional.image }}
                  style={styles.profileImage}
                />
                <TouchableOpacity 
                  style={styles.changeImageButton}
                  onPress={handleImagePicker}
                >
                  <Camera size={20} color="#FFFFFF" />
                  <Text style={styles.changeImageText}>Alterar Foto</Text>
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
                <Text style={styles.label}>Número de Pacientes</Text>
                <TextInput
                  style={styles.input}
                  value={patients}
                  onChangeText={setPatients}
                  placeholder="0"
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

              <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                <Text style={styles.updateButtonText}>Atualizar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
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
  updateButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: Platform.OS === 'ios' ? 20 : 0,
  },
  updateButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});