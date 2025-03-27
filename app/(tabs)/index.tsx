import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useTransactions } from '../../context/TransactionsContext';
import { useRooms } from '../../context/RoomsContext';
import { Calendar, DollarSign, Users } from 'lucide-react-native';

export default function Dashboard() {
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });
  const { getMonthlyRevenue } = useTransactions();
  const { getTodayAppointments, getWeeklyAppointments } = useRooms();
  const monthlyRevenue = getMonthlyRevenue();
  const todayAppointments = getTodayAppointments();
  const weeklyAppointments = getWeeklyAppointments();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.date}>{today}</Text>
        <Text style={styles.welcome}>Bem-vindo ao seu consultório</Text>
      </View>
      
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Users size={20} color="#007AFF" />
            <Text style={styles.statTitle}>Atendimentos Hoje</Text>
          </View>
          <Text style={styles.statValue}>{todayAppointments.length}</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <DollarSign size={20} color="#34C759" />
            <Text style={styles.statTitle}>Receita do Mês</Text>
          </View>
          <Text style={[styles.statValue, styles.revenueValue]}>
            R$ {monthlyRevenue.toFixed(2)}
          </Text>
        </View>

        <View style={styles.statCard}>
          <View style={styles.statHeader}>
            <Calendar size={20} color="#FF9500" />
            <Text style={styles.statTitle}>Atendimentos Semanais</Text>
          </View>
          <Text style={[styles.statValue, styles.weeklyValue]}>
            {weeklyAppointments.length}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Próximos Atendimentos</Text>
        {todayAppointments.length === 0 ? (
          <Text style={styles.emptyText}>Nenhum atendimento agendado para hoje</Text>
        ) : (
          todayAppointments.map((appointment, index) => (
            <View key={index} style={styles.appointment}>
              <Text style={styles.appointmentTime}>{appointment.time.split(' - ')[0]}</Text>
              <View style={styles.appointmentInfo}>
                <Text style={styles.appointmentName}>{appointment.professional}</Text>
                <Text style={styles.appointmentType}>{appointment.specialty}</Text>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  header: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  date: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#8E8E93',
    textTransform: 'capitalize',
  },
  welcome: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#000000',
    marginTop: 4,
  },
  statsContainer: {
    padding: 20,
    gap: 16,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  statTitle: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#8E8E93',
  },
  statValue: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    color: '#007AFF',
  },
  revenueValue: {
    color: '#34C759',
  },
  weeklyValue: {
    color: '#FF9500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 18,
    color: '#000000',
    marginBottom: 16,
  },
  appointment: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  appointmentTime: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    color: '#007AFF',
    width: 50,
  },
  appointmentInfo: {
    marginLeft: 12,
  },
  appointmentName: {
    fontFamily: 'Inter_500Medium',
    fontSize: 16,
    color: '#000000',
  },
  appointmentType: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  emptyText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    color: '#8E8E93',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 16,
  },
});