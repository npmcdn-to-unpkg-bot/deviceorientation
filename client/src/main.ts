import * as firebase from 'firebase';

class App{
  convertion: number = 255/360;
  uid:string = localStorage.getItem('uid') || null;

  firebase_config: any = {
    apiKey: '<YOUR API KEY>',
    authDomain: '<YOUR AUTH DOMAIN>',
    databaseURL: '<YOUR DATABASE URL>'
  };

  constructor(){
    if( (<any>window).DeviceOrientationEvent) {
      firebase.initializeApp(this.firebase_config);

      if( !this.uid ) {
        let provider = new firebase.auth.GoogleAuthProvider();
        provider.addScope('https://www.googleapis.com/auth/plus.login');

        firebase.auth().signInWithPopup(provider).then((result) => {
          localStorage.setItem('uid', result.user.uid);
          this.uid = result.user.uid;
        });
      }

      window.addEventListener('deviceorientation', (event) => {
        let r = this.gToc(event.alpha),
            g = this.gToc(event.beta),
            b = this.gToc(event.gamma),
            m = new Date().getTime();

        firebase.database().ref(`users/${this.uid}`).set({r,g,b,m});
        document.getElementsByTagName('body')[0].style.backgroundColor = `rgb(${r},${g},${b})`;
      }, false);

      firebase.database().ref(`users/${this.uid}`).onDisconnect().remove();
    }
    setTimeout( function(){ document.getElementById('instructions').remove() } , 10000);
  }

  gToc(g:number){
    return Math.round( (g>0?g:(360+g))*this.convertion );
  }
}
new App();