import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Plus, Pencil, Trash } from 'lucide-react-native';
import { AddRoomModal } from '../../components/AddRoomModal';
import { EditRoomModal } from '../../components/EditRoomModal';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { useRooms } from '../../context/RoomsContext';

export default function RoomsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const { rooms, addRoom, updateRoom, deleteRoom } = useRooms();

  const handleAddRoom = (room: {
    name: string;
    schedule: {
      time: string;
      professional: string;
      specialty: string;
    }[];
  }) => {
    addRoom(room);
    setModalVisible(false);
  };

  const handleUpdateRoom = (updatedRoom: Room) => {
    updateRoom(updatedRoom);
    setEditModalVisible(false);
    setSelectedRoom(null);
  };

  const handleRemoveRoom = (room: Room) => {
    Alert.alert(
      "Remover Sala",
      `Tem certeza que deseja remover ${room.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => deleteRoom(room.id)
        }
      ]
    );
  };

  const renderRightActions = (room: Room) => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setSelectedRoom(room);
            setEditModalVisible(true);
          }}>
          <Pencil size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleRemoveRoom(room)}>
          <Trash size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Salas</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {rooms.map((room) => (
          <Swipeable
            key={room.id}
            renderRightActions={() => renderRightActions(room)}
            overshootRight={false}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.card}>
              <Text style={styles.roomName}>{room.name}</Text>
              <View style={styles.scheduleContainer}>
                {room.schedule.map((slot, index) => (
                  <View key={index} style={styles.scheduleSlot}>
                    <Text style={styles.time}>{slot.time}</Text>
                    <View style={styles.slotInfo}>
                      <Text style={styles.professional}>{slot.professional}</Text>
                      <Text style={styles.specialty}>{slot.specialty}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </Animated.View>
          </Swipeable>
        ))}

        <AddRoomModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleAddRoom}
        />

        <EditRoomModal
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedRoom(null);
          }}
          onUpdate={handleUpdateRoom}
          room={selectedRoom}
        />
      </ScrollView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  title: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 34,
    color: '#000000',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  card: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  roomName: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    color: '#000000',
    marginBottom: 16,
  },
  scheduleContainer: {
    gap: 16,
  },
  scheduleSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  time: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#007AFF',
    width: 120,
  },
  slotInfo: {
    flex: 1,
  },
  professional: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#000000',
  },
  specialty: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  actionButton: {
    width: 48,
    height: '86%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  editButton: {
    backgroundColor: '#007AFF',
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
  },
});