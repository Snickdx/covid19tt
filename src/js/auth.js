export class AuthManager{

    constructor(auth, firebaseui, authService){


        this.auth = auth;
        this.ui = new firebaseui.auth.AuthUI(auth);
        this.authService = authService;

        //setup how the app changes when user logs in/out
        this.auth.onAuthStateChanged(function(user) {

            const addFab = document.querySelector('#addFab');
            const loginBtn = document.querySelector('#loginBtn');
            const logoutBtn = document.querySelector('#logoutBtn');
            const deleteBtns = document.querySelectorAll('.deleteBtn');

            const authMap = [
                {addFab: "none", loginBtn:"block", logoutBtn:"none", deleteBtns:"none"},//not logged in
                {addFab: "block", loginBtn:"none", logoutBtn:"block", deleteBtns:"block"},//logged in
            ];

            const index = user === null ? 0 : 1;// 0 - logged in | 1 - not logged in
            addFab.style.display = authMap[index].addFab;
            loginBtn.style.display = authMap[index].loginBtn;
            logoutBtn.style.display = authMap[index].logoutBtn;
            deleteBtns.forEach( btn => btn.style.display = authMap[index].deleteBtns);

        });

    }

    login(){ 
        return new Promise((resolve, reject)=>{
            const id = this.authService.GoogleAuthProvider.PROVIDER_ID;
            this.ui.start(
                '#authContainer', 
                {
                callbacks: {
                    signInSuccessWithAuthResult: resolve
                },
                signInFlow: 'popup',
                signInSuccessUrl: '#',
                signInOptions: [ id ],
                tosUrl: 'https://covid19tt.web.app',
                privacyPolicyUrl: 'https://covid19tt.web.app'
                }
            );
        });
    }

    async logout(auth, cb){
        await this.auth.signOut();
        cb('Logged Out!');
    }

    getUser(){

        return new Promise((resolve, reject)=>{
            try{
                firebase.auth().onAuthStateChanged(resolve);
            }catch(e){
                reject(e)
            }
        });
    }

}