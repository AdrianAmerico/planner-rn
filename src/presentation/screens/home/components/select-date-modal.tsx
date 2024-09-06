import { Button, Calendar, Modal } from "@/presentation/components";
import { View } from "lucide-react-native";
import { MODAL } from "../constants";
import { DateData } from "react-native-calendars";
import dayjs from "dayjs";
import { DatesSelected } from "@/utils";

interface SelectDateModalProps {
  showModal: number;
  setShowModal: (value: number) => void;
  selectedDates: DatesSelected;
  handleSelectDates: (date: DateData) => void;
}

export const SelectDateModal = ({
  selectedDates,
  setShowModal,
  showModal,
  handleSelectDates,
}: SelectDateModalProps) => {
  return (
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
  );
};
