import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection!: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  
  constructor(private afs: AngularFirestore) {}
  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats');
    return this.itemsCollection.valueChanges().subscribe((mensajes:Mensaje[])=>{
      console.log(mensajes);
      this.chats = mensajes;
    })
  }

  agregarMensaje(texto: string){
    let mensaje: Mensaje = {
      nombre: 'Rosario Aspajo',
      mensaje: texto,
      fecha: new Date().getTime()
    }
    return this.itemsCollection.add(mensaje);
  }

}
