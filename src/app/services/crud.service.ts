import { Injectable } from '@angular/core';
import { addDoc, getDoc, getDocs, updateDoc, deleteDoc, Firestore, collection, CollectionReference, doc } from '@angular/fire/firestore';
import { Profissional } from '../profissional';

@Injectable({ providedIn: 'root' })
export class CrudService {

  constructor(private firestore: Firestore) { }

  profisionalsCollection = collection(this.firestore, 'profisionals') as CollectionReference<Profissional>

  createData = async (profissional: Profissional) => {
    const doc = await addDoc(this.profisionalsCollection, profissional);
    return doc;
  }

  async getAllDatas(): Promise<Profissional[]> {
    const querySnapshot = await getDocs(this.profisionalsCollection);
    const profissionais: Profissional[] = [];
    querySnapshot.forEach((doc) => {
      let profissional: Profissional;
      profissional = doc.data()
      profissional.id = doc.id;
      profissionais.push(profissional);
    });
    return profissionais;
  }

  async getData(id: string): Promise<Profissional | null> {
    const docRef = doc(this.firestore, 'profisionals', id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as Profissional;
    } else {
      return null;
    }
  }

  async updateData(profissional: Profissional, id: string): Promise<void> {
    const docRef = doc(this.firestore, 'profisionals', id);
    await updateDoc(docRef, { ...profissional });
  }

  async deleteData(id: string): Promise<void> {
    const docRef = doc(this.firestore, 'profisionals', id);
    await deleteDoc(docRef);
  }

}
