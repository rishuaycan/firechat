import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Mensaje } from '../interface/mensaje.interface';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private itemsCollection!: AngularFirestoreCollection<Mensaje>;
  public chats: Mensaje[] = [];
  public usuario: any = {};
  constructor(private afs: AngularFirestore,
              public afuth: AngularFireAuth)
  {
  this.afuth.authState.subscribe(user => {
    console.log('Estado del usuario', user);
    if (!user) {
      return;
    }
    this.usuario.nombre = user.displayName;
    this.usuario.uid = user.uid;
  });
  }
  login(proveedor: string) {
    this.afuth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  logout() {
    this.usuario = {};
    this.afuth.signOut();
  }
  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', refs => refs.orderBy('fecha', 'desc').limit(5));
    return this.itemsCollection.valueChanges().subscribe((mensajes: Mensaje[]) => {
      console.log(mensajes);
      this.chats = [];
      for (const mensaje of mensajes) {
        this.chats.unshift(mensaje);
      }
    });
  }

  agregarMensaje(texto: string){
    const mensaje: Mensaje = {
      nombre: this.usuario.nombre,
      mensaje: texto,
      fecha: new Date().getTime(),
      uid:  this.usuario.uid
    };
    return this.itemsCollection.add(mensaje);
  }

}
