import { useEffect, useState } from "react";
import { View, Text, Image, Keyboard, Alert } from "react-native";
import {
  Input,
  Button,
  Modal,
  Calendar,
  GuestEmail,
  Loading,
} from "@/presentation/components";
import {
  MapPin,
  Calendar as IconCalendar,
  Settings2,
  UserRoundPlus,
  ArrowRight,
  AtSign,
} from "lucide-react-native";
import { colors } from "@/styles";
import { calendarUtils, DatesSelected, validateInput } from "@/utils";
import { DateData } from "react-native-calendars";
import dayjs from "dayjs";
import { tripStorage } from "@/storage/trip";
import { router } from "expo-router";
import { RemoteTrip } from "@/domain/trip/trip";
import { TripAdapter } from "@/data/adapter/trip.adapter";
import { AxiosHttpClient } from "@/infra/axios-http-client";

enum StepForm {
  TRIP_DETAILS = 1,
  ADD_EMAIL = 2,
}

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  GUESTS = 2,
}

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

      router.navigate("/trip/" + tripId);
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
        router.navigate("/trip/" + trip.id);
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

          <Button onPress={() => setShowModal(MODAL.NONE)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>

      <Modal
        title="Selecionar convidados"
        subtitle="Os convidados irão receber e-mails para confirmar a participação na viagem."
        visible={showModal === MODAL.GUESTS}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="my-2 flex-wrap gap-2 border-b border-zinc-800 py-5 items-start">
          {!!emailToInvites.length ? (
            emailToInvites.map((email) => (
              <GuestEmail
                key={email}
                email={email}
                onRemove={() => handleRemoveEmail(email)}
              />
            ))
          ) : (
            <Text className="text-zinc-600 text-base font-regular">
              Nenhum e-mail adicionado.
            </Text>
          )}
        </View>

        <View className="gap-4 mt-4">
          <Input variant="secondary">
            <AtSign color={colors.zinc[400]} size={20} />

            <Input.Field
              placeholder="Digite o email do convidado"
              onChangeText={(text) =>
                setEmailToInvite(text.toLocaleLowerCase())
              }
              value={emailToInvite}
              keyboardType="email-address"
              returnKeyType="send"
              onSubmitEditing={handleAddEmail}
            />
          </Input>

          <Button onPress={handleAddEmail}>
            <Button.Title>Convidar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
};

export default Home;
