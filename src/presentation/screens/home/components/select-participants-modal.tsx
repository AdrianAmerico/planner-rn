import { Button, GuestEmail, Input, Modal } from "@/presentation/components";
import { AtSign, View } from "lucide-react-native";
import { MODAL } from "../constants";
import { Text } from "react-native";
import { colors } from "@/presentation/styles";

interface SelectParticipantsModalProps {
  showModal: number;
  setShowModal: (value: number) => void;
  emailToInvites: string[];
  emailToInvite: string;
  setEmailToInvite: (value: string) => void;
  handleRemoveEmail: (email: string) => void;
  handleAddEmail: () => void;
}

export const SelectParticipantsModal = ({
  emailToInvite,
  emailToInvites,
  setEmailToInvite,
  handleRemoveEmail,
  setShowModal,
  showModal,
  handleAddEmail,
}: SelectParticipantsModalProps) => {
  return (
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
            onChangeText={(text) => setEmailToInvite(text.toLocaleLowerCase())}
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
  );
};
