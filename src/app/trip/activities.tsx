import { Alert, Keyboard, SectionList, Text, View } from "react-native";
import { TripData } from "./[id]";
import {
  Activity,
  ActivityProps,
  Button,
  Calendar,
  Input,
  Loading,
  Modal,
} from "@/presentation/components";
import {
  PlusIcon,
  Tag,
  Calendar as IconCalendar,
  Clock,
} from "lucide-react-native";
import { colors } from "@/presentation/styles";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { container } from "tsyringe";
import { RemoteActivities } from "@/domain";
import { AxiosHttpClient } from "@/infra/axios-http-client";
import { ActivitiesAdapter } from "@/data/adapter/activities.adapter";

interface TripActivitiesProps {
  tripDetails: TripData;
}

enum MODAL {
  NONE = 0,
  CALENDAR = 1,
  NEW_ACTIVITY = 2,
}

type TripActivity = {
  title: {
    dayNumber: number;
    dayName: string;
  };
  data: ActivityProps[];
};

export const TripActivities = ({ tripDetails }: TripActivitiesProps) => {
  const [showModal, setShowModal] = useState(MODAL.NONE);
  const [activityTitle, setActivityTitle] = useState("");
  const [activityDate, setActivityDate] = useState("");
  const [activityHour, setActivityHour] = useState("");
  const [isCreatingActivity, setIsCreatingActivity] = useState(false);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [tripActivities, setTripActivities] = useState<TripActivity[]>([]);

  const resetNewActivityFields = () => {
    setActivityTitle("");
    setActivityDate("");
    setActivityHour("");
    setShowModal(MODAL.NONE);
  };

  const remoteActivities = new RemoteActivities(
    new ActivitiesAdapter(new AxiosHttpClient())
  );

  const handleCreateActivity = async () => {
    try {
      if (!activityTitle.trim().length || !activityDate || !activityHour) {
        return Alert.alert(
          "Cadastrar atividade",
          "Preencha todos os campos para criar uma nova atividade."
        );
      }

      setIsCreatingActivity(true);

      await remoteActivities.create({
        tripId: tripDetails.id,
        occurs_at: dayjs(activityDate)
          .add(Number(activityHour), "h")
          .toString(),
        title: activityTitle,
      });

      Alert.alert("Atividade criada", "Atividade criada com sucesso!");

      await getTripActivies();

      resetNewActivityFields();
    } catch (error) {
      throw error;
    } finally {
      setIsCreatingActivity(false);
    }
  };

  const getTripActivies = async () => {
    try {
      const { activities } = await remoteActivities.getActivitiesByTripId(
        tripDetails.id
      );

      const activitiesToSectionList = activities?.map((dayActivity) => ({
        title: {
          dayNumber: dayjs(dayActivity.date).date(),
          dayName: dayjs(dayActivity.date).format("dddd").replace("-feira", ""),
        },
        data: dayActivity?.activities?.map((activity) => ({
          id: activity.id,
          title: activity.title,
          hour: dayjs(activity.occurs_at).format("hh[:]mm[h]"),
          isBefore: dayjs(activity.occurs_at).isBefore(dayjs()),
        })),
      }));

      setTripActivities(activitiesToSectionList);
    } catch (error) {
      console.log(error);

      throw error;
    } finally {
      setIsLoadingActivities(false);
    }
  };

  useEffect(() => {
    getTripActivies();
  }, []);

  return (
    <View className="flex-1">
      <View className="w-full flex-row mt-5 mb-6 items-center">
        <Text className="text-zinc-50 text-2xl font-semibold flex-1">
          Atividades
        </Text>

        <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
          <PlusIcon color={colors.lime[950]} />
          <Button.Title>Nova Atividade</Button.Title>
        </Button>
      </View>

      {isLoadingActivities ? (
        <Loading />
      ) : (
        <SectionList
          sections={tripActivities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Activity data={item} />}
          renderSectionHeader={({ section }) => (
            <View className="w-full">
              <Text className="text-zinc-50 text-2xl font-semibold py-2">
                Dia {section.title.dayNumber + " "}
                <Text className="text-zinc-500 text-base font-regular capitalize">
                  {section.title.dayName}
                </Text>
              </Text>
              {section.data.length === 0 && (
                <Text className="text-zinc-500 font-regular text-sm mb-8">
                  Nenhuma atividade cadastrada
                </Text>
              )}
            </View>
          )}
          contentContainerClassName="gap-3 pb-48"
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal
        title="Cadastrar atividades"
        subtitle="Todos os convidados podem visulizar as atividades"
        visible={showModal === MODAL.NEW_ACTIVITY}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="mt-4 mb-3">
          <Input variant="secondary">
            <Tag color={colors.zinc[400]} size={20} />

            <Input.Field
              placeholder="Qual atividade?"
              onChangeText={setActivityTitle}
              value={activityTitle}
            />
          </Input>

          <View className="w-full mt-2 flex-row gap-2">
            <Input variant="secondary" className="flex-1">
              <IconCalendar color={colors.zinc[400]} size={20} />

              <Input.Field
                placeholder="Data"
                onChangeText={(text) =>
                  setActivityDate(text.replace(/[^0-9]/g, ""))
                }
                value={
                  activityDate ? dayjs(activityDate).format("DD [de] MMMM") : ""
                }
                onFocus={() => Keyboard.dismiss()}
                showSoftInputOnFocus={false}
                onPressIn={() => setShowModal(MODAL.CALENDAR)}
              />
            </Input>

            <Input variant="secondary" className="flex-1">
              <Clock color={colors.zinc[400]} size={20} />

              <Input.Field
                placeholder="Horário?"
                onChangeText={(text) =>
                  setActivityHour(text.replace(/[^0-9]/g, ""))
                }
                value={activityHour}
                keyboardType="numeric"
                maxLength={2}
              />
            </Input>
          </View>
        </View>

        <Button
          onPress={handleCreateActivity}
          isLoading={isCreatingActivity}
          disabled={isCreatingActivity}
        >
          <Button.Title>Salvar atividade</Button.Title>
        </Button>
      </Modal>

      <Modal
        title="Selecionar data"
        subtitle="Selecione a data da atividade"
        visible={showModal === MODAL.CALENDAR}
        onClose={() => setShowModal(MODAL.NONE)}
      >
        <View className="gap-4 mt-4">
          <Calendar
            onDayPress={(day) => {
              setActivityDate(day.dateString);
            }}
            markedDates={{
              [activityDate]: {
                selected: true,
              },
            }}
            initialDate={tripDetails.starts_at.toString()}
            minDate={tripDetails.starts_at.toString()}
            maxDate={tripDetails.ends_at.toString()}
          />

          <Button onPress={() => setShowModal(MODAL.NEW_ACTIVITY)}>
            <Button.Title>Confirmar</Button.Title>
          </Button>
        </View>
      </Modal>
    </View>
  );
};
