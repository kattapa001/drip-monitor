var prev=0;

const FIREBASE_AUTH = firebase.auth();
const FIREBASE_MESSAGING = firebase.messaging();
const FIREBASE_DATABASE = firebase.database();
const signInButton = document.getElementById('sign-in');
const signOutButton = document.getElementById('sign-out');
const subscribeButton = document.getElementById('subscribe');
const unsubscribeButton = document.getElementById('unsubscribe');


/* ========================
  Event Listeners
======================== */

FIREBASE_AUTH.onAuthStateChanged(handleAuthStateChanged);
FIREBASE_MESSAGING.onTokenRefresh(handleTokenRefresh);

signInButton.addEventListener("click", signIn);
signOutButton.addEventListener("click", signOut);
//subscribeButton.addEventListener("click", subscribeToNotifications);
//unsubscribeButton.addEventListener("click", unsubscribeFromNotifications);



/* ========================
  Functions
======================== */

function handleAuthStateChanged(user) {
        if (user) {
          // User is signed in
          console.log(user);
          signInButton.setAttribute("hidden", "true");
          signOutButton.removeAttribute("hidden");
          
          //checkSubscription();
          
        } else {
          // User is not signed in
          console.log("user is not signed in");
          signOutButton.setAttribute("hidden", "true");
          signInButton.removeAttribute("hidden");
          
        }
      }
      
      function signIn() {
        FIREBASE_AUTH.signInWithPopup(new firebase.auth.GoogleAuthProvider());
      }
      
      function signOut() {
        FIREBASE_AUTH.signOut();
      }
      
      function handleTokenRefresh() {
        return FIREBASE_MESSAGING.getToken({vapidKey:"BEGzyVrLbyQScsYmG0qs92pF34BFHlvdX0ehiejhI1fVb0hzISk2NJ60ZGwik8OTcaFHVcTbx_KISVwzVsghsvk"}).then((currentToken) => {
          FIREBASE_DATABASE.ref('/tokens').push({
            token: currentToken,
            uid: FIREBASE_AUTH.currentUser.uid
          });
        });
      }
      
      function checkSubscription() {
        FIREBASE_DATABASE.ref('/tokens').orderByChild("uid").equalTo(FIREBASE_AUTH.currentUser.uid).once('value').then((snapshot) => {
          if ( snapshot.val() ) {
            subscribeButton.setAttribute("hidden", "true");
            unsubscribeButton.removeAttribute("hidden");
          } else {
            unsubscribeButton.setAttribute("hidden", "true");
            subscribeButton.removeAttribute("hidden");
          }
        });
      }
      
     /* function subscribeToNotifications() {
        FIREBASE_MESSAGING.requestPermission()
          .then(() => handleTokenRefresh())
          .then(() => checkSubscription())
          .catch(() => {
          console.log("error getting permission :(");
        });
          
      }
      
      function unsubscribeFromNotifications() {
        FIREBASE_MESSAGING.getToken()
          .then((token) => FIREBASE_MESSAGING.deleteToken(token))
          .then(() => FIREBASE_DATABASE.ref('/tokens').orderByChild("uid").equalTo(FIREBASE_AUTH.currentUser.uid).once('value'))
          .then((snapshot) => {
            const key = Object.keys(snapshot.val())[0];
            return FIREBASE_DATABASE.ref('/tokens').child(key).remove();
          })
          .then(() => checkSubscription())
          .catch((err) => {
            console.log("error deleting token :(");
          });
      } */

            
      FIREBASE_DATABASE.ref().on('value', function(snapshot){
        
        fireWeight=document.getElementById("fireWeight").value = snapshot.val().WeightInGrams;
        fireInit=document.getElementById("fireInit").value = snapshot.val().InitialWeight;

        pcnt=document.getElementById("pcnt").value= Number.parseInt((fireWeight/fireInit)*100);
        
        if((pcnt<30)&&(pcnt>15)){
          FIREBASE_DATABASE.ref('/notifications')
          .set({
            message: "Warning: Level below 30%"});
          window.alert("Warning: Level below 30%");  
          }
          
        if(pcnt<=15){
          FIREBASE_DATABASE.ref('/notifications')
          .set({
            message: "Critical level reached...flow stopped" });
          window.alert("Critical level reached...flow stopped");
          }
      });

