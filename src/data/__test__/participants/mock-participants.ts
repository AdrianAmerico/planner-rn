import {
  Participant,
  ParticipantConfirm,
  ConfirmParticipantByIdParams,
} from "@/data/participants";
import { faker } from "@faker-js/faker";

export const makeParticipant = (props?: Partial<Participant>): Participant => {
  return {
    id: faker.string.uuid(),
    name: faker.person.firstName(),
    email: faker.internet.email(),
    is_confirmed: false,
    ...props,
  };
};

export const makeParticipantConfirm = (
  props?: Partial<ParticipantConfirm>
): ParticipantConfirm => {
  return {
    participantId: faker.string.uuid(),
    name: faker.person.firstName(),
    email: faker.internet.email(),
    ...props,
  };
};

export const makeConfirmParticipantByIdParams = (
  props?: Partial<ConfirmParticipantByIdParams>
): ConfirmParticipantByIdParams => {
  return {
    participantId: faker.string.uuid(),
    name: faker.person.firstName(),
    email: faker.internet.email(),
    ...props,
  };
};
