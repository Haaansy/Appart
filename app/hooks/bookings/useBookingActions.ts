import { useState } from 'react';
import { Timestamp } from 'firebase/firestore';
import { router } from 'expo-router';
import { updateBooking, updateApartment, updateTransient, createConversation } from '@/app/Firebase/Services/DatabaseService';
import Booking from '@/app/types/Booking';
import Apartment from '@/app/types/Apartment';
import Transient from '@/app/types/Transient';
import Alert from '@/app/types/Alert';
import Tenant from '@/app/types/Tenant';
import UserData from '@/app/types/UserData';
import useSendAlerts from '@/app/hooks/alerts/useSendAlerts';
import { checkExistingConversationWithTenants } from '@/app/hooks/inbox/useCheckExistingConversationWithTenants';

export const useBookingActions = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { sendAlerts } = useSendAlerts();

  // Handle apartment viewing approval
  const handleViewingApproval = async (
    booking: Booking,
    apartment: Apartment,
    currentUserData: UserData,
    ownerData: UserData
  ) => {
    try {
      setLoading(true);
      
      const existingConversation = await checkExistingConversationWithTenants(
        String(apartment.id),
        booking.tenants.map((tenant) => tenant.user),
        ownerData,
        currentUserData
      );

      const alertData: Alert = {
        message: "Your viewing appointment has been approved.",
        type: "Booking",
        bookingType: "Apartment",
        bookingId: String(booking.id),
        propertyId: String(apartment.id),
        isRead: false,
        senderId: currentUserData.id as string,
        createdAt: Timestamp.now(),
      };

      await updateApartment(String(apartment.id), {
        ...apartment,
        viewingDates: [
          ...apartment.viewingDates,
          {
            bookingId: String(booking.id),
            viewingDate: booking.viewingDate,
          },
        ]
      });

      await sendAlerts(booking.tenants, alertData);

      if (!existingConversation) {
        const createdConversation = await createConversation({
          members: [
            ...booking.tenants.map((tenant) => ({
              user: tenant.user,
              count: 0,
            })),
            {
              user: currentUserData,
              count: 0,
            },
          ],
          propertyId: String(apartment.id),
          bookingId: String(booking.id),
          type: "Booking",
          lastMessage: "Started a conversation",
          lastSender: currentUserData,
        });
        setLoading(false);
        
        if (createdConversation) {
          await updateBooking(String(booking.id), {
            ...booking,
            status: "Viewing Confirmed",
            conversationId: createdConversation.id,
          });

          router.replace(
            `/(Authenticated)/(inbox)/(viewconversation)/${createdConversation?.id}`
          );
          return;
        }
      }

      await updateBooking(String(booking.id), {
        ...booking,
        status: "Viewing Confirmed",
        conversationId: existingConversation?.id,
      });

      router.replace(
        `/(Authenticated)/(inbox)/(viewconversation)/${existingConversation?.id}`
      );
    } catch (error) {
      console.error("Error approving viewing:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle apartment booking approval
  const handleBookingApproval = async (
    booking: Booking,
    apartment: Apartment,
    currentUserData: UserData
  ) => {
    try {
      setLoading(true);
      
      await updateBooking(String(booking.id), {
        ...booking,
        status: "Booking Confirmed",
      });

      await updateApartment(String(apartment.id), {
        ...apartment,
        bookedDates: [
          ...apartment.bookedDates,
          {
            bookingId: String(booking.id),
            bookedDates: booking.bookedDate,
          },
        ],
        status: "Unavailable"
      });

      const alertData: Alert = {
        message: "Your booking has been approved.",
        type: "Booking",
        bookingType: "Apartment",
        bookingId: String(booking.id),
        propertyId: String(apartment.id),
        isRead: false,
        senderId: currentUserData.id as string,
        createdAt: Timestamp.now(),
      };

      await sendAlerts(booking.tenants, alertData);
      router.replace(`/(Authenticated)/(tabs)/Bookings`);
    } catch (error) {
      console.error("Error approving booking:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle tenant invitation response
  const handleInvitation = async (
    status: "Accepted" | "Declined",
    booking: Booking,
    currentUserData: UserData
  ) => {
    try {
      setLoading(true);
      
      await updateBooking(String(booking.id), {
        ...booking,
        tenants: booking.tenants.map((tenant) =>
          tenant.user.id === currentUserData.id
            ? { ...tenant, status: status }
            : tenant
        ),
      });

      router.replace(`/(Authenticated)/(tabs)/Bookings`);
    } catch (error) {
      console.error("Error handling invitation:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle tenant eviction
  const handleEviction = async (
    tenants: Tenant[],
    booking: Booking
  ) => {
    try {
      setLoading(true);
      
      await updateBooking(String(booking.id), {
        ...booking,
        tenants: tenants,
      });

      router.replace("/(Authenticated)/(tabs)/Bookings");
    } catch (error) {
      console.error("Error evicting tenant:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle transient booking approval
  const handleTransientBookingApproval = async (
    booking: Booking,
    transient: Transient,
    currentUserData: UserData,
    ownerData: UserData
  ) => {
    try {
      setLoading(true);
      
      const existingConversation = await checkExistingConversationWithTenants(
        String(transient.id),
        booking.tenants.map((tenant) => tenant.user),
        ownerData,
        currentUserData
      );

      await updateBooking(String(booking.id), {
        ...booking,
        status: "Booking Confirmed",
      });

      const alertData: Alert = {
        message: "Your viewing appointment has been approved.",
        type: "Booking",
        bookingType: "Transient",
        bookingId: String(booking.id),
        propertyId: String(transient.id),
        isRead: false,
        senderId: currentUserData?.id as string,
        createdAt: Timestamp.now(),
      };

      await sendAlerts(booking.tenants, alertData);

      if (!existingConversation) {
        const createdConversation = await createConversation({
          members: [
            ...booking.tenants.map((tenant) => ({
              user: tenant.user,
              count: 0,
            })),
            {
              user: currentUserData as UserData,
              count: 0,
            },
          ],
          propertyId: String(transient.id),
          bookingId: String(booking.id),
          type: "Booking",
          lastMessage: "Started a conversation",
          lastSender: currentUserData as UserData,
        });

        if(createdConversation) {
          router.push(
            `/(Authenticated)/(inbox)/(viewconversation)/${createdConversation}`
          );
          return;
        }
      }

      router.push(`/(Authenticated)/(inbox)/(viewconversation)/${existingConversation?.id}`);
    } catch (error) {
      console.error("Error approving viewing:", error);
    } finally {
      setLoading(false);
    }
  };

  return { 
    handleViewingApproval,
    handleBookingApproval,
    handleInvitation,
    handleEviction,
    handleTransientBookingApproval,
    loading 
  };
};
