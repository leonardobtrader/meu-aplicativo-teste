import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert } from 'react-native';
import { Plus, Trash2, CreditCard as Edit } from 'lucide-react-native';
import { AddProfessionalModal } from '../../components/AddProfessionalModal';
import { EditProfessionalModal } from '../../components/EditProfessionalModal';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

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

const professionals: Professional[] = [
  {
    id: '1',
    name: 'Dra. Ana Silva',
    specialty: 'Nutricionista',
    patients: 9,
    revenue: 1170,
    commission: 234,
    commissionPercentage: 20,
    value: 130,
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'Dra. Marina Santos',
    specialty: 'Fonoaudióloga',
    patients: 16,
    revenue: 2150,
    commission: 430,
    commissionPercentage: 20,
    value: 130,
    image: 'https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?q=80&w=300&h=300&auto=format&fit=crop'
  },
  {
    id: '3',
    name: 'Dra. Carla Oliveira',
    specialty: 'Psicopedagoga',
    patients: 8,
    revenue: 1040,
    commission: 208,
    commissionPercentage: 20,
    value: 130,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=300&h=300&auto=format&fit=crop'
  }
];

export default function ProfessionalsScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null);
  const [professionalsList, setProfessionalsList] = useState<Professional[]>(professionals);

  const calculateCommission = (revenue: number, percentage: number) => {
    return (revenue * percentage) / 100;
  };

  const handleAddProfessional = (professional: {
    name: string;
    specialty: string;
    commission: string;
    value: string;
  }) => {
    const commissionPercentage = Number(professional.commission);
    const value = Number(professional.value);
    const newProfessional: Professional = {
      id: String(professionalsList.length + 1),
      name: professional.name,
      specialty: professional.specialty,
      patients: 0,
      revenue: 0,
      commissionPercentage,
      commission: 0,
      value,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&h=300&auto=format&fit=crop',
    };

    setProfessionalsList([...professionalsList, newProfessional]);
    setModalVisible(false);
  };

  const handleUpdateProfessional = (updatedProfessional: {
    id: string;
    name: string;
    specialty: string;
    patients: number;
    commission: number;
    value: number;
    image: string;
  }) => {
    const revenue = updatedProfessional.patients * updatedProfessional.value;
    const commission = calculateCommission(revenue, updatedProfessional.commission);

    const updatedProfessionals = professionalsList.map(prof => 
      prof.id === updatedProfessional.id 
        ? { 
            ...prof,
            name: updatedProfessional.name,
            specialty: updatedProfessional.specialty,
            patients: updatedProfessional.patients,
            revenue,
            commission,
            commissionPercentage: updatedProfessional.commission,
            value: updatedProfessional.value,
            image: updatedProfessional.image,
          }
        : prof
    );

    setProfessionalsList(updatedProfessionals);
    setEditModalVisible(false);
    setSelectedProfessional(null);
  };

  const handleRemoveProfessional = (professional: Professional) => {
    Alert.alert(
      "Remover Profissional",
      `Tem certeza que deseja remover ${professional.name}?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Remover",
          style: "destructive",
          onPress: () => {
            const updatedProfessionals = professionalsList.filter(
              prof => prof.id !== professional.id
            );
            setProfessionalsList(updatedProfessionals);
          }
        }
      ]
    );
  };

  const renderRightActions = (professional: Professional) => {
    return (
      <View style={styles.rightActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={() => {
            setSelectedProfessional(professional);
            setEditModalVisible(true);
          }}>
          <Edit size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleRemoveProfessional(professional)}>
          <Trash2 size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profissionais</Text>
          <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
            <Plus size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {professionalsList.map((professional) => (
          <Swipeable
            key={professional.id}
            renderRightActions={() => renderRightActions(professional)}
            overshootRight={false}>
            <Animated.View
              entering={FadeIn}
              exiting={FadeOut}
              style={styles.card}>
              <Image
                source={{ uri: professional.image }}
                style={styles.avatar}
              />
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Text style={styles.name}>{professional.name}</Text>
                </View>
                <Text style={styles.specialty}>{professional.specialty}</Text>
                <View style={styles.statsContainer}>
                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Valor</Text>
                      <Text style={styles.statValue}>R$ {professional.value}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Pacientes</Text>
                      <Text style={styles.statValue}>{professional.patients}</Text>
                    </View>
                  </View>
                  <View style={styles.statsRow}>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Receita</Text>
                      <Text style={styles.statValue}>R$ {professional.revenue}</Text>
                    </View>
                    <View style={styles.stat}>
                      <Text style={styles.statLabel}>Comissão</Text>
                      <Text style={styles.statValue}>R$ {professional.commission}</Text>
                    </View>
                  </View>
                </View>
              </View>
            </Animated.View>
          </Swipeable>
        ))}

        <AddProfessionalModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAdd={handleAddProfessional}
        />

        <EditProfessionalModal
          visible={editModalVisible}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedProfessional(null);
          }}
          onUpdate={handleUpdateProfessional}
          professional={selectedProfessional}
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
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  info: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000000',
    flex: 1,
  },
  specialty: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  statsContainer: {
    backgroundColor: '#F8F8FA',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  stat: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  statLabel: {
    fontFamily: 'Inter_400Regular',
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  statValue: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
    color: '#007AFF',
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    height: '100%',
    paddingHorizontal: 4,
  },
  actionButton: {
    width: 60,
    height: '100%',
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