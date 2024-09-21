import { Button, Calendar, Modal } from "@/presentation/components";
import { MODAL } from "../constants";
import dayjs from "dayjs";
import { View } from "react-native";

interface SelectDateModalProps {
  showModal: number;
  setShowModal: (modal: number) => void;
}

export const SelectDateModal = ({
  setShowModal,
  showModal,
}: SelectDateModalProps) => {
  return (
    <Modal
      title="Selecionar datas"
      subtitle="Selecione a data de ida e volta nda viagem"
      onClose={() => setShowModal(MODAL.NONE)}
      visible={showModal === MODAL.CALENDAR}
    >
      <View className="gap-4 mt-4">
        <Calendar name="selectedDates" minDate={dayjs().toISOString()} />

        <Button onPress={() => setShowModal(MODAL.NONE)}>
          <Button.Title>Confirmar</Button.Title>
        </Button>
      </View>
    </Modal>
  );
};
