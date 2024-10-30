import { addDoc, collection, doc, getDocs, onSnapshot, query, Timestamp, updateDoc, where } from 'firebase/firestore';
import { FirebaseDB } from './config';

export class CheckInService {
	constructor(firebaseDB) {
		this.experienceId = 'Fjkyw8lfUy';
		this.participationCollection = collection(firebaseDB, `event/colombia4.0/attendees`);
		this.experiences = [
			{ id: 'i0own9qlUQ', name: 'FILTROS INTERACTIVOS R.A.' },
			{ id: 'KbCLd9hZ3r', name: 'IA MUSIC MAKER' },
			{ id: 'cyhH5yUGs5', name: 'IMAGINARY AI' },
			{ id: 'HI0qLLtutT', name: 'SKECTCH AI' },
			{ id: 'Fjkyw8lfUy', name: 'VIDEO AI MAKER' },
			{ id: 'jZ8JxL0Vue', name: 'ENGLISH INTERVIEWER AI' },
		];
		this.firebaseDB = firebaseDB;
	}

	setExperienceId(experienceId) {
		if (this.experiences.some((experience) => experience.id === experienceId)) {
			localStorage.setItem('experienceID', experienceId);
			this.experienceId = experienceId;
		}
	}

	getExperienceId() {
		return this.experienceId;
	}

	async getUserParticipation({ email }) {
		const q = query(this.participationCollection, where('email', '==', email), where('experienceId', '==', this.experienceId));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			const participation = {
				id: querySnapshot.docs[0].id,
				...querySnapshot.docs[0].data(),
			};
			return participation;
		} else {
			return null;
		}
	}

	async saveUserParticipation({ names, email, points, newParticipation = false }) {
		const now = new Date();
		const checkInAt = Timestamp.fromDate(now);
		const updateAt = Timestamp.fromDate(now);
		const previousParticipation = await this.getUserParticipation({ email });

		if (previousParticipation) {
			const docId = previousParticipation.id;
			const userExperienceRef = doc(this.firebaseDB, `event/colombia4.0/attendees`, docId);
			const newPoints = points === undefined ? previousParticipation.points : points;
			const newParticipationDateList = [...previousParticipation.participationDateList];

			if (newParticipation) {
				newParticipationDateList.push(checkInAt);
			}

			await updateDoc(userExperienceRef, { points: newPoints, updateAt, participationDateList: newParticipationDateList });
			return docId;
		} else {
			const experience = this.getExperienceById({ experienceId: this.experienceId });
			if (!experience) return console.error('la experiencia no está registrada');

			const newDoc = {
				participationDateList: [checkInAt],
				checkInAt,
				experienceId: this.experienceId,
				experienceName: experience.name,
				points: points === undefined ? 0 : points,
				email,
				names,
				updateAt,
			};

			const newDocRef = await addDoc(this.participationCollection, newDoc);
			return newDocRef.id;
		}
	}

	async getAttendeeByEmail({ email }) {
		const q = query(this.participationCollection, where('email', '==', email));
		const querySnapshot = await getDocs(q);

		if (!querySnapshot.empty) {
			if (querySnapshot.docs.length > 1) throw new Error('email asignado a dos usuarios');

			const docId = querySnapshot.docs[0].id;
			const data = querySnapshot.docs[0].data();
			const attendee = {
				id: docId,
				...data,
			};
			return attendee;
		}
		return null;
	}

	async getUsersParticipation() {
		const querySnapshot = await getDocs(this.participationCollection);

		if (!querySnapshot.empty) {
			const usersParticipation = querySnapshot.docs.map((doc) => ({
				id: doc.id,
				...doc.data(),
			}));
			return usersParticipation;
		} else {
			return [];
		}
	}

	listeningUsersParticipation(onSetUsersParticipants) {
		return onSnapshot(
			this.participationCollection,
			(querySnapshot) => {
				if (!querySnapshot.empty) {
					const usersParticipation = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					onSetUsersParticipants(usersParticipation);
				} else {
					onSetUsersParticipants([]);
					console.log('No hay participaciones');
				}
			},
			(error) => {
				console.error('Error al escuchar cambios en la participación:', error);
			}
		);
	}

	listeningParticipationByUser({ onSetUsersParticipants, email }) {
		const filteredQuery = query(this.participationCollection, where('email', '==', email));

		return onSnapshot(
			filteredQuery,
			(querySnapshot) => {
				if (!querySnapshot.empty) {
					const usersParticipation = querySnapshot.docs.map((doc) => ({
						id: doc.id,
						...doc.data(),
					}));
					onSetUsersParticipants(usersParticipation);
					console.log('Participaciones actualizadas:', usersParticipation);
				} else {
					console.log('No hay participaciones');
					onSetUsersParticipants([]);
				}
			},
			(error) => {
				console.error('Error al escuchar cambios en la participación:', error);
			}
		);
	}

	async getAllAttendee() {
		const snapshot = await getDocs(this.participationCollection);
		const attendees = [];
		snapshot.forEach((doc) => {
			const attendee = {
				id: doc.id,
				...doc.data(),
			};
			attendees.push(attendee);
		});
		return attendees;
	}

	getAllExperience() {
		return this.experiences;
	}

	getExperienceById({ experienceId }) {
		return this.experiences.find((experience) => experience.id === experienceId);
	}
}

export const checkInService = new CheckInService(FirebaseDB);
