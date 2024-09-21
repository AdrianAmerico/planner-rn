import { Alert, Text, View, FlatList } from "react-native";
import { useEffect, useState } from "react";
import {
  Button,
  Input,
  Modal,
  Participant,
  ParticipantProps,
  TripLink,
  TripLinkProps,
} from "@/presentation/components";
import { LinksAdapter } from "@/data/adapter/links.adapter";
import { RemoteLinks } from "@/domain/links";
import { AxiosHttpClient } from "@/infra/axios-http-client";
import { colors } from "@/presentation/styles";
import { validateInput } from "@/utils";
import { Plus } from "lucide-react-native";
import { RemoteParticipants } from "@/domain/participants/participants";
import { ParticipantsAdapter } from "@/data/adapter/participants.adapter";
import { Form } from "@/presentation/components/form";

interface TripActivitiesProps {
  tripId: string;
}

export const TripDetailsTab = ({ tripId }: TripActivitiesProps) => {
  const [showNewLinkModal, setShowNewLinkModal] = useState(false);
  const [linkTitle, setLinkTitle] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isCreatingLinkTrip, setIsCreatingLinkTrip] = useState(false);
  const [links, setLinks] = useState<TripLinkProps[]>([]);
  const [participants, setParticipants] = useState<ParticipantProps[]>([]);

  const linksServer = new RemoteLinks(new LinksAdapter(new AxiosHttpClient()));
  const participantsServer = new RemoteParticipants(
    new ParticipantsAdapter(new AxiosHttpClient())
  );

  const resetNewLinkFields = () => {
    setLinkTitle("");
    setLinkUrl("");
    setShowNewLinkModal(false);
  };

  const getTripLinks = async () => {
    try {
      const links = await linksServer.getLinksByTripId(tripId);

      setLinks(links);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  const handleCreateTripLink = async () => {
    try {
      if (!linkTitle.trim()) {
        return Alert.alert(
          "Nome do link inválido",
          "Insira um nome para o link"
        );
      }

      if (!validateInput.url(linkUrl.trim())) {
        return Alert.alert("URL inválida", "Insira uma URL válida");
      }

      setIsCreatingLinkTrip(true);

      await linksServer.create({
        tripId,
        title: linkTitle,
        url: linkUrl,
      });

      Alert.alert("Link", "Link cadastrado com sucesso");
      resetNewLinkFields();
      await getTripLinks();
    } catch (error) {
      console.error(error);
    } finally {
      setIsCreatingLinkTrip(false);
    }
  };

  const getTripParticipants = async () => {
    try {
      const participants = await participantsServer.getByTripId(tripId);

      setParticipants(participants);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getTripLinks();
    getTripParticipants();
  }, []);

  return (
    <View className="flex-1 mt-10">
      <Text className="text-zinc-50 text-2xl font-semibold mb-2">
        Links importantes
      </Text>

      <View className="flex-1">
        {!!links.length ? (
          <FlatList
            data={links}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TripLink data={item} />}
            contentContainerClassName="gap-4"
          />
        ) : (
          <Text className="text-zinc-400 font-regular text-base mt-2 mb-6">
            Nenhum link cadastrado
          </Text>
        )}

        <Button variant="secondary" onPress={() => setShowNewLinkModal(true)}>
          <Plus color={colors.zinc[200]} size={20} />

          <Button.Title>Cadastrar novo link</Button.Title>
        </Button>
      </View>

      <View className="flex-1 border-t border-zinc-800 mt-6">
        <Text className="text-zinc- 50 text-2xl font-semibold my-2">
          Convidados
        </Text>

        <FlatList
          data={participants}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <Participant data={item} />}
          contentContainerClassName="gap-4 pb-44"
        />
      </View>

      <Modal
        title="Cadastrar link"
        subtitle="Todos os convidados podem visualizar os links importantes"
        visible={showNewLinkModal}
        onClose={() => setShowNewLinkModal(false)}
      >
        <Form className="gap-2 mb-3">
          <Input variant="secondary">
            <Input.Field
            name="linkTitle"
              placeholder="Titulo do link"
              onChangeText={setLinkTitle}
              value={linkTitle}
            />
          </Input>

          <Input variant="secondary">
            <Input.Field
            name="linkUrl"
              placeholder="URL"
              onChangeText={setLinkUrl}
              value={linkUrl}
            />
          </Input>

          <Button onPress={handleCreateTripLink} isLoading={isCreatingLinkTrip}>
            <Button.Title>Salvar link</Button.Title>
          </Button>
        </Form>
      </Modal>
    </View>
  );
};
