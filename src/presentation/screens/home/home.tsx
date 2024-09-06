import { useEffect, useState } from "react";
import { View, Text, Image, Keyboard, Alert } from "react-native";
import { Input, Button, Loading } from "@/presentation/components";
import {
  MapPin,
  Calendar as IconCalendar,
  Settings2,
  UserRoundPlus,
  ArrowRight,
} from "lucide-react-native";
import { colors } from "@/presentation/styles";
import { calendarUtils, DatesSelected, validateInput } from "@/utils";
import { DateData } from "react-native-calendars";
import dayjs from "dayjs";
import { router } from "expo-router";
import { RemoteTrip } from "@/domain/trip/trip";
import { TripAdapter } from "@/data/adapter/trip.adapter";
import { AxiosHttpClient } from "@/infra/axios-http-client";
import { RemoteTripStorage } from "@/domain/trip-storage";
import { TripStorageAdapter } from "@/data/adapter/trip-storage.adapter";
import { SelectDateModal } from "./components/select-date-modal";
import { MODAL, StepForm } from "./constants";
import { SelectParticipantsModal } from "./components/select-participants-modal";

const Home = () => {
  const [isCreatingTrip, setIsCreatingTrip] = useState(false);
  const [isGettingTrip, setIsGettingTrip] = useState(true);
  const [stepForm, setStepForm] = useState(StepForm.TRIP_DETAILS);
  const [showModal, setShowModal] = useState(MODAL.NONE);
  const [selectedDates, setSelectedDates] = useState({} as DatesSelected);
  const [destination, setDestination] = useState("");
  const [emailToInvite, setEmailToInvite] = useState("");
  const [emailToInvites, setEmailToInvites] = useState<string[]>([]);

  const tripServer = new RemoteTrip(new TripAdapter(new AxiosHttpClient()));
  const tripStorage = new RemoteTripStorage(new TripStorageAdapter());

  const handleNextStepForm = () => {
    if (
      !destination.trim().length ||
      !selectedDates.startsAt ||
      !selectedDates.endsAt
    ) {
      return Alert.alert(
        "Detalhes da viagem",
        "Preencha todos as informações da viagem para seguir."
      );
    }

    if (destination.length < 4) {
      return Alert.alert(
        "Detalhes da viagem",
        "O destino da viagem deve conter no mínimo 4 caracteres."
      );
    }

    if (stepForm === StepForm.TRIP_DETAILS) {
      return setStepForm(StepForm.ADD_EMAIL);
    }

    Alert.alert("Nova viagem", "Deseja confirmar a viagem?", [
      {
        text: "Não",
        style: "cancel",
      },
      {
        text: "Sim",
        onPress: handleCreateTrip,
      },
    ]);
  };

  const handleSelectDates = (selectedDay: DateData) => {
    const dates = calendarUtils.orderStartsAtAndEndsAt({
      startsAt: selectedDates.startsAt,
      endsAt: selectedDates.endsAt,
      selectedDay,
    });

    setSelectedDates(dates);
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setEmailToInvites((emails) =>
      emails.filter((email) => email !== emailToRemove)
    );
  };

  const handleAddEmail = () => {
    if (!validateInput.email(emailToInvite)) {
      return Alert.alert("Convidado", "E-mail Inválido");
    }

    const emailAlreadyExists = emailToInvites.includes(emailToInvite);

    if (emailAlreadyExists) {
      return Alert.alert("Convidado", "E-mail já adicionado.");
    }

    setEmailToInvites((prevStarte) => [...prevStarte, emailToInvite]);
    setEmailToInvite("");
  };

  const saveTrip = async (tripId: string) => {
    try {
      await tripStorage.save(tripId);

      router.navigate(`/trip/${tripId}`);
    } catch (error) {
      Alert.alert("Salvar viagem", "Não foi possível salvar a viagem.");
    }
  };

  const handleCreateTrip = async () => {
    try {
      setIsCreatingTrip(true);

      const newTrip = await tripServer.create({
        destination,
        starts_at: dayjs(selectedDates.startsAt?.dateString).toISOString(),
        ends_at: dayjs(selectedDates.endsAt?.dateString).toISOString(),
        emails_to_invite: emailToInvites,
      });

      Alert.alert("Nova viagem", "Viagem criada com sucesso!", [
        {
          text: "Ok, Continuar.",
          onPress: () => saveTrip(newTrip.tripId),
        },
      ]);
    } catch (error) {
      Alert.alert("Nova viagem", "Não foi possível criar a viagem.");
    } finally {
      setIsCreatingTrip(false);
    }
  };

  const getTrip = async () => {
    try {
      const tripId = await tripStorage.get();

      if (!tripId) {
        return setIsGettingTrip(false);
      }

      const trip = await tripServer.getById(tripId);

      if (trip) {
        router.navigate(`/trip/${trip.id}`);
      }
    } catch (error) {
      setIsCreatingTrip(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getTrip();
  }, []);

  if (isGettingTrip) {
    return <Loading />;
  }

  return (
    <View className="flex-1 items-center justify-center">
      <Image
        source={require("@/assets/logo.png")}
        resizeMode="contain"
        className="h-8"
      />

      <Image source={require("@/assets/bg.png")} className="absolute" />

      <Text className="text-zinc-400 font-regular text-center text-lg mt-3">
        Convide seus amigos e planeje sua{"\n"} proxima viagem
      </Text>

      <View className="w-full bg-zinc-900 p-4 rounded-xl my-8 border border-zinc-800 px-5">
        <Input>
          <MapPin color={colors.zinc[400]} />
          <Input.Field
            placeholder="Para onde?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            value={destination}
            onChangeText={setDestination}
          />
        </Input>

        <Input>
          <IconCalendar color={colors.zinc[400]} />
          <Input.Field
            placeholder="Quando?"
            editable={stepForm === StepForm.TRIP_DETAILS}
            onFocus={() => Keyboard.dismiss()}
            showSoftInputOnFocus={false}
            onPressIn={() =>
              stepForm === StepForm.TRIP_DETAILS && setShowModal(MODAL.CALENDAR)
            }
            value={selectedDates.formatDatesInText}
          />
        </Input>

        {stepForm === StepForm.ADD_EMAIL && (
          <View>
            <View className="border-b py-3 border-zinc-800">
              <Button
                variant="secondary"
                onPress={() => setStepForm(StepForm.TRIP_DETAILS)}
              >
                <Button.Title>Alterar local/data</Button.Title>
                <Settings2 color={colors.zinc[200]} size={20} />
              </Button>
            </View>

            <Input>
              <UserRoundPlus color={colors.zinc[400]} />
              <Input.Field
                placeholder="Quem estará na viagem?"
                autoCorrect={false}
                value={
                  emailToInvites.length
                    ? `${emailToInvites.length} pessoas(a) convidadas(s)`
                    : ""
                }
                onPress={() => {
                  Keyboard.dismiss();
                  setShowModal(MODAL.GUESTS);
                }}
                showSoftInputOnFocus={false}
              />
            </Input>
          </View>
        )}

        <Button onPress={handleNextStepForm} isLoading={isCreatingTrip}>
          <Button.Title>
            {stepForm === StepForm.TRIP_DETAILS
              ? "Continuar"
              : "Confirmar Viagem"}
          </Button.Title>
          <ArrowRight color={colors.lime["950"]} size={20} />
        </Button>
      </View>

      <Text className="text-zinc-500 font-regular text-center text-base">
        Ao planehar sua viagem pelo plann.er, você automaticamente concorda com
        nossos{" "}
        <Text className="text-zinc-300 underline">
          termos de uso e politicas de privacidade.
        </Text>
      </Text>

      <SelectDateModal
        selectedDates={selectedDates}
        showModal={showModal}
        setShowModal={setShowModal}
        handleSelectDates={handleSelectDates}
      />

      <SelectParticipantsModal
        emailToInvites={emailToInvites}
        emailToInvite={emailToInvite}
        setEmailToInvite={setEmailToInvite}
        handleRemoveEmail={handleRemoveEmail}
        setShowModal={setShowModal}
        showModal={showModal}
        handleAddEmail={handleAddEmail}
      />
    </View>
  );
};

export default Home;
