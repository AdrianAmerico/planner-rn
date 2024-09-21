import { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { Alert, Keyboard, Text, TouchableOpacity, View } from "react-native";
import {
  Button,
  Calendar,
  Input,
  Loading,
  Modal,
} from "@/presentation/components";
import {
  CalendarRange,
  Info,
  MapPin,
  Settings2,
  Calendar as IconCalendar,
  User,
} from "lucide-react-native";
import { colors } from "@/presentation/styles";
import dayjs from "dayjs";
import { TripActivities } from "./activities";
import { TripDetailsTab } from "./details";
import { DateData } from "react-native-calendars";
import { calendarUtils, DatesSelected, validateInput } from "@/utils";
import { TripDetails } from "@/data/trip";
import { RemoteTrip } from "@/domain/trip/trip";
import { TripAdapter } from "@/data/adapter/trip.adapter";
import { AxiosHttpClient } from "@/infra/axios-http-client";
import { RemoteParticipants } from "@/domain/participants/participants";
import { ParticipantsAdapter } from "@/data/adapter/participants.adapter";
import { RemoteTripStorage } from "@/domain/trip-storage";
import { TripStorageAdapter } from "@/data/adapter/trip-storage.adapter";
import { Form } from "@/presentation/components/form";

export type TripData = TripDetails & {
  when: string;
};

enum MODAL {
  NONE = 0,
  UPDATE_TRIP = 1,
  CALENDAR = 2,
  CONFIRM_ATTENDANCE = 3,
}

const Trip = () => {
  const [isLoadingTrip, setIsLoadingTrip] = useState(true);
  const [tripDetails, setTripDetails] = useState({} as TripData);
  const [option, setOption] = useState<"activity" | "details">("activity");
  const [showModal, setShowModal] = useState(MODAL.NONE);
  const [destination, setDestination] = useState("");
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected);
  const [isUpdatingTrip, setIsUpdatingTrip] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [isConfirmingAttendance, setIsConfirmingAttendance] = useState(false);

  const tripServer = new RemoteTrip(new TripAdapter(new AxiosHttpClient()));
  const participantsServer = new RemoteParticipants(
    new ParticipantsAdapter(new AxiosHttpClient())
  );
  const tripStorage = new RemoteTripStorage(new TripStorageAdapter());

  const tripParams = useLocalSearchParams<{
    id: string;
    participant?: string;
  }>();

  const getTripDetails = async () => {
    try {
      setIsLoadingTrip(true);

      if (tripParams.participant) {
        setShowModal(MODAL.CONFIRM_ATTENDANCE);
      }

      if (!tripParams.id) {
        return router.back();
      }

      const trip = await tripServer.getById(tripParams.id);

      const maxLengthDestination = 14;

      const destination =
        trip.destination.length > maxLengthDestination
          ? `${trip.destination.slice(0, maxLengthDestination)}...`
          : trip.destination;

      const starts_at = dayjs(trip.starts_at).format("DD");
      const ends_at = dayjs(trip.ends_at).format("DD");
      const month = dayjs(trip.starts_at).format("MMMM");

      setDestination(trip.destination);

      setTripDetails({
        ...trip,
        when: `${destination} de ${starts_at} a ${ends_at} de ${month}`,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadingTrip(false);
    }
  };

  const handleSelectDates = (selectedDay: DateData) => {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    });

    setSelectedDates(dates);
  };

  const handleUpdateTrip = async () => {
    try {
      if (!tripParams.id) return;

      if (!destination || !selectedDates.startsAt || !selectedDates.endsAt) {
        return Alert.alert(
          "Atualizar viagem",
          "Lembre-se de, além de preencher o destino, selecione data de início e fim da viagem."
        );
      }

      setIsUpdatingTrip(true);

      await tripServer.update({
        id: tripParams.id,
        destination,
        starts_at: dayjs(selectedDates.startsAt.dateString).toISOString(),
        ends_at: dayjs(selectedDates.endsAt.dateString).toISOString(),
      });

      Alert.alert("Atualizar viagem", "Viagem atualizada com sucesso!", [
        {
          text: "Ok",
          onPress: () => {
            setShowModal(MODAL.NONE);
            getTripDetails();
          },
        },
      ]);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdatingTrip(false);
    }
  };

  const handleConfirmAttendance = async () => {
    try {
      if (!tripParams.participant || !tripParams.id) return;

      if (!guestName.trim() || !guestEmail.trim()) {
        return Alert.alert(
          "Confirmação",
          "Preencha o nome e e-mail para confirmar sua presença"
        );
      }

      if (!validateInput.email(guestEmail.trim())) {
        return Alert.alert("Confirmação", "Insira um e-mail válido");
      }

      setIsConfirmingAttendance(true);

      await participantsServer.confirmTripByParticipantId({
        participantId: tripParams.participant,
        email: guestEmail,
        name: guestName,
      });

      Alert.alert("Confirmação", "Presença confirmada com sucesso!");

      await tripStorage.save(tripParams.id);

      setShowModal(MODAL.NONE);
    } catch (error) {
      console.log(error);
    } finally {
      setIsConfirmingAttendance(false);
    }
  };

  const handleRemoveTrip = async () => {
    Alert.alert("Remover viagem", "Deseja realmente remover essa viagem?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: async () => {
          await tripStorage.remove();
          router.navigate("/");
        },
      },
    ]);
  };

  useEffect(() => {
    getTripDetails();
  }, []);

  if (isLoadingTrip) {
    return <Loading />;
  }

  return (
    <Form className="flex-1 px-5 pt-16">
      <Input variant="tertiary">
        <MapPin color={colors.zinc[400]} size={20} />
        <Input.Field name="destination" value={tripDetails.when} readOnly />

        <TouchableOpacity
          activeOpacity={0.6}
          className="w-9 h-9 bg-zinc-800 items-center justify-center rounded"
          onPress={() => setShowModal(MODAL.UPDATE_TRIP)}
        >
          <Settings2 color={colors.zinc[400]} size={20} />
        </TouchableOpacity>
      </Input>

      {option === "activity" ? (
        <TripActivities tripDetails={tripDetails} />
      ) : (
        <TripDetailsTab tripId={tripParams.id!} />
      )}

      <View className="w-full absolute -bottom-1 self-center justify-end pb-5 z-10 bg-zinc-950">
        <View className="w-full flex-row bg-zinc-900 p-4 rounded-lg border border-zinc-800 gap-2">
          <Button
            className="flex-1"
            onPress={() => setOption("activity")}
            variant={option === "activity" ? "primary" : "secondary"}
          >
            <CalendarRange
              color={
                option === "activity" ? colors.lime[950] : colors.zinc[200]
              }
            />

            <Button.Title>Atividades</Button.Title>
          </Button>

          <Button
            className="flex-1"
            onPress={() => setOption("details")}
            variant={option === "details" ? "primary" : "secondary"}
          >
            <Info
              color={option === "details" ? colors.lime[950] : colors.zinc[200]}
            />

            <Button.Title>Detalhes</Button.Title>
          </Button>
        </View>
      </View>

      <Modal
        title="Atualizar viagem"
        subtitle="Somente quem criou a viagem pode editar."
        visible={showModal === MODAL.UPDATE_TRIP}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-2 my-4">
          <Input variant="secondary">
            <MapPin color={colors.zinc[400]} size={20} />

            <Input.Field
              name="destination"
              placeholder="Para onde?"
              onChangeText={setDestination}
              value={destination}
            />
          </Input>

          <Input variant="secondary">
            <IconCalendar color={colors.zinc[400]} size={20} />

            <Input.Field
              name="dates"
              placeholder="Quando?"
              value={selectedDates.formatDatesInText}
              onPressIn={() => setShowModal(MODAL.CALENDAR)}
              onFocus={() => Keyboard.dismiss()}
            />
          </Input>

          <Button onPress={handleUpdateTrip} isLoading={isUpdatingTrip}>
            <Button.Title>Atualizar</Button.Title>
          </Button>

          <TouchableOpacity activeOpacity={0.8} onPress={handleRemoveTrip}>
            <Text className="text-red-400 text-center mt-6">
              Remover viagem
            </Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        title="Selecionar datas"
        subtitle="Selecione a data de ida e volta nda viagem"
        onClose={() => setShowModal(MODAL.NONE)}
        visible={showModal === MODAL.CALENDAR}
      >
        <View className="gap-4 mt-4">
          <Calendar
            onDayPress={handleSelectDates}
            markedDates={selectedDates.dates}
            minDate={dayjs().toISOString()}
          />

          <Button onPress={() => setShowModal(MODAL.UPDATE_TRIP)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Confirmar presença"
        visible={showModal === MODAL.CONFIRM_ATTENDANCE}
      >
        <View className="gap-4 mt-4">
          <Text className="text-zinc-400 font-regular leading-6 my-2">
            Você foi convidado(a) para participar de uma viagem para
            <Text className="font-semibold text-zinc-100">
              {" "}
              {tripDetails.destination}{" "}
            </Text>{" "}
            nas datas de{" "}
            <Text className="font-semibold text-zinc-100">
              {dayjs(tripDetails.starts_at).date()} a{" "}
              {dayjs(tripDetails.ends_at).date()} de{" "}
              {dayjs(tripDetails.ends_at).format("MMMM")}. {"\n\n"}
            </Text>
            Para confirmar sua presença, preencha os dados abaixo:
          </Text>

          <Input variant="secondary">
            <User color={colors.zinc[400]} size={20} />

            <Input.Field
              name="guestName"
              placeholder="Nome completo"
              onChangeText={setGuestName}
              value={guestName}
            />
          </Input>

          <Input variant="secondary">
            <User color={colors.zinc[400]} size={20} />

            <Input.Field
              name="guestEmail"
              placeholder="E-mail de confirmação"
              onChangeText={setGuestEmail}
              value={guestEmail}
            />
          </Input>

          <Button
            isLoading={isConfirmingAttendance}
            onPress={handleConfirmAttendance}
          >
            <Button.Title>Confirmar minha presença</Button.Title>
          </Button>
        </View>
      </Modal>
    </Form>
  );
};

export default Trip;
