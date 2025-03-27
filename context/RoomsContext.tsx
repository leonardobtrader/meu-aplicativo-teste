import React, { createContext, useContext, useState } from 'react';
import { format, isToday, startOfWeek, endOfWeek, isWithinInterval, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type Schedule = {
  time: string;
  professional: string;
  specialty: string;
  date: string; // Format: "YYYY-MM-DD"
};

export type Room = {
  id: string;
  name: string;
  schedule: Schedule[];
};

type RoomsContextType = {
  rooms: Room[];
  addRoom: (room: Omit<Room, 'id'>) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  getTodayAppointments: () => Schedule[];
  getWeeklyAppointments: () => Schedule[];
};

const RoomsContext = createContext<RoomsContextType | null>(null);

const today = new Date();
const tomorrow = new Date(today);
tomorrow.setDate(tomorrow.getDate() + 1);
const dayAfterTomorrow = new Date(today);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

const initialRooms: Room[] = [
  {
    id: '1',
    name: 'Sala 1',
    schedule: [
      {
        time: '08:00 - 12:00',
        professional: 'Dra. Ana Silva',
        specialty: 'Nutrição',
        date: format(today, 'yyyy-MM-dd'),
      },
      {
        time: '14:00 - 18:00',
        professional: 'Dra. Marina Santos',
        specialty: 'Fonoaudiologia',
        date: format(today, 'yyyy-MM-dd'),
      },
    ],
  },
  {
    id: '2',
    name: 'Sala 2',
    schedule: [
      {
        time: '09:00 - 13:00',
        professional: 'Dra. Carla Oliveira',
        specialty: 'Psicopedagogia',
        date: format(tomorrow, 'yyyy-MM-dd'),
      },
      {
        time: '14:30 - 18:30',
        professional: 'Dr. Paulo Mendes',
        specialty: 'Psicologia',
        date: format(dayAfterTomorrow, 'yyyy-MM-dd'),
      },
    ],
  },
];

export function RoomsProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);

  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      id: String(Date.now()),
      ...room,
    };
    setRooms(prev => [...prev, newRoom]);
  };

  const updateRoom = (updatedRoom: Room) => {
    setRooms(prev =>
      prev.map(room => (room.id === updatedRoom.id ? updatedRoom : room))
    );
  };

  const deleteRoom = (id: string) => {
    setRooms(prev => prev.filter(room => room.id !== id));
  };

  const getTodayAppointments = () => {
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const appointments = rooms.flatMap(room => 
      room.schedule.filter(appointment => appointment.date === todayStr)
    );
    
    // Sort by time
    return appointments.sort((a, b) => {
      const timeA = a.time.split(' - ')[0];
      const timeB = b.time.split(' - ')[0];
      return timeA.localeCompare(timeB);
    });
  };

  const getWeeklyAppointments = () => {
    const today = new Date();
    const weekStart = startOfWeek(today, { locale: ptBR });
    const weekEnd = endOfWeek(today, { locale: ptBR });

    return rooms.flatMap(room =>
      room.schedule.filter(appointment => {
        const appointmentDate = parseISO(appointment.date);
        return isWithinInterval(appointmentDate, { start: weekStart, end: weekEnd });
      })
    );
  };

  return (
    <RoomsContext.Provider
      value={{
        rooms,
        addRoom,
        updateRoom,
        deleteRoom,
        getTodayAppointments,
        getWeeklyAppointments,
      }}>
      {children}
    </RoomsContext.Provider>
  );
}

export function useRooms() {
  const context = useContext(RoomsContext);
  if (!context) {
    throw new Error('useRooms must be used within a RoomsProvider');
  }
  return context;
}