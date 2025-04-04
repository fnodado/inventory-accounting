// Delete the previous file and create a simpler one
declare module "@react-native-firebase/app" {
    const firebase: any
    export default firebase
  }
  
  declare module "@react-native-firebase/auth" {
    const auth: () => any
    export default auth
  }
  
  declare module "@react-native-firebase/firestore" {
    const firestore: () => any
    export default firestore
  }
  
  