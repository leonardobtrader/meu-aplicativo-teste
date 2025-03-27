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
} from 'react-native';
import { X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Props = {
  visible: boolean;
  onClose: () => void;
  onAdd: (room: {
    name: string;
    schedule: {
      time: string;
      professional: string;
      specialty: string;
      date: string;
    }[];
  }) => void;
};

export function AddRoomModal({ visible, onClose, onAdd }: Props) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [professional, setProfessional] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAdd = () => {
    if (!name || !time || !professional || !specialty) return;
    onAdd({
      name,
      schedule: [
        {
          time,
          professional,
          specialty,
          date: format(date, 'yyyy-MM-dd'),
        },
      ],
    });
    setName('');
    setTime('');
    setProfessional('');
    setSpecialty('');
    setDate(new Date());
    onClose();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setDate(selectedDate);
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
                <Text style={styles.title}>Nova Sala</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                  <X size={24} color="#000000" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                style={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
              >
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Nome da Sala</Text>
                  <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={setName}
                    placeholder="Ex: Sala 1"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Data do Atendimento</Text>
                  <TouchableOpacity
                    style={styles.dateButton}
                    onPress={() => setShowDatePicker(true)}>
                    <Text style={styles.dateButtonText}>
                      {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </Text>
                  </TouchableOpacity>
                </View>

                {(showDatePicker || Platform.OS === 'android') && (
                  <DateTimePicker
                    value={date}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={handleDateChange}
                    minimumDate={new Date()}
                    locale="pt-BR"
                    textColor="#000000"
                  />
                )}

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Horário</Text>
                  <TextInput
                    style={styles.input}
                    value={time}
                    onChangeText={setTime}
                    placeholder="Ex: 08:00 - 12:00"
                    returnKeyType="next"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Profissional</Text>
                  <TextInput
                    style={styles.input}
                    value={professional}
                    onChangeText={setProfessional}
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
                    returnKeyType="done"
                  />
                </View>

                <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                  <Text style={styles.addButtonText}>Adicionar Sala</Text>
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
  dateButton: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 8,
  },
  dateButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
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