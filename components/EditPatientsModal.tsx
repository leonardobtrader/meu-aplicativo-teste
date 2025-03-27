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
} from 'react-native';
import { X } from 'lucide-react-native';

type Professional = {
  id: string;
  name: string;
  specialty: string;
  patients: number;
  revenue: number;
  commission: number;
  image: string;
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onUpdate: (patients: number) => void;
  professional: Professional | null;
};

export function EditPatientsModal({ visible, onClose, onUpdate, professional }: Props) {
  const [patients, setPatients] = useState('');

  useEffect(() => {
    if (professional) {
      setPatients(String(professional.patients));
    }
  }, [professional]);

  const handleUpdate = () => {
    if (!patients) return;
    onUpdate(Number(patients));
    setPatients('');
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
              <Text style={styles.title}>Atualizar Pacientes</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <X size={24} color="#000000" />
              </TouchableOpacity>
            </View>

            <ScrollView 
              style={styles.content}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              <Text style={styles.professionalName}>{professional.name}</Text>
              <Text style={styles.specialty}>{professional.specialty}</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.label}>Número de Pacientes</Text>
                <TextInput
                  style={styles.input}
                  value={patients}
                  onChangeText={setPatients}
                  placeholder="0"
                  keyboardType="numeric"
                  returnKeyType="done"
                  onSubmitEditing={handleUpdate}
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
  professionalName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 4,
  },
  specialty: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 20,
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