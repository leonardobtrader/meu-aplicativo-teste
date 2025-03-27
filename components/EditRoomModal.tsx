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
  Keyboard,
  TouchableWithoutFeedback,
} from 'react-native';
import { X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

type Room = {
  id: string;
  name: string;
  schedule: {
    time: string;
    professional: string;
    specialty: string;
    date: string;
  }[];
};

type Props = {
  visible: boolean;
  onClose: () => void;
  onUpdate: (room: Room) => void;
  room: Room | null;
};

export function EditRoomModal({ visible, onClose, onUpdate, room }: Props) {
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState<{
    time: string;
    professional: string;
    specialty: string;
    date: string;
  }[]>([]);
  const [showDatePicker, setShowDatePicker] = useState<number | null>(null);

  useEffect(() => {
    if (room) {
      setName(room.name);
      setSchedule(room.schedule);
    }
  }, [room]);

  const handleUpdate = () => {
    if (!room || !name || schedule.length === 0) return;

    onUpdate({
      id: room.id,
      name,
      schedule,
    });
  };

  const handleAddSchedule = () => {
    setSchedule([
      ...schedule,
      {
        time: '',
        professional: '',
        specialty: '',
        date: format(new Date(), 'yyyy-MM-dd'),
      },
    ]);
  };

  const handleRemoveSchedule = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const handleUpdateSchedule = (index: number, field: string, value: string) => {
    const newSchedule = [...schedule];
    newSchedule[index] = {
      ...newSchedule[index],
      [field]: value,
    };
    setSchedule(newSchedule);
  };

  const handleDateChange = (index: number, event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios' ? index : null);
    if (selectedDate) {
      const newSchedule = [...schedule];
      newSchedule[index] = {
        ...newSchedule[index],
        date: format(selectedDate, 'yyyy-MM-dd'),
      };
      setSchedule(newSchedule);
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
                <Text style={styles.title}>Editar Sala</Text>
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

                {schedule.map((slot, index) => (
                  <View key={index} style={styles.scheduleItem}>
                    <View style={styles.scheduleHeader}>
                      <Text style={styles.scheduleTitle}>Horário {index + 1}</Text>
                      <TouchableOpacity
                        style={styles.removeButton}
                        onPress={() => handleRemoveSchedule(index)}>
                        <Text style={styles.removeButtonText}>Remover</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Data do Atendimento</Text>
                      <TouchableOpacity
                        style={styles.dateButton}
                        onPress={() => setShowDatePicker(index)}>
                        <Text style={styles.dateButtonText}>
                          {format(new Date(slot.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {((showDatePicker === index) || (Platform.OS === 'android' && showDatePicker === index)) && (
                      <DateTimePicker
                        value={new Date(slot.date)}
                        mode="date"
                        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        onChange={(event, date) => handleDateChange(index, event, date)}
                        minimumDate={new Date()}
                        locale="pt-BR"
                        textColor="#000000"
                      />
                    )}

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Horário</Text>
                      <TextInput
                        style={styles.input}
                        value={slot.time}
                        onChangeText={(value) => handleUpdateSchedule(index, 'time', value)}
                        placeholder="Ex: 08:00 - 12:00"
                        returnKeyType="next"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Profissional</Text>
                      <TextInput
                        style={styles.input}
                        value={slot.professional}
                        onChangeText={(value) => handleUpdateSchedule(index, 'professional', value)}
                        placeholder="Nome do profissional"
                        returnKeyType="next"
                      />
                    </View>

                    <View style={styles.inputGroup}>
                      <Text style={styles.label}>Especialidade</Text>
                      <TextInput
                        style={styles.input}
                        value={slot.specialty}
                        onChangeText={(value) => handleUpdateSchedule(index, 'specialty', value)}
                        placeholder="Especialidade"
                        returnKeyType="done"
                      />
                    </View>
                  </View>
                ))}

                <TouchableOpacity style={styles.addScheduleButton} onPress={handleAddSchedule}>
                  <Text style={styles.addScheduleButtonText}>Adicionar Horário</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
                  <Text style={styles.updateButtonText}>Atualizar Sala</Text>
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
  scheduleItem: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  scheduleTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#000000',
  },
  removeButton: {
    padding: 8,
  },
  removeButtonText: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#FF3B30',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
  },
  dateButtonText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    color: '#000000',
  },
  addScheduleButton: {
    backgroundColor: '#F2F2F7',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  addScheduleButtonText: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 16,
    color: '#007AFF',
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